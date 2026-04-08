'use client';

import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-enter relative w-full max-w-md rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity text-xl"
          style={{ color: 'var(--text-primary)' }}
        >
          ✕
        </button>

        <h2
          className="text-3xl font-bold text-center mb-2 tracking-wider"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          HOW TO PLAY
        </h2>
        <p className="text-center text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Guess the word in 6 tries.
        </p>

        <div className="space-y-3 mb-6 text-sm" style={{ color: 'var(--text-primary)' }}>
          <p>• Each guess must be a valid 5-letter word.</p>
          <p>• The color of the tiles will change to show how close your guess was.</p>
        </div>

        {/* Examples */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex gap-1.5 mb-2">
              {['W','E','A','R','Y'].map((l, i) => (
                <div
                  key={i}
                  className="tile"
                  style={{
                    width: 48, height: 48, fontSize: '1.5rem',
                    background: i === 0 ? '#22c55e' : 'var(--bg-secondary)',
                    borderColor: i === 0 ? '#22c55e' : 'var(--border-color)',
                    color: i === 0 ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>W</strong> is in the word and in the correct spot.
            </p>
          </div>

          <div>
            <div className="flex gap-1.5 mb-2">
              {['P','I','L','L','S'].map((l, i) => (
                <div
                  key={i}
                  className="tile"
                  style={{
                    width: 48, height: 48, fontSize: '1.5rem',
                    background: i === 1 ? '#f59e0b' : 'var(--bg-secondary)',
                    borderColor: i === 1 ? '#f59e0b' : 'var(--border-color)',
                    color: i === 1 ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>I</strong> is in the word but in the wrong spot.
            </p>
          </div>

          <div>
            <div className="flex gap-1.5 mb-2">
              {['V','A','G','U','E'].map((l, i) => (
                <div
                  key={i}
                  className="tile"
                  style={{
                    width: 48, height: 48, fontSize: '1.5rem',
                    background: i === 3 ? '#6b7280' : 'var(--bg-secondary)',
                    borderColor: i === 3 ? '#6b7280' : 'var(--border-color)',
                    color: i === 3 ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>U</strong> is not in the word at all.
            </p>
          </div>
        </div>

        {/* Hard mode */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔥</span>
            <h3 className="font-bold text-sm tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              Hard Mode
            </h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            In Hard Mode, any revealed hints must be used in subsequent guesses. Green letters must stay in position, and yellow letters must appear somewhere in your next guess.
          </p>
        </div>

        {/* Modes */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌙</span>
            <h3 className="font-bold text-sm tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              Daily Mode
            </h3>
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            A new word every day at midnight. Everyone gets the same word.
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎲</span>
            <h3 className="font-bold text-sm tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              Unlimited Mode
            </h3>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Play as many games as you want with random words.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-xl font-bold text-sm tracking-wider text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: '#22c55e' }}
        >
          LET&apos;S PLAY
        </button>
      </div>
    </div>
  );
}