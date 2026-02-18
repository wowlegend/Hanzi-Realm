import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swords, Headphones, Gem, Skull, Check, Lock, Sparkles } from 'lucide-react';
import { MapNode, NodeType } from '../types';
import { generatePathPoints } from '../utils/mapGenerator';
import { getBossForWorld, getWorldTheme } from '../data/bosses';
import BossMonsterSprite from './BossMonsterSprite';

interface WorldMapProps {
  nodes: MapNode[];
  worldNumber: number;
  onNodeSelect: (node: MapNode) => void;
  jade: number;
}

const NODE_STYLES: Record<NodeType, { gradient: string; border: string; glow: string; iconBg: string }> = {
  battle: {
    gradient: 'from-blue-500 to-blue-700',
    border: 'border-blue-400',
    glow: 'rgba(59,130,246,0.6)',
    iconBg: 'bg-blue-500/30',
  },
  blind: {
    gradient: 'from-teal-500 to-teal-700',
    border: 'border-teal-400',
    glow: 'rgba(20,184,166,0.6)',
    iconBg: 'bg-teal-500/30',
  },
  treasure: {
    gradient: 'from-amber-400 to-amber-600',
    border: 'border-amber-300',
    glow: 'rgba(245,158,11,0.7)',
    iconBg: 'bg-amber-500/30',
  },
  boss: {
    gradient: 'from-red-500 to-red-800',
    border: 'border-red-400',
    glow: 'rgba(239,68,68,0.7)',
    iconBg: 'bg-red-500/30',
  },
};

function NodeIcon({ type, className }: { type: NodeType; className?: string }) {
  const cls = className || 'w-5 h-5 sm:w-6 sm:h-6';
  switch (type) {
    case 'battle': return <Swords className={cls} />;
    case 'blind': return <Headphones className={cls} />;
    case 'treasure': return <Gem className={cls} />;
    case 'boss': return <Skull className={cls} />;
  }
}

function FloatingSparkle({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, bottom: '10%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, -40, -80, -120] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeOut' }}
    >
      <Sparkles className="w-3 h-3 text-white/20" />
    </motion.div>
  );
}

function getNodeLabel(type: NodeType): string {
  switch (type) {
    case 'battle': return 'Battle';
    case 'blind': return 'Listening';
    case 'treasure': return 'Treasure';
    case 'boss': return 'BOSS';
    default: return '';
  }
}

export default function WorldMap({ nodes, worldNumber, onNodeSelect, jade }: WorldMapProps) {
  const pathD = generatePathPoints(nodes);
  const theme = getWorldTheme(worldNumber);
  const boss = getBossForWorld(worldNumber);

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const totalCount = nodes.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const sparkles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      delay: i * 0.6,
      x: 10 + Math.random() * 80,
    })),
  []);

  return (
    <div className="fixed inset-0 bottom-14 sm:bottom-0 sm:top-12 flex flex-col">
      <div className="p-4 pt-2 sm:p-4 flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-3">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl sm:text-4xl font-black text-white"
              style={{ textShadow: `0 2px 12px ${theme.colors.accent}40` }}
            >
              {theme.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-sm sm:text-base italic"
            >
              World {worldNumber} &mdash; {theme.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="voxel-card glass-yellow px-4 py-2 w-fit flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#ffd700]" />
              <p className="text-white text-base font-black">{jade}</p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, ${theme.colors.secondary}, ${theme.colors.accent})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="text-white/60 text-xs font-bold">{completedCount}/{totalCount}</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BossMonsterSprite bossId={boss.id} color={boss.color} attackColor={boss.attackColor} isAttacking={false} size={48} />
          </motion.div>
          <div className="text-right">
            <p className="text-white font-bold text-sm">{boss.name}</p>
            <p className="text-white/40 text-xs">{boss.chineseName}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {sparkles.map((s, i) => (
          <FloatingSparkle key={i} delay={s.delay} x={s.x} />
        ))}

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="pathGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.secondary} stopOpacity="0.15" />
              <stop offset="50%" stopColor={theme.colors.accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="pathLine" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.secondary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0.9" />
            </linearGradient>
            <filter id="pathBlur">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#pathGlow)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#pathBlur)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#pathLine)"
            strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.4"
            strokeDasharray="1.5,3"
            strokeLinecap="round"
            className="animate-path-dash"
          />
        </svg>

        <div className="absolute inset-0">
          {nodes.map((node, index) => {
            const style = NODE_STYLES[node.type];
            const isUnlocked = node.status === 'unlocked';
            const isCompleted = node.status === 'completed';
            const isLocked = node.status === 'locked';

            return (
              <motion.button
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.07,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                onClick={() => isUnlocked && onNodeSelect(node)}
                disabled={isLocked}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
                whileHover={isUnlocked ? { scale: 1.25, y: -4 } : {}}
                whileTap={isUnlocked ? { scale: 0.9 } : {}}
              >
                <div className="relative">
                  {isUnlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2"
                      animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ borderColor: style.glow }}
                    />
                  )}

                  {isUnlocked && (
                    <div
                      className="absolute -inset-2 rounded-3xl"
                      style={{
                        background: `radial-gradient(circle, ${style.glow}20 0%, transparent 70%)`,
                      }}
                    />
                  )}

                  <div
                    className={`
                      relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                      flex items-center justify-center
                      transition-all duration-300
                      map-node-shadow
                      ${isLocked ? 'bg-gray-800/80 border-2 border-gray-700' : ''}
                      ${isCompleted ? `bg-gradient-to-b ${style.gradient} border-2 ${style.border} map-completed-glow` : ''}
                      ${isUnlocked ? `bg-gradient-to-b ${style.gradient} border-2 ${style.border} cursor-pointer` : ''}
                      ${isLocked ? 'opacity-40' : ''}
                    `}
                    style={isUnlocked ? { color: style.glow } : {}}
                  >
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-gray-500" />
                    ) : (
                      <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
                        <NodeIcon type={node.type} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}

                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-300 shadow-lg"
                      >
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}

                    {node.type === 'boss' && !isLocked && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-red-400/50"
                          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          animate={{ boxShadow: [
                            '0 0 8px rgba(239,68,68,0.3)',
                            '0 0 24px rgba(239,68,68,0.6)',
                            '0 0 8px rgba(239,68,68,0.3)',
                          ]}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </>
                    )}

                    {node.type === 'treasure' && !isLocked && (
                      <motion.div
                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                      </motion.div>
                    )}
                  </div>

                  {isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 + 0.3 }}
                      className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    >
                      <span className="text-white text-[10px] sm:text-xs font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                        {node.type === 'boss' ? boss.chineseName : getNodeLabel(node.type)}
                        {node.type === 'treasure' && node.reward ? ` +${node.reward}` : ''}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-4 left-4 right-4 flex justify-center"
        >
          <div className="bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex gap-5">
            {([
              { type: 'battle' as NodeType, label: 'Battle' },
              { type: 'blind' as NodeType, label: 'Listening' },
              { type: 'treasure' as NodeType, label: 'Treasure' },
              { type: 'boss' as NodeType, label: 'Boss' },
            ]).map(item => (
              <div key={item.type} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-b ${NODE_STYLES[item.type].gradient} flex items-center justify-center`}>
                  <NodeIcon type={item.type} className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/60 text-[10px] sm:text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
