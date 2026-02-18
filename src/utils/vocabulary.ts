import { beijingCurriculum } from '../data/beijingCurriculum';
import { Level } from '../types';

export interface VocabEntry {
  char: string;
  pinyin: string;
  definition: string;
  radical?: string;
  radicalMeaning?: string;
  grade: number;
}

const vocabCache = new Map<string, VocabEntry>();
let cacheBuilt = false;

function getAllLevels(): Level[] {
  const all: Level[] = [];
  for (const grade of Object.keys(beijingCurriculum)) {
    all.push(...beijingCurriculum[Number(grade)]);
  }
  return all;
}

function buildCache() {
  if (cacheBuilt) return;
  for (const level of getAllLevels()) {
    const entry: VocabEntry = {
      char: level.correctAnswer.value,
      pinyin: level.correctAnswer.pinyin,
      definition: level.correctAnswer.definition,
      radical: level.correctAnswer.radical,
      radicalMeaning: level.correctAnswer.radicalMeaning,
      grade: level.grade,
    };
    if (!vocabCache.has(entry.char)) {
      vocabCache.set(entry.char, entry);
    }
    for (const opt of level.options) {
      if (!vocabCache.has(opt.value)) {
        vocabCache.set(opt.value, {
          char: opt.value,
          pinyin: opt.pinyin,
          definition: opt.explanation,
          radical: opt.radical,
          radicalMeaning: opt.radicalMeaning,
          grade: level.grade,
        });
      }
    }
  }
  cacheBuilt = true;
}

export function lookupCharacter(char: string): VocabEntry | null {
  buildCache();
  return vocabCache.get(char) || null;
}

export function lookupMultiple(chars: string[]): VocabEntry[] {
  buildCache();
  const results: VocabEntry[] = [];
  for (const c of chars) {
    const entry = vocabCache.get(c);
    if (entry) results.push(entry);
  }
  return results;
}

export function getVocabByGrade(chars: string[]): Record<number, VocabEntry[]> {
  const entries = lookupMultiple(chars);
  const byGrade: Record<number, VocabEntry[]> = {};
  for (const e of entries) {
    if (!byGrade[e.grade]) byGrade[e.grade] = [];
    byGrade[e.grade].push(e);
  }
  return byGrade;
}
