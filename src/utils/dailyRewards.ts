export interface DailyReward {
  day: number;
  jade: number;
  claimed: boolean;
}

interface DailyRewardState {
  lastClaimDate: string;
  consecutiveDays: number;
  claimedDays: number[];
}

const STORAGE_KEY = 'hanzi_daily_rewards';
const REWARD_CYCLE: number[] = [100, 200, 300, 500, 500, 750, 1500];

function getState(): DailyRewardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lastClaimDate: '', consecutiveDays: 0, claimedDays: [] };
}

function saveState(state: DailyRewardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function isYesterday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
}

export function checkDailyReward(): { shouldShow: boolean; reward: DailyReward | null; allRewards: DailyReward[] } {
  const state = getState();
  const today = getToday();
  const alreadyClaimed = state.lastClaimDate === today;

  let currentDay = state.consecutiveDays;
  if (!alreadyClaimed) {
    if (isYesterday(state.lastClaimDate)) {
      currentDay = state.consecutiveDays;
    } else if (state.lastClaimDate !== today) {
      currentDay = 0;
    }
  }

  const cycleDay = currentDay % REWARD_CYCLE.length;

  const allRewards: DailyReward[] = REWARD_CYCLE.map((jade, i) => ({
    day: i + 1,
    jade,
    claimed: i < cycleDay || (i === cycleDay && alreadyClaimed),
  }));

  if (alreadyClaimed) {
    return { shouldShow: false, reward: null, allRewards };
  }

  return {
    shouldShow: true,
    reward: { day: cycleDay + 1, jade: REWARD_CYCLE[cycleDay], claimed: false },
    allRewards,
  };
}

export function claimDailyReward(): number {
  const state = getState();
  const today = getToday();

  if (state.lastClaimDate === today) return 0;

  let newConsecutive: number;
  if (isYesterday(state.lastClaimDate)) {
    newConsecutive = state.consecutiveDays + 1;
  } else {
    newConsecutive = 1;
  }

  const cycleDay = (newConsecutive - 1) % REWARD_CYCLE.length;
  const jadeReward = REWARD_CYCLE[cycleDay];

  saveState({
    lastClaimDate: today,
    consecutiveDays: newConsecutive,
    claimedDays: [...state.claimedDays, newConsecutive],
  });

  return jadeReward;
}

export function getConsecutiveDays(): number {
  const state = getState();
  const today = getToday();
  if (state.lastClaimDate === today || isYesterday(state.lastClaimDate)) {
    return state.consecutiveDays;
  }
  return 0;
}

export function getDaysPlayed(): number {
  const state = getState();
  return state.claimedDays.length;
}
