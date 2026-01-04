import { Level } from '../types';
import { getRandomLevelsForGrade, getFullSentenceFromLevel } from './beijingCurriculum';

export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateLevel(grade: number, count: number, seenIds: Set<number | string>): Level[] {
  return getRandomLevelsForGrade(grade, count, seenIds);
}

export function getLevelFullSentence(level: Level): string {
  return getFullSentenceFromLevel(level);
}

export function getCorrectAnswerFromLevel(level: Level): string {
  return level.correctAnswer.value;
}

export function getMissingCharDisplay(level: Level, showAnswer: boolean, selectedAnswer?: string): string {
  if (showAnswer && selectedAnswer) {
    return selectedAnswer;
  }
  return '___';
}
