import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Volume2, BookOpen } from 'lucide-react';
import { lookupMultiple, VocabEntry } from '../utils/vocabulary';
import { speakChinese } from '../utils/audio';

interface WordBookProps {
  isOpen: boolean;
  onClose: () => void;
  wordsLearned: string[];
  audioSettings: {
    useAzureTts: boolean;
    audioLanguage: string;
    audioSpeed: number;
  };
}

export default function WordBook({ isOpen, onClose, wordsLearned, audioSettings }: WordBookProps) {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);

  const entries = useMemo(() => lookupMultiple(wordsLearned), [wordsLearned]);

  const filtered = useMemo(() => {
    let result = entries;
    if (gradeFilter !== null) {
      result = result.filter(e => e.grade === gradeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(e =>
        e.char.includes(q) ||
        e.pinyin.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, gradeFilter, search]);

  const grades = useMemo(() => {
    const s = new Set(entries.map(e => e.grade));
    return [...s].sort((a, b) => a - b);
  }, [entries]);

  const handleSpeak = (entry: VocabEntry) => {
    speakChinese(entry.char, '', '', audioSettings.useAzureTts, audioSettings.audioLanguage, audioSettings.audioSpeed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#1e2025] to-[#16181b] border-2 border-emerald-500/30 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-emerald-400" />
                <h2 className="text-2xl font-black text-white">Word Book</h2>
                <span className="text-sm text-gray-400">({entries.length} words)</span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search character, pinyin, or meaning..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {grades.length > 1 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setGradeFilter(null)}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                    gradeFilter === null ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {grades.map(g => (
                  <button
                    key={g}
                    onClick={() => setGradeFilter(g)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                      gradeFilter === g ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {entries.length === 0 ? 'No words learned yet! Start playing to build your vocabulary.' : 'No matches found.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filtered.map((entry, i) => (
                    <motion.div
                      key={entry.char}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-3xl font-black text-white min-w-[48px] text-center">{entry.char}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-emerald-400 font-mono text-sm">{entry.pinyin}</p>
                        <p className="text-gray-300 text-xs truncate">{entry.definition}</p>
                        {entry.radical && (
                          <p className="text-gray-500 text-[10px]">Radical: {entry.radical} ({entry.radicalMeaning})</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSpeak(entry)}
                        className="text-gray-400 hover:text-emerald-400 transition-colors p-1.5"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
