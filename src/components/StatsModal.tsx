'use client';

import React, { useEffect, useState } from 'react';
import { Stats } from '@/lib/types';
import { getTimeUntilMidnight } from '@/lib/words';

interface StatsModalProps {
  stats: Stats;
  onClose: () => void;
  gameStatus: 'playing' | 'won' | 'lost';
  mode: 'daily' | 'unlimited';
  onNewGame?: () => void;
}

export default function StatsModal({ stats, onClose, gameStatus, mode, onNewGame }: StatsModalProps) {
  const [timer, setTimer] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxDist = Math.max(...stats.guessDistribution, 1);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-enter relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity text-xl"
          style={{ color: 'var(--text-primary)' }}
        >
          ✕
        </button>

        <h2
          className="text-3xl font-bold text-center mb-6 tracking-wider"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          STATISTICS
        </h2>

        {/* Stat numbers */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { value: stats.gamesPlayed, label: 'Played' },
            { value: winRate, label: 'Win %' },
            { value: stats.currentStreak, label: 'Streak' },
            { value: stats.maxStreak, label: 'Best' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-4xl font-black leading-none mb-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {value}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Guess distribution */}
        <div className="mb-6">
          <h3
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Guess Distribution
          </h3>
          <div className="flex flex-col gap-1.5">
            {stats.guessDistribution.map((count, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="text-sm font-bold w-4 text-right flex-shrink-0"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div
                    className="bar-fill h-6 rounded flex items-center justify-end pr-2 min-w-[24px]"
                    style={{
                      width: `${Math.max((count / maxDist) * 100, 8)}%`,
                      background: count > 0 ? '#22c55e' : 'var(--key-bg)',
                    }}
                  >
                    <span className="text-xs font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {mode === 'daily' && gameStatus !== 'playing' && (
            <div
              className="flex-1 rounded-xl p-3 text-center"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
                Next Word
              </div>
              <div
                className="text-2xl font-bold timer-digit"
                style={{ color: 'var(--text-primary)' }}
              >
                {pad(timer.hours)}:{pad(timer.minutes)}:{pad(timer.seconds)}
              </div>
            </div>
          )}

          {(mode === 'unlimited' || gameStatus !== 'playing') && onNewGame && (
            <button
              onClick={() => { onClose(); onNewGame(); }}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white text-sm tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#22c55e' }}
            >
              {mode === 'unlimited' ? '🎲 NEW GAME' : '🔄 PLAY AGAIN'}
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--key-bg)', color: 'var(--key-text)' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}