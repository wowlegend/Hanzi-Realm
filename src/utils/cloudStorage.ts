import { supabase } from '../lib/supabase';
import { GameSettings, MapNode, Companion } from '../types';
import { withRetry } from './syncRetry';
import { showErrorToast } from '../components/ErrorToast';

interface GameProgress {
  jade: number;
  current_streak: number;
  best_streak: number;
  questions_answered: number;
  bosses_defeated: number;
  world_number: number;
  grade_level: number;
  words_learned: string[];
  streak_shield_active?: boolean;
  streak_shield_used?: boolean;
  seen_question_ids?: string[];
}

interface DailyRewardCloud {
  last_claim_date: string | null;
  consecutive_days: number;
  claimed_days: number[];
}

export async function syncProgressToCloud(
  userId: string,
  jade: number,
  currentStreak: number,
  bestStreak: number,
  questionsAnswered: number,
  bossesDefeated: number,
  worldNumber: number,
  gradeLevel: number,
  wordsLearned: string[],
  streakShieldActive?: boolean,
  streakShieldUsed?: boolean,
  seenQuestionIds?: string[]
): Promise<void> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    jade,
    current_streak: currentStreak,
    best_streak: bestStreak,
    questions_answered: questionsAnswered,
    bosses_defeated: bossesDefeated,
    world_number: worldNumber,
    grade_level: gradeLevel,
    words_learned: wordsLearned,
    updated_at: new Date().toISOString(),
  };

  if (streakShieldActive !== undefined) payload.streak_shield_active = streakShieldActive;
  if (streakShieldUsed !== undefined) payload.streak_shield_used = streakShieldUsed;
  if (seenQuestionIds !== undefined) payload.seen_question_ids = seenQuestionIds;

  await withRetry(async () => {
    const { error } = await supabase
      .from('game_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error('Error syncing progress:', error);
      throw error;
    }
  });
}

export async function loadProgressFromCloud(userId: string): Promise<GameProgress | null> {
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error loading progress:', error);
    showErrorToast('Failed to load cloud save data');
    return null;
  }

  return data;
}

