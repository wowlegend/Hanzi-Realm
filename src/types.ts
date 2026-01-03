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
export type BuffType = 'jade_boost' | 'streak_shield' | 'combo_master';

export interface Companion {
  id: string;
  name: string;
  emoji: string;
  avatarSeed: string;
  rarity: CompanionRarity;
  unlocked: boolean;
  buffType: BuffType;
  buffValue: number;
}

export type NodeType = 'battle' | 'blind' | 'treasure' | 'boss';
export type NodeStatus = 'locked' | 'unlocked' | 'completed';

export interface MapNode {
  id: string;
  type: NodeType;
  status: NodeStatus;
  position: { x: number; y: number };
  reward?: number;
}

export type GameMode = 'standard' | 'listening';
export type MusicState = 'menu' | 'map' | 'battle' | 'boss';

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
  gameMode: GameMode;
  streakShieldActive: boolean;
  streakShieldUsed: boolean;
  fireMode: boolean;
  currentNodeId: string | null;
}

export interface WorldMapState {
  nodes: MapNode[];
  currentWorldId: number;
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
  bgmVolume: number;
}

export interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  bossesDefeated: number;
  jadeEarned: number;
  wordsLearned: string[];
}

export interface LootReward {
  type: 'jade' | 'companion';
  amount?: number;
  companion?: Companion;
}
