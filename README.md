# LexiQ - A Wordle Clone

LexiQ is a polished Wordle clone built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Daily Mode** — One word per day, same for everyone, resets at midnight
- **Unlimited Mode** — Play as many games as you want with random words
- **Hard Mode** — Revealed hints must be used in subsequent guesses
- **Dark / Light Theme** — Persisted across sessions
- **Statistics** — Win rate, streaks, guess distribution
- **Animations** — Tile flip reveal, shake on invalid guess, bounce on win
- **Word Validation** — Uses the Datamuse API to check valid English words

## Project Structure

```
app/
  layout.tsx       ← Root layout (fonts, dark mode script)
  page.tsx         ← Main game controller
  globals.css      ← CSS variables, animations, tile/key styles

components/
  GameBoard.tsx    ← 6×5 tile grid with flip/shake/bounce animations
  Keyboard.tsx     ← On-screen keyboard with letter color states
  Header.tsx       ← Title, mode switcher, icon buttons
  HelpModal.tsx    ← How to play instructions
  StatsModal.tsx   ← Stats + countdown timer
  SettingsModal.tsx← Hard mode & dark theme toggles
  Toast.tsx        ← Notification toasts
  Confetti.tsx     ← Confetti animation on win

lib/
  types.ts         ← TypeScript types
  words.ts         ← Word list, daily word logic, Datamuse validation
  gameLogic.ts     ← Guess evaluation, hard mode, letter statuses, stats
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Dependencies

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS v3
- Google Fonts: Bebas Neue (display), Space Mono (mono), Inter (body)
- Datamuse API (word validation — no API key needed)

## Local Storage Keys

| Key | Purpose |
|-----|---------|
| `wordle-theme` | `'dark'` or `'light'` |
| `wordle-hard-mode` | `'true'` or `'false'` |
| `wordle-stats` | JSON stats object |
| `wordle-visited` | First-visit flag (shows help modal) |
| `wordle-daily-YYYY-M-D` | Daily game state (guesses, status) |