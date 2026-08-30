"use client";

import { useGameStore } from "@/store/gameStore";
import CharacterCreator from "@/components/character/CharacterCreator";
import CityScene from "@/components/world/CityScene";
import HubUI from "@/components/ui/HubUI";
import InvestigationUI from "@/components/ui/InvestigationUI";
import { useEffect, useState } from "react";

function MainMenu() {
  const setPhase = useGameStore((s) => s.setPhase);
  const player = useGameStore((s) => s.player);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-950 to-black" />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4">
          CRIME<span className="text-blue-500">VERSE</span>
        </h1>
        <p className="text-xl text-slate-400 mb-2 max-w-md mx-auto">
          Become the investigator. Solve the unsolvable.
        </p>
        <p className="text-sm text-slate-500 mb-12">
          Open-world crime investigation · Offline & Online · You are the character
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setPhase("character")}
            className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-xl transition"
          >
            {player ? "Continue / New Character" : "Create Character"}
          </button>
          {player && (
            <button
              onClick={() => setPhase("hub")}
              className="px-10 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-600 transition"
            >
              Enter as {player.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const phase = useGameStore((s) => s.phase);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading CrimeVerse…
      </div>
    );
  }

  if (phase === "menu") return <MainMenu />;
  if (phase === "character") return <CharacterCreator />;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <CityScene />
      {phase === "hub" && <HubUI />}
      {phase === "investigation" && <InvestigationUI />}
    </div>
  );
}
