"use client";

import { useGameStore } from "@/store/gameStore";
import CharacterCreator from "@/components/character/CharacterCreator";
import CityScene from "@/components/world/CityScene";
import HubUI from "@/components/ui/HubUI";
import InvestigationUI from "@/components/ui/InvestigationUI";
import { useEffect, useRef, useState } from "react";

function MainMenu() {
  const setPhase = useGameStore((s) => s.setPhase);
  const player = useGameStore((s) => s.player);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #241e17 0%, var(--noir-bg) 70%)" }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,162,39,0.03) 3px)"
      }} />
      <div className="relative z-10 text-center px-6">
        <p className="font-display text-sm tracking-[0.5em] mb-3" style={{ color: "var(--lamp-amber-dim)" }}>
          CASE FILE No. 001
        </p>
        <h1 className="font-display text-7xl md:text-8xl font-bold uppercase mb-5" style={{ color: "var(--paper)" }}>
          Crime<span style={{ color: "var(--evidence-red-bright)" }}>Verse</span>
        </h1>
        <div className="w-24 h-px mx-auto mb-5" style={{ background: "var(--lamp-amber-dim)" }} />
        <p className="text-base mb-1 max-w-md mx-auto" style={{ color: "var(--paper-dim)" }}>
          Become the investigator. Solve the unsolvable.
        </p>
        <p className="text-xs mb-14 tracking-wide" style={{ color: "var(--paper-dim)", opacity: 0.6 }}>
          OPEN-WORLD INVESTIGATION · OFFLINE &amp; ONLINE · YOU ARE THE CHARACTER
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setPhase("character")}
            className="ink-press px-10 py-4 font-display uppercase tracking-wider text-lg border-2 transition-colors"
            style={{
              background: "var(--evidence-red)",
              borderColor: "var(--evidence-red-bright)",
              color: "var(--paper)",
            }}
          >
            {player ? "Continue / New Character" : "Create Character"}
          </button>
          {player && (
            <button
              onClick={() => setPhase("hub")}
              className="ink-press px-10 py-4 font-display uppercase tracking-wider text-lg border-2 transition-colors"
              style={{
                background: "transparent",
                borderColor: "var(--lamp-amber-dim)",
                color: "var(--paper)",
              }}
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
  const [flash, setFlash] = useState(false);
  const prevPhase = useRef(phase);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (prevPhase.current !== phase) {
      setFlash(true);
      prevPhase.current = phase;
      const t = setTimeout(() => setFlash(false), 420);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--noir-bg)", color: "var(--paper)" }}>
        <span className="font-display tracking-widest text-sm" style={{ color: "var(--lamp-amber)" }}>
          LOADING CASE FILE…
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="grain-overlay" />
      {flash && <div className="phase-flash" />}
      <div key={phase} className="phase-enter">
        {phase === "menu" && <MainMenu />}
        {phase === "character" && <CharacterCreator />}
        {(phase === "hub" || phase === "investigation") && (
          <div className="relative w-screen h-screen overflow-hidden vignette" style={{ background: "var(--noir-bg)" }}>
            <CityScene />
            {phase === "hub" && <HubUI />}
            {phase === "investigation" && <InvestigationUI />}
          </div>
        )}
      </div>
    </>
  );
}
