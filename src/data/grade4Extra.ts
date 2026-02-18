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

export const grade4Extra: Level[] = [
  {
    id: 'g4-006', grade: 4, scenario: 'Ancient Invention',
    blocks: [t(['中', '国', '人', '___', '明', '了', '造', '纸', '术', '。'], ['zhōng', 'guó', 'rén', 'fā', 'míng', 'le', 'zào', 'zhǐ', 'shù', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '发', pinyin: 'fā', radical: '又', radicalMeaning: 'Again', definition: 'Emit/Develop - to invent, discover' },
    options: [
      { value: '发', pinyin: 'fā', radical: '又', radicalMeaning: 'Again', explanation: 'Invent - Chinese people invented papermaking!' },
      { value: '法', pinyin: 'fǎ', radical: '氵', radicalMeaning: 'Water', explanation: 'Law/Method - a rule, not invention!' },
      { value: '罚', pinyin: 'fá', radical: '网', radicalMeaning: 'Net', explanation: 'Punish - to penalize, wrong context!' },
    ],
    hint: 'The Chinese ___ (invented) papermaking.', distractorType: 'homophone',
  },
  {
    id: 'g4-007', grade: 4, scenario: 'Environmental Protection',
    blocks: [t(['我', '们', '要', '保', '___', '地', '球', '的', '环', '境', '。'], ['wǒ', 'men', 'yào', 'bǎo', 'hù', 'dì', 'qiú', 'de', 'huán', 'jìng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '护', pinyin: 'hù', radical: '扌', radicalMeaning: 'Hand', definition: 'Protect - to guard, defend' },
    options: [
      { value: '护', pinyin: 'hù', radical: '扌', radicalMeaning: 'Hand', explanation: 'Protect - use hands to protect the Earth!' },
      { value: '户', pinyin: 'hù', radical: '户', radicalMeaning: 'Door', explanation: 'Door/Household - a family unit!' },
      { value: '互', pinyin: 'hù', radical: '二', radicalMeaning: 'Two', explanation: 'Mutual - each other, not protection!' },
    ],
    hint: 'We must PROTECT the environment.', distractorType: 'homophone',
  },
  {
    id: 'g4-008', grade: 4, scenario: 'The Great Wall',
    blocks: [t(['长', '城', '是', '世', '界', '上', '最', '___', '的', '建', '筑', '。'], ['cháng', 'chéng', 'shì', 'shì', 'jiè', 'shàng', 'zuì', 'wěi', 'de', 'jiàn', 'zhù', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [7],
    correctAnswer: { value: '伟', pinyin: 'wěi', radical: '亻', radicalMeaning: 'Person', definition: 'Great/Grand - magnificent, extraordinary' },
    options: [
      { value: '伟', pinyin: 'wěi', radical: '亻', radicalMeaning: 'Person', explanation: 'Great - the grandest building in the world!' },
      { value: '围', pinyin: 'wéi', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Surround - to encircle, not grand!' },
      { value: '违', pinyin: 'wéi', radical: '辶', radicalMeaning: 'Walk', explanation: 'Violate - to break rules!' },
    ],
    hint: 'The Great Wall is the most _____ building.', distractorType: 'homophone',
  },
  {
    id: 'g4-009', grade: 4, scenario: 'Science Experiment',
    blocks: [dlg('Teacher', ['这', '个', '实', '___', '需', '要', '很', '小', '心', '。'], ['zhè', 'gè', 'shí', 'yàn', 'xū', 'yào', 'hěn', 'xiǎo', 'xīn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '验', pinyin: 'yàn', radical: '马', radicalMeaning: 'Horse', definition: 'Experiment/Test - to verify through testing' },
    options: [
      { value: '验', pinyin: 'yàn', radical: '马', radicalMeaning: 'Horse', explanation: 'Experiment - testing to verify results!' },
      { value: '严', pinyin: 'yán', radical: '一', radicalMeaning: 'One', explanation: 'Strict - being stern, not testing!' },
      { value: '言', pinyin: 'yán', radical: '言', radicalMeaning: 'Speech', explanation: 'Words - language, not experiments!' },
    ],
    hint: 'This EXPERIMENT requires great care.', distractorType: 'homophone',
  },
  {
    id: 'g4-010', grade: 4, scenario: 'Dream Career',
    blocks: [t(['我', '的', '理', '___', '是', '成', '为', '一', '名', '医', '生', '。'], ['wǒ', 'de', 'lǐ', 'xiǎng', 'shì', 'chéng', 'wéi', 'yì', 'míng', 'yī', 'shēng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '想', pinyin: 'xiǎng', radical: '心', radicalMeaning: 'Heart', definition: 'Think/Dream - ideal, aspiration' },
    options: [
      { value: '想', pinyin: 'xiǎng', radical: '心', radicalMeaning: 'Heart', explanation: 'Dream - an ideal from the heart!' },
      { value: '像', pinyin: 'xiàng', radical: '亻', radicalMeaning: 'Person', explanation: 'Resemble - to look like, not a dream!' },
      { value: '响', pinyin: 'xiǎng', radical: '口', radicalMeaning: 'Mouth', explanation: 'Sound - noise, not aspiration!' },
    ],
    hint: 'My DREAM is to become a doctor.', distractorType: 'homophone',
  },
  {
    id: 'g4-011', grade: 4, scenario: 'Four-character Idiom',
    blocks: [idiom(['画', '蛇', '添', '___'], ['huà', 'shé', 'tiān', 'zú'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '足', pinyin: 'zú', radical: '足', radicalMeaning: 'Foot', definition: 'Foot - drawing feet on a snake (doing something unnecessary)' },
    options: [
      { value: '足', pinyin: 'zú', radical: '足', radicalMeaning: 'Foot', explanation: 'Foot - adding feet to a snake is unnecessary!' },
      { value: '族', pinyin: 'zú', radical: '方', radicalMeaning: 'Square', explanation: 'Clan/Race - same sound, wrong meaning!' },
      { value: '卒', pinyin: 'zú', radical: '十', radicalMeaning: 'Ten', explanation: 'Soldier - a chess piece, not a body part!' },
    ],
    hint: 'Draw snake, add ___. Snakes do not have these!', distractorType: 'homophone',
  },
  {
    id: 'g4-012', grade: 4, scenario: 'Space Exploration',
    blocks: [t(['宇', '___', '员', '在', '太', '空', '中', '飘', '浮', '。'], ['yǔ', 'háng', 'yuán', 'zài', 'tài', 'kōng', 'zhōng', 'piāo', 'fú', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '航', pinyin: 'háng', radical: '舟', radicalMeaning: 'Boat', definition: 'Navigate - to sail, space travel' },
    options: [
      { value: '航', pinyin: 'háng', radical: '舟', radicalMeaning: 'Boat', explanation: 'Navigate - astronauts navigate through space!' },
      { value: '行', pinyin: 'xíng', radical: '行', radicalMeaning: 'Walk', explanation: 'Walk/Travel - general travel, not space!' },
      { value: '杭', pinyin: 'háng', radical: '木', radicalMeaning: 'Wood', explanation: 'Hangzhou - a city name, not navigation!' },
    ],
    hint: 'Astro___s float in space. The boat radical hints at navigation.', distractorType: 'homophone',
  },
  {
    id: 'g4-013', grade: 4, scenario: 'Traditional Festival',
    blocks: [t(['端', '午', '节', '要', '吃', '___', '子', '。'], ['duān', 'wǔ', 'jié', 'yào', 'chī', 'zòng', 'zi', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '粽', pinyin: 'zòng', radical: '米', radicalMeaning: 'Rice', definition: 'Zongzi - sticky rice dumpling wrapped in bamboo leaves' },
    options: [
      { value: '粽', pinyin: 'zòng', radical: '米', radicalMeaning: 'Rice', explanation: 'Zongzi - rice dumplings for Dragon Boat Festival!' },
      { value: '综', pinyin: 'zōng', radical: '纟', radicalMeaning: 'Silk', explanation: 'Comprehensive - a different word entirely!' },
      { value: '总', pinyin: 'zǒng', radical: '心', radicalMeaning: 'Heart', explanation: 'General/Total - not food related!' },
    ],
    hint: 'Dragon Boat Festival food - look for the rice (米) radical!', distractorType: 'homophone',
  },
  {
    id: 'g4-014', grade: 4, scenario: 'Music Class',
    blocks: [dlg('Student', ['我', '最', '喜', '___', '弹', '钢', '琴', '了', '。'], ['wǒ', 'zuì', 'xǐ', 'huān', 'tán', 'gāng', 'qín', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '欢', pinyin: 'huān', radical: '欠', radicalMeaning: 'Yawn', definition: 'Happy/Like - to enjoy, take pleasure in' },
    options: [
      { value: '欢', pinyin: 'huān', radical: '欠', radicalMeaning: 'Yawn', explanation: 'Happy/Like - I love playing piano!' },
      { value: '还', pinyin: 'huán', radical: '辶', radicalMeaning: 'Walk', explanation: 'Return/Still - to give back, not like!' },
      { value: '换', pinyin: 'huàn', radical: '扌', radicalMeaning: 'Hand', explanation: 'Exchange - to swap, not enjoyment!' },
    ],
    hint: 'I LIKE playing piano the most.', distractorType: 'homophone',
  },
  {
    id: 'g4-015', grade: 4, scenario: 'Ancient Poetry',
    blocks: [t(['___', '前', '明', '月', '光', '，', '疑', '是', '地', '上', '霜', '。'], ['chuáng', 'qián', 'míng', 'yuè', 'guāng', '', 'yí', 'shì', 'dì', 'shàng', 'shuāng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '床', pinyin: 'chuáng', radical: '广', radicalMeaning: 'Shelter', definition: 'Bed - before the bed, moonlight shines (Li Bai)' },
    options: [
      { value: '床', pinyin: 'chuáng', radical: '广', radicalMeaning: 'Shelter', explanation: 'Bed - moonlight before the bed, Li Bai famous poem!' },
      { value: '窗', pinyin: 'chuāng', radical: '穴', radicalMeaning: 'Cave', explanation: 'Window - similar sound but wrong character!' },
      { value: '创', pinyin: 'chuàng', radical: '刂', radicalMeaning: 'Knife', explanation: 'Create - to innovate, not furniture!' },
    ],
    hint: 'Li Bai poem: Before the ___, bright moonlight.', distractorType: 'homophone',
  },
];
