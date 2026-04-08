import { TileState, HardModeConstraints } from './types';

export function evaluateGuess(guess: string, target: string): TileState[] {
  const result: TileState[] = new Array(5).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');
  
  // First pass: find correct positions
  const targetUsed = new Array(5).fill(false);
  const guessUsed = new Array(5).fill(false);
  
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }
  
  // Second pass: find present letters
  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (targetUsed[j]) continue;
      if (guessArr[i] === targetArr[j]) {
        result[i] = 'present';
        targetUsed[j] = true;
        break;
      }
    }
  }
  
  return result;
}

export function getHardModeConstraints(
  guesses: string[],
  evaluations: TileState[][]
): HardModeConstraints {
  const requiredPositions: { [position: number]: string } = {};
  const requiredLettersSet = new Set<string>();
  
  for (let gi = 0; gi < guesses.length; gi++) {
    const guess = guesses[gi];
    const evaluation = evaluations[gi];
    for (let i = 0; i < 5; i++) {
      if (evaluation[i] === 'correct') {
        requiredPositions[i] = guess[i];
      } else if (evaluation[i] === 'present') {
        requiredLettersSet.add(guess[i]);
      }
    }
  }
  
  return {
    requiredPositions,
    requiredLetters: Array.from(requiredLettersSet),
  };
}

export function validateHardModeGuess(
  guess: string,
  constraints: HardModeConstraints
): string | null {
  // Check required positions
  for (const [pos, letter] of Object.entries(constraints.requiredPositions)) {
    const position = parseInt(pos);
    if (guess[position] !== letter) {
      const ordinals = ['1st', '2nd', '3rd', '4th', '5th'];
      return `${ordinals[position]} letter must be ${letter}`;
    }
  }
  
  // Check required letters
  for (const letter of constraints.requiredLetters) {
    if (!guess.includes(letter)) {
      return `Guess must contain ${letter}`;
    }
  }
  
  return null;
}

export function getLetterStatuses(
  guesses: string[],
  evaluations: TileState[][]
): Record<string, TileState> {
  const statuses: Record<string, TileState> = {};
  
  for (let gi = 0; gi < guesses.length; gi++) {
    const guess = guesses[gi];
    const evaluation = evaluations[gi];
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      const current = statuses[letter];
      const next = evaluation[i];
      
      // Priority: correct > present > absent
      if (current === 'correct') continue;
      if (current === 'present' && next === 'absent') continue;
      statuses[letter] = next;
    }
  }
  
  return statuses;
}

export function loadStats(): import('./types').Stats {
  if (typeof window === 'undefined') return defaultStats();
  try {
    const stored = localStorage.getItem('wordle-stats');
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultStats();
}

export function saveStats(stats: import('./types').Stats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('wordle-stats', JSON.stringify(stats));
  } catch {}
}

export function updateStats(
  stats: import('./types').Stats,
  won: boolean,
  guessCount: number,
  todayKey: string
): import('./types').Stats {
  const updated = { ...stats };
  updated.gamesPlayed++;
  
  if (won) {
    updated.gamesWon++;
    // Update streak
    if (updated.lastWonDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      if (updated.lastWonDate === yKey || updated.lastWonDate === todayKey) {
        updated.currentStreak++;
      } else {
        updated.currentStreak = 1;
      }
    } else {
      updated.currentStreak = 1;
    }
    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    updated.guessDistribution[guessCount - 1]++;
    updated.lastWonDate = todayKey;
  } else {
    updated.currentStreak = 0;
  }
  
  updated.lastPlayedDate = todayKey;
  return updated;
}

function defaultStats(): import('./types').Stats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };
}