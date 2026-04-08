'use client';

import React from 'react';
import { GameMode } from '@/lib/types';

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  isDark: boolean;
  isHardMode: boolean;
}

export default function Header({
  mode, onModeChange, onOpenHelp, onOpenStats, onOpenSettings, isDark, isHardMode
}: HeaderProps) {
  return (
    <header
      className="w-full"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="max-w-xl mx-auto px-4 h-19 flex items-center justify-between">
        {/* Left icons */}
        <div className="flex items-center gap-1">
          <IconButton onClick={onOpenHelp} aria-label="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </IconButton>
        </div>

        {/* Title + Mode */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h1
              className="text-3xl tracking-widest select-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '0.12em' }}
            >
              LexiQ
            </h1>
            {isHardMode && (
              <span
                className="hard-mode-badge text-xs font-bold px-2 py-0.5 rounded-full border"
                style={{
                  color: '#ef4444',
                  borderColor: '#ef4444',
                  background: 'rgba(239,68,68,0.08)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                HARD
              </span>
            )}
          </div>
          {/* Mode switcher */}
          <div
            className="flex rounded-full overflow-hidden mt-1"
            style={{ background: 'var(--bg-secondary)', padding: '2px' }}
          >
            {(['daily', 'unlimited'] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className="px-3 py-0.5 rounded-full text-xs font-semibold capitalize transition-all duration-200"
                style={{
                  background: mode === m ? 'var(--text-primary)' : 'transparent',
                  color: mode === m ? 'var(--bg-primary)' : 'var(--text-secondary)',
                }}
              >
                {m === 'daily' ? '🌙 Daily' : '🎲 Unlimited'}
              </button>
            ))}
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <IconButton onClick={onOpenStats} aria-label="Statistics">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </IconButton>
          <IconButton onClick={onOpenSettings} aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function IconButton({ children, onClick, 'aria-label': label }: { children: React.ReactNode; onClick: () => void; 'aria-label': string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
      style={{ color: 'var(--text-secondary)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}