import { supabase } from '../lib/supabase';
import { Level } from '../types';

interface QuestionAttempt {
  question_id: string;
  answered_correctly: boolean;
  next_eligible_at: string;
  streak_count: number;
  difficulty_score: number;
}

const COOLDOWN_INTERVALS = [
  5 * 60 * 1000,
  15 * 60 * 1000,
  60 * 60 * 1000,
  4 * 60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
];

const WRONG_ANSWER_COOLDOWN = 2 * 60 * 1000;

export async function recordQuestionAttempt(
  userId: string,
  questionId: string,
  isCorrect: boolean
): Promise<void> {
  try {
  const { data: existing, error: fetchError } = await supabase
    .from('question_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching question attempt:', fetchError);
    return;
  }

  const now = new Date();

  if (existing) {
    const newStreak = isCorrect ? existing.streak_count + 1 : 0;
    const cooldownIndex = Math.min(newStreak, COOLDOWN_INTERVALS.length - 1);
    const cooldown = isCorrect ? COOLDOWN_INTERVALS[cooldownIndex] : WRONG_ANSWER_COOLDOWN;

    const nextEligible = new Date(now.getTime() + cooldown);

    const totalAttempts = (existing.total_attempts ?? 1) + 1;
    const correctAttempts = (existing.correct_count ?? 0) + (isCorrect ? 1 : 0);
    const newDifficulty = 1 - (correctAttempts / totalAttempts);

    await supabase
      .from('question_attempts')
      .update({
        answered_correctly: isCorrect,
        answered_at: now.toISOString(),
        next_eligible_at: nextEligible.toISOString(),
        streak_count: newStreak,
        total_attempts: totalAttempts,
        correct_count: correctAttempts,
        difficulty_score: Math.max(0, Math.min(1, newDifficulty)),
        updated_at: now.toISOString(),
      })
      .eq('id', existing.id);
  } else {
    const cooldown = isCorrect ? COOLDOWN_INTERVALS[1] : WRONG_ANSWER_COOLDOWN;
    const nextEligible = new Date(now.getTime() + cooldown);

    await supabase
      .from('question_attempts')
      .insert({
        user_id: userId,
        question_id: questionId,
        answered_correctly: isCorrect,
        answered_at: now.toISOString(),
        next_eligible_at: nextEligible.toISOString(),
        streak_count: isCorrect ? 1 : 0,
        total_attempts: 1,
        correct_count: isCorrect ? 1 : 0,
        difficulty_score: isCorrect ? 0.3 : 0.7,
      });
  }
  } catch (error) {
    console.error('Error recording question attempt:', error);
  }
}

export async function getEligibleQuestions(
  userId: string,
  allLevels: Level[]
): Promise<{ eligible: Level[]; needsReview: Level[]; new: Level[] }> {
  const now = new Date().toISOString();

  const { data: attempts } = await supabase
    .from('question_attempts')
    .select('question_id, next_eligible_at, difficulty_score, streak_count, answered_correctly')
    .eq('user_id', userId);

  const attemptMap = new Map<string, QuestionAttempt>();
  if (attempts) {
    attempts.forEach(a => {
      attemptMap.set(a.question_id, a);
    });
  }

  const eligible: Level[] = [];
  const needsReview: Level[] = [];
  const newQuestions: Level[] = [];

  for (const level of allLevels) {
    const levelId = String(level.id);
    const attempt = attemptMap.get(levelId);

    if (!attempt) {
      newQuestions.push(level);
    } else if (attempt.next_eligible_at <= now) {
      if (attempt.difficulty_score > 0.5 || !attempt.answered_correctly) {
        needsReview.push(level);
      } else {
        eligible.push(level);
      }
    }
  }

  needsReview.sort((a, b) => {
    const aAttempt = attemptMap.get(String(a.id));
    const bAttempt = attemptMap.get(String(b.id));
    return (bAttempt?.difficulty_score || 0) - (aAttempt?.difficulty_score || 0);
  });

  return { eligible, needsReview, new: newQuestions };
}

export function selectQuestionsWithSpacedRepetition(
  eligible: Level[],
  needsReview: Level[],
  newQuestions: Level[],
  count: number,
  recentlyAnswered: Set<string | number>
): Level[] {
  const selected: Level[] = [];
  const usedIds = new Set<string | number>();

  const filterRecent = (levels: Level[]) =>
    levels.filter(l => !recentlyAnswered.has(l.id) && !usedIds.has(l.id));

  const reviewCount = Math.ceil(count * 0.3);
  const shuffledReview = shuffleArray(filterRecent(needsReview));
  for (let i = 0; i < Math.min(reviewCount, shuffledReview.length); i++) {
    selected.push(shuffledReview[i]);
    usedIds.add(shuffledReview[i].id);
  }

  const newCount = Math.ceil(count * 0.4);
  const shuffledNew = shuffleArray(filterRecent(newQuestions));
  for (let i = 0; i < Math.min(newCount, shuffledNew.length); i++) {
    selected.push(shuffledNew[i]);
    usedIds.add(shuffledNew[i].id);
  }

  const remaining = count - selected.length;
  const shuffledEligible = shuffleArray(filterRecent(eligible));
  for (let i = 0; i < Math.min(remaining, shuffledEligible.length); i++) {
    selected.push(shuffledEligible[i]);
    usedIds.add(shuffledEligible[i].id);
  }

  if (selected.length < count) {
    const allAvailable = shuffleArray([...eligible, ...needsReview, ...newQuestions]
      .filter(l => !usedIds.has(l.id)));
    for (let i = 0; i < Math.min(count - selected.length, allAvailable.length); i++) {
      selected.push(allAvailable[i]);
      usedIds.add(allAvailable[i].id);
    }
  }

  return shuffleArray(selected);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export class SessionQuestionTracker {
  private answeredThisSession: Set<string | number> = new Set();
  private recentlyAnswered: Array<{ id: string | number; timestamp: number }> = [];
  private readonly recentCooldown = 3 * 60 * 1000;

  markAnswered(questionId: string | number): void {
    this.answeredThisSession.add(questionId);
    this.recentlyAnswered.push({ id: questionId, timestamp: Date.now() });
    this.cleanupRecent();
  }

  isRecentlyAnswered(questionId: string | number): boolean {
    this.cleanupRecent();
    return this.recentlyAnswered.some(r => r.id === questionId);
  }

  getRecentIds(): Set<string | number> {
    this.cleanupRecent();
    return new Set(this.recentlyAnswered.map(r => r.id));
  }

  private cleanupRecent(): void {
    const now = Date.now();
    this.recentlyAnswered = this.recentlyAnswered.filter(
      r => now - r.timestamp < this.recentCooldown
    );
  }

  reset(): void {
    this.answeredThisSession.clear();
    this.recentlyAnswered = [];
  }
}
