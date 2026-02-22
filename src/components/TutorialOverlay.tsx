import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Swords, Flame, Gem, Skull } from 'lucide-react';

const TUTORIAL_KEY = 'hanzi_tutorial_done';

export function isTutorialDone(): boolean {
  return localStorage.getItem(TUTORIAL_KEY) === 'true';
}

export function markTutorialDone(): void {
  localStorage.setItem(TUTORIAL_KEY, 'true');
}

const STEPS = [
  {
    icon: <Map className="w-8 h-8 text-teal-400" />,
    title: 'World Map',
    desc: 'Explore nodes on the map. Complete them all to clear the world and advance to the next!',
  },
  {
    icon: <Swords className="w-8 h-8 text-orange-400" />,
    title: 'Battle',
    desc: 'Tap the correct answer to learn Chinese characters. Each correct answer earns Jade!',
  },
  {
    icon: <Flame className="w-8 h-8 text-red-400" />,
    title: 'Streaks',
    desc: 'Answer correctly in a row to build a streak. Streaks unlock Fire Mode for bonus rewards!',
  },
  {
    icon: <Gem className="w-8 h-8 text-cyan-400" />,
    title: 'Jade',
    desc: 'Collect Jade to summon Companions in the Gacha. Companions give powerful buffs!',
  },
  {
    icon: <Skull className="w-8 h-8 text-amber-400" />,
    title: 'Boss Battles',
    desc: 'Each world ends with a Boss! Defeat it before the timer runs out to earn rare loot boxes.',
  },
];

interface TutorialOverlayProps {
  show: boolean;
  onDismiss: () => void;
}

export default function TutorialOverlay({ show, onDismiss }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      markTutorialDone();
      onDismiss();
    }
  };

  const handleSkip = () => {
    markTutorialDone();
    onDismiss();
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/75 p-4"
        >
          <motion.div
            key={step}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="modal-content rounded-3xl p-8 max-w-sm w-full text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                {current.icon}
              </div>
            </motion.div>

            <h3 className="text-2xl font-black text-white mb-3">{current.title}</h3>
            <p className="text-white/70 leading-relaxed mb-6">{current.desc}</p>

            <div className="flex justify-center gap-1.5 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === step ? 'w-5 h-2 bg-teal-400' : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-3d-green w-full py-3 rounded-xl text-white font-black"
            >
              {step < STEPS.length - 1 ? 'Next' : "Let's Go!"}
            </motion.button>

            <button
              onClick={handleSkip}
              className="mt-3 text-white/30 text-xs hover:text-white/60 transition-colors"
            >
              Skip tutorial
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
