import { useState, useRef, useCallback } from 'react';
import { checkAchievements, Achievement } from '../data/achievements';
import { getConsecutiveDays } from '../utils/dailyRewards';
import { ACHIEVEMENTS } from '../config/gameBalance';

interface AchievementStats {
  questionsAnswered: number;
  bestStreak: number;
  bossesDefeated: number;
  wordsLearned: number;
  worldNumber: number;
  jade: number;
}

export function useAchievements(onJadeBonus: (amount: number) => void) {
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const queueRef = useRef<Achievement[]>([]);

  const showNext = useCallback(() => {
    const next = queueRef.current.shift();
    if (next) {
      setAchievementToast(next);
      setTimeout(() => {
        setAchievementToast(null);
        setTimeout(() => showNext(), ACHIEVEMENTS.GAP_MS);
      }, ACHIEVEMENTS.DISPLAY_MS);
    }
  }, []);

  const checkAndNotify = useCallback((stats: AchievementStats) => {
    const newlyUnlocked = checkAchievements({
      ...stats,
      daysPlayed: 0,
      consecutiveDays: getConsecutiveDays(),
    });

    if (newlyUnlocked.length > 0) {
      let totalBonus = 0;
      for (const a of newlyUnlocked) totalBonus += a.jadeReward;
      if (totalBonus > 0) onJadeBonus(totalBonus);

      queueRef.current.push(...newlyUnlocked);
      if (!achievementToast) showNext();
    }
  }, [achievementToast, showNext, onJadeBonus]);

  const dismissToast = useCallback(() => {
    setAchievementToast(null);
  }, []);

  return {
    achievementToast,
    checkAndNotify,
    dismissToast,
  };
}
