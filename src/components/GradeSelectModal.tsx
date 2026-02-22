import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveSettings, markLaunched } from '../utils/storage';

interface GradeSelectModalProps {
  isOpen: boolean;
  onSelect: (grade: number) => void;
}

const GRADES = [
  { grade: 1, emoji: '🌱', label: 'Grade 1', desc: 'Basic characters & pinyin', dots: 1 },
  { grade: 2, emoji: '🌿', label: 'Grade 2', desc: 'Simple words & phrases', dots: 2 },
  { grade: 3, emoji: '🌳', label: 'Grade 3', desc: 'Sentences & grammar', dots: 3 },
  { grade: 4, emoji: '⚡', label: 'Grade 4', desc: 'Complex vocabulary', dots: 4 },
  { grade: 5, emoji: '🔥', label: 'Grade 5', desc: 'Advanced expressions', dots: 5 },
  { grade: 6, emoji: '🏆', label: 'Grade 6', desc: 'Master level content', dots: 6 },
];

export default function GradeSelectModal({ isOpen, onSelect }: GradeSelectModalProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    markLaunched();
    onSelect(selected);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="modal-content rounded-3xl p-8 max-w-lg w-full"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-3"
              >
                🎓
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-2">Choose Your Grade</h2>
              <p className="text-white/60 text-sm">Select the difficulty that matches your Chinese level</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {GRADES.map(({ grade, emoji, label, desc, dots }) => (
                <motion.button
                  key={grade}
                  onClick={() => setSelected(grade)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selected === grade
                      ? 'border-teal-400 bg-teal-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-white font-bold text-sm">{label}</div>
                  <div className="text-white/50 text-xs mt-0.5">{desc}</div>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < dots ? 'bg-teal-400' : 'bg-white/15'}`}
                      />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={handleConfirm}
              disabled={!selected}
              whileHover={selected ? { scale: 1.02 } : {}}
              whileTap={selected ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                selected
                  ? 'btn-3d-green text-white'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              Start Learning!
            </motion.button>

            <p className="text-center text-white/30 text-xs mt-3">You can change this later in Settings</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
