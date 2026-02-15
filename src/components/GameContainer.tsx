import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { generateLevel, getLevelFullSentence, getCorrectAnswerFromLevel, markQuestionAnswered, resetSessionTracker } from '../data/questionBank';
import { GameState, GameSettings, PlayerInventory, Companion, Level, SessionStats, MapNode, MusicState, LootReward, AnswerOption } from '../types';
import { saveProgress, loadProgress, saveInventory, loadInventory, saveSettings, loadSettings, addWordLearned, saveMapState, loadMapState } from '../utils/storage';
import { syncProgressToCloud, syncCompanionsToCloud, syncMapStateToCloud, recordCharacterAttempt, loadProgressFromCloud, loadCompanionsFromCloud, loadSettingsFromCloud, loadMapStateFromCloud } from '../utils/cloudStorage';
import { recordQuestionAttempt } from '../utils/spacedRepetition';
import { speakChinese, setDebugCallback } from '../utils/audio';
import { sfxManager } from '../utils/sfx';
import { AUDIO_DEFAULTS } from '../utils/constants';
import { generateWorldNodes } from '../utils/mapGenerator';
import { getBossForWorld, Boss } from '../data/bosses';
import { useAuth } from '../contexts/AuthContext';
import MapView from './MapView';
import BattleView from './BattleView';
import LevelClearedModal from './LevelClearedModal';
import LootBoxModal from './LootBoxModal';
import DailyRewardModal from './DailyRewardModal';
import AchievementToast from './AchievementToast';
import JadeAnimation from './JadeAnimation';
import StreakCelebration from './StreakCelebration';
import { checkDailyReward, claimDailyReward, getConsecutiveDays, DailyReward } from '../utils/dailyRewards';
import { checkAchievements, Achievement } from '../data/achievements';

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
  nodeQuestionsTotal: 0,
  nodeQuestionsAnswered: 0,
  bossHp: 0,
  bossMaxHp: 0,
};

const DEFAULT_SETTINGS: GameSettings = {
  audioLanguage: 'zh-CN',
  useAzureTts: true,
  gradeLevel: 1,
  audioSpeed: 0.75,
  bgmVolume: 0.1,
};

const DEFAULT_INVENTORY: PlayerInventory = {
  theme: 'default',
  activeCompanion: null,
  companions: [],
};

const STREAK_MILESTONES = [5, 10, 15, 20, 25];

