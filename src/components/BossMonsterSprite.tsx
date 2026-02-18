import { motion } from 'framer-motion';

interface BossMonsterSpriteProps {
  bossId: string;
  color: string;
  attackColor: string;
  isAttacking: boolean;
  size?: number;
}

function NianMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <radialGradient id="nian-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id="nian-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#nian-glow)" />
      <ellipse cx="60" cy="65" rx="35" ry="30" fill="#8B0000" stroke={color} strokeWidth="2" filter="url(#nian-shadow)" />
      <ellipse cx="60" cy="70" rx="28" ry="18" fill="#6B0000" />
      <path d="M 35 50 Q 30 30 25 25 Q 28 35 32 45" fill={color} />
      <path d="M 85 50 Q 90 30 95 25 Q 92 35 88 45" fill={color} />
      <circle cx="45" cy="55" r="8" fill="#1a0000" />
      <circle cx="75" cy="55" r="8" fill="#1a0000" />
      <circle cx="47" cy="53" r="4" fill={color} />
      <circle cx="77" cy="53" r="4" fill={color} />
      <circle cx="48" cy="52" r="1.5" fill="white" />
      <circle cx="78" cy="52" r="1.5" fill="white" />
      <path d="M 45 75 Q 50 72 55 75 Q 60 78 65 75 Q 70 72 75 75" fill="none" stroke={isAttacking ? attackColor : color} strokeWidth="2" strokeLinecap="round" />
      {isAttacking && (
        <>
          <path d="M 42 78 L 38 85" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 50 80 L 48 87" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 58 81 L 58 88" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 66 80 L 68 87" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 74 78 L 78 85" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      <path d="M 30 42 Q 25 38 20 42 L 28 48" fill={attackColor} />
      <path d="M 90 42 Q 95 38 100 42 L 92 48" fill={attackColor} />
      <ellipse cx="55" cy="62" rx="2" ry="1.5" fill="#4a0000" />
      <ellipse cx="65" cy="62" rx="2" ry="1.5" fill="#4a0000" />
    </svg>
  );
}

function DragonMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="dragon-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#005588" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <filter id="dragon-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.6" />
        </filter>
      </defs>
      <path d="M 60 15 L 50 30 L 40 20 L 45 35 L 30 28 L 42 40" fill={color} opacity="0.8" />
      <path d="M 60 15 L 70 30 L 80 20 L 75 35 L 90 28 L 78 40" fill={color} opacity="0.8" />
      <ellipse cx="60" cy="58" rx="30" ry="35" fill="url(#dragon-body)" filter="url(#dragon-glow)" />
      <ellipse cx="60" cy="65" rx="22" ry="15" fill="#004466" />
      <path d="M 30 55 Q 15 50 10 55 Q 15 58 25 58" fill={color} />
      <path d="M 90 55 Q 105 50 110 55 Q 105 58 95 58" fill={color} />
      <ellipse cx="45" cy="48" rx="9" ry="7" fill="#001a33" />
      <ellipse cx="75" cy="48" rx="9" ry="7" fill="#001a33" />
      <ellipse cx="47" cy="47" rx="4" ry="5" fill={isAttacking ? attackColor : color} />
      <ellipse cx="77" cy="47" rx="4" ry="5" fill={isAttacking ? attackColor : color} />
      <circle cx="48" cy="45" r="1.5" fill="white" />
      <circle cx="78" cy="45" r="1.5" fill="white" />
      <path d="M 50 70 Q 55 65 60 70 Q 65 65 70 70" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M 55 58 L 53 60 L 57 60 Z" fill="#003355" />
      <path d="M 65 58 L 63 60 L 67 60 Z" fill="#003355" />
      {isAttacking && (
        <>
          <line x1="60" y1="90" x2="55" y2="105" stroke={attackColor} strokeWidth="2" opacity="0.8" />
          <line x1="60" y1="90" x2="65" y2="105" stroke={attackColor} strokeWidth="2" opacity="0.8" />
          <line x1="60" y1="90" x2="60" y2="108" stroke={attackColor} strokeWidth="2" opacity="0.8" />
        </>
      )}
      <path d="M 35 85 Q 40 95 50 90 Q 55 100 60 90 Q 65 100 70 90 Q 80 95 85 85" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

