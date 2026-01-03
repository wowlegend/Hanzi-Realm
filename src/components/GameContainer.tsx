import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Volume2, Settings as SettingsIcon, Loader, Gift, Trophy } from 'lucide-react';
import { generateLevel } from '../data/questionBank';
import { GameState, GameSettings, PlayerInventory, Companion, Level, SessionStats } from '../types';
import { saveProgress, loadProgress, saveInventory, loadInventory, saveSettings, loadSettings, addWordLearned } from '../utils/storage';
import { speakChinese, setDebugCallback } from '../utils/audio';
import { sfxManager } from '../utils/sfx';
import { AUDIO_DEFAULTS } from '../utils/constants';
import SettingsModal from './SettingsModal';
import CompanionDisplay from './CompanionDisplay';
import GachaModal from './GachaModal';
import BossBanner from './BossBanner';
import ReportCard from './ReportCard';
import GradeBackground from './GradeBackground';
import DebugLog from './DebugLog';
import LevelClearedModal from './LevelClearedModal';

export default function GameContainer() {
  const [levels, setLevels] = useState<Level[]>([]);
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
  });

  const [settings, setSettings] = useState<GameSettings>({
    elevenLabsApiKey: '',
    audioLanguage: 'zh-CN',
    useElevenLabs: true,
    voiceId: 'WuLq5z7nEcrhppO0ZQJw',
    gradeLevel: 1,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDebugCallback((message: string, isError: boolean) => {
      setDebugMessage(message);
      setDebugIsError(isError);
    });
  }, []);

  useEffect(() => {
    // Initialize default Azure TTS settings for zero-config experience
    if (!localStorage.getItem('azure_key')) {
      localStorage.setItem('azure_key', AUDIO_DEFAULTS.KEY);
    }
    if (!localStorage.getItem('azure_region')) {
      localStorage.setItem('azure_region', AUDIO_DEFAULTS.REGION);
    }
    if (!localStorage.getItem('azureVoice')) {
      localStorage.setItem('azureVoice', AUDIO_DEFAULTS.VOICE);
    }

    const progress = loadProgress();
    const inv = loadInventory();
    const sett = loadSettings();

    const apiKey = localStorage.getItem('elevenlabs_key') || sett.elevenLabsApiKey;

    const gradeToUse = sett.gradeLevel || 1;
    const seenIds = new Set<number>();
    const levelsForGrade = generateLevel(gradeToUse, 10, seenIds);

    setLevels(levelsForGrade);
    setGameState(prev => ({
      ...prev,
      jade: progress.jade,
      bestStreak: progress.bestStreak,
      bossesDefeated: progress.bossesDefeated,
      questionsAnswered: progress.totalQuestionsAnswered,
      gradeLevel: gradeToUse,
      wordsLearned: new Set(progress.wordsLearned),
      seenQuestionIds: seenIds,
    }));
    setInventory(inv);
    setSettings({
      ...sett,
      elevenLabsApiKey: apiKey,
      gradeLevel: gradeToUse,
      audioSpeed: sett.audioSpeed || 0.75
    });
  }, []);

  useEffect(() => {
    if (levels.length > 0 && gameState.currentLevelIndex >= levels.length) {
      setGameState(prev => ({ ...prev, currentLevelIndex: 0 }));
    }
  }, [levels, gameState.currentLevelIndex]);

  useEffect(() => {
    if (isBossMode) {
      bossTimerRef.current = setInterval(() => {
        setBossTimer(prev => {
          if (prev <= 1) {
            handleBossTimeout();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
        bossTimerRef.current = null;
      }
      setBossTimer(10);
    }

    return () => {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
      }
    };
  }, [isBossMode]);

  const currentLevel = levels[gameState.currentLevelIndex] || levels[0];
  if (!currentLevel) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const fullSentence = currentLevel.sentence_prefix + currentLevel.missing_char + currentLevel.sentence_suffix;

  const handleOptionClick = async (option: string) => {
    if (gameState.showFeedback) return;

    sfxManager.play('click');
    const isCorrect = option === currentLevel.missing_char;

    setGameState(prev => ({
      ...prev,
      selectedOption: option,
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
      newWords.add(currentLevel.missing_char);

      if (!sessionStats.wordsLearned.includes(currentLevel.missing_char)) {
        setSessionStats(prev => ({
          ...prev,
          wordsLearned: [...prev.wordsLearned, currentLevel.missing_char],
        }));
      }

      addWordLearned(currentLevel.missing_char);

      const jadeReward = isBossMode ? 500 : 100;

      if (gameState.currentStreak + 1 >= 3) {
        sfxManager.play('combo');
      }

      confetti({
        particleCount: isBossMode ? 200 : 100,
        spread: isBossMode ? 120 : 70,
        origin: { y: 0.6 },
        colors: isBossMode ? ['#ffd700', '#ffed4e', '#ff6b35'] : ['#00b06f', '#ffd700', '#ffffff'],
      });

      const newJade = gameState.jade + jadeReward;
      const newStreak = gameState.currentStreak + 1;
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

      saveProgress(newJade, newBestStreak, newBossesDefeated, gameState.questionsAnswered + 1, Array.from(newWords));
    } else {
      sfxManager.play('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);

      setGameState(prev => ({
        ...prev,
        currentStreak: 0,
      }));
    }

    if (isBossMode) {
      setIsBossMode(false);
    }
  };

  const handleBossTimeout = () => {
    sfxManager.play('wrong');
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setIsBossMode(false);
    setGameState(prev => ({
      ...prev,
      currentStreak: 0,
    }));
  };

  const handleNext = () => {
    const nextIndex = gameState.currentLevelIndex + 1;
    const shouldTriggerBoss = (gameState.questionsAnswered + 1) % 10 === 0 && gameState.isCorrect;

    if (shouldTriggerBoss && !isBossMode) {
      setIsBossMode(true);
      setBossTimer(10);
    }

    if (nextIndex >= levels.length) {
      setIsLevelClearedOpen(true);
      setGameState(prev => ({
        ...prev,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
      }));
    } else {
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

    setGameState(prev => ({
      ...prev,
      currentLevelIndex: 0,
      jade: newJade,
      worldNumber: newWorldNumber,
      selectedOption: null,
      isCorrect: null,
      showFeedback: false,
    }));

    saveProgress(newJade, gameState.bestStreak, gameState.bossesDefeated, gameState.questionsAnswered, Array.from(gameState.wordsLearned));

    setIsLevelClearedOpen(false);
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

    const updatedSettings = { ...newSettings, audioSpeed: newSettings.audioSpeed || 0.75 };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);

    if (oldGrade !== newGrade) {
      const seenIds = new Set<number>();
      const newLevels = generateLevel(newGrade, 10, seenIds);
      setLevels(newLevels);
      setGameState(prev => ({
        ...prev,
        currentLevelIndex: 0,
        gradeLevel: newGrade,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
        worldNumber: 1,
        seenQuestionIds: seenIds,
      }));
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

    const newJade = gameState.jade - 500;
    setGameState(prev => ({ ...prev, jade: newJade }));
    saveProgress(newJade, gameState.bestStreak, gameState.bossesDefeated, gameState.questionsAnswered, Array.from(gameState.wordsLearned));
  };

  const activeCompanion = inventory.companions.find(c => c.id === inventory.activeCompanion) || null;

  const progressPercentage = ((gameState.currentLevelIndex + 1) / levels.length) * 100;

  return (
    <>
      <GradeBackground gradeLevel={settings.gradeLevel} />

      <div
        ref={containerRef}
        className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
      >
        <AnimatePresence>
          {isBossMode && <BossBanner timeLeft={bossTimer} maxTime={10} />}
        </AnimatePresence>

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl relative z-10"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-1 tracking-tight drop-shadow-lg">
                Hanzi Realm 💎
              </h1>
              <p className="text-white text-xs sm:text-sm drop-shadow">Grade {settings.gradeLevel} - World {gameState.worldNumber}</p>
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
            <div className="voxel-card glass-yellow border-yellow-700 px-4 py-2 sm:px-6 sm:py-3">
              <p className="text-white text-sm sm:text-base font-black drop-shadow">
                💎 {gameState.jade}
              </p>
            </div>
            <div className="voxel-card border-orange-700 px-4 py-2 sm:px-6 sm:py-3 relative">
              {gameState.currentStreak >= 3 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -top-3 -right-3 text-3xl"
                >
                  🔥
                </motion.div>
              )}
              <p className={`text-sm sm:text-base font-black drop-shadow ${
                gameState.currentStreak > 0 ? 'text-white' : 'text-gray-300'
              }`}>
                Streak: {gameState.currentStreak}
              </p>
            </div>
            <div className="voxel-card glass-green border-green-700 px-4 py-2 sm:px-6 sm:py-3">
              <p className="text-white text-sm sm:text-base font-black drop-shadow">
                Best: {gameState.bestStreak}
              </p>
            </div>
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
            className={`voxel-card rounded-3xl p-6 sm:p-8 mb-6 ${
              isBossMode ? 'border-red-500 border-8' : 'border-gray-700'
            }`}
          >
            <div className="mb-6">
              <h2 className="text-[#00b06f] text-xl sm:text-2xl font-black mb-4 drop-shadow">
                {isBossMode && '👹 BOSS: '}{currentLevel.scenario}
              </h2>

              <div className="border-2 border-white/10 rounded-2xl p-4 sm:p-6 relative bg-black/10 backdrop-blur-sm">
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 btn-3d-green p-2 rounded-lg"
                  aria-label="Speak sentence"
                >
                  {isSpeaking ? (
                    <Loader className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                <div
                  className={`text-2xl sm:text-4xl font-bold text-center pr-12 transition-all duration-300 ${
                    isAudioPlaying ? 'text-[#00b06f]' : 'text-white'
                  }`}
                >
                  {currentLevel.sentence_prefix}
                  <motion.span
                    animate={
                      gameState.showFeedback && gameState.isCorrect
                        ? { scale: [1, 1.3, 1], rotateY: [0, 360] }
                        : {}
                    }
                    transition={{ duration: 0.6 }}
                    className={`
                      inline-block rounded-lg px-3 sm:px-4 py-1 sm:py-2 mx-1 sm:mx-2 min-w-[3rem] sm:min-w-[4rem]
                      ${gameState.showFeedback && gameState.isCorrect
                        ? 'bg-[#00b06f] text-white border-4 border-white'
                        : gameState.showFeedback && !gameState.isCorrect
                        ? 'bg-[#ff3e3e] text-white border-4 border-black'
                        : 'bg-[#00b06f] bg-opacity-20 border-2 border-dashed border-[#00b06f]'
                      }
                    `}
                  >
                    {gameState.showFeedback ? gameState.selectedOption : '___'}
                  </motion.span>
                  {currentLevel.sentence_suffix}
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6">
              {currentLevel.options.map((option) => {
                const isSelected = gameState.selectedOption === option.char;
                const isCorrectAnswer = option.char === currentLevel.missing_char;
                const showAsCorrect = gameState.showFeedback && isSelected && gameState.isCorrect;
                const showAsWrong = gameState.showFeedback && isSelected && !gameState.isCorrect;
                const showCorrectHighlight = gameState.showFeedback && !gameState.isCorrect && isCorrectAnswer;

                return (
                  <motion.button
                    key={option.char}
                    onClick={() => handleOptionClick(option.char)}
                    onHoverStart={() => setHoveredOption(option.char)}
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
                      <span className="text-3xl sm:text-4xl">{option.char}</span>
                      {hoveredOption === option.char && !gameState.showFeedback && (
                        <span className="text-sm sm:text-base text-gray-300 bg-gray-900/60 px-3 py-1 rounded-lg border-2 border-gray-600">
                          {option.hint}
                        </span>
                      )}
                      {gameState.showFeedback && isSelected && (
                        <span className="text-sm sm:text-base">
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
                  {gameState.isCorrect ? currentLevel.correct_explanation : (
                    <>
                      Wrong! That means "{currentLevel.options.find(o => o.char === gameState.selectedOption)?.explanation}"!
                    </>
                  )}
                </p>
                {gameState.isCorrect && (
                  <p className="text-[#ffd700] font-black mt-2 text-2xl">
                    +{isBossMode ? 500 : 100} 💎
                  </p>
                )}
              </motion.div>
            )}

            {gameState.showFeedback && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d-green w-full text-white font-black py-4 sm:py-5 px-6 rounded-2xl text-lg sm:text-xl shadow-lg"
              >
                {gameState.currentLevelIndex < levels.length - 1 ? 'Next Challenge ⚔️' : 'New Adventure 🌟'}
              </motion.button>
            )}
          </motion.div>

          <div className="border border-white/20 rounded-full h-4 sm:h-6 overflow-hidden bg-black/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-[#00b06f] to-[#ffd700] h-full rounded-full"
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

        <CompanionDisplay companion={activeCompanion} isHappy={companionHappy} />

        <DebugLog
          message={debugMessage}
          isError={debugIsError}
          onClose={() => setDebugMessage('')}
        />
      </div>
    </>
  );
}