export default function GameContainer() {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [inventory, setInventory] = useState<PlayerInventory>(DEFAULT_INVENTORY);
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [companionHappy, setCompanionHappy] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  const [debugIsError, setDebugIsError] = useState(false);
  const [charRevealed, setCharRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [awaitingLoot, setAwaitingLoot] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLevelClearedOpen, setIsLevelClearedOpen] = useState(false);
  const [isLootBoxOpen, setIsLootBoxOpen] = useState(false);
  const [isWordBookOpen, setIsWordBookOpen] = useState(false);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);

  const [isBossMode, setIsBossMode] = useState(false);
  const [bossTimer, setBossTimer] = useState(15);
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);

  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [dailyRewardData, setDailyRewardData] = useState<{ reward: DailyReward | null; allRewards: DailyReward[] }>({ reward: null, allRewards: [] });
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const achievementQueueRef = useRef<Achievement[]>([]);
  const [jadeAnimAmount, setJadeAnimAmount] = useState<number | null>(null);
  const [jadeAnimBonus, setJadeAnimBonus] = useState(0);
  const [streakCelebration, setStreakCelebration] = useState<number | null>(null);
  const jadeAnimTimer = useRef<NodeJS.Timeout | null>(null);
  const streakCelebTimer = useRef<NodeJS.Timeout | null>(null);

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
    if (!localStorage.getItem('azureVoice')) localStorage.setItem('azureVoice', AUDIO_DEFAULTS.VOICE);
    loadGameData();
  }, []);

  useEffect(() => {
    if (user) loadCloudData();
  }, [user]);

  useEffect(() => {
    if (levels.length > 0 && gameState.currentLevelIndex >= levels.length) {
      setGameState(prev => ({ ...prev, currentLevelIndex: 0 }));
    }
  }, [levels, gameState.currentLevelIndex]);

  useEffect(() => {
    const newFireMode = gameState.currentStreak >= 5;
    if (newFireMode !== gameState.fireMode) {
      setGameState(prev => ({ ...prev, fireMode: newFireMode }));
      if (newFireMode) sfxManager.play('combo');
    }
  }, [gameState.currentStreak, gameState.fireMode]);

  useEffect(() => {
    if (isBossMode && !gameState.showFeedback) {
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
    } else if (!isBossMode) {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
        bossTimerRef.current = null;
      }
      setBossTimer(15);
    } else {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
        bossTimerRef.current = null;
      }
    }
    return () => {
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
      if (lootBoxTimeoutRef.current) clearTimeout(lootBoxTimeoutRef.current);
    };
  }, [isBossMode, gameState.showFeedback]);

  useEffect(() => {
    if (!showMap && !isBossMode) setMusicState('battle');
    else if (showMap) setMusicState('map');
  }, [showMap, isBossMode]);

  useEffect(() => {
    if (gameState.gameMode === 'listening' && !showMap && !gameState.showFeedback && !autoSpeakDone.current) {
      autoSpeakDone.current = true;
      handleSpeak();
    }
  }, [gameState.gameMode, showMap, gameState.showFeedback, gameState.currentLevelIndex]);

  const loadGameData = async () => {
    const progress = loadProgress();
    const inv = loadInventory();
    const sett = loadSettings();
    const savedMap = loadMapState();

    const gradeToUse = sett.gradeLevel || 1;
    const seenIds = new Set<number | string>();
    const levelsForGrade = generateLevel(gradeToUse, 10, seenIds);

    setLevels(levelsForGrade);

    const hasShieldCompanion = inv.companions.find(c => c.id === inv.activeCompanion && c.buffType === 'streak_shield');

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
    setSettings({ ...sett, gradeLevel: gradeToUse, audioSpeed: sett.audioSpeed || 0.75, bgmVolume: sett.bgmVolume ?? 0.1 });

    if (savedMap && savedMap.worldId === (progress.worldNumber || 1)) {
      setMapNodes(savedMap.nodes);
    } else {
      const nodes = generateWorldNodes(progress.worldNumber || 1);
      setMapNodes(nodes);
      saveMapState(nodes, progress.worldNumber || 1);
    }

    const daily = checkDailyReward();
    if (daily.shouldShow) {
      setDailyRewardData({ reward: daily.reward, allRewards: daily.allRewards });
      setIsDailyRewardOpen(true);
    }
  };

  const loadCloudData = async () => {
    if (!user) return;
    try {
      const cloudProgress = await loadProgressFromCloud(user.id);
      if (cloudProgress) {
        const seenIds = gameState.seenQuestionIds;
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
        setLevels(generateLevel(cloudProgress.grade_level, 10, seenIds));
      }

      const cloudCompanions = await loadCompanionsFromCloud(user.id);
      if (cloudCompanions) {
        setInventory(prev => ({ ...prev, companions: cloudCompanions.companions, activeCompanion: cloudCompanions.activeCompanion }));
      }

      const cloudSettings = await loadSettingsFromCloud(user.id);
      if (cloudSettings) {
        setSettings(prev => ({ ...prev, ...cloudSettings.settings, gradeLevel: cloudProgress?.grade_level || prev.gradeLevel }));
        setInventory(prev => ({ ...prev, theme: cloudSettings.theme }));
      }

      const cloudMap = await loadMapStateFromCloud(user.id, cloudProgress?.world_number || 1);
      if (cloudMap) setMapNodes(cloudMap);
    } catch (error) {
      console.error('Error loading cloud data:', error);
    }
  };

  const syncProgress = async (jade: number, currentStreak: number, bestStreak: number, questionsAnswered: number, bossesDefeated: number, worldNumber: number, gradeLevel: number, wordsLearned: string[]) => {
    saveProgress(jade, bestStreak, bossesDefeated, questionsAnswered, wordsLearned, worldNumber);
    if (user) {
      try {
        await syncProgressToCloud(user.id, jade, currentStreak, bestStreak, questionsAnswered, bossesDefeated, worldNumber, gradeLevel, wordsLearned);
      } catch (error) {
        console.error('Error syncing progress:', error);
      }
    }
  };

  const currentLevel = levels[gameState.currentLevelIndex] || levels[0];
  const fullSentence = currentLevel ? getLevelFullSentence(currentLevel) : '';
  const correctAnswer = currentLevel ? getCorrectAnswerFromLevel(currentLevel) : '';
  const activeCompanion = inventory.companions.find(c => c.id === inventory.activeCompanion) || null;

  const getJadeBonus = (): number => activeCompanion?.buffType === 'jade_boost' ? activeCompanion.buffValue : 0;
  const getComboMultiplier = (): number => activeCompanion?.buffType === 'combo_master' ? activeCompanion.buffValue : 1;

  const handleNodeSelect = (node: MapNode) => {
    if (node.type === 'treasure') {
      const jadeReward = node.reward || 300;
      const newJade = gameState.jade + jadeReward;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ffd700', '#ffed4e', '#00b06f'] });

      const updatedNodes = mapNodes.map((n) => {
        if (n.id === node.id) return { ...n, status: 'completed' as const };
        const nodeIndex = mapNodes.findIndex(mn => mn.id === n.id);
        const completedIndex = mapNodes.findIndex(mn => mn.id === node.id);
        if (nodeIndex === completedIndex + 1) return { ...n, status: 'unlocked' as const };
        return n;
      });

      setMapNodes(updatedNodes);
      saveMapState(updatedNodes, gameState.worldNumber);
      if (user) syncMapStateToCloud(user.id, updatedNodes, gameState.worldNumber);
      setGameState(prev => ({ ...prev, jade: newJade }));
      syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));
      return;
    }

    const isListeningMode = node.type === 'blind';
    const isBoss = node.type === 'boss';
    const questionCount = isBoss ? 3 : 5;
    setLevels(generateLevel(settings.gradeLevel, questionCount, gameState.seenQuestionIds));
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
      nodeQuestionsTotal: questionCount,
      nodeQuestionsAnswered: 0,
      bossHp: isBoss ? 3 : 0,
      bossMaxHp: isBoss ? 3 : 0,
    }));

    if (isBoss) {
      setCurrentBoss(getBossForWorld(gameState.worldNumber));
      setIsBossMode(true);
      setBossTimer(45);
    }
    setShowMap(false);
  };

  const handleOptionClick = async (option: AnswerOption) => {
    if (gameState.showFeedback) return;
    sfxManager.play('click');
    const isCorrect = option.value === correctAnswer;
    if (gameState.gameMode === 'listening') setCharRevealed(true);

    const newNodeAnswered = gameState.nodeQuestionsAnswered + 1;
    setGameState(prev => ({ ...prev, selectedOption: option.value, isCorrect, showFeedback: true, questionsAnswered: prev.questionsAnswered + 1, nodeQuestionsAnswered: newNodeAnswered }));
    setSessionStats(prev => ({ ...prev, questionsAnswered: prev.questionsAnswered + 1, correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers }));

    if (isCorrect) {
      setCompanionHappy(true);
      setTimeout(() => setCompanionHappy(false), 800);
      sfxManager.play('correct');

      const newWords = new Set(gameState.wordsLearned);
      newWords.add(correctAnswer);
      if (!sessionStats.wordsLearned.includes(correctAnswer)) {
        setSessionStats(prev => ({ ...prev, wordsLearned: [...prev.wordsLearned, correctAnswer] }));
      }
      addWordLearned(correctAnswer);

      const baseReward = isBossMode ? 800 : 100;
      const jadeReward = Math.floor(baseReward * (1 + getJadeBonus() / 100));
      const streakIncrement = Math.ceil(getComboMultiplier());
      if (gameState.currentStreak + streakIncrement >= 3) sfxManager.play('combo');

      confetti({ particleCount: isBossMode ? 200 : 100, spread: isBossMode ? 120 : 70, origin: { y: 0.6 }, colors: isBossMode ? ['#ffd700', '#ffed4e', '#ff6b35'] : ['#00b06f', '#ffd700', '#ffffff'] });

      if (jadeAnimTimer.current) clearTimeout(jadeAnimTimer.current);
      setJadeAnimAmount(jadeReward);
      setJadeAnimBonus(getJadeBonus());
      sfxManager.play('jade');
      jadeAnimTimer.current = setTimeout(() => setJadeAnimAmount(null), 1500);

      const newJade = gameState.jade + jadeReward;
      const newStreak = gameState.currentStreak + streakIncrement;
      const newBestStreak = Math.max(newStreak, gameState.bestStreak);

      if (STREAK_MILESTONES.includes(newStreak)) {
        if (streakCelebTimer.current) clearTimeout(streakCelebTimer.current);
        setStreakCelebration(newStreak);
        sfxManager.play(newStreak >= 10 ? 'streak10' : 'streak5');
        confetti({ particleCount: 300, spread: 150, origin: { y: 0.4 }, colors: ['#ffd700', '#ff6b35', '#00ffaa', '#00b0ff', '#ffffff'] });
        streakCelebTimer.current = setTimeout(() => setStreakCelebration(null), 2500);
      }

      let newBossesDefeated = gameState.bossesDefeated;
      const newBossHp = isBossMode ? gameState.bossHp - 1 : 0;

      if (isBossMode && newBossHp <= 0) {
        newBossesDefeated += 1;
        sfxManager.play('boss');
        setSessionStats(prev => ({ ...prev, bossesDefeated: prev.bossesDefeated + 1 }));
      }

      setGameState(prev => ({ ...prev, jade: newJade, currentStreak: newStreak, bestStreak: newBestStreak, bossesDefeated: newBossesDefeated, wordsLearned: newWords, bossHp: isBossMode ? newBossHp : prev.bossHp }));
      setSessionStats(prev => ({ ...prev, jadeEarned: prev.jadeEarned + jadeReward }));
      syncProgress(newJade, newStreak, newBestStreak, gameState.questionsAnswered + 1, newBossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(newWords));

      if (user) {
        recordCharacterAttempt(user.id, correctAnswer, true);
        recordQuestionAttempt(user.id, String(currentLevel.id), true);
      }
      markQuestionAnswered(currentLevel.id);

      runAchievementCheck({
        questionsAnswered: gameState.questionsAnswered + 1,
        bestStreak: newBestStreak,
        bossesDefeated: newBossesDefeated,
        wordsLearned: newWords.size,
        jade: newJade,
        worldNumber: gameState.worldNumber,
      });

      if (isBossMode && newBossHp <= 0) {
        if (bossTimerRef.current) { clearInterval(bossTimerRef.current); bossTimerRef.current = null; }
        if (lootBoxTimeoutRef.current) clearTimeout(lootBoxTimeoutRef.current);
        setCurrentBoss(null);
        setAwaitingLoot(true);
        lootBoxTimeoutRef.current = setTimeout(() => { setAwaitingLoot(false); setIsLootBoxOpen(true); setIsBossMode(false); lootBoxTimeoutRef.current = null; }, 2000);
      }
    } else {
      sfxManager.play('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (user) recordQuestionAttempt(user.id, String(currentLevel.id), false);
      markQuestionAnswered(currentLevel.id);

      const shouldResetStreak = !(gameState.streakShieldActive && !gameState.streakShieldUsed);
      setGameState(prev => shouldResetStreak ? { ...prev, currentStreak: 0 } : { ...prev, streakShieldUsed: true });

      if (isBossMode) {
        const newBossHp = Math.min(gameState.bossHp + 1, gameState.bossMaxHp);
        setGameState(prev => ({ ...prev, bossHp: newBossHp }));
      }
    }
  };

  const handleBossTimeout = () => {
    sfxManager.play('wrong');
    setShake(true);
    setTimeout(() => setShake(false), 500);
    if (bossTimerRef.current) { clearInterval(bossTimerRef.current); bossTimerRef.current = null; }
    setCurrentBoss(null);
    setIsBossMode(false);
    setGameState(prev => ({ ...prev, currentStreak: 0, selectedOption: null, isCorrect: false, showFeedback: true }));
  };

  const handleNext = () => {
    const nextIndex = gameState.currentLevelIndex + 1;
    setShowHint(false);

    if (gameState.currentNodeId) {
      const hasMoreQuestions = nextIndex < levels.length && gameState.nodeQuestionsAnswered < gameState.nodeQuestionsTotal;
      const isBossDefeated = isBossMode && gameState.bossHp <= 0;

      if (hasMoreQuestions && !isBossDefeated) {
        autoSpeakDone.current = false;
        setCharRevealed(false);
        setGameState(prev => ({ ...prev, currentLevelIndex: nextIndex, selectedOption: null, isCorrect: null, showFeedback: false }));
        return;
      }

      const currentNode = mapNodes.find(n => n.id === gameState.currentNodeId);
      const isBossNode = currentNode?.type === 'boss';
      const shouldCompleteNode = !isBossNode || isBossDefeated || gameState.isCorrect;

      const updatedNodes = mapNodes.map(n => {
        if (n.id === gameState.currentNodeId && shouldCompleteNode) return { ...n, status: 'completed' as const };
        if (shouldCompleteNode) {
          const nodeIndex = mapNodes.findIndex(mn => mn.id === n.id);
          const completedIndex = mapNodes.findIndex(mn => mn.id === gameState.currentNodeId);
          if (nodeIndex === completedIndex + 1) return { ...n, status: 'unlocked' as const };
        }
        return n;
      });

      setMapNodes(updatedNodes);
      saveMapState(updatedNodes, gameState.worldNumber);
      if (user) syncMapStateToCloud(user.id, updatedNodes, gameState.worldNumber);

      if (updatedNodes.every(n => n.status === 'completed')) setIsLevelClearedOpen(true);
      else setShowMap(true);

      if (isBossNode) setIsBossMode(false);
      setGameState(prev => ({ ...prev, selectedOption: null, isCorrect: null, showFeedback: false, currentNodeId: null, nodeQuestionsTotal: 0, nodeQuestionsAnswered: 0 }));
    } else if (nextIndex >= levels.length) {
      setIsLevelClearedOpen(true);
      setGameState(prev => ({ ...prev, selectedOption: null, isCorrect: null, showFeedback: false }));
    } else {
      autoSpeakDone.current = false;
      setCharRevealed(false);
      setGameState(prev => ({ ...prev, currentLevelIndex: nextIndex, selectedOption: null, isCorrect: null, showFeedback: false }));
    }
  };

  const handleLevelClearedContinue = () => {
    const newJade = gameState.jade + 500;
    const newWorldNumber = gameState.worldNumber + 1;
    setLevels(generateLevel(settings.gradeLevel, 10, gameState.seenQuestionIds));
    const newNodes = generateWorldNodes(newWorldNumber);
    setMapNodes(newNodes);
    saveMapState(newNodes, newWorldNumber);
    setGameState(prev => ({ ...prev, currentLevelIndex: 0, jade: newJade, worldNumber: newWorldNumber, selectedOption: null, isCorrect: null, showFeedback: false, currentNodeId: null }));
    syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, newWorldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));
    setIsLevelClearedOpen(false);
    setShowMap(true);
  };

  const handleSpeak = async () => {
    setIsSpeaking(true);
    sfxManager.play('click');
    try {
      await speakChinese(fullSentence, '', '', settings.useAzureTts, settings.audioLanguage, settings.audioSpeed);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    const oldGrade = settings.gradeLevel;
    const newGrade = newSettings.gradeLevel;
    const updatedSettings = { ...newSettings, audioSpeed: newSettings.audioSpeed || 0.75, bgmVolume: newSettings.bgmVolume ?? 0.1 };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);

    if (oldGrade !== newGrade) {
      resetSessionTracker();
      const seenIds = new Set<number | string>();
      setLevels(generateLevel(newGrade, 10, seenIds));
      const newNodes = generateWorldNodes(1);
      setMapNodes(newNodes);
      saveMapState(newNodes, 1);
      setGameState(prev => ({ ...prev, currentLevelIndex: 0, gradeLevel: newGrade, selectedOption: null, isCorrect: null, showFeedback: false, worldNumber: 1, seenQuestionIds: seenIds, currentNodeId: null }));
      setShowMap(true);
    }
  };

  const handleGachaRoll = (companion: Companion) => {
    sfxManager.play('gacha');
    const updatedCompanions = [...inventory.companions];
    const existingIndex = updatedCompanions.findIndex(c => c.id === companion.id);
    if (existingIndex >= 0) updatedCompanions[existingIndex] = companion;
    else updatedCompanions.push(companion);

    const newInventory = { ...inventory, companions: updatedCompanions, activeCompanion: companion.id };
    setInventory(newInventory);
    saveInventory(newInventory);
    if (user) syncCompanionsToCloud(user.id, newInventory.companions, newInventory.activeCompanion);

    const newJade = gameState.jade - 500;
    setGameState(prev => ({ ...prev, jade: newJade, streakShieldActive: companion.buffType === 'streak_shield' }));
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
      if (existingIndex >= 0) updatedCompanions[existingIndex] = reward.companion;
      else updatedCompanions.push(reward.companion);
      const newInventory = { ...inventory, companions: updatedCompanions };
      setInventory(newInventory);
      saveInventory(newInventory);
    }
  }, [gameState, settings.gradeLevel, inventory.companions]);

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
      if (user) syncMapStateToCloud(user.id, updatedNodes, gameState.worldNumber);
      if (updatedNodes.every(n => n.status === 'completed')) setIsLevelClearedOpen(true);
      else setShowMap(true);
      setGameState(prev => ({ ...prev, selectedOption: null, isCorrect: null, showFeedback: false, currentNodeId: null }));
    } else {
      setShowMap(true);
      setGameState(prev => ({ ...prev, selectedOption: null, isCorrect: null, showFeedback: false }));
    }
  }, [gameState.currentNodeId, mapNodes, gameState.worldNumber, user]);

  const handleInventoryChange = (newInv: PlayerInventory) => {
    setInventory(newInv);
    saveInventory(newInv);
  };

  const runAchievementCheck = (overrides?: Partial<{ jade: number; questionsAnswered: number; bestStreak: number; bossesDefeated: number; wordsLearned: number; worldNumber: number }>) => {
    const stats = {
      questionsAnswered: overrides?.questionsAnswered ?? gameState.questionsAnswered,
      bestStreak: overrides?.bestStreak ?? gameState.bestStreak,
      bossesDefeated: overrides?.bossesDefeated ?? gameState.bossesDefeated,
      wordsLearned: overrides?.wordsLearned ?? gameState.wordsLearned.size,
      worldNumber: overrides?.worldNumber ?? gameState.worldNumber,
      jade: overrides?.jade ?? gameState.jade,
      daysPlayed: 0,
      consecutiveDays: getConsecutiveDays(),
    };
    const newlyUnlocked = checkAchievements(stats);
    if (newlyUnlocked.length > 0) {
      let totalBonus = 0;
      for (const a of newlyUnlocked) totalBonus += a.jadeReward;
      if (totalBonus > 0) {
        setGameState(prev => ({ ...prev, jade: prev.jade + totalBonus }));
      }
      achievementQueueRef.current.push(...newlyUnlocked);
      if (!achievementToast) showNextAchievement();
    }
  };

  const showNextAchievement = () => {
    const next = achievementQueueRef.current.shift();
    if (next) {
      setAchievementToast(next);
      setTimeout(() => {
        setAchievementToast(null);
        setTimeout(() => showNextAchievement(), 300);
      }, 3000);
    }
  };

  const handleDailyRewardClaim = () => {
    const jadeReward = claimDailyReward();
    if (jadeReward > 0) {
      const newJade = gameState.jade + jadeReward;
      setGameState(prev => ({ ...prev, jade: newJade }));
      syncProgress(newJade, gameState.currentStreak, gameState.bestStreak, gameState.questionsAnswered, gameState.bossesDefeated, gameState.worldNumber, settings.gradeLevel, Array.from(gameState.wordsLearned));
    }
    setIsDailyRewardOpen(false);
    runAchievementCheck({ jade: gameState.jade + jadeReward });
  };

  if (!currentLevel && !showMap) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const wordsLearnedArray = Array.from(gameState.wordsLearned);

  const sharedOverlays = (
    <>
      <JadeAnimation amount={jadeAnimAmount} bonus={jadeAnimBonus} />
      <StreakCelebration streak={streakCelebration} />
      <DailyRewardModal
        isOpen={isDailyRewardOpen}
        onClaim={handleDailyRewardClaim}
        reward={dailyRewardData.reward}
        allRewards={dailyRewardData.allRewards}
      />
      <AchievementToast achievement={achievementToast} onDismiss={() => setAchievementToast(null)} />
    </>
  );

  if (showMap) {
    return (
      <>
        <MapView
          settings={settings}
          inventory={inventory}
          mapNodes={mapNodes}
          worldNumber={gameState.worldNumber}
          jade={gameState.jade}
          bgmEnabled={bgmEnabled}
          activeCompanion={activeCompanion}
          companionHappy={companionHappy}
          sessionStats={sessionStats}
          debugMessage={debugMessage}
          debugIsError={debugIsError}
          isSettingsOpen={isSettingsOpen}
          isGachaOpen={isGachaOpen}
          isReportOpen={isReportOpen}
          isAuthModalOpen={isAuthModalOpen}
          isWordBookOpen={isWordBookOpen}
          isFlashcardOpen={isFlashcardOpen}
          wordsLearned={wordsLearnedArray}
          onNodeSelect={handleNodeSelect}
          onBgmToggle={() => setBgmEnabled(!bgmEnabled)}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onSettingsClose={() => setIsSettingsOpen(false)}
          onGachaOpen={() => setIsGachaOpen(true)}
          onGachaClose={() => setIsGachaOpen(false)}
          onReportOpen={() => setIsReportOpen(true)}
          onReportClose={() => setIsReportOpen(false)}
          onAuthOpen={() => setIsAuthModalOpen(true)}
          onAuthClose={() => setIsAuthModalOpen(false)}
          onWordBookOpen={() => setIsWordBookOpen(true)}
          onWordBookClose={() => setIsWordBookOpen(false)}
          onFlashcardOpen={() => setIsFlashcardOpen(true)}
          onFlashcardClose={() => setIsFlashcardOpen(false)}
          onSettingsChange={handleSettingsChange}
          onInventoryChange={handleInventoryChange}
          onGachaRoll={handleGachaRoll}
          onDebugClose={() => setDebugMessage('')}
        />
        <LevelClearedModal isOpen={isLevelClearedOpen} worldNumber={gameState.worldNumber} jadeBonus={500} onContinue={handleLevelClearedContinue} />
        {sharedOverlays}
      </>
    );
  }

  return (
    <>
      <BattleView
        gameState={gameState}
        settings={settings}
        inventory={inventory}
        currentLevel={currentLevel}
        correctAnswer={correctAnswer}
        activeCompanion={activeCompanion}
        companionHappy={companionHappy}
        sessionStats={sessionStats}
        levels={levels}
        isBossMode={isBossMode}
        bossTimer={bossTimer}
        currentBoss={currentBoss}
        musicState={musicState}
        bgmEnabled={bgmEnabled}
        shake={shake}
        isSpeaking={isSpeaking}
        charRevealed={charRevealed}
        showHint={showHint}
        awaitingLoot={awaitingLoot}
        debugMessage={debugMessage}
        debugIsError={debugIsError}
        isSettingsOpen={isSettingsOpen}
        isGachaOpen={isGachaOpen}
        isReportOpen={isReportOpen}
        isAuthModalOpen={isAuthModalOpen}
        onOptionClick={handleOptionClick}
        onSpeak={handleSpeak}
        onNext={handleNext}
        onShowMap={() => setShowMap(true)}
        onToggleHint={() => setShowHint(!showHint)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onSettingsClose={() => setIsSettingsOpen(false)}
        onGachaOpen={() => setIsGachaOpen(true)}
        onGachaClose={() => setIsGachaOpen(false)}
        onReportOpen={() => setIsReportOpen(true)}
        onReportClose={() => setIsReportOpen(false)}
        onAuthOpen={() => setIsAuthModalOpen(true)}
        onAuthClose={() => setIsAuthModalOpen(false)}
        onSettingsChange={handleSettingsChange}
        onInventoryChange={handleInventoryChange}
        onGachaRoll={handleGachaRoll}
        onDebugClose={() => setDebugMessage('')}
        getJadeBonus={getJadeBonus}
      />
      <LevelClearedModal isOpen={isLevelClearedOpen} worldNumber={gameState.worldNumber} jadeBonus={500} onContinue={handleLevelClearedContinue} />
      <LootBoxModal isOpen={isLootBoxOpen} onClose={handleLootBoxClose} onReward={handleLootReward} />
      {sharedOverlays}
    </>
  );
}
