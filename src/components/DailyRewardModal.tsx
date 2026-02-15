import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Check, Gem } from 'lucide-react';
import { DailyReward } from '../utils/dailyRewards';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClaim: () => void;
  reward: DailyReward | null;
  allRewards: DailyReward[];
}

export default function DailyRewardModal({ isOpen, onClaim, reward, allRewards }: DailyRewardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 40 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-gradient-to-br from-[#1e2025] to-[#16181b] border-2 border-yellow-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                className="inline-block mb-3"
              >
                <Gift className="w-16 h-16 text-yellow-400" />
              </motion.div>
              <h2 className="text-3xl font-black text-yellow-400 mb-1">Daily Reward!</h2>
              <p className="text-gray-400 text-sm">Day {reward.day} of 7</p>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {allRewards.map((r) => {
                const isCurrent = r.day === reward.day;
                const isClaimed = r.claimed;
                return (
                  <div
                    key={r.day}
                    className={`relative rounded-xl p-2 text-center border-2 transition-all ${
                      isCurrent
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                        : isClaimed
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <p className="text-[10px] text-gray-400 font-bold">D{r.day}</p>
                    <Gem className={`w-4 h-4 mx-auto my-0.5 ${isCurrent ? 'text-yellow-400' : isClaimed ? 'text-green-400' : 'text-gray-500'}`} />
                    <p className={`text-xs font-black ${isCurrent ? 'text-yellow-300' : isClaimed ? 'text-green-300' : 'text-gray-500'}`}>
                      {r.jade}
                    </p>
                    {isClaimed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm mb-1">Today's reward:</p>
              <div className="flex items-center justify-center gap-2">
                <Gem className="w-8 h-8 text-yellow-400" />
                <span className="text-4xl font-black text-yellow-300">{reward.jade}</span>
                <span className="text-yellow-400/70 font-bold">Jade</span>
              </div>
            </div>

            <motion.button
              onClick={onClaim}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-3d-gold w-full text-white font-black py-4 rounded-2xl text-xl"
            >
              Claim Reward!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
