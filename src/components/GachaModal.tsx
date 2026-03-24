import { useState, Suspense, lazy, ErrorInfo, Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gem, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Companion } from '../types';
import { allCompanions, getRarityColor, getRarityGlow, getRarityChance, getBuffDescription, getCompanionTheme } from '../data/companions';
import { GACHA } from '../config/gameBalance';

const Spline = lazy(() => import('@splinetool/react-spline'));

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

class Spline3DFallback extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(_: Error, __: ErrorInfo) {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-900/30 to-amber-600/20 rounded-2xl border border-amber-500/20">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-pulse" />
            <p className="text-amber-300 font-bold text-lg">Mystery Block</p>
            <p className="text-amber-400/60 text-xs">3D preview unavailable</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RollingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <motion.div
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center border-4 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)]"
      >
        <span className="text-4xl font-black text-white">?</span>
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-amber-300 font-bold"
      >
        Opening...
      </motion.p>
    </div>
  );
}

function getPityCounter(): number {
  try { return parseInt(localStorage.getItem('gacha_pity') || '0') || 0; } catch { return 0; }
}
function setPityCounter(val: number) {
  localStorage.setItem('gacha_pity', String(val));
}

export default function GachaModal({ isOpen, onClose, jade, onRoll }: GachaModalProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [pulledCompanion, setPulledCompanion] = useState<Companion | null>(null);
  const [showCardFront, setShowCardFront] = useState(false);
  const [pity, setPity] = useState(getPityCounter);

  const rollGacha = () => {
    if (jade < GACHA.COST || isRolling) return;

    setIsRolling(true);
    setPulledCompanion(null);
    setShowCardFront(false);

    setTimeout(() => {
      const currentPity = getPityCounter() + 1;
      let selectedRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';

      if (currentPity >= GACHA.PITY_LEGENDARY) {
        selectedRarity = 'legendary';
      } else if (currentPity >= GACHA.PITY_EPIC && currentPity % GACHA.PITY_EPIC === 0) {
        selectedRarity = 'epic';
      } else {
        const random = Math.random() * 100;
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
      }

      if (selectedRarity === 'legendary' || selectedRarity === 'epic') {
        setPityCounter(0);
        setPity(0);
      } else {
        setPityCounter(currentPity);
        setPity(currentPity);
      }

      const availableCompanions = allCompanions.filter(c => c.rarity === selectedRarity);
      const selected = availableCompanions[Math.floor(Math.random() * availableCompanions.length)];
      const newCompanion = { ...selected, unlocked: true };

      setPulledCompanion(newCompanion);
      setIsRolling(false);

      setTimeout(() => setShowCardFront(true), 100);

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
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-500/40 relative max-h-[85dvh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-full h-48 sm:h-56 mb-4 rounded-2xl overflow-hidden">
                <Spline3DFallback>
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-900/20 to-amber-600/10 rounded-2xl">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Gem className="w-12 h-12 text-amber-400" />
                      </motion.div>
                    </div>
                  }>
                    <Spline
                      scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                      className="w-full h-full"
                    />
                  </Suspense>
                </Spline3DFallback>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">MYSTERY BLOCK</h2>
              <p className="text-gray-400 text-sm mb-5">Unlock Minecraft, Roblox & JJK companions!</p>

              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {[
                  { label: 'Common', pct: '50%', color: 'text-gray-400', border: 'border-gray-600/50' },
                  { label: 'Rare', pct: '28%', color: 'text-blue-400', border: 'border-blue-500/30' },
                  { label: 'Epic', pct: '15%', color: 'text-rose-400', border: 'border-rose-500/30' },
                  { label: 'Legend', pct: '7%', color: 'text-amber-400', border: 'border-amber-500/30' },
                ].map(tier => (
                  <div key={tier.label} className={`bg-black/30 border ${tier.border} rounded-xl px-3 py-2 text-center min-w-[60px]`}>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">{tier.label}</p>
                    <p className={`text-sm font-black ${tier.color}`}>{tier.pct}</p>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {isRolling && (
                  <motion.div
                    key="rolling"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <RollingAnimation />
                  </motion.div>
                )}

                {!isRolling && !pulledCompanion && (
                  <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.button
                      onClick={rollGacha}
                      disabled={jade < GACHA.COST}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`btn-3d-gold text-white font-black py-4 px-8 rounded-2xl text-xl ${
                        jade < GACHA.COST ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      OPEN FOR {GACHA.COST} Jade
                    </motion.button>
                  </motion.div>
                )}

                {pulledCompanion && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="perspective-[1000px]"
                  >
                    <motion.div
                      initial={{ rotateY: 180, scale: 0.6 }}
                      animate={showCardFront ? { rotateY: 0, scale: 1 } : { rotateY: 180, scale: 0.6 }}
                      transition={{ duration: 0.7, type: 'spring', damping: 15 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className={`voxel-card p-6 sm:p-8 ${getRarityColor(pulledCompanion.rarity)} ${getRarityGlow(pulledCompanion.rarity)}`}
                    >
                      <div className="text-7xl sm:text-8xl mb-3">{pulledCompanion.emoji}</div>
                      <h3 className={`text-2xl sm:text-3xl font-black mb-1 ${getRarityColor(pulledCompanion.rarity).split(' ')[0]}`}>
                        {pulledCompanion.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">
                        {THEME_LABELS[getCompanionTheme(pulledCompanion.id)]} Series
                      </p>
                      <p className="text-sm text-green-400 mb-2 font-bold">
                        {getBuffDescription(pulledCompanion.buffType, pulledCompanion.buffValue)}
                      </p>
                      <p className="text-lg text-gray-300 uppercase tracking-wide font-black">
                        {pulledCompanion.rarity}
                      </p>
                    </motion.div>

                    <motion.button
                      onClick={() => { setPulledCompanion(null); setShowCardFront(false); }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-3d-gold text-white font-black py-3 px-8 rounded-2xl text-base mt-4"
                    >
                      Roll Again ({GACHA.COST} Jade)
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-center gap-4 mt-5 text-sm">
                <span className="text-gray-500">
                  Jade: <span className="text-amber-400 font-bold">{jade}</span>
                </span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-500">
                  Pity: <span className="text-white/60 font-bold">{pity}/{GACHA.PITY_LEGENDARY}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
