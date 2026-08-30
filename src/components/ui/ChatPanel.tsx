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
        className="self-end mb-1 px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
      >
        {open ? "Hide Chat" : "Show Chat"} {isOnline && "●"}
      </button>

      {open && (
        <div className="bg-slate-950/95 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-72">
          <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Investigators Chat</span>
            <span className="text-xs text-green-400">Online</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`text-sm ${m.system ? "text-slate-500 italic" : ""}`}>
                {!m.system && (
                  <span className="font-medium text-blue-300">{m.author}</span>
                )}
                {!m.system && <span className="text-slate-600 text-xs ml-2">{m.time}</span>}
                <div className={m.system ? "" : "text-slate-200"}>{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-2 border-t border-slate-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Share a finding…"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={send}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
