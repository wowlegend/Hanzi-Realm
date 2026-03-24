export interface Boss {
  id: string;
  name: string;
  chineseName: string;
  character: string;
  color: string;
  bgGradient: string;
  attackSound: string;
  attackName: string;
  attackColor: string;
  description: string;
}

export const BOSSES: Boss[] = [
  {
    id: 'nian',
    name: 'Nian Monster',
    chineseName: '年兽',
    character: '年',
    color: '#ff4444',
    bgGradient: 'from-red-900 via-red-700 to-orange-600',
    attackSound: 'roar',
    attackName: 'Lunar Roar',
    attackColor: '#ff6b35',
    description: 'The legendary beast that fears red and loud noises!',
  },
  {
    id: 'dragon',
    name: 'Azure Dragon',
    chineseName: '青龙',
    character: '龙',
    color: '#00aaff',
    bgGradient: 'from-blue-900 via-cyan-700 to-teal-600',
    attackSound: 'thunder',
    attackName: 'Thunder Strike',
    attackColor: '#00d4ff',
    description: 'Guardian of the East, master of storms!',
  },
  {
    id: 'tiger',
    name: 'White Tiger',
    chineseName: '白虎',
    character: '虎',
    color: '#ffffff',
    bgGradient: 'from-gray-800 via-gray-600 to-white',
    attackSound: 'slash',
    attackName: 'Claw Slash',
    attackColor: '#ffffff',
    description: 'Guardian of the West, fierce and powerful!',
  },
  {
    id: 'phoenix',
    name: 'Vermillion Phoenix',
    chineseName: '朱雀',
    character: '凤',
    color: '#ff8800',
    bgGradient: 'from-orange-900 via-red-600 to-yellow-500',
    attackSound: 'fire',
    attackName: 'Phoenix Flame',
    attackColor: '#ffaa00',
    description: 'Guardian of the South, reborn from ashes!',
  },
  {
    id: 'turtle',
    name: 'Black Tortoise',
    chineseName: '玄武',
    character: '龟',
    color: '#004466',
    bgGradient: 'from-slate-900 via-blue-900 to-cyan-800',
    attackSound: 'wave',
    attackName: 'Tidal Wave',
    attackColor: '#0088aa',
    description: 'Guardian of the North, ancient and wise!',
  },
  {
    id: 'qilin',
    name: 'Qilin',
    chineseName: '麒麟',
    character: '麟',
    color: '#ffd700',
    bgGradient: 'from-yellow-900 via-amber-600 to-yellow-400',
    attackSound: 'magic',
    attackName: 'Golden Light',
    attackColor: '#ffdd44',
    description: 'The auspicious beast of good fortune!',
  },
  {
    id: 'pixiu',
    name: 'Pixiu',
    chineseName: '貔貅',
    character: '貅',
    color: '#8844ff',
    bgGradient: 'from-purple-900 via-violet-700 to-pink-600',
    attackSound: 'magic',
    attackName: 'Fortune Drain',
    attackColor: '#aa66ff',
    description: 'The treasure guardian that only takes, never gives!',
  },
  {
    id: 'jiangshi',
    name: 'Jiangshi',
    chineseName: '僵尸',
    character: '僵',
    color: '#00ff88',
    bgGradient: 'from-green-900 via-emerald-700 to-teal-600',
    attackSound: 'hop',
    attackName: 'Hopping Strike',
    attackColor: '#00ff66',
    description: 'The hopping vampire of Chinese legend!',
  },
];

export function getRandomBoss(): Boss {
  return BOSSES[Math.floor(Math.random() * BOSSES.length)];
}

export function getBossForWorld(worldNumber: number): Boss {
  const index = (worldNumber - 1) % BOSSES.length;
  return BOSSES[index];
}

export function getBossById(id: string): Boss | undefined {
  return BOSSES.find(b => b.id === id);
}

export interface BossTier {
  hp: number;
  timer: number;
  jadePerHit: number;
  lootJadeMin: number;
  lootJadeMax: number;
  companionChance: number;
  label: string;
}

