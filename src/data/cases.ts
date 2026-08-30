import type { CaseData } from "@/types";

export const CASES: CaseData[] = [
  {
    id: "midnight-courier",
    title: "The Midnight Courier",
    briefing:
      "A delivery courier was found near the riverfront at 02:17. The package he was carrying is missing. No signs of forced struggle, but his radio was smashed. This is your tutorial case – walk the scene, collect three pieces of evidence, and interview the night guard.",
    difficulty: "tutorial",
    location: "Riverfront / Harbor District",
    evidence: [
      {
        id: "ev-1",
        name: "Smashed Radio",
        description: "Courier’s company radio, broken with force. Last transmission cut mid-sentence.",
        type: "physical",
        location: "Riverbank",
      },
      {
        id: "ev-2",
        name: "Partial Footprint",
        description: "Muddy footprint size 11, left shoe. Pattern matches common work boots.",
        type: "physical",
        location: "Near body",
      },
      {
        id: "ev-3",
        name: "Empty Package Manifest",
        description: "Digital copy recovered from courier’s tablet. Package marked ‘Fragile – Medical’.",
        type: "digital",
        location: "Tablet (lab)",
      },
    ],
    suspects: [
      {
        id: "sus-1",
        name: "Marcus Hale (Night Guard)",
        description: "Works the warehouse gate. Claims he saw the courier leave at 01:50.",
        alibi: "Was on patrol of the east fence the entire time.",
        isGuilty: false,
        dialogue: [
          {
            question: "Did you see anyone else near the river?",
            answer: "Only the usual late-night joggers. Nothing suspicious… or so I thought.",
          },
          {
            question: "What about the package?",
            answer: "He said it was medical supplies for the clinic. I didn’t open it.",
          },
        ],
      },
      {
        id: "sus-2",
        name: "Unknown Figure (CCTV)",
        description: "Blurry figure on distant camera, approx 1:55–2:05.",
        alibi: "N/A",
        isGuilty: true,
        dialogue: [],
      },
    ],
    solutionSummary:
      "The courier was attacked by someone who wanted the medical package. The night guard is cleared. The case remains partially open regarding the identity of the attacker.",
    canRemainUnsolved: true,
  },
  {
    id: "cold-storage",
    title: "Cold Storage",
    briefing:
      "A body was discovered inside the abandoned cold-storage warehouse on Pier 7. The victim had been dead for at least 36 hours. Temperature logs show the freezers were switched off deliberately. Forensic priority.",
    difficulty: "medium",
    location: "Pier 7 Warehouse",
    evidence: [
      {
        id: "ev-cs-1",
        name: "Temperature Log",
        description: "System shows freezers offline from 22:00 two nights ago until discovery.",
        type: "digital",
        location: "Control room",
      },
      {
        id: "ev-cs-2",
        name: "Blood Trace (Type A+)",
        description: "Small trail leading from loading bay to freezer unit 3.",
        type: "physical",
        location: "Loading bay",
      },
      {
        id: "ev-cs-3",
        name: "Keycard Access",
        description: "Keycard of former employee ‘R. Voss’ used at 21:47 the night before.",
        type: "digital",
        location: "Access panel",
      },
      {
        id: "ev-cs-4",
        name: "Tool Mark on Lock",
        description: "Crowbar marks on the external padlock. Fresh.",
        type: "physical",
        location: "Side entrance",
      },
    ],
    suspects: [
      {
        id: "sus-cs-1",
        name: "R. Voss (Former Employee)",
        description: "Fired three weeks ago for theft. Keycard should have been deactivated.",
        alibi: "Claims he was at a friend’s house across town.",
        isGuilty: true,
        dialogue: [
          {
            question: "Why was your keycard still active?",
            answer: "I don’t know. Maybe they never cancelled it. I wasn’t there.",
          },
        ],
      },
      {
        id: "sus-cs-2",
        name: "Lena Ortiz (Night Manager)",
        description: "Last person to leave the warehouse the previous evening.",
        alibi: "Left at 20:30, went straight home. CCTV confirms exit.",
        isGuilty: false,
        dialogue: [
          {
            question: "Anyone else have access after hours?",
            answer: "Only security and the old maintenance crew. Voss shouldn’t have.",
          },
        ],
      },
    ],
    solutionSummary:
      "R. Voss used his still-active keycard, disabled the freezers, and left the victim inside. Motive appears to be personal revenge related to the earlier theft accusation.",
    canRemainUnsolved: false,
  },
  {
    id: "silent-caller",
    title: "The Silent Caller",
    briefing:
      "Over the last nine days the station has received seven anonymous calls. The caller never speaks – only a low humming sound and then disconnect. No threats, no demands. Yesterday a small unmarked package arrived at the station containing a single burned photograph. This case can remain unsolved.",
    difficulty: "hard",
    location: "Multiple – city-wide",
    evidence: [
      {
        id: "ev-sc-1",
        name: "Call Logs",
        description: "Seven calls from different prepaid numbers, all purchased the same day from different kiosks.",
        type: "digital",
        location: "Station records",
      },
      {
        id: "ev-sc-2",
        name: "Burned Photograph",
        description: "Partially burned photo of a street corner. Reverse side has faint handwriting: ‘Still watching’.",
        type: "physical",
        location: "Station mail room",
      },
      {
        id: "ev-sc-3",
        name: "Audio Analysis",
        description: "The hum matches the frequency of an old fluorescent ballast. Possible location clue.",
        type: "lab",
        location: "Forensics lab",
      },
    ],
    suspects: [
      {
        id: "sus-sc-1",
        name: "Unknown",
        description: "No clear suspect yet. Pattern suggests someone with knowledge of police routines.",
        alibi: "N/A",
        isGuilty: false,
        dialogue: [],
      },
    ],
    solutionSummary:
      "The case is designed to remain open. Players who gather all evidence unlock a special ‘Cold Case’ entry for future updates. The humming and photo point toward an abandoned office building on the east side – future content.",
    canRemainUnsolved: true,
  },
];

export function getCaseById(id: string): CaseData | undefined {
  return CASES.find((c) => c.id === id);
}
