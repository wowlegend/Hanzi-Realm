export interface CharOption {
  char: string;
  hint: string;
  explanation: string;
}

export interface Level {
  id: number;
  scenario: string;
  sentence_prefix: string;
  sentence_suffix: string;
  missing_char: string;
  options: CharOption[];
  correct_explanation: string;
}

export type CompanionRarity = 'common' | 'rare' | 'legendary';

export interface Companion {
  id: string;
  name: string;
  emoji: string;
  rarity: CompanionRarity;
  unlocked: boolean;
}

export interface GameState {
  currentLevelIndex: number;
  jade: number;
  currentStreak: number;
  bestStreak: number;
  selectedOption: string | null;
  isCorrect: boolean | null;
  showFeedback: boolean;
  questionsAnswered: number;
  bossesDefeated: number;
  wordsLearned: Set<string>;
  gradeLevel: number;
  worldNumber: number;
  seenQuestionIds: Set<number>;
}

export interface PlayerInventory {
  theme: 'meadow' | 'magma' | 'cyber';
  activeCompanion: string | null;
  companions: Companion[];
}

export interface GameSettings {
  elevenLabsApiKey: string;
  audioLanguage: 'zh-CN' | 'zh-HK';
  useElevenLabs: boolean;
  voiceId: string;
  gradeLevel: number;
  audioSpeed: number;
}

export interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  bossesDefeated: number;
  jadeEarned: number;
  wordsLearned: string[];
}
