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

export const grade2Extra: Level[] = [
  {
    id: 'g2-006', grade: 2, scenario: 'Shopping Trip',
    blocks: [t(['妈', '妈', '去', '___', '东', '西', '。'], ['mā', 'ma', 'qù', 'mǎi', 'dōng', 'xi', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '买', pinyin: 'mǎi', radical: '乛', definition: 'Buy - purchase with money' },
    options: [
      { value: '买', pinyin: 'mǎi', explanation: 'Buy - spending money on things!' },
      { value: '卖', pinyin: 'mài', explanation: 'Sell - the opposite of buying!' },
      { value: '迈', pinyin: 'mài', radical: '辶', explanation: 'Stride - similar sound but means walking!' },
    ],
    hint: 'Mom goes to the store to spend money!', distractorType: 'homophone',
  },
  {
    id: 'g2-007', grade: 2, scenario: 'Flying Kite',
    blocks: [t(['我', '们', '在', '公', '园', '___', '风', '筝', '。'], ['wǒ', 'men', 'zài', 'gōng', 'yuán', 'fàng', 'fēng', 'zhēng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '放', pinyin: 'fàng', radical: '攵', radicalMeaning: 'Strike', definition: 'Release/Fly - let go, set free' },
    options: [
      { value: '放', pinyin: 'fàng', radical: '攵', explanation: 'Release - let the kite fly free!' },
      { value: '房', pinyin: 'fáng', radical: '户', explanation: 'Room/House - similar sound but a building!' },
      { value: '方', pinyin: 'fāng', radical: '方', explanation: 'Direction/Square - different meaning!' },
    ],
    hint: 'Letting the kite go up into the sky!', distractorType: 'homophone',
  },
  {
    id: 'g2-008', grade: 2, scenario: 'Colorful Leaves',
    blocks: [t(['秋', '天', '树', '___', '变', '黄', '了', '。'], ['qiū', 'tiān', 'shù', 'yè', 'biàn', 'huáng', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '叶', pinyin: 'yè', radical: '口', radicalMeaning: 'Mouth', definition: 'Leaf - flat green part of a plant' },
    options: [
      { value: '叶', pinyin: 'yè', radical: '口', explanation: 'Leaf - grows on tree branches!' },
      { value: '页', pinyin: 'yè', radical: '页', explanation: 'Page - same sound but for books!' },
      { value: '夜', pinyin: 'yè', radical: '夕', explanation: 'Night - same sound but means dark!' },
    ],
    hint: 'What falls from trees in autumn?', distractorType: 'homophone',
  },
  {
    id: 'g2-009', grade: 2, scenario: 'Helping Others',
    blocks: [t(['我', '___', '助', '同', '学', '做', '作', '业', '。'], ['wǒ', 'bāng', 'zhù', 'tóng', 'xué', 'zuò', 'zuò', 'yè', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '帮', pinyin: 'bāng', radical: '巾', radicalMeaning: 'Cloth', definition: 'Help - assist someone' },
    options: [
      { value: '帮', pinyin: 'bāng', radical: '巾', explanation: 'Help - like wrapping someone in support!' },
      { value: '棒', pinyin: 'bàng', radical: '木', explanation: 'Great/Stick - similar sound but praise!' },
      { value: '旁', pinyin: 'páng', radical: '方', explanation: 'Beside - similar sound but means next to!' },
    ],
    hint: 'Giving assistance to a classmate!', distractorType: 'homophone',
  },
  {
    id: 'g2-010', grade: 2, scenario: 'Warm Clothes',
    blocks: [t(['冬', '天', '要', '穿', '___', '衣', '服', '。'], ['dōng', 'tiān', 'yào', 'chuān', 'nuǎn', 'yī', 'fú', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '暖', pinyin: 'nuǎn', radical: '日', radicalMeaning: 'Sun', definition: 'Warm - pleasantly heated' },
    options: [
      { value: '暖', pinyin: 'nuǎn', radical: '日', radicalMeaning: 'Sun', explanation: 'Warm - sun (日) keeps you warm!' },
      { value: '冷', pinyin: 'lěng', radical: '冫', explanation: 'Cold - the opposite feeling!' },
      { value: '热', pinyin: 'rè', radical: '灬', explanation: 'Hot - too extreme, just warm!' },
    ],
    hint: 'Keeping cozy - the sun (日) radical means warmth!', distractorType: 'visual',
  },
  {
    id: 'g2-011', grade: 2, scenario: 'Animal Sounds',
    blocks: [dlg('Teacher', ['___', '怎', '么', '叫', '？'], ['jī', 'zěn', 'me', 'jiào', '']),
             dlg('Student', ['咯', '咯', '咯', '！'], ['gē', 'gē', 'gē', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '鸡', pinyin: 'jī', radical: '鸟', radicalMeaning: 'Bird', definition: 'Chicken - farm bird that clucks' },
    options: [
      { value: '鸡', pinyin: 'jī', radical: '鸟', radicalMeaning: 'Bird', explanation: 'Chicken has the bird radical (鸟)!' },
      { value: '鸭', pinyin: 'yā', radical: '鸟', radicalMeaning: 'Bird', explanation: 'Duck - quacks, does not cluck!' },
      { value: '几', pinyin: 'jǐ', radical: '几', explanation: 'How many - same sound, not an animal!' },
    ],
    hint: 'A farm bird - look for the bird radical (鸟)!', distractorType: 'visual',
  },
  {
    id: 'g2-012', grade: 2, scenario: 'Happy Birthday',
    blocks: [t(['祝', '你', '生', '日', '快', '___', '！'], ['zhù', 'nǐ', 'shēng', 'rì', 'kuài', 'lè', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '乐', pinyin: 'lè', radical: '丿', definition: 'Happy/Joy - feeling of delight' },
    options: [
      { value: '乐', pinyin: 'lè', explanation: 'Happy - feeling joy and delight!' },
      { value: '了', pinyin: 'le', explanation: 'Completed - same sound, grammar word!' },
      { value: '累', pinyin: 'lèi', radical: '田', explanation: 'Tired - not a birthday feeling!' },
    ],
    hint: 'Birthday wishes are always about happiness!', distractorType: 'homophone',
  },
  {
    id: 'g2-013', grade: 2, scenario: 'School Bell',
    blocks: [t(['上', '课', '___', '响', '了', '。'], ['shàng', 'kè', 'líng', 'xiǎng', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '铃', pinyin: 'líng', radical: '钅', radicalMeaning: 'Metal', definition: 'Bell - metal ring that sounds' },
    options: [
      { value: '铃', pinyin: 'líng', radical: '钅', radicalMeaning: 'Metal', explanation: 'Bell is made of metal (钅)!' },
      { value: '零', pinyin: 'líng', radical: '雨', explanation: 'Zero - same sound, a number!' },
      { value: '灵', pinyin: 'líng', radical: '火', explanation: 'Spirit - same sound, different meaning!' },
    ],
    hint: 'A metal (钅) object that makes a ringing sound!', distractorType: 'homophone',
  },
  {
    id: 'g2-014', grade: 2, scenario: 'Bedtime Story',
    blocks: [t(['晚', '上', '妈', '妈', '给', '我', '讲', '故', '___', '。'], ['wǎn', 'shàng', 'mā', 'ma', 'gěi', 'wǒ', 'jiǎng', 'gù', 'shì', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [8],
    correctAnswer: { value: '事', pinyin: 'shì', radical: '亅', definition: 'Matter/Story - event or tale' },
    options: [
      { value: '事', pinyin: 'shì', explanation: 'Story/Matter - a tale to tell!' },
      { value: '是', pinyin: 'shì', radical: '日', explanation: 'Is/Yes - same sound, grammar word!' },
      { value: '市', pinyin: 'shì', radical: '巾', explanation: 'City/Market - same sound, a place!' },
    ],
    hint: 'Mom tells a bedtime tale before sleep!', distractorType: 'homophone',
  },
  {
    id: 'g2-015', grade: 2, scenario: 'Painting Colors',
    blocks: [t(['我', '用', '___', '色', '画', '天', '空', '。'], ['wǒ', 'yòng', 'lán', 'sè', 'huà', 'tiān', 'kōng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '蓝', pinyin: 'lán', radical: '艹', radicalMeaning: 'Grass/Plant', definition: 'Blue - color of the sky' },
    options: [
      { value: '蓝', pinyin: 'lán', radical: '艹', radicalMeaning: 'Grass/Plant', explanation: 'Blue - like indigo plant dye!' },
      { value: '红', pinyin: 'hóng', radical: '纟', explanation: 'Red - wrong color for the sky!' },
      { value: '篮', pinyin: 'lán', radical: '竹', explanation: 'Basket - same sound, a container!' },
    ],
    hint: 'What color is the sky?', distractorType: 'homophone',
  },
  {
    id: 'g2-016', grade: 2, scenario: 'Wind Blowing',
    blocks: [t(['___', '吹', '树', '叶', '沙', '沙', '响', '。'], ['fēng', 'chuī', 'shù', 'yè', 'shā', 'shā', 'xiǎng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '风', pinyin: 'fēng', radical: '风', radicalMeaning: 'Wind', definition: 'Wind - moving air' },
    options: [
      { value: '风', pinyin: 'fēng', radical: '风', radicalMeaning: 'Wind', explanation: 'Wind makes the leaves rustle!' },
      { value: '丰', pinyin: 'fēng', radical: '丿', explanation: 'Abundant - same sound, different meaning!' },
      { value: '封', pinyin: 'fēng', radical: '寸', explanation: 'Seal/Envelope - same sound!' },
    ],
    hint: 'Moving air that makes leaves rustle!', distractorType: 'homophone',
  },
  {
    id: 'g2-017', grade: 2, scenario: 'Crossing the Bridge',
    blocks: [t(['我', '们', '过', '___', '去', '河', '对', '面', '。'], ['wǒ', 'men', 'guò', 'qiáo', 'qù', 'hé', 'duì', 'miàn', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '桥', pinyin: 'qiáo', radical: '木', radicalMeaning: 'Wood', definition: 'Bridge - structure over water' },
    options: [
      { value: '桥', pinyin: 'qiáo', radical: '木', radicalMeaning: 'Wood', explanation: 'Bridge made of wood (木) over water!' },
      { value: '巧', pinyin: 'qiǎo', radical: '工', explanation: 'Clever/Skillful - similar sound!' },
      { value: '乔', pinyin: 'qiáo', radical: '丿', explanation: 'Tall - same sound, means height!' },
    ],
    hint: 'Walk over water on this wooden (木) structure!', distractorType: 'homophone',
  },
  {
    id: 'g2-018', grade: 2, scenario: 'Morning Exercise',
    blocks: [t(['早', '上', '起', '来', '做', '___', '操', '。'], ['zǎo', 'shàng', 'qǐ', 'lái', 'zuò', 'zǎo', 'cāo', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '早', pinyin: 'zǎo', radical: '日', radicalMeaning: 'Sun', definition: 'Early/Morning - beginning of day' },
    options: [
      { value: '早', pinyin: 'zǎo', radical: '日', radicalMeaning: 'Sun', explanation: 'Morning - sun (日) just rising!' },
      { value: '草', pinyin: 'cǎo', radical: '艹', explanation: 'Grass - similar look but a plant!' },
      { value: '晚', pinyin: 'wǎn', radical: '日', explanation: 'Evening - opposite time of day!' },
    ],
    hint: 'Exercise at the start of the day when the sun (日) rises!', distractorType: 'visual',
  },
  {
    id: 'g2-019', grade: 2, scenario: 'Asking Nicely',
    blocks: [dlg('Child', ['___', '问', '，', '图', '书', '馆', '在', '哪', '里', '？'], ['qǐng', 'wèn', '', 'tú', 'shū', 'guǎn', 'zài', 'nǎ', 'lǐ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [0],
    correctAnswer: { value: '请', pinyin: 'qǐng', radical: '讠', radicalMeaning: 'Speech', definition: 'Please - polite request word' },
    options: [
      { value: '请', pinyin: 'qǐng', radical: '讠', radicalMeaning: 'Speech', explanation: 'Please - polite speech (讠)!' },
      { value: '清', pinyin: 'qīng', radical: '氵', explanation: 'Clear - same sound but about water!' },
      { value: '情', pinyin: 'qíng', radical: '忄', explanation: 'Feeling - similar sound but emotions!' },
    ],
    hint: 'A polite word using the speech radical (讠)!', distractorType: 'homophone',
  },
  {
    id: 'g2-020', grade: 2, scenario: 'Snowy Day',
    blocks: [t(['冬', '天', '下', '___', '了', '，', '地', '上', '白', '白', '的', '。'], ['dōng', 'tiān', 'xià', 'xuě', 'le', '', 'dì', 'shàng', 'bái', 'bái', 'de', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [3],
    correctAnswer: { value: '雪', pinyin: 'xuě', radical: '雨', radicalMeaning: 'Rain', definition: 'Snow - frozen white crystals' },
    options: [
      { value: '雪', pinyin: 'xuě', radical: '雨', radicalMeaning: 'Rain', explanation: 'Snow has the rain radical (雨) on top!' },
      { value: '雨', pinyin: 'yǔ', radical: '雨', explanation: 'Rain - liquid, not frozen!' },
      { value: '雷', pinyin: 'léi', radical: '雨', explanation: 'Thunder - noise from storms!' },
    ],
    hint: 'Frozen rain that makes the ground white!', distractorType: 'visual',
  },
  {
    id: 'g2-021', grade: 2, scenario: 'Time to Sleep',
    blocks: [t(['该', '___', '觉', '了', '，', '晚', '安', '！'], ['gāi', 'shuì', 'jiào', 'le', '', 'wǎn', 'ān', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '睡', pinyin: 'shuì', radical: '目', radicalMeaning: 'Eye', definition: 'Sleep - rest with eyes closed' },
    options: [
      { value: '睡', pinyin: 'shuì', radical: '目', radicalMeaning: 'Eye', explanation: 'Sleep - close your eyes (目)!' },
      { value: '谁', pinyin: 'shuí', radical: '讠', explanation: 'Who - similar sound, a question word!' },
      { value: '水', pinyin: 'shuǐ', radical: '水', explanation: 'Water - similar sound but a liquid!' },
    ],
    hint: 'Close your eyes (目) and rest!', distractorType: 'homophone',
  },
  {
    id: 'g2-022', grade: 2, scenario: 'Playing Ball',
    blocks: [t(['我', '和', '朋', '友', '一', '起', '踢', '___', '。'], ['wǒ', 'hé', 'péng', 'yǒu', 'yī', 'qǐ', 'tī', 'qiú', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [7],
    correctAnswer: { value: '球', pinyin: 'qiú', radical: '王', radicalMeaning: 'King/Jade', definition: 'Ball - round object for sports' },
    options: [
      { value: '球', pinyin: 'qiú', radical: '王', explanation: 'Ball - a round sporting object!' },
      { value: '求', pinyin: 'qiú', radical: '一', explanation: 'Request/Beg - same sound but not a thing!' },
      { value: '秋', pinyin: 'qiū', radical: '禾', explanation: 'Autumn - similar sound, a season!' },
    ],
    hint: 'A round object you kick with friends!', distractorType: 'homophone',
  },
  {
    id: 'g2-023', grade: 2, scenario: 'Bright Sunshine',
    blocks: [t(['太', '___', '真', '亮', '！'], ['tài', 'yáng', 'zhēn', 'liàng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '阳', pinyin: 'yáng', radical: '阝', radicalMeaning: 'Mound', definition: 'Sun/Yang - bright and warm energy' },
    options: [
      { value: '阳', pinyin: 'yáng', radical: '阝', explanation: 'Sun - the bright warm light in the sky!' },
      { value: '羊', pinyin: 'yáng', radical: '羊', explanation: 'Sheep - same sound but an animal!' },
      { value: '洋', pinyin: 'yáng', radical: '氵', explanation: 'Ocean - same sound but water!' },
    ],
    hint: 'The bright thing in the sky that keeps us warm!', distractorType: 'homophone',
  },
  {
    id: 'g2-024', grade: 2, scenario: 'Cleaning Up',
    blocks: [t(['请', '把', '房', '间', '打', '扫', '干', '___', '。'], ['qǐng', 'bǎ', 'fáng', 'jiān', 'dǎ', 'sǎo', 'gān', 'jìng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [7],
    correctAnswer: { value: '净', pinyin: 'jìng', radical: '冫', radicalMeaning: 'Ice', definition: 'Clean - free from dirt' },
    options: [
      { value: '净', pinyin: 'jìng', radical: '冫', explanation: 'Clean - pure like ice (冫)!' },
      { value: '静', pinyin: 'jìng', radical: '青', explanation: 'Quiet - same sound but about noise!' },
      { value: '近', pinyin: 'jìn', radical: '辶', explanation: 'Near - similar sound, about distance!' },
    ],
    hint: 'Making the room pure and spotless!', distractorType: 'homophone',
  },
  {
    id: 'g2-025', grade: 2, scenario: 'Growing Tall',
    blocks: [t(['小', '树', '慢', '慢', '___', '高', '了', '。'], ['xiǎo', 'shù', 'màn', 'man', 'zhǎng', 'gāo', 'le', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '长', pinyin: 'zhǎng', radical: '长', definition: 'Grow - increase in size over time' },
    options: [
      { value: '长', pinyin: 'zhǎng', explanation: 'Grow - getting bigger over time!' },
      { value: '张', pinyin: 'zhāng', radical: '弓', explanation: 'Stretch/Measure word - similar sound!' },
      { value: '常', pinyin: 'cháng', radical: '巾', explanation: 'Often - similar sound but about frequency!' },
    ],
    hint: 'The tree is getting bigger and taller!', distractorType: 'homophone',
  },
  {
    id: 'g2-026', grade: 2, scenario: 'Sharing Food',
    blocks: [dlg('Friend', ['你', '要', '___', '我', '的', '饼', '干', '吗', '？'], ['nǐ', 'yào', 'chī', 'wǒ', 'de', 'bǐng', 'gān', 'ma', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '吃', pinyin: 'chī', radical: '口', radicalMeaning: 'Mouth', definition: 'Eat - consume food' },
    options: [
      { value: '吃', pinyin: 'chī', radical: '口', radicalMeaning: 'Mouth', explanation: 'Eat with your mouth (口)!' },
      { value: '尺', pinyin: 'chǐ', radical: '尸', explanation: 'Ruler/Unit - similar sound, a measuring tool!' },
      { value: '池', pinyin: 'chí', radical: '氵', explanation: 'Pool - similar sound but water!' },
    ],
    hint: 'Using your mouth (口) to have some cookies!', distractorType: 'homophone',
  },
  {
    id: 'g2-027', grade: 2, scenario: 'Swimming Lesson',
    blocks: [t(['夏', '天', '我', '学', '___', '泳', '。'], ['xià', 'tiān', 'wǒ', 'xué', 'yóu', 'yǒng', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '游', pinyin: 'yóu', radical: '氵', radicalMeaning: 'Water', definition: 'Swim - move through water' },
    options: [
      { value: '游', pinyin: 'yóu', radical: '氵', radicalMeaning: 'Water', explanation: 'Swim in water (氵)!' },
      { value: '油', pinyin: 'yóu', radical: '氵', explanation: 'Oil - same sound and radical but greasy!' },
      { value: '由', pinyin: 'yóu', radical: '田', explanation: 'From/Reason - same sound, no water!' },
    ],
    hint: 'Moving through water in summer!', distractorType: 'homophone',
  },
  {
    id: 'g2-028', grade: 2, scenario: 'Laughing Together',
    blocks: [t(['大', '家', '哈', '哈', '大', '___', '。'], ['dà', 'jiā', 'hā', 'hā', 'dà', 'xiào', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '笑', pinyin: 'xiào', radical: '竹', radicalMeaning: 'Bamboo', definition: 'Laugh - express amusement' },
    options: [
      { value: '笑', pinyin: 'xiào', radical: '竹', radicalMeaning: 'Bamboo', explanation: 'Laugh - bamboo (竹) bending like a smile!' },
      { value: '校', pinyin: 'xiào', radical: '木', explanation: 'School - same sound, a place!' },
      { value: '小', pinyin: 'xiǎo', radical: '小', explanation: 'Small - similar sound but about size!' },
    ],
    hint: 'Everyone is expressing joy together!', distractorType: 'homophone',
  },
  {
    id: 'g2-029', grade: 2, scenario: 'Lost and Found',
    blocks: [t(['我', '___', '到', '了', '一', '块', '石', '头', '。'], ['wǒ', 'jiǎn', 'dào', 'le', 'yī', 'kuài', 'shí', 'tou', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '捡', pinyin: 'jiǎn', radical: '扌', radicalMeaning: 'Hand', definition: 'Pick up - lift from the ground' },
    options: [
      { value: '捡', pinyin: 'jiǎn', radical: '扌', radicalMeaning: 'Hand', explanation: 'Pick up with your hand (扌)!' },
      { value: '检', pinyin: 'jiǎn', radical: '木', explanation: 'Check/Inspect - same sound, different action!' },
      { value: '简', pinyin: 'jiǎn', radical: '竹', explanation: 'Simple - same sound but means easy!' },
    ],
    hint: 'Using your hand (扌) to lift something from the ground!', distractorType: 'homophone',
  },
  {
    id: 'g2-030', grade: 2, scenario: 'Moon Festival',
    blocks: [poem(['中', '秋', '___', '儿', '圆', '。'], ['zhōng', 'qiū', 'yuè', 'er', 'yuán', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [2],
    correctAnswer: { value: '月', pinyin: 'yuè', radical: '月', radicalMeaning: 'Moon', definition: 'Moon - bright light in the night sky' },
    options: [
      { value: '月', pinyin: 'yuè', radical: '月', radicalMeaning: 'Moon', explanation: 'Moon - round and bright in the sky!' },
      { value: '越', pinyin: 'yuè', radical: '走', explanation: 'Cross/More - same sound but means exceed!' },
      { value: '乐', pinyin: 'yuè', radical: '丿', explanation: 'Music - same sound, about sound!' },
    ],
    hint: 'This round, bright thing in the sky is fullest during Mid-Autumn!', distractorType: 'homophone',
  },
  {
    id: 'g2-031', grade: 2, scenario: 'Drawing Class',
    blocks: [t(['我', '___', '了', '一', '只', '小', '兔', '子', '。'], ['wǒ', 'huà', 'le', 'yī', 'zhī', 'xiǎo', 'tù', 'zǐ', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [1],
    correctAnswer: { value: '画', pinyin: 'huà', radical: '田', radicalMeaning: 'Field', definition: 'Draw/Paint - create pictures' },
    options: [
      { value: '画', pinyin: 'huà', radical: '田', explanation: 'Draw - creating a picture on paper!' },
      { value: '话', pinyin: 'huà', radical: '讠', explanation: 'Words/Speech - same sound but speaking!' },
      { value: '花', pinyin: 'huā', radical: '艹', explanation: 'Flower - similar sound, a plant!' },
    ],
    hint: 'Creating a picture of a bunny on paper!', distractorType: 'homophone',
  },
  {
    id: 'g2-032', grade: 2, scenario: 'Chasing Butterflies',
    blocks: [t(['小', '朋', '友', '在', '草', '地', '上', '___', '蝴', '蝶', '。'], ['xiǎo', 'péng', 'yǒu', 'zài', 'cǎo', 'dì', 'shàng', 'zhuī', 'hú', 'dié', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [7],
    correctAnswer: { value: '追', pinyin: 'zhuī', radical: '辶', radicalMeaning: 'Walk', definition: 'Chase - run after something' },
    options: [
      { value: '追', pinyin: 'zhuī', radical: '辶', radicalMeaning: 'Walk', explanation: 'Chase - running (辶) after something!' },
      { value: '推', pinyin: 'tuī', radical: '扌', explanation: 'Push - using hands, not chasing!' },
      { value: '吹', pinyin: 'chuī', radical: '口', explanation: 'Blow - using mouth, not running!' },
    ],
    hint: 'Running after butterflies on the grass!', distractorType: 'visual',
  },
  {
    id: 'g2-033', grade: 2, scenario: 'Planting Seeds',
    blocks: [t(['春', '天', '我', '们', '___', '树', '。'], ['chūn', 'tiān', 'wǒ', 'men', 'zhòng', 'shù', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [4],
    correctAnswer: { value: '种', pinyin: 'zhòng', radical: '禾', radicalMeaning: 'Grain', definition: 'Plant - put seeds in earth to grow' },
    options: [
      { value: '种', pinyin: 'zhòng', radical: '禾', radicalMeaning: 'Grain', explanation: 'Plant - grain (禾) seeds in the ground!' },
      { value: '中', pinyin: 'zhōng', radical: '丨', explanation: 'Middle/China - similar sound but a position!' },
      { value: '重', pinyin: 'zhòng', radical: '里', explanation: 'Heavy - same sound but about weight!' },
    ],
    hint: 'Putting grain (禾) seeds in the earth!', distractorType: 'homophone',
  },
  {
    id: 'g2-034', grade: 2, scenario: 'Best Friends',
    blocks: [t(['她', '是', '我', '最', '好', '的', '朋', '___', '。'], ['tā', 'shì', 'wǒ', 'zuì', 'hǎo', 'de', 'péng', 'yǒu', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [7],
    correctAnswer: { value: '友', pinyin: 'yǒu', radical: '又', radicalMeaning: 'Again', definition: 'Friend - person you like and trust' },
    options: [
      { value: '友', pinyin: 'yǒu', radical: '又', explanation: 'Friend - two hands reaching out together!' },
      { value: '有', pinyin: 'yǒu', radical: '月', explanation: 'Have - same sound but means to possess!' },
      { value: '右', pinyin: 'yòu', radical: '口', explanation: 'Right side - similar sound, a direction!' },
    ],
    hint: 'Two people reaching out to each other!', distractorType: 'homophone',
  },
  {
    id: 'g2-035', grade: 2, scenario: 'Electric Light',
    blocks: [t(['天', '黑', '了', '，', '开', '___', '吧', '。'], ['tiān', 'hēi', 'le', '', 'kāi', 'dēng', 'ba', ''])],
    targetBlockIndex: 0, missingSegmentIndices: [5],
    correctAnswer: { value: '灯', pinyin: 'dēng', radical: '火', radicalMeaning: 'Fire', definition: 'Light/Lamp - device that makes light' },
    options: [
      { value: '灯', pinyin: 'dēng', radical: '火', radicalMeaning: 'Fire', explanation: 'Light - fire (火) to brighten the dark!' },
      { value: '等', pinyin: 'děng', radical: '竹', explanation: 'Wait - similar sound but an action!' },
      { value: '登', pinyin: 'dēng', radical: '癶', explanation: 'Climb - same sound, means going up!' },
    ],
    hint: 'Turn on this fire (火) device when it gets dark!', distractorType: 'homophone',
  },
];
