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
    <div className="flex flex-col gap-2 items-center w-full max-w-[500px]">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[6px] justify-center w-full">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === '⌫';
            const status = key.length === 1 ? letterStatuses[key] : undefined;

            return (
              <button
                key={key}
                onClick={() => !disabled && onKey(key)}
                disabled={disabled}
                className={`key ${status || ''} ${isWide ? 'text-sm font-bold' : 'uppercase'}`}
                style={{
                  minWidth: isWide ? 65 : 43,
                  fontSize: key === 'ENTER' ? '0.7rem' : key === '⌫' ? '1.2rem' : '0.9375rem',
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
  );
}