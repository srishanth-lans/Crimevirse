"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import ChatPanel from "./ChatPanel";

export default function InvestigationUI() {
  const currentCase = useGameStore((s) => s.currentCase);
  const collectedEvidence = useGameStore((s) => s.collectedEvidence);
  const interviewedSuspects = useGameStore((s) => s.interviewedSuspects);
  const collectEvidence = useGameStore((s) => s.collectEvidence);
  const interviewSuspect = useGameStore((s) => s.interviewSuspect);
  const setCurrentCase = useGameStore((s) => s.setCurrentCase);
  const addNote = useGameStore((s) => s.addNote);
  const notes = useGameStore((s) => s.notes);
  const player = useGameStore((s) => s.player);

  const [activeTab, setActiveTab] = useState<"evidence" | "suspects" | "notes">("evidence");
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  if (!currentCase) return null;

  const evidenceProgress = collectedEvidence.length;
  const totalEvidence = currentCase.evidence.length;
  const canClose =
    evidenceProgress >= Math.ceil(totalEvidence * 0.6) ||
    (currentCase.canRemainUnsolved && evidenceProgress >= 1);
  const solved = !currentCase.canRemainUnsolved || evidenceProgress >= totalEvidence;

  const handleCloseCase = () => setShowSolution(true);

  const tabColor = (active: boolean) =>
    active ? { background: "var(--noir-bg-raised)", color: "var(--lamp-amber)" } : { color: "var(--paper-dim)" };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top case header */}
      <div
        className="pointer-events-auto absolute top-0 left-0 right-0 p-4"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)" }}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold uppercase tracking-wide" style={{ color: "var(--paper)" }}>
              {currentCase.title}
            </h1>
            <p className="text-sm mt-1 max-w-xl" style={{ color: "var(--paper-dim)" }}>{currentCase.briefing}</p>
          </div>
          <button
            onClick={() => setCurrentCase(null)}
            className="ink-press shrink-0 px-3 py-1.5 text-xs font-display uppercase tracking-wide"
            style={{ background: "var(--noir-bg-raised)", color: "var(--paper-dim)", border: "1px solid var(--paper-dim)" }}
          >
            ← Station
          </button>
        </div>
        <div className="mt-3 flex gap-4 text-xs font-display uppercase tracking-wide">
          <span style={{ color: "var(--night-blue-bright)" }}>
            Evidence: {evidenceProgress}/{totalEvidence}
          </span>
          <span style={{ color: "var(--lamp-amber)" }}>
            Interviews: {interviewedSuspects.length}/{currentCase.suspects.length}
          </span>
        </div>
      </div>

      {/* Side panel — case file folder */}
      <div
        className="pointer-events-auto absolute top-28 right-4 bottom-24 w-80 overflow-hidden flex flex-col shadow-2xl"
        style={{ background: "var(--noir-bg-raised)", border: "1px solid #3a3229" }}
      >
        <div className="flex border-b" style={{ borderColor: "#3a3229" }}>
          {(["evidence", "suspects", "notes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-display uppercase tracking-wide transition-colors"
              style={tabColor(activeTab === tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === "evidence" &&
            currentCase.evidence.map((ev) => {
              const collected = collectedEvidence.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  className="p-3 transition-colors"
                  style={{
                    background: collected ? "rgba(47,107,94,0.15)" : "var(--noir-bg)",
                    border: `1px solid ${collected ? "var(--forensic-teal-bright)" : "#3a3229"}`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm" style={{ color: "var(--paper)" }}>{ev.name}</div>
                    <span className="text-[10px] uppercase tracking-wide" style={{ color: "var(--paper-dim)" }}>{ev.type}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--paper-dim)" }}>{ev.description}</p>
                  <div className="text-[10px] mt-1 opacity-70" style={{ color: "var(--paper-dim)" }}>📍 {ev.location}</div>
                  {!collected && (
                    <button
                      onClick={() => {
                        collectEvidence(ev.id);
                        addNote(`Collected: ${ev.name}`);
                      }}
                      className="ink-press mt-2 w-full py-1.5 text-xs font-display uppercase tracking-wide"
                      style={{ background: "var(--night-blue)", color: "var(--paper)" }}
                    >
                      Collect Evidence
                    </button>
                  )}
                  {collected && (
                    <div
                      className="mt-2 text-xs font-display uppercase tracking-wide inline-block px-2 py-0.5"
                      style={{ color: "var(--forensic-teal-bright)", border: "1px solid var(--forensic-teal-bright)" }}
                    >
                      ✓ Logged
                    </div>
                  )}
                </div>
              );
            })}

          {activeTab === "suspects" &&
            currentCase.suspects.map((sus) => {
              const interviewed = interviewedSuspects.includes(sus.id);
              return (
                <div
                  key={sus.id}
                  className="p-3 transition-colors"
                  style={{
                    background: interviewed ? "rgba(201,162,39,0.12)" : "var(--noir-bg)",
                    border: `1px solid ${interviewed ? "var(--lamp-amber-dim)" : "#3a3229"}`,
                  }}
                >
                  <div className="font-medium text-sm" style={{ color: "var(--paper)" }}>{sus.name}</div>
                  <p className="text-xs mt-1" style={{ color: "var(--paper-dim)" }}>{sus.description}</p>
                  {interviewed && (
                    <div className="mt-2 text-xs" style={{ color: "var(--paper)" }}>
                      <span style={{ color: "var(--paper-dim)" }}>Alibi:</span> {sus.alibi}
                    </div>
                  )}
                  {!interviewed && sus.dialogue.length > 0 && (
                    <button
                      onClick={() => {
                        interviewSuspect(sus.id);
                        setSelectedSuspect(sus.id);
                        addNote(`Interviewed: ${sus.name}`);
                      }}
                      className="ink-press mt-2 w-full py-1.5 text-xs font-display uppercase tracking-wide"
                      style={{ background: "var(--lamp-amber-dim)", color: "#1c1712" }}
                    >
                      Interview
                    </button>
                  )}
                  {interviewed && sus.dialogue.length > 0 && (
                    <button
                      onClick={() => setSelectedSuspect(sus.id)}
                      className="ink-press mt-2 w-full py-1.5 text-xs font-display uppercase tracking-wide"
                      style={{ background: "var(--noir-bg)", color: "var(--paper-dim)", border: "1px solid #3a3229" }}
                    >
                      View Dialogue
                    </button>
                  )}
                </div>
              );
            })}

          {activeTab === "notes" && (
            <>
              {notes.length === 0 && (
                <p className="text-sm" style={{ color: "var(--paper-dim)" }}>No notes yet. Collect evidence and interview people.</p>
              )}
              {notes.map((n, i) => (
                <div key={i} className="text-sm pl-3 py-1" style={{ color: "var(--paper)", borderLeft: "2px solid var(--night-blue-bright)" }}>
                  {n}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Close case button */}
        <div className="p-4 border-t" style={{ borderColor: "#3a3229" }}>
          <button
            onClick={handleCloseCase}
            disabled={!canClose}
            className="ink-press w-full py-3 font-display font-semibold uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ background: "var(--evidence-red)", color: "var(--paper)" }}
          >
            {canClose ? "Close Case / File Report" : "Need more evidence…"}
          </button>
        </div>
      </div>

      {/* Dialogue modal */}
      {selectedSuspect && (
        <div className="pointer-events-auto absolute inset-0 bg-black/70 flex items-center justify-center p-6">
          <div
            className="phase-enter max-w-md w-full p-6"
            style={{ background: "var(--paper)", color: "#1c1712", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}
          >
            {(() => {
              const sus = currentCase.suspects.find((s) => s.id === selectedSuspect);
              if (!sus) return null;
              return (
                <>
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wide mb-4">{sus.name}</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {sus.dialogue.map((d, i) => (
                      <div key={i}>
                        <div className="text-sm font-medium" style={{ color: "var(--night-blue)" }}>You: {d.question}</div>
                        <div className="text-sm mt-1 ml-2 opacity-80">{d.answer}</div>
                      </div>
                    ))}
                    {sus.dialogue.length === 0 && (
                      <p className="text-sm opacity-60">No further dialogue available.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedSuspect(null)}
                    className="ink-press mt-6 w-full py-2 font-display uppercase tracking-wide"
                    style={{ background: "#1c1712", color: "var(--paper)" }}
                  >
                    Close
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Solution modal — rubber-stamp reveal */}
      {showSolution && (
        <div className="pointer-events-auto absolute inset-0 bg-black/80 flex items-center justify-center p-6">
          <div
            className="phase-enter relative max-w-lg w-full p-8 overflow-hidden"
            style={{ background: "var(--paper)", color: "#1c1712", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}
          >
            <div
              className="stamp absolute px-6 py-2 font-display font-bold uppercase text-2xl tracking-wider select-none"
              style={{
                top: "38%",
                left: "72%",
                color: solved ? "var(--forensic-teal)" : "var(--evidence-red)",
                border: `4px solid ${solved ? "var(--forensic-teal)" : "var(--evidence-red)"}`,
                opacity: 0.85,
              }}
            >
              {solved ? "Solved" : "Unsolved"}
            </div>
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide mb-4">Case Report</h2>
            <p className="leading-relaxed mb-6 max-w-[85%]">{currentCase.solutionSummary}</p>
            <div className="text-sm opacity-70 mb-6">
              Evidence collected: {evidenceProgress}/{totalEvidence}
              <br />
              Role: {player?.role}
            </div>
            <button
              onClick={() => {
                setShowSolution(false);
                setCurrentCase(null);
              }}
              className="ink-press w-full py-3 font-display font-semibold uppercase tracking-wide"
              style={{ background: "#1c1712", color: "var(--paper)" }}
            >
              Return to Station
            </button>
          </div>
        </div>
      )}
      <ChatPanel />
    </div>
  );
}
