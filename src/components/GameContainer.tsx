import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Volume2, Settings as SettingsIcon, Loader, Gift, Trophy, Map, Zap, Lightbulb } from 'lucide-react';
import { generateLevel, getLevelFullSentence, getCorrectAnswerFromLevel, markQuestionAnswered } from '../data/questionBank';
import { GameState, GameSettings, PlayerInventory, Companion, Level, SessionStats, MapNode, MusicState, LootReward, AnswerOption } from '../types';
import { saveProgress, loadProgress, saveInventory, loadInventory, saveSettings, loadSettings, addWordLearned, saveMapState, loadMapState } from '../utils/storage';
import { syncProgressToCloud, syncCompanionsToCloud, syncSettingsToCloud, syncMapStateToCloud, recordCharacterAttempt, loadProgressFromCloud, loadCompanionsFromCloud, loadSettingsFromCloud, loadMapStateFromCloud } from '../utils/cloudStorage';
import { recordQuestionAttempt } from '../utils/spacedRepetition';
import { speakChinese, setDebugCallback } from '../utils/audio';
import { sfxManager } from '../utils/sfx';
import { AUDIO_DEFAULTS } from '../utils/constants';
import { generateWorldNodes } from '../utils/mapGenerator';
import { getBuffDescription } from '../data/companions';
import { getBossForWorld, Boss } from '../data/bosses';
import { useAuth } from '../contexts/AuthContext';
import SettingsModal from './SettingsModal';
import CompanionDisplay from './CompanionDisplay';
import GachaModal from './GachaModal';
import BossBattle from './BossBattle';
import ReportCard from './ReportCard';
import GradeBackground from './GradeBackground';
import DebugLog from './DebugLog';
import LevelClearedModal from './LevelClearedModal';
import WorldMap from './WorldMap';
import LootBoxModal from './LootBoxModal';
import NarratorAvatar from './NarratorAvatar';
import MusicManager from './MusicManager';
import UserProfile from './UserProfile';
import AuthModal from './AuthModal';
import { ContentBlockRenderer } from './RubyText';

