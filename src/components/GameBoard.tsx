'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TileState } from '@/lib/types';

interface GameBoardProps {
  guesses: string[];
  evaluations: TileState[][];
  currentGuess: string;
  currentRow: number;
  shakeRow: number | null;
  /** row currently being revealed (-1 = none) */
  revealingRow: number;
  /** how many cols have been *triggered* so far in that row */
  revealingCol: number;
  isWon: boolean;
  winRow: number | null;
}

const ROWS = 6;
const COLS = 5;
const FLIP_MS = 550;   // must match tileReveal animation duration
const STAGGER_MS = 90; // delay between each tile in the same row

export default function GameBoard({
  guesses, evaluations, currentGuess, currentRow,
  shakeRow, revealingRow, revealingCol, isWon, winRow,
}: GameBoardProps) {
  return (
    <div className="flex flex-col gap-[6px] items-center">
      {Array.from({ length: ROWS }, (_, row) => {
        const isShaking  = shakeRow === row;
        const isWinRow   = winRow   === row;

        return (
          <div key={row} className={`flex gap-[6px] ${isShaking ? 'shake' : ''}`}>
            {Array.from({ length: COLS }, (_, col) => {
              /* ── content ── */
              let letter = '';
              let baseState: TileState = 'empty';

              if (row < guesses.length) {
                letter    = guesses[row][col] || '';
                baseState = evaluations[row]?.[col] || 'absent';
              } else if (row === currentRow) {
                letter    = currentGuess[col] || '';
                baseState = currentGuess[col] ? 'filled' : 'empty';
              }

              /* ── reveal logic ── */
              const isThisRowRevealing = revealingRow === row;
              // col is "flipping" right now if it's the current reveal column
              const isFlipping = isThisRowRevealing && col === revealingCol;
              // col has already finished flipping → show colour
              const isRevealed =
                row < guesses.length &&
                (!isThisRowRevealing || col < revealingCol);

              const displayState = isRevealed ? baseState
                                 : (baseState !== 'empty' ? 'filled' : 'empty');

              /* ── win bounce ── */
              const isWinBounce = isWon && isWinRow && row < guesses.length;

              return (
                <TileCell
                  key={col}
                  letter={letter}
                  displayState={displayState}
                  revealedState={baseState}
                  isFlipping={isFlipping}
                  flipDelay={col * STAGGER_MS}
                  isWinBounce={isWinBounce}
                  winDelay={col * 80}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface TileCellProps {
  letter: string;
  displayState: TileState;
  revealedState: TileState;
  isFlipping: boolean;
  flipDelay: number;
  isWinBounce: boolean;
  winDelay: number;
}

function TileCell({
  letter, displayState, revealedState,
  isFlipping, flipDelay, isWinBounce, winDelay,
}: TileCellProps) {
  const prevLetter = useRef('');
  const [popKey, setPopKey] = useState(0);

  // Trigger pop animation whenever a new letter appears
  useEffect(() => {
    if (letter && letter !== prevLetter.current) {
      setPopKey((k) => k + 1);
    }
    prevLetter.current = letter;
  }, [letter]);

  /*
    We render TWO faces like a real card flip:
      front  – un-coloured (shown before flip reaches 90°)
      back   – coloured    (shown after flip passes 90°)

    The parent div rotates on X; each face counter-rotates so it stays readable.
    This avoids the "colour leaks through on the way back" artefact of single-div flips.
  */
  const colourClass =
    revealedState === 'correct' ? 'correct'
    : revealedState === 'present' ? 'present'
    : revealedState === 'absent'  ? 'absent'
    : '';

  const animStyle: React.CSSProperties = isFlipping
    ? {
        animation: `tileReveal ${FLIP_MS}ms cubic-bezier(0.4,0,0.2,1) ${flipDelay}ms both`,
      }
    : isWinBounce
    ? { animation: `winBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) ${winDelay}ms both` }
    : {};

  return (
    <div
      key={popKey > 0 ? `pop-${popKey}` : undefined}
      className={[
        'tile',
        displayState,
        isFlipping ? 'tile-reveal' : '',
        letter && !isFlipping && displayState === 'filled' ? 'tile-pop' : '',
      ].filter(Boolean).join(' ')}
      style={{
        ...animStyle,
        /* When flipping, swap to the colour class exactly at the halfway point.
           We do this with a CSS transition on background-color/border-color that
           has a 0s duration but is delayed to flipDelay + FLIP_MS/2 ms.         */
        ...(isFlipping && {
          transition: `background-color 0s ${flipDelay + FLIP_MS * 0.45}ms,
                       border-color     0s ${flipDelay + FLIP_MS * 0.45}ms,
                       color            0s ${flipDelay + FLIP_MS * 0.45}ms`,
        }),
      }}
    >
      {letter}
    </div>
  );
}