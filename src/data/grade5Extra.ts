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

function poem(chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'poem', segments: p(chars, pinyins) };
}

export const grade5Extra: Level[] = [
  {
    id: 'g5-006', grade: 5, scenario: 'Complete the Idiom: Calm Mind',
    blocks: [idiom(['心', '平', '气', '___'], ['xīn', 'píng', 'qì', 'hé'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '和', pinyin: 'hé', radical: '口', radicalMeaning: 'Mouth', definition: 'Harmony/Peace - calm and balanced' },
    options: [
      { value: '和', pinyin: 'hé', radical: '口', radicalMeaning: 'Mouth', explanation: 'Harmony - a calm mouth (口) speaks peacefully!' },
      { value: '河', pinyin: 'hé', radical: '氵', radicalMeaning: 'Water', explanation: 'River - same sound but water related!' },
      { value: '合', pinyin: 'hé', radical: '口', radicalMeaning: 'Mouth', explanation: 'Combine - similar but means joining!' },
    ],
    hint: 'A calm heart and peaceful ___. Think of harmony.', distractorType: 'homophone',
  },
  {
    id: 'g5-007', grade: 5, scenario: 'Historical Battle',
    blocks: [t(['将', '军', '___', '领', '士', '兵', '冲', '锋', '陷', '阵', '。'], ['jiāng', 'jūn', 'shuài', 'lǐng', 'shì', 'bīng', 'chōng', 'fēng', 'xiàn', 'zhèn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '率', pinyin: 'shuài', radical: '玄', radicalMeaning: 'Profound', definition: 'Lead/Command - to head an army' },
    options: [
      { value: '率', pinyin: 'shuài', radical: '玄', radicalMeaning: 'Profound', explanation: 'Lead - the general commands the troops!' },
      { value: '帅', pinyin: 'shuài', radical: '巾', radicalMeaning: 'Cloth', explanation: 'Handsome/Commander - same sound, different character!' },
      { value: '摔', pinyin: 'shuāi', radical: '扌', radicalMeaning: 'Hand', explanation: 'Fall - to tumble down, not lead!' },
    ],
    hint: 'The general ___ the soldiers into battle.', distractorType: 'homophone',
  },
  {
    id: 'g5-008', grade: 5, scenario: 'The Wise Elder',
    blocks: [dlg('Grandfather', ['做', '人', '要', '___', '虚', '，', '不', '能', '骄', '傲', '。'], ['zuò', 'rén', 'yào', 'qiān', 'xū', '', 'bù', 'néng', 'jiāo', 'ào', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '谦', pinyin: 'qiān', radical: '讠', radicalMeaning: 'Speech', definition: 'Modest/Humble - speaking humbly' },
    options: [
      { value: '谦', pinyin: 'qiān', radical: '讠', radicalMeaning: 'Speech', explanation: 'Modest - humble speech (讠) shows character!' },
      { value: '签', pinyin: 'qiān', radical: '⺮', radicalMeaning: 'Bamboo', explanation: 'Sign/Lottery - same sound, different meaning!' },
      { value: '千', pinyin: 'qiān', radical: '十', radicalMeaning: 'Ten', explanation: 'Thousand - a number, not modesty!' },
    ],
    hint: 'Being ___ and humble is a virtue.', distractorType: 'homophone',
  },
  {
    id: 'g5-009', grade: 5, scenario: 'Complete the Idiom: Overwhelming',
    blocks: [idiom(['排', '山', '倒', '___'], ['pái', 'shān', 'dǎo', 'hǎi'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '海', pinyin: 'hǎi', radical: '氵', radicalMeaning: 'Water', definition: 'Sea/Ocean - vast body of water' },
    options: [
      { value: '海', pinyin: 'hǎi', radical: '氵', radicalMeaning: 'Water', explanation: 'Sea - overturn mountains and seas, unstoppable force!' },
      { value: '害', pinyin: 'hài', radical: '宀', radicalMeaning: 'Roof', explanation: 'Harm - similar sound but destructive!' },
      { value: '还', pinyin: 'hái', radical: '辶', radicalMeaning: 'Walk', explanation: 'Return - similar sound, wrong context!' },
    ],
    hint: 'Push mountains, topple ___. An overwhelming force!', distractorType: 'homophone',
  },
  {
    id: 'g5-010', grade: 5, scenario: 'Environmental Essay',
    blocks: [t(['我', '们', '应', '该', '___', '惜', '每', '一', '滴', '水', '。'], ['wǒ', 'men', 'yīng', 'gāi', 'zhēn', 'xī', 'měi', 'yī', 'dī', 'shuǐ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '珍', pinyin: 'zhēn', radical: '王', radicalMeaning: 'Jade/King', definition: 'Treasure/Cherish - to value highly' },
    options: [
      { value: '珍', pinyin: 'zhēn', radical: '王', radicalMeaning: 'Jade/King', explanation: 'Cherish - treat water as precious jade (王)!' },
      { value: '真', pinyin: 'zhēn', radical: '目', radicalMeaning: 'Eye', explanation: 'True/Real - same sound but about truth!' },
      { value: '针', pinyin: 'zhēn', radical: '钅', radicalMeaning: 'Metal', explanation: 'Needle - same sound, a sewing tool!' },
    ],
    hint: 'We should ___ every drop of water. Treat it like jade!', distractorType: 'homophone',
  },
  {
    id: 'g5-011', grade: 5, scenario: 'Complete the Idiom: First Impression',
    blocks: [idiom(['刮', '目', '相', '___'], ['guā', 'mù', 'xiāng', 'kàn'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '看', pinyin: 'kàn', radical: '目', radicalMeaning: 'Eye', definition: 'Look/See - to view with new eyes' },
    options: [
      { value: '看', pinyin: 'kàn', radical: '目', radicalMeaning: 'Eye', explanation: 'Look - see someone with fresh eyes (目)!' },
      { value: '砍', pinyin: 'kǎn', radical: '石', radicalMeaning: 'Stone', explanation: 'Chop - similar sound but violent!' },
      { value: '刊', pinyin: 'kān', radical: '刂', radicalMeaning: 'Knife', explanation: 'Publish - similar sound, different field!' },
    ],
    hint: 'Scrub eyes and ___ anew. To see someone differently!', distractorType: 'homophone',
  },
  {
    id: 'g5-012', grade: 5, scenario: 'Mountain Expedition',
    blocks: [t(['登', '山', '队', '员', '克', '服', '了', '重', '重', '___', '难', '。'], ['dēng', 'shān', 'duì', 'yuán', 'kè', 'fú', 'le', 'chóng', 'chóng', 'kùn', 'nán', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [9],
    correctAnswer: { value: '困', pinyin: 'kùn', radical: '囗', radicalMeaning: 'Enclosure', definition: 'Difficult/Trapped - surrounded by obstacles' },
    options: [
      { value: '困', pinyin: 'kùn', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Trapped - enclosed (囗) by obstacles!' },
      { value: '捆', pinyin: 'kǔn', radical: '扌', radicalMeaning: 'Hand', explanation: 'Bundle/Tie - similar but about binding!' },
      { value: '昆', pinyin: 'kūn', radical: '日', radicalMeaning: 'Sun', explanation: 'Kunlun - a mountain name, not difficulty!' },
    ],
    hint: 'Climbers overcame layers of ___. Think of being enclosed.', distractorType: 'homophone',
  },
  {
    id: 'g5-013', grade: 5, scenario: 'Poetry Recitation',
    blocks: [poem(['两', '个', '黄', '___', '鸣', '翠', '柳', '。'], ['liǎng', 'gè', 'huáng', 'lí', 'míng', 'cuì', 'liǔ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '鹂', pinyin: 'lí', radical: '鸟', radicalMeaning: 'Bird', definition: 'Oriole - a golden songbird' },
    options: [
      { value: '鹂', pinyin: 'lí', radical: '鸟', radicalMeaning: 'Bird', explanation: 'Oriole - a bird (鸟) singing in the willows!' },
      { value: '梨', pinyin: 'lí', radical: '木', radicalMeaning: 'Wood', explanation: 'Pear - a fruit tree, not a bird!' },
      { value: '离', pinyin: 'lí', radical: '离', radicalMeaning: 'Separate', explanation: 'Leave - to depart, not a creature!' },
    ],
    hint: 'Two golden ___ sing in the green willows. Look for the bird radical!', distractorType: 'homophone',
  },
  {
    id: 'g5-014', grade: 5, scenario: 'School Debate',
    blocks: [dlg('Student', ['我', '认', '为', '这', '个', '观', '___', '是', '正', '确', '的', '。'], ['wǒ', 'rèn', 'wéi', 'zhè', 'gè', 'guān', 'diǎn', 'shì', 'zhèng', 'què', 'de', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '点', pinyin: 'diǎn', radical: '灬', radicalMeaning: 'Fire dots', definition: 'Point/View - a perspective or opinion' },
    options: [
      { value: '点', pinyin: 'diǎn', radical: '灬', radicalMeaning: 'Fire dots', explanation: 'Point - a viewpoint, a spot of light!' },
      { value: '店', pinyin: 'diàn', radical: '广', radicalMeaning: 'Shelter', explanation: 'Store - similar sound, a shop!' },
      { value: '电', pinyin: 'diàn', radical: '田', radicalMeaning: 'Field', explanation: 'Electricity - similar sound, different concept!' },
    ],
    hint: 'I believe this view___ is correct.', distractorType: 'homophone',
  },
  {
    id: 'g5-015', grade: 5, scenario: 'Complete the Idiom: Extraordinary',
    blocks: [idiom(['出', '类', '拔', '___'], ['chū', 'lèi', 'bá', 'cuì'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '萃', pinyin: 'cuì', radical: '艹', radicalMeaning: 'Grass', definition: 'Essence/Best - the cream of the crop' },
    options: [
      { value: '萃', pinyin: 'cuì', radical: '艹', radicalMeaning: 'Grass', explanation: 'Essence - rises above the grass (艹) like a tall plant!' },
      { value: '翠', pinyin: 'cuì', radical: '羽', radicalMeaning: 'Feather', explanation: 'Green/Jade - same sound but about color!' },
      { value: '脆', pinyin: 'cuì', radical: '月', radicalMeaning: 'Moon/Flesh', explanation: 'Crispy - same sound but about texture!' },
    ],
    hint: 'Rise above the crowd, pull out the ___. The best of the best!', distractorType: 'homophone',
  },
  {
    id: 'g5-016', grade: 5, scenario: 'Ancient Silk Road',
    blocks: [t(['丝', '绸', '之', '路', '___', '通', '了', '东', '西', '方', '文', '化', '。'], ['sī', 'chóu', 'zhī', 'lù', 'gōu', 'tōng', 'le', 'dōng', 'xī', 'fāng', 'wén', 'huà', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '沟', pinyin: 'gōu', radical: '氵', radicalMeaning: 'Water', definition: 'Channel/Connect - a waterway linking two places' },
    options: [
      { value: '沟', pinyin: 'gōu', radical: '氵', radicalMeaning: 'Water', explanation: 'Channel - like water (氵) flowing between East and West!' },
      { value: '购', pinyin: 'gòu', radical: '贝', radicalMeaning: 'Shell', explanation: 'Purchase - about buying, not connecting!' },
      { value: '构', pinyin: 'gòu', radical: '木', radicalMeaning: 'Wood', explanation: 'Structure - about building, not linking!' },
    ],
    hint: 'The Silk Road ___ connected East and West. Think of a channel.', distractorType: 'homophone',
  },
  {
    id: 'g5-017', grade: 5, scenario: 'Art Museum Visit',
    blocks: [t(['这', '幅', '画', '的', '色', '彩', '非', '常', '___', '丽', '。'], ['zhè', 'fú', 'huà', 'de', 'sè', 'cǎi', 'fēi', 'cháng', 'huá', 'lì', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [8],
    correctAnswer: { value: '华', pinyin: 'huá', radical: '十', radicalMeaning: 'Ten', definition: 'Magnificent/Chinese - splendid, gorgeous' },
    options: [
      { value: '华', pinyin: 'huá', radical: '十', radicalMeaning: 'Ten', explanation: 'Magnificent - splendid and gorgeous colors!' },
      { value: '花', pinyin: 'huā', radical: '艹', radicalMeaning: 'Grass', explanation: 'Flower - similar sound but about plants!' },
      { value: '划', pinyin: 'huá', radical: '刂', radicalMeaning: 'Knife', explanation: 'Scratch/Plan - same sound, different idea!' },
    ],
    hint: 'The colors are extremely ___. Magnificent and splendid!', distractorType: 'homophone',
  },
  {
    id: 'g5-018', grade: 5, scenario: 'Complete the Idiom: United Effort',
    blocks: [idiom(['齐', '心', '协', '___'], ['qí', 'xīn', 'xié', 'lì'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '力', pinyin: 'lì', radical: '力', radicalMeaning: 'Strength', definition: 'Strength/Power - combined effort' },
    options: [
      { value: '力', pinyin: 'lì', radical: '力', radicalMeaning: 'Strength', explanation: 'Strength - united hearts and combined power!' },
      { value: '历', pinyin: 'lì', radical: '厂', radicalMeaning: 'Cliff', explanation: 'Experience - same sound but about history!' },
      { value: '利', pinyin: 'lì', radical: '刂', radicalMeaning: 'Knife', explanation: 'Profit/Sharp - same sound but about gain!' },
    ],
    hint: 'United hearts and coordinated ___. Teamwork!', distractorType: 'homophone',
  },
  {
    id: 'g5-019', grade: 5, scenario: 'Geography Lesson',
    blocks: [dlg('Teacher', ['黄', '河', '是', '中', '华', '民', '族', '的', '___', '亲', '河', '。'], ['huáng', 'hé', 'shì', 'zhōng', 'huá', 'mín', 'zú', 'de', 'mǔ', 'qīn', 'hé', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [8],
    correctAnswer: { value: '母', pinyin: 'mǔ', radical: '母', radicalMeaning: 'Mother', definition: 'Mother - nurturing parent figure' },
    options: [
      { value: '母', pinyin: 'mǔ', radical: '母', radicalMeaning: 'Mother', explanation: 'Mother - the Yellow River is the Mother River of China!' },
      { value: '木', pinyin: 'mù', radical: '木', radicalMeaning: 'Wood', explanation: 'Wood - similar sound but about trees!' },
      { value: '目', pinyin: 'mù', radical: '目', radicalMeaning: 'Eye', explanation: 'Eye - similar sound but about seeing!' },
    ],
    hint: 'The Yellow River is the ___ River of the Chinese nation.', distractorType: 'homophone',
  },
  {
    id: 'g5-020', grade: 5, scenario: 'Lunar New Year',
    blocks: [t(['全', '家', '人', '围', '坐', '在', '一', '起', '吃', '团', '___', '饭', '。'], ['quán', 'jiā', 'rén', 'wéi', 'zuò', 'zài', 'yī', 'qǐ', 'chī', 'tuán', 'yuán', 'fàn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [10],
    correctAnswer: { value: '圆', pinyin: 'yuán', radical: '囗', radicalMeaning: 'Enclosure', definition: 'Round/Reunion - circular, complete togetherness' },
    options: [
      { value: '圆', pinyin: 'yuán', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Reunion - the whole family enclosed (囗) together!' },
      { value: '园', pinyin: 'yuán', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Garden - same sound and radical but a park!' },
      { value: '源', pinyin: 'yuán', radical: '氵', radicalMeaning: 'Water', explanation: 'Source - same sound but about origins!' },
    ],
    hint: 'Family sits together for a reunion ___ dinner.', distractorType: 'shape-similar',
  },
];
