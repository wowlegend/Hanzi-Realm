import { useMemo } from 'react';
import { Companion } from '../types';

interface CompanionBuffs {
  jadeBonus: number;
  comboMultiplier: number;
  hasStreakShield: boolean;
}

export function useCompanionBuffs(
  companions: Companion[],
  activeCompanionId: string | null
): CompanionBuffs {
  return useMemo(() => {
    const activeCompanion = companions.find(c => c.id === activeCompanionId);

    if (!activeCompanion) {
      return {
        jadeBonus: 0,
        comboMultiplier: 1,
        hasStreakShield: false,
      };
    }

    return {
      jadeBonus: activeCompanion.buffType === 'jade_boost' ? activeCompanion.buffValue : 0,
      comboMultiplier: activeCompanion.buffType === 'combo_master' ? activeCompanion.buffValue : 1,
      hasStreakShield: activeCompanion.buffType === 'streak_shield',
    };
  }, [companions, activeCompanionId]);
}

export function getActiveCompanion(
  companions: Companion[],
  activeCompanionId: string | null
): Companion | null {
  return companions.find(c => c.id === activeCompanionId) || null;
}
