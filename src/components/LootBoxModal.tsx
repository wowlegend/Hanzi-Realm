import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { LootReward, Companion } from '../types';
import { getRandomCompanionByRarity, getRarityColor, getBuffDescription } from '../data/companions';

interface LootBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (reward: LootReward) => void;
}

export default function LootBoxModal({ isOpen, onClose, onReward }: LootBoxModalProps) {
  const [phase, setPhase] = useState<'shaking' | 'opening' | 'revealed'>('shaking');
  const [reward, setReward] = useState<LootReward | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPhase('shaking');
      setReward(null);

      const shakeDuration = setTimeout(() => {
        setPhase('opening');

        const openDuration = setTimeout(() => {
          const roll = Math.random() * 100;
          let newReward: LootReward;

          if (roll < 5) {
            const companion = getRandomCompanionByRarity('common');
            newReward = { type: 'companion', companion: { ...companion, unlocked: true } };
          } else {
            const jadeAmount = 500 + Math.floor(Math.random() * 500);
            newReward = { type: 'jade', amount: jadeAmount };
          }

          setReward(newReward);
          setPhase('revealed');

          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: newReward.type === 'companion'
              ? ['#ffd700', '#ffed4e', '#ff6b35', '#00ff00']
              : ['#ffd700', '#00b06f', '#ffffff'],
          });

          onReward(newReward);
        }, 800);

        return () => clearTimeout(openDuration);
      }, 2000);

      return () => clearTimeout(shakeDuration);
    }
  }, [isOpen, onReward]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={phase === 'revealed' ? onClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="modal-content rounded-3xl p-8 max-w-md w-full relative"
          onClick={e => e.stopPropagation()}
        >
          {phase === 'revealed' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-6 drop-shadow">
            {phase === 'shaking' && 'Boss Defeated!'}
            {phase === 'opening' && 'Opening...'}
            {phase === 'revealed' && 'Reward!'}
          </h2>

          <div className="flex justify-center mb-6">
            {phase === 'shaking' && (
              <motion.div
                animate={{
                  rotate: [-5, 5, -5, 5, -5, 5, 0],
                  scale: [1, 1.05, 1, 1.05, 1, 1.05, 1],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-8xl"
              >
                ?
              </motion.div>
            )}

            {phase === 'opening' && (
              <motion.div
                animate={{
                  scale: [1, 1.5, 0],
                  rotate: [0, 180, 360],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.8 }}
                className="text-8xl"
              >
                ?
              </motion.div>
            )}

            {phase === 'revealed' && reward && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-center"
              >
                {reward.type === 'jade' ? (
                  <div>
                    <div className="text-8xl mb-4">?</div>
                    <p className="text-3xl font-black text-[#ffd700] drop-shadow">
                      +{reward.amount} Jade!
                    </p>
                  </div>
                ) : reward.companion ? (
                  <div>
                    <div className="text-8xl mb-4">{reward.companion.emoji}</div>
                    <p className={`text-2xl font-black mb-2 ${getRarityColor(reward.companion.rarity)}`}>
                      {reward.companion.name}
                    </p>
                    <p className="text-sm text-white/80">
                      {getBuffDescription(reward.companion.buffType, reward.companion.buffValue)}
                    </p>
                    <p className="text-xs text-[#ffd700] mt-2 uppercase font-bold">
                      {reward.companion.rarity}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>

          {phase === 'revealed' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onClose}
              className="btn-3d-green w-full py-4 rounded-xl text-white font-black text-lg"
            >
              Claim Reward
            </motion.button>
          )}

          {phase !== 'revealed' && (
            <div className="text-center text-white/60 text-sm">
              {phase === 'shaking' ? 'Shaking the loot box...' : 'Here it comes...'}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
