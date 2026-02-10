import { Level, PinyinChar, ContentBlock } from '../types';
import { grade1Extra } from './grade1Extra';
import { grade2Extra } from './grade2Extra';

function createPinyinSegments(chars: string[], pinyins: string[], missingIndex?: number): PinyinChar[] {
  return chars.map((char, i) => ({
    char,
    pinyin: pinyins[i] || '',
    isMissing: i === missingIndex,
  }));
}

function createTextBlock(chars: string[], pinyins: string[]): ContentBlock {
  return {
    type: 'text',
    segments: createPinyinSegments(chars, pinyins),
  };
}

function createDialogueBlock(speaker: string, chars: string[], pinyins: string[]): ContentBlock {
  return {
    type: 'dialogue',
    speaker,
    avatarSeed: speaker,
    segments: createPinyinSegments(chars, pinyins),
  };
}

function createIdiomBlock(chars: string[], pinyins: string[]): ContentBlock {
  return {
    type: 'idiom',
    segments: createPinyinSegments(chars, pinyins),
  };
}

function createPoemBlock(chars: string[], pinyins: string[]): ContentBlock {
  return {
    type: 'poem',
    segments: createPinyinSegments(chars, pinyins),
  };
}

const grade1Levels: Level[] = [
  {
    id: 'g1-001',
    grade: 1,
    scenario: 'The Crow Drinks Water',
    blocks: [
      createTextBlock(
        ['乌', '鸦', '口', '渴', '了', '，', '它', '找', '到', '了', '一', '瓶', '___', '。'],
        ['wū', 'yā', 'kǒu', 'kě', 'le', '', 'tā', 'zhǎo', 'dào', 'le', 'yī', 'píng', 'shuǐ', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [12],
    correctAnswer: {
      value: '水',
      pinyin: 'shuǐ',
      radical: '水',
      radicalMeaning: 'Water',
      definition: 'Water - liquid that flows',
    },
    options: [
      { value: '水', pinyin: 'shuǐ', radical: '水', radicalMeaning: 'Water', explanation: 'Correct! Water flows like drops.' },
      { value: '火', pinyin: 'huǒ', radical: '火', radicalMeaning: 'Fire', explanation: 'Fire burns, not for drinking!' },
      { value: '土', pinyin: 'tǔ', radical: '土', radicalMeaning: 'Earth', explanation: 'Soil/earth - not drinkable!' },
    ],
    hint: 'The radical looks like flowing drops (水)',
    distractorType: 'visual',
  },
  {
    id: 'g1-002',
    grade: 1,
    scenario: 'Big Apple',
    blocks: [
      createTextBlock(
        ['这', '个', '苹', '果', '很', '___', '。'],
        ['zhè', 'gè', 'píng', 'guǒ', 'hěn', 'dà', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [5],
    correctAnswer: {
      value: '大',
      pinyin: 'dà',
      radical: '大',
      radicalMeaning: 'Big',
      definition: 'Big - large in size',
    },
    options: [
      { value: '大', pinyin: 'dà', radical: '大', explanation: 'A person spreading arms wide = BIG!' },
      { value: '人', pinyin: 'rén', radical: '人', explanation: 'Person standing - not size' },
      { value: '天', pinyin: 'tiān', radical: '大', explanation: 'Sky above - not describing apple' },
    ],
    hint: 'Picture a person spreading their arms wide!',
    distractorType: 'visual',
  },
  {
    id: 'g1-003',
    grade: 1,
    scenario: 'Puppy Friend',
    blocks: [
      createTextBlock(
        ['我', '有', '一', '只', '小', '___', '。'],
        ['wǒ', 'yǒu', 'yī', 'zhī', 'xiǎo', 'gǒu', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [5],
    correctAnswer: {
      value: '狗',
      pinyin: 'gǒu',
      radical: '犭',
      radicalMeaning: 'Dog/Animal',
      definition: 'Dog - loyal pet animal',
    },
    options: [
      { value: '狗', pinyin: 'gǒu', radical: '犭', radicalMeaning: 'Animal', explanation: 'Woof! Dog has the animal radical (犭)!' },
      { value: '猫', pinyin: 'māo', radical: '犭', radicalMeaning: 'Animal', explanation: 'Cat - also an animal but says meow!' },
      { value: '鸟', pinyin: 'niǎo', radical: '鸟', radicalMeaning: 'Bird', explanation: 'Bird - flies in the sky!' },
    ],
    hint: 'Look for the animal radical (犭) on the left!',
    distractorType: 'visual',
  },
  {
    id: 'g1-004',
    grade: 1,
    scenario: 'Good Weather',
    blocks: [
      createTextBlock(
        ['今', '天', '天', '气', '很', '___', '。'],
        ['jīn', 'tiān', 'tiān', 'qì', 'hěn', 'hǎo', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [5],
    correctAnswer: {
      value: '好',
      pinyin: 'hǎo',
      radical: '女',
      radicalMeaning: 'Woman',
      definition: 'Good - woman with child means good',
    },
    options: [
      { value: '好', pinyin: 'hǎo', radical: '女', explanation: 'Woman (女) + Child (子) = GOOD!' },
      { value: '坏', pinyin: 'huài', radical: '土', explanation: 'Bad - the opposite meaning!' },
      { value: '老', pinyin: 'lǎo', radical: '耂', explanation: 'Old - describes age, not quality' },
    ],
    hint: 'A woman with her child is always good!',
    distractorType: 'visual',
  },
  {
    id: 'g1-005',
    grade: 1,
    scenario: 'Spring Poem',
    blocks: [
      createPoemBlock(
        ['春', '眠', '不', '觉', '___', '。'],
        ['chūn', 'mián', 'bù', 'jué', 'xiǎo', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [4],
    correctAnswer: {
      value: '晓',
      pinyin: 'xiǎo',
      radical: '日',
      radicalMeaning: 'Sun',
      definition: 'Dawn - when the sun rises',
    },
    options: [
      { value: '晓', pinyin: 'xiǎo', radical: '日', radicalMeaning: 'Sun', explanation: 'Dawn has the sun radical (日)!' },
      { value: '小', pinyin: 'xiǎo', radical: '小', radicalMeaning: 'Small', explanation: 'Small - same sound but wrong meaning!' },
      { value: '少', pinyin: 'shǎo', radical: '小', radicalMeaning: 'Small', explanation: 'Few/less - different tone and meaning!' },
    ],
    hint: 'The answer has the sun (日) radical - when does the sun rise?',
    distractorType: 'visual',
  },
];

const grade2Levels: Level[] = [
  {
    id: 'g2-001',
    grade: 2,
    scenario: 'Forest Walk',
    blocks: [
      createTextBlock(
        ['森', '林', '里', '有', '很', '多', '___', '。'],
        ['sēn', 'lín', 'lǐ', 'yǒu', 'hěn', 'duō', 'shù', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [6],
    correctAnswer: {
      value: '树',
      pinyin: 'shù',
      radical: '木',
      radicalMeaning: 'Wood/Tree',
      definition: 'Tree - tall plant with trunk',
    },
    options: [
      { value: '树', pinyin: 'shù', radical: '木', explanation: 'Tree has the wood radical (木)!' },
      { value: '书', pinyin: 'shū', radical: '⺷', explanation: 'Book - same sound, different meaning!' },
      { value: '鼠', pinyin: 'shǔ', radical: '鼠', explanation: 'Mouse - an animal, not a plant!' },
    ],
    hint: 'Look for the wood radical (木)!',
    distractorType: 'homophone',
  },
  {
    id: 'g2-002',
    grade: 2,
    scenario: 'Birthday Cake',
    blocks: [
      createTextBlock(
        ['我', '想', '___', '蛋', '糕', '。'],
        ['wǒ', 'xiǎng', 'chī', 'dàn', 'gāo', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [2],
    correctAnswer: {
      value: '吃',
      pinyin: 'chī',
      radical: '口',
      radicalMeaning: 'Mouth',
      definition: 'Eat - to consume food',
    },
    options: [
      { value: '吃', pinyin: 'chī', radical: '口', radicalMeaning: 'Mouth', explanation: 'Eat with your MOUTH (口)!' },
      { value: '七', pinyin: 'qī', radical: '一', explanation: 'Seven - a number, not an action!' },
      { value: '次', pinyin: 'cì', radical: '欠', explanation: 'Times/Order - different meaning!' },
    ],
    hint: 'The radical shows a MOUTH (口) - what do you do with your mouth?',
    distractorType: 'visual',
  },
  {
    id: 'g2-003',
    grade: 2,
    scenario: 'Run Fast',
    blocks: [
      createTextBlock(
        ['快', '___', '！', '比', '赛', '开', '始', '了', '！'],
        ['kuài', 'pǎo', '', 'bǐ', 'sài', 'kāi', 'shǐ', 'le', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [1],
    correctAnswer: {
      value: '跑',
      pinyin: 'pǎo',
      radical: '⻊',
      radicalMeaning: 'Foot',
      definition: 'Run - move quickly with legs',
    },
    options: [
      { value: '跑', pinyin: 'pǎo', radical: '⻊', radicalMeaning: 'Foot', explanation: 'Run with your FEET (⻊)!' },
      { value: '泡', pinyin: 'pào', radical: '氵', radicalMeaning: 'Water', explanation: 'Bubble - same sound but wrong radical!' },
      { value: '炮', pinyin: 'pào', radical: '火', radicalMeaning: 'Fire', explanation: 'Cannon - same sound but fire related!' },
    ],
    hint: 'Running uses your feet - look for the foot radical (⻊)!',
    distractorType: 'homophone',
  },
  {
    id: 'g2-004',
    grade: 2,
    scenario: 'I See Rainbow',
    blocks: [
      createTextBlock(
        ['我', '___', '到', '了', '彩', '虹', '。'],
        ['wǒ', 'kàn', 'dào', 'le', 'cǎi', 'hóng', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [1],
    correctAnswer: {
      value: '看',
      pinyin: 'kàn',
      radical: '目',
      radicalMeaning: 'Eye',
      definition: 'Look/See - use eyes to perceive',
    },
    options: [
      { value: '看', pinyin: 'kàn', radical: '目', radicalMeaning: 'Eye', explanation: 'See with your EYES (目)!' },
      { value: '干', pinyin: 'gàn', radical: '干', explanation: 'Dry/Do - different meaning!' },
      { value: '刊', pinyin: 'kān', radical: '刂', radicalMeaning: 'Knife', explanation: 'Publication - similar sound but wrong!' },
    ],
    hint: 'The character has the eye radical (目)!',
    distractorType: 'homophone',
  },
  {
    id: 'g2-005',
    grade: 2,
    scenario: 'Please Sit',
    blocks: [
      createTextBlock(
        ['请', '___', '下', '。'],
        ['qǐng', 'zuò', 'xià', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [1],
    correctAnswer: {
      value: '坐',
      pinyin: 'zuò',
      radical: '土',
      radicalMeaning: 'Earth',
      definition: 'Sit - rest on a surface',
    },
    options: [
      { value: '坐', pinyin: 'zuò', radical: '土', radicalMeaning: 'Earth', explanation: 'Sit on the ground (土)!' },
      { value: '做', pinyin: 'zuò', radical: '亻', radicalMeaning: 'Person', explanation: 'Do/Make - same sound, different action!' },
      { value: '座', pinyin: 'zuò', radical: '广', radicalMeaning: 'Shelter', explanation: 'Seat (noun) - same sound, but a thing!' },
    ],
    hint: 'Sitting down relates to earth/ground (土)!',
    distractorType: 'homophone',
  },
];

const grade3Levels: Level[] = [
  {
    id: 'g3-001',
    grade: 3,
    scenario: 'Mom and Child Talk',
    blocks: [
      createDialogueBlock('Mom',
        ['今', '天', '作', '业', '多', '吗', '？'],
        ['jīn', 'tiān', 'zuò', 'yè', 'duō', 'ma', '']
      ),
      createDialogueBlock('Child',
        ['不', '多', '，', '我', '已', '经', '___', '了', '。'],
        ['bù', 'duō', '', 'wǒ', 'yǐ', 'jīng', 'wán', 'le', '']
      ),
    ],
    targetBlockIndex: 1,
    missingSegmentIndices: [6],
    correctAnswer: {
      value: '完',
      pinyin: 'wán',
      radical: '宀',
      radicalMeaning: 'Roof',
      definition: 'Finish/Complete - to end something',
    },
    options: [
      { value: '完', pinyin: 'wán', radical: '宀', explanation: 'Complete/Finish the task!' },
      { value: '玩', pinyin: 'wán', radical: '王', radicalMeaning: 'King/Jade', explanation: 'Play - same sound but different meaning!' },
      { value: '晚', pinyin: 'wǎn', radical: '日', radicalMeaning: 'Sun', explanation: 'Late/Evening - similar sound!' },
    ],
    hint: 'Finishing something happens under a roof (宀)!',
    distractorType: 'homophone',
  },
  {
    id: 'g3-002',
    grade: 3,
    scenario: 'Teacher and Student',
    blocks: [
      createDialogueBlock('Teacher',
        ['这', '道', '题', '谁', '会', '？'],
        ['zhè', 'dào', 'tí', 'shuí', 'huì', '']
      ),
      createDialogueBlock('Student',
        ['老', '师', '，', '我', '___', '。'],
        ['lǎo', 'shī', '', 'wǒ', 'huì', '']
      ),
    ],
    targetBlockIndex: 1,
    missingSegmentIndices: [4],
    correctAnswer: {
      value: '会',
      pinyin: 'huì',
      radical: '人',
      radicalMeaning: 'Person',
      definition: 'Can/Know how to - ability',
    },
    options: [
      { value: '会', pinyin: 'huì', radical: '人', explanation: 'Know how to / Can do it!' },
      { value: '回', pinyin: 'huí', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Return - similar sound but wrong meaning!' },
      { value: '汇', pinyin: 'huì', radical: '氵', radicalMeaning: 'Water', explanation: 'Gather/Remit - same sound!' },
    ],
    hint: 'This expresses ability - people (人) can do things!',
    distractorType: 'homophone',
  },
  {
    id: 'g3-003',
    grade: 3,
    scenario: 'Swimming Pool',
    blocks: [
      createTextBlock(
        ['我', '喜', '欢', '___', '泳', '。'],
        ['wǒ', 'xǐ', 'huān', 'yóu', 'yǒng', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '游',
      pinyin: 'yóu',
      radical: '氵',
      radicalMeaning: 'Water',
      definition: 'Swim - move through water',
    },
    options: [
      { value: '游', pinyin: 'yóu', radical: '氵', radicalMeaning: 'Water', explanation: 'Swim in WATER (氵)!' },
      { value: '油', pinyin: 'yóu', radical: '氵', radicalMeaning: 'Water', explanation: 'Oil - same sound and radical but different!' },
      { value: '由', pinyin: 'yóu', radical: '田', radicalMeaning: 'Field', explanation: 'From/Reason - same sound!' },
    ],
    hint: 'Swimming involves water - look for (氵)!',
    distractorType: 'homophone',
  },
  {
    id: 'g3-004',
    grade: 3,
    scenario: 'Art Class',
    blocks: [
      createTextBlock(
        ['她', '正', '在', '___', '一', '幅', '画', '。'],
        ['tā', 'zhèng', 'zài', 'huà', 'yī', 'fú', 'huà', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '画',
      pinyin: 'huà',
      radical: '田',
      radicalMeaning: 'Field',
      definition: 'Draw/Paint - create art',
    },
    options: [
      { value: '画', pinyin: 'huà', radical: '田', explanation: 'Draw/Paint - the action of creating art!' },
      { value: '话', pinyin: 'huà', radical: '讠', radicalMeaning: 'Speech', explanation: 'Words/Speech - same sound!' },
      { value: '化', pinyin: 'huà', radical: '亻', radicalMeaning: 'Person', explanation: 'Change/Transform - same sound!' },
    ],
    hint: 'Drawing originally related to marking fields (田)!',
    distractorType: 'homophone',
  },
  {
    id: 'g3-005',
    grade: 3,
    scenario: 'Beautiful Butterfly',
    blocks: [
      createTextBlock(
        ['美', '丽', '的', '___', '在', '飞', '。'],
        ['měi', 'lì', 'de', 'hú', 'zài', 'fēi', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '蝴蝶',
      pinyin: 'húdié',
      radical: '虫',
      radicalMeaning: 'Insect',
      definition: 'Butterfly - beautiful flying insect',
    },
    options: [
      { value: '蝴蝶', pinyin: 'húdié', radical: '虫', radicalMeaning: 'Insect', explanation: 'Butterfly has insect radical (虫)!' },
      { value: '蜜蜂', pinyin: 'mìfēng', radical: '虫', radicalMeaning: 'Insect', explanation: 'Bee - also an insect but buzzes!' },
      { value: '蜻蜓', pinyin: 'qīngtíng', radical: '虫', radicalMeaning: 'Insect', explanation: 'Dragonfly - different flying insect!' },
    ],
    hint: 'Flying insects have the bug radical (虫)!',
    distractorType: 'visual',
  },
];

const grade4Levels: Level[] = [
  {
    id: 'g4-001',
    grade: 4,
    scenario: 'Volcano Eruption',
    blocks: [
      createTextBlock(
        ['火', '山', '___', '了', '！'],
        ['huǒ', 'shān', 'bào', 'le', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [2],
    correctAnswer: {
      value: '爆发',
      pinyin: 'bàofā',
      radical: '火',
      radicalMeaning: 'Fire',
      definition: 'Erupt - explosive release',
    },
    options: [
      { value: '爆发', pinyin: 'bàofā', radical: '火', explanation: 'Erupt has explosive fire (火)!' },
      { value: '发生', pinyin: 'fāshēng', radical: '又', explanation: 'Happen - too general!' },
      { value: '喷出', pinyin: 'pēnchū', radical: '口', explanation: 'Spray out - lacks intensity!' },
    ],
    hint: 'Volcanoes explode with fire (火)!',
    distractorType: 'visual',
  },
  {
    id: 'g4-002',
    grade: 4,
    scenario: 'Ocean Rescue',
    blocks: [
      createTextBlock(
        ['快', '___', '！', '水', '太', '深', '了', '！'],
        ['kuài', 'fú', '', 'shuǐ', 'tài', 'shēn', 'le', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [1],
    correctAnswer: {
      value: '浮',
      pinyin: 'fú',
      radical: '氵',
      radicalMeaning: 'Water',
      definition: 'Float - stay on water surface',
    },
    options: [
      { value: '浮', pinyin: 'fú', radical: '氵', radicalMeaning: 'Water', explanation: 'Float on WATER (氵)!' },
      { value: '符', pinyin: 'fú', radical: '竹', radicalMeaning: 'Bamboo', explanation: 'Symbol/Sign - same sound!' },
      { value: '富', pinyin: 'fù', radical: '宀', radicalMeaning: 'Roof', explanation: 'Rich - similar sound but wrong!' },
    ],
    hint: 'Floating happens in water (氵)!',
    distractorType: 'homophone',
  },
  {
    id: 'g4-003',
    grade: 4,
    scenario: 'Doctor and Patient',
    blocks: [
      createDialogueBlock('Doctor',
        ['你', '哪', '里', '不', '___', '？'],
        ['nǐ', 'nǎ', 'lǐ', 'bù', 'shū', '']
      ),
      createDialogueBlock('Patient',
        ['我', '头', '很', '疼', '。'],
        ['wǒ', 'tóu', 'hěn', 'téng', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [4],
    correctAnswer: {
      value: '舒服',
      pinyin: 'shūfú',
      radical: '舌',
      radicalMeaning: 'Tongue',
      definition: 'Comfortable - feeling well',
    },
    options: [
      { value: '舒服', pinyin: 'shūfú', radical: '舌', explanation: 'Comfortable - feeling well!' },
      { value: '书法', pinyin: 'shūfǎ', radical: '⺷', explanation: 'Calligraphy - same first sound!' },
      { value: '输入', pinyin: 'shūrù', radical: '车', explanation: 'Input - same first sound!' },
    ],
    hint: 'Comfort relates to the body feeling good!',
    distractorType: 'homophone',
  },
  {
    id: 'g4-004',
    grade: 4,
    scenario: 'Sharp Sword',
    blocks: [
      createTextBlock(
        ['这', '把', '___', '很', '锋', '利', '。'],
        ['zhè', 'bǎ', 'jiàn', 'hěn', 'fēng', 'lì', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [2],
    correctAnswer: {
      value: '剑',
      pinyin: 'jiàn',
      radical: '刂',
      radicalMeaning: 'Knife',
      definition: 'Sword - bladed weapon',
    },
    options: [
      { value: '剑', pinyin: 'jiàn', radical: '刂', radicalMeaning: 'Knife', explanation: 'Sword has the knife radical (刂)!' },
      { value: '箭', pinyin: 'jiàn', radical: '⺮', radicalMeaning: 'Bamboo', explanation: 'Arrow - same sound but made of bamboo!' },
      { value: '见', pinyin: 'jiàn', radical: '见', explanation: 'See - same sound but not a weapon!' },
    ],
    hint: 'Swords cut - look for the knife radical (刂)!',
    distractorType: 'homophone',
  },
  {
    id: 'g4-005',
    grade: 4,
    scenario: 'Rocket Launch',
    blocks: [
      createTextBlock(
        ['火', '箭', '准', '备', '___', '了', '。'],
        ['huǒ', 'jiàn', 'zhǔn', 'bèi', 'qǐ', 'le', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [4],
    correctAnswer: {
      value: '起飞',
      pinyin: 'qǐfēi',
      radical: '走',
      radicalMeaning: 'Walk',
      definition: 'Take off - leave the ground',
    },
    options: [
      { value: '起飞', pinyin: 'qǐfēi', radical: '走', explanation: 'Take off - rise and fly!' },
      { value: '降落', pinyin: 'jiàngluò', radical: '阝', explanation: 'Land - the opposite!' },
      { value: '飞行', pinyin: 'fēixíng', radical: '飞', explanation: 'Flying - already in air!' },
    ],
    hint: 'Before flying, you must rise (起) first!',
    distractorType: 'visual',
  },
];

const grade5Levels: Level[] = [
  {
    id: 'g5-001',
    grade: 5,
    scenario: 'Complete the Idiom: Hard Work',
    blocks: [
      createIdiomBlock(
        ['勤', '学', '苦', '___'],
        ['qín', 'xué', 'kǔ', 'liàn']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '练',
      pinyin: 'liàn',
      radical: '纟',
      radicalMeaning: 'Silk/Thread',
      definition: 'Practice - repeated training',
    },
    options: [
      { value: '练', pinyin: 'liàn', radical: '纟', explanation: 'Practice - like weaving threads (纟)!' },
      { value: '炼', pinyin: 'liàn', radical: '火', radicalMeaning: 'Fire', explanation: 'Temper/Refine - same sound but with fire!' },
      { value: '恋', pinyin: 'liàn', radical: '心', radicalMeaning: 'Heart', explanation: 'Love - same sound but about feelings!' },
    ],
    hint: 'Practice is like weaving skill (纟 thread radical)!',
    distractorType: 'shape-similar',
  },
  {
    id: 'g5-002',
    grade: 5,
    scenario: 'Complete the Idiom: Perseverance',
    blocks: [
      createIdiomBlock(
        ['坚', '持', '不', '___'],
        ['jiān', 'chí', 'bù', 'xiè']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '懈',
      pinyin: 'xiè',
      radical: '忄',
      radicalMeaning: 'Heart',
      definition: 'Slack/Relax - to let up',
    },
    options: [
      { value: '懈', pinyin: 'xiè', radical: '忄', radicalMeaning: 'Heart', explanation: 'Never slack - heart (忄) stays strong!' },
      { value: '解', pinyin: 'jiě', radical: '角', radicalMeaning: 'Horn', explanation: 'Understand/Solve - similar but different!' },
      { value: '械', pinyin: 'xiè', radical: '木', radicalMeaning: 'Wood', explanation: 'Weapon/Tool - same sound!' },
    ],
    hint: 'Perseverance is about the heart (忄) not giving up!',
    distractorType: 'shape-similar',
  },
  {
    id: 'g5-003',
    grade: 5,
    scenario: 'Theater Performance',
    blocks: [
      createTextBlock(
        ['观', '众', '们', '热', '烈', '地', '___', '。'],
        ['guān', 'zhòng', 'men', 'rè', 'liè', 'de', 'gǔ', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [6],
    correctAnswer: {
      value: '鼓掌',
      pinyin: 'gǔzhǎng',
      radical: '鼓',
      radicalMeaning: 'Drum',
      definition: 'Applaud - clap hands together',
    },
    options: [
      { value: '鼓掌', pinyin: 'gǔzhǎng', radical: '鼓', explanation: 'Applaud - drum (鼓) with palms (掌)!' },
      { value: '欢呼', pinyin: 'huānhū', radical: '欠', explanation: 'Cheer - vocal, not hand action!' },
      { value: '尖叫', pinyin: 'jiānjiào', radical: '小', explanation: 'Scream - too loud for applause!' },
    ],
    hint: 'Applause sounds like drumming (鼓)!',
    distractorType: 'visual',
  },
  {
    id: 'g5-004',
    grade: 5,
    scenario: 'Science Lab',
    blocks: [
      createTextBlock(
        ['科', '学', '家', '正', '在', '___', '新', '药', '。'],
        ['kē', 'xué', 'jiā', 'zhèng', 'zài', 'yán', 'xīn', 'yào', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [5],
    correctAnswer: {
      value: '研究',
      pinyin: 'yánjiū',
      radical: '石',
      radicalMeaning: 'Stone',
      definition: 'Research - systematic study',
    },
    options: [
      { value: '研究', pinyin: 'yánjiū', radical: '石', explanation: 'Research - grind (研) stone to find truth!' },
      { value: '发现', pinyin: 'fāxiàn', radical: '又', explanation: 'Discover - finding something new!' },
      { value: '实验', pinyin: 'shíyàn', radical: '宀', explanation: 'Experiment - testing, not studying!' },
    ],
    hint: 'Research is like grinding (研) to reveal truth!',
    distractorType: 'visual',
  },
  {
    id: 'g5-005',
    grade: 5,
    scenario: 'Complete the Idiom: Learn Tirelessly',
    blocks: [
      createIdiomBlock(
        ['学', '而', '不', '___'],
        ['xué', 'ér', 'bù', 'yàn']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '厌',
      pinyin: 'yàn',
      radical: '厂',
      radicalMeaning: 'Cliff',
      definition: 'Tired of/Bored - to dislike',
    },
    options: [
      { value: '厌', pinyin: 'yàn', radical: '厂', explanation: 'Never tired of learning!' },
      { value: '验', pinyin: 'yàn', radical: '马', radicalMeaning: 'Horse', explanation: 'Test/Verify - same sound!' },
      { value: '艳', pinyin: 'yàn', radical: '色', radicalMeaning: 'Color', explanation: 'Gorgeous - same sound but about beauty!' },
    ],
    hint: 'This means never getting bored of learning!',
    distractorType: 'homophone',
  },
];

const grade6Levels: Level[] = [
  {
    id: 'g6-001',
    grade: 6,
    scenario: 'Complete the Idiom: Restless',
    blocks: [
      createIdiomBlock(
        ['心', '浮', '气', '___'],
        ['xīn', 'fú', 'qì', 'zào']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '躁',
      pinyin: 'zào',
      radical: '足',
      radicalMeaning: 'Foot',
      definition: 'Restless/Impatient - agitated state',
    },
    options: [
      { value: '躁', pinyin: 'zào', radical: '足', radicalMeaning: 'Foot', explanation: 'Restless feet (足) = impatient!' },
      { value: '燥', pinyin: 'zào', radical: '火', radicalMeaning: 'Fire', explanation: 'Dry (fire) - same sound, wrong meaning!' },
      { value: '噪', pinyin: 'zào', radical: '口', radicalMeaning: 'Mouth', explanation: 'Noisy - same sound but about sound!' },
    ],
    hint: 'Being restless makes your feet (足) want to move!',
    distractorType: 'shape-similar',
  },
  {
    id: 'g6-002',
    grade: 6,
    scenario: 'Complete the Idiom: True Feelings',
    blocks: [
      createIdiomBlock(
        ['情', '真', '意', '___'],
        ['qíng', 'zhēn', 'yì', 'qiè']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '切',
      pinyin: 'qiè',
      radical: '刀',
      radicalMeaning: 'Knife',
      definition: 'Sincere/Earnest - deeply felt',
    },
    options: [
      { value: '切', pinyin: 'qiè', radical: '刀', explanation: 'Earnest - cuts (刀) to the heart!' },
      { value: '窃', pinyin: 'qiè', radical: '穴', radicalMeaning: 'Cave', explanation: 'Steal - same sound but negative!' },
      { value: '且', pinyin: 'qiě', radical: '一', explanation: 'And/Moreover - similar but different tone!' },
    ],
    hint: 'True feelings cut (刀) deep into the heart!',
    distractorType: 'shape-similar',
  },
  {
    id: 'g6-003',
    grade: 6,
    scenario: 'Difficult Choice',
    blocks: [
      createTextBlock(
        ['他', '___', '了', '很', '久', '才', '决', '定', '。'],
        ['tā', 'yóu', 'le', 'hěn', 'jiǔ', 'cái', 'jué', 'dìng', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [1],
    correctAnswer: {
      value: '犹豫',
      pinyin: 'yóuyù',
      radical: '犭',
      radicalMeaning: 'Dog',
      definition: 'Hesitate - be uncertain',
    },
    options: [
      { value: '犹豫', pinyin: 'yóuyù', radical: '犭', explanation: 'Hesitate - like a cautious animal (犭)!' },
      { value: '果断', pinyin: 'guǒduàn', radical: '木', explanation: 'Decisive - the opposite meaning!' },
      { value: '优雅', pinyin: 'yōuyǎ', radical: '亻', explanation: 'Elegant - similar sound!' },
    ],
    hint: 'Hesitation is like an animal (犭) being cautious!',
    distractorType: 'homophone',
  },
  {
    id: 'g6-004',
    grade: 6,
    scenario: 'Ancient Wisdom',
    blocks: [
      createTextBlock(
        ['孔', '子', '的', '思', '想', '___', '了', '中', '国', '文', '化', '。'],
        ['kǒng', 'zǐ', 'de', 'sī', 'xiǎng', 'yǐng', 'le', 'zhōng', 'guó', 'wén', 'huà', '']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [5],
    correctAnswer: {
      value: '影响',
      pinyin: 'yǐngxiǎng',
      radical: '彡',
      radicalMeaning: 'Hair/Light',
      definition: 'Influence - have effect on',
    },
    options: [
      { value: '影响', pinyin: 'yǐngxiǎng', radical: '彡', explanation: 'Influence casts like a shadow (影)!' },
      { value: '改变', pinyin: 'gǎibiàn', radical: '己', explanation: 'Change - more direct action!' },
      { value: '创造', pinyin: 'chuàngzào', radical: '刂', explanation: 'Create - making something new!' },
    ],
    hint: 'Influence spreads like a shadow (影)!',
    distractorType: 'visual',
  },
  {
    id: 'g6-005',
    grade: 6,
    scenario: 'Complete the Idiom: Bright Future',
    blocks: [
      createIdiomBlock(
        ['前', '程', '似', '___'],
        ['qián', 'chéng', 'sì', 'jǐn']
      ),
    ],
    targetBlockIndex: 0,
    missingSegmentIndices: [3],
    correctAnswer: {
      value: '锦',
      pinyin: 'jǐn',
      radical: '钅',
      radicalMeaning: 'Metal/Gold',
      definition: 'Brocade - beautiful silk fabric',
    },
    options: [
      { value: '锦', pinyin: 'jǐn', radical: '钅', explanation: 'Brocade - golden (钅) beautiful future!' },
      { value: '紧', pinyin: 'jǐn', radical: '糸', radicalMeaning: 'Silk', explanation: 'Tight - same sound!' },
      { value: '仅', pinyin: 'jǐn', radical: '亻', radicalMeaning: 'Person', explanation: 'Only - same sound but limiting!' },
    ],
    hint: 'A bright future is like golden (钅) brocade!',
    distractorType: 'homophone',
  },
];

export const beijingCurriculum: Record<number, Level[]> = {
  1: [...grade1Levels, ...grade1Extra],
  2: [...grade2Levels, ...grade2Extra],
  3: grade3Levels,
  4: grade4Levels,
  5: grade5Levels,
  6: grade6Levels,
};

export function getLevelsForGrade(grade: number): Level[] {
  return beijingCurriculum[grade] || beijingCurriculum[1];
}

export function getRandomLevelsForGrade(grade: number, count: number, seenIds: Set<number | string>): Level[] {
  const allLevels = getLevelsForGrade(grade);
  const availableLevels = allLevels.filter(l => !seenIds.has(l.id));

  const levelsToUse = availableLevels.length >= count ? availableLevels : allLevels;

  const shuffled = [...levelsToUse].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  selected.forEach(l => seenIds.add(l.id));

  return selected;
}

export function getFullSentenceFromLevel(level: Level): string {
  let sentence = '';
  for (const block of level.blocks) {
    for (let i = 0; i < block.segments.length; i++) {
      const seg = block.segments[i];
      if (block === level.blocks[level.targetBlockIndex] && level.missingSegmentIndices.includes(i)) {
        sentence += level.correctAnswer.value;
      } else {
        sentence += seg.char;
      }
    }
  }
  return sentence;
}