function TigerMonster({ color, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="tiger-fur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <filter id="tiger-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(255,255,255,0.5)" />
        </filter>
      </defs>
      <path d="M 25 40 L 15 15 L 35 30 Z" fill="#e0e0e0" stroke="#888" strokeWidth="1" />
      <path d="M 95 40 L 105 15 L 85 30 Z" fill="#e0e0e0" stroke="#888" strokeWidth="1" />
      <path d="M 22 30 L 25 18 L 32 28" fill="#ffcccc" />
      <path d="M 98 30 L 95 18 L 88 28" fill="#ffcccc" />
      <ellipse cx="60" cy="60" rx="38" ry="35" fill="url(#tiger-fur)" filter="url(#tiger-shadow)" />
      <path d="M 45 40 Q 50 35 55 40" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 65 40 Q 70 35 75 40" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 50 35 L 55 30 L 48 32" stroke="#333" strokeWidth="2" fill="none" />
      <path d="M 70 35 L 65 30 L 72 32" stroke="#333" strokeWidth="2" fill="none" />
      <circle cx="48" cy="50" r="6" fill="#222" />
      <circle cx="72" cy="50" r="6" fill="#222" />
      <circle cx="50" cy="48" r="2.5" fill={isAttacking ? '#ff4444' : color} />
      <circle cx="74" cy="48" r="2.5" fill={isAttacking ? '#ff4444' : color} />
      <circle cx="51" cy="47" r="1" fill="white" />
      <circle cx="75" cy="47" r="1" fill="white" />
      <ellipse cx="60" cy="60" rx="5" ry="3" fill="#ffb3b3" />
      <path d="M 60 63 L 58 66 L 62 66 Z" fill="#ff8888" />
      <path d="M 48 70 Q 54 66 60 70 Q 66 66 72 70" fill="none" stroke="#333" strokeWidth="1.5" />
      {isAttacking && (
        <>
          <path d="M 30 75 L 15 85 M 30 75 L 18 78 M 30 75 L 20 90" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 90 75 L 105 85 M 90 75 L 102 78 M 90 75 L 100 90" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      <path d="M 38 55 Q 42 52 46 55" stroke="#555" strokeWidth="1.5" fill="none" />
      <path d="M 74 55 Q 78 52 82 55" stroke="#555" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function PhoenixMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="phoenix-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6600" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#ffcc00" />
        </linearGradient>
        <filter id="phoenix-fire">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <path d="M 60 5 Q 55 20 45 15 Q 50 25 40 22 Q 48 32 42 35" fill="#ffcc00" opacity="0.7" />
      <path d="M 60 5 Q 65 20 75 15 Q 70 25 80 22 Q 72 32 78 35" fill="#ffcc00" opacity="0.7" />
      <path d="M 60 8 Q 58 18 55 20 Q 60 22 60 15 Q 60 22 65 20 Q 62 18 60 8" fill={attackColor} />
      <ellipse cx="60" cy="55" rx="25" ry="28" fill="url(#phoenix-body)" />
      <ellipse cx="60" cy="62" rx="18" ry="14" fill="#cc5500" />
      <path d="M 20 50 Q 10 35 5 45 Q 15 42 22 48" fill={color} />
      <path d="M 15 55 Q 5 50 0 55 Q 10 55 18 55" fill="#ffaa00" />
      <path d="M 100 50 Q 110 35 115 45 Q 105 42 98 48" fill={color} />
      <path d="M 105 55 Q 115 50 120 55 Q 110 55 102 55" fill="#ffaa00" />
      <ellipse cx="50" cy="48" rx="6" ry="5" fill="#331100" />
      <ellipse cx="70" cy="48" rx="6" ry="5" fill="#331100" />
      <circle cx="51" cy="47" r="3" fill={isAttacking ? '#fff' : attackColor} />
      <circle cx="71" cy="47" r="3" fill={isAttacking ? '#fff' : attackColor} />
      <circle cx="52" cy="46" r="1" fill="white" />
      <circle cx="72" cy="46" r="1" fill="white" />
      <path d="M 55 58 L 60 55 L 65 58" fill="#ffcc00" stroke="#cc8800" strokeWidth="1" />
      <path d="M 40 80 Q 45 95 55 90 Q 60 100 65 90 Q 75 95 80 80" fill="none" stroke={isAttacking ? attackColor : color} strokeWidth="2.5" filter={isAttacking ? 'url(#phoenix-fire)' : undefined} />
      {isAttacking && (
        <>
          <ellipse cx="60" cy="100" rx="15" ry="8" fill={attackColor} opacity="0.4" filter="url(#phoenix-fire)" />
          <ellipse cx="60" cy="95" rx="10" ry="5" fill="#ffcc00" opacity="0.6" filter="url(#phoenix-fire)" />
        </>
      )}
    </svg>
  );
}

function TortoiseMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="shell-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a3a4a" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="65" rx="42" ry="30" fill="url(#shell-grad)" stroke={color} strokeWidth="2" />
      <path d="M 30 55 Q 45 40 60 38 Q 75 40 90 55" fill="none" stroke={attackColor} strokeWidth="1.5" opacity="0.5" />
      <path d="M 35 65 Q 47 50 60 48 Q 73 50 85 65" fill="none" stroke={attackColor} strokeWidth="1.5" opacity="0.5" />
      <line x1="60" y1="38" x2="60" y2="90" stroke={attackColor} strokeWidth="1" opacity="0.3" />
      <line x1="38" y1="50" x2="82" y2="80" stroke={attackColor} strokeWidth="1" opacity="0.3" />
      <line x1="82" y1="50" x2="38" y2="80" stroke={attackColor} strokeWidth="1" opacity="0.3" />
      <ellipse cx="60" cy="35" rx="15" ry="12" fill="#0a2a3a" stroke={color} strokeWidth="1.5" />
      <circle cx="54" cy="32" r="4" fill="#001a2a" />
      <circle cx="66" cy="32" r="4" fill="#001a2a" />
      <circle cx="55" cy="31" r="2" fill={isAttacking ? attackColor : color} />
      <circle cx="67" cy="31" r="2" fill={isAttacking ? attackColor : color} />
      <circle cx="55.5" cy="30.5" r="0.8" fill="white" />
      <circle cx="67.5" cy="30.5" r="0.8" fill="white" />
      <path d="M 57 38 Q 60 36 63 38" fill="none" stroke={color} strokeWidth="1" />
      <ellipse cx="25" cy="75" rx="8" ry="5" fill="#0a2a3a" stroke={color} strokeWidth="1" />
      <ellipse cx="95" cy="75" rx="8" ry="5" fill="#0a2a3a" stroke={color} strokeWidth="1" />
      <ellipse cx="45" cy="92" rx="7" ry="4" fill="#0a2a3a" stroke={color} strokeWidth="1" />
      <ellipse cx="75" cy="92" rx="7" ry="4" fill="#0a2a3a" stroke={color} strokeWidth="1" />
      <path d="M 55 95 Q 60 100 65 95" fill="#0a2a3a" stroke={color} strokeWidth="1" />
      {isAttacking && (
        <>
          <circle cx="60" cy="65" r="35" fill="none" stroke={attackColor} strokeWidth="2" opacity="0.4" />
          <circle cx="60" cy="65" r="45" fill="none" stroke={attackColor} strokeWidth="1" opacity="0.2" />
        </>
      )}
    </svg>
  );
}

function QilinMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="qilin-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8860b" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#daa520" />
        </linearGradient>
        <filter id="qilin-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.6" />
        </filter>
      </defs>
      <path d="M 55 10 Q 50 5 52 0 Q 55 8 58 5 Q 56 12 55 10" fill={color} />
      <path d="M 65 10 Q 70 5 68 0 Q 65 8 62 5 Q 64 12 65 10" fill={color} />
      <path d="M 58 5 L 60 15 L 62 5" fill={attackColor} opacity="0.6" />
      <ellipse cx="60" cy="50" rx="28" ry="30" fill="url(#qilin-body)" filter="url(#qilin-glow)" />
      <path d="M 40 35 Q 35 28 30 32 Q 36 33 38 38" fill={attackColor} />
      <path d="M 80 35 Q 85 28 90 32 Q 84 33 82 38" fill={attackColor} />
      <ellipse cx="60" cy="58" rx="20" ry="12" fill="#8B6914" />
      <circle cx="48" cy="42" r="6" fill="#3a2a00" />
      <circle cx="72" cy="42" r="6" fill="#3a2a00" />
      <circle cx="49" cy="41" r="3" fill={isAttacking ? '#fff' : color} />
      <circle cx="73" cy="41" r="3" fill={isAttacking ? '#fff' : color} />
      <circle cx="50" cy="40" r="1" fill="white" />
      <circle cx="74" cy="40" r="1" fill="white" />
      <ellipse cx="60" cy="52" rx="3" ry="2" fill="#5a4a00" />
      <path d="M 52 62 Q 56 58 60 62 Q 64 58 68 62" fill="none" stroke="#5a4a00" strokeWidth="1.5" />
      <path d="M 35 70 Q 38 85 45 80" fill="none" stroke={color} strokeWidth="2" />
      <path d="M 85 70 Q 82 85 75 80" fill="none" stroke={color} strokeWidth="2" />
      <path d="M 45 80 Q 50 95 55 88 Q 58 95 60 90 Q 62 95 65 88 Q 70 95 75 80" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {isAttacking && (
        <>
          <circle cx="30" cy="20" r="3" fill={attackColor} opacity="0.7" />
          <circle cx="90" cy="25" r="2.5" fill={attackColor} opacity="0.5" />
          <circle cx="20" cy="45" r="2" fill={attackColor} opacity="0.6" />
          <circle cx="100" cy="40" r="2" fill={attackColor} opacity="0.6" />
        </>
      )}
    </svg>
  );
}

function PixiuMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="pixiu-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5522aa" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d="M 40 30 Q 35 15 30 20 Q 38 22 40 30" fill={attackColor} />
      <path d="M 80 30 Q 85 15 90 20 Q 82 22 80 30" fill={attackColor} />
      <ellipse cx="60" cy="55" rx="32" ry="30" fill="url(#pixiu-body)" />
      <ellipse cx="60" cy="62" rx="22" ry="14" fill="#3a1177" />
      <path d="M 25 50 Q 15 45 12 52 Q 20 50 28 52" fill={color} />
      <path d="M 95 50 Q 105 45 108 52 Q 100 50 92 52" fill={color} />
      <circle cx="47" cy="45" r="7" fill="#1a0044" />
      <circle cx="73" cy="45" r="7" fill="#1a0044" />
      <circle cx="49" cy="44" r="3.5" fill={isAttacking ? attackColor : color} />
      <circle cx="75" cy="44" r="3.5" fill={isAttacking ? attackColor : color} />
      <circle cx="50" cy="43" r="1.2" fill="white" />
      <circle cx="76" cy="43" r="1.2" fill="white" />
      <path d="M 50 65 Q 55 60 60 63 Q 65 60 70 65" fill="none" stroke={attackColor} strokeWidth="2" />
      <circle cx="60" cy="55" r="4" fill="#2a0066" stroke={attackColor} strokeWidth="1" />
      <path d="M 35 78 Q 40 90 50 85 Q 55 92 60 85 Q 65 92 70 85 Q 80 90 85 78" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      {isAttacking && (
        <>
          <circle cx="25" cy="30" r="4" fill={attackColor} opacity="0.3" />
          <circle cx="95" cy="35" r="3" fill={attackColor} opacity="0.3" />
          <circle cx="15" cy="60" r="3.5" fill={attackColor} opacity="0.25" />
          <circle cx="105" cy="55" r="3" fill={attackColor} opacity="0.25" />
        </>
      )}
    </svg>
  );
}

