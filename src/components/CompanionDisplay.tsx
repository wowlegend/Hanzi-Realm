import { useState } from 'react';
import { motion } from 'framer-motion';
import { Companion } from '../types';
import { getRarityColor, getBuffDescription } from '../data/companions';

interface CompanionDisplayProps {
  companion: Companion | null;
  isHappy?: boolean;
}

export default function CompanionDisplay({ companion, isHappy = false }: CompanionDisplayProps) {
  const [imageError, setImageError] = useState(false);

  if (!companion) return null;

  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(companion.avatarSeed || companion.id)}`;

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
          className="w-20 h-20 flex items-center justify-center relative"
        >
          {imageError ? (
            <span className="text-5xl">{companion.emoji}</span>
          ) : (
            <>
              <img
                src={avatarUrl}
                alt={companion.name}
                className="w-16 h-16 rounded-lg"
                style={{ imageRendering: 'pixelated' }}
                onError={() => setImageError(true)}
              />
              <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow-lg">{companion.emoji}</span>
            </>
          )}
        </motion.div>
      </div>
      <div className="text-center mt-2 max-w-[100px]">
        <p
          className={`text-sm font-bold ${getRarityColor(companion.rarity).split(' ')[0]}`}
          style={{ textShadow: 'none' }}
        >
          {companion.name}
        </p>
        <p className="text-[10px] text-green-400 mt-0.5 leading-tight">
          {getBuffDescription(companion.buffType, companion.buffValue)}
        </p>
      </div>
    </motion.div>
  );
}
