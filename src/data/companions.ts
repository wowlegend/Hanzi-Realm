import { Companion } from '../types';

export const allCompanions: Companion[] = [
  {
    id: 'panda',
    name: 'Pixel Panda',
    emoji: '🐼',
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'tiger',
    name: 'Byte Tiger',
    emoji: '🐯',
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'rabbit',
    name: 'Moon Rabbit',
    emoji: '🐰',
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'monkey',
    name: 'Code Monkey',
    emoji: '🐵',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'phoenix',
    name: 'Fire Phoenix',
    emoji: '🔥',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'turtle',
    name: 'Wise Turtle',
    emoji: '🐢',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'dragon',
    name: 'Azure Dragon',
    emoji: '🐉',
    rarity: 'legendary',
    unlocked: false,
  },
  {
    id: 'mech',
    name: 'Mech Warrior',
    emoji: '🤖',
    rarity: 'legendary',
    unlocked: false,
  },
  {
    id: 'unicorn',
    name: 'Cyber Unicorn',
    emoji: '🦄',
    rarity: 'legendary',
    unlocked: false,
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
