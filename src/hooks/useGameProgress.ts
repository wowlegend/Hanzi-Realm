import { useState, useEffect, useCallback } from 'react';
import { GameState, GameSettings, PlayerInventory, MapNode, Companion } from '../types';
import { saveProgress, loadProgress, saveInventory, loadInventory, saveSettings, loadSettings, saveMapState, loadMapState } from '../utils/storage';
import { syncProgressToCloud, syncCompanionsToCloud, syncSettingsToCloud, syncMapStateToCloud, loadProgressFromCloud, loadCompanionsFromCloud, loadSettingsFromCloud, loadMapStateFromCloud } from '../utils/cloudStorage';
import { generateLevel } from '../data/questionBank';
import { generateWorldNodes } from '../utils/mapGenerator';
import { AUDIO_DEFAULTS } from '../utils/constants';
import { User } from '@supabase/supabase-js';

const DEFAULT_GAME_STATE: GameState = {
  currentLevelIndex: 0,
  jade: 0,
  currentStreak: 0,
  bestStreak: 0,
  selectedOption: null,
  isCorrect: null,
  showFeedback: false,
  questionsAnswered: 0,
  bossesDefeated: 0,
  wordsLearned: new Set(),
  gradeLevel: 1,
  worldNumber: 1,
  seenQuestionIds: new Set(),
  gameMode: 'standard',
  streakShieldActive: false,
  streakShieldUsed: false,
  fireMode: false,
  currentNodeId: null,
};

const DEFAULT_SETTINGS: GameSettings = {
  elevenLabsApiKey: '',
  audioLanguage: 'zh-CN',
  useElevenLabs: true,
  voiceId: 'WuLq5z7nEcrhppO0ZQJw',
  gradeLevel: 1,
  audioSpeed: 0.75,
  bgmVolume: 0.1,
};

const DEFAULT_INVENTORY: PlayerInventory = {
  theme: 'meadow',
  activeCompanion: null,
  companions: [],
};

