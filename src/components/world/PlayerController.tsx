"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";

const SPEED = 8;
const keys = new Set<string>();

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => keys.add(e.code));
  window.addEventListener("keyup", (e) => keys.delete(e.code));
}

export default function PlayerController() {
  const player = useGameStore((s) => s.player);
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  const roleColor =
    player?.role === "police"
      ? "#3b82f6"
      : player?.role === "forensic"
      ? "#10b981"
      : "#f59e0b";

  useFrame((_, delta) => {
    if (!group.current) return;

    direction.current.set(0, 0, 0);
    if (keys.has("KeyW") || keys.has("ArrowUp")) direction.current.z -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) direction.current.z += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) direction.current.x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) direction.current.x += 1;

    if (direction.current.length() > 0) {
      direction.current.normalize();
      // Face movement direction
      const angle = Math.atan2(direction.current.x, direction.current.z);
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        angle,
        10 * delta
      );
    }

    velocity.current.x = direction.current.x * SPEED;
    velocity.current.z = direction.current.z * SPEED;

    group.current.position.x += velocity.current.x * delta;
    group.current.position.z += velocity.current.z * delta;

    // Soft bounds
    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -35, 35);
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -35, 35);

    // Third-person camera follow
    const target = group.current.position.clone();
    const offset = new THREE.Vector3(0, 6, 10);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), group.current.rotation.y);
    const desired = target.clone().add(offset);
    camera.position.lerp(desired, 4 * delta);
    camera.lookAt(target.x, target.y + 1.5, target.z);
  });

  return (
    <group ref={group} position={[0, 0, 4]}>
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
        <meshStandardMaterial color={roleColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#fcd9b6" />
      </mesh>
      {/* Simple arms */}
      <mesh position={[-0.55, 1.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 4, 6]} />
        <meshStandardMaterial color={roleColor} />
      </mesh>
      <mesh position={[0.55, 1.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 4, 6]} />
        <meshStandardMaterial color={roleColor} />
      </mesh>

      {player?.photoDataUrl && (
        <Html position={[0, 2.7, 0]} center distanceFactor={8}>
          <img
            src={player.photoDataUrl}
            alt="You"
            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg pointer-events-none"
          />
        </Html>
      )}
      <Text position={[0, 0.12, 0]} fontSize={0.22} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        {player?.name || "Investigator"}
      </Text>
    </group>
  );
}
