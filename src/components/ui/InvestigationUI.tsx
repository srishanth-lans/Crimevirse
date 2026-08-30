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

  const handleCloseCase = () => {
    setShowSolution(true);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top case header */}
      <div className="pointer-events-auto absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">{currentCase.title}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">{currentCase.briefing}</p>
          </div>
          <button
            onClick={() => setCurrentCase(null)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
          >
            ← Back to Station
          </button>
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <span className="text-blue-300">
            Evidence: {evidenceProgress}/{totalEvidence}
          </span>
          <span className="text-amber-300">
            Interviews: {interviewedSuspects.length}/{currentCase.suspects.length}
          </span>
        </div>
      </div>

      {/* Side panel */}
      <div className="pointer-events-auto absolute top-28 right-4 bottom-24 w-80 bg-slate-950/95 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex border-b border-slate-700">
          {(["evidence", "suspects", "notes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
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
                  className={`p-3 rounded-xl border ${
                    collected
                      ? "border-green-700 bg-green-950/40"
                      : "border-slate-700 bg-slate-900"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-white text-sm">{ev.name}</div>
                    <span className="text-xs text-slate-500">{ev.type}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{ev.description}</p>
                  <div className="text-xs text-slate-500 mt-1">📍 {ev.location}</div>
                  {!collected && (
                    <button
                      onClick={() => {
                        collectEvidence(ev.id);
                        addNote(`Collected: ${ev.name}`);
                      }}
                      className="mt-2 w-full py-1.5 text-xs rounded-lg bg-blue-700 hover:bg-blue-600 text-white"
                    >
                      Collect Evidence
                    </button>
                  )}
                  {collected && (
                    <div className="mt-2 text-xs text-green-400">✓ Collected</div>
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
                  className={`p-3 rounded-xl border ${
                    interviewed
                      ? "border-amber-700 bg-amber-950/30"
                      : "border-slate-700 bg-slate-900"
                  }`}
                >
                  <div className="font-medium text-white text-sm">{sus.name}</div>
                  <p className="text-xs text-slate-400 mt-1">{sus.description}</p>
                  {interviewed && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-slate-500">Alibi:</span> {sus.alibi}
                    </div>
                  )}
                  {!interviewed && sus.dialogue.length > 0 && (
                    <button
                      onClick={() => {
                        interviewSuspect(sus.id);
                        setSelectedSuspect(sus.id);
                        addNote(`Interviewed: ${sus.name}`);
                      }}
                      className="mt-2 w-full py-1.5 text-xs rounded-lg bg-amber-700 hover:bg-amber-600 text-white"
                    >
                      Interview
                    </button>
                  )}
                  {interviewed && sus.dialogue.length > 0 && (
                    <button
                      onClick={() => setSelectedSuspect(sus.id)}
                      className="mt-2 w-full py-1.5 text-xs rounded-lg bg-slate-700 text-slate-300"
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
                <p className="text-sm text-slate-500">No notes yet. Collect evidence and interview people.</p>
              )}
              {notes.map((n, i) => (
                <div key={i} className="text-sm text-slate-300 border-l-2 border-blue-600 pl-3 py-1">
                  {n}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Close case button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleCloseCase}
            disabled={!canClose}
            className="w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
          >
            {canClose ? "Close Case / File Report" : "Need more evidence…"}
          </button>
        </div>
      </div>

      {/* Dialogue modal */}
      {selectedSuspect && (
        <div className="pointer-events-auto absolute inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-600 rounded-2xl max-w-md w-full p-6">
            {(() => {
              const sus = currentCase.suspects.find((s) => s.id === selectedSuspect);
              if (!sus) return null;
              return (
                <>
                  <h3 className="text-lg font-bold text-white mb-4">{sus.name}</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {sus.dialogue.map((d, i) => (
                      <div key={i}>
                        <div className="text-sm text-blue-300">You: {d.question}</div>
                        <div className="text-sm text-slate-300 mt-1 ml-2">{d.answer}</div>
                      </div>
                    ))}
                    {sus.dialogue.length === 0 && (
                      <p className="text-slate-400 text-sm">No further dialogue available.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedSuspect(null)}
                    className="mt-6 w-full py-2 rounded-lg bg-slate-700 text-white"
                  >
                    Close
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Solution modal */}
      {showSolution && (
        <div className="pointer-events-auto absolute inset-0 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-600 rounded-2xl max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Case Report</h2>
            <p className="text-slate-300 leading-relaxed mb-6">{currentCase.solutionSummary}</p>
            <div className="text-sm text-slate-400 mb-6">
              Evidence collected: {evidenceProgress}/{totalEvidence}
              <br />
              Role: {player?.role}
            </div>
            <button
              onClick={() => {
                setShowSolution(false);
                setCurrentCase(null);
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white"
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
