# CrimeVerse

**Open-world crime investigation game** – become the investigator, solve cases (inspired by real events + original mysteries), play offline or online with friends.

Built with **Next.js + React Three Fiber**. Designed to deploy on **Vercel**.

---

## Quick Start

```bash
cd crimeverse
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What is included in this MVP (0.1)

### A – Project + Playable Scene
- Full Next.js 15 + TypeScript + Tailwind project
- 3D Harbor District (Police Station + buildings + street lights)
- Orbit camera, day sky, simple player avatar
- Case selection from the station

### B – Game Design Document
- See `GDD.md` for the complete design (roles, cases, progression, roadmap)

### C – Photo → Character Prototype
- Upload any photo → canvas stylization (contrast + vignette)
- Choose role: Police Officer / Forensic Expert / Detective
- Name your character → enter the world
- Photo appears on your 3D avatar in the city

### Gameplay
1. Create character (photo + role)
2. Explore the 3D district (drag to look, scroll to zoom)
3. Choose one of 3 cases from the bottom panel
4. Collect evidence, interview suspects, take notes
5. Close the case when you have enough evidence

### Cases
1. **The Midnight Courier** (tutorial)
2. **Cold Storage** (forensic-heavy)
3. **The Silent Caller** (can remain unsolved)

All cases are original fiction inspired by real investigative themes.

---

## Tech Stack
- Next.js 15 (App Router)
- React Three Fiber + Drei + Three.js
- Zustand (state + local persistence)
- Tailwind CSS v4
- TypeScript

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo in [vercel.com](https://vercel.com)
3. Framework preset: Next.js
4. Deploy

Or from the CLI:

```bash
npx vercel
```

## Next Steps (Roadmap)
- [ ] Real multiplayer lobbies + text chat
- [ ] Voice chat (LiveKit / WebRTC)
- [ ] Better avatar pipeline (Ready Player Me or custom)
- [ ] More districts & vehicles
- [ ] Deduction board UI
- [ ] Day/night cycle & weather
- [ ] Supabase backend for online accounts

---

Made for the vision of a Free-Guy-style crime investigation experience in the browser.

## Latest Improvements (v0.2)

- **WASD / Arrow key movement** – walk around the Harbor District in third-person
- **Camera follows the player**
- **Interactive crime scene markers** – click red markers in the world to start cases
- **Improved city** – roads, street lamps, more buildings, stars
- **Online chat panel** – toggle Online and chat with simulated investigators (demo)
- **Better role-colored avatar** with photo floating above

Controls: WASD to move · Click red markers or use the bottom case list · Toggle Online for chat
