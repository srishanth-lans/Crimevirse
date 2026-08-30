"use client";

import { useGameStore } from "@/store/gameStore";
import { CASES } from "@/data/cases";
import ChatPanel from "./ChatPanel";

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
      <div className="pointer-events-auto absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-3">
          {player.photoDataUrl && (
            <img
              src={player.photoDataUrl}
              alt=""
              className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover"
            />
          )}
          <div>
            <div className="font-bold text-white">{player.name}</div>
            <div className="text-sm text-blue-300">{roleLabel}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleOnline}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isOnline
                ? "bg-green-600 text-white shadow-lg shadow-green-900/40"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {isOnline ? "● Online" : "○ Go Online"}
          </button>
          <button
            onClick={() => setPhase("character")}
            className="px-4 py-2 rounded-lg text-sm bg-slate-700 text-slate-300 hover:bg-slate-600"
          >
            Change Character
          </button>
        </div>
      </div>

      {/* Case selection panel */}
      <div className="pointer-events-auto absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        <h2 className="text-xl font-bold text-white mb-1">Available Cases</h2>
        <p className="text-xs text-slate-400 mb-4">Walk to red markers or select below</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
          {CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCurrentCase(c)}
              className="text-left p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-white group-hover:text-blue-300">
                  {c.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    c.difficulty === "tutorial"
                      ? "bg-green-900 text-green-300"
                      : c.difficulty === "medium"
                      ? "bg-amber-900 text-amber-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {c.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2">{c.briefing}</p>
              <div className="mt-3 text-xs text-slate-500">{c.location}</div>
            </button>
          ))}
        </div>
      </div>

      <ChatPanel />
    </div>
  );
}
