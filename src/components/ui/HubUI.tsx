"use client";

import { useGameStore } from "@/store/gameStore";
import { CASES } from "@/data/cases";
import ChatPanel from "./ChatPanel";

const DIFFICULTY_STYLE: Record<string, { bg: string; label: string }> = {
  tutorial: { bg: "var(--forensic-teal)", label: "TRAINING" },
  easy: { bg: "var(--forensic-teal)", label: "EASY" },
  medium: { bg: "var(--lamp-amber-dim)", label: "MEDIUM" },
  hard: { bg: "var(--evidence-red)", label: "HARD" },
};

const TILTS = ["-1.5deg", "1deg", "-0.5deg"];

export default function HubUI() {
  const player = useGameStore((s) => s.player);
  const setCurrentCase = useGameStore((s) => s.setCurrentCase);
  const isOnline = useGameStore((s) => s.isOnline);
  const toggleOnline = useGameStore((s) => s.toggleOnline);
  const setPhase = useGameStore((s) => s.setPhase);

  if (!player) return null;

  const roleLabel =
    player.role === "police"
      ? "Police Officer"
      : player.role === "forensic"
      ? "Forensic Expert"
      : "Detective";

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar */}
      <div
        className="pointer-events-auto absolute top-0 left-0 right-0 p-4 flex justify-between items-start"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)" }}
      >
        <div className="flex items-center gap-3">
          {player.photoDataUrl && (
            <img
              src={player.photoDataUrl}
              alt=""
              className="w-12 h-12 object-cover"
              style={{ border: "2px solid var(--lamp-amber)" }}
            />
          )}
          <div>
            <div className="font-display font-semibold uppercase tracking-wide" style={{ color: "var(--paper)" }}>
              {player.name}
            </div>
            <div className="text-xs" style={{ color: "var(--lamp-amber)" }}>{roleLabel}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleOnline}
            className="ink-press px-4 py-2 text-xs font-display uppercase tracking-wide transition-colors"
            style={{
              background: isOnline ? "var(--forensic-teal)" : "var(--noir-bg-raised)",
              color: "var(--paper)",
              border: `1px solid ${isOnline ? "var(--forensic-teal-bright)" : "var(--paper-dim)"}`,
            }}
          >
            {isOnline ? "● Online" : "○ Go Online"}
          </button>
          <button
            onClick={() => setPhase("character")}
            className="ink-press px-4 py-2 text-xs font-display uppercase tracking-wide"
            style={{ background: "var(--noir-bg-raised)", color: "var(--paper-dim)", border: "1px solid var(--paper-dim)" }}
          >
            Change Character
          </button>
        </div>
      </div>

      {/* Case selection panel */}
      <div
        className="pointer-events-auto absolute bottom-0 left-0 right-0 p-6"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.7) 60%, transparent)" }}
      >
        <h2 className="font-display text-xl font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--paper)" }}>
          Open Cases
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--paper-dim)" }}>
          Walk to a red marker, or pull a file below
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl">
          {CASES.map((c, i) => {
            const diff = DIFFICULTY_STYLE[c.difficulty] ?? DIFFICULTY_STYLE.medium;
            return (
              <button
                key={c.id}
                onClick={() => setCurrentCase(c)}
                className="index-card text-left p-4 relative"
                style={
                  {
                    "--tilt": TILTS[i % TILTS.length],
                    transform: `rotate(${TILTS[i % TILTS.length]})`,
                    background: "var(--paper)",
                    color: "#1c1712",
                    boxShadow: "0 8px 18px -6px rgba(0,0,0,0.5)",
                  } as React.CSSProperties
                }
              >
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                  style={{ background: "var(--evidence-red-bright)", boxShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                />
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="font-display font-semibold uppercase text-sm tracking-wide">
                    {c.title}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 font-display tracking-wider text-white shrink-0"
                    style={{ background: diff.bg }}
                  >
                    {diff.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-80 line-clamp-3">{c.briefing}</p>
                <div className="mt-3 text-[10px] uppercase tracking-wide opacity-60">📍 {c.location}</div>
              </button>
            );
          })}
        </div>
      </div>

      <ChatPanel />
    </div>
  );
}
