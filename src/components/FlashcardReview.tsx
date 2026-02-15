import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, HelpCircle, Volume2 } from 'lucide-react';
import { lookupMultiple, VocabEntry } from '../utils/vocabulary';
import { speakChinese } from '../utils/audio';

interface FlashcardReviewProps {
  isOpen: boolean;
  onClose: () => void;
  wordsLearned: string[];
  audioSettings: {
    useAzureTts: boolean;
    audioLanguage: string;
    audioSpeed: number;
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardReview({ isOpen, onClose, wordsLearned, audioSettings }: FlashcardReviewProps) {
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knewIt, setKnewIt] = useState(0);
  const [learning, setLearning] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const cards = useMemo(() => {
    const entries = lookupMultiple(wordsLearned);
    return shuffle(entries).slice(0, 20);
  }, [wordsLearned]);

  const currentCard = cards[currentIndex] || null;

  const handleRate = useCallback((knew: boolean) => {
    if (knew) setKnewIt(prev => prev + 1);
    else setLearning(prev => prev + 1);

    if (currentIndex + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setKnewIt(0);
    setLearning(0);
    setSessionDone(false);
    setFlipped(false);
  };

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
            className="bg-gradient-to-br from-[#1e2025] to-[#16181b] border-2 border-sky-500/30 rounded-3xl p-6 max-w-lg w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-sky-400" />
                <h2 className="text-2xl font-black text-white">Flashcard Review</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No words to review yet. Start playing to learn some characters!</p>
              </div>
            ) : sessionDone ? (
              <div className="text-center py-8">
                <h3 className="text-3xl font-black text-white mb-4">Session Complete!</h3>
                <div className="flex justify-center gap-8 mb-6">
                  <div className="text-center">
                    <Check className="w-10 h-10 text-green-400 mx-auto mb-1" />
                    <p className="text-3xl font-black text-green-400">{knewIt}</p>
                    <p className="text-gray-400 text-sm">Knew it</p>
                  </div>
                  <div className="text-center">
                    <HelpCircle className="w-10 h-10 text-orange-400 mx-auto mb-1" />
                    <p className="text-3xl font-black text-orange-400">{learning}</p>
                    <p className="text-gray-400 text-sm">Still learning</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleRestart}
                    className="btn-3d bg-gradient-to-b from-sky-500 to-sky-600 flex-1 text-white font-bold py-3 rounded-xl"
                  >
                    Review Again
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-3d bg-gradient-to-b from-gray-600 to-gray-700 flex-1 text-white font-bold py-3 rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : currentCard ? (
              <>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{currentIndex + 1} / {cards.length}</span>
                  <div className="flex gap-4">
                    <span className="text-green-400">{knewIt} knew</span>
                    <span className="text-orange-400">{learning} learning</span>
                  </div>
                </div>

                <div className="h-3 bg-black/40 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
                  />
                </div>

                <motion.div
                  onClick={() => !flipped && setFlipped(true)}
                  whileHover={!flipped ? { scale: 1.02 } : {}}
                  whileTap={!flipped ? { scale: 0.98 } : {}}
                  className={`bg-black/30 border-2 rounded-2xl p-8 text-center mb-4 min-h-[200px] flex flex-col items-center justify-center transition-colors ${
                    flipped ? 'border-sky-500/50' : 'border-white/10 cursor-pointer'
                  }`}
                >
                  <span className="text-7xl font-black text-white mb-3">{currentCard.char}</span>
                  {!flipped && (
                    <p className="text-gray-500 text-sm">Tap to reveal</p>
                  )}
                  {flipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <p className="text-sky-400 font-mono text-xl">{currentCard.pinyin}</p>
                      <p className="text-gray-300 text-base">{currentCard.definition}</p>
                      {currentCard.radical && (
                        <p className="text-gray-500 text-sm">Radical: {currentCard.radical} ({currentCard.radicalMeaning})</p>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard); }}
                        className="mt-2 text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        <Volume2 className="w-6 h-6 mx-auto" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>

                {flipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <button
                      onClick={() => handleRate(false)}
                      className="btn-3d bg-gradient-to-b from-orange-500 to-orange-600 flex-1 text-white font-bold py-3 rounded-xl text-lg"
                    >
                      Still Learning
                    </button>
                    <button
                      onClick={() => handleRate(true)}
                      className="btn-3d-green flex-1 text-white font-bold py-3 rounded-xl text-lg"
                    >
                      Knew It!
                    </button>
                  </motion.div>
                )}
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
