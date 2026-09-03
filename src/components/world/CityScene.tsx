"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, Text, Html, Stars } from "@react-three/drei";
import { Suspense, useState } from "react";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";
import PlayerController from "./PlayerController";
import { CASES } from "@/data/cases";
import { CASE_MARKERS, DISTRICTS, MAP_BOUNDS } from "@/data/mapMarkers";
import { BUILDINGS, PLATFORMS } from "@/data/buildings";
import Minimap from "@/components/ui/Minimap";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[MAP_BOUNDS * 2.4, MAP_BOUNDS * 2.4]} />
      <meshStandardMaterial color="#100d0b" />
    </mesh>
  );
}

function Street({
  position,
  length = 90,
  rotationY = 0,
}: {
  position: [number, number, number];
  length?: number;
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, length]} />
        <meshStandardMaterial color="#1a1712" />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.8, 0.015, 0]} receiveShadow>
        <planeGeometry args={[1.6, length]} />
        <meshStandardMaterial color="#26221c" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.015, 0]} receiveShadow>
        <planeGeometry args={[1.6, length]} />
        <meshStandardMaterial color="#26221c" />
      </mesh>
      {/* Lane marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.12, length]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function Building({
  position,
  size = [4, 6, 4] as [number, number, number],
  color = "#25211c",
}: {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* A few lit windows for life at night */}
      <mesh position={[0, size[1] * 0.2, size[2] / 2 + 0.01]}>
        <planeGeometry args={[size[0] * 0.25, size[1] * 0.12]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function PoliceStation() {
  return (
    <group position={[0, 0, -14]}>
      <Building position={[0, 3.5, 0]} size={[14, 7, 10]} color="#1e2530" />
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[14.5, 0.5, 10.5]} />
        <meshStandardMaterial color="#100d0b" />
      </mesh>
      <mesh position={[0, 7.6, 0]}>
        <boxGeometry args={[6, 0.3, 0.4]} />
        <meshStandardMaterial color="#33495a" emissive="#33495a" emissiveIntensity={2} />
      </mesh>
      <Text position={[0, 6.2, 5.2]} fontSize={0.7} color="#c9a227" anchorX="center" font={undefined}>
        PRECINCT 14
      </Text>
      <mesh position={[-2, 1.5, 5.1]}>
        <boxGeometry args={[2.2, 3, 0.2]} />
        <meshStandardMaterial color="#100d0b" />
      </mesh>
      <mesh position={[2, 1.5, 5.1]}>
        <boxGeometry args={[2.2, 3, 0.2]} />
        <meshStandardMaterial color="#100d0b" />
      </mesh>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 5.6, 8]} />
        <meshStandardMaterial color="#2b2721" />
      </mesh>
      <pointLight position={[0, 5.6, 0]} intensity={12} distance={18} color="#fef3c7" castShadow />
      <mesh position={[0, 5.6, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 1.8, 6]} />
        <meshStandardMaterial color="#332a1f" />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.1, 2.2, 8]} />
        <meshStandardMaterial color="#2f3a26" />
      </mesh>
    </group>
  );
}

function ParkedCar({ position, rotationY = 0, color = "#2b2f38" }: { position: [number, number, number]; rotationY?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.7, 0.55, 3.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.72, -0.3]} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.6]} />
        <meshStandardMaterial color="#14110d" />
      </mesh>
    </group>
  );
}

function Bench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.08, 0.5]} />
        <meshStandardMaterial color="#3a3229" />
      </mesh>
      <mesh position={[0, 0.65, -0.22]}>
        <boxGeometry args={[1.4, 0.5, 0.08]} />
        <meshStandardMaterial color="#3a3229" />
      </mesh>
    </group>
  );
}

