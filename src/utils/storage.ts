import { PlayerInventory, GameSettings, MapNode } from '../types';

interface GameProgress {
  jade: number;
  bestStreak: number;
  bossesDefeated: number;
  totalQuestionsAnswered: number;
  wordsLearned: string[];
  worldNumber: number;
  completedNodes: string[];
}

const PROGRESS_KEY = 'jade_tycoon_progress';
const INVENTORY_KEY = 'jade_tycoon_inventory';
const SETTINGS_KEY = 'jade_tycoon_settings';
const MAP_KEY = 'jade_tycoon_map';

export const saveProgress = (
  jade: number,
  bestStreak: number,
  bossesDefeated: number = 0,
  totalQuestionsAnswered: number = 0,
  wordsLearned: string[] = [],
  worldNumber: number = 1,
  completedNodes: string[] = []
): void => {
  const progress: GameProgress = {
    jade,
    bestStreak,
    bossesDefeated,
    totalQuestionsAnswered,
    wordsLearned,
    worldNumber,
    completedNodes,
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
        worldNumber: parsed.worldNumber || 1,
        completedNodes: parsed.completedNodes || [],
      };
    } catch {
      return getDefaultProgress();
    }
  }
  return getDefaultProgress();
};

const getDefaultProgress = (): GameProgress => ({
  jade: 0,
  bestStreak: 0,
  bossesDefeated: 0,
  totalQuestionsAnswered: 0,
  wordsLearned: [],
  worldNumber: 1,
  completedNodes: [],
});

export const saveInventory = (inventory: PlayerInventory): void => {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
};

export const loadInventory = (): PlayerInventory => {
  const saved = localStorage.getItem(INVENTORY_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        theme: parsed.theme || 'default',
        activeCompanion: parsed.activeCompanion || null,
        companions: parsed.companions || [],
      };
    } catch {
      return {
        theme: 'default',
        activeCompanion: null,
        companions: [],
      };
    }
  }
  return {
    theme: 'default',
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
        audioLanguage: parsed.audioLanguage || 'zh-CN',
        useAzureTts: parsed.useAzureTts !== undefined ? parsed.useAzureTts : (parsed.useElevenLabs !== undefined ? parsed.useElevenLabs : true),
        gradeLevel: parsed.gradeLevel || 1,
        audioSpeed: parsed.audioSpeed || 0.75,
        bgmVolume: parsed.bgmVolume !== undefined ? parsed.bgmVolume : 0.1,
      };
    } catch {
      return getDefaultSettings();
    }
  }
  return getDefaultSettings();
};

const getDefaultSettings = (): GameSettings => ({
  audioLanguage: 'zh-CN',
  useAzureTts: true,
  gradeLevel: 1,
  audioSpeed: 0.75,
  bgmVolume: 0.1,
});

export const addWordLearned = (word: string): void => {
  const progress = loadProgress();
  if (!progress.wordsLearned.includes(word)) {
    progress.wordsLearned.push(word);
    saveProgress(
      progress.jade,
      progress.bestStreak,
      progress.bossesDefeated,
      progress.totalQuestionsAnswered,
      progress.wordsLearned,
      progress.worldNumber,
      progress.completedNodes
    );
  }
};

export const saveMapState = (nodes: MapNode[], worldId: number): void => {
  localStorage.setItem(MAP_KEY, JSON.stringify({ nodes, worldId }));
};

export const loadMapState = (): { nodes: MapNode[]; worldId: number } | null => {
  const saved = localStorage.getItem(MAP_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const isFirstLaunch = (): boolean => {
  return !localStorage.getItem(SETTINGS_KEY);
};

export const markLaunched = (): void => {
  const settings = loadSettings();
  saveSettings(settings);
};
