import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Medal, Trophy, Gem, Flame, Skull, BookOpen } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../utils/cloudStorage';
import { useAuth } from '../contexts/AuthContext';

type Category = 'jade_total' | 'best_streak' | 'bosses_defeated' | 'words_mastered';

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode; unit: string }[] = [
  { key: 'jade_total', label: 'Jade', icon: <Gem className="w-4 h-4" />, unit: '' },
  { key: 'best_streak', label: 'Streak', icon: <Flame className="w-4 h-4" />, unit: '' },
  { key: 'bosses_defeated', label: 'Bosses', icon: <Skull className="w-4 h-4" />, unit: '' },
  { key: 'words_mastered', label: 'Words', icon: <BookOpen className="w-4 h-4" />, unit: '' },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-white/40 text-sm font-bold w-5 text-center">{rank}</span>;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { user } = useAuth();
  const [category, setCategory] = useState<Category>('jade_total');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getLeaderboard(category).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, [isOpen, category]);

  const getValue = (entry: LeaderboardEntry): number => entry[category];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-content rounded-3xl p-6 max-w-md w-full max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-black text-white">Leaderboard</h2>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    category === cat.key
                      ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {cat.icon}
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 min-h-[200px]">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 animate-pulse">
                      <div className="w-6 h-6 rounded-full bg-white/10" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-white/10 rounded w-24" />
                        <div className="h-2 bg-white/5 rounded w-16" />
                      </div>
                      <div className="h-4 bg-white/10 rounded w-12" />
                    </div>
                  ))}
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-white/30">
                  <Trophy className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No entries yet. Be the first!</p>
                </div>
              ) : (
                entries.map((entry, i) => {
                  const rank = i + 1;
                  const isCurrentUser = user?.id === entry.user_id;
                  return (
                    <motion.div
                      key={entry.user_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isCurrentUser
                          ? 'bg-teal-500/15 border border-teal-500/30'
                          : rank <= 3
                            ? 'bg-white/5'
                            : 'bg-white/3'
                      }`}
                    >
                      <div className="w-6 flex justify-center flex-shrink-0">
                        <RankIcon rank={rank} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold truncate ${isCurrentUser ? 'text-teal-300' : 'text-white'}`}>
                            {entry.display_name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] text-teal-400/70 font-semibold flex-shrink-0">You</span>
                          )}
                        </div>
                        <div className="text-xs text-white/35">
                          Grade {entry.grade_level} · World {entry.world_reached}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-black text-amber-400">
                          {getValue(entry).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
