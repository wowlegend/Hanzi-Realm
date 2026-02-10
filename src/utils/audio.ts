import { AUDIO_DEFAULTS } from './constants';

const audioCache = new Map<string, string>();

let debugCallback: ((message: string, isError: boolean) => void) | null = null;

export const setDebugCallback = (callback: (message: string, isError: boolean) => void) => {
  debugCallback = callback;
};

export const clearAudioCache = () => {
  audioCache.clear();
};

export const speakChinese = async (
  text: string,
  explicitApiKey: string,
  explicitRegion: string,
  useAzure: boolean,
  fallbackLanguage: string = 'zh-CN',
  audioSpeed: number = 1.0
): Promise<void> => {
  if (useAzure && explicitApiKey) {
    if (debugCallback) {
      debugCallback(`Fetching Azure TTS audio...`, false);
    }
    try {
      await speakWithAzure(text, explicitApiKey, explicitRegion, audioSpeed);
    } catch (error) {
      console.error('Azure TTS error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (debugCallback) {
        debugCallback(`Azure TTS Error: ${errorMessage}`, true);
      }
      speakWithFallback(text, fallbackLanguage, audioSpeed);
    }
  } else {
    speakWithFallback(text, fallbackLanguage, audioSpeed);
  }
};

const speakWithAzure = async (text: string, apiKey: string, region: string, audioSpeed: number = 1.0): Promise<void> => {
  const finalApiKey = apiKey || localStorage.getItem('azure_key') || AUDIO_DEFAULTS.KEY;
  const finalRegion = region || localStorage.getItem('azure_region') || AUDIO_DEFAULTS.REGION;

  const cleanText = text
    .replace(/_/g, '')
    .replace(/\{[^}]+\}/g, '')
    .replace(/\s+/g, '')
    .trim();

  const textToPlay = cleanText.endsWith('\u3002') ? cleanText : cleanText + '\u3002';
  const selectedVoice = localStorage.getItem('azureVoice') || AUDIO_DEFAULTS.VOICE;
  const voiceGender = selectedVoice.includes('Xiaoxiao') ? 'Female' : 'Male';
  const cacheKey = `${textToPlay}_azure_${selectedVoice}`;

  if (audioCache.has(cacheKey)) {
    const audioUrl = audioCache.get(cacheKey)!;
    const audio = new Audio(audioUrl);
    audio.playbackRate = audioSpeed;
    audio.play();
    if (debugCallback) {
      debugCallback(`Playing cached audio`, false);
    }
    return;
  }

  const ssml = `<speak version='1.0' xml:lang='zh-CN'>
  <voice xml:lang='zh-CN' xml:gender='${voiceGender}' name='${selectedVoice}'>
    ${textToPlay}
  </voice>
</speak>`;

  const url = `https://${finalRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': finalApiKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      'User-Agent': 'HanziRealm'
    },
    body: ssml,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorMessage = response.status === 401
      ? 'Azure API key is invalid or expired. Check your configuration.'
      : `Status ${response.status}: ${errorText}`;
    if (debugCallback) {
      debugCallback(errorMessage, true);
    }
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  audioCache.set(cacheKey, audioUrl);

  const audio = new Audio(audioUrl);
  audio.playbackRate = audioSpeed;
  audio.play();

  if (debugCallback) {
    debugCallback(`Azure audio ready (${blob.size} bytes)`, false);
  }
};

const speakWithFallback = (text: string, language: string, audioSpeed: number = 1.0): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang.startsWith(language));

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Ting-Ting'));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = audioSpeed;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
};

export const playSound = (type: 'correct' | 'wrong' | 'purchase' | 'combo'): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'wrong':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'purchase':
        oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1174.66, audioContext.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      case 'combo':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.05);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
    }
  } catch (error) {
    console.error('Audio playback error:', error);
  }
};
