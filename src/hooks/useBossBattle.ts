import { useState, useRef, useCallback } from 'react';
import { Boss, getBossForWorld, getBossTier, BossTier } from '../data/bosses';

export function useBossBattle() {
  const [isBossMode, setIsBossMode] = useState(false);
  const [bossTimer, setBossTimer] = useState(45);
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);
  const [currentBossTier, setCurrentBossTier] = useState<BossTier | null>(null);
  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startBoss = useCallback((worldNumber: number) => {
    const boss = getBossForWorld(worldNumber);
    const tier = getBossTier(worldNumber);
    setCurrentBoss(boss);
    setCurrentBossTier(tier);
    setIsBossMode(true);
    setBossTimer(tier.timer);
    return { boss, tier };
  }, []);

  const clearBossTimer = useCallback(() => {
    if (bossTimerRef.current) {
      clearInterval(bossTimerRef.current);
      bossTimerRef.current = null;
    }
  }, []);

  const endBoss = useCallback(() => {
    clearBossTimer();
    setCurrentBoss(null);
    setIsBossMode(false);
  }, [clearBossTimer]);

  const startTimer = useCallback((onTimeout: () => void) => {
    clearBossTimer();
    const timer = currentBossTier?.timer ?? 45;
    bossTimerRef.current = setInterval(() => {
      setBossTimer(prev => {
        if (prev <= 1) {
          onTimeout();
          return timer;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentBossTier, clearBossTimer]);

  const pauseTimer = useCallback(() => {
    clearBossTimer();
  }, [clearBossTimer]);

  return {
    isBossMode,
    bossTimer,
    currentBoss,
    currentBossTier,
    startBoss,
    endBoss,
    startTimer,
    pauseTimer,
    clearBossTimer,
    setBossTimer,
    setIsBossMode,
    setCurrentBoss,
  };
}
