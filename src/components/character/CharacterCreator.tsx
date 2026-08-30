"use client";

import { useState, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import type { Role } from "@/types";

const ROLES: { id: Role; title: string; desc: string; accent: string }[] = [
  {
    id: "police",
    title: "Police Officer",
    desc: "Authority on the street. Interrogate, pursue, and protect the city.",
    accent: "var(--night-blue-bright)",
  },
  {
    id: "forensic",
    title: "Forensic Expert",
    desc: "See what others miss. Analyse evidence, reconstruct scenes, find the truth in the details.",
    accent: "var(--forensic-teal-bright)",
  },
  {
    id: "detective",
    title: "Detective",
    desc: "Connect the dots. Cold cases, interviews, and the long game of deduction.",
    accent: "var(--lamp-amber)",
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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--noir-bg)", color: "var(--paper)" }}
    >
      <div className="max-w-4xl w-full phase-enter">
        <p className="font-display text-center text-xs tracking-[0.4em] mb-2" style={{ color: "var(--lamp-amber-dim)" }}>
          PERSONNEL FILE
        </p>
        <h1 className="font-display text-4xl font-semibold uppercase tracking-wide mb-2 text-center">
          Create Your Investigator
        </h1>
        <p className="text-center mb-10 text-sm" style={{ color: "var(--paper-dim)" }}>
          Upload a photo of yourself. We&rsquo;ll turn you into a character in CrimeVerse.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Photo side */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-64 h-64 overflow-hidden cursor-pointer group"
              style={{ border: "2px solid var(--lamp-amber-dim)", background: "var(--noir-bg-raised)" }}
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Your character"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: "var(--paper-dim)" }}>
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
                  <div
                    className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
                    style={{ borderColor: "var(--lamp-amber)", borderTopColor: "transparent" }}
                  />
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
            <p className="text-xs text-center max-w-xs opacity-60">
              Use a clear front-facing photo. We apply a light stylization so you look like a game character.
            </p>
          </div>

          {/* Form side */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-display uppercase tracking-wide mb-2" style={{ color: "var(--paper-dim)" }}>
                Callsign / Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Detective Kane"
                className="w-full px-4 py-3 focus:outline-none transition-colors"
                style={{ background: "var(--noir-bg-raised)", border: "1px solid #3a3229", color: "var(--paper)" }}
                maxLength={24}
              />
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-wide mb-3" style={{ color: "var(--paper-dim)" }}>
                Choose Your Role
              </label>
              <div className="space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className="ink-press w-full text-left p-4 transition-colors"
                    style={{
                      background: role === r.id ? "var(--noir-bg-raised)" : "transparent",
                      border: `1px solid ${role === r.id ? r.accent : "#3a3229"}`,
                      borderLeftWidth: role === r.id ? "4px" : "1px",
                    }}
                  >
                    <div className="font-display font-semibold uppercase tracking-wide text-sm" style={{ color: role === r.id ? r.accent : "var(--paper)" }}>
                      {r.title}
                    </div>
                    <div className="text-xs opacity-70 mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="ink-press mt-4 w-full py-4 font-display font-semibold uppercase tracking-wide text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ background: "var(--evidence-red)", color: "var(--paper)" }}
            >
              Enter CrimeVerse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
