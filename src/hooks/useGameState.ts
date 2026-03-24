import { useReducer, useCallback } from 'react';
import { GameState, GameSettings, PlayerInventory, Companion } from '../types';

export const DEFAULT_GAME_STATE: GameState = {
  currentLevelIndex: 0,
  jade: 0,
  currentStreak: 0,
  bestStreak: 0,
  selectedOption: null,
  isCorrect: null,
  showFeedback: false,
  questionsAnswered: 0,
  bossesDefeated: 0,
  wordsLearned: new Set(),
  gradeLevel: 1,
  worldNumber: 1,
  seenQuestionIds: new Set(),
  gameMode: 'standard',
  streakShieldActive: false,
  streakShieldUsed: false,
  fireMode: false,
  currentNodeId: null,
  nodeQuestionsTotal: 0,
  nodeQuestionsAnswered: 0,
  bossHp: 0,
  bossMaxHp: 0,
};

export const DEFAULT_SETTINGS: GameSettings = {
  audioLanguage: 'zh-CN',
  useAzureTts: true,
  gradeLevel: 1,
  audioSpeed: 0.75,
  bgmVolume: 0.1,
  sfxVolume: 0.7,
};

export const DEFAULT_INVENTORY: PlayerInventory = {
  theme: 'default',
  activeCompanion: null,
  companions: [],
};

type GameAction =
  | { type: 'SET_FIELD'; payload: Partial<GameState> }
  | { type: 'ADD_JADE'; payload: number }
  | { type: 'ADD_WORD'; payload: string }
  | { type: 'RESET_STREAK' }
  | { type: 'INCREMENT_STREAK'; payload: number }
  | { type: 'SET_BOSS_HP'; payload: number }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'NEXT_LEVEL'; payload: number }
  | { type: 'BULK_UPDATE'; payload: Partial<GameState> };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_FIELD':
    case 'BULK_UPDATE':
      return { ...state, ...action.payload };

    case 'ADD_JADE':
      return { ...state, jade: state.jade + action.payload };

    case 'ADD_WORD': {
      const newWords = new Set(state.wordsLearned);
      newWords.add(action.payload);
      return { ...state, wordsLearned: newWords };
    }

    case 'RESET_STREAK':
      return { ...state, currentStreak: 0 };

    case 'INCREMENT_STREAK': {
      const newStreak = state.currentStreak + action.payload;
      return {
        ...state,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, state.bestStreak),
      };
    }

    case 'SET_BOSS_HP':
      return { ...state, bossHp: action.payload };

    case 'CLEAR_FEEDBACK':
      return { ...state, selectedOption: null, isCorrect: null, showFeedback: false };

    case 'NEXT_LEVEL':
      return {
        ...state,
        currentLevelIndex: action.payload,
        selectedOption: null,
        isCorrect: null,
        showFeedback: false,
      };

    default:
      return state;
  }
}

export function useGameState() {
  const [gameState, dispatch] = useReducer(gameReducer, DEFAULT_GAME_STATE);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    dispatch({ type: 'BULK_UPDATE', payload: updates });
  }, []);

  const addJade = useCallback((amount: number) => {
    dispatch({ type: 'ADD_JADE', payload: amount });
  }, []);

  const addWord = useCallback((word: string) => {
    dispatch({ type: 'ADD_WORD', payload: word });
  }, []);

  const resetStreak = useCallback(() => {
    dispatch({ type: 'RESET_STREAK' });
  }, []);

  const incrementStreak = useCallback((amount: number) => {
    dispatch({ type: 'INCREMENT_STREAK', payload: amount });
  }, []);

  const clearFeedback = useCallback(() => {
    dispatch({ type: 'CLEAR_FEEDBACK' });
  }, []);

  return {
    gameState,
    dispatch,
    updateGameState,
    addJade,
    addWord,
    resetStreak,
    incrementStreak,
    clearFeedback,
  };
}
