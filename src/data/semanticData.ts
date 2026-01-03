export interface FixedSentence {
  subject: string;
  verb: string;
  object: string;
  template: string;
}

export interface ZoneDistractors {
  subject?: string[];
  verb: string[];
  object: string[];
}

export interface SemanticZone {
  id: string;
  category: string;
  gradeRange: [number, number];
  sentences: FixedSentence[];
  distractors: ZoneDistractors;
}

export const SEMANTIC_ZONES: SemanticZone[] = [
  // ZONE 1: ADVENTURE (High Grade)
  {
    id: "adventure",
    category: "ADVENTURE",
    gradeRange: [4, 6],
    sentences: [
      { subject: "登山队", verb: "攀登", object: "高峰", template: "{subject}成功{verb}了{object}。" },
      { subject: "探险家", verb: "穿越", object: "沙漠", template: "{subject}勇敢地{verb}了{object}。" },
      { subject: "宇航员", verb: "探索", object: "太空", template: "{subject}正在{verb}神秘的{object}。" },
      { subject: "潜水员", verb: "发现", object: "沉船", template: "{subject}在海底{verb}了{object}。" },
      { subject: "科学家", verb: "研究", object: "火山", template: "{subject}仔细{verb}活跃的{object}。" },
      { subject: "考古学家", verb: "挖掘", object: "遗迹", template: "{subject}小心{verb}古老的{object}。" },
      { subject: "飞行员", verb: "驾驶", object: "飞机", template: "{subject}熟练地{verb}大型{object}。" },
      { subject: "船长", verb: "指挥", object: "船队", template: "{subject}镇定地{verb}庞大的{object}。" }
    ],
    distractors: {
      subject: ["登山队", "探险家", "宇航员", "潜水员", "科学家", "考古学家", "飞行员", "船长"],
      verb: ["攀登", "穿越", "探索", "发现", "研究", "挖掘", "驾驶", "指挥"],
      object: ["高峰", "沙漠", "太空", "沉船", "火山", "遗迹", "飞机", "船队"]
    }
  },

  // ZONE 2: DAILY LIFE (Mid Grade)
  {
    id: "daily",
    category: "DAILY LIFE",
    gradeRange: [1, 4],
    sentences: [
      { subject: "妈妈", verb: "准备", object: "晚餐", template: "{subject}在厨房{verb}丰盛的{object}。" },
      { subject: "爷爷", verb: "练习", object: "书法", template: "{subject}在书房{verb}中国{object}。" },
      { subject: "弟弟", verb: "整理", object: "玩具", template: "{subject}正在房间{verb}乱丢的{object}。" },
      { subject: "爸爸", verb: "修理", object: "电脑", template: "{subject}仔细地{verb}坏掉的{object}。" },
      { subject: "姐姐", verb: "打扫", object: "房间", template: "{subject}认真地{verb}凌乱的{object}。" },
      { subject: "奶奶", verb: "浇水", object: "花朵", template: "{subject}每天给{object}{verb}。" },
      { subject: "哥哥", verb: "洗刷", object: "碗筷", template: "{subject}吃完饭后{verb}所有{object}。" },
      { subject: "妹妹", verb: "喂养", object: "小猫", template: "{subject}温柔地{verb}可爱的{object}。" }
    ],
    distractors: {
      subject: ["妈妈", "爷爷", "弟弟", "爸爸", "姐姐", "奶奶", "哥哥", "妹妹"],
      verb: ["准备", "练习", "整理", "修理", "打扫", "浇水", "洗刷", "喂养"],
      object: ["晚餐", "书法", "玩具", "电脑", "房间", "花朵", "碗筷", "小猫"]
    }
  },

  // ZONE 3: NATURE (Low Grade)
  {
    id: "nature",
    category: "NATURE",
    gradeRange: [1, 3],
    sentences: [
      { subject: "小鸟", verb: "飞向", object: "蓝天", template: "{subject}快乐地{verb}{object}。" },
      { subject: "青蛙", verb: "跳进", object: "池塘", template: "{subject}扑通一声{verb}了{object}。" },
      { subject: "松鼠", verb: "寻找", object: "松果", template: "{subject}在树上{verb}美味的{object}。" },
      { subject: "蝴蝶", verb: "飞舞", object: "花园", template: "{subject}在{object}里{verb}。" },
      { subject: "蜜蜂", verb: "采集", object: "花蜜", template: "{subject}勤劳地{verb}甜美的{object}。" },
      { subject: "兔子", verb: "蹦跳", object: "草地", template: "{subject}在{object}上{verb}。" },
      { subject: "金鱼", verb: "游动", object: "水缸", template: "{subject}在{object}里{verb}。" },
      { subject: "蜗牛", verb: "爬行", object: "树叶", template: "{subject}慢慢地在{object}上{verb}。" }
    ],
    distractors: {
      subject: ["小鸟", "青蛙", "松鼠", "蝴蝶", "蜜蜂", "兔子", "金鱼", "蜗牛"],
      verb: ["飞向", "跳进", "寻找", "飞舞", "采集", "蹦跳", "游动", "爬行"],
      object: ["蓝天", "池塘", "松果", "花园", "花蜜", "草地", "水缸", "树叶"]
    }
  },

  // ZONE 4: ARTS & PERFORMANCE (Mid-High Grade)
  {
    id: "arts",
    category: "ARTS",
    gradeRange: [3, 5],
    sentences: [
      { subject: "钢琴家", verb: "演奏", object: "名曲", template: "{subject}在舞台上{verb}经典{object}。" },
      { subject: "舞蹈家", verb: "表演", object: "舞蹈", template: "{subject}优雅地{verb}传统{object}。" },
      { subject: "歌唱家", verb: "演唱", object: "歌剧", template: "{subject}深情地{verb}著名{object}。" },
      { subject: "画家", verb: "创作", object: "油画", template: "{subject}专注地{verb}精美的{object}。" },
      { subject: "雕塑家", verb: "雕刻", object: "石像", template: "{subject}精心{verb}巨大的{object}。" },
      { subject: "书法家", verb: "书写", object: "对联", template: "{subject}认真{verb}喜庆的{object}。" },
      { subject: "作家", verb: "撰写", object: "小说", template: "{subject}用心{verb}感人的{object}。" },
      { subject: "诗人", verb: "吟诵", object: "诗歌", template: "{subject}深情地{verb}优美的{object}。" }
    ],
    distractors: {
      subject: ["钢琴家", "舞蹈家", "歌唱家", "画家", "雕塑家", "书法家", "作家", "诗人"],
      verb: ["演奏", "表演", "演唱", "创作", "雕刻", "书写", "撰写", "吟诵"],
      object: ["名曲", "舞蹈", "歌剧", "油画", "石像", "对联", "小说", "诗歌"]
    }
  },

  // ZONE 5: FOOD & COOKING (Low-Mid Grade)
  {
    id: "food",
    category: "FOOD",
    gradeRange: [1, 3],
    sentences: [
      { subject: "小明", verb: "品尝", object: "西瓜", template: "{subject}开心地{verb}甜美的{object}。" },
      { subject: "妹妹", verb: "吃完", object: "饺子", template: "{subject}很快{verb}了一盘{object}。" },
      { subject: "厨师", verb: "烹饪", object: "面条", template: "{subject}熟练地{verb}美味的{object}。" },
      { subject: "奶奶", verb: "蒸煮", object: "包子", template: "{subject}精心{verb}香喷喷的{object}。" },
      { subject: "妈妈", verb: "炒制", object: "青菜", template: "{subject}快速{verb}新鲜的{object}。" },
      { subject: "爸爸", verb: "烤制", object: "面包", template: "{subject}在烤箱里{verb}松软的{object}。" },
      { subject: "哥哥", verb: "调配", object: "果汁", template: "{subject}仔细{verb}健康的{object}。" },
      { subject: "弟弟", verb: "享用", object: "蛋糕", template: "{subject}开心地{verb}美味的{object}。" }
    ],
    distractors: {
      subject: ["小明", "妹妹", "厨师", "奶奶", "妈妈", "爸爸", "哥哥", "弟弟"],
      verb: ["品尝", "吃完", "烹饪", "蒸煮", "炒制", "烤制", "调配", "享用"],
      object: ["西瓜", "饺子", "面条", "包子", "青菜", "面包", "果汁", "蛋糕"]
    }
  },

  // ZONE 6: SCHOOL LIFE (Mid Grade)
  {
    id: "school",
    category: "SCHOOL",
    gradeRange: [2, 4],
    sentences: [
      { subject: "学生", verb: "学习", object: "汉字", template: "{subject}认真地{verb}复杂的{object}。" },
      { subject: "老师", verb: "讲解", object: "课文", template: "{subject}耐心地{verb}新的{object}。" },
      { subject: "班长", verb: "收集", object: "作业", template: "{subject}快速{verb}全班的{object}。" },
      { subject: "同学", verb: "背诵", object: "古诗", template: "{subject}努力{verb}优美的{object}。" },
      { subject: "校长", verb: "主持", object: "典礼", template: "{subject}庄重地{verb}毕业{object}。" },
      { subject: "组长", verb: "分发", object: "试卷", template: "{subject}有序地{verb}考试{object}。" },
      { subject: "教授", verb: "研究", object: "问题", template: "{subject}深入{verb}学术{object}。" },
      { subject: "辅导员", verb: "帮助", object: "学生", template: "{subject}热心地{verb}困难的{object}。" }
    ],
    distractors: {
      subject: ["学生", "老师", "班长", "同学", "校长", "组长", "教授", "辅导员"],
      verb: ["学习", "讲解", "收集", "背诵", "主持", "分发", "研究", "帮助"],
      object: ["汉字", "课文", "作业", "古诗", "典礼", "试卷", "问题", "学生"]
    }
  },

  // ZONE 7: SPORTS & EXERCISE (Mid Grade)
  {
    id: "sports",
    category: "SPORTS",
    gradeRange: [2, 4],
    sentences: [
      { subject: "运动员", verb: "训练", object: "技巧", template: "{subject}刻苦地{verb}比赛{object}。" },
      { subject: "球员", verb: "射门", object: "足球", template: "{subject}用力{verb}飞向球门的{object}。" },
      { subject: "游泳选手", verb: "练习", object: "蛙泳", template: "{subject}反复{verb}标准的{object}。" },
      { subject: "教练", verb: "指导", object: "队员", template: "{subject}严格地{verb}年轻的{object}。" },
      { subject: "跑步者", verb: "冲刺", object: "终点", template: "{subject}奋力向{object}{verb}。" },
      { subject: "体操选手", verb: "完成", object: "动作", template: "{subject}完美地{verb}高难度{object}。" },
      { subject: "篮球队", verb: "赢得", object: "冠军", template: "{subject}努力{verb}了联赛{object}。" },
      { subject: "乒乓选手", verb: "发挥", object: "水平", template: "{subject}稳定{verb}最佳{object}。" }
    ],
    distractors: {
      subject: ["运动员", "球员", "游泳选手", "教练", "跑步者", "体操选手", "篮球队", "乒乓选手"],
      verb: ["训练", "射门", "练习", "指导", "冲刺", "完成", "赢得", "发挥"],
      object: ["技巧", "足球", "蛙泳", "队员", "终点", "动作", "冠军", "水平"]
    }
  },

  // ZONE 8: WEATHER & SEASONS (Low-Mid Grade)
  {
    id: "weather",
    category: "WEATHER",
    gradeRange: [1, 3],
    sentences: [
      { subject: "春雨", verb: "滋润", object: "大地", template: "{subject}轻柔地{verb}干燥的{object}。" },
      { subject: "夏阳", verb: "照耀", object: "田野", template: "{subject}热烈地{verb}金色的{object}。" },
      { subject: "秋风", verb: "吹落", object: "树叶", template: "{subject}慢慢{verb}金黄的{object}。" },
      { subject: "冬雪", verb: "覆盖", object: "山岗", template: "{subject}悄悄{verb}起伏的{object}。" },
      { subject: "雷电", verb: "划破", object: "夜空", template: "{subject}突然{verb}漆黑的{object}。" },
      { subject: "彩虹", verb: "出现", object: "天边", template: "{subject}美丽地在{object}{verb}。" },
      { subject: "浓雾", verb: "笼罩", object: "山谷", template: "{subject}渐渐{verb}幽深的{object}。" },
      { subject: "晨光", verb: "唤醒", object: "万物", template: "{subject}温暖地{verb}沉睡的{object}。" }
    ],
    distractors: {
      subject: ["春雨", "夏阳", "秋风", "冬雪", "雷电", "彩虹", "浓雾", "晨光"],
      verb: ["滋润", "照耀", "吹落", "覆盖", "划破", "出现", "笼罩", "唤醒"],
      object: ["大地", "田野", "树叶", "山岗", "夜空", "天边", "山谷", "万物"]
    }
  },

  // ZONE 9: TRAVEL & PLACES (Mid-High Grade)
  {
    id: "travel",
    category: "TRAVEL",
    gradeRange: [3, 5],
    sentences: [
      { subject: "游客", verb: "参观", object: "长城", template: "{subject}兴奋地{verb}雄伟的{object}。" },
      { subject: "摄影师", verb: "拍摄", object: "风景", template: "{subject}专注地{verb}壮丽的{object}。" },
      { subject: "导游", verb: "介绍", object: "历史", template: "{subject}详细地{verb}悠久的{object}。" },
      { subject: "旅行者", verb: "欣赏", object: "日出", template: "{subject}静静地{verb}美丽的{object}。" },
      { subject: "背包客", verb: "徒步", object: "古道", template: "{subject}缓慢地{verb}崎岖的{object}。" },
      { subject: "团队", verb: "游览", object: "寺庙", template: "{subject}有序地{verb}古老的{object}。" },
      { subject: "画家", verb: "描绘", object: "湖泊", template: "{subject}细心地{verb}宁静的{object}。" },
      { subject: "记者", verb: "记录", object: "民俗", template: "{subject}认真地{verb}特色{object}。" }
    ],
    distractors: {
      subject: ["游客", "摄影师", "导游", "旅行者", "背包客", "团队", "画家", "记者"],
      verb: ["参观", "拍摄", "介绍", "欣赏", "徒步", "游览", "描绘", "记录"],
      object: ["长城", "风景", "历史", "日出", "古道", "寺庙", "湖泊", "民俗"]
    }
  },

  // ZONE 10: TRADITIONAL CULTURE (High Grade)
  {
    id: "culture",
    category: "CULTURE",
    gradeRange: [4, 6],
    sentences: [
      { subject: "家人", verb: "庆祝", object: "春节", template: "{subject}热闹地{verb}传统{object}。" },
      { subject: "艺人", verb: "表演", object: "京剧", template: "{subject}精彩地{verb}经典{object}。" },
      { subject: "匠人", verb: "制作", object: "瓷器", template: "{subject}精心{verb}精美的{object}。" },
      { subject: "茶师", verb: "冲泡", object: "茶叶", template: "{subject}优雅地{verb}上等{object}。" },
      { subject: "武师", verb: "演练", object: "武术", template: "{subject}刚劲地{verb}传统{object}。" },
      { subject: "民众", verb: "观赏", object: "花灯", template: "{subject}开心地{verb}精致的{object}。" },
      { subject: "大师", verb: "传承", object: "技艺", template: "{subject}用心{verb}古老的{object}。" },
      { subject: "学者", verb: "研读", object: "典籍", template: "{subject}深入{verb}珍贵的{object}。" }
    ],
    distractors: {
      subject: ["家人", "艺人", "匠人", "茶师", "武师", "民众", "大师", "学者"],
      verb: ["庆祝", "表演", "制作", "冲泡", "演练", "观赏", "传承", "研读"],
      object: ["春节", "京剧", "瓷器", "茶叶", "武术", "花灯", "技艺", "典籍"]
    }
  },

  // ZONE 11: EMOTIONS & RELATIONSHIPS (Mid Grade)
  {
    id: "emotions",
    category: "EMOTIONS",
    gradeRange: [2, 4],
    sentences: [
      { subject: "小明", verb: "感到", object: "开心", template: "{subject}{verb}非常{object}。" },
      { subject: "姐姐", verb: "表达", object: "感谢", template: "{subject}真诚地{verb}深深的{object}。" },
      { subject: "朋友", verb: "分享", object: "快乐", template: "{subject}愿意{verb}彼此的{object}。" },
      { subject: "妈妈", verb: "给予", object: "关爱", template: "{subject}无私地{verb}温暖的{object}。" },
      { subject: "老师", verb: "表现", object: "耐心", template: "{subject}始终{verb}极大的{object}。" },
      { subject: "孩子", verb: "展现", object: "勇气", template: "{subject}在困难中{verb}惊人的{object}。" },
      { subject: "同学", verb: "建立", object: "友谊", template: "{subject}慢慢{verb}珍贵的{object}。" },
      { subject: "爷爷", verb: "回忆", object: "往事", template: "{subject}经常{verb}美好的{object}。" }
    ],
    distractors: {
      subject: ["小明", "姐姐", "朋友", "妈妈", "老师", "孩子", "同学", "爷爷"],
      verb: ["感到", "表达", "分享", "给予", "表现", "展现", "建立", "回忆"],
      object: ["开心", "感谢", "快乐", "关爱", "耐心", "勇气", "友谊", "往事"]
    }
  },

  // ZONE 12: TECHNOLOGY & MODERN LIFE (High Grade)
  {
    id: "technology",
    category: "TECHNOLOGY",
    gradeRange: [4, 6],
    sentences: [
      { subject: "工程师", verb: "开发", object: "软件", template: "{subject}努力{verb}新型{object}。" },
      { subject: "设计师", verb: "设计", object: "界面", template: "{subject}精心{verb}友好的{object}。" },
      { subject: "程序员", verb: "编写", object: "代码", template: "{subject}仔细{verb}高效的{object}。" },
      { subject: "科学家", verb: "测试", object: "设备", template: "{subject}反复{verb}精密的{object}。" },
      { subject: "技师", verb: "维修", object: "机器", template: "{subject}专业地{verb}故障的{object}。" },
      { subject: "专家", verb: "分析", object: "数据", template: "{subject}深入{verb}海量的{object}。" },
      { subject: "操作员", verb: "操控", object: "系统", template: "{subject}熟练地{verb}复杂的{object}。" },
      { subject: "研究员", verb: "改进", object: "算法", template: "{subject}不断{verb}现有的{object}。" }
    ],
    distractors: {
      subject: ["工程师", "设计师", "程序员", "科学家", "技师", "专家", "操作员", "研究员"],
      verb: ["开发", "设计", "编写", "测试", "维修", "分析", "操控", "改进"],
      object: ["软件", "界面", "代码", "设备", "机器", "数据", "系统", "算法"]
    }
  }
];

export function getZonesForGrade(grade: number): SemanticZone[] {
  return SEMANTIC_ZONES.filter(
    zone => grade >= zone.gradeRange[0] && grade <= zone.gradeRange[1]
  );
}
