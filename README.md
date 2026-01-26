# Birthday Love Letter Experience

A cinematic, romantic, and animated birthday experience built with Next.js App Router, Tailwind CSS, Framer Motion, and a lightweight WebSocket chat.

## ✨ Features

- Landing page countdown with animated background and music toggle
- Passcode gate (two valid passcodes via environment variables)
- Trailer page with cinematic loader and gated "Explore More" CTA
- Surprise dashboard with chat, guestbook, poem, and gift reveal
- Mobile-first design with glassmorphism and smooth transitions

## 🚀 Getting Started

1. Install dependencies

```bash
npm install
```

2. Create a local environment file

```bash
copy .env.example .env.local
```

3. Update .env.local with your passcodes and (optional) WebSocket URL

```env
NEXT_PUBLIC_PASSCODE_ME=MYCODE123
NEXT_PUBLIC_PASSCODE_HER=HERLOVE456
NEXT_PUBLIC_PASSCODE_GUEST=GUEST000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=gf_birthday
```

4. Start the WebSocket server (for chat)

```bash
npm run dev:ws
```

5. Start the Next.js app

```bash
npm run dev
```

Open http://localhost:3000

## 🎬 Assets to Replace

- public/trailer.mp4 → your birthday trailer video
- public/bg.mp3 → background music
- public/surprise.svg → replace with your real photo or image

## 🧠 Notes

- The chat is session-only and intended for a single celebration moment.
- The passcode gate is symbolic (no real authentication).
- Works best in modern browsers with audio/video autoplay policies.
