import { memo } from 'react';
import { motion } from 'framer-motion';
import { Companion } from '../types';
import { getRarityColor, getBuffDescription, getCompanionTheme } from '../data/companions';

interface CompanionDisplayProps {
  companion: Companion | null;
  isHappy?: boolean;
}

function CompanionSprite({ id, size = 64 }: { id: string; size?: number }) {
  const theme = getCompanionTheme(id);

  if (theme === 'jjk') return <JJKSprite id={id} size={size} />;
  if (theme === 'minecraft') return <MinecraftSprite id={id} size={size} />;
  return <RobloxSprite id={id} size={size} />;
}

function JJKSprite({ id, size }: { id: string; size: number }) {
  if (id === 'sukuna') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <radialGradient id="sukuna-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#sukuna-aura)" />
        <rect x="18" y="12" width="28" height="32" rx="10" fill="#2a1a1a" />
        <rect x="20" y="38" width="24" height="18" rx="6" fill="#1a0a0a" />
        <rect x="22" y="8" width="8" height="8" rx="2" fill="#ff4444" opacity="0.8" />
        <rect x="34" y="8" width="8" height="8" rx="2" fill="#ff4444" opacity="0.8" />
        <circle cx="26" cy="24" r="4" fill="#110000" />
        <circle cx="38" cy="24" r="4" fill="#110000" />
        <circle cx="27" cy="23" r="2" fill="#ff2222" />
        <circle cx="39" cy="23" r="2" fill="#ff2222" />
        <circle cx="27.5" cy="22.5" r="0.8" fill="white" />
        <circle cx="39.5" cy="22.5" r="0.8" fill="white" />
        <circle cx="26" cy="30" r="3" fill="#110000" />
        <circle cx="38" cy="30" r="3" fill="#110000" />
        <circle cx="26.5" cy="29.5" r="1.5" fill="#ff4444" />
        <circle cx="38.5" cy="29.5" r="1.5" fill="#ff4444" />
        <line x1="24" y1="18" x2="20" y2="16" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="18" x2="44" y2="16" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 28 36 Q 32 34 36 36" fill="none" stroke="#ff4444" strokeWidth="1.5" />
      </svg>
    );
  }
  if (id === 'mahoraga') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <radialGradient id="maho-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#aa88ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#aa88ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#maho-aura)" />
        <path d="M 32 4 L 28 14 L 36 14 Z" fill="#aa88ff" />
        <circle cx="32" cy="9" r="4" fill="none" stroke="#aa88ff" strokeWidth="1.5" />
        <line x1="32" y1="5" x2="32" y2="13" stroke="#aa88ff" strokeWidth="1" />
        <line x1="28" y1="9" x2="36" y2="9" stroke="#aa88ff" strokeWidth="1" />
        <rect x="18" y="16" width="28" height="30" rx="10" fill="#1a1a2a" />
        <rect x="20" y="40" width="24" height="18" rx="6" fill="#0a0a1a" />
        <circle cx="26" cy="28" r="5" fill="#000011" />
        <circle cx="38" cy="28" r="5" fill="#000011" />
        <circle cx="27" cy="27" r="2.5" fill="#aa88ff" />
        <circle cx="39" cy="27" r="2.5" fill="#aa88ff" />
        <circle cx="27.5" cy="26.5" r="1" fill="white" />
        <circle cx="39.5" cy="26.5" r="1" fill="white" />
        <path d="M 29 36 Q 32 34 35 36" fill="none" stroke="#667" strokeWidth="1.5" />
        <line x1="14" y1="28" x2="18" y2="30" stroke="#1a1a2a" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="28" x2="46" y2="30" stroke="#1a1a2a" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'divine-dog') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <ellipse cx="32" cy="36" rx="18" ry="16" fill="#1a1a2a" />
        <path d="M 18 28 L 12 12 L 24 24" fill="#1a1a2a" stroke="#334" strokeWidth="1" />
        <path d="M 46 28 L 52 12 L 40 24" fill="#1a1a2a" stroke="#334" strokeWidth="1" />
        <path d="M 16 22 L 15 14 L 22 22" fill="#4444aa" opacity="0.5" />
        <path d="M 48 22 L 49 14 L 42 22" fill="#4444aa" opacity="0.5" />
        <circle cx="26" cy="30" r="5" fill="#0a0a15" />
        <circle cx="38" cy="30" r="5" fill="#0a0a15" />
        <circle cx="27" cy="29" r="2.5" fill="#4488ff" />
        <circle cx="39" cy="29" r="2.5" fill="#4488ff" />
        <circle cx="27.5" cy="28.5" r="1" fill="white" />
        <circle cx="39.5" cy="28.5" r="1" fill="white" />
        <ellipse cx="32" cy="38" rx="4" ry="2.5" fill="#111" />
        <path d="M 32 40.5 L 30 43 L 34 43 Z" fill="#222" />
        <path d="M 26 44 Q 29 42 32 44 Q 35 42 38 44" fill="none" stroke="#334" strokeWidth="1.5" />
        <path d="M 24 48 Q 28 56 32 52 Q 36 56 40 48" fill="none" stroke="#1a1a2a" strokeWidth="2.5" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <rect x="16" y="14" width="32" height="36" rx="12" fill="#1a2a1a" />
      <circle cx="26" cy="28" r="4" fill="#0a0a0a" />
      <circle cx="38" cy="28" r="4" fill="#0a0a0a" />
      <circle cx="27" cy="27" r="2" fill="#44ff88" />
      <circle cx="39" cy="27" r="2" fill="#44ff88" />
      <path d="M 28 36 Q 32 34 36 36" fill="none" stroke="#446" strokeWidth="1.5" />
      <rect x="22" y="46" width="8" height="12" rx="3" fill="#0a1a0a" />
      <rect x="34" y="46" width="8" height="12" rx="3" fill="#0a1a0a" />
    </svg>
  );
}

