"use client";

import { useState, useRef, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
  system?: boolean;
}

export default function ChatPanel() {
  const player = useGameStore((s) => s.player);
  const isOnline = useGameStore((s) => s.isOnline);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      author: "System",
      text: "Welcome to CrimeVerse online channel. Share findings with other investigators.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      system: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOnline) return null;

  const send = () => {
    const text = input.trim();
    if (!text || !player) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        author: player.name,
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");

    // Simple simulated peer replies for demo (offline multiplayer feel)
    if (text.toLowerCase().includes("evidence") || text.toLowerCase().includes("found")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}-bot`,
            author: "Detective_Rivera",
            text: "Copy that. Sending the lab results to the shared board.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1800);
    }
    if (text.toLowerCase().includes("suspect") || text.toLowerCase().includes("interview")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}-bot2`,
            author: "Forensic_Kim",
            text: "I can cross-check alibis against the timeline. Share the name.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 2200);
    }
  };

  return (
    <div className="pointer-events-auto absolute bottom-28 right-4 w-80 flex flex-col">
      <button
        onClick={() => setOpen((o) => !o)}
        className="ink-press self-end mb-1 px-3 py-1 text-xs font-display uppercase tracking-wide"
        style={{ background: "var(--noir-bg-raised)", color: "var(--paper-dim)", border: "1px solid #3a3229" }}
      >
        {open ? "Hide Chat" : "Show Chat"} {isOnline && <span style={{ color: "var(--forensic-teal-bright)" }}>●</span>}
      </button>

      {open && (
        <div
          className="phase-enter overflow-hidden shadow-2xl flex flex-col h-72"
          style={{ background: "rgba(21,18,16,0.97)", border: "1px solid #3a3229" }}
        >
          <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "#3a3229" }}>
            <span className="text-xs font-display uppercase tracking-wide" style={{ color: "var(--paper)" }}>Investigators Chat</span>
            <span className="text-xs" style={{ color: "var(--forensic-teal-bright)" }}>Online</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="text-sm" style={m.system ? { color: "var(--paper-dim)", fontStyle: "italic" } : undefined}>
                {!m.system && (
                  <span className="font-medium" style={{ color: "var(--lamp-amber)" }}>{m.author}</span>
                )}
                {!m.system && <span className="text-xs ml-2 opacity-50">{m.time}</span>}
                <div style={m.system ? undefined : { color: "var(--paper)" }}>{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-2 border-t flex gap-2" style={{ borderColor: "#3a3229" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Share a finding…"
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
              style={{ background: "var(--noir-bg)", border: "1px solid #3a3229", color: "var(--paper)" }}
            />
            <button
              onClick={send}
              className="ink-press px-3 py-2 text-sm font-display uppercase tracking-wide"
              style={{ background: "var(--night-blue)", color: "var(--paper)" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
