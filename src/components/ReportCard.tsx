import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Trophy, Target, Flame, Gem } from 'lucide-react';
import { SessionStats } from '../types';

interface ReportCardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SessionStats;
}

export default function ReportCard({ isOpen, onClose, stats }: ReportCardProps) {
  const [copied, setCopied] = useState(false);

  const accuracy = stats.questionsAnswered > 0
    ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
    : 0;

  const getRank = (accuracy: number): string => {
    if (accuracy >= 95) return 'Jade Emperor';
    if (accuracy >= 85) return 'Dragon Master';
    if (accuracy >= 75) return 'Phoenix Scholar';
    if (accuracy >= 60) return 'Tiger Student';
    return 'Panda Novice';
  };

  const handleCopy = () => {
    const text = `I just conquered Hanzi Realm: The Jade Tycoon! 🐉\n\n📊 My Stats:\n✅ Accuracy: ${accuracy}%\n🔥 Words Mastered: ${stats.wordsLearned.length}\n👹 Bosses Defeated: ${stats.bossesDefeated}\n💎 Jade Earned: ${stats.jadeEarned}\n🏆 Rank: ${getRank(accuracy)}\n\nCan you beat me?`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            className="bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#ffd700] rounded-3xl p-1 max-w-2xl w-full"
          >
            <div className="bg-gradient-to-br from-[#2a2d2f] to-[#1a1c1e] rounded-3xl p-8 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Trophy className="w-20 h-20 text-[#ffd700]" />
                </motion.div>
                <h2 className="text-5xl font-black text-[#ffd700] mb-2">
                  SESSION REPORT
                </h2>
                <p className="text-2xl text-white font-bold">
                  🏆 Rank: {getRank(accuracy)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="voxel-card bg-gradient-to-br from-green-600 to-green-700 p-6 text-center">
                  <Target className="w-10 h-10 text-white mx-auto mb-2" />
                  <p className="text-4xl font-black text-white">{accuracy}%</p>
                  <p className="text-sm text-green-200">Accuracy</p>
                </div>

                <div className="voxel-card bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-center">
                  <Flame className="w-10 h-10 text-white mx-auto mb-2" />
                  <p className="text-4xl font-black text-white">{stats.wordsLearned.length}</p>
                  <p className="text-sm text-blue-200">Words Mastered</p>
                </div>

                <div className="voxel-card bg-gradient-to-br from-red-600 to-red-700 p-6 text-center">
                  <span className="text-4xl mb-2 block">👹</span>
                  <p className="text-4xl font-black text-white">{stats.bossesDefeated}</p>
                  <p className="text-sm text-red-200">Bosses Defeated</p>
                </div>

                <div className="voxel-card bg-gradient-to-br from-yellow-600 to-yellow-700 p-6 text-center">
                  <Gem className="w-10 h-10 text-white mx-auto mb-2" />
                  <p className="text-4xl font-black text-white">{stats.jadeEarned}</p>
                  <p className="text-sm text-yellow-200">Jade Earned</p>
                </div>
              </div>

              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d-green w-full text-white font-black py-4 rounded-2xl text-xl flex items-center justify-center gap-2"
              >
                <Copy className="w-6 h-6" />
                {copied ? 'COPIED!' : 'SHARE RESULTS'}
              </motion.button>

              {stats.wordsLearned.length > 0 && (
                <div className="mt-6 p-4 bg-[#1a1c1e] rounded-xl border-2 border-gray-700">
                  <p className="text-gray-300 text-sm font-bold mb-2">Words You Learned:</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.wordsLearned.map((word, i) => (
                      <span
                        key={i}
                        className="bg-[#00b06f] text-white px-3 py-1 rounded-lg text-lg font-bold"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