export default function GameContainer() {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
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
  });

  const [settings, setSettings] = useState<GameSettings>({
    elevenLabsApiKey: '',
    audioLanguage: 'zh-CN',
    useElevenLabs: true,
    voiceId: 'WuLq5z7nEcrhppO0ZQJw',
    gradeLevel: 1,
    audioSpeed: 0.75,
    bgmVolume: 0.1,
  });

  const [inventory, setInventory] = useState<PlayerInventory>({
    theme: 'meadow',
    activeCompanion: null,
    companions: [],
  });

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    questionsAnswered: 0,
    correctAnswers: 0,
    bossesDefeated: 0,
    jadeEarned: 0,
    wordsLearned: [],
  });

  const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
  const [showMap, setShowMap] = useState(true);
  const [musicState, setMusicState] = useState<MusicState>('map');
  const [bgmEnabled, setBgmEnabled] = useState(true);

  const [shake, setShake] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [companionHappy, setCompanionHappy] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  const [debugIsError, setDebugIsError] = useState(false);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBossMode, setIsBossMode] = useState(false);
  const [bossTimer, setBossTimer] = useState(10);
  const [isLevelClearedOpen, setIsLevelClearedOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLootBoxOpen, setIsLootBoxOpen] = useState(false);
  const [charRevealed, setCharRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);
  const [awaitingLoot, setAwaitingLoot] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lootBoxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSpeakDone = useRef(false);

  useEffect(() => {
    setDebugCallback((message: string, isError: boolean) => {
      setDebugMessage(message);
      setDebugIsError(isError);
    });
  }, []);

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

    loadGameData();
  }, []);

  useEffect(() => {
    if (user) {
      loadCloudData();
    }
  }, [user]);

  const loadGameData = async () => {
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

  const syncProgress = async (
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
  };

  useEffect(() => {
    if (levels.length > 0 && gameState.currentLevelIndex >= levels.length) {
      setGameState(prev => ({ ...prev, currentLevelIndex: 0 }));
    }
  }, [levels, gameState.currentLevelIndex]);

  useEffect(() => {
    const newFireMode = gameState.currentStreak >= 5;
    if (newFireMode !== gameState.fireMode) {
      setGameState(prev => ({ ...prev, fireMode: newFireMode }));
      if (newFireMode) {
        sfxManager.play('combo');
      }
    }
  }, [gameState.currentStreak, gameState.fireMode]);

  useEffect(() => {
    if (isBossMode) {
      setMusicState('boss');
      bossTimerRef.current = setInterval(() => {
        setBossTimer(prev => {
          if (prev <= 1) {
            handleBossTimeout();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
        bossTimerRef.current = null;
      }
      setBossTimer(15);
    }

    return () => {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
      }
      if (lootBoxTimeoutRef.current) {
        clearTimeout(lootBoxTimeoutRef.current);
      }
    };
  }, [isBossMode]);

  useEffect(() => {
    if (!showMap && !isBossMode) {
      setMusicState('battle');
    } else if (showMap) {
      setMusicState('map');
    }
  }, [showMap, isBossMode]);

  useEffect(() => {
    if (gameState.gameMode === 'listening' && !showMap && !gameState.showFeedback && !autoSpeakDone.current) {
      autoSpeakDone.current = true;
      handleSpeak();
    }
  }, [gameState.gameMode, showMap, gameState.showFeedback, gameState.currentLevelIndex]);

  const currentLevel = levels[gameState.currentLevelIndex] || levels[0];
  if (!currentLevel && !showMap) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const fullSentence = currentLevel ? getLevelFullSentence(currentLevel) : '';
  const correctAnswer = currentLevel ? getCorrectAnswerFromLevel(currentLevel) : '';

  const activeCompanion = inventory.companions.find(c => c.id === inventory.activeCompanion) || null;

  const getJadeBonus = (): number => {
    if (!activeCompanion || activeCompanion.buffType !== 'jade_boost') return 0;
    return activeCompanion.buffValue;
  };

  const getComboMultiplier = (): number => {
    if (!activeCompanion || activeCompanion.buffType !== 'combo_master') return 1;
    return activeCompanion.buffValue;
  };

  const handleNodeSelect = (node: MapNode) => {
    if (node.type === 'treasure') {
      const jadeReward = node.reward || 300;
      const newJade = gameState.jade + jadeReward;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ffed4e', '#00b06f'],
      });

      const updatedNodes = mapNodes.map(n => {
        if (n.id === node.id) return { ...n, status: 'completed' as const };
        const nodeIndex = mapNodes.findIndex(mn => mn.id === n.id);
        const completedIndex = mapNodes.findIndex(mn => mn.id === node.id);
        if (nodeIndex === completedIndex + 1) return { ...n, status: 'unlocked' as const };
        return n;
      });

      setMapNodes(updatedNodes);
      saveMapState(updatedNodes, gameState.worldNumber);
      if (user) {
        syncMapStateToCloud(user.id, updatedNodes, gameState.worldNumber);
      }
      setGameState(prev => ({ ...prev, jade: newJade }));
      syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));
      return;
    }

    const isListeningMode = node.type === 'blind';
    const isBoss = node.type === 'boss';

    const freshLevels = generateLevel(settings.gradeLevel, isBoss ? 1 : 5, new Set());
    setLevels(freshLevels);

    autoSpeakDone.current = false;
    setCharRevealed(false);
    setShowHint(false);

    setGameState(prev => ({
      ...prev,
      gameMode: isListeningMode ? 'listening' : 'standard',
      currentNodeId: node.id,
      currentLevelIndex: 0,
      selectedOption: null,
      isCorrect: null,
      showFeedback: false,
    }));

    if (isBoss) {
      const boss = getBossForWorld(gameState.worldNumber);
      setCurrentBoss(boss);
      setIsBossMode(true);
      setBossTimer(15);
    }

    setShowMap(false);
  };

  const handleOptionClick = async (option: AnswerOption) => {
    if (gameState.showFeedback) return;

    sfxManager.play('click');
    const isCorrect = option.value === correctAnswer;

    if (gameState.gameMode === 'listening') {
      setCharRevealed(true);
    }

    setGameState(prev => ({
      ...prev,
      selectedOption: option.value,
      isCorrect,
      showFeedback: true,
      questionsAnswered: prev.questionsAnswered + 1,
    }));

    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
    }));

    if (isCorrect) {
      setCompanionHappy(true);
      setTimeout(() => setCompanionHappy(false), 800);

      sfxManager.play('correct');

      const newWords = new Set(gameState.wordsLearned);
      newWords.add(correctAnswer);

      if (!sessionStats.wordsLearned.includes(correctAnswer)) {
        setSessionStats(prev => ({
          ...prev,
          wordsLearned: [...prev.wordsLearned, correctAnswer],
        }));
      }

      addWordLearned(correctAnswer);

      const baseReward = isBossMode ? 500 : 100;
      const bonusPercent = getJadeBonus();
      const jadeReward = Math.floor(baseReward * (1 + bonusPercent / 100));

      const comboMultiplier = getComboMultiplier();
      const streakIncrement = Math.ceil(comboMultiplier);

      if (gameState.currentStreak + streakIncrement >= 3) {
        sfxManager.play('combo');
      }

      confetti({
        particleCount: isBossMode ? 200 : 100,
        spread: isBossMode ? 120 : 70,
        origin: { y: 0.6 },
        colors: isBossMode ? ['#ffd700', '#ffed4e', '#ff6b35'] : ['#00b06f', '#ffd700', '#ffffff'],
      });

      const newJade = gameState.jade + jadeReward;
      const newStreak = gameState.currentStreak + streakIncrement;
      const newBestStreak = Math.max(newStreak, gameState.bestStreak);

      let newBossesDefeated = gameState.bossesDefeated;
      if (isBossMode) {
        newBossesDefeated += 1;
        sfxManager.play('boss');
        setSessionStats(prev => ({
          ...prev,
          bossesDefeated: prev.bossesDefeated + 1,
        }));
      }

      setGameState(prev => ({
        ...prev,
        jade: newJade,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        bossesDefeated: newBossesDefeated,
        wordsLearned: newWords,
      }));

      setSessionStats(prev => ({
        ...prev,
        jadeEarned: prev.jadeEarned + jadeReward,
      }));

      syncProgress(newJade, newStreak, newBestStreak, gameState.questionsAnswered + 1, newBossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(newWords));

      if (user) {
        recordCharacterAttempt(user.id, correctAnswer, true);
        recordQuestionAttempt(user.id, String(currentLevel.id), true);
      }
      markQuestionAnswered(currentLevel.id);

      if (isBossMode && !awaitingLoot) {
        if (bossTimerRef.current) {
          clearInterval(bossTimerRef.current);
          bossTimerRef.current = null;
        }

        setAwaitingLoot(true);

        if (lootBoxTimeoutRef.current) {
          clearTimeout(lootBoxTimeoutRef.current);
        }

        lootBoxTimeoutRef.current = setTimeout(() => {
          setIsBossMode(false);
          setCurrentBoss(null);
          setAwaitingLoot(false);
          setIsLootBoxOpen(true);
          lootBoxTimeoutRef.current = null;
        }, 1500);
      }
    } else {
      sfxManager.play('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (user) {
        recordQuestionAttempt(user.id, String(currentLevel.id), false);
      }
      markQuestionAnswered(currentLevel.id);

      const shouldResetStreak = !(gameState.streakShieldActive && !gameState.streakShieldUsed);

      if (shouldResetStreak) {
        setGameState(prev => ({
          ...prev,
          currentStreak: 0,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          streakShieldUsed: true,
        }));
      }

      if (isBossMode) {
        setIsBossMode(false);
        setCurrentBoss(null);
      }
    }
  };

  const handleBossTimeout = () => {
    sfxManager.play('wrong');
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setIsBossMode(false);
    setCurrentBoss(null);
    setGameState(prev => ({
      ...prev,
      currentStreak: 0,
    }));
  };

  const handleNext = () => {
    const nextIndex = gameState.currentLevelIndex + 1;
    setShowHint(false);

    if (gameState.currentNodeId) {
      const updatedNodes = mapNodes.map(n => {
        if (n.id === gameState.currentNodeId) return { ...n, status: 'completed' as const };
        const nodeIndex = mapNodes.findIndex(mn => mn.id === n.id);
        const completedIndex = mapNodes.findIndex(mn => mn.id === gameState.currentNodeId);
        if (nodeIndex === completedIndex + 1) return { ...n, status: 'unlocked' as const };
        return n;
      });

      setMapNodes(updatedNodes);
      saveMapState(updatedNodes, gameState.worldNumber);
      if (user) {
        syncMapStateToCloud(user.id, updatedNodes, gameState.worldNumber);
      }

      const allCompleted = updatedNodes.every(n => n.status === 'completed');
      if (allCompleted) {
        setIsLevelClearedOpen(true);
      } else {
        setShowMap(true);
      }

      setGameState(prev => ({
        ...prev,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
        currentNodeId: null,
      }));
    } else if (nextIndex >= levels.length) {
      setIsLevelClearedOpen(true);
      setGameState(prev => ({
        ...prev,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
      }));
    } else {
      autoSpeakDone.current = false;
      setCharRevealed(false);
      setGameState(prev => ({
        ...prev,
        currentLevelIndex: nextIndex,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
      }));
    }
    setHoveredOption(null);
  };

  const handleLevelClearedContinue = () => {
    const worldBonus = 500;
    const newJade = gameState.jade + worldBonus;
    const newWorldNumber = gameState.worldNumber + 1;

    const newLevels = generateLevel(settings.gradeLevel, 10, gameState.seenQuestionIds);
    setLevels(newLevels);

    const newNodes = generateWorldNodes(newWorldNumber);
    setMapNodes(newNodes);
    saveMapState(newNodes, newWorldNumber);

    setGameState(prev => ({
      ...prev,
      currentLevelIndex: 0,
      jade: newJade,
      worldNumber: newWorldNumber,
      selectedOption: null,
      isCorrect: null,
      showFeedback: false,
      currentNodeId: null,
    }));

    syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, newWorldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));

    setIsLevelClearedOpen(false);
    setShowMap(true);
  };

  const handleSpeak = async () => {
    setIsSpeaking(true);
    setIsAudioPlaying(true);
    sfxManager.play('click');
    try {
      const apiKey = localStorage.getItem('azure_key') || settings.elevenLabsApiKey;
      const region = localStorage.getItem('azure_region') || settings.voiceId || 'eastasia';
      await speakChinese(fullSentence, apiKey, region, settings.useElevenLabs, settings.audioLanguage, settings.audioSpeed);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
      setTimeout(() => setIsAudioPlaying(false), 1000);
    }
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    const oldGrade = settings.gradeLevel;
    const newGrade = newSettings.gradeLevel;

    const updatedSettings = {
      ...newSettings,
      audioSpeed: newSettings.audioSpeed || 0.75,
      bgmVolume: newSettings.bgmVolume ?? 0.1,
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);

    if (oldGrade !== newGrade) {
      const seenIds = new Set<number | string>();
      const newLevels = generateLevel(newGrade, 10, seenIds);
      setLevels(newLevels);

      const newNodes = generateWorldNodes(1);
      setMapNodes(newNodes);
      saveMapState(newNodes, 1);

      setGameState(prev => ({
        ...prev,
        currentLevelIndex: 0,
        gradeLevel: newGrade,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
        worldNumber: 1,
        seenQuestionIds: seenIds,
        currentNodeId: null,
      }));

      setShowMap(true);
    }
  };

  const handleGachaRoll = (companion: Companion) => {
    sfxManager.play('gacha');
    const updatedCompanions = [...inventory.companions];
    const existingIndex = updatedCompanions.findIndex(c => c.id === companion.id);

    if (existingIndex >= 0) {
      updatedCompanions[existingIndex] = companion;
    } else {
      updatedCompanions.push(companion);
    }

    const newInventory = {
      ...inventory,
      companions: updatedCompanions,
      activeCompanion: companion.id,
    };

    setInventory(newInventory);
    saveInventory(newInventory);
    if (user) {
      syncCompanionsToCloud(user.id, newInventory.companions, newInventory.activeCompanion);
    }

    const newJade = gameState.jade - 500;
    setGameState(prev => ({
      ...prev,
      jade: newJade,
      streakShieldActive: companion.buffType === 'streak_shield',
    }));
    syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));
  };

  const handleLootReward = useCallback((reward: LootReward) => {
    if (reward.type === 'jade' && reward.amount) {
      const newJade = gameState.jade + reward.amount;
      setGameState(prev => ({ ...prev, jade: newJade }));
      syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));
    } else if (reward.type === 'companion' && reward.companion) {
      const updatedCompanions = [...inventory.companions];
      const existingIndex = updatedCompanions.findIndex(c => c.id === reward.companion!.id);

      if (existingIndex >= 0) {
        updatedCompanions[existingIndex] = reward.companion;
      } else {
        updatedCompanions.push(reward.companion);
      }

      const newInventory = {
        ...inventory,
        companions: updatedCompanions,
      };

      setInventory(newInventory);
      saveInventory(newInventory);
    }
  }, [gameState.jade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, gameState.worldNumber, gameState.wordsLearned, settings.gradeLevel, inventory.companions]);

  const handleLootBoxClose = useCallback(() => {
    setIsLootBoxOpen(false);

    if (gameState.currentNodeId) {
      const updatedNodes = mapNodes.map(n => {
        if (n.id === gameState.currentNodeId) return { ...n, status: 'completed' as const };
        const nodeIndex = mapNodes.findIndex(mn => mn.id === n.id);
        const completedIndex = mapNodes.findIndex(mn => mn.id === gameState.currentNodeId);
        if (nodeIndex === completedIndex + 1) return { ...n, status: 'unlocked' as const };
        return n;
      });

      setMapNodes(updatedNodes);
      saveMapState(updatedNodes, gameState.worldNumber);
      if (user) {
        syncMapStateToCloud(user.id, updatedNodes, gameState.worldNumber);
      }

      const allCompleted = updatedNodes.every(n => n.status === 'completed');
      if (allCompleted) {
        setIsLevelClearedOpen(true);
      } else {
        setShowMap(true);
      }

      setGameState(prev => ({
        ...prev,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
        currentNodeId: null,
      }));
    } else {
      setShowMap(true);
      setGameState(prev => ({
        ...prev,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
      }));
    }
  }, [gameState.currentNodeId, mapNodes, gameState.worldNumber, user]);

  const progressPercentage = ((gameState.currentLevelIndex + 1) / levels.length) * 100;

  if (showMap) {
    return (
      <>
        <GradeBackground gradeLevel={settings.gradeLevel} />
        <MusicManager state={musicState} volume={settings.bgmVolume} enabled={bgmEnabled} />

        <WorldMap
          nodes={mapNodes}
          worldNumber={gameState.worldNumber}
          onNodeSelect={handleNodeSelect}
          jade={gameState.jade}
        />

        <div className="fixed top-4 right-4 flex gap-2 z-20">
          <motion.button
            onClick={() => setBgmEnabled(!bgmEnabled)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn-3d p-3 rounded-xl ${bgmEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
          >
            <Volume2 className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => setIsReportOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl p-3"
          >
            <Trophy className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => setIsGachaOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d-gold rounded-xl p-3"
          >
            <Gift className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => setIsSettingsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl p-3"
          >
            <SettingsIcon className="w-5 h-5 text-[#ffd700]" />
          </motion.button>
          <UserProfile onLoginClick={() => setIsAuthModalOpen(true)} />
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          inventory={inventory}
          hanziCoins={gameState.jade}
          onSettingsChange={handleSettingsChange}
          onInventoryChange={(newInv) => {
            setInventory(newInv);
            saveInventory(newInv);
          }}
        />

        <GachaModal
          isOpen={isGachaOpen}
          onClose={() => setIsGachaOpen(false)}
          jade={gameState.jade}
          onRoll={handleGachaRoll}
        />

        <ReportCard
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          stats={sessionStats}
        />

        <CompanionDisplay companion={activeCompanion} isHappy={companionHappy} />

        <DebugLog
          message={debugMessage}
          isError={debugIsError}
          onClose={() => setDebugMessage('')}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  const targetBlock = currentLevel?.blocks[currentLevel.targetBlockIndex];
  const selectedOption = currentLevel?.options.find(o => o.value === gameState.selectedOption);

  return (
    <>
      <GradeBackground gradeLevel={settings.gradeLevel} />
      <MusicManager state={musicState} volume={settings.bgmVolume} enabled={bgmEnabled} />

      <div
        ref={containerRef}
        className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
      >
        {currentBoss && (
          <BossBattle
            boss={currentBoss}
            timeLeft={bossTimer}
            maxTime={15}
            isActive={isBossMode}
          />
        )}

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl relative z-10"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-1 tracking-tight drop-shadow-lg">
                Hanzi Realm
              </h1>
              <p className="text-white text-xs sm:text-sm drop-shadow">
                Grade {settings.gradeLevel} - World {gameState.worldNumber}
                {gameState.gameMode === 'listening' && ' - Listening Mode'}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowMap(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d bg-gradient-to-b from-teal-500 to-teal-600 rounded-xl p-3"
              >
                <Map className="w-6 h-6 text-white" />
              </motion.button>
              <motion.button
                onClick={() => setIsReportOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl p-3"
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.button>
              <motion.button
                onClick={() => setIsSettingsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl p-3"
              >
                <SettingsIcon className="w-6 h-6 text-[#ffd700]" />
              </motion.button>
              <UserProfile onLoginClick={() => setIsAuthModalOpen(true)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
            <div className="voxel-card glass-yellow border-yellow-700 px-4 py-2 sm:px-6 sm:py-3">
              <p className="text-white text-sm sm:text-base font-black drop-shadow">
                {gameState.jade} Jade
              </p>
            </div>
            <div className={`voxel-card px-4 py-2 sm:px-6 sm:py-3 relative transition-all duration-300 ${
              gameState.fireMode ? 'border-orange-500 shadow-[0_0_20px_rgba(255,165,0,0.6)]' : 'border-orange-700'
            }`}>
              {gameState.currentStreak >= 3 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -top-3 -right-3 text-3xl"
                >
                  {gameState.fireMode ? <Zap className="w-8 h-8 text-yellow-400" /> : '?'}
                </motion.div>
              )}
              <p className={`text-sm sm:text-base font-black drop-shadow ${
                gameState.currentStreak > 0 ? 'text-white' : 'text-gray-300'
              }`}>
                Streak: {gameState.currentStreak}
                {gameState.fireMode && ' FIRE!'}
              </p>
            </div>
            <div className="voxel-card glass-green border-green-700 px-4 py-2 sm:px-6 sm:py-3">
              <p className="text-white text-sm sm:text-base font-black drop-shadow">
                Best: {gameState.bestStreak}
              </p>
            </div>
            {activeCompanion && (
              <div className="voxel-card border-purple-700 px-4 py-2 sm:px-6 sm:py-3">
                <p className="text-white text-xs font-bold drop-shadow">
                  {activeCompanion.emoji} {getBuffDescription(activeCompanion.buffType, activeCompanion.buffValue)}
                </p>
              </div>
            )}
            <motion.button
              onClick={() => setIsGachaOpen(true)}
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              className="btn-3d-gold px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 text-white font-black"
            >
              <Gift className="w-5 h-5" />
              <span className="text-sm sm:text-base">GACHA</span>
            </motion.button>
          </div>

          <motion.div
            animate={shake ? { rotateZ: [-1, 1, -1, 1, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`voxel-card rounded-3xl p-6 sm:p-8 mb-6 transition-all duration-300 ${
              isBossMode ? 'border-red-500 border-8' :
              gameState.fireMode ? 'border-orange-500 border-4 shadow-[0_0_30px_rgba(255,165,0,0.4)]' :
              'border-gray-700'
            }`}
          >
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <NarratorAvatar
                  seed={currentLevel.scenario}
                  isSpeaking={isSpeaking}
                  fireMode={gameState.fireMode}
                />
                <div className="flex-1">
                  <h2 className="text-[#00b06f] text-xl sm:text-2xl font-black drop-shadow">
                    {isBossMode && 'BOSS: '}{currentLevel.scenario}
                  </h2>
                  {gameState.gameMode === 'listening' && (
                    <p className="text-yellow-400 text-sm mt-1">Listen carefully and choose the right character!</p>
                  )}
                  {currentLevel.distractorType && (
                    <p className="text-gray-400 text-xs mt-1">
                      {currentLevel.distractorType === 'homophone' && 'Watch out for homophones!'}
                      {currentLevel.distractorType === 'shape-similar' && 'Watch out for similar-looking characters!'}
                      {currentLevel.distractorType === 'visual' && 'Look at the radicals carefully!'}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-2 border-white/10 rounded-2xl p-4 sm:p-6 relative bg-black/20">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2">
                  {currentLevel.hint && !gameState.showFeedback && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className={`btn-3d p-2 rounded-lg transition-colors ${showHint ? 'bg-yellow-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                      aria-label="Show hint"
                    >
                      <Lightbulb className={`w-5 h-5 ${showHint ? 'text-yellow-200' : 'text-gray-300'}`} />
                    </button>
                  )}
                  <button
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className="btn-3d-green p-2 rounded-lg"
                    aria-label="Speak sentence"
                  >
                    {isSpeaking ? (
                      <Loader className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                <div className="space-y-4 pr-20">
                  {currentLevel.blocks.map((block, blockIdx) => (
                    <ContentBlockRenderer
                      key={blockIdx}
                      block={block}
                      missingIndices={blockIdx === currentLevel.targetBlockIndex ? currentLevel.missingSegmentIndices : []}
                      selectedAnswer={gameState.selectedOption || undefined}
                      isCorrect={gameState.isCorrect}
                      showFeedback={gameState.showFeedback}
                      size="md"
                      fireMode={gameState.fireMode}
                      isListeningMode={gameState.gameMode === 'listening'}
                      charRevealed={charRevealed}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {showHint && currentLevel.hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 bg-yellow-600/20 border border-yellow-500/50 rounded-xl p-3 flex items-start gap-2"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-200 text-sm">{currentLevel.hint}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6">
              {currentLevel.options.map((option) => {
                const isSelected = gameState.selectedOption === option.value;
                const isCorrectAnswer = option.value === correctAnswer;
                const showAsCorrect = gameState.showFeedback && isSelected && gameState.isCorrect;
                const showAsWrong = gameState.showFeedback && isSelected && !gameState.isCorrect;
                const showCorrectHighlight = gameState.showFeedback && !gameState.isCorrect && isCorrectAnswer;

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    onHoverStart={() => setHoveredOption(option.value)}
                    onHoverEnd={() => setHoveredOption(null)}
                    disabled={gameState.showFeedback}
                    whileHover={!gameState.showFeedback ? { scale: 1.02, rotateX: 5 } : {}}
                    whileTap={!gameState.showFeedback ? { scale: 0.98 } : {}}
                    className={`
                      w-full rounded-2xl p-4 sm:p-6 font-bold text-xl sm:text-2xl
                      border-2 transition-all duration-300
                      ${showAsCorrect ? 'bg-green-600/60 border-green-500 text-white' : ''}
                      ${showAsWrong ? 'bg-red-600/60 border-red-500 text-white' : ''}
                      ${showCorrectHighlight ? 'bg-green-600/60 border-green-500 text-white opacity-60' : ''}
                      ${!gameState.showFeedback ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : ''}
                      ${gameState.showFeedback && !isSelected && !showCorrectHighlight ? 'opacity-40 border-white/10 bg-white/5' : ''}
                      disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl">{option.value}</span>
                        <span className="text-gray-400 text-base sm:text-lg font-mono">{option.pinyin}</span>
                      </div>
                      {hoveredOption === option.value && !gameState.showFeedback && option.radical && (
                        <span className="text-sm sm:text-base text-gray-300 bg-gray-900/60 px-3 py-1 rounded-lg border-2 border-gray-600">
                          Radical: {option.radical} ({option.radicalMeaning || 'hint'})
                        </span>
                      )}
                      {gameState.showFeedback && isSelected && (
                        <span className="text-sm sm:text-base text-right max-w-[50%]">
                          {option.explanation}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {gameState.showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`rounded-2xl p-4 sm:p-6 mb-4 border ${
                  gameState.isCorrect
                    ? 'bg-green-600/60 border-green-500'
                    : 'bg-red-600/60 border-red-500'
                }`}
              >
                <p className="text-lg sm:text-xl font-bold text-white drop-shadow">
                  {gameState.isCorrect ? (
                    <>
                      {currentLevel.correctAnswer.definition}
                      {currentLevel.correctAnswer.radical && (
                        <span className="block text-sm mt-2 text-green-200">
                          Radical: {currentLevel.correctAnswer.radical} ({currentLevel.correctAnswer.radicalMeaning})
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      Wrong! {selectedOption?.explanation}
                      <span className="block text-sm mt-2 text-yellow-200">
                        Correct answer: {correctAnswer} ({currentLevel.correctAnswer.pinyin})
                      </span>
                      {gameState.streakShieldActive && !gameState.streakShieldUsed && (
                        <span className="block text-yellow-300 mt-2">Shield protected your streak!</span>
                      )}
                    </>
                  )}
                </p>
                {gameState.isCorrect && (
                  <p className="text-[#ffd700] font-black mt-2 text-2xl">
                    +{Math.floor((isBossMode ? 500 : 100) * (1 + getJadeBonus() / 100))} Jade
                    {getJadeBonus() > 0 && <span className="text-sm ml-2">(+{getJadeBonus()}% bonus)</span>}
                  </p>
                )}
              </motion.div>
            )}

            {gameState.showFeedback && !awaitingLoot && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d-green w-full text-white font-black py-4 sm:py-5 px-6 rounded-2xl text-lg sm:text-xl shadow-lg"
              >
                {gameState.currentNodeId ? 'Back to Map' : gameState.currentLevelIndex < levels.length - 1 ? 'Next Challenge' : 'New Adventure'}
              </motion.button>
            )}

            {awaitingLoot && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <p className="text-yellow-400 font-bold text-lg animate-pulse">Opening loot box...</p>
              </motion.div>
            )}
          </motion.div>

          <div className="border border-white/20 rounded-full h-4 sm:h-6 overflow-hidden bg-black/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                gameState.fireMode
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-[#00b06f] to-[#ffd700]'
              }`}
            />
          </div>
          <p className="text-center text-white drop-shadow text-sm sm:text-base mt-2 font-bold">
            Challenge {gameState.currentLevelIndex + 1} of {levels.length}
          </p>
        </motion.div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          inventory={inventory}
          hanziCoins={gameState.jade}
          onSettingsChange={handleSettingsChange}
          onInventoryChange={(newInv) => {
            setInventory(newInv);
            saveInventory(newInv);
          }}
        />

        <GachaModal
          isOpen={isGachaOpen}
          onClose={() => setIsGachaOpen(false)}
          jade={gameState.jade}
          onRoll={handleGachaRoll}
        />

        <ReportCard
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          stats={sessionStats}
        />

        <LevelClearedModal
          isOpen={isLevelClearedOpen}
          worldNumber={gameState.worldNumber}
          jadeBonus={500}
          onContinue={handleLevelClearedContinue}
        />

        <LootBoxModal
          isOpen={isLootBoxOpen}
          onClose={handleLootBoxClose}
          onReward={handleLootReward}
        />

        <CompanionDisplay companion={activeCompanion} isHappy={companionHappy} />

        <DebugLog
          message={debugMessage}
          isError={debugIsError}
          onClose={() => setDebugMessage('')}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </>
  );
}
