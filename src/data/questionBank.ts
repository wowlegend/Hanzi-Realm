import { Level } from '../types';
import { getLevelsForGrade, getFullSentenceFromLevel } from './beijingCurriculum';
import {
  getEligibleQuestions,
  selectQuestionsWithSpacedRepetition,
  SessionQuestionTracker
} from '../utils/spacedRepetition';

export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const sessionTracker = new SessionQuestionTracker();

export function getSessionTracker(): SessionQuestionTracker {
  return sessionTracker;
}

export function generateLevel(
  grade: number,
  count: number,
  seenIds: Set<number | string>
): Level[] {
  const allLevels = getLevelsForGrade(grade);

  const recentIds = sessionTracker.getRecentIds();
  const combinedExclusions = new Set([...seenIds, ...recentIds]);

  const availableLevels = allLevels.filter(l => !combinedExclusions.has(l.id));

  if (availableLevels.length >= count) {
    const selected = fisherYatesShuffle(availableLevels).slice(0, count);
    selected.forEach(l => seenIds.add(l.id));
    return selected;
  }

  const allAvailable = fisherYatesShuffle([...allLevels]);
  const selected: Level[] = [];
  const usedInThisBatch = new Set<string | number>();

  for (const level of allAvailable) {
    if (selected.length >= count) break;
    if (!usedInThisBatch.has(level.id)) {
      selected.push(level);
      usedInThisBatch.add(level.id);
      seenIds.add(level.id);
    }
  }

  return selected;
}

export async function generateLevelWithSpacedRepetition(
  grade: number,
  count: number,
  userId: string | null
): Promise<Level[]> {
  const allLevels = getLevelsForGrade(grade);

  if (!userId) {
    return generateLevel(grade, count, new Set());
  }

  try {
    const { eligible, needsReview, new: newQuestions } = await getEligibleQuestions(
      userId,
      allLevels
    );

    const recentIds = sessionTracker.getRecentIds();

    const selected = selectQuestionsWithSpacedRepetition(
      eligible,
      needsReview,
      newQuestions,
      count,
      recentIds
    );

    if (selected.length < count) {
      const remaining = count - selected.length;
      const usedIds = new Set(selected.map(l => l.id));
      const fallback = fisherYatesShuffle(
        allLevels.filter(l => !usedIds.has(l.id) && !recentIds.has(l.id))
      ).slice(0, remaining);
      selected.push(...fallback);
    }

    return selected;
  } catch (error) {
    console.error('Error with spaced repetition, falling back:', error);
    return generateLevel(grade, count, new Set());
  }
}

export function markQuestionAnswered(questionId: string | number): void {
  sessionTracker.markAnswered(questionId);
}

export function resetSessionTracker(): void {
  sessionTracker.reset();
}

export function getLevelFullSentence(level: Level): string {
  return getFullSentenceFromLevel(level);
}

export function getCorrectAnswerFromLevel(level: Level): string {
  return level.correctAnswer.value;
}

export function getMissingCharDisplay(
  level: Level,
  showAnswer: boolean,
  selectedAnswer?: string
): string {
  if (showAnswer && selectedAnswer) {
    return selectedAnswer;
  }
  return '___';
}