function JiangshiMonster({ color, attackColor, isAttacking }: { color: string; attackColor: string; isAttacking: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="jiangshi-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a4a2a" />
          <stop offset="100%" stopColor="#0a2a1a" />
        </linearGradient>
      </defs>
      <rect x="38" y="8" width="44" height="18" rx="3" fill="#ffdd44" stroke="#cc9900" strokeWidth="1.5" />
      <line x1="45" y1="12" x2="75" y2="12" stroke="#cc0000" strokeWidth="1.5" />
      <line x1="48" y1="16" x2="72" y2="16" stroke="#cc0000" strokeWidth="1" />
      <line x1="50" y1="20" x2="70" y2="20" stroke="#cc0000" strokeWidth="1" />
      <rect x="35" y="25" width="50" height="45" rx="8" fill="url(#jiangshi-body)" stroke={color} strokeWidth="1.5" />
      <circle cx="48" cy="42" r="7" fill="#0a1a0a" />
      <circle cx="72" cy="42" r="7" fill="#0a1a0a" />
      <circle cx="49" cy="41" r="3.5" fill={isAttacking ? attackColor : color} />
      <circle cx="73" cy="41" r="3.5" fill={isAttacking ? attackColor : color} />
      <circle cx="50" cy="40" r="1.2" fill="white" />
      <circle cx="74" cy="40" r="1.2" fill="white" />
      <path d="M 53 55 Q 60 50 67 55" fill="#0a1a0a" stroke={color} strokeWidth="1" />
      <line x1="56" y1="53" x2="56" y2="58" stroke="white" strokeWidth="1.5" />
      <line x1="64" y1="53" x2="64" y2="58" stroke="white" strokeWidth="1.5" />
      <line x1="22" y1="35" x2="22" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="35" x2="35" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="98" y1="35" x2="98" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="98" y1="35" x2="85" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <rect x="40" y="72" width="18" height="35" rx="4" fill="#0a2a1a" stroke={color} strokeWidth="1" />
      <rect x="62" y="72" width="18" height="35" rx="4" fill="#0a2a1a" stroke={color} strokeWidth="1" />
      {isAttacking && (
        <>
          <line x1="60" y1="108" x2="55" y2="115" stroke={attackColor} strokeWidth="2" opacity="0.6" />
          <line x1="60" y1="108" x2="65" y2="115" stroke={attackColor} strokeWidth="2" opacity="0.6" />
          <line x1="60" y1="108" x2="60" y2="118" stroke={attackColor} strokeWidth="2" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

const BOSS_SPRITES: Record<string, React.FC<{ color: string; attackColor: string; isAttacking: boolean }>> = {
  nian: NianMonster,
  dragon: DragonMonster,
  tiger: TigerMonster,
  phoenix: PhoenixMonster,
  turtle: TortoiseMonster,
  qilin: QilinMonster,
  pixiu: PixiuMonster,
  jiangshi: JiangshiMonster,
};

export default function BossMonsterSprite({ bossId, color, attackColor, isAttacking, size = 180 }: BossMonsterSpriteProps) {
  const SpriteComponent = BOSS_SPRITES[bossId];

  if (!SpriteComponent) {
    return (
      <div
        className="flex items-center justify-center font-black select-none"
        style={{ width: size, height: size, color, fontSize: size * 0.7 }}
      >
        ?
      </div>
    );
  }

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={isAttacking ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, repeat: isAttacking ? Infinity : 0 }}
    >
      <SpriteComponent color={color} attackColor={attackColor} isAttacking={isAttacking} />
    </motion.div>
  );
}