export function getBossTier(worldNumber: number): BossTier {
  const ngPlus = getNewGamePlusLevel(worldNumber);
  const cycle = ((worldNumber - 1) % 8) + 1;

  let base: BossTier;
  if (cycle <= 2) base = { hp: 3, timer: 45, jadePerHit: 800, lootJadeMin: 500, lootJadeMax: 900, companionChance: 35, label: 'Normal' };
  else if (cycle <= 4) base = { hp: 4, timer: 40, jadePerHit: 1000, lootJadeMin: 800, lootJadeMax: 1300, companionChance: 40, label: 'Hard' };
  else if (cycle <= 6) base = { hp: 5, timer: 35, jadePerHit: 1300, lootJadeMin: 1200, lootJadeMax: 1800, companionChance: 45, label: 'Elite' };
  else base = { hp: 6, timer: 30, jadePerHit: 1600, lootJadeMin: 1800, lootJadeMax: 2500, companionChance: 50, label: 'Legendary' };

  if (ngPlus > 0) {
    base.hp += ngPlus;
    base.timer = Math.max(15, base.timer - ngPlus * 3);
    base.jadePerHit += ngPlus * 200;
    base.lootJadeMin += ngPlus * 300;
    base.lootJadeMax += ngPlus * 500;
    base.companionChance = Math.min(80, base.companionChance + ngPlus * 5);
    base.label = `NG+${ngPlus} ${base.label}`;
  }

  return base;
}

export function getNewGamePlusLevel(worldNumber: number): number {
  return Math.floor((worldNumber - 1) / 8);
}

export type PathShape = 'sine' | 'zigzag' | 'spiral' | 'cascade' | 'diamond' | 'serpentine' | 'staircase' | 'vortex';

export interface WorldTheme {
  name: string;
  subtitle: string;
  nodeCount: number;
  pathShape: PathShape;
  colors: { primary: string; secondary: string; accent: string };
}

export const WORLD_THEMES: WorldTheme[] = [
  { name: 'Bamboo Forest', subtitle: 'Where silence teaches', nodeCount: 10, pathShape: 'sine', colors: { primary: '#2d5016', secondary: '#4a7c23', accent: '#8fbc3f' } },
  { name: 'Storm Peak', subtitle: 'Lightning forges the brave', nodeCount: 11, pathShape: 'cascade', colors: { primary: '#1a3a4a', secondary: '#2d6987', accent: '#5bb8d9' } },
  { name: 'Jade Temple', subtitle: 'Ancient wisdom awaits', nodeCount: 12, pathShape: 'spiral', colors: { primary: '#1a4a3a', secondary: '#2d8760', accent: '#5bd9a0' } },
  { name: 'Crimson Desert', subtitle: 'Only the focused survive', nodeCount: 13, pathShape: 'diamond', colors: { primary: '#4a1a1a', secondary: '#873b2d', accent: '#d95b5b' } },
  { name: 'Frozen Summit', subtitle: 'Patience reveals the path', nodeCount: 11, pathShape: 'serpentine', colors: { primary: '#1a2a4a', secondary: '#4a7ab0', accent: '#a0c4e8' } },
  { name: 'Shadow Caverns', subtitle: 'Knowledge lights the dark', nodeCount: 14, pathShape: 'vortex', colors: { primary: '#1a1a2a', secondary: '#3a3a5a', accent: '#7a7ab0' } },
  { name: 'Golden Palace', subtitle: 'The final trial begins', nodeCount: 12, pathShape: 'staircase', colors: { primary: '#4a3a1a', secondary: '#b08f2d', accent: '#ffd700' } },
  { name: 'Dragon Abyss', subtitle: 'Master all or fall', nodeCount: 15, pathShape: 'zigzag', colors: { primary: '#2a1a1a', secondary: '#5a2d2d', accent: '#ff4444' } },
];

export function getWorldTheme(worldNumber: number): WorldTheme {
  const index = (worldNumber - 1) % WORLD_THEMES.length;
  return WORLD_THEMES[index];
}
