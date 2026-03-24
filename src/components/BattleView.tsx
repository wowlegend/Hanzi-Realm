import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader, Zap, Lightbulb, Search, Flame, Headphones } from 'lucide-react';
import { GameState, GameSettings, PlayerInventory, Companion, Level, SessionStats, MusicState, AnswerOption } from '../types';
import { getBuffDescription } from '../data/companions';
import { Boss } from '../data/bosses';
import GradeBackground from './GradeBackground';
import MusicManager from './MusicManager';
import NavBar from './NavBar';
import BossBattle from './BossBattle';
import NarratorAvatar from './NarratorAvatar';
import { ContentBlockRenderer } from './RubyText';
import SentenceOrderView from './SentenceOrderView';
import SettingsModal from './SettingsModal';
import GachaModal from './GachaModal';
import ReportCard from './ReportCard';
import CompanionDisplay from './CompanionDisplay';
import DebugLog from './DebugLog';
import AuthModal from './AuthModal';
import WordBook from './WordBook';
import FlashcardReview from './FlashcardReview';

function StreakMeter({ streak, fireMode }: { streak: number; fireMode: boolean }) {
  const maxDisplay = 10;
  const filled = Math.min(streak, maxDisplay);
  const percentage = (filled / maxDisplay) * 100;
  const nextMilestone = [5, 10, 15, 20, 25].find(m => m > streak) || 25;

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold ${fireMode ? 'text-orange-300' : 'text-white/60'}`}>
            {fireMode ? 'FIRE MODE' : `Streak: ${streak}`}
          </span>
          <span className="text-[10px] text-white/40">Next: {nextMilestone}</span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className={`h-full rounded-full ${
              fireMode
                ? 'bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400'
                : streak >= 3
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
      {streak >= 3 && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          {fireMode
            ? <Flame className="w-5 h-5 text-orange-400" />
            : <Zap className="w-5 h-5 text-teal-400" />
          }
        </motion.div>
      )}
    </div>
  );
}