function MinecraftSprite({ id, size }: { id: string; size: number }) {
  const colors: Record<string, { body: string; eye: string; accent: string }> = {
    'noob-steve': { body: '#4a82b4', eye: '#fff', accent: '#8b6914' },
    'creeper-buddy': { body: '#44aa44', eye: '#000', accent: '#338833' },
    'ender-dragon': { body: '#1a1a2a', eye: '#cc44ff', accent: '#6622aa' },
    'wither-king': { body: '#222', eye: '#fff', accent: '#444' },
  };
  const c = colors[id] || colors['noob-steve'];

  if (id === 'creeper-buddy') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="16" y="8" width="32" height="32" fill={c.body} />
        <rect x="18" y="10" width="28" height="28" fill={c.accent} />
        <rect x="20" y="14" width="8" height="8" fill={c.eye} />
        <rect x="36" y="14" width="8" height="8" fill={c.eye} />
        <rect x="28" y="22" width="8" height="4" fill={c.eye} />
        <rect x="24" y="26" width="16" height="8" fill={c.eye} />
        <rect x="24" y="26" width="4" height="8" fill={c.eye} />
        <rect x="36" y="26" width="4" height="8" fill={c.eye} />
        <rect x="20" y="40" width="10" height="16" fill={c.body} />
        <rect x="34" y="40" width="10" height="16" fill={c.body} />
      </svg>
    );
  }
  if (id === 'ender-dragon') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="14" y="14" width="36" height="28" rx="2" fill={c.body} />
        <rect x="10" y="6" width="8" height="10" fill={c.body} />
        <rect x="46" y="6" width="8" height="10" fill={c.body} />
        <rect x="20" y="20" width="8" height="8" fill={c.accent} />
        <rect x="36" y="20" width="8" height="8" fill={c.accent} />
        <rect x="22" y="22" width="4" height="4" fill={c.eye} />
        <rect x="38" y="22" width="4" height="4" fill={c.eye} />
        <rect x="26" y="34" width="12" height="4" fill={c.accent} />
        <rect x="20" y="42" width="10" height="14" fill={c.body} />
        <rect x="34" y="42" width="10" height="14" fill={c.body} />
        <path d="M 8 30 L 2 24 L 6 32" fill={c.accent} />
        <path d="M 56 30 L 62 24 L 58 32" fill={c.accent} />
      </svg>
    );
  }
  if (id === 'wither-king') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="6" y="14" width="16" height="16" fill={c.body} />
        <rect x="24" y="10" width="16" height="20" fill={c.body} />
        <rect x="42" y="14" width="16" height="16" fill={c.body} />
        <rect x="10" y="18" width="4" height="4" fill="white" />
        <rect x="30" y="16" width="4" height="4" fill="white" />
        <rect x="46" y="18" width="4" height="4" fill="white" />
        <rect x="28" y="30" width="8" height="22" fill={c.accent} />
        <rect x="16" y="30" width="4" height="8" fill={c.accent} />
        <rect x="44" y="30" width="4" height="8" fill={c.accent} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <rect x="16" y="8" width="32" height="32" fill={c.body} />
      <rect x="16" y="8" width="32" height="16" fill={c.accent} />
      <rect x="20" y="18" width="8" height="8" fill="white" />
      <rect x="36" y="18" width="8" height="8" fill="white" />
      <rect x="22" y="20" width="4" height="4" fill="#4466aa" />
      <rect x="38" y="20" width="4" height="4" fill="#4466aa" />
      <rect x="26" y="30" width="12" height="4" fill="#cc9977" />
      <rect x="16" y="40" width="32" height="16" fill="#4a82b4" />
      <rect x="20" y="40" width="10" height="16" fill="#3a72a4" />
      <rect x="34" y="40" width="10" height="16" fill="#3a72a4" />
    </svg>
  );
}

