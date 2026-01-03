import { motion } from 'framer-motion';

interface NarratorAvatarProps {
  seed: string;
  isSpeaking: boolean;
  fireMode: boolean;
}

export default function NarratorAvatar({ seed, isSpeaking, fireMode }: NarratorAvatarProps) {
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;

  return (
    <motion.div
      className="relative"
      animate={isSpeaking ? {
        y: [0, -8, 0],
        rotate: [0, -3, 3, 0],
      } : {}}
      transition={isSpeaking ? {
        duration: 0.4,
        repeat: Infinity,
        repeatType: 'loop',
      } : {}}
    >
      <div
        className={`
          w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-4
          transition-all duration-300
          ${fireMode
            ? 'border-orange-500 shadow-[0_0_20px_rgba(255,165,0,0.8)]'
            : 'border-[#00b06f] shadow-lg'
          }
        `}
        style={{
          filter: fireMode ? 'drop-shadow(0 0 10px orange)' : 'none',
        }}
      >
        <img
          src={avatarUrl}
          alt="Narrator"
          className="w-full h-full object-cover pixelated"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {fireMode && (
        <>
          <motion.div
            className="absolute -top-3 -left-1 text-2xl"
            animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ?
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-1 text-xl"
            animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
          >
            ?
          </motion.div>
        </>
      )}

      {isSpeaking && (
        <motion.div
          className="absolute -right-2 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
