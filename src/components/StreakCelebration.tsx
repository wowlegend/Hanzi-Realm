import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Star } from 'lucide-react';

interface StreakCelebrationProps {
  streak: number | null;
}

const milestoneConfig: Record<number, { label: string; color: string; icon: 'flame' | 'zap' | 'star' }> = {
  5: { label: 'ON FIRE', color: 'text-orange-400', icon: 'flame' },
  10: { label: 'UNSTOPPABLE', color: 'text-red-400', icon: 'flame' },
  15: { label: 'LEGENDARY', color: 'text-yellow-400', icon: 'zap' },
  20: { label: 'GODLIKE', color: 'text-cyan-400', icon: 'star' },
  25: { label: 'TRANSCENDENT', color: 'text-white', icon: 'star' },
};

const IconMap = { flame: Flame, zap: Zap, star: Star };

export default function StreakCelebration({ streak }: StreakCelebrationProps) {
  const config = streak ? milestoneConfig[streak] : null;

  return (
    <AnimatePresence>
      {streak !== null && config && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -20, 20, 0],
              }}
              transition={{ duration: 0.8, repeat: 2 }}
              className="flex justify-center mb-4"
            >
              {(() => {
                const Icon = IconMap[config.icon];
                return <Icon className={`w-20 h-20 ${config.color} drop-shadow-lg`} />;
              })()}
            </motion.div>
            <motion.p
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className={`text-5xl sm:text-6xl font-black ${config.color} tracking-widest`}
              style={{ textShadow: '0 0 40px currentColor, 0 4px 8px rgba(0,0,0,0.5)' }}
            >
              {config.label}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-white font-bold mt-2"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {streak} Streak!
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
