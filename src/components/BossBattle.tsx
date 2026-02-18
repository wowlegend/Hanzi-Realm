import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Wind, Droplets, Sparkles } from 'lucide-react';
import { Boss } from '../data/bosses';
import BossMonsterSprite from './BossMonsterSprite';

interface BossBattleProps {
  boss: Boss;
  timeLeft: number;
  maxTime: number;
  isActive: boolean;
  bossHp?: number;
  bossMaxHp?: number;
}

interface AttackEffect {
  id: number;
  x: number;
  y: number;
  type: string;
}

export default function BossBattle({ boss, timeLeft, maxTime, isActive, bossHp = 3, bossMaxHp = 3 }: BossBattleProps) {
  const percentage = (timeLeft / maxTime) * 100;
  const [bossPosition, setBossPosition] = useState({ x: 50, y: -20 });
  const [isAttacking, setIsAttacking] = useState(false);
  const [attacks, setAttacks] = useState<AttackEffect[]>([]);
  const [showBoss, setShowBoss] = useState(false);
  const attackIdRef = useRef(0);
  const attackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      setShowBoss(true);
      const entranceTimeout = setTimeout(() => {
        setBossPosition({ x: 50, y: 30 });
      }, 100);

      return () => clearTimeout(entranceTimeout);
    } else {
      setShowBoss(false);
      setBossPosition({ x: 50, y: -20 });
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
      }
      return;
    }

    const performAttack = () => {
      setIsAttacking(true);

      const newAttacks: AttackEffect[] = [];
      const attackCount = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < attackCount; i++) {
        newAttacks.push({
          id: attackIdRef.current++,
          x: Math.random() * 80 + 10,
          y: Math.random() * 40 + 50,
          type: boss.attackSound,
        });
      }

      setAttacks(prev => [...prev, ...newAttacks]);

      const side = Math.random() > 0.5 ? 20 : 80;
      setBossPosition({ x: side, y: 25 + Math.random() * 20 });

      setTimeout(() => {
        setIsAttacking(false);
        setBossPosition({ x: 50, y: 30 });
      }, 500);

      setTimeout(() => {
        setAttacks(prev => prev.filter(a => !newAttacks.find(na => na.id === a.id)));
      }, 1000);
    };

    attackIntervalRef.current = setInterval(performAttack, 2500);

    const initialAttack = setTimeout(performAttack, 1000);

    return () => {
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
      }
      clearTimeout(initialAttack);
    };
  }, [isActive, boss]);

  const getAttackIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <Flame className="w-full h-full" />;
      case 'thunder':
        return <Zap className="w-full h-full" />;
      case 'wave':
        return <Droplets className="w-full h-full" />;
      case 'magic':
        return <Sparkles className="w-full h-full" />;
      default:
        return <Wind className="w-full h-full" />;
    }
  };

  if (!isActive) return null;

  return (
    <>
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -200, opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-b ${boss.bgGradient} p-4 border-b-8 border-black`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 flex-shrink-0">
                <BossMonsterSprite bossId={boss.id} color={boss.color} attackColor={boss.attackColor} isAttacking={false} size={48} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
                  BOSS: {boss.name}
                </h2>
                <p className="text-xs text-white/70">{boss.chineseName} - {boss.description}</p>
              </div>
            </motion.div>

            <div className="text-right">
              <div className="text-4xl font-black text-white">{timeLeft}s</div>
              <p className="text-xs text-white/70">Defeat before time runs out!</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-white/70 text-xs mb-1">HP</p>
              <div className="flex gap-1">
                {Array.from({ length: bossMaxHp }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={i < bossHp ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`h-5 flex-1 rounded ${i < bossHp ? '' : 'opacity-30'}`}
                    style={{ backgroundColor: i < bossHp ? boss.color : '#444' }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-xs mb-1">Time</p>
              <div className="bg-black/50 rounded-full h-5 overflow-hidden border" style={{ borderColor: boss.color }}>
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${percentage}%` }}
                  className="h-full"
                  style={{
                    background: `linear-gradient(90deg, ${boss.color}, ${boss.attackColor})`,
                    transition: 'width 1s linear',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showBoss && (
          <motion.div
            className="fixed z-30 pointer-events-none"
            initial={{ x: '50%', y: '-100%', opacity: 0 }}
            animate={{
              x: `${bossPosition.x}%`,
              y: `${bossPosition.y}%`,
              opacity: 1,
              scale: isAttacking ? 1.3 : 1,
              rotate: isAttacking ? [0, -10, 10, 0] : 0,
            }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            style={{
              left: 0,
              top: 0,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <BossMonsterSprite
                bossId={boss.id}
                color={boss.color}
                attackColor={boss.attackColor}
                isAttacking={isAttacking}
                size={160}
              />

              {isAttacking && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 2, 3], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="w-32 h-32 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${boss.attackColor}88, transparent)`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {attacks.map(attack => (
          <motion.div
            key={attack.id}
            className="fixed z-50 pointer-events-none"
            initial={{
              x: `${bossPosition.x}%`,
              y: `${bossPosition.y}%`,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: `${attack.x}%`,
              y: `${attack.y}%`,
              scale: [0, 1.5, 1],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              left: 0,
              top: 0,
              transform: 'translate(-50%, -50%)',
              color: boss.attackColor,
            }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              {getAttackIcon(attack.type)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 z-20 pointer-events-none"
        animate={{
          backgroundColor: isAttacking ? `${boss.color}22` : 'transparent',
        }}
        transition={{ duration: 0.1 }}
      />

      <AnimatePresence>
        {isAttacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="px-6 py-3 rounded-xl font-black text-white text-xl"
              style={{ backgroundColor: boss.color }}
            >
              {boss.attackName}!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
