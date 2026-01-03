import { motion } from 'framer-motion';

interface ComboFlameProps {
  streak: number;
}

export default function ComboFlame({ streak }: ComboFlameProps) {
  if (streak < 3) return null;

  return (
    <motion.div
      key={streak}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
    >
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-5xl filter drop-shadow-lg"
      >
        🔥
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-[#ff6b35] font-black text-lg mt-2 drop-shadow-lg"
      >
        COMBO {streak}x
      </motion.p>
    </motion.div>
  );
}
