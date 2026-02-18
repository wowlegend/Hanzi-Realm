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

export const grade6Extra: Level[] = [
  {
    id: 'g6-006', grade: 6, scenario: 'Complete the Idiom: Knowledgeable',
    blocks: [idiom(['博', '学', '多', '___'], ['bó', 'xué', 'duō', 'cái'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '才', pinyin: 'cái', radical: '扌', radicalMeaning: 'Hand', definition: 'Talent/Ability - gifted person' },
    options: [
      { value: '才', pinyin: 'cái', radical: '扌', radicalMeaning: 'Hand', explanation: 'Talent - broadly learned with many abilities!' },
      { value: '材', pinyin: 'cái', radical: '木', radicalMeaning: 'Wood', explanation: 'Material - same sound but raw substance!' },
      { value: '财', pinyin: 'cái', radical: '贝', radicalMeaning: 'Shell', explanation: 'Wealth - same sound but about money!' },
    ],
    hint: 'Broadly learned, much ___. A well-rounded scholar!', distractorType: 'homophone',
  },
  {
    id: 'g6-007', grade: 6, scenario: 'Philosophical Debate',
    blocks: [t(['真', '理', '越', '___', '越', '明', '。'], ['zhēn', 'lǐ', 'yuè', 'biàn', 'yuè', 'míng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '辩', pinyin: 'biàn', radical: '辛', radicalMeaning: 'Bitter', definition: 'Debate/Argue - to discuss and distinguish' },
    options: [
      { value: '辩', pinyin: 'biàn', radical: '辛', radicalMeaning: 'Bitter', explanation: 'Debate - truth becomes clearer through argument!' },
      { value: '变', pinyin: 'biàn', radical: '又', radicalMeaning: 'Again', explanation: 'Change - same sound but about transformation!' },
      { value: '遍', pinyin: 'biàn', radical: '辶', radicalMeaning: 'Walk', explanation: 'Throughout - same sound but about coverage!' },
    ],
    hint: 'The more you ___ truth, the clearer it becomes.', distractorType: 'homophone',
  },
  {
    id: 'g6-008', grade: 6, scenario: 'Complete the Idiom: Sharp Eyes',
    blocks: [idiom(['明', '察', '秋', '___'], ['míng', 'chá', 'qiū', 'háo'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '毫', pinyin: 'háo', radical: '毛', radicalMeaning: 'Fur/Hair', definition: 'Fine hair - the tiniest detail, extremely perceptive' },
    options: [
      { value: '毫', pinyin: 'háo', radical: '毛', radicalMeaning: 'Fur/Hair', explanation: 'Fine hair - see even the finest autumn fur (毛)!' },
      { value: '好', pinyin: 'hǎo', radical: '女', radicalMeaning: 'Woman', explanation: 'Good - different tone, different meaning!' },
      { value: '豪', pinyin: 'háo', radical: '豕', radicalMeaning: 'Pig', explanation: 'Bold/Grand - same sound but about bravery!' },
    ],
    hint: 'See clearly the autumn ___ of a bird. Extremely sharp observation!', distractorType: 'homophone',
  },
  {
    id: 'g6-009', grade: 6, scenario: 'Historical Novel',
    blocks: [t(['诸', '葛', '亮', '足', '智', '多', '___', '，', '令', '人', '佩', '服', '。'], ['zhū', 'gě', 'liàng', 'zú', 'zhì', 'duō', 'móu', '', 'lìng', 'rén', 'pèi', 'fú', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '谋', pinyin: 'móu', radical: '讠', radicalMeaning: 'Speech', definition: 'Strategy/Plan - cunning schemes and plans' },
    options: [
      { value: '谋', pinyin: 'móu', radical: '讠', radicalMeaning: 'Speech', explanation: 'Strategy - wise speech (讠) forms clever plans!' },
      { value: '某', pinyin: 'mǒu', radical: '木', radicalMeaning: 'Wood', explanation: 'Certain/Someone - similar but indefinite!' },
      { value: '模', pinyin: 'mó', radical: '木', radicalMeaning: 'Wood', explanation: 'Model/Pattern - similar sound, different use!' },
    ],
    hint: 'Zhuge Liang had full wisdom and many ___. A master strategist!', distractorType: 'homophone',
  },
  {
    id: 'g6-010', grade: 6, scenario: 'Complete the Idiom: Boundless',
    blocks: [idiom(['一', '望', '无', '___'], ['yī', 'wàng', 'wú', 'jì'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '际', pinyin: 'jì', radical: '阝', radicalMeaning: 'Hill/City', definition: 'Border/Edge - the boundary of land' },
    options: [
      { value: '际', pinyin: 'jì', radical: '阝', radicalMeaning: 'Hill/City', explanation: 'Border - look and see no edge, endless land!' },
      { value: '记', pinyin: 'jì', radical: '讠', radicalMeaning: 'Speech', explanation: 'Remember - same sound but about memory!' },
      { value: '迹', pinyin: 'jì', radical: '辶', radicalMeaning: 'Walk', explanation: 'Trace - same sound but about footprints!' },
    ],
    hint: 'One look, no ___. The land stretches endlessly!', distractorType: 'homophone',
  },
  {
    id: 'g6-011', grade: 6, scenario: 'Medical Discovery',
    blocks: [t(['科', '学', '家', '终', '于', '攻', '___', '了', '这', '个', '难', '题', '。'], ['kē', 'xué', 'jiā', 'zhōng', 'yú', 'gōng', 'kè', 'le', 'zhè', 'gè', 'nán', 'tí', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '克', pinyin: 'kè', radical: '十', radicalMeaning: 'Ten', definition: 'Overcome/Conquer - to defeat a difficulty' },
    options: [
      { value: '克', pinyin: 'kè', radical: '十', radicalMeaning: 'Ten', explanation: 'Overcome - attack and conquer the problem!' },
      { value: '刻', pinyin: 'kè', radical: '刂', radicalMeaning: 'Knife', explanation: 'Carve/Moment - same sound but about cutting!' },
      { value: '客', pinyin: 'kè', radical: '宀', radicalMeaning: 'Roof', explanation: 'Guest - same sound but about visitors!' },
    ],
    hint: 'Scientists finally ___ this difficult problem. Think: overcome!', distractorType: 'homophone',
  },
  {
    id: 'g6-012', grade: 6, scenario: 'Complete the Idiom: All-out Effort',
    blocks: [idiom(['全', '力', '以', '___'], ['quán', 'lì', 'yǐ', 'fù'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '赴', pinyin: 'fù', radical: '走', radicalMeaning: 'Walk/Run', definition: 'Go to/Rush - to charge forward with all strength' },
    options: [
      { value: '赴', pinyin: 'fù', radical: '走', radicalMeaning: 'Walk/Run', explanation: 'Rush - run (走) forward with full power!' },
      { value: '富', pinyin: 'fù', radical: '宀', radicalMeaning: 'Roof', explanation: 'Rich - same sound but about wealth!' },
      { value: '付', pinyin: 'fù', radical: '亻', radicalMeaning: 'Person', explanation: 'Pay - same sound but about payment!' },
    ],
    hint: 'Full strength to ___ forward. Give everything you have!', distractorType: 'homophone',
  },
  {
    id: 'g6-013', grade: 6, scenario: 'Classical Literature',
    blocks: [dlg('Scholar', ['读', '万', '卷', '书', '，', '行', '万', '里', '___', '。'], ['dú', 'wàn', 'juàn', 'shū', '', 'xíng', 'wàn', 'lǐ', 'lù', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [8],
    correctAnswer: { value: '路', pinyin: 'lù', radical: '足', radicalMeaning: 'Foot', definition: 'Road/Path - the journey of a thousand miles' },
    options: [
      { value: '路', pinyin: 'lù', radical: '足', radicalMeaning: 'Foot', explanation: 'Road - walk (足) ten thousand miles of path!' },
      { value: '录', pinyin: 'lù', radical: '彐', radicalMeaning: 'Snout', explanation: 'Record - same sound but about writing!' },
      { value: '露', pinyin: 'lù', radical: '雨', radicalMeaning: 'Rain', explanation: 'Dew/Reveal - same sound but about moisture!' },
    ],
    hint: 'Read ten thousand books, travel ten thousand ___. Education through experience!', distractorType: 'homophone',
  },
  {
    id: 'g6-014', grade: 6, scenario: 'International Relations',
    blocks: [t(['各', '国', '应', '该', '和', '平', '___', '处', '，', '互', '相', '尊', '重', '。'], ['gè', 'guó', 'yīng', 'gāi', 'hé', 'píng', 'xiāng', 'chǔ', '', 'hù', 'xiāng', 'zūn', 'zhòng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [6],
    correctAnswer: { value: '相', pinyin: 'xiāng', radical: '目', radicalMeaning: 'Eye', definition: 'Mutual/Together - facing each other' },
    options: [
      { value: '相', pinyin: 'xiāng', radical: '目', radicalMeaning: 'Eye', explanation: 'Mutual - eye to eye (目), living together peacefully!' },
      { value: '箱', pinyin: 'xiāng', radical: '⺮', radicalMeaning: 'Bamboo', explanation: 'Box - same sound but a container!' },
      { value: '香', pinyin: 'xiāng', radical: '香', radicalMeaning: 'Fragrant', explanation: 'Fragrant - same sound but about scent!' },
    ],
    hint: 'Countries should peacefully ___ coexist and respect each other.', distractorType: 'homophone',
  },
  {
    id: 'g6-015', grade: 6, scenario: 'Complete the Idiom: Vast Knowledge',
    blocks: [idiom(['学', '富', '五', '___'], ['xué', 'fù', 'wǔ', 'chē'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '车', pinyin: 'chē', radical: '车', radicalMeaning: 'Vehicle', definition: 'Cart/Vehicle - enough books to fill five carts' },
    options: [
      { value: '车', pinyin: 'chē', radical: '车', radicalMeaning: 'Vehicle', explanation: 'Cart - so learned that books fill five carts (车)!' },
      { value: '扯', pinyin: 'chě', radical: '扌', radicalMeaning: 'Hand', explanation: 'Pull/Chat - similar sound but about talking!' },
      { value: '彻', pinyin: 'chè', radical: '彳', radicalMeaning: 'Step', explanation: 'Thorough - similar sound but about completeness!' },
    ],
    hint: 'Learning fills five ___. An incredibly well-read scholar!', distractorType: 'homophone',
  },
  {
    id: 'g6-016', grade: 6, scenario: 'Farewell Ceremony',
    blocks: [t(['毕', '业', '___', '礼', '上', '，', '同', '学', '们', '依', '依', '不', '舍', '。'], ['bì', 'yè', 'diǎn', 'lǐ', 'shàng', '', 'tóng', 'xué', 'men', 'yī', 'yī', 'bù', 'shě', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '典', pinyin: 'diǎn', radical: '八', radicalMeaning: 'Eight/Divide', definition: 'Ceremony/Classic - a formal occasion or classic text' },
    options: [
      { value: '典', pinyin: 'diǎn', radical: '八', radicalMeaning: 'Eight/Divide', explanation: 'Ceremony - a formal classic occasion!' },
      { value: '点', pinyin: 'diǎn', radical: '灬', radicalMeaning: 'Fire dots', explanation: 'Point - same sound but a dot or spot!' },
      { value: '电', pinyin: 'diàn', radical: '田', radicalMeaning: 'Field', explanation: 'Electricity - similar sound, different concept!' },
    ],
    hint: 'Graduation ___ - a formal ceremony where classmates part.', distractorType: 'homophone',
  },
  {
    id: 'g6-017', grade: 6, scenario: 'Complete the Idiom: Quick Thinking',
    blocks: [idiom(['随', '机', '应', '___'], ['suí', 'jī', 'yìng', 'biàn'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '变', pinyin: 'biàn', radical: '又', radicalMeaning: 'Again', definition: 'Change/Adapt - to transform in response' },
    options: [
      { value: '变', pinyin: 'biàn', radical: '又', radicalMeaning: 'Again', explanation: 'Change - adapt again (又) to the situation!' },
      { value: '辩', pinyin: 'biàn', radical: '辛', radicalMeaning: 'Bitter', explanation: 'Debate - same sound but about arguing!' },
      { value: '便', pinyin: 'biàn', radical: '亻', radicalMeaning: 'Person', explanation: 'Convenient - same sound but about ease!' },
    ],
    hint: 'Follow the opportunity and respond with ___. Quick adaptation!', distractorType: 'homophone',
  },
  {
    id: 'g6-018', grade: 6, scenario: 'Space Documentary',
    blocks: [dlg('Narrator', ['浩', '___', '的', '宇', '宙', '充', '满', '了', '未', '知', '。'], ['hào', 'hàn', 'de', 'yǔ', 'zhòu', 'chōng', 'mǎn', 'le', 'wèi', 'zhī', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '瀚', pinyin: 'hàn', radical: '氵', radicalMeaning: 'Water', definition: 'Vast/Boundless - like an endless ocean of space' },
    options: [
      { value: '瀚', pinyin: 'hàn', radical: '氵', radicalMeaning: 'Water', explanation: 'Vast - like an endless ocean (氵) of stars!' },
      { value: '汉', pinyin: 'hàn', radical: '氵', radicalMeaning: 'Water', explanation: 'Chinese/Han - same radical but about ethnicity!' },
      { value: '旱', pinyin: 'hàn', radical: '日', radicalMeaning: 'Sun', explanation: 'Drought - same sound but about dryness!' },
    ],
    hint: 'The ___ universe is full of unknowns. Think of vast waters.', distractorType: 'shape-similar',
  },
  {
    id: 'g6-019', grade: 6, scenario: 'Complete the Idiom: No Regrets',
    blocks: [idiom(['无', '怨', '无', '___'], ['wú', 'yuàn', 'wú', 'huǐ'])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '悔', pinyin: 'huǐ', radical: '忄', radicalMeaning: 'Heart', definition: 'Regret - a feeling of remorse in the heart' },
    options: [
      { value: '悔', pinyin: 'huǐ', radical: '忄', radicalMeaning: 'Heart', explanation: 'Regret - no complaints, no remorse in the heart (忄)!' },
      { value: '毁', pinyin: 'huǐ', radical: '殳', radicalMeaning: 'Weapon', explanation: 'Destroy - same sound but about breaking!' },
      { value: '灰', pinyin: 'huī', radical: '火', radicalMeaning: 'Fire', explanation: 'Ash/Gray - similar sound but about remains!' },
    ],
    hint: 'No complaints, no ___. A life lived with full commitment!', distractorType: 'homophone',
  },
  {
    id: 'g6-020', grade: 6, scenario: 'Archaeological Discovery',
    blocks: [t(['考', '古', '学', '家', '___', '掘', '出', '了', '珍', '贵', '的', '文', '物', '。'], ['kǎo', 'gǔ', 'xué', 'jiā', 'fā', 'jué', 'chū', 'le', 'zhēn', 'guì', 'de', 'wén', 'wù', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '发', pinyin: 'fā', radical: '又', radicalMeaning: 'Again', definition: 'Excavate/Discover - to dig out and reveal' },
    options: [
      { value: '发', pinyin: 'fā', radical: '又', radicalMeaning: 'Again', explanation: 'Excavate - dig and discover precious artifacts!' },
      { value: '法', pinyin: 'fǎ', radical: '氵', radicalMeaning: 'Water', explanation: 'Law/Method - similar sound but about rules!' },
      { value: '罚', pinyin: 'fá', radical: '网', radicalMeaning: 'Net', explanation: 'Punish - similar sound but about penalty!' },
    ],
    hint: 'Archaeologists ___ precious cultural relics. To dig up and discover!', distractorType: 'homophone',
  },
];
