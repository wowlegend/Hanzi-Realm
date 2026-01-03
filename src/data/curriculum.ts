import { Level } from '../types';

export const curriculum: Record<number, Level[]> = {
  1: [
    {
      id: 101,
      scenario: "🍎 BIG APPLE",
      sentence_prefix: "这个苹果很 ",
      sentence_suffix: " 。",
      missing_char: "大",
      options: [
        { char: "大", hint: "Big Person (大)", explanation: "Big" },
        { char: "人", hint: "Person Standing", explanation: "Person" },
        { char: "天", hint: "Sky Above", explanation: "Sky" }
      ],
      correct_explanation: "Amazing! A BIG (大) person spreads their arms wide!"
    },
    {
      id: 102,
      scenario: "🐕 PUPPY FRIEND",
      sentence_prefix: "我有一只 ",
      sentence_suffix: " 。",
      missing_char: "狗",
      options: [
        { char: "猫", hint: "Cat (犭+ 苗)", explanation: "Cat" },
        { char: "狗", hint: "Dog (犭+ 句)", explanation: "Dog" },
        { char: "马", hint: "Horse", explanation: "Horse" }
      ],
      correct_explanation: "Woof! DOG (狗) has the animal radical (犭)!"
    },
    {
      id: 103,
      scenario: "☀️ SUNNY DAY",
      sentence_prefix: "今天天气很 ",
      sentence_suffix: " 。",
      missing_char: "好",
      options: [
        { char: "好", hint: "Woman + Child", explanation: "Good" },
        { char: "老", hint: "Old", explanation: "Old" },
        { char: "考", hint: "Test", explanation: "Test" }
      ],
      correct_explanation: "Perfect! GOOD (好) is a woman with her child!"
    },
    {
      id: 104,
      scenario: "💧 WATER CUP",
      sentence_prefix: "请给我一杯 ",
      sentence_suffix: " 。",
      missing_char: "水",
      options: [
        { char: "水", hint: "Water Drops", explanation: "Water" },
        { char: "火", hint: "Fire", explanation: "Fire" },
        { char: "冰", hint: "Ice", explanation: "Ice" }
      ],
      correct_explanation: "Splash! WATER (水) looks like flowing drops!"
    },
    {
      id: 105,
      scenario: "🏫 SCHOOL TIME",
      sentence_prefix: "我爱去 ",
      sentence_suffix: " 。",
      missing_char: "学校",
      options: [
        { char: "学校", hint: "Learn + Building", explanation: "School" },
        { char: "公园", hint: "Public Garden", explanation: "Park" },
        { char: "家", hint: "Home", explanation: "Home" }
      ],
      correct_explanation: "Smart! SCHOOL (学校) is where we learn!"
    }
  ],
  2: [
    {
      id: 201,
      scenario: "🌳 FOREST WALK",
      sentence_prefix: "森林里有很多 ",
      sentence_suffix: " 。",
      missing_char: "树",
      options: [
        { char: "树", hint: "Wood (木)", explanation: "Tree" },
        { char: "书", hint: "Bamboo", explanation: "Book" },
        { char: "鼠", hint: "Rat", explanation: "Mouse" }
      ],
      correct_explanation: "Awesome! TREE (树) has the wood radical (木)!"
    },
    {
      id: 202,
      scenario: "🎂 BIRTHDAY CAKE",
      sentence_prefix: "我想 ",
      sentence_suffix: " 蛋糕。",
      missing_char: "吃",
      options: [
        { char: "七", hint: "Number Seven", explanation: "Seven" },
        { char: "吃", hint: "Mouth (口)", explanation: "Eat" },
        { char: "次", hint: "Time/Order", explanation: "Time" }
      ],
      correct_explanation: "Yummy! You EAT (吃) with your MOUTH (口)!"
    },
    {
      id: 203,
      scenario: "🏃 RUN FAST",
      sentence_prefix: "快 ",
      sentence_suffix: " ！比赛开始了！",
      missing_char: "跑",
      options: [
        { char: "泡", hint: "Water (氵)", explanation: "Bubble" },
        { char: "跑", hint: "Foot (⻊)", explanation: "Run" },
        { char: "炮", hint: "Fire (火)", explanation: "Cannon" }
      ],
      correct_explanation: "Fast! You RUN (跑) with your FEET (⻊)!"
    },
    {
      id: 204,
      scenario: "👁️ I SEE YOU",
      sentence_prefix: "我 ",
      sentence_suffix: " 到了彩虹。",
      missing_char: "看",
      options: [
        { char: "干", hint: "Trunk/Dry", explanation: "Dry" },
        { char: "看", hint: "Eye (目)", explanation: "Look" },
        { char: "哭", hint: "Mouth (口)", explanation: "Cry" }
      ],
      correct_explanation: "Great! You LOOK (看) with your EYES (目)!"
    },
    {
      id: 205,
      scenario: "🪑 SIT DOWN",
      sentence_prefix: "请 ",
      sentence_suffix: " 下。",
      missing_char: "坐",
      options: [
        { char: "做", hint: "Person (亻)", explanation: "Do/Make" },
        { char: "坐", hint: "Earth (土)", explanation: "Sit" },
        { char: "座", hint: "Seat", explanation: "Seat" }
      ],
      correct_explanation: "Perfect! You SIT (坐) on the ground (土)!"
    }
  ],
  3: [
    {
      id: 301,
      scenario: "🦋 BUTTERFLY GARDEN",
      sentence_prefix: "美丽的 ",
      sentence_suffix: " 在飞。",
      missing_char: "蝴蝶",
      options: [
        { char: "蝴蝶", hint: "Insect (虫)", explanation: "Butterfly" },
        { char: "蚂蚁", hint: "Insect (虫)", explanation: "Ant" },
        { char: "蜘蛛", hint: "Insect (虫)", explanation: "Spider" }
      ],
      correct_explanation: "Beautiful! BUTTERFLY (蝴蝶) has insect radicals!"
    },
    {
      id: 302,
      scenario: "🏊 SWIMMING POOL",
      sentence_prefix: "我喜欢 ",
      sentence_suffix: " 泳。",
      missing_char: "游",
      options: [
        { char: "游", hint: "Water (氵)", explanation: "Swim" },
        { char: "油", hint: "Water (氵)", explanation: "Oil" },
        { char: "由", hint: "From/Reason", explanation: "From" }
      ],
      correct_explanation: "Splash! You SWIM (游) in WATER (氵)!"
    },
    {
      id: 303,
      scenario: "🎨 ARTIST STUDIO",
      sentence_prefix: "她正在 ",
      sentence_suffix: " 一幅画。",
      missing_char: "画",
      options: [
        { char: "话", hint: "Speech (讠)", explanation: "Words" },
        { char: "画", hint: "Field (田)", explanation: "Draw/Paint" },
        { char: "化", hint: "Change (亻)", explanation: "Change" }
      ],
      correct_explanation: "Creative! PAINT (画) originally meant marking fields!"
    },
    {
      id: 304,
      scenario: "🎵 MUSIC CLASS",
      sentence_prefix: "他会 ",
      sentence_suffix: " 钢琴。",
      missing_char: "弹",
      options: [
        { char: "弹", hint: "Hand (弓)", explanation: "Play (instrument)" },
        { char: "单", hint: "Single", explanation: "Single" },
        { char: "蛋", hint: "Insect (虫)", explanation: "Egg" }
      ],
      correct_explanation: "Musical! PLAY (弹) uses your hands with the bow!"
    },
    {
      id: 305,
      scenario: "🐉 DRAGON DANCE",
      sentence_prefix: "舞龙队伍很 ",
      sentence_suffix: " 。",
      missing_char: "长",
      options: [
        { char: "长", hint: "Long Hair", explanation: "Long" },
        { char: "常", hint: "Often (巾)", explanation: "Often" },
        { char: "场", hint: "Earth (土)", explanation: "Field" }
      ],
      correct_explanation: "Epic! LONG (长) shows flowing long hair!"
    }
  ],
  4: [
    {
      id: 401,
      scenario: "🔥 VOLCANO ERUPTION",
      sentence_prefix: "火山 ",
      sentence_suffix: " 了！",
      missing_char: "爆发",
      options: [
        { char: "爆发", hint: "Fire (火) + Issue", explanation: "Erupt" },
        { char: "发生", hint: "Issue + Birth", explanation: "Happen" },
        { char: "喷出", hint: "Mouth + Exit", explanation: "Spray Out" }
      ],
      correct_explanation: "Boom! ERUPT (爆发) has explosive fire (火)!"
    },
    {
      id: 402,
      scenario: "🌊 OCEAN RESCUE",
      sentence_prefix: "快 ",
      sentence_suffix: " ！水太深了！",
      missing_char: "浮",
      options: [
        { char: "符", hint: "Sign", explanation: "Sign" },
        { char: "浮", hint: "Water (氵)", explanation: "Float" },
        { char: "富", hint: "Roof (宀)", explanation: "Rich" }
      ],
      correct_explanation: "Life-saving! FLOAT (浮) in WATER (氵)!"
    },
    {
      id: 403,
      scenario: "⚔️ SWORD MASTER",
      sentence_prefix: "这把 ",
      sentence_suffix: " 很锋利。",
      missing_char: "剑",
      options: [
        { char: "箭", hint: "Bamboo (⺮)", explanation: "Arrow" },
        { char: "剑", hint: "Knife (刂)", explanation: "Sword" },
        { char: "见", hint: "See", explanation: "See" }
      ],
      correct_explanation: "Sharp! SWORD (剑) has the knife radical (刂)!"
    },
    {
      id: 404,
      scenario: "💰 BUSINESS EMPIRE",
      sentence_prefix: "我想 ",
      sentence_suffix: " 一家公司。",
      missing_char: "开",
      options: [
        { char: "开", hint: "Open Hands", explanation: "Open/Start" },
        { char: "介", hint: "Person Between", explanation: "Introduce" },
        { char: "玩", hint: "King (王)", explanation: "Play" }
      ],
      correct_explanation: "Entrepreneur! OPEN (开) uses hands (廾)!"
    },
    {
      id: 405,
      scenario: "🚀 ROCKET LAUNCH",
      sentence_prefix: "火箭准备 ",
      sentence_suffix: " 了。",
      missing_char: "起飞",
      options: [
        { char: "起飞", hint: "Rise + Fly", explanation: "Take Off" },
        { char: "降落", hint: "Descend + Fall", explanation: "Land" },
        { char: "飞行", hint: "Fly + Walk", explanation: "Fly" }
      ],
      correct_explanation: "Blast off! TAKE OFF (起飞) means rise and fly!"
    }
  ],
  5: [
    {
      id: 501,
      scenario: "🎭 THEATER PERFORMANCE",
      sentence_prefix: "观众们热烈地 ",
      sentence_suffix: " 。",
      missing_char: "鼓掌",
      options: [
        { char: "鼓掌", hint: "Drum + Palm", explanation: "Applaud" },
        { char: "欢呼", hint: "Joy + Shout", explanation: "Cheer" },
        { char: "尖叫", hint: "Sharp + Shout", explanation: "Scream" }
      ],
      correct_explanation: "Bravo! APPLAUD (鼓掌) is like drumming palms!"
    },
    {
      id: 502,
      scenario: "🔬 SCIENCE LAB",
      sentence_prefix: "科学家正在 ",
      sentence_suffix: " 新药。",
      missing_char: "研究",
      options: [
        { char: "研究", hint: "Grind + Study", explanation: "Research" },
        { char: "发现", hint: "Issue + See", explanation: "Discover" },
        { char: "实验", hint: "Real + Verify", explanation: "Experiment" }
      ],
      correct_explanation: "Scientific! RESEARCH (研究) means grinding study!"
    },
    {
      id: 503,
      scenario: "🏔️ MOUNTAIN CLIMB",
      sentence_prefix: "登山者 ",
      sentence_suffix: " 征服了珠峰。",
      missing_char: "终于",
      options: [
        { char: "终于", hint: "End + In", explanation: "Finally" },
        { char: "突然", hint: "突 + So", explanation: "Suddenly" },
        { char: "居然", hint: "Reside + So", explanation: "Unexpectedly" }
      ],
      correct_explanation: "Triumphant! FINALLY (终于) marks the end!"
    },
    {
      id: 504,
      scenario: "🌟 CELEBRITY LIFE",
      sentence_prefix: "明星需要保持 ",
      sentence_suffix: " 的形象。",
      missing_char: "优雅",
      options: [
        { char: "优雅", hint: "Excellent + Elegant", explanation: "Elegant" },
        { char: "普通", hint: "Universal + Common", explanation: "Ordinary" },
        { char: "简单", hint: "Simple + Single", explanation: "Simple" }
      ],
      correct_explanation: "Graceful! ELEGANT (优雅) means excellent refinement!"
    },
    {
      id: 505,
      scenario: "💎 TREASURE HUNT",
      sentence_prefix: "宝藏被 ",
      sentence_suffix: " 在山洞深处。",
      missing_char: "隐藏",
      options: [
        { char: "隐藏", hint: "Hide + Store", explanation: "Conceal" },
        { char: "埋葬", hint: "Bury + Funeral", explanation: "Bury" },
        { char: "保存", hint: "Protect + Keep", explanation: "Preserve" }
      ],
      correct_explanation: "Mysterious! CONCEAL (隐藏) means hiding storage!"
    }
  ],
  6: [
    {
      id: 601,
      scenario: "🤔 DIFFICULT CHOICE",
      sentence_prefix: "他 ",
      sentence_suffix: " 了很久才决定。",
      missing_char: "犹豫",
      options: [
        { char: "犹豫", hint: "Still + Hesitate", explanation: "Hesitate" },
        { char: "果断", hint: "Fruit + Cut", explanation: "Decisive" },
        { char: "放弃", hint: "Release + Abandon", explanation: "Give Up" }
      ],
      correct_explanation: "Thoughtful! HESITATE (犹豫) shows uncertainty!"
    },
    {
      id: 602,
      scenario: "🏛️ ANCIENT WISDOM",
      sentence_prefix: "孔子的思想 ",
      sentence_suffix: " 了中国文化。",
      missing_char: "影响",
      options: [
        { char: "影响", hint: "Shadow + Sound", explanation: "Influence" },
        { char: "改变", hint: "Change + Transform", explanation: "Change" },
        { char: "创造", hint: "Create + Make", explanation: "Create" }
      ],
      correct_explanation: "Profound! INFLUENCE (影响) casts like a shadow!"
    },
    {
      id: 603,
      scenario: "🎯 ACHIEVEMENT UNLOCKED",
      sentence_prefix: "经过多年努力，她 ",
      sentence_suffix: " 了目标。",
      missing_char: "实现",
      options: [
        { char: "实现", hint: "Real + Appear", explanation: "Achieve" },
        { char: "完成", hint: "Complete + Become", explanation: "Complete" },
        { char: "达到", hint: "Reach + Arrive", explanation: "Reach" }
      ],
      correct_explanation: "Victorious! ACHIEVE (实现) makes dreams real!"
    },
    {
      id: 604,
      scenario: "🌏 GLOBAL VILLAGE",
      sentence_prefix: "互联网让世界变得更加 ",
      sentence_suffix: " 。",
      missing_char: "紧密",
      options: [
        { char: "紧密", hint: "Tight + Dense", explanation: "Close/Tight" },
        { char: "遥远", hint: "Far + Remote", explanation: "Distant" },
        { char: "广阔", hint: "Wide + Vast", explanation: "Vast" }
      ],
      correct_explanation: "Connected! CLOSE (紧密) means tightly woven!"
    },
    {
      id: 605,
      scenario: "🎓 GRADUATION DAY",
      sentence_prefix: "毕业典礼上，学生们感到非常 ",
      sentence_suffix: " 。",
      missing_char: "自豪",
      options: [
        { char: "自豪", hint: "Self + Proud", explanation: "Proud" },
        { char: "惭愧", hint: "Ashamed", explanation: "Ashamed" },
        { char: "谦虚", hint: "Modest", explanation: "Modest" }
      ],
      correct_explanation: "Congratulations! PROUD (自豪) is self-admiration!"
    }
  ]
};

export const getAllLevelsForGrade = (grade: number): Level[] => {
  return curriculum[grade] || curriculum[1];
};

export const getRandomLevelForGrade = (grade: number): Level => {
  const levels = getAllLevelsForGrade(grade);
  return levels[Math.floor(Math.random() * levels.length)];
};
