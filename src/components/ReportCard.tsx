import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Trophy, Target, Flame, Gem, Award, Calendar, TrendingUp } from 'lucide-react';
import { SessionStats, GameState } from '../types';
import { getUnlockedAchievements, ACHIEVEMENTS } from '../data/achievements';
import { getConsecutiveDays } from '../utils/dailyRewards';
import { getVocabByGrade, VocabEntry } from '../utils/vocabulary';

interface ReportCardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SessionStats;
  gameState?: GameState;
}

type TabId = 'session' | 'alltime' | 'medals';

export default function ReportCard({ isOpen, onClose, stats, gameState }: ReportCardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('session');

  const accuracy = stats.questionsAnswered > 0
    ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
    : 0;

  const getRank = (acc: number): string => {
    if (acc >= 95) return 'Jade Emperor';
    if (acc >= 85) return 'Dragon Master';
    if (acc >= 75) return 'Phoenix Scholar';
    if (acc >= 60) return 'Tiger Student';
    return 'Panda Novice';
  };

  const handleCopy = () => {
    const text = `I conquered Hanzi Realm!\n\nAccuracy: ${accuracy}%\nWords Mastered: ${stats.wordsLearned.length}\nBosses Defeated: ${stats.bossesDefeated}\nJade Earned: ${stats.jadeEarned}\nRank: ${getRank(accuracy)}\n\nCan you beat me?`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordsArray = gameState ? Array.from(gameState.wordsLearned) : stats.wordsLearned;
  const vocabByGrade = gameState ? getVocabByGrade(wordsArray) : {};
  const unlockedAchievements = gameState ? getUnlockedAchievements() : [];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'session', label: 'Session', icon: <Target className="w-4 h-4" /> },
    { id: 'alltime', label: 'All Time', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'medals', label: 'Medals', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.8, rotateY: 180 }}
            transition={{ type: 'spring', duration: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#ffd700] rounded-3xl p-1 max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="modal-content rounded-3xl p-6 sm:p-8 relative overflow-y-auto max-h-[88vh]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-3"
                >
                  <Trophy className="w-16 h-16 text-[#ffd700]" />
                </motion.div>
                <h2 className="text-4xl font-black text-[#ffd700] mb-1">REPORT CARD</h2>
                <p className="text-xl text-white font-bold">Rank: {getRank(accuracy)}</p>
              </div>

              {gameState && (
                <div className="flex gap-1 mb-6 bg-black/30 rounded-xl p-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#ffd700] text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'session' && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <Target className="w-8 h-8 text-green-400 mx-auto mb-1" />
                      <p className="text-3xl font-black text-white">{accuracy}%</p>
                      <p className="text-xs text-green-300">Accuracy</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <Flame className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                      <p className="text-3xl font-black text-white">{stats.wordsLearned.length}</p>
                      <p className="text-xs text-blue-300">Words This Session</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <span className="text-3xl mb-1 block">X</span>
                      <p className="text-3xl font-black text-white">{stats.bossesDefeated}</p>
                      <p className="text-xs text-red-300">Bosses Defeated</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <Gem className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
                      <p className="text-3xl font-black text-white">{stats.jadeEarned}</p>
                      <p className="text-xs text-yellow-300">Jade Earned</p>
                    </div>
                  </div>

                  {stats.wordsLearned.length > 0 && (
                    <div className="p-4 bg-black/30 border border-white/10 rounded-xl mb-4">
                      <p className="text-gray-300 text-sm font-bold mb-2">Words Learned This Session:</p>
                      <div className="flex flex-wrap gap-2">
                        {stats.wordsLearned.map((word, i) => (
                          <span key={i} className="bg-[#00b06f] text-white px-3 py-1 rounded-lg text-lg font-bold">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-3d-green w-full text-white font-black py-3 rounded-2xl text-lg flex items-center justify-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    {copied ? 'COPIED!' : 'SHARE RESULTS'}
                  </motion.button>
                </>
              )}

              {activeTab === 'alltime' && gameState && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-black text-white">{gameState.questionsAnswered}</p>
                      <p className="text-xs text-gray-400">Total Questions</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-black text-[#ffd700]">{gameState.jade}</p>
                      <p className="text-xs text-yellow-400">Total Jade</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-black text-orange-400">{gameState.bestStreak}</p>
                      <p className="text-xs text-orange-300">Best Streak</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-black text-teal-400">{gameState.worldNumber}</p>
                      <p className="text-xs text-teal-300">World Reached</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-black text-red-400">{gameState.bossesDefeated}</p>
                      <p className="text-xs text-red-300">Bosses Defeated</p>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
                      <Calendar className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                      <p className="text-3xl font-black text-sky-400">{getConsecutiveDays()}</p>
                      <p className="text-xs text-sky-300">Day Streak</p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/30 border border-white/10 rounded-xl">
                    <p className="text-gray-300 text-sm font-bold mb-3">
                      Vocabulary by Grade ({gameState.wordsLearned.size} total)
                    </p>
                    {Object.entries(vocabByGrade).length > 0 ? (
                      <div className="space-y-3">
                        {(Object.entries(vocabByGrade) as [string, VocabEntry[]][]).sort(([a], [b]) => Number(a) - Number(b)).map(([grade, entries]) => (
                          <div key={grade}>
                            <p className="text-xs text-gray-500 mb-1 font-bold">Grade {grade} ({entries.length} words)</p>
                            <div className="flex flex-wrap gap-1.5">
                              {entries.slice(0, 20).map((entry: VocabEntry, i: number) => (
                                <span key={i} className="bg-white/10 text-white px-2 py-0.5 rounded text-sm font-bold" title={`${entry.pinyin} - ${entry.definition}`}>
                                  {entry.char}
                                </span>
                              ))}
                              {entries.length > 20 && (
                                <span className="text-gray-500 text-sm">+{entries.length - 20} more</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Start playing to learn characters!</p>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'medals' && (
                <div className="space-y-3">
                  {ACHIEVEMENTS.map(achievement => {
                    const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isUnlocked
                            ? 'bg-[#ffd700]/10 border-[#ffd700]/30'
                            : 'bg-black/20 border-white/5 opacity-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          isUnlocked ? 'bg-[#ffd700]/20' : 'bg-gray-800'
                        }`}>
                          {isUnlocked ? <Award className="w-5 h-5 text-[#ffd700]" /> : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                              {achievement.title}
                            </p>
                            {achievement.titleCn && (
                              <span className="text-xs text-gray-500">{achievement.titleCn}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{achievement.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-xs font-bold ${isUnlocked ? 'text-[#ffd700]' : 'text-gray-600'}`}>
                            +{achievement.jadeReward}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
