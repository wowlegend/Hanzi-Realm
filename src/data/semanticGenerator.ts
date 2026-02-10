import { Level, ContentBlock, PinyinChar, AnswerOption } from '../types';
import { getZonesForGrade, SemanticZone, FixedSentence } from './semanticData';

let generatorCounter = 0;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SlotKey = 'subject' | 'verb' | 'object';

function generateFromSentence(zone: SemanticZone, sentence: FixedSentence, grade: number, slot: SlotKey): Level | null {
  const answer = sentence[slot];
  if (!answer) return null;

  const distractorPool = zone.distractors[slot];
  if (!distractorPool) return null;

  const others = distractorPool.filter(d => d !== answer);
  if (others.length < 2) return null;

  const distractors = shuffle(others).slice(0, 2);

  const filled = sentence.template
    .replace('{subject}', sentence.subject)
    .replace('{verb}', sentence.verb)
    .replace('{object}', sentence.object);

  const blankFilled = sentence.template
    .replace('{subject}', slot === 'subject' ? '___' : sentence.subject)
    .replace('{verb}', slot === 'verb' ? '___' : sentence.verb)
    .replace('{object}', slot === 'object' ? '___' : sentence.object);

  const chars = blankFilled.split('');
  const blankStart = blankFilled.indexOf('___');
  const segments: PinyinChar[] = [];
  let missingIndices: number[] = [];

  let i = 0;
  while (i < chars.length) {
    if (i === blankStart) {
      const idx = segments.length;
      segments.push({ char: '___', pinyin: '', isMissing: true });
      missingIndices.push(idx);
      i += 3;
    } else {
      segments.push({ char: chars[i], pinyin: '' });
      i++;
    }
  }

  const block: ContentBlock = { type: 'text', segments };

  const slotLabel = slot === 'subject' ? 'Subject' : slot === 'verb' ? 'Verb' : 'Object';
  generatorCounter++;
  const id = `sem-${zone.id}-${generatorCounter}`;

  const options: AnswerOption[] = shuffle([
    { value: answer, pinyin: '', explanation: `Correct ${slotLabel.toLowerCase()} for this sentence`, isCorrect: true },
    { value: distractors[0], pinyin: '', explanation: `Wrong ${slotLabel.toLowerCase()} choice` },
    { value: distractors[1], pinyin: '', explanation: `Wrong ${slotLabel.toLowerCase()} choice` },
  ]);

  return {
    id,
    grade,
    scenario: `${zone.category}: ${slotLabel} Fill`,
    blocks: [block],
    targetBlockIndex: 0,
    missingSegmentIndices: missingIndices,
    correctAnswer: {
      value: answer,
      pinyin: '',
      definition: `The ${slotLabel.toLowerCase()} in: ${filled}`,
    },
    options,
    hint: `Think about the ${slotLabel.toLowerCase()} of this ${zone.category.toLowerCase()} sentence.`,
    distractorType: 'visual',
  };
}

export function generateSemanticLevels(grade: number, count: number): Level[] {
  const zones = getZonesForGrade(grade);
  if (zones.length === 0) return [];

  const results: Level[] = [];
  const usedKeys = new Set<string>();
  const slots: SlotKey[] = ['subject', 'verb', 'object'];
  let attempts = 0;

  while (results.length < count && attempts < count * 10) {
    attempts++;
    const zone = pickRandom(zones);
    const sentence = pickRandom(zone.sentences);
    const slot = pickRandom(slots);
    const key = `${zone.id}-${sentence.subject}-${slot}`;

    if (usedKeys.has(key)) continue;

    const level = generateFromSentence(zone, sentence, grade, slot);
    if (level) {
      results.push(level);
      usedKeys.add(key);
    }
  }

  return results;
}
