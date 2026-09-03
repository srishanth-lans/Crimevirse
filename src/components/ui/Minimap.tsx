"use client";

import { useGameStore } from "@/store/gameStore";
import { CASE_MARKERS, DISTRICTS, MAP_BOUNDS } from "@/data/mapMarkers";

const SIZE = 144;

function toPct(v: number) {
  return ((v + MAP_BOUNDS) / (MAP_BOUNDS * 2)) * 100;
}

export default function Minimap() {
  const pos = useGameStore((s) => s.playerPosition);
  const rotation = useGameStore((s) => s.playerRotation);
  const isNight = useGameStore((s) => s.isNight);
  const toggleNight = useGameStore((s) => s.toggleNight);

  return (
    <div className="pointer-events-auto absolute top-20 right-4 flex flex-col items-end gap-2 phase-enter">
      <div
        className="relative overflow-hidden"
        style={{
          width: SIZE,
          height: SIZE,
          background: "rgba(21,18,16,0.85)",
          border: "1px solid var(--lamp-amber-dim)",
        }}
      >
        {DISTRICTS.map((d) => (
          <div
            key={d.name}
            className="absolute text-[7px] font-display uppercase tracking-wide whitespace-nowrap opacity-50"
            style={{
              left: `${toPct(d.x)}%`,
              top: `${toPct(d.z)}%`,
              transform: "translate(-50%, -50%)",
              color: "var(--paper-dim)",
              transition: "left 300ms linear, top 300ms linear",
            }}
          >
            {d.name}
          </div>
        ))}
        {CASE_MARKERS.map((m) => (
          <div
            key={m.caseId}
            className="absolute"
            style={{
              left: `${toPct(m.x)}%`,
              top: `${toPct(m.z)}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              style={{ background: "var(--evidence-red-bright)", opacity: 0.35, animation: "minimap-ping 1.8s ease-out infinite" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--evidence-red-bright)", boxShadow: "0 0 4px var(--evidence-red-bright)" }}
            />
          </div>
        ))}
        {/* Player marker with facing-direction arrow, smoothly interpolated */}
        <div
          className="absolute"
          style={{
            left: `${toPct(pos.x)}%`,
            top: `${toPct(pos.z)}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 140ms linear, top 140ms linear",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "9px solid var(--lamp-amber)",
              transform: `rotate(${rotation}rad) translateY(-2px)`,
              transformOrigin: "50% 60%",
              filter: "drop-shadow(0 0 3px var(--lamp-amber))",
              transition: "transform 100ms linear",
            }}
          />
        </div>
      </div>
      <button
        onClick={toggleNight}
        className="ink-press px-3 py-1 text-[10px] font-display uppercase tracking-wide"
        style={{ background: "var(--noir-bg-raised)", color: "var(--paper-dim)", border: "1px solid #3a3229" }}
      >
        {isNight ? "☾ Night" : "☀ Day"}
      </button>
      <style jsx>{`
        @keyframes minimap-ping {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.45; }
          70%, 100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
