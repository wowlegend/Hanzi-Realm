import { Level, ContentBlock, PinyinChar, AnswerOption } from '../types';
import { getLevelsForGrade } from './beijingCurriculum';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let sentenceOrderCounter = 0;

function extractSentenceText(level: Level): string {
  const parts: string[] = [];
  for (const block of level.blocks) {
    for (const seg of block.segments) {
      parts.push(seg.char);
    }
  }
  return parts.join('');
}

function chunkChinese(text: string, targetSize: number): string[] {
  const cleaned = text.replace(/[，。！？、；：""'']/g, '');
  const chars = [...cleaned];
  const chunks: string[] = [];
  let i = 0;
  while (i < chars.length) {
    const size = Math.min(targetSize + Math.floor(Math.random() * 2) - 1, chars.length - i);
    const realSize = Math.max(1, size);
    chunks.push(chars.slice(i, i + realSize).join(''));
    i += realSize;
  }
  return chunks.filter(c => c.length > 0);
}

export function generateSentenceOrderLevels(grade: number, count: number): Level[] {
  const levels = getLevelsForGrade(grade);
  if (levels.length === 0) return [];

  const results: Level[] = [];
  const usedIds = new Set<string>();

  const candidates = shuffle(levels);

  for (const baseLevel of candidates) {
    if (results.length >= count) break;

    const fullText = extractSentenceText(baseLevel);
    if (fullText.length < 4) continue;

    const cleanText = fullText.replace(/___/g, baseLevel.correctAnswer.value);
    const words = chunkChinese(cleanText, 2);

    if (words.length < 3 || words.length > 8) continue;

    const id = `so-${grade}-${++sentenceOrderCounter}`;
    if (usedIds.has(id)) continue;
    usedIds.add(id);

    const correctSentence = words.join('');

    const block: ContentBlock = {
      type: 'text',
      segments: [{ char: baseLevel.correctAnswer.definition, pinyin: '' }],
    };

    const options: AnswerOption[] = [
      {
        value: correctSentence,
        pinyin: '',
        explanation: 'Correct sentence order!',
        isCorrect: true,
      },
    ];

    results.push({
      id,
      grade,
      scenario: `Sentence Builder: Put the words in order`,
      blocks: [block],
      targetBlockIndex: 0,
      missingSegmentIndices: [],
      correctAnswer: {
        value: correctSentence,
        pinyin: baseLevel.correctAnswer.pinyin,
        definition: baseLevel.correctAnswer.definition,
      },
      options,
      hint: `Think about natural Chinese word order.`,
      questionType: 'sentence-order',
      sentenceWords: words,
    });
  }

  return results;
}

let radicalCounter = 0;

interface RadicalInfo {
  char: string;
  radical: string;
  radicalMeaning: string;
  pinyin: string;
  definition: string;
}

function extractRadicalCharacters(grade: number): RadicalInfo[] {
  const levels = getLevelsForGrade(grade);
  const chars: RadicalInfo[] = [];
  const seen = new Set<string>();

  for (const level of levels) {
    if (level.correctAnswer.radical && !seen.has(level.correctAnswer.value)) {
      chars.push({
        char: level.correctAnswer.value,
        radical: level.correctAnswer.radical,
        radicalMeaning: level.correctAnswer.radicalMeaning || '',
        pinyin: level.correctAnswer.pinyin,
        definition: level.correctAnswer.definition,
      });
      seen.add(level.correctAnswer.value);
    }

    for (const opt of level.options) {
      if (opt.radical && !seen.has(opt.value)) {
        chars.push({
          char: opt.value,
          radical: opt.radical,
          radicalMeaning: opt.radicalMeaning || '',
          pinyin: opt.pinyin,
          definition: opt.explanation,
        });
        seen.add(opt.value);
      }
    }
  }

  return chars;
}

export function generateRadicalDetectiveLevels(grade: number, count: number): Level[] {
  const allChars = extractRadicalCharacters(grade);
  if (allChars.length < 4) return [];

  const results: Level[] = [];
  const used = new Set<string>();

  const candidates = shuffle(allChars);

  for (const target of candidates) {
    if (results.length >= count) break;
    if (used.has(target.char)) continue;
    used.add(target.char);

    const distractors = shuffle(
      allChars.filter(c => c.char !== target.char && c.radical !== target.radical)
    ).slice(0, 2);

    const sameRadical = allChars.find(c => c.char !== target.char && c.radical === target.radical);

    if (distractors.length < 2) continue;

    const allOptions: AnswerOption[] = shuffle([
      {
        value: target.char,
        pinyin: target.pinyin,
        radical: target.radical,
        radicalMeaning: target.radicalMeaning,
        explanation: `Correct! "${target.radical}" means ${target.radicalMeaning}`,
        isCorrect: true,
      },
      {
        value: distractors[0].char,
        pinyin: distractors[0].pinyin,
        radical: distractors[0].radical,
        radicalMeaning: distractors[0].radicalMeaning,
        explanation: `This has the "${distractors[0].radical}" radical (${distractors[0].radicalMeaning})`,
      },
      {
        value: distractors[1].char,
        pinyin: distractors[1].pinyin,
        radical: distractors[1].radical,
        radicalMeaning: distractors[1].radicalMeaning,
        explanation: `This has the "${distractors[1].radical}" radical (${distractors[1].radicalMeaning})`,
      },
    ]);

    if (sameRadical && allOptions.length < 4) {
      allOptions.push({
        value: sameRadical.char,
        pinyin: sameRadical.pinyin,
        radical: sameRadical.radical,
        radicalMeaning: sameRadical.radicalMeaning,
        explanation: `Same radical "${sameRadical.radical}" but different character`,
      });
    }

    const id = `rd-${grade}-${++radicalCounter}`;

    const clueSegments: PinyinChar[] = [
      { char: `Which character contains the "${target.radical}" (${target.radicalMeaning}) radical?`, pinyin: '' },
    ];

    const block: ContentBlock = { type: 'text', segments: clueSegments };

    results.push({
      id,
      grade,
      scenario: `Radical Detective: Find the "${target.radical}" radical`,
      blocks: [block],
      targetBlockIndex: 0,
      missingSegmentIndices: [],
      correctAnswer: {
        value: target.char,
        pinyin: target.pinyin,
        radical: target.radical,
        radicalMeaning: target.radicalMeaning,
        definition: target.definition,
      },
      options: allOptions,
      hint: `Look for the ${target.radicalMeaning} component in the character.`,
      questionType: 'radical-detective',
    });
  }

  return results;
}
