import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Companion } from '../types';
import { allCompanions, getRarityColor, getRarityChance } from '../data/companions';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  jade: number;
  onRoll: (companion: Companion) => void;
}

export default function GachaModal({ isOpen, onClose, jade, onRoll }: GachaModalProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [pulledCompanion, setPulledCompanion] = useState<Companion | null>(null);
  const GACHA_COST = 500;

  const rollGacha = () => {
    if (jade < GACHA_COST || isRolling) return;

    setIsRolling(true);
    setPulledCompanion(null);

    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulativeChance = 0;
      let selectedRarity = 'common';

      if (random < getRarityChance('legendary')) {
        selectedRarity = 'legendary';
      } else if (random < getRarityChance('legendary') + getRarityChance('rare')) {
        selectedRarity = 'rare';
      }

      const availableCompanions = allCompanions.filter(c => c.rarity === selectedRarity);
      const selected = availableCompanions[Math.floor(Math.random() * availableCompanions.length)];
      const newCompanion = { ...selected, unlocked: true };

      setPulledCompanion(newCompanion);
      setIsRolling(false);

      if (selectedRarity === 'legendary') {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ffed4e', '#fff'],
        });
      } else if (selectedRarity === 'rare') {
        confetti({
          particleCount: 100,
          spread: 70,
          colors: ['#4db8ff', '#80d0ff', '#fff'],
        });
      }

      onRoll(newCompanion);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#2a2d2f] to-[#1a1c1e] rounded-3xl p-8 max-w-2xl w-full border-4 border-[#ffd700] relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Gift className="w-20 h-20 text-[#ffd700]" />
              </motion.div>

              <h2 className="text-4xl font-black text-white mb-2">
                MYSTERY BLOCK
              </h2>
              <p className="text-gray-300 mb-6">
                Open a block to unlock a rare companion!
              </p>

              <div className="flex justify-center gap-4 mb-8">
                <div className="voxel-card bg-gradient-to-b from-gray-600 to-gray-700 p-4 text-center">
                  <p className="text-gray-300 text-sm">Common</p>
                  <p className="text-2xl font-bold text-gray-400">60%</p>
                </div>
                <div className="voxel-card bg-gradient-to-b from-blue-600 to-blue-700 p-4 text-center">
                  <p className="text-gray-300 text-sm">Rare</p>
                  <p className="text-2xl font-bold text-blue-400">30%</p>
                </div>
                <div className="voxel-card bg-gradient-to-b from-yellow-600 to-yellow-700 p-4 text-center">
                  <p className="text-gray-300 text-sm">Legendary</p>
                  <p className="text-2xl font-bold text-yellow-400">10%</p>
                </div>
              </div>

              {!pulledCompanion && (
                <motion.button
                  onClick={rollGacha}
                  disabled={jade < GACHA_COST || isRolling}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`btn-3d-gold text-white font-black py-4 px-8 rounded-2xl text-xl ${
                    jade < GACHA_COST || isRolling ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isRolling ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      🎁
                    </motion.div>
                  ) : (
                    `OPEN FOR ${GACHA_COST} 💎`
                  )}
                </motion.button>
              )}

              {pulledCompanion && (
                <motion.div
                  initial={{ scale: 0, rotateY: 0 }}
                  animate={{ scale: 1, rotateY: 360 }}
                  transition={{ duration: 0.8 }}
                  className={`voxel-card p-8 ${getRarityColor(pulledCompanion.rarity)} bg-gradient-to-br from-[#2a2d2f] to-[#1a1c1e]`}
                >
                  <div className="text-8xl mb-4">{pulledCompanion.emoji}</div>
                  <h3 className={`text-3xl font-black mb-2 ${getRarityColor(pulledCompanion.rarity).split(' ')[0]}`}>
                    {pulledCompanion.name}
                  </h3>
                  <p className="text-xl text-gray-300 uppercase tracking-wide">
                    {pulledCompanion.rarity}
                  </p>
                </motion.div>
              )}

              <p className="text-gray-400 mt-6">
                Your Jade: <span className="text-[#ffd700] font-bold">{jade} 💎</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
