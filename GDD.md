# CrimeVerse – Game Design Document (GDD)
**Version 0.1 – MVP**  
**Tagline:** “Become the investigator. Solve the unsolvable.”

## 1. High Concept
CrimeVerse is a browser-based open-world crime investigation game inspired by *Free Guy*.  
Players create a digital version of themselves, choose a law-enforcement role, and solve cases (inspired by real events + original unsolved mysteries) in a living 3D city.  
Supports both single-player offline mode and multiplayer online mode with voice & text chat.

## 2. Target Platforms
- Primary: Web (Chrome / Edge / Firefox) – deployed on Vercel
- Later: Progressive Web App + possible native wrappers

## 3. Core Pillars
1. **You are the character** – Photo → stylized 3D avatar
2. **Role fantasy** – Police Officer, Forensic Specialist, Detective, etc.
3. **Investigation first** – Evidence, interviews, deduction, not pure action
4. **Living world** – NPCs, day/night, weather, ambient crime reports
5. **Social** – Play with friends, share cases, voice chat

## 4. Player Roles (MVP)
| Role                  | Strengths                          | Starting Tools                  |
|-----------------------|------------------------------------|---------------------------------|
| Police Officer        | Authority, interrogation, pursuit  | Handcuffs, radio, notebook     |
| Forensic Expert       | Evidence analysis, lab access      | Evidence kit, UV light, laptop  |
| Detective             | Deduction, cold cases, networking  | Case files, contacts, camera    |
| (Future) CSI / SWAT / Cyber | Specialised branches            | —                               |

Players can switch roles between cases or stay in one career path.

## 5. Character Creation
1. Upload a clear full-face photo (or selfie)
2. System generates a stylized low-poly / cartoon 3D avatar (Ready Player Me style or custom MediaPipe + glTF)
3. Choose role + uniform colour / accessories
4. Name + short bio (optional)

**MVP implementation:**  
- Photo upload → simple canvas-based stylization + placeholder 3D model  
- Later: integrate Ready Player Me or custom AI avatar pipeline

## 6. World Design (MVP)
- One city district: “Harbor District”
  - Police Station (hub)
  - Residential block
  - Small commercial street
  - Abandoned warehouse / crime scene areas
  - Park + riverfront
- Size: ~400 × 400 m playable area
- Day / night cycle (accelerated)
- Basic NPCs that walk routes and can be interviewed

## 7. Case Structure
Each case has:
- Briefing (received at station or via radio)
- Crime scene(s)
- Evidence items (physical + digital)
- Suspects / witnesses (dialogue trees)
- Lab analysis (forensic role gets deeper data)
- Deduction board (connect clues)
- Accusation / closing report
- Outcome: Solved / Partially Solved / Unsolved (affects reputation & unlocks)

### MVP Cases (3)
1. **The Midnight Courier** (inspired by real missing-person + package cases)  
   Short, tutorial case. Body found near river. Package missing.
2. **Cold Storage** (warehouse murder)  
   Forensic-heavy. Multiple blood types, timeline reconstruction.
3. **The Silent Caller** (unsolved-mystery style)  
   Series of anonymous calls, no body, conflicting alibis. Can remain unsolved.

All cases are **heavily fictionalised**. No real victim names or exact real events are used.

## 8. Gameplay Loop
1. Select role & load into station
2. Receive / choose case
3. Travel to scene(s) – walk / drive (simple vehicle later)
4. Collect evidence (click / interact)
5. Interview NPCs
6. Analyse in lab / at desk
7. Build theory on deduction board
8. Make arrest or file report
9. Debrief → rewards (XP, reputation, new tools, case unlocks)

## 9. Multiplayer (Online Mode)
- Lobbies of 2–8 players
- Shared case instances or cooperative investigation
- Text chat + proximity / party voice (WebRTC / LiveKit)
- Role synergy: Forensic player analyses while Officer interrogates
- Friend list + invite system (later)

## 10. Progression
- Reputation per role
- Unlock new tools, vehicles, districts, case difficulties
- Cosmetic uniforms & avatar customisation
- “Cold Case Archive” – permanent unsolved cases that can be revisited

## 11. Technical Architecture (MVP)
- **Frontend:** Next.js 15 + React Three Fiber + Drei + Zustand
- **3D:** Three.js, simple glTF models + procedural city pieces
- **State:** Zustand (local) + Supabase (later for online)
- **Multiplayer:** PartyKit or Socket.io (phase 2)
- **Voice:** LiveKit or simple-peer
- **Avatar:** Canvas photo processing + placeholder mesh → Ready Player Me later
- **Deploy:** Vercel (static + serverless)

## 12. Art Direction
- Stylised low-poly / slightly cartoon (readable, performant in browser)
- Colour palette: cool blues & greys for police, warm accents for evidence
- UI: Clean modern detective board aesthetic

## 13. MVP Success Criteria
- [ ] Player can upload photo and see a character representation
- [ ] Choose one of 3 roles
- [ ] Walk around a small 3D district
- [ ] Complete at least one full case (collect evidence → deduce → close)
- [ ] Basic text chat in a shared room
- [ ] Deployed and playable on Vercel

## 14. Roadmap
**Phase 1 (current):** Scaffold + character creation + first scene + 1 case  
**Phase 2:** Full 3 cases + deduction board + basic multiplayer  
**Phase 3:** Voice, more districts, vehicles, advanced forensics  
**Phase 4:** User-generated cases / community cold cases

---

*This document will evolve. All real-world inspiration is transformed into original fiction.*
