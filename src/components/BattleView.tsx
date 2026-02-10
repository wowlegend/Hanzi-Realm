import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Settings as SettingsIcon, Loader, Gift, Trophy, Map, Zap, Lightbulb } from 'lucide-react';
import { GameState, GameSettings, PlayerInventory, Companion, Level, SessionStats, MusicState, AnswerOption } from '../types';
import { getBuffDescription } from '../data/companions';
import { Boss } from '../data/bosses';
import GradeBackground from './GradeBackground';
import MusicManager from './MusicManager';
import BossBattle from './BossBattle';
import NarratorAvatar from './NarratorAvatar';
import { ContentBlockRenderer } from './RubyText';
import SettingsModal from './SettingsModal';
import GachaModal from './GachaModal';
import ReportCard from './ReportCard';
import CompanionDisplay from './CompanionDisplay';
import DebugLog from './DebugLog';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

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
  onOptionClick: (option: AnswerOption) => void;
  onSpeak: () => void;
  onNext: () => void;
  onShowMap: () => void;
  onToggleHint: () => void;
  onSettingsOpen: () => void;
  onSettingsClose: () => void;
  onGachaOpen: () => void;
  onGachaClose: () => void;
  onReportOpen: () => void;
  onReportClose: () => void;
  onAuthOpen: () => void;
  onAuthClose: () => void;
  onSettingsChange: (settings: GameSettings) => void;
  onInventoryChange: (inventory: PlayerInventory) => void;
  onGachaRoll: (companion: Companion) => void;
  onDebugClose: () => void;
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
  onOptionClick,
  onSpeak,
  onNext,
  onShowMap,
  onToggleHint,
  onSettingsOpen,
  onSettingsClose,
  onGachaOpen,
  onGachaClose,
  onReportOpen,
  onReportClose,
  onAuthOpen,
  onAuthClose,
  onSettingsChange,
  onInventoryChange,
  onGachaRoll,
  onDebugClose,
  getJadeBonus,
}: BattleViewProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

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

      <div
        className={`relative min-h-screen flex flex-col items-center p-4 sm:p-6 ${
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
          {!isBossMode && (
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
                  onClick={onShowMap}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d bg-gradient-to-b from-teal-500 to-teal-600 rounded-xl p-3"
                >
                  <Map className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  onClick={onReportOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl p-3"
                >
                  <Trophy className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  onClick={onSettingsOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl p-3"
                >
                  <SettingsIcon className="w-6 h-6 text-[#ffd700]" />
                </motion.button>
                <UserProfile onLoginClick={onAuthOpen} />
              </div>
            </div>
          )}

          {isBossMode && (
            <div className="mb-3 flex items-center justify-between">
              <div className="flex gap-2">
                <motion.button
                  onClick={onShowMap}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d bg-gradient-to-b from-teal-500 to-teal-600 rounded-xl p-2"
                >
                  <Map className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              <div className="flex gap-2">
                <div className="voxel-card glass-yellow border-yellow-700 px-3 py-1">
                  <p className="text-white text-sm font-black drop-shadow">{gameState.jade} Jade</p>
                </div>
                <div className="voxel-card px-3 py-1">
                  <p className="text-white text-sm font-black drop-shadow">Streak: {gameState.currentStreak}</p>
                </div>
              </div>
            </div>
          )}

          {!isBossMode && (
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
                onClick={onGachaOpen}
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d-gold px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 text-white font-black"
              >
                <Gift className="w-5 h-5" />
                <span className="text-sm sm:text-base">GACHA</span>
              </motion.button>
            </div>
          )}

          <motion.div
            animate={shake ? { rotateZ: [-1, 1, -1, 1, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`voxel-card rounded-3xl mb-4 transition-all duration-300 ${
              isBossMode ? 'border-red-500 border-4 p-4 sm:p-5' :
              gameState.fireMode ? 'border-orange-500 border-4 shadow-[0_0_30px_rgba(255,165,0,0.4)] p-6 sm:p-8' :
              'border-gray-700 p-6 sm:p-8'
            }`}
          >
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

            <div className={`${isBossMode ? 'space-y-2 mb-3' : 'space-y-3 sm:space-y-4 mb-6'}`}>
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
                    whileHover={!gameState.showFeedback ? { scale: 1.02, rotateX: 5 } : {}}
                    whileTap={!gameState.showFeedback ? { scale: 0.98 } : {}}
                    className={`
                      w-full rounded-2xl font-bold border-2 transition-all duration-300
                      ${isBossMode ? 'p-3 text-lg' : 'p-4 sm:p-6 text-xl sm:text-2xl'}
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
                className={`rounded-2xl border ${isBossMode ? 'p-3 mb-2' : 'p-4 sm:p-6 mb-4'} ${
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
                    +{Math.floor((isBossMode ? 800 : 100) * (1 + getJadeBonus() / 100))} Jade
                    {getJadeBonus() > 0 && <span className="text-sm ml-2">(+{getJadeBonus()}% bonus)</span>}
                  </p>
                )}
              </motion.div>
            )}

            {gameState.showFeedback && !awaitingLoot && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d-green w-full text-white font-black py-4 sm:py-5 px-6 rounded-2xl text-lg sm:text-xl shadow-lg"
              >
                {hasMoreNodeQuestions ? 'Next Question' : isInNode ? 'Back to Map' : gameState.currentLevelIndex < levels.length - 1 ? 'Next Challenge' : 'New Adventure'}
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
            {isInNode
              ? `Question ${nodeProgress} of ${nodeTotal}`
              : `Challenge ${gameState.currentLevelIndex + 1} of ${levels.length}`
            }
          </p>
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
