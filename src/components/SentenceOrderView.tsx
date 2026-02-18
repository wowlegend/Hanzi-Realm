import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Level } from '../types';

interface SentenceOrderViewProps {
  level: Level;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export default function SentenceOrderView({ level, onSubmit, disabled }: SentenceOrderViewProps) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(() => {
    const words = level.sentenceWords || [];
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const handlePickWord = useCallback((word: string, index: number) => {
    if (disabled) return;
    setPlaced(prev => [...prev, word]);
    setAvailable(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, [disabled]);

  const handleUnpick = useCallback((word: string, index: number) => {
    if (disabled) return;
    setAvailable(prev => [...prev, word]);
    setPlaced(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, [disabled]);

  const handleReset = useCallback(() => {
    if (disabled) return;
    const words = level.sentenceWords || [];
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAvailable(shuffled);
    setPlaced([]);
  }, [disabled, level.sentenceWords]);

  const handleSubmit = useCallback(() => {
    const answer = placed.join('');
    onSubmit(answer);
  }, [placed, onSubmit]);

  const isComplete = available.length === 0 && placed.length > 0;

  return (
    <div className="space-y-4">
      <div className="bg-black/30 border-2 border-white/10 rounded-2xl p-4 min-h-[60px] flex flex-wrap gap-2 items-center">
        {placed.length === 0 && (
          <span className="text-gray-500 text-sm">Tap words below to build the sentence...</span>
        )}
        <AnimatePresence mode="popLayout">
          {placed.map((word, i) => (
            <motion.button
              key={`placed-${i}-${word}`}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleUnpick(word, i)}
              disabled={disabled}
              className="bg-gradient-to-b from-sky-500 to-sky-600 text-white font-bold text-lg px-3 py-2 rounded-xl border-2 border-sky-400 shadow-md active:scale-95 transition-transform"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence mode="popLayout">
          {available.map((word, i) => (
            <motion.button
              key={`avail-${i}-${word}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => handlePickWord(word, i)}
              disabled={disabled}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-b from-gray-600 to-gray-700 text-white font-bold text-lg px-4 py-2 rounded-xl border-2 border-gray-500 shadow-md hover:border-sky-400 transition-colors"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleReset}
          disabled={disabled || placed.length === 0}
          className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 text-white font-bold py-3 px-4 rounded-xl flex items-center gap-2 disabled:opacity-40"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={disabled || !isComplete}
          className="btn-3d-green flex-1 text-white font-black py-3 rounded-xl text-lg disabled:opacity-40"
        >
          Check Answer
        </button>
      </div>
    </div>
  );
}
