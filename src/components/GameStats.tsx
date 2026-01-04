import { motion } from 'framer-motion';
import { Gift, Zap } from 'lucide-react';
import { Companion } from '../types';
import { getBuffDescription } from '../data/companions';

interface GameStatsProps {
  jade: number;
  currentStreak: number;
  bestStreak: number;
  fireMode: boolean;
  activeCompanion: Companion | null;
  onGachaClick: () => void;
}

export default function GameStats({
  jade,
  currentStreak,
  bestStreak,
  fireMode,
  activeCompanion,
  onGachaClick,
}: GameStatsProps) {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
      <div className="voxel-card glass-yellow border-yellow-700 px-4 py-2 sm:px-6 sm:py-3">
        <p className="text-white text-sm sm:text-base font-black drop-shadow">
          {jade} Jade
        </p>
      </div>
      <div className={`voxel-card px-4 py-2 sm:px-6 sm:py-3 relative transition-all duration-300 ${
        fireMode ? 'border-orange-500 shadow-[0_0_20px_rgba(255,165,0,0.6)]' : 'border-orange-700'
      }`}>
        {currentStreak >= 3 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute -top-3 -right-3 text-3xl"
          >
            {fireMode ? <Zap className="w-8 h-8 text-yellow-400" /> : '?'}
          </motion.div>
        )}
        <p className={`text-sm sm:text-base font-black drop-shadow ${
          currentStreak > 0 ? 'text-white' : 'text-gray-300'
        }`}>
          Streak: {currentStreak}
          {fireMode && ' FIRE!'}
        </p>
      </div>
      <div className="voxel-card glass-green border-green-700 px-4 py-2 sm:px-6 sm:py-3">
        <p className="text-white text-sm sm:text-base font-black drop-shadow">
          Best: {bestStreak}
        </p>
      </div>
      {activeCompanion && (
        <div className="voxel-card border-purple-700 px-4 py-2 sm:px-6 sm:py-3">
          <p className="text-white text-xs font-bold drop-shadow">
            {activeCompanion.emoji} {getBuffDescription(activeCompanion.buffType, activeCompanion.buffValue)}
          </p>
        </div>
      )}
      <motion.button
        onClick={onGachaClick}
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        className="btn-3d-gold px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 text-white font-black"
      >
        <Gift className="w-5 h-5" />
        <span className="text-sm sm:text-base">GACHA</span>
      </motion.button>
    </div>
  );
}
