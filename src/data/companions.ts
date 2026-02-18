import { Companion, BuffType, CompanionRarity } from '../types';

export const allCompanions: Companion[] = [
  {
    id: 'noob-steve',
    name: 'Noob Steve',
    emoji: '\u{1F9D1}\u{200D}\u{1F527}',
    avatarSeed: 'noob-steve-mc-001',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 10,
  },
  {
    id: 'roblox-rookie',
    name: 'Roblox Rookie',
    emoji: '\u{1F9CA}',
    avatarSeed: 'roblox-rookie-rb-002',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 12,
  },
  {
    id: 'todo-panda',
    name: 'Todo Panda',
    emoji: '\u{1F43C}',
    avatarSeed: 'todo-panda-jjk-003',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 15,
  },
  {
    id: 'creeper-buddy',
    name: 'Creeper Buddy',
    emoji: '\u{1F7E9}',
    avatarSeed: 'creeper-buddy-mc-004',
    rarity: 'rare',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 1.5,
  },
  {
    id: 'dominus-rex',
    name: 'Dominus Rex',
    emoji: '\u{1F451}',
    avatarSeed: 'dominus-rex-rb-005',
    rarity: 'rare',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 25,
  },
  {
    id: 'divine-dog',
    name: 'Divine Dog',
    emoji: '\u{1F43A}',
    avatarSeed: 'divine-dog-jjk-006',
    rarity: 'rare',
    unlocked: false,
    buffType: 'streak_shield',
    buffValue: 1,
  },
  {
    id: 'ender-dragon',
    name: 'Ender Dragon',
    emoji: '\u{1F432}',
    avatarSeed: 'ender-dragon-mc-007',
    rarity: 'epic',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 2,
  },
  {
    id: 'korblox-knight',
    name: 'Korblox Knight',
    emoji: '\u{2694}\u{FE0F}',
    avatarSeed: 'korblox-knight-rb-008',
    rarity: 'epic',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 35,
  },
  {
    id: 'mahoraga',
    name: 'Mahoraga',
    emoji: '\u{1F4AB}',
    avatarSeed: 'mahoraga-jjk-009',
    rarity: 'epic',
    unlocked: false,
    buffType: 'streak_shield',
    buffValue: 2,
  },
  {
    id: 'wither-king',
    name: 'Wither King',
    emoji: '\u{1F480}',
    avatarSeed: 'wither-king-mc-010',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 3,
  },
  {
    id: 'headless-horseman',
    name: 'Headless Horseman',
    emoji: '\u{1F3C7}',
    avatarSeed: 'headless-horseman-rb-011',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 50,
  },
  {
    id: 'sukuna',
    name: 'Ryomen Sukuna',
    emoji: '\u{1F525}',
    avatarSeed: 'sukuna-jjk-012',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'streak_shield',
    buffValue: 3,
  },
];

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'text-gray-400 border-gray-500';
    case 'rare':
      return 'text-blue-400 border-blue-500';
    case 'epic':
      return 'text-rose-400 border-rose-500';
    case 'legendary':
      return 'text-yellow-400 border-yellow-500';
    default:
      return 'text-gray-400 border-gray-500';
  }
};

export const getRarityGlow = (rarity: string): string => {
  switch (rarity) {
    case 'epic':
      return 'shadow-[0_0_25px_rgba(244,63,94,0.5)]';
    case 'legendary':
      return 'shadow-[0_0_30px_rgba(255,215,0,0.6)]';
    default:
      return '';
  }
};

export const getRarityChance = (rarity: string): number => {
  switch (rarity) {
    case 'common':
      return 50;
    case 'rare':
      return 28;
    case 'epic':
      return 15;
    case 'legendary':
      return 7;
    default:
      return 0;
  }
};

export const getBuffDescription = (buffType: BuffType, buffValue: number): string => {
  switch (buffType) {
    case 'jade_boost':
      return `+${buffValue}% Jade on wins`;
    case 'streak_shield':
      return buffValue >= 3 ? `Immortal Streak Shield` : `Streak Shield (${buffValue}x per session)`;
    case 'combo_master':
      return `${buffValue}x streak multiplier`;
    default:
      return '';
  }
};

export const getRandomCompanionByRarity = (rarity: CompanionRarity): Companion => {
  const filtered = allCompanions.filter(c => c.rarity === rarity);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getCompanionTheme = (id: string): 'minecraft' | 'roblox' | 'jjk' => {
  if (id.includes('steve') || id.includes('creeper') || id.includes('ender') || id.includes('wither')) return 'minecraft';
  if (id.includes('roblox') || id.includes('dominus') || id.includes('korblox') || id.includes('headless')) return 'roblox';
  return 'jjk';
};
