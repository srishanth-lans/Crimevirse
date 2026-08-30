export type Role = "police" | "forensic" | "detective";

export interface PlayerProfile {
  id: string;
  name: string;
  role: Role;
  photoDataUrl?: string;
  avatarStyle: "stylized" | "realistic";
  reputation: number;
  casesSolved: number;
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  type: "physical" | "digital" | "testimony" | "lab";
  location: string;
  analyzed?: boolean;
  analysisResult?: string;
  image?: string;
}

export interface Suspect {
  id: string;
  name: string;
  description: string;
  alibi: string;
  isGuilty: boolean;
  dialogue: { question: string; answer: string }[];
}

export interface CaseData {
  id: string;
  title: string;
  briefing: string;
  difficulty: "tutorial" | "easy" | "medium" | "hard";
  location: string;
  evidence: Evidence[];
  suspects: Suspect[];
  solutionSummary: string;
  canRemainUnsolved: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface DeductionLink {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}

export interface GameState {
  phase: "menu" | "character" | "hub" | "investigation" | "debrief";
  player: PlayerProfile | null;
  currentCase: CaseData | null;
  collectedEvidence: string[];
  interviewedSuspects: string[];
  notes: string[];
  isOnline: boolean;
  isNight: boolean;
  chatMessages: ChatMessage[];
  deductionLinks: DeductionLink[];
  accusedSuspectId: string | null;
}
