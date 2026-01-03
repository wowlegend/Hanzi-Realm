import { Companion, BuffType } from '../types';

export const allCompanions: Companion[] = [
  {
    id: 'panda',
    name: 'Pixel Panda',
    emoji: '\u{1F43C}',
    avatarSeed: 'panda-companion-001',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 15,
  },
  {
    id: 'tiger',
    name: 'Byte Tiger',
    emoji: '\u{1F42F}',
    avatarSeed: 'tiger-companion-002',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 15,
  },
  {
    id: 'rabbit',
    name: 'Moon Rabbit',
    emoji: '\u{1F430}',
    avatarSeed: 'rabbit-companion-003',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 10,
  },
  {
    id: 'monkey',
    name: 'Code Monkey',
    emoji: '\u{1F435}',
    avatarSeed: 'monkey-companion-004',
    rarity: 'rare',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 1.5,
  },
  {
    id: 'phoenix',
    name: 'Fire Phoenix',
    emoji: '\u{1F426}\u{200D}\u{1F525}',
    avatarSeed: 'phoenix-companion-005',
    rarity: 'rare',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 25,
  },
  {
    id: 'turtle',
    name: 'Wise Turtle',
    emoji: '\u{1F422}',
    avatarSeed: 'turtle-companion-006',
    rarity: 'rare',
    unlocked: false,
    buffType: 'streak_shield',
    buffValue: 1,
  },
  {
    id: 'dragon',
    name: 'Azure Dragon',
    emoji: '\u{1F409}',
    avatarSeed: 'dragon-companion-007',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 2,
  },
  {
    id: 'mech',
    name: 'Mech Warrior',
    emoji: '\u{1F916}',
    avatarSeed: 'mech-companion-008',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 50,
  },
  {
    id: 'unicorn',
    name: 'Cyber Unicorn',
    emoji: '\u{1F984}',
    avatarSeed: 'unicorn-companion-009',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'streak_shield',
    buffValue: 2,
  },
];

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'text-gray-400 border-gray-500';
    case 'rare':
      return 'text-blue-400 border-blue-500';
    case 'legendary':
      return 'text-yellow-400 border-yellow-500';
    default:
      return 'text-gray-400 border-gray-500';
  }
};

export const getRarityChance = (rarity: string): number => {
  switch (rarity) {
    case 'common':
      return 60;
    case 'rare':
      return 30;
    case 'legendary':
      return 10;
    default:
      return 0;
  }
};

export const getBuffDescription = (buffType: BuffType, buffValue: number): string => {
  switch (buffType) {
    case 'jade_boost':
      return `+${buffValue}% Jade on wins`;
    case 'streak_shield':
      return `Streak Shield (${buffValue}x per session)`;
    case 'combo_master':
      return `${buffValue}x faster streak multiplier`;
    default:
      return '';
  }
};

export const getRandomCompanionByRarity = (rarity: 'common' | 'rare' | 'legendary'): Companion => {
  const filtered = allCompanions.filter(c => c.rarity === rarity);
  return filtered[Math.floor(Math.random() * filtered.length)];
};
