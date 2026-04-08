'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';
import Header from '@/components/Header';
import HelpModal from '@/components/HelpModal';
import StatsModal from '@/components/StatsModal';
import SettingsModal from '@/components/SettingsModal';
import { ToastManager } from '@/components/Toast';
import Confetti from '@/components/Confetti';
import { GameMode, TileState } from '@/lib/types';
import {
  evaluateGuess,
  getHardModeConstraints,
  validateHardModeGuess,
  getLetterStatuses,
  loadStats,
  saveStats,
  updateStats,
} from '@/lib/gameLogic';
import {
  getDailyWord,
  getDailyKey,
  getRandomWord,
  validateWord,
} from '@/lib/words';

const MAX_GUESSES  = 6;
const WORD_LENGTH  = 5;
const FLIP_MS      = 550;  // match globals.css tileReveal duration
const STAGGER_MS   = 90;   // match GameBoard STAGGER_MS

interface Toast { id: number; message: string; }
let toastId = 0;

export default function Page() {
  // Theme
  const [isDark, setIsDark] = useState(false);

  // Mode
  const [mode, setMode] = useState<GameMode>('daily');

  // Game state
  const [targetWord, setTargetWord]     = useState('');
  const [guesses, setGuesses]           = useState<string[]>([]);
  const [evaluations, setEvaluations]   = useState<TileState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus]     = useState<'playing' | 'won' | 'lost'>('playing');
  const [isValidating, setIsValidating] = useState(false);

  // Hard mode
  const [isHardMode, setIsHardMode] = useState(false);

  // Animation state  (-1 = not revealing)
  const [shakeRow, setShakeRow]         = useState<number | null>(null);
  const [revealingRow, setRevealingRow] = useState(-1);
  const [revealingCol, setRevealingCol] = useState(-1);
  const [isWon, setIsWon]               = useState(false);
  const [winRow, setWinRow]             = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Modals
  const [showHelp,     setShowHelp]     = useState(false);
  const [showStats,    setShowStats]    = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Stats
  const [stats, setStats] = useState(loadStats);

  const isRevealingRef = useRef(false);

  /* ── Theme ── */
  useEffect(() => {
    try {
      if (localStorage.getItem('wordle-theme') === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try { localStorage.setItem('wordle-theme', next ? 'dark' : 'light'); } catch {}
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  /* ── Toasts ── */
  const addToast = useCallback((message: string) => {
    const id = ++toastId;
    setToasts((p) => [...p.slice(-2), { id, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2200);
  }, []);

  /* ── Save daily state ── */
  const saveDailyState = useCallback(
    (g: string[], e: TileState[][], status: 'playing' | 'won' | 'lost') => {
      if (mode !== 'daily') return;
      try {
        localStorage.setItem(
          `wordle-daily-${getDailyKey()}`,
          JSON.stringify({ guesses: g, evaluations: e, gameStatus: status }),
        );
      } catch {}
    },
    [mode],
  );

  /* ── Init ── */
  const initGame = useCallback((gameMode: GameMode) => {
    let word: string;

    if (gameMode === 'daily') {
      const dailyKey = getDailyKey();
      word = getDailyWord();
      try {
        const saved = localStorage.getItem(`wordle-daily-${dailyKey}`);
        if (saved) {
          const s = JSON.parse(saved);
          setGuesses(s.guesses);
          setEvaluations(s.evaluations);
          setTargetWord(word);
          setCurrentGuess('');
          setGameStatus(s.gameStatus);
          setIsWon(s.gameStatus === 'won');
          setWinRow(s.gameStatus === 'won' ? s.guesses.length - 1 : null);
          setRevealingRow(-1);
          setRevealingCol(-1);
          setShakeRow(null);
          setShowConfetti(false);
          if (s.gameStatus !== 'playing') setTimeout(() => setShowStats(true), 600);
          return;
        }
      } catch {}
    } else {
      word = getRandomWord();
    }

    setTargetWord(word);
    setGuesses([]);
    setEvaluations([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setIsWon(false);
    setWinRow(null);
    setRevealingRow(-1);
    setRevealingCol(-1);
    setShakeRow(null);
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem('wordle-hard-mode') === 'true') setIsHardMode(true);
    } catch {}
  }, []);

  useEffect(() => { initGame(mode); }, [mode, initGame]);

  useEffect(() => {
    try {
      if (!localStorage.getItem('wordle-visited')) {
        setShowHelp(true);
        localStorage.setItem('wordle-visited', 'true');
      }
    } catch {}
  }, []);

  /* ── Smooth reveal animation ──
     Each tile flips independently with a stagger.
     We advance revealingCol every STAGGER_MS ms so GameBoard knows
     which tile to animate next. After all cols are triggered we wait
     for the last flip to finish, then call onComplete.
  */
  const runReveal = useCallback(
    (rowIndex: number, onComplete: () => void) => {
      isRevealingRef.current = true;
      setRevealingRow(rowIndex);
      setRevealingCol(0);

      let col = 0;
      const advance = () => {
        col++;
        if (col < WORD_LENGTH) {
          setRevealingCol(col);
          setTimeout(advance, STAGGER_MS);
        } else {
          // Wait for the last tile's flip to finish
          setTimeout(() => {
            setRevealingRow(-1);
            setRevealingCol(-1);
            isRevealingRef.current = false;
            onComplete();
          }, FLIP_MS);
        }
      };
      setTimeout(advance, STAGGER_MS);
    },
    [],
  );

  /* ── Submit ── */
  const submitGuess = useCallback(async () => {
    if (isRevealingRef.current || isValidating) return;
    if (gameStatus !== 'playing') return;

    if (currentGuess.length !== WORD_LENGTH) {
      addToast('Not enough letters');
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 600);
      return;
    }

    if (isHardMode && guesses.length > 0) {
      const constraints = getHardModeConstraints(guesses, evaluations);
      const error = validateHardModeGuess(currentGuess, constraints);
      if (error) {
        addToast(error);
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 600);
        return;
      }
    }

    setIsValidating(true);
    const valid = await validateWord(currentGuess);
    setIsValidating(false);

    if (!valid) {
      addToast('Not in word list');
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 600);
      return;
    }

    const evaluation  = evaluateGuess(currentGuess, targetWord);
    const newGuesses  = [...guesses, currentGuess];
    const newEvals    = [...evaluations, evaluation];
    const won         = evaluation.every((e) => e === 'correct');
    const lost        = !won && newGuesses.length >= MAX_GUESSES;
    const rowIndex    = guesses.length;

    setGuesses(newGuesses);
    setEvaluations(newEvals);
    setCurrentGuess('');

    runReveal(rowIndex, () => {
      if (won) {
        const msgs = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        addToast(msgs[Math.min(rowIndex, msgs.length - 1)]);
        setIsWon(true);
        setWinRow(rowIndex);
        setGameStatus('won');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4500);

        const ns = updateStats(stats, true, newGuesses.length, getDailyKey());
        setStats(ns); saveStats(ns);
        saveDailyState(newGuesses, newEvals, 'won');
        setTimeout(() => setShowStats(true), 2200);
      } else if (lost) {
        addToast(targetWord);
        setGameStatus('lost');
        const ns = updateStats(stats, false, newGuesses.length, getDailyKey());
        setStats(ns); saveStats(ns);
        saveDailyState(newGuesses, newEvals, 'lost');
        setTimeout(() => setShowStats(true), 2400);
      } else {
        saveDailyState(newGuesses, newEvals, 'playing');
      }
    });
  }, [
    isValidating, gameStatus, currentGuess, guesses, evaluations,
    targetWord, isHardMode, stats, addToast, runReveal, saveDailyState,
  ]);

  /* ── Key handler ── */
  const handleKey = useCallback((key: string) => {
    if (isRevealingRef.current || isValidating) return;
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER' || key === 'Enter') {
      submitGuess();
    } else if (key === '⌫' || key === 'Backspace') {
      setCurrentGuess((p) => p.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((p) => (p + key).toUpperCase());
    }
  }, [isValidating, gameStatus, currentGuess, submitGuess]);

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (showHelp || showStats || showSettings) return;
      handleKey(e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey, showHelp, showStats, showSettings]);

  /* ── Mode change ── */
  const handleModeChange = useCallback((m: GameMode) => {
    if (m !== mode) setMode(m);
  }, [mode]);

  /* ── Hard mode toggle ── */
  const toggleHardMode = useCallback(() => {
    if (guesses.length > 0) return;
    setIsHardMode((p) => {
      const next = !p;
      try { localStorage.setItem('wordle-hard-mode', String(next)); } catch {}
      return next;
    });
  }, [guesses.length]);

  /* ── New game ── */
  const handleNewGame = useCallback(() => {
    if (mode === 'unlimited') initGame('unlimited');
  }, [mode, initGame]);

  const letterStatuses = getLetterStatuses(guesses, evaluations);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Confetti active={showConfetti} />

      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onOpenHelp={() => setShowHelp(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
        isDark={isDark}
        isHardMode={isHardMode}
      />

      <main className="flex-1 flex flex-col items-center justify-between py-4 gap-4 max-w-xl mx-auto w-full px-2">
        <div className="flex-1 flex items-center justify-center">
          <GameBoard
            guesses={guesses}
            evaluations={evaluations}
            currentGuess={currentGuess}
            currentRow={guesses.length}
            shakeRow={shakeRow}
            revealingRow={revealingRow}
            revealingCol={revealingCol}
            isWon={isWon}
            winRow={winRow}
          />
        </div>

        <Keyboard
          onKey={handleKey}
          letterStatuses={letterStatuses}
          disabled={gameStatus !== 'playing'}
        />
      </main>

      <ToastManager
        toasts={toasts}
        onRemove={(id) => setToasts((p) => p.filter((t) => t.id !== id))}
      />

      {showHelp     && <HelpModal    onClose={() => setShowHelp(false)} />}
      {showStats    && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStats(false)}
          gameStatus={gameStatus}
          mode={mode}
          onNewGame={mode === 'unlimited' ? handleNewGame : undefined}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          isHardMode={isHardMode}
          onToggleHardMode={toggleHardMode}
          isDark={isDark}
          onToggleDark={toggleDark}
          gameStarted={guesses.length > 0}
        />
      )}
    </div>
  );
}