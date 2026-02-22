import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LevelClearedModalProps {
  isOpen: boolean;
  worldNumber: number;
  jadeBonus: number;
  ngPlusLevel?: number;
  onContinue: () => void;
}

export default function LevelClearedModal({
  isOpen,
  worldNumber,
  jadeBonus,
  ngPlusLevel = 0,
  onContinue,
}: LevelClearedModalProps) {
  const isNewGamePlus = ngPlusLevel > 0;
  const isEnteringNgPlus = worldNumber % 8 === 0;
  const nextNgPlus = isEnteringNgPlus ? ngPlusLevel + 1 : ngPlusLevel;

  useEffect(() => {
    if (isOpen) {
      const colors = isNewGamePlus
        ? ['#ff6b35', '#ff2d00', '#ffd700', '#ff00cc', '#00ccff']
        : ['#ffd700', '#ffed4e', '#00b06f', '#ff6b35'];

      confetti({
        particleCount: isNewGamePlus ? 500 : 300,
        spread: 160,
        origin: { y: 0.5 },
        colors,
        startVelocity: isNewGamePlus ? 60 : 45,
        gravity: 1.2,
      });

      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: isNewGamePlus ? ['#ff6b35', '#ffd700', '#ff00cc'] : ['#ffd700', '#ffffff', '#00b06f'],
        });
      }, 300);
    }
  }, [isOpen, isNewGamePlus]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className={`modal-content rounded-3xl max-w-lg w-full p-8 border-4 shadow-2xl relative overflow-hidden ${isNewGamePlus ? 'border-orange-500' : 'border-[#ffd700]'}`}
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{ background: `radial-gradient(circle, ${isNewGamePlus ? '#ff6b35' : '#ffd700'} 0%, transparent 70%)` }}
            />

            <div className="relative z-10">
              {isNewGamePlus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center mb-3"
                >
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 text-sm font-bold">
                    <InfinityIcon className="w-4 h-4" />
                    NG+{ngPlusLevel}
                  </span>
                </motion.div>
              )}

              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mb-6"
              >
                <Trophy className={`w-24 h-24 ${isNewGamePlus ? 'text-orange-400' : 'text-[#ffd700]'}`} />
              </motion.div>

              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-center text-white mb-4 drop-shadow-lg"
              >
                WORLD {worldNumber} CLEARED!
              </motion.h2>

              {isEnteringNgPlus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center mb-3"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-900/40 border border-orange-500/40 text-orange-200 text-sm font-bold">
                    <InfinityIcon className="w-4 h-4 text-orange-400" />
                    Entering New Game+ {nextNgPlus}! Difficulty scales up!
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className={`rounded-2xl p-6 mb-6 border-2 ${isNewGamePlus ? 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-600'}`}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-white" />
                  <p className="text-3xl font-black text-white">+{jadeBonus} 💎</p>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-center text-white font-bold">World Clear Bonus!</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-gray-300 text-lg mb-6"
              >
                {isEnteringNgPlus ? `Entering NG+${nextNgPlus} — World 1` : `Entering World ${worldNumber + 1}...`}
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={onContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full text-white font-black py-4 px-6 rounded-2xl text-xl shadow-lg border-4 transition-all ${
                  isNewGamePlus
                    ? 'bg-gradient-to-b from-orange-500 to-red-600 border-orange-400 hover:border-yellow-400'
                    : 'bg-gradient-to-b from-[#00b06f] to-[#008f5b] border-[#00d184] hover:border-[#ffd700]'
                }`}
              >
                {isEnteringNgPlus ? `Start NG+${nextNgPlus}!` : 'Continue Adventure!'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
