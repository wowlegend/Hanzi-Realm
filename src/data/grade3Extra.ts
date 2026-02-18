import { Level, ContentBlock, PinyinChar } from '../types';

function p(chars: string[], pinyins: string[]): PinyinChar[] {
  return chars.map((char, i) => ({ char, pinyin: pinyins[i] || '', isMissing: false }));
}

function t(chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'text', segments: p(chars, pinyins) };
}

function dlg(speaker: string, chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'dialogue', speaker, avatarSeed: speaker, segments: p(chars, pinyins) };
}

function idiom(chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'idiom', segments: p(chars, pinyins) };
}

export const grade3Extra: Level[] = [
  {
    id: 'g3-006', grade: 3, scenario: 'The Brave Knight',
    blocks: [t(['勇', '___', '的', '骑', '士', '保', '护', '了', '村', '庄', '。'], ['yǒng', 'gǎn', 'de', 'qí', 'shì', 'bǎo', 'hù', 'le', 'cūn', 'zhuāng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '敢', pinyin: 'gǎn', radical: '攵', radicalMeaning: 'Strike', definition: 'Dare/Brave - to have courage' },
    options: [
      { value: '敢', pinyin: 'gǎn', radical: '攵', radicalMeaning: 'Strike', explanation: 'Brave - daring to act!' },
      { value: '感', pinyin: 'gǎn', radical: '心', radicalMeaning: 'Heart', explanation: 'Feel - same sound but about emotions!' },
      { value: '赶', pinyin: 'gǎn', radical: '走', radicalMeaning: 'Walk', explanation: 'Hurry - to chase after!' },
    ],
    hint: 'The brave knight DARES to fight!', distractorType: 'homophone',
  },
  {
    id: 'g3-007', grade: 3, scenario: 'Morning Reading',
    blocks: [dlg('Teacher', ['同', '学', '们', '，', '请', '___', '开', '课', '本', '。'], ['tóng', 'xué', 'men', '', 'qǐng', 'dǎ', 'kāi', 'kè', 'běn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '打', pinyin: 'dǎ', radical: '扌', radicalMeaning: 'Hand', definition: 'Open/Hit - to open (a book), strike' },
    options: [
      { value: '打', pinyin: 'dǎ', radical: '扌', radicalMeaning: 'Hand', explanation: 'Open - uses hand radical to open books!' },
      { value: '拿', pinyin: 'ná', radical: '手', radicalMeaning: 'Hand', explanation: 'Take - to pick up, not open!' },
      { value: '找', pinyin: 'zhǎo', radical: '扌', radicalMeaning: 'Hand', explanation: 'Search - to look for something!' },
    ],
    hint: 'Please OPEN your textbooks!', distractorType: 'visual',
  },
  {
    id: 'g3-008', grade: 3, scenario: 'The Seasons Change',
    blocks: [t(['秋', '天', '到', '了', '，', '树', '叶', '变', '___', '了', '。'], ['qiū', 'tiān', 'dào', 'le', '', 'shù', 'yè', 'biàn', 'huáng', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [8],
    correctAnswer: { value: '黄', pinyin: 'huáng', radical: '黄', radicalMeaning: 'Yellow', definition: 'Yellow - the color of autumn leaves' },
    options: [
      { value: '黄', pinyin: 'huáng', radical: '黄', radicalMeaning: 'Yellow', explanation: 'Yellow - autumn leaf color!' },
      { value: '红', pinyin: 'hóng', radical: '纟', radicalMeaning: 'Silk', explanation: 'Red - close but leaves turn yellow first!' },
      { value: '绿', pinyin: 'lǜ', radical: '纟', radicalMeaning: 'Silk', explanation: 'Green - that is spring color!' },
    ],
    hint: 'Autumn leaves change to this warm color.', distractorType: 'visual',
  },
  {
    id: 'g3-009', grade: 3, scenario: 'Lost and Found',
    blocks: [t(['我', '___', '了', '我', '的', '铅', '笔', '盒', '。'], ['wǒ', 'diū', 'le', 'wǒ', 'de', 'qiān', 'bǐ', 'hé', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '丢', pinyin: 'diū', radical: '丿', radicalMeaning: 'Slash', definition: 'Lose - to lose something' },
    options: [
      { value: '丢', pinyin: 'diū', radical: '丿', radicalMeaning: 'Slash', explanation: 'Lost - something went missing!' },
      { value: '去', pinyin: 'qù', radical: '厶', radicalMeaning: 'Private', explanation: 'Go - to go somewhere, not lose!' },
      { value: '扔', pinyin: 'rēng', radical: '扌', radicalMeaning: 'Hand', explanation: 'Throw - to toss away on purpose!' },
    ],
    hint: 'I LOST my pencil case!', distractorType: 'visual',
  },
  {
    id: 'g3-010', grade: 3, scenario: 'Birthday Party',
    blocks: [dlg('Friend', ['___', '日', '快', '乐', '！', '送', '你', '一', '个', '礼', '物', '。'], ['shēng', 'rì', 'kuài', 'lè', '', 'sòng', 'nǐ', 'yí', 'gè', 'lǐ', 'wù', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '生', pinyin: 'shēng', radical: '生', radicalMeaning: 'Life', definition: 'Birth/Life - birthday greeting' },
    options: [
      { value: '生', pinyin: 'shēng', radical: '生', radicalMeaning: 'Life', explanation: 'Birth - happy BIRTHday!' },
      { value: '声', pinyin: 'shēng', radical: '士', radicalMeaning: 'Scholar', explanation: 'Sound - same sound, different meaning!' },
      { value: '升', pinyin: 'shēng', radical: '十', radicalMeaning: 'Ten', explanation: 'Rise - to go up, not birthday!' },
    ],
    hint: 'Happy ___day! It means birth/life.', distractorType: 'homophone',
  },
  {
    id: 'g3-011', grade: 3, scenario: 'Science Class',
    blocks: [t(['地', '球', '围', '绕', '太', '阳', '___', '转', '。'], ['dì', 'qiú', 'wéi', 'rào', 'tài', 'yáng', 'xuán', 'zhuǎn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '旋', pinyin: 'xuán', radical: '方', radicalMeaning: 'Square', definition: 'Revolve - to spin around' },
    options: [
      { value: '旋', pinyin: 'xuán', radical: '方', radicalMeaning: 'Square', explanation: 'Revolve - spinning around the sun!' },
      { value: '选', pinyin: 'xuǎn', radical: '辶', radicalMeaning: 'Walk', explanation: 'Choose - to select, not spin!' },
      { value: '悬', pinyin: 'xuán', radical: '心', radicalMeaning: 'Heart', explanation: 'Hang - to suspend in air!' },
    ],
    hint: 'The Earth REVOLVES around the sun.', distractorType: 'homophone',
  },
  {
    id: 'g3-012', grade: 3, scenario: 'Four-character Idiom',
    blocks: [idiom(['守', '株', '待', '___'], ['shǒu', 'zhū', 'dài', 'tù'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '兔', pinyin: 'tù', radical: '儿', radicalMeaning: 'Legs', definition: 'Rabbit - waiting by a tree stump for rabbits (idiom: waiting for luck)' },
    options: [
      { value: '兔', pinyin: 'tù', radical: '儿', radicalMeaning: 'Legs', explanation: 'Rabbit - the farmer waited for another rabbit!' },
      { value: '免', pinyin: 'miǎn', radical: '儿', radicalMeaning: 'Legs', explanation: 'Exempt - looks similar but no dot on top!' },
      { value: '象', pinyin: 'xiàng', radical: '豕', radicalMeaning: 'Pig', explanation: 'Elephant - wrong animal entirely!' },
    ],
    hint: 'Guard tree, wait for ___. What animal crashed into the tree stump?', distractorType: 'shape-similar',
  },
  {
    id: 'g3-013', grade: 3, scenario: 'At the Hospital',
    blocks: [dlg('Doctor', ['你', '需', '要', '多', '喝', '___', '，', '好', '好', '休', '息', '。'], ['nǐ', 'xū', 'yào', 'duō', 'hē', 'shuǐ', '', 'hǎo', 'hǎo', 'xiū', 'xī', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '水', pinyin: 'shuǐ', radical: '水', radicalMeaning: 'Water', definition: 'Water - the essential drink' },
    options: [
      { value: '水', pinyin: 'shuǐ', radical: '水', radicalMeaning: 'Water', explanation: 'Water - drink more water to recover!' },
      { value: '冰', pinyin: 'bīng', radical: '冫', radicalMeaning: 'Ice', explanation: 'Ice - frozen water, too cold when sick!' },
      { value: '汁', pinyin: 'zhī', radical: '氵', radicalMeaning: 'Water', explanation: 'Juice - has water radical but means juice!' },
    ],
    hint: 'The doctor says drink more ___.', distractorType: 'visual',
  },
  {
    id: 'g3-014', grade: 3, scenario: 'Writing Practice',
    blocks: [t(['老', '师', '说', '我', '的', '___', '写', '得', '很', '好', '。'], ['lǎo', 'shī', 'shuō', 'wǒ', 'de', 'zì', 'xiě', 'de', 'hěn', 'hǎo', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '字', pinyin: 'zì', radical: '宀', radicalMeaning: 'Roof', definition: 'Character/Word - written Chinese character' },
    options: [
      { value: '字', pinyin: 'zì', radical: '宀', radicalMeaning: 'Roof', explanation: 'Character - a child under a roof learns to write!' },
      { value: '自', pinyin: 'zì', radical: '自', radicalMeaning: 'Self', explanation: 'Self - same sound but means yourself!' },
      { value: '子', pinyin: 'zǐ', radical: '子', radicalMeaning: 'Child', explanation: 'Child - looks similar but just means child!' },
    ],
    hint: 'Teacher says my written CHARACTERS are good.', distractorType: 'homophone',
  },
  {
    id: 'g3-015', grade: 3, scenario: 'The Library',
    blocks: [t(['图', '书', '___', '里', '有', '很', '多', '好', '看', '的', '书', '。'], ['tú', 'shū', 'guǎn', 'lǐ', 'yǒu', 'hěn', 'duō', 'hǎo', 'kàn', 'de', 'shū', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '馆', pinyin: 'guǎn', radical: '饣', radicalMeaning: 'Food', definition: 'Hall/Building - a place for a purpose (library, restaurant)' },
    options: [
      { value: '馆', pinyin: 'guǎn', radical: '饣', radicalMeaning: 'Food', explanation: 'Hall - a building for books!' },
      { value: '管', pinyin: 'guǎn', radical: '竹', radicalMeaning: 'Bamboo', explanation: 'Manage/Tube - to control, not a building!' },
      { value: '关', pinyin: 'guān', radical: '八', radicalMeaning: 'Eight', explanation: 'Close - to shut, not a place!' },
    ],
    hint: 'The library (图书___) is a HALL for books.', distractorType: 'homophone',
  },
];
