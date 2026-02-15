import { motion, AnimatePresence } from 'framer-motion';
import { Award, Gem } from 'lucide-react';
import { Achievement } from '../data/achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={onDismiss}
          className="fixed top-6 right-6 z-[100] cursor-pointer"
        >
          <div className="bg-gradient-to-r from-[#1e2025] to-[#2a2d32] border-2 border-yellow-500/50 rounded-2xl p-4 pr-6 flex items-center gap-4 shadow-xl shadow-black/30 min-w-[280px]">
            <div className="bg-yellow-500/20 rounded-xl p-3">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-yellow-400/80 font-bold uppercase tracking-wider">Achievement Unlocked</p>
              <p className="text-white font-black text-lg leading-tight">{achievement.title}</p>
              <p className="text-gray-400 text-xs">{achievement.titleCn} - {achievement.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <Gem className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-yellow-300 text-sm font-bold">+{achievement.jadeReward}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
