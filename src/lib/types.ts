export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';
export type GameMode = 'daily' | 'unlimited';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface Tile {
  letter: string;
  state: TileState;
  isRevealing?: boolean;
}

export interface GameState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: GameStatus;
  evaluations: TileState[][];
  mode: GameMode;
  isHardMode: boolean;
  dailyKey?: string;
}

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastPlayedDate?: string;
  lastWonDate?: string;
}

export interface HardModeConstraints {
  // Letters that must be in specific positions (from correct tiles)
  requiredPositions: { [position: number]: string };
  // Letters that must appear somewhere (from present tiles)
  requiredLetters: string[];
}