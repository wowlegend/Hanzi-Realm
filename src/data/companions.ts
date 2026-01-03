import { Companion, BuffType } from '../types';

export const allCompanions: Companion[] = [
  {
    id: 'panda',
    name: 'Pixel Panda',
    emoji: '?',
    avatarSeed: 'panda-companion',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 15,
  },
  {
    id: 'tiger',
    name: 'Byte Tiger',
    emoji: '?',
    avatarSeed: 'tiger-companion',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 15,
  },
  {
    id: 'rabbit',
    name: 'Moon Rabbit',
    emoji: '?',
    avatarSeed: 'rabbit-companion',
    rarity: 'common',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 10,
  },
  {
    id: 'monkey',
    name: 'Code Monkey',
    emoji: '?',
    avatarSeed: 'monkey-companion',
    rarity: 'rare',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 1.5,
  },
  {
    id: 'phoenix',
    name: 'Fire Phoenix',
    emoji: '?',
    avatarSeed: 'phoenix-companion',
    rarity: 'rare',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 25,
  },
  {
    id: 'turtle',
    name: 'Wise Turtle',
    emoji: '?',
    avatarSeed: 'turtle-companion',
    rarity: 'rare',
    unlocked: false,
    buffType: 'streak_shield',
    buffValue: 1,
  },
  {
    id: 'dragon',
    name: 'Azure Dragon',
    emoji: '?',
    avatarSeed: 'dragon-companion',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'combo_master',
    buffValue: 2,
  },
  {
    id: 'mech',
    name: 'Mech Warrior',
    emoji: '?',
    avatarSeed: 'mech-companion',
    rarity: 'legendary',
    unlocked: false,
    buffType: 'jade_boost',
    buffValue: 50,
  },
  {
    id: 'unicorn',
    name: 'Cyber Unicorn',
    emoji: '?',
    avatarSeed: 'unicorn-companion',
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
