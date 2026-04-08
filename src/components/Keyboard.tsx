'use client';

import React from 'react';
import { TileState } from '@/lib/types';

interface KeyboardProps {
  onKey: (key: string) => void;
  letterStatuses: Record<string, TileState>;
  disabled?: boolean;
}

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

export default function Keyboard({ onKey, letterStatuses, disabled }: KeyboardProps) {
  return (
    <div className="w-full px-1" style={{ maxWidth: '500px' }}>
      <div className="flex flex-col gap-[5px]">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-[5px] justify-center">
            {row.map((key) => {
              const isWide   = key === 'ENTER' || key === '⌫';
              const status   = key.length === 1 ? letterStatuses[key] : undefined;

              return (
                <button
                  key={key}
                  onClick={() => !disabled && onKey(key)}
                  disabled={disabled}
                  className={`key ${status || ''}`}
                  style={{
                    /* flex-based sizing: wide keys get ~1.6× a normal key */
                    flex: isWide ? '1.6 1 0' : '1 1 0',
                    minWidth: 0,          /* allow shrinking below content */
                    maxWidth: isWide ? 72 : 45,
                    fontSize: key === 'ENTER' ? '0.65rem' : key === '⌫' ? '1.1rem' : '0.9rem',
                    padding: '0 2px',
                  }}
                  aria-label={key === '⌫' ? 'Backspace' : key}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}