function ListeningWaveform() {
  const bars = 12;
  return (
    <div className="flex items-center justify-center gap-1 py-2">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-yellow-500 to-yellow-300"
          animate={{
            height: [8, 16 + Math.random() * 16, 8],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
      <Headphones className="w-4 h-4 text-yellow-400 ml-2" />
      <span className="text-yellow-400 text-xs font-bold ml-1">Listening Mode</span>
    </div>
  );
}

function FireParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
      size: 3 + Math.random() * 4,
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: 0,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #ff6b35, #ff3e00)`,
          }}
          animate={{
            y: [0, -200],
            opacity: [0.8, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

interface BattleViewProps {
  gameState: GameState;
  settings: GameSettings;
  inventory: PlayerInventory;
  currentLevel: Level;
  correctAnswer: string;
  activeCompanion: Companion | null;
  companionHappy: boolean;
  sessionStats: SessionStats;
  levels: Level[];
  isBossMode: boolean;
  bossTimer: number;
  currentBoss: Boss | null;
  musicState: MusicState;
  bgmEnabled: boolean;
  shake: boolean;
  isSpeaking: boolean;
  charRevealed: boolean;
  showHint: boolean;
  awaitingLoot: boolean;
  debugMessage: string;
  debugIsError: boolean;
  isSettingsOpen: boolean;
  isGachaOpen: boolean;
  isReportOpen: boolean;
  isAuthModalOpen: boolean;
  isWordBookOpen: boolean;
  isFlashcardOpen: boolean;
  wordsLearned: string[];
  onOptionClick: (option: AnswerOption) => void;
  onSpeak: () => void;
  onNext: () => void;
  onShowMap: () => void;
  onToggleHint: () => void;
  onBgmToggle: () => void;
  onSettingsOpen: () => void;
  onSettingsClose: () => void;
  onGachaOpen: () => void;
  onGachaClose: () => void;
  onReportOpen: () => void;
  onReportClose: () => void;
  onAuthOpen: () => void;
  onAuthClose: () => void;
  onWordBookOpen: () => void;
  onWordBookClose: () => void;
  onFlashcardOpen: () => void;
  onFlashcardClose: () => void;
  onSettingsChange: (settings: GameSettings) => void;
  onInventoryChange: (inventory: PlayerInventory) => void;
  onGachaRoll: (companion: Companion) => void;
  onDebugClose: () => void;
  onSentenceSubmit?: (answer: string) => void;
  getJadeBonus: () => number;
}

export default function BattleView({
  gameState,
  settings,
  inventory,
  currentLevel,
  correctAnswer,
  activeCompanion,
  companionHappy,
  sessionStats,
  levels,
  isBossMode,
  bossTimer,
  currentBoss,
  musicState,
  bgmEnabled,
  shake,
  isSpeaking,
  charRevealed,
  showHint,
  awaitingLoot,
  debugMessage,
  debugIsError,
  isSettingsOpen,
  isGachaOpen,
  isReportOpen,
  isAuthModalOpen,
  isWordBookOpen,
  isFlashcardOpen,
  wordsLearned,
  onOptionClick,
  onSpeak,
  onNext,
  onShowMap,
  onToggleHint,
  onBgmToggle,
  onSettingsOpen,
  onSettingsClose,
  onGachaOpen,
  onGachaClose,
  onReportOpen,
  onReportClose,
  onAuthOpen,
  onAuthClose,
  onWordBookOpen,
  onWordBookClose,
  onFlashcardOpen,
  onFlashcardClose,
  onSettingsChange,
  onInventoryChange,
  onGachaRoll,
  onDebugClose,
  onSentenceSubmit,
  getJadeBonus,
}: BattleViewProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState.showFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [gameState.showFeedback]);

  const audioSettings = {
    useAzureTts: settings.useAzureTts,
    audioLanguage: settings.audioLanguage,
    audioSpeed: settings.audioSpeed,
  };

  const isInNode = !!gameState.currentNodeId;
  const nodeProgress = isInNode ? gameState.nodeQuestionsAnswered : 0;
  const nodeTotal = isInNode ? gameState.nodeQuestionsTotal : 0;
  const progressPercentage = isInNode
    ? (nodeProgress / nodeTotal) * 100
    : ((gameState.currentLevelIndex + 1) / levels.length) * 100;
  const hasMoreNodeQuestions = isInNode && nodeProgress < nodeTotal;
  const selectedOption = currentLevel?.options.find(o => o.value === gameState.selectedOption);

  return (
    <>
      <GradeBackground gradeLevel={settings.gradeLevel} />
      <MusicManager state={musicState} volume={settings.bgmVolume} enabled={bgmEnabled} />

      <NavBar
        activeView="battle"
        bgmEnabled={bgmEnabled}
        onBgmToggle={onBgmToggle}
        onSettingsOpen={onSettingsOpen}
        onGachaOpen={onGachaOpen}
        onReportOpen={onReportOpen}
        onLeaderboardOpen={() => {}}
        onWordBookOpen={onWordBookOpen}
        onFlashcardOpen={onFlashcardOpen}
        onShowMap={onShowMap}
        onAuthOpen={onAuthOpen}
      />

      <div
        className={`relative min-h-screen flex flex-col items-center p-4 sm:p-6 sm:pt-16 pb-20 sm:pb-6 ${
          isBossMode ? 'justify-start pt-48' : 'justify-center'
        }`}
      >
        {currentBoss && (
          <BossBattle
            boss={currentBoss}
            timeLeft={bossTimer}
            maxTime={45}
            isActive={isBossMode}
            bossHp={gameState.bossHp}
            bossMaxHp={gameState.bossMaxHp}
          />
        )}

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl relative z-10"
        >
          <div className="mb-6">
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-1 tracking-tight drop-shadow-lg">
              Hanzi Realm
            </h1>
            <p className="text-white text-xs sm:text-sm drop-shadow">
              Grade {settings.gradeLevel} - World {gameState.worldNumber}
              {gameState.gameMode === 'listening' && ' - Listening Mode'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
            <div className="voxel-card glass-yellow border-yellow-700 px-4 py-2 sm:px-6 sm:py-3">
              <p className="text-white text-sm sm:text-base font-black drop-shadow">
                {gameState.jade} Jade
              </p>
            </div>
            <div className="voxel-card glass-green border-green-700 px-4 py-2 sm:px-6 sm:py-3">
              <p className="text-white text-sm sm:text-base font-black drop-shadow">
                Best: {gameState.bestStreak}
              </p>
            </div>
            {activeCompanion && (
              <div className="voxel-card border-teal-700 px-4 py-2 sm:px-6 sm:py-3">
                <p className="text-white text-xs font-bold drop-shadow">
                  {activeCompanion.emoji} {getBuffDescription(activeCompanion.buffType, activeCompanion.buffValue)}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <StreakMeter streak={gameState.currentStreak} fireMode={gameState.fireMode} />
          </div>

          <motion.div
            animate={shake ? { rotateZ: [-1, 1, -1, 1, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`voxel-card rounded-3xl mb-4 transition-all duration-300 relative ${
              isBossMode ? 'border-red-500 border-4 p-4 sm:p-5' :
              gameState.fireMode ? 'border-orange-500 border-4 shadow-[0_0_30px_rgba(255,165,0,0.4)] p-6 sm:p-8' :
              'border-gray-700 p-6 sm:p-8'
            }`}
            style={isBossMode ? { position: 'relative', zIndex: 35 } : undefined}
          >
            {gameState.fireMode && <FireParticles />}

            <div className={isBossMode ? 'mb-3' : 'mb-6'}>
              <div className={`flex items-start gap-4 ${isBossMode ? 'mb-2' : 'mb-4'}`}>
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
                    <>
                      <p className="text-yellow-400 text-sm mt-1">Listen carefully and choose the right character!</p>
                      <ListeningWaveform />
                    </>
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
                      onClick={onToggleHint}
                      className={`btn-3d p-2 rounded-lg transition-colors ${showHint ? 'bg-yellow-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                      aria-label="Show hint"
                    >
                      <Lightbulb className={`w-5 h-5 ${showHint ? 'text-yellow-200' : 'text-gray-300'}`} />
                    </button>
                  )}
                  <button
                    onClick={onSpeak}
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

            {currentLevel.questionType === 'sentence-order' && !gameState.showFeedback && onSentenceSubmit && (
              <div className="mb-6">
                <SentenceOrderView
                  key={currentLevel.id}
                  level={currentLevel}
                  onSubmit={onSentenceSubmit}
                  disabled={gameState.showFeedback}
                />
              </div>
            )}

            {currentLevel.questionType === 'radical-detective' && !gameState.showFeedback && (
              <div className="mb-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
                <Search className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <p className="text-amber-200 font-bold text-sm">Find the character with the correct radical!</p>
              </div>
            )}

            <div className={`${isBossMode ? 'space-y-2 mb-3' : 'space-y-3 sm:space-y-4 mb-6'} ${currentLevel.questionType === 'sentence-order' && !gameState.showFeedback ? 'hidden' : ''}`}>
              {currentLevel.options.map((option) => {
                const isSelected = gameState.selectedOption === option.value;
                const isCorrectAnswer = option.value === correctAnswer;
                const showAsCorrect = gameState.showFeedback && isSelected && gameState.isCorrect;
                const showAsWrong = gameState.showFeedback && isSelected && !gameState.isCorrect;
                const showCorrectHighlight = gameState.showFeedback && !gameState.isCorrect && isCorrectAnswer;

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => onOptionClick(option)}
                    onHoverStart={() => setHoveredOption(option.value)}
                    onHoverEnd={() => setHoveredOption(null)}
                    disabled={gameState.showFeedback}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={!gameState.showFeedback ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!gameState.showFeedback ? { scale: 0.97 } : {}}
                    className={`
                      w-full rounded-2xl font-bold border-2 transition-all duration-300 relative overflow-hidden
                      ${isBossMode ? 'p-3 text-lg' : 'p-4 sm:p-6 text-xl sm:text-2xl'}
                      ${showAsCorrect ? 'bg-green-600/60 border-green-500 text-white' : ''}
                      ${showAsWrong ? 'bg-red-600/60 border-red-500 text-white' : ''}
                      ${showCorrectHighlight ? 'bg-green-600/60 border-green-500 text-white opacity-60' : ''}
                      ${!gameState.showFeedback ? 'border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/20 text-white' : ''}
                      ${gameState.showFeedback && !isSelected && !showCorrectHighlight ? 'opacity-40 border-white/10 bg-white/5' : ''}
                      disabled:cursor-not-allowed
                    `}
                  >
                    {!gameState.showFeedback && hoveredOption === option.value && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                        }}
                      />
                    )}
                    {showAsCorrect && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.4), transparent)' }}
                      />
                    )}
                    {showAsWrong && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.4), transparent)' }}
                      />
                    )}
                    <div className="flex items-center justify-between relative z-10">
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
              <div
                ref={feedbackRef}
                className={`rounded-2xl border ${isBossMode ? 'p-3 mb-2' : 'p-4 sm:p-6 mb-4'} ${
                  gameState.isCorrect
                    ? 'bg-green-600/60 border-green-500'
                    : 'bg-red-600/60 border-red-500'
                }`}
                style={{ position: 'relative', zIndex: 60 }}
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
                    <span className="block space-y-3">
                      <span className="block text-white/90">{selectedOption?.explanation || 'Incorrect answer'}</span>
                      <span className="flex items-center gap-4 bg-black/30 rounded-xl p-3 border border-yellow-500/30">
                        <span className="text-4xl sm:text-5xl font-black text-yellow-300">{correctAnswer}</span>
                        <span className="block">
                          <span className="block text-yellow-200 font-bold text-base">{currentLevel.correctAnswer.pinyin}</span>
                          <span className="block text-white/80 text-sm">{currentLevel.correctAnswer.definition}</span>
                          {currentLevel.correctAnswer.radical && (
                            <span className="block text-white/50 text-xs mt-1">Radical: {currentLevel.correctAnswer.radical} ({currentLevel.correctAnswer.radicalMeaning})</span>
                          )}
                        </span>
                      </span>
                      {gameState.streakShieldActive && !gameState.streakShieldUsed && (
                        <span className="block text-yellow-300 text-sm font-bold">Shield protected your streak!</span>
                      )}
                    </span>
                  )}
                </p>
                {gameState.isCorrect && (
                  <p className="text-[#ffd700] font-black mt-2 text-2xl">
                    +{Math.floor((isBossMode ? 800 : 100) * (1 + getJadeBonus() / 100))} Jade
                    {getJadeBonus() > 0 && <span className="text-sm ml-2">(+{getJadeBonus()}% bonus)</span>}
                  </p>
                )}
              </div>
            )}

            {gameState.showFeedback && !awaitingLoot && (
              <button
                onClick={onNext}
                className="btn-3d-green w-full text-white font-black py-4 sm:py-5 px-6 rounded-2xl text-lg sm:text-xl shadow-lg hover:brightness-110 active:translate-y-1 transition-all"
                style={{ position: 'relative', zIndex: 60 }}
              >
                {hasMoreNodeQuestions ? 'Next Question' : isInNode ? 'Back to Map' : gameState.currentLevelIndex < levels.length - 1 ? 'Next Challenge' : 'New Adventure'}
              </button>
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

          <div className="relative">
            <div className="border border-white/20 rounded-full h-4 sm:h-6 overflow-hidden bg-black/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full relative ${
                  gameState.fireMode
                    ? 'bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500'
                    : 'bg-gradient-to-r from-[#00b06f] to-[#ffd700]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex gap-1">
                {isInNode && Array.from({ length: nodeTotal }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < nodeProgress ? 'bg-teal-400' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/70 drop-shadow text-xs sm:text-sm font-bold">
                {isInNode
                  ? `${nodeProgress} / ${nodeTotal}`
                  : `${gameState.currentLevelIndex + 1} / ${levels.length}`
                }
              </p>
            </div>
          </div>
        </motion.div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={onSettingsClose}
          settings={settings}
          inventory={inventory}
          hanziCoins={gameState.jade}
          onSettingsChange={onSettingsChange}
          onInventoryChange={onInventoryChange}
        />

        <GachaModal
          isOpen={isGachaOpen}
          onClose={onGachaClose}
          jade={gameState.jade}
          onRoll={onGachaRoll}
        />

        <ReportCard
          isOpen={isReportOpen}
          onClose={onReportClose}
          stats={sessionStats}
          gameState={gameState}
        />

        <WordBook
          isOpen={isWordBookOpen}
          onClose={onWordBookClose}
          wordsLearned={wordsLearned}
          audioSettings={audioSettings}
        />

        <FlashcardReview
          isOpen={isFlashcardOpen}
          onClose={onFlashcardClose}
          wordsLearned={wordsLearned}
          audioSettings={audioSettings}
        />

        <CompanionDisplay companion={activeCompanion} isHappy={companionHappy} />

        <DebugLog
          message={debugMessage}
          isError={debugIsError}
          onClose={onDebugClose}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={onAuthClose}
        />
      </div>
    </>
  );
}
