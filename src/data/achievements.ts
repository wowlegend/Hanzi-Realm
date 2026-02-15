export interface Achievement {
  id: string;
  title: string;
  titleCn: string;
  description: string;
  category: 'learning' | 'streak' | 'combat' | 'collection';
  jadeReward: number;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  questionsAnswered: number;
  bestStreak: number;
  bossesDefeated: number;
  wordsLearned: number;
  worldNumber: number;
  jade: number;
  daysPlayed: number;
  consecutiveDays: number;
}

const STORAGE_KEY = 'hanzi_achievements';

function getUnlockedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveUnlockedIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Step', titleCn: '第一步', description: 'Answer your first question', category: 'learning', jadeReward: 50, condition: (s) => s.questionsAnswered >= 1 },
  { id: 'scholar_10', title: 'Young Scholar', titleCn: '小学者', description: 'Answer 10 questions', category: 'learning', jadeReward: 100, condition: (s) => s.questionsAnswered >= 10 },
  { id: 'scholar_50', title: 'Rising Scholar', titleCn: '学者', description: 'Answer 50 questions', category: 'learning', jadeReward: 250, condition: (s) => s.questionsAnswered >= 50 },
  { id: 'scholar_100', title: 'Grand Scholar', titleCn: '大学者', description: 'Answer 100 questions', category: 'learning', jadeReward: 500, condition: (s) => s.questionsAnswered >= 100 },
  { id: 'scholar_500', title: 'Sage', titleCn: '圣人', description: 'Answer 500 questions', category: 'learning', jadeReward: 1500, condition: (s) => s.questionsAnswered >= 500 },

  { id: 'streak_5', title: 'Hot Streak', titleCn: '连胜', description: 'Get a 5 answer streak', category: 'streak', jadeReward: 100, condition: (s) => s.bestStreak >= 5 },
  { id: 'streak_10', title: 'On Fire', titleCn: '火力全开', description: 'Get a 10 answer streak', category: 'streak', jadeReward: 300, condition: (s) => s.bestStreak >= 10 },
  { id: 'streak_20', title: 'Unstoppable', titleCn: '势不可挡', description: 'Get a 20 answer streak', category: 'streak', jadeReward: 800, condition: (s) => s.bestStreak >= 20 },
  { id: 'streak_50', title: 'Legendary', titleCn: '传奇', description: 'Get a 50 answer streak', category: 'streak', jadeReward: 2000, condition: (s) => s.bestStreak >= 50 },

  { id: 'boss_1', title: 'Boss Slayer', titleCn: '斗士', description: 'Defeat your first boss', category: 'combat', jadeReward: 200, condition: (s) => s.bossesDefeated >= 1 },
  { id: 'boss_5', title: 'Dragon Hunter', titleCn: '猎龙者', description: 'Defeat 5 bosses', category: 'combat', jadeReward: 500, condition: (s) => s.bossesDefeated >= 5 },
  { id: 'boss_10', title: 'Demon King', titleCn: '魔王', description: 'Defeat 10 bosses', category: 'combat', jadeReward: 1000, condition: (s) => s.bossesDefeated >= 10 },
  { id: 'world_2', title: 'Explorer', titleCn: '探索者', description: 'Reach World 2', category: 'combat', jadeReward: 200, condition: (s) => s.worldNumber >= 2 },
  { id: 'world_5', title: 'Adventurer', titleCn: '冒险家', description: 'Reach World 5', category: 'combat', jadeReward: 800, condition: (s) => s.worldNumber >= 5 },

  { id: 'vocab_10', title: 'Word Collector', titleCn: '集字', description: 'Learn 10 characters', category: 'collection', jadeReward: 100, condition: (s) => s.wordsLearned >= 10 },
  { id: 'vocab_50', title: 'Lexicon Builder', titleCn: '词典', description: 'Learn 50 characters', category: 'collection', jadeReward: 500, condition: (s) => s.wordsLearned >= 50 },
  { id: 'vocab_100', title: 'Word Master', titleCn: '字圣', description: 'Learn 100 characters', category: 'collection', jadeReward: 1000, condition: (s) => s.wordsLearned >= 100 },
  { id: 'vocab_200', title: 'Living Dictionary', titleCn: '活字典', description: 'Learn 200 characters', category: 'collection', jadeReward: 2000, condition: (s) => s.wordsLearned >= 200 },

  { id: 'jade_1000', title: 'Jade Hoarder', titleCn: '玉收藏', description: 'Accumulate 1000 Jade', category: 'collection', jadeReward: 100, condition: (s) => s.jade >= 1000 },
  { id: 'jade_5000', title: 'Jade Tycoon', titleCn: '玉大亨', description: 'Accumulate 5000 Jade', category: 'collection', jadeReward: 500, condition: (s) => s.jade >= 5000 },
  { id: 'jade_10000', title: 'Jade Emperor', titleCn: '玉皇', description: 'Accumulate 10000 Jade', category: 'collection', jadeReward: 1000, condition: (s) => s.jade >= 10000 },

  { id: 'daily_7', title: 'Dedicated', titleCn: '坚持', description: 'Play 7 days in a row', category: 'streak', jadeReward: 1000, condition: (s) => s.consecutiveDays >= 7 },
];

export function checkAchievements(stats: AchievementStats): Achievement[] {
  const unlocked = getUnlockedIds();
  const newlyUnlocked: Achievement[] = [];

  for (const a of ACHIEVEMENTS) {
    if (unlocked.has(a.id)) continue;
    if (a.condition(stats)) {
      unlocked.add(a.id);
      newlyUnlocked.push(a);
    }
  }

  if (newlyUnlocked.length > 0) {
    saveUnlockedIds(unlocked);
  }

  return newlyUnlocked;
}

export function getUnlockedAchievements(): Achievement[] {
  const ids = getUnlockedIds();
  return ACHIEVEMENTS.filter(a => ids.has(a.id));
}

export function getAchievementStatus(stats: AchievementStats): { achievement: Achievement; unlocked: boolean }[] {
  const ids = getUnlockedIds();
  return ACHIEVEMENTS.map(a => ({
    achievement: a,
    unlocked: ids.has(a.id) || a.condition(stats),
  }));
}
