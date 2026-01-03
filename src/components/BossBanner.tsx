import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface BossBannerProps {
  timeLeft: number;
  maxTime: number;
}

export default function BossBanner({ timeLeft, maxTime }: BossBannerProps) {
  const percentage = (timeLeft / maxTime) * 100;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-red-900 to-red-700 p-4 border-b-8 border-black"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="flex items-center gap-3"
          >
            <Flame className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-black text-white tracking-wider">
              BOSS MODE: NIAN MONSTER
            </h2>
            <Flame className="w-8 h-8 text-yellow-400" />
          </motion.div>

          <div className="text-4xl font-black text-white">
            {timeLeft}s
          </div>
        </div>

        <div className="bg-black bg-opacity-50 rounded-full h-6 overflow-hidden border-2 border-yellow-400">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${
              percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ transition: 'width 1s linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
