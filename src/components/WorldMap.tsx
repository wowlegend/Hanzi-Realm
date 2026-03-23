import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Headphones, Gem, Skull, Check, Lock, Sparkles,
  Infinity as InfinityIcon, Eye, Shield, Zap,
} from 'lucide-react';
import { MapNode, NodeType } from '../types';
import { generateSegmentPaths } from '../utils/mapGenerator';
import { getBossForWorld, getWorldTheme, getBossTier } from '../data/bosses';
import BossMonsterSprite from './BossMonsterSprite';

interface WorldMapProps {
  nodes: MapNode[];
  worldNumber: number;
  ngPlusLevel?: number;
  onNodeSelect: (node: MapNode) => void;
  jade: number;
}

const NODE_STYLES: Record<NodeType, { gradient: string; border: string; glow: string; iconBg: string; color: string }> = {
  battle: {
    gradient: 'from-blue-500 to-blue-700',
    border: 'border-blue-400',
    glow: 'rgba(59,130,246,0.6)',
    iconBg: 'bg-blue-500/30',
    color: '#3b82f6',
  },
  blind: {
    gradient: 'from-teal-500 to-teal-700',
    border: 'border-teal-400',
    glow: 'rgba(20,184,166,0.6)',
    iconBg: 'bg-teal-500/30',
    color: '#14b8a6',
  },
  treasure: {
    gradient: 'from-amber-400 to-amber-600',
    border: 'border-amber-300',
    glow: 'rgba(245,158,11,0.7)',
    iconBg: 'bg-amber-500/30',
    color: '#f59e0b',
  },
  boss: {
    gradient: 'from-red-500 to-red-800',
    border: 'border-red-400',
    glow: 'rgba(239,68,68,0.7)',
    iconBg: 'bg-red-500/30',
    color: '#ef4444',
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

function getNodeLabel(type: NodeType): string {
  switch (type) {
    case 'battle': return 'Battle';
    case 'blind': return 'Listening';
    case 'treasure': return 'Treasure';
    case 'boss': return 'BOSS';
    default: return '';
  }
}

function getNodePreviewInfo(type: NodeType): { icon: React.ReactNode; title: string; desc: string } {
  switch (type) {
    case 'battle':
      return { icon: <Swords className="w-5 h-5 text-blue-400" />, title: 'Battle Node', desc: 'Answer 5 questions to clear' };
    case 'blind':
      return { icon: <Headphones className="w-5 h-5 text-teal-400" />, title: 'Listening Challenge', desc: 'Listen and identify characters' };
    case 'treasure':
      return { icon: <Gem className="w-5 h-5 text-amber-400" />, title: 'Treasure Chest', desc: 'Collect bonus jade' };
    case 'boss':
      return { icon: <Skull className="w-5 h-5 text-red-400" />, title: 'Boss Battle', desc: 'Defeat the guardian to advance' };
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

function PlayerAvatar({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-teal-400 to-teal-600 border-2 border-teal-300 shadow-lg shadow-teal-500/40 flex items-center justify-center">
          <span className="text-sm sm:text-base font-black text-white select-none">
            You
          </span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-teal-600" />
      </motion.div>
    </motion.div>
  );
}

interface NodePreviewTooltipProps {
  node: MapNode;
  onClose: () => void;
}

function NodePreviewTooltip({ node, onClose }: NodePreviewTooltipProps) {
  const info = getNodePreviewInfo(node.type);
  const style = NODE_STYLES[node.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute z-30 -translate-x-1/2 pointer-events-auto"
      style={{ left: `${node.position.x}%`, top: `${node.position.y - 12}%` }}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <div
        className="bg-black/90 backdrop-blur-md rounded-xl px-4 py-3 border shadow-xl min-w-[160px]"
        style={{ borderColor: `${style.color}40` }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          {info.icon}
          <span className="text-white font-bold text-sm">{info.title}</span>
        </div>
        <p className="text-white/50 text-xs">{info.desc}</p>
        {node.type === 'treasure' && node.reward && (
          <div className="flex items-center gap-1 mt-1.5 text-amber-400 text-xs font-bold">
            <Gem className="w-3 h-3" />
            +{node.reward} jade
          </div>
        )}
        <div className="flex items-center gap-1 mt-2 text-white/30 text-[10px]">
          <Lock className="w-3 h-3" /> Complete previous nodes
        </div>
      </div>
    </motion.div>
  );
}

export default function WorldMap({ nodes, worldNumber, ngPlusLevel = 0, onNodeSelect, jade }: WorldMapProps) {
  const theme = getWorldTheme(worldNumber);
  const boss = getBossForWorld(worldNumber);
  const tier = getBossTier(worldNumber);
  const [previewNode, setPreviewNode] = useState<MapNode | null>(null);

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const totalCount = nodes.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const segments = useMemo(() => generateSegmentPaths(nodes), [nodes]);

  const currentNode = useMemo(() => {
    const unlocked = nodes.find(n => n.status === 'unlocked');
    if (unlocked) return unlocked;
    const lastCompleted = [...nodes].reverse().find(n => n.status === 'completed');
    return lastCompleted || nodes[0];
  }, [nodes]);

  const sparkles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      delay: i * 0.6,
      x: 10 + ((i * 37 + 13) % 80),
    })),
  []);

  const tierLabel = tier.label;
  const tierColor = tierLabel === 'Normal' ? 'text-gray-300 border-gray-500/40 bg-gray-500/10'
    : tierLabel === 'Hard' ? 'text-blue-300 border-blue-500/40 bg-blue-500/10'
    : tierLabel === 'Elite' ? 'text-amber-300 border-amber-500/40 bg-amber-500/10'
    : 'text-orange-300 border-orange-500/40 bg-orange-500/10';

  const handleLockedNodeClick = useCallback((node: MapNode) => {
    setPreviewNode(prev => prev?.id === node.id ? null : node);
  }, []);

  const handleBackdropClick = useCallback(() => {
    if (previewNode) setPreviewNode(null);
  }, [previewNode]);

  return (
    <div className="fixed inset-0 bottom-14 sm:bottom-0 sm:top-12 flex flex-col" onClick={handleBackdropClick}>
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
              className="text-white/50 text-sm sm:text-base italic flex items-center gap-2 flex-wrap"
            >
              World {worldNumber} &mdash; {theme.subtitle}
              {ngPlusLevel > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold not-italic">
                  <InfinityIcon className="w-3 h-3" />
                  NG+{ngPlusLevel}
                </span>
              )}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 flex-wrap"
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

            <div className={`px-2.5 py-1 rounded-lg border text-[10px] sm:text-xs font-bold ${tierColor}`}>
              <div className="flex items-center gap-1">
                {tierLabel === 'Normal' && <Shield className="w-3 h-3" />}
                {tierLabel === 'Hard' && <Zap className="w-3 h-3" />}
                {tierLabel === 'Elite' && <Sparkles className="w-3 h-3" />}
                {tierLabel === 'Legendary' && <Skull className="w-3 h-3" />}
                {tierLabel}
              </div>
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
          <div className="text-right hidden sm:block">
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
            <linearGradient id="pathCompleted" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.secondary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="pathPending" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
            </linearGradient>
            <linearGradient id="pathGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.secondary} stopOpacity="0.2" />
              <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0.3" />
            </linearGradient>
            <filter id="segGlow">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>

          {segments.map((seg, i) => (
            <g key={`seg-${i}`}>
              {seg.completed && (
                <motion.path
                  d={seg.d}
                  fill="none"
                  stroke="url(#pathGlow)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#segGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                />
              )}
              <motion.path
                d={seg.d}
                fill="none"
                stroke={seg.completed ? 'url(#pathCompleted)' : 'url(#pathPending)'}
                strokeWidth={seg.completed ? 0.8 : 0.5}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
              />
              {!seg.completed && (
                <path
                  d={seg.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.3"
                  strokeDasharray="1,2.5"
                  strokeLinecap="round"
                  className="animate-path-dash"
                />
              )}
              {seg.completed && (
                <path
                  d={seg.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.3"
                  strokeDasharray="1.5,3"
                  strokeLinecap="round"
                  className="animate-path-dash"
                />
              )}
            </g>
          ))}
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
                  delay: index * 0.06,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isUnlocked) onNodeSelect(node);
                  else if (isLocked) handleLockedNodeClick(node);
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
                whileHover={isUnlocked ? { scale: 1.25, y: -4 } : isLocked ? { scale: 1.05 } : {}}
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
                      ${isLocked ? 'bg-gray-800/60 border-2 border-gray-700/50' : ''}
                      ${isCompleted ? `bg-gradient-to-b ${style.gradient} border-2 ${style.border} map-completed-glow` : ''}
                      ${isUnlocked ? `bg-gradient-to-b ${style.gradient} border-2 ${style.border} cursor-pointer` : ''}
                    `}
                    style={isUnlocked ? { color: style.glow } : {}}
                  >
                    {isLocked ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <Lock className="w-4 h-4 text-gray-600" />
                        <div className="w-5 h-[1px] rounded bg-gray-700" />
                      </div>
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

                    {isLocked && (
                      <div
                        className="absolute inset-0 rounded-2xl opacity-40"
                        style={{
                          background: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)`,
                        }}
                      />
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
                      transition={{ delay: index * 0.06 + 0.3 }}
                      className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    >
                      <span className="text-white text-[10px] sm:text-xs font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                        {node.type === 'boss' ? boss.chineseName : getNodeLabel(node.type)}
                        {node.type === 'treasure' && node.reward ? ` +${node.reward}` : ''}
                      </span>
                    </motion.div>
                  )}

                  {isLocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.06 + 0.4 }}
                      className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-0.5 opacity-30">
                        <Eye className="w-2.5 h-2.5 text-white" />
                        <span className="text-white text-[8px] font-medium">tap</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}

          {currentNode && (
            <PlayerAvatar x={currentNode.position.x} y={currentNode.position.y} />
          )}
        </div>

        <AnimatePresence>
          {previewNode && (
            <NodePreviewTooltip
              node={previewNode}
              onClose={() => setPreviewNode(null)}
            />
          )}
        </AnimatePresence>

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
