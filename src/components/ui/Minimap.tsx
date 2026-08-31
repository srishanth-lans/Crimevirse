"use client";

import { useGameStore } from "@/store/gameStore";
import { CASE_MARKERS, DISTRICTS, MAP_BOUNDS } from "@/data/mapMarkers";

const SIZE = 144;

function toPct(v: number) {
  return ((v + MAP_BOUNDS) / (MAP_BOUNDS * 2)) * 100;
}

export default function Minimap() {
  const pos = useGameStore((s) => s.playerPosition);
  const isNight = useGameStore((s) => s.isNight);
  const toggleNight = useGameStore((s) => s.toggleNight);

  return (
    <div className="pointer-events-auto absolute top-20 right-4 flex flex-col items-end gap-2">
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
            }}
          >
            {d.name}
          </div>
        ))}
        {CASE_MARKERS.map((m) => (
          <div
            key={m.caseId}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${toPct(m.x)}%`,
              top: `${toPct(m.z)}%`,
              transform: "translate(-50%, -50%)",
              background: "var(--evidence-red-bright)",
              boxShadow: "0 0 4px var(--evidence-red-bright)",
            }}
          />
        ))}
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${toPct(pos.x)}%`,
            top: `${toPct(pos.z)}%`,
            transform: "translate(-50%, -50%)",
            background: "var(--lamp-amber)",
            boxShadow: "0 0 6px var(--lamp-amber)",
          }}
        />
      </div>
      <button
        onClick={toggleNight}
        className="ink-press px-3 py-1 text-[10px] font-display uppercase tracking-wide"
        style={{ background: "var(--noir-bg-raised)", color: "var(--paper-dim)", border: "1px solid #3a3229" }}
      >
        {isNight ? "☾ Night" : "☀ Day"}
      </button>
    </div>
  );
}
