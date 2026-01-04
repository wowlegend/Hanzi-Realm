import { useState, useEffect, useRef, useCallback } from 'react';
import { Boss, getBossForWorld } from '../data/bosses';

interface UseBossModeReturn {
  isBossMode: boolean;
  setIsBossMode: (value: boolean) => void;
  bossTimer: number;
  resetBossTimer: () => void;
  currentBoss: Boss | null;
  setCurrentBoss: (boss: Boss | null) => void;
  startBoss: (worldNumber: number) => void;
  endBoss: () => void;
  onTimeout: (callback: () => void) => void;
}

export function useBossMode(): UseBossModeReturn {
  const [isBossMode, setIsBossMode] = useState(false);
  const [bossTimer, setBossTimer] = useState(15);
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);
  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isBossMode) {
      bossTimerRef.current = setInterval(() => {
        setBossTimer(prev => {
          if (prev <= 1) {
            if (timeoutCallbackRef.current) {
              timeoutCallbackRef.current();
            }
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
        bossTimerRef.current = null;
      }
      setBossTimer(15);
    }

    return () => {
      if (bossTimerRef.current) {
        clearInterval(bossTimerRef.current);
      }
    };
  }, [isBossMode]);

  const resetBossTimer = useCallback(() => {
    setBossTimer(15);
  }, []);

  const startBoss = useCallback((worldNumber: number) => {
    const boss = getBossForWorld(worldNumber);
    setCurrentBoss(boss);
    setIsBossMode(true);
    setBossTimer(15);
  }, []);

  const endBoss = useCallback(() => {
    if (bossTimerRef.current) {
      clearInterval(bossTimerRef.current);
      bossTimerRef.current = null;
    }
    setCurrentBoss(null);
    setIsBossMode(false);
  }, []);

  const onTimeout = useCallback((callback: () => void) => {
    timeoutCallbackRef.current = callback;
  }, []);

  return {
    isBossMode,
    setIsBossMode,
    bossTimer,
    resetBossTimer,
    currentBoss,
    setCurrentBoss,
    startBoss,
    endBoss,
    onTimeout,
  };
}
