"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";
import { MAP_BOUNDS } from "@/data/mapMarkers";
import { BUILDINGS, PLATFORMS } from "@/data/buildings";

const SPEED = 8;
const GRAVITY = -24;
const JUMP_VELOCITY = 8.5;
const PLAYER_RADIUS = 0.4;

const keys = new Set<string>();
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    keys.add(e.code);
    if (e.code === "Space") e.preventDefault();
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
}

/** Free-look camera: drag to orbit, wheel to zoom, independent of movement direction. */
function useOrbitCamera() {
  const yaw = useRef(Math.PI); // start behind the player, facing them
  const pitch = useRef(0.55);
  const radius = useRef(11);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = document.body;
    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { dragging.current = false; };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.006;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.004, 0.15, 1.3);
    };
    const onWheel = (e: WheelEvent) => {
      radius.current = THREE.MathUtils.clamp(radius.current + e.deltaY * 0.01, 5, 22);
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  return { yaw, pitch, radius };
}

/** Clips the uploaded photo into a rounded "face plate" so it reads as a head, not a sticker. */
function useFaceTexture(photoDataUrl?: string) {
  const ref = useRef<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    if (!photoDataUrl) {
      ref.current = null;
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(size / 2, size / 2, size / 2, (size / 2) * 1.08, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      ref.current = tex;
    };
    img.src = photoDataUrl;
    return () => { cancelled = true; };
  }, [photoDataUrl]);
  return ref;
}

/** Resolves circle-vs-box overlap by pushing the position out along the shallowest axis. */
function resolveBuildingCollisions(x: number, z: number): { x: number; z: number } {
  let px = x;
  let pz = z;
  for (const b of BUILDINGS) {
    const halfX = b.size[0] / 2 + PLAYER_RADIUS;
    const halfZ = b.size[2] / 2 + PLAYER_RADIUS;
    const [bx, , bz] = b.position;
    const dx = px - bx;
    const dz = pz - bz;
    if (Math.abs(dx) < halfX && Math.abs(dz) < halfZ) {
      const overlapX = halfX - Math.abs(dx);
      const overlapZ = halfZ - Math.abs(dz);
      if (overlapX < overlapZ) {
        px = bx + Math.sign(dx || 1) * halfX;
      } else {
        pz = bz + Math.sign(dz || 1) * halfZ;
      }
    }
  }
  return { x: px, z: pz };
}

function groundHeightAt(x: number, z: number): number {
  for (const p of PLATFORMS) {
    const [pxp, , pzp] = p.position;
    if (Math.abs(x - pxp) < p.size[0] / 2 && Math.abs(z - pzp) < p.size[2] / 2) {
      return p.height;
    }
  }
  return 0;
}

