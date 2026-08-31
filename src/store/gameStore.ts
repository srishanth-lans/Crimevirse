"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PlayerProfile,
  CaseData,
  GameState,
  Role,
  ChatMessage,
  DeductionLink,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

interface GameStore extends GameState {
  setPhase: (phase: GameState["phase"]) => void;
  createPlayer: (name: string, role: Role, photoDataUrl?: string) => void;
  setCurrentCase: (caseData: CaseData | null) => void;
  collectEvidence: (evidenceId: string) => void;
  interviewSuspect: (suspectId: string) => void;
  addNote: (note: string) => void;
  toggleOnline: () => void;
  toggleNight: () => void;
  sendChat: (text: string) => void;
  addDeductionLink: (fromId: string, toId: string, label?: string) => void;
  removeDeductionLink: (id: string) => void;
  setAccused: (suspectId: string | null) => void;
  resetGame: () => void;
  playerPosition: { x: number; z: number };
  setPlayerPosition: (x: number, z: number) => void;
}

const initialState: GameState = {
  phase: "menu",
  player: null,
  currentCase: null,
  collectedEvidence: [],
  interviewedSuspects: [],
  notes: [],
  isOnline: false,
  isNight: false,
  chatMessages: [],
  deductionLinks: [],
  accusedSuspectId: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPhase: (phase) => set({ phase }),

      createPlayer: (name, role, photoDataUrl) =>
        set({
          player: {
            id: uuidv4(),
            name,
            role,
            photoDataUrl,
            avatarStyle: "stylized",
            reputation: 0,
            casesSolved: 0,
          },
          phase: "hub",
          chatMessages: [
            {
              id: uuidv4(),
              sender: "Dispatch",
              text: `Welcome, ${name}. You are now on duty as ${role}.`,
              timestamp: Date.now(),
              isSystem: true,
            },
          ],
        }),

      setCurrentCase: (caseData) =>
        set({
          currentCase: caseData,
          collectedEvidence: [],
          interviewedSuspects: [],
          notes: [],
          deductionLinks: [],
          accusedSuspectId: null,
          phase: caseData ? "investigation" : "hub",
          chatMessages: caseData
            ? [
                ...get().chatMessages,
                {
                  id: uuidv4(),
                  sender: "Dispatch",
                  text: `New case assigned: ${caseData.title}. Proceed to scene.`,
                  timestamp: Date.now(),
                  isSystem: true,
                },
              ]
            : get().chatMessages,
        }),

      collectEvidence: (evidenceId) =>
        set((state) => ({
          collectedEvidence: state.collectedEvidence.includes(evidenceId)
            ? state.collectedEvidence
            : [...state.collectedEvidence, evidenceId],
        })),

      interviewSuspect: (suspectId) =>
        set((state) => ({
          interviewedSuspects: state.interviewedSuspects.includes(suspectId)
            ? state.interviewedSuspects
            : [...state.interviewedSuspects, suspectId],
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),

      toggleOnline: () =>
        set((state) => {
          const next = !state.isOnline;
          return {
            isOnline: next,
            chatMessages: [
              ...state.chatMessages,
              {
                id: uuidv4(),
                sender: "System",
                text: next
                  ? "You are now ONLINE. Other investigators can see you."
                  : "You are now OFFLINE. Solo mode.",
                timestamp: Date.now(),
                isSystem: true,
              },
            ],
          };
        }),

      toggleNight: () => set((state) => ({ isNight: !state.isNight })),

      sendChat: (text) => {
        const player = get().player;
        if (!text.trim() || !player) return;
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: uuidv4(),
              sender: player.name,
              text: text.trim(),
              timestamp: Date.now(),
            },
          ],
        }));
      },

      addDeductionLink: (fromId, toId, label) =>
        set((state) => ({
          deductionLinks: [
            ...state.deductionLinks,
            { id: uuidv4(), fromId, toId, label },
          ],
        })),

      removeDeductionLink: (id) =>
        set((state) => ({
          deductionLinks: state.deductionLinks.filter((l) => l.id !== id),
        })),

      setAccused: (suspectId) => set({ accusedSuspectId: suspectId }),

      resetGame: () => set(initialState),

      playerPosition: { x: 0, z: 4 },
      setPlayerPosition: (x, z) => set({ playerPosition: { x, z } }),
    }),
    {
      name: "crimeverse-storage-v2",
      partialize: (state) => ({
        player: state.player,
        isOnline: state.isOnline,
        isNight: state.isNight,
      }),
    }
  )
);
