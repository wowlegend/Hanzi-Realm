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