export function useGameProgress(user: User | null) {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [inventory, setInventory] = useState<PlayerInventory>(DEFAULT_INVENTORY);
  const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
  const [levels, setLevels] = useState<import('../types').Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('azure_key')) {
      localStorage.setItem('azure_key', AUDIO_DEFAULTS.KEY);
    }
    if (!localStorage.getItem('azure_region')) {
      localStorage.setItem('azure_region', AUDIO_DEFAULTS.REGION);
    }
    if (!localStorage.getItem('azureVoice')) {
      localStorage.setItem('azureVoice', AUDIO_DEFAULTS.VOICE);
    }
    loadLocalData();
  }, []);

  useEffect(() => {
    if (user) {
      loadCloudData();
    }
  }, [user]);

  const loadLocalData = () => {
    const progress = loadProgress();
    const inv = loadInventory();
    const sett = loadSettings();
    const savedMap = loadMapState();

    const apiKey = localStorage.getItem('elevenlabs_key') || sett.elevenLabsApiKey;
    const gradeToUse = sett.gradeLevel || 1;
    const seenIds = new Set<number | string>();
    const levelsForGrade = generateLevel(gradeToUse, 10, seenIds);

    setLevels(levelsForGrade);

    const hasShieldCompanion = inv.companions.find(
      c => c.id === inv.activeCompanion && c.buffType === 'streak_shield'
    );

    setGameState(prev => ({
      ...prev,
      jade: progress.jade,
      bestStreak: progress.bestStreak,
      bossesDefeated: progress.bossesDefeated,
      questionsAnswered: progress.totalQuestionsAnswered,
      gradeLevel: gradeToUse,
      wordsLearned: new Set(progress.wordsLearned),
      seenQuestionIds: seenIds,
      worldNumber: progress.worldNumber || 1,
      streakShieldActive: !!hasShieldCompanion,
    }));

    setInventory(inv);
    setSettings({
      ...sett,
      elevenLabsApiKey: apiKey,
      gradeLevel: gradeToUse,
      audioSpeed: sett.audioSpeed || 0.75,
      bgmVolume: sett.bgmVolume ?? 0.1,
    });

    if (savedMap && savedMap.worldId === (progress.worldNumber || 1)) {
      setMapNodes(savedMap.nodes);
    } else {
      const nodes = generateWorldNodes(progress.worldNumber || 1);
      setMapNodes(nodes);
      saveMapState(nodes, progress.worldNumber || 1);
    }

    setIsLoading(false);
  };

  const loadCloudData = async () => {
    if (!user) return;

    try {
      const cloudProgress = await loadProgressFromCloud(user.id);
      if (cloudProgress) {
        setGameState(prev => ({
          ...prev,
          jade: cloudProgress.jade,
          currentStreak: cloudProgress.current_streak,
          bestStreak: cloudProgress.best_streak,
          questionsAnswered: cloudProgress.questions_answered,
          bossesDefeated: cloudProgress.bosses_defeated,
          worldNumber: cloudProgress.world_number,
          gradeLevel: cloudProgress.grade_level,
          wordsLearned: new Set(cloudProgress.words_learned),
        }));

        const levelsForGrade = generateLevel(cloudProgress.grade_level, 10, new Set());
        setLevels(levelsForGrade);
      }

      const cloudCompanions = await loadCompanionsFromCloud(user.id);
      if (cloudCompanions) {
        setInventory(prev => ({
          ...prev,
          companions: cloudCompanions.companions,
          activeCompanion: cloudCompanions.activeCompanion,
        }));
      }

      const cloudSettings = await loadSettingsFromCloud(user.id);
      if (cloudSettings) {
        setSettings(prev => ({
          ...prev,
          ...cloudSettings.settings,
          gradeLevel: cloudProgress?.grade_level || prev.gradeLevel,
        }));
        setInventory(prev => ({
          ...prev,
          theme: cloudSettings.theme,
        }));
      }

      const cloudMap = await loadMapStateFromCloud(user.id, cloudProgress?.world_number || 1);
      if (cloudMap) {
        setMapNodes(cloudMap);
      }
    } catch (error) {
      console.error('Error loading cloud data:', error);
    }
  };

  const syncProgress = useCallback(async (
    jade: number,
    currentStreak: number,
    bestStreak: number,
    questionsAnswered: number,
    bossesDefeated: number,
    worldNumber: number,
    gradeLevel: number,
    wordsLearned: string[]
  ) => {
    saveProgress(jade, bestStreak, bossesDefeated, questionsAnswered, wordsLearned, worldNumber);

    if (user) {
      try {
        await syncProgressToCloud(
          user.id,
          jade,
          currentStreak,
          bestStreak,
          questionsAnswered,
          bossesDefeated,
          worldNumber,
          gradeLevel,
          wordsLearned
        );
      } catch (error) {
        console.error('Error syncing progress to cloud:', error);
      }
    }
  }, [user]);

  const syncMap = useCallback(async (nodes: MapNode[], worldNumber: number) => {
    saveMapState(nodes, worldNumber);
    if (user) {
      try {
        await syncMapStateToCloud(user.id, nodes, worldNumber);
      } catch (error) {
        console.error('Error syncing map to cloud:', error);
      }
    }
  }, [user]);

  const syncCompanions = useCallback(async (companions: Companion[], activeCompanionId: string | null) => {
    if (user) {
      try {
        await syncCompanionsToCloud(user.id, companions, activeCompanionId);
      } catch (error) {
        console.error('Error syncing companions to cloud:', error);
      }
    }
  }, [user]);

  const updateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const updateInventory = useCallback((newInventory: PlayerInventory) => {
    setInventory(newInventory);
    saveInventory(newInventory);
  }, []);

  return {
    gameState,
    setGameState,
    settings,
    setSettings: updateSettings,
    inventory,
    setInventory: updateInventory,
    mapNodes,
    setMapNodes,
    levels,
    setLevels,
    isLoading,
    syncProgress,
    syncMap,
    syncCompanions,
  };
}
