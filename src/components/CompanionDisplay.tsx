import { motion } from 'framer-motion';
import { Companion } from '../types';
import { getRarityColor } from '../data/companions';

interface CompanionDisplayProps {
  companion: Companion | null;
  isHappy?: boolean;
}

export default function CompanionDisplay({ companion, isHappy = false }: CompanionDisplayProps) {
  if (!companion) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isHappy ? [1, 1.3, 1] : 1,
        opacity: 1,
        y: isHappy ? [0, -20, 0] : 0
      }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-20 right-8 z-40"
    >
      <div className={`voxel-card bg-gradient-to-br from-[#2a2d2f] to-[#1a1c1e] p-3 ${getRarityColor(companion.rarity)}`}>
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-5xl"
        >
          {companion.emoji}
        </motion.div>
      </div>
      <div className="text-center mt-2">
        <p className={`text-xs font-bold ${getRarityColor(companion.rarity).split(' ')[0]}`}>
          {companion.name}
        </p>
      </div>
    </motion.div>
  );
}
