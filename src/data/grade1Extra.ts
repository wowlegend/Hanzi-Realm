import { Level, ContentBlock, PinyinChar } from '../types';

function p(chars: string[], pinyins: string[]): PinyinChar[] {
  return chars.map((char, i) => ({ char, pinyin: pinyins[i] || '', isMissing: false }));
}

function t(chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'text', segments: p(chars, pinyins) };
}

function poem(chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'poem', segments: p(chars, pinyins) };
}

function dlg(speaker: string, chars: string[], pinyins: string[]): ContentBlock {
  return { type: 'dialogue', speaker, avatarSeed: speaker, segments: p(chars, pinyins) };
}

export const grade1Extra: Level[] = [
  {
    id: 'g1-006', grade: 1, scenario: 'Count to Three',
    blocks: [t(['___', '二', '三', '，', '开', '始', '跑', '！'], ['yī', 'èr', 'sān', '', 'kāi', 'shǐ', 'pǎo', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '一', pinyin: 'yī', radical: '一', radicalMeaning: 'One', definition: 'One - a single horizontal stroke' },
    options: [
      { value: '一', pinyin: 'yī', radical: '一', explanation: 'One stroke = one!' },
      { value: '二', pinyin: 'èr', radical: '二', explanation: 'Two strokes = two!' },
      { value: '十', pinyin: 'shí', radical: '十', explanation: 'Ten - a cross shape!' },
    ],
    hint: 'The simplest character - just one stroke!', distractorType: 'visual',
  },
  {
    id: 'g1-007', grade: 1, scenario: 'Going Up',
    blocks: [t(['小', '猫', '爬', '到', '了', '树', '___', '。'], ['xiǎo', 'māo', 'pá', 'dào', 'le', 'shù', 'shàng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '上', pinyin: 'shàng', radical: '一', radicalMeaning: 'One', definition: 'Up/On - above, on top of' },
    options: [
      { value: '上', pinyin: 'shàng', radical: '一', explanation: 'Up! The line points upward!' },
      { value: '下', pinyin: 'xià', radical: '一', explanation: 'Down - the opposite direction!' },
      { value: '中', pinyin: 'zhōng', radical: '丨', explanation: 'Middle - not up or down!' },
    ],
    hint: 'The cat climbed UP the tree!', distractorType: 'visual',
  },
  {
    id: 'g1-008', grade: 1, scenario: 'My Family',
    blocks: [t(['我', '爱', '我', '的', '___', '___', '。'], ['wǒ', 'ài', 'wǒ', 'de', 'mā', 'ma', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '妈', pinyin: 'mā', radical: '女', radicalMeaning: 'Woman', definition: 'Mom - mother, female parent' },
    options: [
      { value: '妈', pinyin: 'mā', radical: '女', radicalMeaning: 'Woman', explanation: 'Mom has the woman radical (女)!' },
      { value: '马', pinyin: 'mǎ', radical: '马', radicalMeaning: 'Horse', explanation: 'Horse - same sound, different meaning!' },
      { value: '吗', pinyin: 'ma', radical: '口', radicalMeaning: 'Mouth', explanation: 'Question particle - not a person!' },
    ],
    hint: 'Mom is a woman (女) - look for that radical!', distractorType: 'homophone',
  },
  {
    id: 'g1-009', grade: 1, scenario: 'Red Lantern',
    blocks: [t(['灯', '笼', '是', '___', '色', '的', '。'], ['dēng', 'lóng', 'shì', 'hóng', 'sè', 'de', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '红', pinyin: 'hóng', radical: '纟', radicalMeaning: 'Silk', definition: 'Red - the color of luck and joy' },
    options: [
      { value: '红', pinyin: 'hóng', radical: '纟', radicalMeaning: 'Silk', explanation: 'Red like silk thread (纟)!' },
      { value: '蓝', pinyin: 'lán', radical: '艹', radicalMeaning: 'Grass', explanation: 'Blue - wrong color for lanterns!' },
      { value: '白', pinyin: 'bái', radical: '白', explanation: 'White - not the lantern color!' },
    ],
    hint: 'Chinese lanterns are always this lucky color!', distractorType: 'visual',
  },
  {
    id: 'g1-010', grade: 1, scenario: 'Look at the Moon',
    blocks: [poem(['床', '前', '明', '___', '光', '。'], ['chuáng', 'qián', 'míng', 'yuè', 'guāng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '月', pinyin: 'yuè', radical: '月', radicalMeaning: 'Moon', definition: 'Moon - the night sky light' },
    options: [
      { value: '月', pinyin: 'yuè', radical: '月', radicalMeaning: 'Moon', explanation: 'Moon shines bright at night!' },
      { value: '日', pinyin: 'rì', radical: '日', radicalMeaning: 'Sun', explanation: 'Sun - shines during the day!' },
      { value: '目', pinyin: 'mù', radical: '目', radicalMeaning: 'Eye', explanation: 'Eye - looks similar to moon!' },
    ],
    hint: 'Li Bai sees this shining at night - it is round and bright!', distractorType: 'visual',
  },
  {
    id: 'g1-011', grade: 1, scenario: 'Little Fish',
    blocks: [t(['小', '___', '在', '水', '里', '游', '。'], ['xiǎo', 'yú', 'zài', 'shuǐ', 'lǐ', 'yóu', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '鱼', pinyin: 'yú', radical: '鱼', radicalMeaning: 'Fish', definition: 'Fish - lives in water' },
    options: [
      { value: '鱼', pinyin: 'yú', radical: '鱼', radicalMeaning: 'Fish', explanation: 'Fish swims in the water!' },
      { value: '鸟', pinyin: 'niǎo', radical: '鸟', radicalMeaning: 'Bird', explanation: 'Bird - flies in the sky, not water!' },
      { value: '虫', pinyin: 'chóng', radical: '虫', radicalMeaning: 'Insect', explanation: 'Bug - crawls on the ground!' },
    ],
    hint: 'What animal swims in water?', distractorType: 'visual',
  },
  {
    id: 'g1-012', grade: 1, scenario: 'Using My Hands',
    blocks: [t(['我', '用', '___', '写', '字', '。'], ['wǒ', 'yòng', 'shǒu', 'xiě', 'zì', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '手', pinyin: 'shǒu', radical: '手', radicalMeaning: 'Hand', definition: 'Hand - used to hold and write' },
    options: [
      { value: '手', pinyin: 'shǒu', radical: '手', radicalMeaning: 'Hand', explanation: 'Hand writes characters!' },
      { value: '足', pinyin: 'zú', radical: '足', radicalMeaning: 'Foot', explanation: 'Foot - used for walking, not writing!' },
      { value: '口', pinyin: 'kǒu', radical: '口', radicalMeaning: 'Mouth', explanation: 'Mouth - used for speaking!' },
    ],
    hint: 'You use this body part to write characters!', distractorType: 'visual',
  },
  {
    id: 'g1-013', grade: 1, scenario: 'Mountain View',
    blocks: [t(['远', '处', '有', '一', '座', '高', '___', '。'], ['yuǎn', 'chù', 'yǒu', 'yī', 'zuò', 'gāo', 'shān', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '山', pinyin: 'shān', radical: '山', radicalMeaning: 'Mountain', definition: 'Mountain - tall land formation' },
    options: [
      { value: '山', pinyin: 'shān', radical: '山', radicalMeaning: 'Mountain', explanation: 'Mountain looks like three peaks!' },
      { value: '石', pinyin: 'shí', radical: '石', radicalMeaning: 'Stone', explanation: 'Stone - part of a mountain but smaller!' },
      { value: '土', pinyin: 'tǔ', radical: '土', radicalMeaning: 'Earth', explanation: 'Earth/Soil - flat, not tall!' },
    ],
    hint: 'The character looks like three mountain peaks!', distractorType: 'visual',
  },
  {
    id: 'g1-014', grade: 1, scenario: 'Open the Door',
    blocks: [t(['请', '开', '___', '。'], ['qǐng', 'kāi', 'mén', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '门', pinyin: 'mén', radical: '门', radicalMeaning: 'Door', definition: 'Door - entrance to a room' },
    options: [
      { value: '门', pinyin: 'mén', radical: '门', radicalMeaning: 'Door', explanation: 'Door - the character looks like a gate!' },
      { value: '们', pinyin: 'men', radical: '亻', radicalMeaning: 'Person', explanation: 'Plural suffix - similar sound!' },
      { value: '问', pinyin: 'wèn', radical: '门', radicalMeaning: 'Door', explanation: 'Ask - has door radical but different!' },
    ],
    hint: 'The character looks like a pair of swinging doors!', distractorType: 'homophone',
  },
  {
    id: 'g1-015', grade: 1, scenario: 'Flower Garden',
    blocks: [t(['花', '园', '里', '的', '___', '真', '美', '。'], ['huā', 'yuán', 'lǐ', 'de', 'huā', 'zhēn', 'měi', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '花', pinyin: 'huā', radical: '艹', radicalMeaning: 'Grass/Plant', definition: 'Flower - beautiful plant bloom' },
    options: [
      { value: '花', pinyin: 'huā', radical: '艹', radicalMeaning: 'Grass/Plant', explanation: 'Flower has the plant radical (艹)!' },
      { value: '草', pinyin: 'cǎo', radical: '艹', radicalMeaning: 'Grass/Plant', explanation: 'Grass - also a plant but not as pretty!' },
      { value: '化', pinyin: 'huà', radical: '亻', explanation: 'Change - same sound but different!' },
    ],
    hint: 'Beautiful blooming plants with the grass radical (艹)!', distractorType: 'visual',
  },
  {
    id: 'g1-016', grade: 1, scenario: 'Driving a Car',
    blocks: [t(['爸', '爸', '开', '___', '送', '我', '上', '学', '。'], ['bà', 'ba', 'kāi', 'chē', 'sòng', 'wǒ', 'shàng', 'xué', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '车', pinyin: 'chē', radical: '车', radicalMeaning: 'Vehicle', definition: 'Car/Vehicle - transportation' },
    options: [
      { value: '车', pinyin: 'chē', radical: '车', radicalMeaning: 'Vehicle', explanation: 'Car - looks like a vehicle from above!' },
      { value: '东', pinyin: 'dōng', radical: '一', explanation: 'East - looks similar but means direction!' },
      { value: '书', pinyin: 'shū', radical: '⺷', explanation: 'Book - similar shape but different!' },
    ],
    hint: 'Dad drives this to take you to school!', distractorType: 'visual',
  },
  {
    id: 'g1-017', grade: 1, scenario: 'Eyes See',
    blocks: [t(['用', '___', '睛', '看', '世', '界', '。'], ['yòng', 'yǎn', 'jīng', 'kàn', 'shì', 'jiè', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '眼', pinyin: 'yǎn', radical: '目', radicalMeaning: 'Eye', definition: 'Eye - organ of sight' },
    options: [
      { value: '眼', pinyin: 'yǎn', radical: '目', radicalMeaning: 'Eye', explanation: 'Eye has the eye radical (目)!' },
      { value: '耳', pinyin: 'ěr', radical: '耳', radicalMeaning: 'Ear', explanation: 'Ear - for listening, not seeing!' },
      { value: '言', pinyin: 'yán', radical: '言', explanation: 'Speech - similar sound but different!' },
    ],
    hint: 'This body part has the eye radical (目)!', distractorType: 'visual',
  },
  {
    id: 'g1-018', grade: 1, scenario: 'Rainy Day',
    blocks: [t(['今', '天', '下', '___', '了', '。'], ['jīn', 'tiān', 'xià', 'yǔ', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '雨', pinyin: 'yǔ', radical: '雨', radicalMeaning: 'Rain', definition: 'Rain - water falling from sky' },
    options: [
      { value: '雨', pinyin: 'yǔ', radical: '雨', radicalMeaning: 'Rain', explanation: 'Rain - drops falling from clouds!' },
      { value: '雪', pinyin: 'xuě', radical: '雨', radicalMeaning: 'Rain', explanation: 'Snow - frozen, not liquid!' },
      { value: '电', pinyin: 'diàn', radical: '田', explanation: 'Electricity - related to storms!' },
    ],
    hint: 'Water drops falling from the sky!', distractorType: 'visual',
  },
  {
    id: 'g1-019', grade: 1, scenario: 'Going Home',
    blocks: [t(['放', '学', '后', '我', '___', '家', '。'], ['fàng', 'xué', 'hòu', 'wǒ', 'huí', 'jiā', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '回', pinyin: 'huí', radical: '囗', radicalMeaning: 'Enclosure', definition: 'Return - go back home' },
    options: [
      { value: '回', pinyin: 'huí', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Return - going back inside the box!' },
      { value: '国', pinyin: 'guó', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Country - also has enclosure radical!' },
      { value: '因', pinyin: 'yīn', radical: '囗', radicalMeaning: 'Enclosure', explanation: 'Because - different meaning!' },
    ],
    hint: 'Going back inside (囗) - returning!', distractorType: 'visual',
  },
  {
    id: 'g1-020', grade: 1, scenario: 'Tasty Fruit',
    blocks: [t(['这', '个', '苹', '___', '很', '甜', '。'], ['zhè', 'gè', 'píng', 'guǒ', 'hěn', 'tián', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '果', pinyin: 'guǒ', radical: '木', radicalMeaning: 'Wood/Tree', definition: 'Fruit - grows on trees' },
    options: [
      { value: '果', pinyin: 'guǒ', radical: '木', radicalMeaning: 'Wood/Tree', explanation: 'Fruit grows on trees (木)!' },
      { value: '课', pinyin: 'kè', radical: '讠', explanation: 'Lesson - different meaning!' },
      { value: '裹', pinyin: 'guǒ', radical: '衣', explanation: 'Wrap - same sound but different!' },
    ],
    hint: 'Fruit grows on trees - look for the wood radical (木)!', distractorType: 'homophone',
  },
  {
    id: 'g1-021', grade: 1, scenario: 'Reading Books',
    blocks: [t(['我', '喜', '欢', '看', '___', '。'], ['wǒ', 'xǐ', 'huān', 'kàn', 'shū', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '书', pinyin: 'shū', radical: '⺷', definition: 'Book - written pages bound together' },
    options: [
      { value: '书', pinyin: 'shū', radical: '⺷', explanation: 'Book - pages of knowledge!' },
      { value: '画', pinyin: 'huà', radical: '田', explanation: 'Drawing/Painting - pictures, not words!' },
      { value: '鱼', pinyin: 'yú', radical: '鱼', explanation: 'Fish - you look at it but do not read it!' },
    ],
    hint: 'What do you read to learn new things?', distractorType: 'visual',
  },
  {
    id: 'g1-022', grade: 1, scenario: 'Counting Sheep',
    blocks: [t(['草', '地', '上', '有', '三', '只', '___', '。'], ['cǎo', 'dì', 'shàng', 'yǒu', 'sān', 'zhī', 'yáng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '羊', pinyin: 'yáng', radical: '羊', radicalMeaning: 'Sheep', definition: 'Sheep - fluffy farm animal' },
    options: [
      { value: '羊', pinyin: 'yáng', radical: '羊', radicalMeaning: 'Sheep', explanation: 'Sheep - the character has horns on top!' },
      { value: '牛', pinyin: 'niú', radical: '牛', radicalMeaning: 'Ox', explanation: 'Cow/Ox - bigger farm animal!' },
      { value: '马', pinyin: 'mǎ', radical: '马', radicalMeaning: 'Horse', explanation: 'Horse - you ride it, not count it on grass!' },
    ],
    hint: 'Fluffy animals with horns - the character shows horns on top!', distractorType: 'visual',
  },
  {
    id: 'g1-023', grade: 1, scenario: 'Tall and Short',
    blocks: [t(['哥', '哥', '高', '，', '弟', '弟', '___', '。'], ['gē', 'ge', 'gāo', '', 'dì', 'di', 'ǐ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '矮', pinyin: 'ǎi', radical: '矢', radicalMeaning: 'Arrow', definition: 'Short - not tall in height' },
    options: [
      { value: '矮', pinyin: 'ǎi', radical: '矢', radicalMeaning: 'Arrow', explanation: 'Short - opposite of tall!' },
      { value: '高', pinyin: 'gāo', radical: '高', explanation: 'Tall - that is the brother, not little brother!' },
      { value: '小', pinyin: 'xiǎo', radical: '小', explanation: 'Small - about size, not height!' },
    ],
    hint: 'The opposite of tall!', distractorType: 'visual',
  },
  {
    id: 'g1-024', grade: 1, scenario: 'Drinking Milk',
    blocks: [t(['早', '上', '我', '喝', '___', '。'], ['zǎo', 'shàng', 'wǒ', 'hē', 'nǎi', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '奶', pinyin: 'nǎi', radical: '女', radicalMeaning: 'Woman', definition: 'Milk - drink from mother' },
    options: [
      { value: '奶', pinyin: 'nǎi', radical: '女', radicalMeaning: 'Woman', explanation: 'Milk - has the woman radical (女)!' },
      { value: '水', pinyin: 'shuǐ', radical: '水', explanation: 'Water - a different drink!' },
      { value: '茶', pinyin: 'chá', radical: '艹', explanation: 'Tea - adults drink this!' },
    ],
    hint: 'Morning drink with the woman radical (女)!', distractorType: 'visual',
  },
  {
    id: 'g1-025', grade: 1, scenario: 'Writing Characters',
    blocks: [t(['老', '师', '教', '我', '写', '___', '。'], ['lǎo', 'shī', 'jiāo', 'wǒ', 'xiě', 'zì', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '字', pinyin: 'zì', radical: '宀', radicalMeaning: 'Roof', definition: 'Character/Word - written symbol' },
    options: [
      { value: '字', pinyin: 'zì', radical: '宀', radicalMeaning: 'Roof', explanation: 'Character - a child (子) under a roof (宀)!' },
      { value: '子', pinyin: 'zǐ', radical: '子', radicalMeaning: 'Child', explanation: 'Child - part of the character but not it!' },
      { value: '学', pinyin: 'xué', radical: '子', explanation: 'Study - related but different!' },
    ],
    hint: 'A child (子) learning under a roof (宀)!', distractorType: 'visual',
  },
  {
    id: 'g1-026', grade: 1, scenario: 'Many or Few',
    blocks: [t(['今', '天', '人', '很', '___', '。'], ['jīn', 'tiān', 'rén', 'hěn', 'duō', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '多', pinyin: 'duō', radical: '夕', radicalMeaning: 'Evening', definition: 'Many/Much - a large number' },
    options: [
      { value: '多', pinyin: 'duō', radical: '夕', explanation: 'Many - two evenings stacked up = a lot!' },
      { value: '少', pinyin: 'shǎo', radical: '小', explanation: 'Few - the opposite meaning!' },
      { value: '夕', pinyin: 'xī', radical: '夕', explanation: 'Evening - looks similar but different!' },
    ],
    hint: 'Two evening (夕) symbols stacked = a lot!', distractorType: 'visual',
  },
  {
    id: 'g1-027', grade: 1, scenario: 'White Cloud',
    blocks: [t(['天', '上', '有', '___', '云', '。'], ['tiān', 'shàng', 'yǒu', 'bái', 'yún', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '白', pinyin: 'bái', radical: '白', radicalMeaning: 'White', definition: 'White - the color of clouds and snow' },
    options: [
      { value: '白', pinyin: 'bái', radical: '白', explanation: 'White - pure and clean like clouds!' },
      { value: '百', pinyin: 'bǎi', radical: '白', explanation: 'Hundred - similar look but a number!' },
      { value: '自', pinyin: 'zì', radical: '自', explanation: 'Self - similar shape but different!' },
    ],
    hint: 'Clouds are this color!', distractorType: 'visual',
  },
  {
    id: 'g1-028', grade: 1, scenario: 'Dad is Strong',
    blocks: [t(['我', '的', '___', '___', '很', '高', '大', '。'], ['wǒ', 'de', 'bà', 'ba', 'hěn', 'gāo', 'dà', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '爸', pinyin: 'bà', radical: '父', radicalMeaning: 'Father', definition: 'Dad - father, male parent' },
    options: [
      { value: '爸', pinyin: 'bà', radical: '父', radicalMeaning: 'Father', explanation: 'Dad has the father radical (父)!' },
      { value: '妈', pinyin: 'mā', radical: '女', radicalMeaning: 'Woman', explanation: 'Mom - the other parent!' },
      { value: '把', pinyin: 'bǎ', radical: '扌', explanation: 'Grab - same sound, wrong meaning!' },
    ],
    hint: 'Male parent - has the father radical (父)!', distractorType: 'homophone',
  },
  {
    id: 'g1-029', grade: 1, scenario: 'Under the Tree',
    blocks: [t(['我', '坐', '在', '树', '___', '乘', '凉', '。'], ['wǒ', 'zuò', 'zài', 'shù', 'xià', 'chéng', 'liáng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '下', pinyin: 'xià', radical: '一', radicalMeaning: 'One', definition: 'Down/Under - below something' },
    options: [
      { value: '下', pinyin: 'xià', radical: '一', explanation: 'Under - the stroke points downward!' },
      { value: '上', pinyin: 'shàng', radical: '一', explanation: 'Up/On - the opposite direction!' },
      { value: '不', pinyin: 'bù', radical: '一', explanation: 'Not - different meaning entirely!' },
    ],
    hint: 'Sitting below the tree, in the shade!', distractorType: 'visual',
  },
  {
    id: 'g1-030', grade: 1, scenario: 'Spring is Here',
    blocks: [poem(['___', '来', '了', '，', '花', '开', '了', '。'], ['chūn', 'lái', 'le', '', 'huā', 'kāi', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '春', pinyin: 'chūn', radical: '日', radicalMeaning: 'Sun', definition: 'Spring - the season of new growth' },
    options: [
      { value: '春', pinyin: 'chūn', radical: '日', radicalMeaning: 'Sun', explanation: 'Spring has the sun (日) warming the earth!' },
      { value: '秋', pinyin: 'qiū', radical: '禾', explanation: 'Autumn - leaves fall, not bloom!' },
      { value: '冬', pinyin: 'dōng', radical: '夂', explanation: 'Winter - too cold for flowers!' },
    ],
    hint: 'The warm season when flowers bloom - has the sun (日)!', distractorType: 'visual',
  },
  {
    id: 'g1-031', grade: 1, scenario: 'Come Here',
    blocks: [dlg('Mom', ['快', '___', '这', '里', '！'], ['kuài', 'lái', 'zhè', 'lǐ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '来', pinyin: 'lái', radical: '木', radicalMeaning: 'Wood', definition: 'Come - move toward the speaker' },
    options: [
      { value: '来', pinyin: 'lái', radical: '木', explanation: 'Come here - move toward me!' },
      { value: '去', pinyin: 'qù', radical: '厶', explanation: 'Go - move away, the opposite!' },
      { value: '在', pinyin: 'zài', radical: '土', explanation: 'At/In - staying in place!' },
    ],
    hint: 'Mom wants you to move toward her!', distractorType: 'visual',
  },
  {
    id: 'g1-032', grade: 1, scenario: 'Learning at School',
    blocks: [t(['我', '在', '___', '校', '学', '习', '。'], ['wǒ', 'zài', 'xué', 'xiào', 'xué', 'xí', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '学', pinyin: 'xué', radical: '子', radicalMeaning: 'Child', definition: 'Study/Learn - gain knowledge' },
    options: [
      { value: '学', pinyin: 'xué', radical: '子', radicalMeaning: 'Child', explanation: 'Study - a child (子) learning!' },
      { value: '觉', pinyin: 'jué', radical: '见', explanation: 'Feel/Aware - similar look but different!' },
      { value: '穴', pinyin: 'xué', radical: '穴', explanation: 'Cave - same sound, wrong meaning!' },
    ],
    hint: 'A child (子) gaining knowledge!', distractorType: 'homophone',
  },
  {
    id: 'g1-033', grade: 1, scenario: 'Hungry Tummy',
    blocks: [t(['我', '饿', '了', '，', '想', '___', '饭', '。'], ['wǒ', 'è', 'le', '', 'xiǎng', 'chī', 'fàn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '吃', pinyin: 'chī', radical: '口', radicalMeaning: 'Mouth', definition: 'Eat - consume food' },
    options: [
      { value: '吃', pinyin: 'chī', radical: '口', radicalMeaning: 'Mouth', explanation: 'Eat with your mouth (口)!' },
      { value: '喝', pinyin: 'hē', radical: '口', radicalMeaning: 'Mouth', explanation: 'Drink - liquids, not food!' },
      { value: '叫', pinyin: 'jiào', radical: '口', explanation: 'Call/Shout - also uses mouth but different!' },
    ],
    hint: 'Using your mouth (口) to consume food!', distractorType: 'visual',
  },
  {
    id: 'g1-034', grade: 1, scenario: 'Five Fingers',
    blocks: [t(['一', '只', '手', '有', '___', '个', '手', '指', '。'], ['yī', 'zhī', 'shǒu', 'yǒu', 'wǔ', 'gè', 'shǒu', 'zhǐ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '五', pinyin: 'wǔ', radical: '一', definition: 'Five - the number 5' },
    options: [
      { value: '五', pinyin: 'wǔ', radical: '一', explanation: 'Five fingers on one hand!' },
      { value: '四', pinyin: 'sì', radical: '囗', explanation: 'Four - one too few!' },
      { value: '六', pinyin: 'liù', radical: '八', explanation: 'Six - one too many!' },
    ],
    hint: 'Count your fingers on one hand!', distractorType: 'visual',
  },
  {
    id: 'g1-035', grade: 1, scenario: 'Looking at Stars',
    blocks: [poem(['天', '上', '有', '很', '多', '___', '星', '。'], ['tiān', 'shàng', 'yǒu', 'hěn', 'duō', 'xiǎo', 'xīng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '小', pinyin: 'xiǎo', radical: '小', radicalMeaning: 'Small', definition: 'Small/Little - tiny in size' },
    options: [
      { value: '小', pinyin: 'xiǎo', radical: '小', radicalMeaning: 'Small', explanation: 'Small - the character shows something tiny!' },
      { value: '大', pinyin: 'dà', radical: '大', explanation: 'Big - the opposite of small!' },
      { value: '少', pinyin: 'shǎo', radical: '小', explanation: 'Few - similar look but about quantity!' },
    ],
    hint: 'Stars look tiny from far away!', distractorType: 'visual',
  },
];
