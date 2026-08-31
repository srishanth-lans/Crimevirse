"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";
import { MAP_BOUNDS } from "@/data/mapMarkers";

const SPEED = 8;
const keys = new Set<string>();

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => keys.add(e.code));
  window.addEventListener("keyup", (e) => keys.delete(e.code));
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
    return () => {
      cancelled = true;
    };
  }, [photoDataUrl]);

  return ref;
}

export default function PlayerController() {
  const player = useGameStore((s) => s.player);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const gaitClock = useRef(0);
  const posUpdateCounter = useRef(0);

  const faceTexRef = useFaceTexture(player?.photoDataUrl);

  const roleColor =
    player?.role === "police"
      ? "#33495a"
      : player?.role === "forensic"
      ? "#2f6b5e"
      : "#c9a227";

  useFrame((_, delta) => {
    if (!group.current) return;

    direction.current.set(0, 0, 0);
    if (keys.has("KeyW") || keys.has("ArrowUp")) direction.current.z -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) direction.current.z += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) direction.current.x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) direction.current.x += 1;

    const moving = direction.current.length() > 0;

    if (moving) {
      direction.current.normalize();
      const angle = Math.atan2(direction.current.x, direction.current.z);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, angle, 10 * delta);
      gaitClock.current += delta * 9;
    }

    const swing = moving ? Math.sin(gaitClock.current) * 0.55 : 0;
    if (leftArm.current) leftArm.current.rotation.x = swing;
    if (rightArm.current) rightArm.current.rotation.x = -swing;
    if (leftLeg.current) leftLeg.current.rotation.x = -swing;
    if (rightLeg.current) rightLeg.current.rotation.x = swing;
    group.current.position.y = moving ? Math.abs(Math.sin(gaitClock.current * 2)) * 0.06 : 0;

    velocity.current.x = direction.current.x * SPEED;
    velocity.current.z = direction.current.z * SPEED;

    group.current.position.x += velocity.current.x * delta;
    group.current.position.z += velocity.current.z * delta;

    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -MAP_BOUNDS, MAP_BOUNDS);
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -MAP_BOUNDS, MAP_BOUNDS);

    posUpdateCounter.current += 1;
    if (posUpdateCounter.current % 5 === 0) {
      setPlayerPosition(group.current.position.x, group.current.position.z);
    }

    const target = group.current.position.clone();
    const offset = new THREE.Vector3(0, 6, 10);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), group.current.rotation.y);
    const desired = target.clone().add(offset);
    camera.position.lerp(desired, 4 * delta);
    camera.lookAt(target.x, target.y + 1.5, target.z);
  });

  return (
    <group ref={group} position={[0, 0, 4]}>
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

      {/* Arms, pivoting from the shoulder for the walk cycle */}
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

      {/* Legs, pivoting from the hip */}
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
  );
}
