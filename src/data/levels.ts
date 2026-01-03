import { Level } from '../types';

export const levelData: Level[] = [
  {
    id: 1,
    scenario: "🧟 ZOMBIE ATTACK",
    sentence_prefix: "快 ",
    sentence_suffix: " ！僵尸来了！",
    missing_char: "跑",
    options: [
      { char: "泡", hint: "Water Radical (氵)", explanation: "Bubble" },
      { char: "跑", hint: "Foot Radical (⻊)", explanation: "Run" },
      { char: "炮", hint: "Fire Radical (火)", explanation: "Cannon" }
    ],
    correct_explanation: "Correct! You need FEET (⻊) to RUN!"
  },
  {
    id: 2,
    scenario: "🐷 PIGGY TRAP",
    sentence_prefix: "我需要一把 ",
    sentence_suffix: " 匙开门。",
    missing_char: "钥",
    options: [
      { char: "药", hint: "Medicine (氵)", explanation: "Medicine" },
      { char: "要", hint: "Want (言)", explanation: "Want" },
      { char: "钥", hint: "Metal (钅)", explanation: "Key" }
    ],
    correct_explanation: "Perfect! A key (钥) is made of METAL (钅)!"
  },
  {
    id: 3,
    scenario: "⚔️ WEAPON SHOP",
    sentence_prefix: "这把黄金 ",
    sentence_suffix: " 很锋利。",
    missing_char: "剑",
    options: [
      { char: "箭", hint: "Bamboo (⺮)", explanation: "Arrow" },
      { char: "剑", hint: "Knife Side (刂)", explanation: "Sword" },
      { char: "见", hint: "See", explanation: "To See" }
    ],
    correct_explanation: "Nice! A sword (剑) is a sharp knife (刂)!"
  },
  {
    id: 4,
    scenario: "💰 TYCOON EMPIRE",
    sentence_prefix: "我想 ",
    sentence_suffix: " 一个商店。",
    missing_char: "开",
    options: [
      { char: "开", hint: "Open (Hands)", explanation: "Open" },
      { char: "介", hint: "Introduce", explanation: "Introduce" },
      { char: "才", hint: "Talent", explanation: "Talent" }
    ],
    correct_explanation: "Excellent! To open (开) uses HANDS (廾)!"
  },
  {
    id: 5,
    scenario: "🏫 CLASSROOM",
    sentence_prefix: "我 ",
    sentence_suffix: " 在椅子上。",
    missing_char: "坐",
    options: [
      { char: "做", hint: "To Do (Person)", explanation: "Do/Make" },
      { char: "坐", hint: "To Sit (Earth)", explanation: "Sit" },
      { char: "座", hint: "Seat (Noun)", explanation: "Seat" }
    ],
    correct_explanation: "Perfect! You sit (坐) on the ground (土)!"
  },
  {
    id: 6,
    scenario: "🌊 DROWNING ESCAPE",
    sentence_prefix: "快 ",
    sentence_suffix: "！水太深了！",
    missing_char: "浮",
    options: [
      { char: "符", hint: "Sign", explanation: "Sign" },
      { char: "浮", hint: "Float (Water)", explanation: "Float" },
      { char: "富", hint: "Rich", explanation: "Rich" }
    ],
    correct_explanation: "Great! To float (浮) in WATER (氵)!"
  },
  {
    id: 7,
    scenario: "🍔 PIZZA SHOP",
    sentence_prefix: "我想 ",
    sentence_suffix: " 一个披萨。",
    missing_char: "吃",
    options: [
      { char: "七", hint: "Seven", explanation: "Seven" },
      { char: "吃", hint: "Mouth (口)", explanation: "Eat" },
      { char: "次", hint: "Time", explanation: "Time" }
    ],
    correct_explanation: "Yummy! You EAT (吃) with your MOUTH (口)!"
  },
  {
    id: 8,
    scenario: "🏃 ESCAPE COURSE",
    sentence_prefix: "请不要 ",
    sentence_suffix: " 我的东西！",
    missing_char: "动",
    options: [
      { char: "洞", hint: "Hole (Water)", explanation: "Hole" },
      { char: "动", hint: "Move (Force)", explanation: "Move" },
      { char: "冻", hint: "Freeze (Ice)", explanation: "Freeze" }
    ],
    correct_explanation: "Right! Moving needs POWER/FORCE (力)!"
  },
  {
    id: 9,
    scenario: "👁️ SPY MISSION",
    sentence_prefix: "我 ",
    sentence_suffix: " 到敌人了。",
    missing_char: "看",
    options: [
      { char: "干", hint: "Trunk", explanation: "Trunk/Dry" },
      { char: "看", hint: "Eye Radical (目)", explanation: "Look" },
      { char: "哭", hint: "Mouth (口)", explanation: "Cry" }
    ],
    correct_explanation: "Perfect! You LOOK (看) with your EYES (目)!"
  },
  {
    id: 10,
    scenario: "📚 LIBRARY STUDY",
    sentence_prefix: "这本 ",
    sentence_suffix: " 很有趣。",
    missing_char: "书",
    options: [
      { char: "树", hint: "Wood (木)", explanation: "Tree" },
      { char: "书", hint: "Bamboo (竹)", explanation: "Book" },
      { char: "鼠", hint: "Mouse", explanation: "Mouse" }
    ],
    correct_explanation: "Smart! A BOOK (书) is made of BAMBOO (竹)!"
  }
];
