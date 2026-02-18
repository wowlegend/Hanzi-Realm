import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import confetti from 'canvas-confetti';
import { Companion } from '../types';
import { allCompanions, getRarityColor, getRarityGlow, getRarityChance, getBuffDescription, getCompanionTheme } from '../data/companions';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  jade: number;
  onRoll: (companion: Companion) => void;
}

const THEME_LABELS: Record<string, string> = {
  minecraft: 'Minecraft',
  roblox: 'Roblox',
  jjk: 'Jujutsu Kaisen',
};

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
      let selectedRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';

      const legendaryThreshold = getRarityChance('legendary');
      const epicThreshold = legendaryThreshold + getRarityChance('epic');
      const rareThreshold = epicThreshold + getRarityChance('rare');

      if (random < legendaryThreshold) {
        selectedRarity = 'legendary';
      } else if (random < epicThreshold) {
        selectedRarity = 'epic';
      } else if (random < rareThreshold) {
        selectedRarity = 'rare';
      }

      const availableCompanions = allCompanions.filter(c => c.rarity === selectedRarity);
      const selected = availableCompanions[Math.floor(Math.random() * availableCompanions.length)];
      const newCompanion = { ...selected, unlocked: true };

      setPulledCompanion(newCompanion);
      setIsRolling(false);

      if (selectedRarity === 'legendary') {
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 }, colors: ['#ffd700', '#ffed4e', '#fff', '#ff6b35'] });
      } else if (selectedRarity === 'epic') {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#f43e5e', '#ff8fa3', '#fff'] });
      } else if (selectedRarity === 'rare') {
        confetti({ particleCount: 100, spread: 70, colors: ['#4db8ff', '#80d0ff', '#fff'] });
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
            className="modal-content rounded-3xl p-8 max-w-2xl w-full border-4 border-[#ffd700] relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="text-center">
              <div className="w-full h-64 mb-4 relative">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-xl">Loading 3D...</div>
                  </div>
                }>
                  <Spline
                    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                    className="w-full h-full"
                  />
                </Suspense>
              </div>

              <h2 className="text-4xl font-black text-white mb-2">MYSTERY BLOCK</h2>
              <p className="text-gray-300 mb-6">Unlock Minecraft, Roblox & JJK companions!</p>

              <div className="flex justify-center gap-3 mb-8 flex-wrap">
                <div className="voxel-card border-gray-600 p-3 text-center min-w-[70px]">
                  <p className="text-gray-300 text-xs">Common</p>
                  <p className="text-lg font-bold text-gray-400">50%</p>
                </div>
                <div className="voxel-card border-blue-600 p-3 text-center min-w-[70px]">
                  <p className="text-gray-300 text-xs">Rare</p>
                  <p className="text-lg font-bold text-blue-400">28%</p>
                </div>
                <div className="voxel-card border-rose-600 p-3 text-center min-w-[70px]">
                  <p className="text-gray-300 text-xs">Epic</p>
                  <p className="text-lg font-bold text-rose-400">15%</p>
                </div>
                <div className="voxel-card border-yellow-600 p-3 text-center min-w-[70px]">
                  <p className="text-gray-300 text-xs">Legend</p>
                  <p className="text-lg font-bold text-yellow-400">7%</p>
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
                      className="inline-block text-3xl"
                    >
                      ?
                    </motion.div>
                  ) : (
                    `OPEN FOR ${GACHA_COST} Jade`
                  )}
                </motion.button>
              )}

              {pulledCompanion && (
                <motion.div
                  initial={{ scale: 0, rotateY: 0 }}
                  animate={{ scale: 1, rotateY: 360 }}
                  transition={{ duration: 0.8 }}
                  className={`voxel-card p-8 ${getRarityColor(pulledCompanion.rarity)} ${getRarityGlow(pulledCompanion.rarity)}`}
                >
                  <div className="text-8xl mb-4">{pulledCompanion.emoji}</div>
                  <h3 className={`text-3xl font-black mb-1 ${getRarityColor(pulledCompanion.rarity).split(' ')[0]}`}>
                    {pulledCompanion.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                    {THEME_LABELS[getCompanionTheme(pulledCompanion.id)]} Series
                  </p>
                  <p className="text-sm text-green-400 mb-2 font-bold">
                    {getBuffDescription(pulledCompanion.buffType, pulledCompanion.buffValue)}
                  </p>
                  <p className="text-xl text-gray-300 uppercase tracking-wide font-black">
                    {pulledCompanion.rarity}
                  </p>
                </motion.div>
              )}

              <p className="text-gray-400 mt-6">
                Your Jade: <span className="text-[#ffd700] font-bold">{jade}</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