export default function PlayerController() {
  const player = useGameStore((s) => s.player);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerRotation = useGameStore((s) => s.setPlayerRotation);
  const group = useRef<THREE.Group>(null);
  const bodyPivot = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const direction = useRef(new THREE.Vector3());
  const gaitClock = useRef(0);
  const posUpdateCounter = useRef(0);
  const verticalVelocity = useRef(0);
  const grounded = useRef(true);

  const { yaw, pitch, radius } = useOrbitCamera();
  const faceTexRef = useFaceTexture(player?.photoDataUrl);

  const roleColor =
    player?.role === "police" ? "#33495a" : player?.role === "forensic" ? "#2f6b5e" : "#c9a227";

  useFrame((_, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);

    direction.current.set(0, 0, 0);
    if (keys.has("KeyW") || keys.has("ArrowUp")) direction.current.z -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) direction.current.z += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) direction.current.x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) direction.current.x += 1;
    const moving = direction.current.length() > 0;

    if (moving) {
      direction.current.normalize();
      // Move relative to camera yaw so controls stay intuitive while orbiting
      const camYaw = yaw.current;
      const moveX = direction.current.x * Math.cos(camYaw) - direction.current.z * Math.sin(camYaw);
      const moveZ = direction.current.x * Math.sin(camYaw) + direction.current.z * Math.cos(camYaw);
      const targetAngle = Math.atan2(moveX, moveZ);
      if (bodyPivot.current) {
        bodyPivot.current.rotation.y = THREE.MathUtils.lerp(
          bodyPivot.current.rotation.y,
          targetAngle,
          10 * dt
        );
        setPlayerRotation(bodyPivot.current.rotation.y);
      }
      gaitClock.current += dt * 9;

      const nextX = group.current.position.x + moveX * SPEED * dt;
      const nextZ = group.current.position.z + moveZ * SPEED * dt;
      const resolved = resolveBuildingCollisions(nextX, nextZ);
      group.current.position.x = THREE.MathUtils.clamp(resolved.x, -MAP_BOUNDS, MAP_BOUNDS);
      group.current.position.z = THREE.MathUtils.clamp(resolved.z, -MAP_BOUNDS, MAP_BOUNDS);
    }

    // Jump / gravity
    if (keys.has("Space") && grounded.current) {
      verticalVelocity.current = JUMP_VELOCITY;
      grounded.current = false;
    }
    verticalVelocity.current += GRAVITY * dt;
    const targetGround = groundHeightAt(group.current.position.x, group.current.position.z);
    let newY = group.current.position.y + verticalVelocity.current * dt;
    if (newY <= targetGround) {
      newY = targetGround;
      verticalVelocity.current = 0;
      grounded.current = true;
    }
    group.current.position.y = newY;

    // Walk-cycle limb swing (only meaningful while grounded & moving)
    const swing = moving && grounded.current ? Math.sin(gaitClock.current) * 0.55 : 0;
    if (leftArm.current) leftArm.current.rotation.x = swing;
    if (rightArm.current) rightArm.current.rotation.x = -swing;
    if (leftLeg.current) leftLeg.current.rotation.x = -swing;
    if (rightLeg.current) rightLeg.current.rotation.x = swing;
    if (bodyPivot.current) {
      bodyPivot.current.position.y = moving && grounded.current ? Math.abs(Math.sin(gaitClock.current * 2)) * 0.06 : 0;
    }

    posUpdateCounter.current += 1;
    if (posUpdateCounter.current % 4 === 0) {
      setPlayerPosition(group.current.position.x, group.current.position.z);
    }

    // Free-look orbit camera, decoupled from movement direction
    const target = group.current.position;
    const horizR = radius.current * Math.cos(pitch.current);
    const camX = target.x + horizR * Math.sin(yaw.current);
    const camZ = target.z + horizR * Math.cos(yaw.current);
    const camY = target.y + 1.6 + radius.current * Math.sin(pitch.current);
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 10 * dt);
    camera.lookAt(target.x, target.y + 1.4, target.z);
  });

  return (
    <group ref={group} position={[0, 0, 4]}>
      <group ref={bodyPivot}>
        {/* Torso */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.36, 0.75, 4, 8]} />
          <meshStandardMaterial color={roleColor} />
        </mesh>

        {/* Head — skin-toned 3D base with the uploaded photo mapped onto the face */}
        <group position={[0, 2.05, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.33, 20, 20]} />
            <meshStandardMaterial color="#e0b088" />
          </mesh>
          {faceTexRef.current && (
            <mesh position={[0, 0, 0.28]}>
              <circleGeometry args={[0.3, 24]} />
              <meshStandardMaterial map={faceTexRef.current} transparent />
            </mesh>
          )}
        </group>

        {/* Arms */}
        <group ref={leftArm} position={[-0.5, 1.65, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.5, 4, 6]} />
            <meshStandardMaterial color={roleColor} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.5, 1.65, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.5, 4, 6]} />
            <meshStandardMaterial color={roleColor} />
          </mesh>
        </group>

        {/* Legs */}
        <group ref={leftLeg} position={[-0.18, 0.7, 0]}>
          <mesh position={[0, -0.32, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.6, 4, 6]} />
            <meshStandardMaterial color="#1c1712" />
          </mesh>
        </group>
        <group ref={rightLeg} position={[0.18, 0.7, 0]}>
          <mesh position={[0, -0.32, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.6, 4, 6]} />
            <meshStandardMaterial color="#1c1712" />
          </mesh>
        </group>

        <Text position={[0, 2.55, 0]} fontSize={0.22} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">
          {player?.name || "Investigator"}
        </Text>
      </group>
    </group>
  );
}
