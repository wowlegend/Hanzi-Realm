import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LevelClearedModalProps {
  isOpen: boolean;
  worldNumber: number;
  jadeBonus: number;
  onContinue: () => void;
}

export default function LevelClearedModal({
  isOpen,
  worldNumber,
  jadeBonus,
  onContinue,
}: LevelClearedModalProps) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 300,
        spread: 160,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#ffed4e', '#00b06f', '#ff6b35'],
        startVelocity: 45,
        gravity: 1.2,
      });

      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ffffff', '#00b06f'],
        });
      }, 300);
    }
  }, [isOpen]);

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
            className="modal-content rounded-3xl max-w-lg w-full p-8 border-4 border-[#ffd700] shadow-2xl relative overflow-hidden"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="flex justify-center mb-6"
              >
                <Trophy className="w-24 h-24 text-[#ffd700]" />
              </motion.div>

              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-center text-white mb-4 drop-shadow-lg"
              >
                WORLD {worldNumber} CLEARED!
              </motion.h2>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-6 border-2 border-yellow-600"
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
                Entering World {worldNumber + 1}...
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={onContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-b from-[#00b06f] to-[#008f5b] text-white font-black py-4 px-6 rounded-2xl text-xl shadow-lg border-4 border-[#00d184] hover:border-[#ffd700] transition-all"
              >
                Continue Adventure! 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
