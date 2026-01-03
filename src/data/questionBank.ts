import { Level } from '../types';
import { SEMANTIC_ZONES, getZonesForGrade, SemanticZone } from './semanticData';

function getRandomElement<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = fisherYatesShuffle([...array]);
  return shuffled.slice(0, Math.min(count, array.length));
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

  const shuffled = fisherYatesShuffle([...wrongOptions]);
  return shuffled.slice(0, 2);
}

function generateQuestionFromZone(
  zone: SemanticZone,
  grade: number,
  id: number,
  usedSentenceIndices: Set<number>
): Level {
  let sentenceIndex = Math.floor(Math.random() * zone.sentences.length);
  let attempts = 0;

  while (usedSentenceIndices.has(sentenceIndex) && attempts < zone.sentences.length) {
    sentenceIndex = (sentenceIndex + 1) % zone.sentences.length;
    attempts++;
  }

  usedSentenceIndices.add(sentenceIndex);
  const sentence = zone.sentences[sentenceIndex];

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
  const shuffledOptions = fisherYatesShuffle(allOptions);

  const scenarioEmojis: Record<string, string> = {
    adventure: "Mountain",
    arts: "Theater",
    nature: "Leaf",
    daily: "Home",
    food: "Bowl",
    school: "Graduation",
    sports: "Ball",
    weather: "Sun",
    travel: "Plane",
    culture: "Lantern",
    emotions: "Heart",
    technology: "Computer"
  };

  const emoji = scenarioEmojis[zone.id] || "Pencil";
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

  const shuffledZones = fisherYatesShuffle([...zonesToUse]);
  const usedSentencesPerZone = new Map<string, Set<number>>();

  for (let i = 0; i < count; i++) {
    const zoneIndex = i % shuffledZones.length;
    const zone = shuffledZones[zoneIndex];

    if (!usedSentencesPerZone.has(zone.id)) {
      usedSentencesPerZone.set(zone.id, new Set());
    }
    const usedSentences = usedSentencesPerZone.get(zone.id)!;

    const id = Date.now() + i * 1000 + Math.floor(Math.random() * 1000);
    const uniqueId = Math.floor(id);

    const level = generateQuestionFromZone(zone, grade, uniqueId, usedSentences);
    levels.push(level);
  }

  return fisherYatesShuffle(levels);
}
