import { PlayerInventory, GameSettings, Companion } from '../types';
import { allCompanions } from '../data/companions';

interface GameProgress {
  jade: number;
  bestStreak: number;
  bossesDefeated: number;
  totalQuestionsAnswered: number;
  wordsLearned: string[];
}

const PROGRESS_KEY = 'jade_tycoon_progress';
const INVENTORY_KEY = 'jade_tycoon_inventory';
const SETTINGS_KEY = 'jade_tycoon_settings';

export const saveProgress = (
  jade: number,
  bestStreak: number,
  bossesDefeated: number = 0,
  totalQuestionsAnswered: number = 0,
  wordsLearned: string[] = []
): void => {
  const progress: GameProgress = {
    jade,
    bestStreak,
    bossesDefeated,
    totalQuestionsAnswered,
    wordsLearned,
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const loadProgress = (): GameProgress => {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        jade: parsed.jade || parsed.hanziCoins || 0,
        bestStreak: parsed.bestStreak || 0,
        bossesDefeated: parsed.bossesDefeated || 0,
        totalQuestionsAnswered: parsed.totalQuestionsAnswered || 0,
        wordsLearned: parsed.wordsLearned || [],
      };
    } catch {
      return {
        jade: 0,
        bestStreak: 0,
        bossesDefeated: 0,
        totalQuestionsAnswered: 0,
        wordsLearned: [],
      };
    }
  }
  return {
    jade: 0,
    bestStreak: 0,
    bossesDefeated: 0,
    totalQuestionsAnswered: 0,
    wordsLearned: [],
  };
};

export const saveInventory = (inventory: PlayerInventory): void => {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
};

export const loadInventory = (): PlayerInventory => {
  const saved = localStorage.getItem(INVENTORY_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        theme: parsed.theme === 'default' ? 'meadow' : parsed.theme || 'meadow',
        activeCompanion: parsed.activeCompanion || null,
        companions: parsed.companions || [],
      };
    } catch {
      return {
        theme: 'meadow',
        activeCompanion: null,
        companions: [],
      };
    }
  }
  return {
    theme: 'meadow',
    activeCompanion: null,
    companions: [],
  };
};

export const saveSettings = (settings: GameSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSettings = (): GameSettings => {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        elevenLabsApiKey: parsed.elevenLabsApiKey || '',
        audioLanguage: parsed.audioLanguage || 'zh-CN',
        useElevenLabs: parsed.useElevenLabs !== undefined ? parsed.useElevenLabs : true,
        voiceId: parsed.voiceId || 'WuLq5z7nEcrhppO0ZQJw',
        gradeLevel: parsed.gradeLevel || 1,
        audioSpeed: parsed.audioSpeed || 0.75,
      };
    } catch {
      return {
        elevenLabsApiKey: '',
        audioLanguage: 'zh-CN',
        useElevenLabs: true,
        voiceId: 'WuLq5z7nEcrhppO0ZQJw',
        gradeLevel: 1,
        audioSpeed: 0.75,
      };
    }
  }
  return {
    elevenLabsApiKey: '',
    audioLanguage: 'zh-CN',
    useElevenLabs: true,
    voiceId: 'WuLq5z7nEcrhppO0ZQJw',
    gradeLevel: 1,
    audioSpeed: 0.75,
  };
};

export const addWordLearned = (word: string): void => {
  const progress = loadProgress();
  if (!progress.wordsLearned.includes(word)) {
    progress.wordsLearned.push(word);
    saveProgress(
      progress.jade,
      progress.bestStreak,
      progress.bossesDefeated,
      progress.totalQuestionsAnswered,
      progress.wordsLearned
    );
  }
};
