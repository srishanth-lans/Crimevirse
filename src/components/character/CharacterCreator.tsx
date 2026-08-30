"use client";

import { useState, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import type { Role } from "@/types";

const ROLES: { id: Role; title: string; desc: string; color: string }[] = [
  {
    id: "police",
    title: "Police Officer",
    desc: "Authority on the street. Interrogate, pursue, and protect the city.",
    color: "from-blue-600 to-blue-800",
  },
  {
    id: "forensic",
    title: "Forensic Expert",
    desc: "See what others miss. Analyse evidence, reconstruct scenes, find the truth in the details.",
    color: "from-emerald-600 to-teal-800",
  },
  {
    id: "detective",
    title: "Detective",
    desc: "Connect the dots. Cold cases, interviews, and the long game of deduction.",
    color: "from-amber-600 to-orange-800",
  },
];

export default function CharacterCreator() {
  const createPlayer = useGameStore((s) => s.createPlayer);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("police");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Simple stylization: draw to canvas with slight posterize / contrast boost
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setPhotoPreview(dataUrl);
          setProcessing(false);
          return;
        }
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Center crop
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

        // Basic stylization – increase contrast & slight desaturation for “game” look
        const imageData = ctx.getImageData(0, 0, size, size);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          // contrast
          d[i] = Math.min(255, Math.max(0, (d[i] - 128) * 1.25 + 128));
          d[i + 1] = Math.min(255, Math.max(0, (d[i + 1] - 128) * 1.25 + 128));
          d[i + 2] = Math.min(255, Math.max(0, (d[i + 2] - 128) * 1.25 + 128));
          // slight desat
          const gray = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
          d[i] = d[i] * 0.7 + gray * 0.3;
          d[i + 1] = d[i + 1] * 0.7 + gray * 0.3;
          d[i + 2] = d[i + 2] * 0.7 + gray * 0.3;
        }
        ctx.putImageData(imageData, 0, 0);

        // Soft vignette
        const gradient = ctx.createRadialGradient(128, 128, 60, 128, 128, 140);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        setPhotoPreview(canvas.toDataURL("image/jpeg", 0.85));
        setProcessing(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleStart = () => {
    if (!name.trim()) return;
    createPlayer(name.trim(), role, photoPreview || undefined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-center">
          Create Your Investigator
        </h1>
        <p className="text-slate-400 text-center mb-10">
          Upload a photo of yourself. We’ll turn you into a character in CrimeVerse.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Photo side */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 cursor-pointer group"
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Your character"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <svg
                    className="w-16 h-16 mb-3 opacity-60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm">Click to upload photo</span>
                </div>
              )}
              {processing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                <span className="text-sm font-medium">Change photo</span>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
            <canvas ref={canvasRef} className="hidden" />
            <p className="text-xs text-slate-500 text-center max-w-xs">
              Use a clear front-facing photo. We apply a light stylization so you look like a game character.
            </p>
          </div>

          {/* Form side */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Callsign / Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Detective Kane"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none transition"
                maxLength={24}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Choose Your Role
              </label>
              <div className="space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      role === r.id
                        ? `bg-gradient-to-r ${r.color} border-transparent shadow-lg`
                        : "bg-slate-900 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm opacity-80 mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="mt-4 w-full py-4 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-blue-900/40"
            >
              Enter CrimeVerse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
