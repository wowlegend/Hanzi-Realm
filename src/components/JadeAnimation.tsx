import { motion, AnimatePresence } from 'framer-motion';
import { Gem } from 'lucide-react';

interface JadeAnimationProps {
  amount: number | null;
  bonus?: number;
}

export default function JadeAnimation({ amount, bonus = 0 }: JadeAnimationProps) {
  return (
    <AnimatePresence>
      {amount !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.6, repeat: 1 }}
          >
            <Gem className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
          </motion.div>
          <p
            className="text-3xl font-black text-yellow-300 mt-1"
            style={{ textShadow: '0 0 20px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.5)' }}
          >
            +{amount}
          </p>
          {bonus > 0 && (
            <p className="text-sm font-bold text-green-400 mt-0.5">+{bonus}% bonus</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
