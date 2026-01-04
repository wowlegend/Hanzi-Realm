import { useState, useCallback, useEffect } from 'react';
import { speakChinese, setDebugCallback } from '../utils/audio';
import { sfxManager } from '../utils/sfx';
import { GameSettings, MusicState } from '../types';

interface UseGameAudioReturn {
  isSpeaking: boolean;
  isAudioPlaying: boolean;
  debugMessage: string;
  debugIsError: boolean;
  musicState: MusicState;
  bgmEnabled: boolean;
  setBgmEnabled: (enabled: boolean) => void;
  setMusicState: (state: MusicState) => void;
  clearDebug: () => void;
  speak: (text: string, settings: GameSettings) => Promise<void>;
  playSfx: (sound: 'click' | 'correct' | 'wrong' | 'combo' | 'boss' | 'gacha') => void;
}

export function useGameAudio(): UseGameAudioReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');
  const [debugIsError, setDebugIsError] = useState(false);
  const [musicState, setMusicState] = useState<MusicState>('map');
  const [bgmEnabled, setBgmEnabled] = useState(true);

  useEffect(() => {
    setDebugCallback((message: string, isError: boolean) => {
      setDebugMessage(message);
      setDebugIsError(isError);
    });
  }, []);

  const clearDebug = useCallback(() => {
    setDebugMessage('');
  }, []);

  const speak = useCallback(async (text: string, settings: GameSettings) => {
    setIsSpeaking(true);
    setIsAudioPlaying(true);
    sfxManager.play('click');
    try {
      const apiKey = localStorage.getItem('azure_key') || settings.elevenLabsApiKey;
      const region = localStorage.getItem('azure_region') || settings.voiceId || 'eastasia';
      await speakChinese(text, apiKey, region, settings.useElevenLabs, settings.audioLanguage, settings.audioSpeed);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
      setTimeout(() => setIsAudioPlaying(false), 1000);
    }
  }, []);

  const playSfx = useCallback((sound: 'click' | 'correct' | 'wrong' | 'combo' | 'boss' | 'gacha') => {
    sfxManager.play(sound);
  }, []);

  return {
    isSpeaking,
    isAudioPlaying,
    debugMessage,
    debugIsError,
    musicState,
    bgmEnabled,
    setBgmEnabled,
    setMusicState,
    clearDebug,
    speak,
    playSfx,
  };
}