function RobloxSprite({ id, size }: { id: string; size: number }) {
  const colors: Record<string, { body: string; accent: string }> = {
    'roblox-rookie': { body: '#4488cc', accent: '#2266aa' },
    'dominus-rex': { body: '#ffd700', accent: '#cc9900' },
    'korblox-knight': { body: '#2244aa', accent: '#001166' },
    'headless-horseman': { body: '#333', accent: '#111' },
  };
  const c = colors[id] || colors['roblox-rookie'];

  if (id === 'headless-horseman') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <circle cx="32" cy="16" r="8" fill="none" stroke="#ff6600" strokeWidth="2" strokeDasharray="3,3" />
        <rect x="20" y="22" width="24" height="24" rx="4" fill={c.body} />
        <rect x="22" y="24" width="20" height="20" fill={c.accent} />
        <rect x="18" y="46" width="12" height="14" rx="2" fill={c.body} />
        <rect x="34" y="46" width="12" height="14" rx="2" fill={c.body} />
        <line x1="12" y1="28" x2="20" y2="32" stroke={c.body} strokeWidth="3" strokeLinecap="round" />
        <line x1="52" y1="28" x2="44" y2="32" stroke={c.body} strokeWidth="3" strokeLinecap="round" />
        <circle cx="10" cy="26" r="4" fill="#ff6600" opacity="0.8" />
      </svg>
    );
  }
  if (id === 'dominus-rex') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <path d="M 16 20 L 20 4 L 28 16 L 32 2 L 36 16 L 44 4 L 48 20" fill={c.body} stroke={c.accent} strokeWidth="1" />
        <rect x="16" y="20" width="32" height="24" rx="4" fill={c.body} />
        <rect x="22" y="26" width="8" height="6" fill="#1a0a00" />
        <rect x="34" y="26" width="8" height="6" fill="#1a0a00" />
        <circle cx="26" cy="29" r="2" fill="#ff4444" />
        <circle cx="38" cy="29" r="2" fill="#ff4444" />
        <rect x="20" y="44" width="10" height="14" rx="2" fill={c.accent} />
        <rect x="34" y="44" width="10" height="14" rx="2" fill={c.accent} />
      </svg>
    );
  }
  if (id === 'korblox-knight') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <rect x="18" y="6" width="28" height="10" rx="2" fill="#667" />
        <rect x="16" y="14" width="32" height="28" rx="4" fill={c.body} />
        <rect x="18" y="16" width="28" height="24" fill={c.accent} />
        <rect x="22" y="22" width="6" height="4" fill="#4488ff" />
        <rect x="36" y="22" width="6" height="4" fill="#4488ff" />
        <path d="M 28 32 Q 32 30 36 32" fill="none" stroke="#4488ff" strokeWidth="1.5" />
        <rect x="18" y="42" width="12" height="16" rx="2" fill={c.body} />
        <rect x="34" y="42" width="12" height="16" rx="2" fill={c.body} />
        <line x1="8" y1="20" x2="16" y2="28" stroke="#667" strokeWidth="3" strokeLinecap="round" />
        <rect x="2" y="14" width="8" height="4" rx="1" fill="#aab" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <circle cx="32" cy="18" r="12" fill={c.body} />
      <circle cx="27" cy="16" r="3" fill="white" />
      <circle cx="37" cy="16" r="3" fill="white" />
      <circle cx="27" cy="16" r="1.5" fill="#222" />
      <circle cx="37" cy="16" r="1.5" fill="#222" />
      <path d="M 29 22 Q 32 24 35 22" fill="none" stroke="#222" strokeWidth="1.5" />
      <rect x="20" y="30" width="24" height="18" rx="4" fill={c.body} />
      <rect x="18" y="48" width="12" height="12" rx="2" fill={c.accent} />
      <rect x="34" y="48" width="12" height="12" rx="2" fill={c.accent} />
    </svg>
  );
}

export default memo(function CompanionDisplay({ companion, isHappy = false }: CompanionDisplayProps) {
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
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 flex items-center justify-center relative"
        >
          <CompanionSprite id={companion.id} size={64} />
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
})