function Platform({ position, size, height, color }: { position: [number, number, number]; size: [number, number, number]; height: number; color: string }) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} receiveShadow castShadow>
      <boxGeometry args={[size[0], height, size[2]]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function DistrictLabel({ name, position }: { name: string; position: [number, number, number] }) {
  return (
    <Text position={position} fontSize={1.1} color="#c9a227" anchorX="center" fillOpacity={0.35} outlineWidth={0.01} outlineColor="#000">
      {name.toUpperCase()}
    </Text>
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
          color={hovered ? "#d63a30" : "#b3221e"}
          emissive="#7f1d1d"
          emissiveIntensity={hovered ? 1.5 : 0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial color="#b3221e" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0, 2.4, 0]} center>
        <div
          className="px-3 py-1.5 text-xs font-display uppercase tracking-wide whitespace-nowrap border cursor-pointer transition-colors"
          style={{
            background: hovered ? "var(--evidence-red)" : "rgba(21,18,16,0.9)",
            color: "var(--paper)",
            borderColor: "var(--evidence-red-bright)",
          }}
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
  const isNight = useGameStore((s) => s.isNight);

  const handleSelectCase = (caseId: string) => {
    const c = CASES.find((x) => x.id === caseId);
    if (c) setCurrentCase(c);
  };

  return (
    <>
      <fog attach="fog" args={[isNight ? "#0c0a08" : "#3b352c", 15, isNight ? 55 : 70]} />
      <ambientLight intensity={isNight ? 0.12 : 0.3} />
      <directionalLight
        position={[25, 40, 15]}
        intensity={isNight ? 0.15 : 0.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {!isNight && <Sky sunPosition={[25, 40, 15]} turbidity={8} rayleigh={2} />}
      {isNight && <color attach="background" args={["#0c0a08"]} />}
      <Stars radius={100} depth={50} count={isNight ? 3500 : 800} factor={3} saturation={0} fade speed={0.5} />

      <Ground />
      <Street position={[0, 0, 0]} length={MAP_BOUNDS * 2.4} />
      <Street position={[0, 0, 0]} length={MAP_BOUNDS * 2.4} rotationY={Math.PI / 2} />
      <Street position={[24, 0, 0]} length={MAP_BOUNDS * 2.4} />
      <Street position={[-24, 0, 0]} length={MAP_BOUNDS * 2.4} />

      {PLATFORMS.map((p) => (
        <Platform key={p.id} position={p.position} size={p.size} height={p.height} color={p.color} />
      ))}

      <PoliceStation />
      {BUILDINGS.filter((b) => b.id !== "precinct").map((b) => (
        <Building key={b.id} position={b.position} size={b.size} color={b.color} />
      ))}

      {DISTRICTS.map((d) => (
        <DistrictLabel key={d.name} name={d.name} position={[d.x, 8, d.z]} />
      ))}

      {/* Street clutter for a lived-in feel */}
      <Tree position={[-6, 0, 4]} />
      <Tree position={[6, 0, 4]} />
      <Tree position={[-6, 0, -4]} />
      <Tree position={[6, 0, -4]} />
      <Tree position={[-20, 0, 14]} />
      <Tree position={[20, 0, -14]} />
      <Bench position={[-5.8, 0, 6]} rotationY={Math.PI / 2} />
      <Bench position={[5.8, 0, -6]} rotationY={-Math.PI / 2} />
      <ParkedCar position={[-4.5, 0, 16]} rotationY={Math.PI / 2} />
      <ParkedCar position={[4.5, 0, -16]} rotationY={-Math.PI / 2} color="#3a2a2a" />
      <ParkedCar position={[19.5, 0, -6]} />
      <ParkedCar position={[-19.5, 0, 6]} color="#33403a" />

      <StreetLamp position={[-8, 0, 0]} />
      <StreetLamp position={[8, 0, 0]} />
      <StreetLamp position={[-8, 0, 12]} />
      <StreetLamp position={[8, 0, 12]} />
      <StreetLamp position={[0, 0, 18]} />
      <StreetLamp position={[-8, 0, -8]} />
      <StreetLamp position={[8, 0, -8]} />
      <StreetLamp position={[0, 0, -22]} />
      <StreetLamp position={[24, 0, 10]} />
      <StreetLamp position={[-24, 0, -10]} />

      {phase === "hub" &&
        CASE_MARKERS.map((m) => (
          <CrimeSceneMarker
            key={m.caseId}
            position={[m.x, 0, m.z]}
            label={m.label}
            caseId={m.caseId}
            onSelect={handleSelectCase}
          />
        ))}
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
      <Minimap />
      <div
        className="absolute bottom-28 left-4 text-xs px-3 py-2 pointer-events-none"
        style={{ background: "rgba(21,18,16,0.7)", color: "var(--paper-dim)" }}
      >
        <div className="font-display uppercase tracking-wide mb-1" style={{ color: "var(--lamp-amber)" }}>Controls</div>
        <div>WASD / Arrows — Move · Space — Jump</div>
        <div>Drag — Look around · Scroll — Zoom</div>
        <div>Click red markers — Start case</div>
      </div>
    </div>
  );
}