export async function syncCompanionsToCloud(
  userId: string,
  companions: Companion[],
  activeCompanionId: string | null
): Promise<void> {
  if (companions.length === 0) {
    const { error } = await supabase
      .from('companions')
      .delete()
      .eq('user_id', userId);
    if (error) {
      console.error('Error clearing companions:', error);
      throw error;
    }
    return;
  }

  const companionData = companions.map(c => ({
    user_id: userId,
    companion_id: c.id,
    name: c.name,
    emoji: c.emoji,
    avatar_seed: c.avatarSeed,
    rarity: c.rarity,
    buff_type: c.buffType,
    buff_value: c.buffValue,
    is_active: c.id === activeCompanionId,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('companions')
    .upsert(companionData, { onConflict: 'user_id,companion_id' });

  if (error) {
    console.error('Error syncing companions:', error);
    throw error;
  }
}

export async function loadCompanionsFromCloud(userId: string): Promise<{ companions: Companion[], activeCompanion: string | null }> {
  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error loading companions:', error);
    showErrorToast('Failed to load companions from cloud');
    return { companions: [], activeCompanion: null };
  }

  if (!data || data.length === 0) {
    return { companions: [], activeCompanion: null };
  }

  const companions: Companion[] = data.map(c => ({
    id: c.companion_id,
    name: c.name,
    emoji: c.emoji,
    avatarSeed: c.avatar_seed,
    rarity: c.rarity as 'common' | 'rare' | 'legendary',
    unlocked: true,
    buffType: c.buff_type as 'jade_boost' | 'streak_shield' | 'combo_master',
    buffValue: c.buff_value,
  }));

  const activeCompanion = data.find(c => c.is_active)?.companion_id || null;

  return { companions, activeCompanion };
}

export async function syncSettingsToCloud(
  userId: string,
  settings: GameSettings,
  theme: string
): Promise<void> {
  const { error } = await supabase
    .from('game_settings')
    .upsert({
      user_id: userId,
      audio_language: settings.audioLanguage,
      use_eleven_labs: settings.useAzureTts,
      audio_speed: settings.audioSpeed,
      bgm_volume: settings.bgmVolume,
      theme,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error syncing settings:', error);
    throw error;
  }
}

export async function loadSettingsFromCloud(userId: string): Promise<{ settings: Partial<GameSettings>, theme: string } | null> {
  const { data, error } = await supabase
    .from('game_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error loading settings:', error);
    showErrorToast('Failed to load settings from cloud');
    return null;
  }

  if (!data) return null;

  return {
    settings: {
      audioLanguage: data.audio_language,
      useAzureTts: data.use_eleven_labs,
      audioSpeed: data.audio_speed,
      bgmVolume: data.bgm_volume,
    },
    theme: data.theme || 'default',
  };
}

export async function syncMapStateToCloud(
  userId: string,
  nodes: MapNode[],
  worldId: number
): Promise<void> {
  const { error } = await supabase
    .from('world_map_state')
    .upsert({
      user_id: userId,
      world_id: worldId,
      nodes: nodes as any,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,world_id'
    });

  if (error) {
    console.error('Error syncing map state:', error);
    throw error;
  }
}

export async function loadMapStateFromCloud(userId: string, worldId: number): Promise<MapNode[] | null> {
  const { data, error } = await supabase
    .from('world_map_state')
    .select('nodes')
    .eq('user_id', userId)
    .eq('world_id', worldId)
    .maybeSingle();

  if (error) {
    console.error('Error loading map state:', error);
    showErrorToast('Failed to load map from cloud');
    return null;
  }

  return data?.nodes as MapNode[] || null;
}

export async function syncDailyRewardsToCloud(
  userId: string,
  lastClaimDate: string,
  consecutiveDays: number,
  claimedDays: number[]
): Promise<void> {
  const { error } = await supabase
    .from('daily_rewards')
    .upsert({
      user_id: userId,
      last_claim_date: lastClaimDate || null,
      consecutive_days: consecutiveDays,
      claimed_days: claimedDays,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error syncing daily rewards:', error);
    throw error;
  }
}

export async function loadDailyRewardsFromCloud(userId: string): Promise<DailyRewardCloud | null> {
  const { data, error } = await supabase
    .from('daily_rewards')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error loading daily rewards:', error);
    showErrorToast('Failed to load daily rewards');
    return null;
  }

  if (!data) return null;

  return {
    last_claim_date: data.last_claim_date,
    consecutive_days: data.consecutive_days,
    claimed_days: data.claimed_days || [],
  };
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  jade_total: number;
  best_streak: number;
  bosses_defeated: number;
  words_mastered: number;
  world_reached: number;
  grade_level: number;
}

export async function syncLeaderboardEntry(
  userId: string,
  displayName: string,
  jadeTotal: number,
  bestStreak: number,
  bossesDefeated: number,
  wordsMastered: number,
  worldReached: number,
  gradeLevel: number
): Promise<void> {
  try {
    await supabase
      .from('leaderboard_entries')
      .upsert({
        user_id: userId,
        display_name: displayName,
        jade_total: jadeTotal,
        best_streak: bestStreak,
        bosses_defeated: bossesDefeated,
        words_mastered: wordsMastered,
        world_reached: worldReached,
        grade_level: gradeLevel,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
  } catch (error) {
    console.error('Error syncing leaderboard:', error);
  }
}

export async function getLeaderboard(
  category: 'jade_total' | 'best_streak' | 'bosses_defeated' | 'words_mastered',
  limit = 50
): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .order(category, { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    showErrorToast('Failed to load leaderboard');
    return [];
  }

  return (data as LeaderboardEntry[]) || [];
}

export async function recordCharacterAttempt(
  userId: string,
  character: string,
  isCorrect: boolean
): Promise<void> {
  const { data: existing } = await supabase
    .from('character_mastery')
    .select('*')
    .eq('user_id', userId)
    .eq('character', character)
    .maybeSingle();

  if (existing) {
    const newCorrectCount = existing.correct_count + (isCorrect ? 1 : 0);
    const newTotalAttempts = existing.total_attempts + 1;
    const accuracy = newCorrectCount / newTotalAttempts;

    let newMasteryLevel = existing.mastery_level;
    if (accuracy >= 0.9 && newTotalAttempts >= 5) newMasteryLevel = 5;
    else if (accuracy >= 0.8 && newTotalAttempts >= 4) newMasteryLevel = 4;
    else if (accuracy >= 0.7 && newTotalAttempts >= 3) newMasteryLevel = 3;
    else if (accuracy >= 0.6 && newTotalAttempts >= 2) newMasteryLevel = 2;
    else if (newTotalAttempts >= 1) newMasteryLevel = 1;

    const intervals = [0, 1, 3, 7, 14, 30];
    const daysToAdd = intervals[newMasteryLevel] || 0;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

    await supabase
      .from('character_mastery')
      .update({
        correct_count: newCorrectCount,
        total_attempts: newTotalAttempts,
        last_reviewed_at: new Date().toISOString(),
        next_review_at: nextReviewDate.toISOString(),
        mastery_level: newMasteryLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 1);

    await supabase
      .from('character_mastery')
      .insert({
        user_id: userId,
        character,
        correct_count: isCorrect ? 1 : 0,
        total_attempts: 1,
        last_reviewed_at: new Date().toISOString(),
        next_review_at: nextReviewDate.toISOString(),
        mastery_level: 1,
      });
  }
}
