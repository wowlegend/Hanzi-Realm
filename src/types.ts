export interface PinyinChar {
  char: string;
  pinyin: string;
  isHighlight?: boolean;
  isMissing?: boolean;
}

export type BlockType = 'text' | 'dialogue' | 'idiom' | 'poem';

export interface ContentBlock {
  type: BlockType;
  speaker?: string;
  avatarSeed?: string;
  segments: PinyinChar[];
}

export interface AnswerOption {
  value: string;
  pinyin: string;
  radical?: string;
  radicalMeaning?: string;
  explanation: string;
  isCorrect?: boolean;
}

export interface Level {
  id: number | string;
  grade: number;
  scenario: string;
  blocks: ContentBlock[];
  targetBlockIndex: number;
  missingSegmentIndices: number[];
  correctAnswer: {
    value: string;
    pinyin: string;
    radical?: string;
    radicalMeaning?: string;
    definition: string;
  };
  options: AnswerOption[];
  hint?: string;
  distractorType?: 'visual' | 'homophone' | 'shape-similar';
  questionType?: QuestionType;
  sentenceWords?: string[];
}

export interface CharOption {
  char: string;
  hint: string;
  explanation: string;
}

export interface LegacyLevel {
  id: number;
  scenario: string;
  sentence_prefix: string;
  sentence_suffix: string;
  missing_char: string;
  options: CharOption[];
  correct_explanation: string;
}

export type CompanionRarity = 'common' | 'rare' | 'epic' | 'legendary';
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

export type QuestionType = 'fill-blank' | 'sentence-order' | 'radical-detective';

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
  seenQuestionIds: Set<number | string>;
  gameMode: GameMode;
  streakShieldActive: boolean;
  streakShieldUsed: boolean;
  fireMode: boolean;
  currentNodeId: string | null;
  nodeQuestionsTotal: number;
  nodeQuestionsAnswered: number;
  bossHp: number;
  bossMaxHp: number;
}

export interface WorldMapState {
  nodes: MapNode[];
  currentWorldId: number;
}

export interface PlayerInventory {
  theme: string;
  activeCompanion: string | null;
  companions: Companion[];
}

export interface GameSettings {
  audioLanguage: 'zh-CN' | 'zh-HK';
  useAzureTts: boolean;
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
