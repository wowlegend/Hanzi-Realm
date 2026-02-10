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
  _apiKey: string,
  _region: string,
  useEdgeTts: boolean,
  fallbackLanguage: string = 'zh-CN',
  audioSpeed: number = 1.0
): Promise<void> => {
  if (useEdgeTts) {
    try {
      await speakWithEdgeTts(text, audioSpeed);
    } catch (error) {
      console.error('Edge TTS error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (debugCallback) {
        debugCallback(`Edge TTS Error: ${errorMessage}. Using browser voice.`, true);
      }
      speakWithFallback(text, fallbackLanguage, audioSpeed);
    }
  } else {
    speakWithFallback(text, fallbackLanguage, audioSpeed);
  }
};

const speakWithEdgeTts = async (text: string, audioSpeed: number = 1.0): Promise<void> => {
  const cleanText = text
    .replace(/_/g, '')
    .replace(/\{[^}]+\}/g, '')
    .replace(/\s+/g, '')
    .trim();

  const textToPlay = cleanText.endsWith('\u3002') ? cleanText : cleanText + '\u3002';
  const selectedVoice = localStorage.getItem('azureVoice') || 'zh-CN-YunxiNeural';
  const cacheKey = `${textToPlay}_edge_${selectedVoice}`;

  if (audioCache.has(cacheKey)) {
    const audioUrl = audioCache.get(cacheKey)!;
    const audio = new Audio(audioUrl);
    audio.playbackRate = audioSpeed;
    audio.play();
    if (debugCallback) {
      debugCallback('Playing cached audio', false);
    }
    return;
  }

  if (debugCallback) {
    debugCallback('Fetching Edge TTS audio...', false);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/tts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: textToPlay, voice: selectedVoice }),
  });

  if (!response.ok) {
    let errorMsg = `Status ${response.status}`;
    try {
      const errBody = await response.json();
      errorMsg = errBody.error || errorMsg;
    } catch { /* ignore */ }
    throw new Error(errorMsg);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error('Empty audio response');
  }

  const audioUrl = URL.createObjectURL(blob);
  audioCache.set(cacheKey, audioUrl);

  const audio = new Audio(audioUrl);
  audio.playbackRate = audioSpeed;
  audio.play();

  if (debugCallback) {
    debugCallback(`Edge TTS audio ready (${blob.size} bytes)`, false);
  }
};

const speakWithFallback = (text: string, language: string, audioSpeed: number = 1.0): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();

    let selectedVoice = voices.find(v =>
      v.lang.startsWith(language) && (v.name.includes('Neural') || v.name.includes('Microsoft'))
    );
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith(language) && v.name.includes('Google')
      );
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith(language));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.name.includes('Ting-Ting') || v.name.includes('Chinese')
      );
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
