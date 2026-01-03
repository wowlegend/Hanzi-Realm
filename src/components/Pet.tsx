import { motion } from 'framer-motion';

interface PetProps {
  pet: 'none' | 'doge' | 'dragon';
  isHappy: boolean;
}

export default function Pet({ pet, isHappy }: PetProps) {
  if (pet === 'none') return null;

  const petEmoji = pet === 'doge' ? '🐕' : '🐉';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-8 right-8 pointer-events-none"
    >
      <motion.div
        animate={isHappy ? { y: [0, -20, 0] } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="text-7xl filter drop-shadow-lg"
      >
        {petEmoji}
      </motion.div>
    </motion.div>
  );
}
