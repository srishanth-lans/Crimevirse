"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, Text, Html, Stars } from "@react-three/drei";
import { Suspense, useState } from "react";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";
import PlayerController from "./PlayerController";
import { CASES } from "@/data/cases";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
  );
}

function Road() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[12, 100]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.15, 100]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[100, 0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
    </>
  );
}

function Building({
  position,
  size = [4, 6, 4] as [number, number, number],
  color = "#334155",
}: {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function PoliceStation() {
  return (
    <group position={[0, 0, -14]}>
      <Building position={[0, 3.5, 0]} size={[14, 7, 10]} color="#1e3a5f" />
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[14.5, 0.5, 10.5]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 7.6, 0]}>
        <boxGeometry args={[6, 0.3, 0.4]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
      </mesh>
      <Text position={[0, 6.2, 5.2]} fontSize={0.7} color="#93c5fd" anchorX="center">
        POLICE STATION
      </Text>
      <mesh position={[-2, 1.5, 5.1]}>
        <boxGeometry args={[2.2, 3, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[2, 1.5, 5.1]}>
        <boxGeometry args={[2.2, 3, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 5.6, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <pointLight position={[0, 5.6, 0]} intensity={12} distance={18} color="#fef3c7" castShadow />
      <mesh position={[0, 5.6, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function CrimeSceneMarker({
  position,
  label,
  caseId,
  onSelect,
}: {
  position: [number, number, number];
  label: string;
  caseId: string;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh
        position={[0, 0.8, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect(caseId); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.4, 0.5, 1.6, 8]} />
        <meshStandardMaterial
          color={hovered ? "#f87171" : "#ef4444"}
          emissive="#7f1d1d"
          emissiveIntensity={hovered ? 1.5 : 0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0, 2.4, 0]} center>
        <div
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition cursor-pointer ${
            hovered ? "bg-red-600 text-white border-red-400" : "bg-red-950/90 text-red-200 border-red-700"
          }`}
          onClick={() => onSelect(caseId)}
        >
          🔍 {label}
        </div>
      </Html>
    </group>
  );
}

function CityContent() {
  const setCurrentCase = useGameStore((s) => s.setCurrentCase);
  const phase = useGameStore((s) => s.phase);

  const handleSelectCase = (caseId: string) => {
    const c = CASES.find((x) => x.id === caseId);
    if (c) setCurrentCase(c);
  };

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[25, 40, 15]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={[25, 40, 15]} turbidity={6} rayleigh={1.2} />
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
      <Ground />
      <Road />
      <PoliceStation />
      <Building position={[-16, 3, -10]} size={[8, 6, 7]} color="#334155" />
      <Building position={[16, 4, -8]} size={[7, 8, 8]} color="#475569" />
      <Building position={[-18, 2.5, 8]} size={[6, 5, 9]} color="#1e293b" />
      <Building position={[18, 3, 10]} size={[7, 6, 6]} color="#334155" />
      <Building position={[-10, 2, 20]} size={[10, 4, 5]} color="#0f172a" />
      <Building position={[12, 2.5, 22]} size={[8, 5, 6]} color="#1e293b" />
      <Building position={[-22, 3.5, -20]} size={[5, 7, 5]} color="#475569" />
      <Building position={[22, 2, -18]} size={[6, 4, 7]} color="#334155" />
      <Building position={[8, 1.8, -24]} size={[9, 3.5, 4]} color="#1e293b" />
      <Building position={[-8, 4, 28]} size={[5, 8, 5]} color="#0f172a" />
      <StreetLamp position={[-8, 0, 0]} />
      <StreetLamp position={[8, 0, 0]} />
      <StreetLamp position={[-8, 0, 12]} />
      <StreetLamp position={[8, 0, 12]} />
      <StreetLamp position={[0, 0, 18]} />
      <StreetLamp position={[-8, 0, -8]} />
      <StreetLamp position={[8, 0, -8]} />
      <StreetLamp position={[0, 0, -22]} />
      {phase === "hub" && (
        <>
          <CrimeSceneMarker position={[-12, 0, 14]} label="Riverfront Scene" caseId="midnight-courier" onSelect={handleSelectCase} />
          <CrimeSceneMarker position={[14, 0, -20]} label="Pier 7 Warehouse" caseId="cold-storage" onSelect={handleSelectCase} />
          <CrimeSceneMarker position={[0, 0, 26]} label="Silent Caller Leads" caseId="silent-caller" onSelect={handleSelectCase} />
        </>
      )}
      <PlayerController />
    </>
  );
}

export default function CityScene() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows camera={{ position: [6, 8, 14], fov: 55 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <CityContent />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-28 left-4 text-xs text-slate-400 bg-black/50 px-3 py-2 rounded-lg pointer-events-none">
        <div className="font-semibold text-slate-300 mb-1">Controls</div>
        <div>WASD / Arrows — Move</div>
        <div>Click red markers — Start case</div>
      </div>
    </div>
  );
}
