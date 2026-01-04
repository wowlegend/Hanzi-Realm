import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles } from 'lucide-react';
import { LootReward } from '../types';
import { getRandomCompanionByRarity, getRarityColor, getBuffDescription } from '../data/companions';

interface LootBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (reward: LootReward) => void;
}

export default function LootBoxModal({ isOpen, onClose, onReward }: LootBoxModalProps) {
  const [phase, setPhase] = useState<'shaking' | 'opening' | 'revealed'>('shaking');
  const [reward, setReward] = useState<LootReward | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const hasTriggeredReward = useRef(false);
  const onRewardRef = useRef(onReward);

  useEffect(() => {
    onRewardRef.current = onReward;
  }, [onReward]);

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
  }, []);

  const handleClose = useCallback(() => {
    clearAllTimeouts();
    setPhase('shaking');
    setReward(null);
    hasTriggeredReward.current = false;
    onClose();
  }, [clearAllTimeouts, onClose]);

  useEffect(() => {
    if (!isOpen) {
      clearAllTimeouts();
      setPhase('shaking');
      setReward(null);
      hasTriggeredReward.current = false;
      return;
    }

    setPhase('shaking');
    setReward(null);
    hasTriggeredReward.current = false;

    const shakeTimeout = setTimeout(() => {
      setPhase('opening');

      const openTimeout = setTimeout(() => {
        if (hasTriggeredReward.current) return;
        hasTriggeredReward.current = true;

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

        onRewardRef.current(newReward);
      }, 800);

      timeoutRefs.current.push(openTimeout);
    }, 1500);

    timeoutRefs.current.push(shakeTimeout);

    return () => {
      clearAllTimeouts();
    };
  }, [isOpen, clearAllTimeouts]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={phase === 'revealed' ? handleClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="modal-content rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {phase === 'shaking' && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: 400,
                      opacity: 0
                    }}
                    animate={{
                      y: -50,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: 'easeOut'
                    }}
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
              </>
            )}
          </div>

          {phase === 'revealed' && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-6 drop-shadow">
            {phase === 'shaking' && 'Boss Defeated!'}
            {phase === 'opening' && 'Opening...'}
            {phase === 'revealed' && 'Reward!'}
          </h2>

          <div className="flex justify-center mb-6 min-h-[150px] items-center">
            {phase === 'shaking' && (
              <motion.div
                animate={{
                  rotate: [-8, 8, -8, 8, -8, 8, 0],
                  scale: [1, 1.1, 1, 1.1, 1, 1.1, 1],
                }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="relative"
              >
                <div className="text-8xl">
                  <Gift className="w-24 h-24 text-yellow-400" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
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
                <Gift className="w-24 h-24 text-yellow-400" />
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
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-8xl mb-4"
                    >
                      <span className="text-yellow-400">&#x1F48E;</span>
                    </motion.div>
                    <p className="text-3xl font-black text-[#ffd700] drop-shadow">
                      +{reward.amount} Jade!
                    </p>
                  </div>
                ) : reward.companion ? (
                  <div>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-8xl mb-4"
                    >
                      {reward.companion.emoji}
                    </motion.div>
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
              onClick={handleClose}
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
