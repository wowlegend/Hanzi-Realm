import { Level } from '../types';
import { SEMANTIC_ZONES, getZonesForGrade, SemanticZone, FixedSentence } from './semanticData';

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function selectFocusField(grade: number): 'subject' | 'verb' | 'object' {
  if (grade <= 2) {
    const rand = Math.random();
    if (rand < 0.6) {
      return Math.random() < 0.5 ? 'subject' : 'object';
    }
    return 'verb';
  } else if (grade >= 5) {
    const rand = Math.random();
    if (rand < 0.6) {
      return 'verb';
    }
    return Math.random() < 0.5 ? 'subject' : 'object';
  }

  const fields: ('subject' | 'verb' | 'object')[] = ['subject', 'verb', 'object'];
  return getRandomElement(fields);
}

function generateDistractors(
  correctAnswer: string,
  focusField: 'subject' | 'verb' | 'object',
  zone: SemanticZone
): string[] {
  const distractorPool = zone.distractors[focusField];

  if (!distractorPool || distractorPool.length < 2) {
    return ["选项A", "选项B"];
  }

  const wrongOptions = distractorPool.filter(option => option !== correctAnswer);

  if (wrongOptions.length < 2) {
    if (wrongOptions.length === 1) {
      return [wrongOptions[0], "其他选项"];
    }
    return ["选项A", "选项B"];
  }

  const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

function generateQuestionFromZone(
  zone: SemanticZone,
  grade: number,
  id: number
): Level {
  const sentence = getRandomElement(zone.sentences);

  const focusField = selectFocusField(grade);

  const correctAnswer = sentence[focusField];

  let sentencePrefix = '';
  let sentenceSuffix = '';

  const parts = sentence.template.split(`{${focusField}}`);
  sentencePrefix = parts[0] || '';
  sentenceSuffix = parts[1] || '';

  const otherFields = ['subject', 'verb', 'object'].filter(
    field => field !== focusField
  ) as ('subject' | 'verb' | 'object')[];

  for (const field of otherFields) {
    const value = sentence[field];
    sentencePrefix = sentencePrefix.replace(`{${field}}`, value);
    sentenceSuffix = sentenceSuffix.replace(`{${field}}`, value);
  }

  const distractors = generateDistractors(correctAnswer, focusField, zone);

  const allOptions = [correctAnswer, ...distractors];
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

  const scenarioEmojis: Record<string, string> = {
    adventure: "⛰️",
    arts: "🎭",
    nature: "🌿",
    daily: "🏠",
    food: "🍜",
    school: "🎓",
    sports: "⚽",
    weather: "🌤️",
    travel: "✈️",
    culture: "🏮",
    emotions: "😊",
    technology: "💻"
  };

  const emoji = scenarioEmojis[zone.id] || "📝";
  const scenario = `${emoji} ${zone.category}`;

  return {
    id,
    scenario,
    sentence_prefix: sentencePrefix,
    sentence_suffix: sentenceSuffix,
    missing_char: correctAnswer,
    options: shuffledOptions.map(word => ({
      char: word,
      hint: word,
      explanation: word
    })),
    correct_explanation: `Excellent! The correct answer is "${correctAnswer}"!`
  };
}

export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateLevel(grade: number, count: number, seenIds: Set<number>): Level[] {
  const availableZones = getZonesForGrade(grade);

  if (availableZones.length === 0) {
    console.warn(`No zones found for grade ${grade}, using all zones`);
  }

  const zonesToUse = availableZones.length > 0 ? availableZones : SEMANTIC_ZONES;
  const levels: Level[] = [];

  for (let i = 0; i < count; i++) {
    const zone = getRandomElement(zonesToUse);

    const id = Date.now() + Math.random() * 10000;
    const uniqueId = Math.floor(id);

    const level = generateQuestionFromZone(zone, grade, uniqueId);
    levels.push(level);
  }

  return levels;
}
