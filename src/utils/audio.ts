import { getCachedAudio, setCachedAudio, clearTTSCache } from './ttsCache';

export type TtsEngine = 'azure' | 'elevenlabs' | 'edge' | 'browser';

let debugCallback: ((message: string, isError: boolean) => void) | null = null;

export const setDebugCallback = (callback: (message: string, isError: boolean) => void) => {
  debugCallback = callback;
};

export const clearAudioCache = () => {
  clearTTSCache();
};

export function getTtsEngine(): TtsEngine {
  const stored = localStorage.getItem('ttsEngine') as TtsEngine | null;
  if (stored === 'elevenlabs' || stored === 'edge' || stored === 'browser' || stored === 'azure') {
    return stored;
  }
  return 'azure';
}

export function setTtsEngine(engine: TtsEngine) {
  localStorage.setItem('ttsEngine', engine);
}

function cleanText(text: string): string {
  return text
    .replace(/_/g, '')
    .replace(/\{[^}]+\}/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function speedToSsmlRate(speed: number): string {
  const pct = Math.round((speed - 1) * 100);
  if (pct >= 0) return `+${pct}%`;
  return `${pct}%`;
}

export const speakChinese = async (
  text: string,
  _apiKey: string,
  _region: string,
  useEdgeTts: boolean,
  fallbackLanguage: string = 'zh-CN',
  audioSpeed: number = 1.0
): Promise<void> => {
  try {
    const engine = getTtsEngine();

    if (engine === 'azure') {
      try {
        await speakWithAzureTts(text, audioSpeed);
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (debugCallback) debugCallback(`Azure TTS error: ${msg}. Falling back to Edge TTS...`, true);
      }

      try {
        await speakWithEdgeTts(text, audioSpeed);
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (debugCallback) debugCallback(`Edge TTS fallback error: ${msg}. Using browser voice.`, true);
      }

      speakWithBrowserTts(text, fallbackLanguage, audioSpeed);
      return;
    }

    if (engine === 'elevenlabs') {
      try {
        await speakWithElevenLabs(text, audioSpeed);
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (debugCallback) debugCallback(`ElevenLabs error: ${msg}. Falling back...`, true);
      }

      try {
        await speakWithEdgeTts(text, audioSpeed);
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (debugCallback) debugCallback(`Edge TTS fallback error: ${msg}. Using browser voice.`, true);
      }

      speakWithBrowserTts(text, fallbackLanguage, audioSpeed);
      return;
    }

    if (engine === 'edge' || (engine !== 'browser' && useEdgeTts)) {
      try {
        await speakWithEdgeTts(text, audioSpeed);
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (debugCallback) debugCallback(`Edge TTS error: ${msg}. Using browser voice.`, true);
      }

      speakWithBrowserTts(text, fallbackLanguage, audioSpeed);
      return;
    }

    speakWithBrowserTts(text, fallbackLanguage, audioSpeed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (debugCallback) debugCallback(`TTS critical error: ${msg}`, true);
    try {
      speakWithBrowserTts(text, fallbackLanguage, audioSpeed);
    } catch { /* last resort - silently fail */ }
  }
};

const speakWithAzureTts = async (text: string, audioSpeed: number = 1.0): Promise<void> => {
  const cleaned = cleanText(text);
  if (!cleaned) return;

  const selectedVoice = localStorage.getItem('azureVoice') || 'zh-CN-XiaoxiaoNeural';
  const rate = speedToSsmlRate(audioSpeed);
  const textToPlay = cleaned.endsWith('\u3002') ? cleaned : cleaned + '\u3002';
  const cacheKey = `az_${textToPlay}_${selectedVoice}_${rate}`;

  const cached = await getCachedAudio(cacheKey);
  if (cached) {
    if (debugCallback) debugCallback('Playing cached Azure TTS audio', false);
    await playBlob(cached);
    return;
  }

  if (debugCallback) debugCallback('Fetching Azure TTS audio...', false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/tts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: textToPlay,
      voice: selectedVoice,
      rate,
      engine: 'azure',
    }),
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
  if (blob.size === 0) throw new Error('Empty audio response');

  setCachedAudio(cacheKey, blob);

  if (debugCallback) debugCallback(`Azure TTS audio ready (${blob.size} bytes)`, false);
  await playBlob(blob);
};

const speakWithElevenLabs = async (text: string, audioSpeed: number = 1.0): Promise<void> => {
  const cleaned = cleanText(text);
  if (!cleaned) return;

  const cacheKey = `el_${cleaned}_${audioSpeed}`;

  const cached = await getCachedAudio(cacheKey);
  if (cached) {
    if (debugCallback) debugCallback('Playing cached ElevenLabs audio', false);
    await playBlob(cached);
    return;
  }

  if (debugCallback) debugCallback('Fetching ElevenLabs audio...', false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/tts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: cleaned,
      engine: 'elevenlabs',
      speed: audioSpeed,
    }),
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
  if (blob.size === 0) throw new Error('Empty audio response');

  setCachedAudio(cacheKey, blob);

  if (debugCallback) debugCallback(`ElevenLabs audio ready (${blob.size} bytes)`, false);
  await playBlob(blob);
};

const speakWithEdgeTts = async (text: string, audioSpeed: number = 1.0): Promise<void> => {
  const cleaned = cleanText(text);
  if (!cleaned) return;

  const textToPlay = cleaned.endsWith('\u3002') ? cleaned : cleaned + '\u3002';
  const selectedVoice = localStorage.getItem('azureVoice') || 'zh-CN-XiaoxiaoNeural';
  const rate = speedToSsmlRate(audioSpeed);
  const cacheKey = `edge_${textToPlay}_${selectedVoice}_${rate}`;

  const cached = await getCachedAudio(cacheKey);
  if (cached) {
    if (debugCallback) debugCallback('Playing cached Edge TTS audio', false);
    await playBlob(cached);
    return;
  }

  if (debugCallback) debugCallback('Fetching Edge TTS audio...', false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/tts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: textToPlay, voice: selectedVoice, rate, engine: 'edge' }),
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
  if (blob.size === 0) throw new Error('Empty audio response');

  setCachedAudio(cacheKey, blob);

  if (debugCallback) debugCallback(`Edge TTS audio ready (${blob.size} bytes)`, false);
  await playBlob(blob);
};

function playBlob(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const timeout = setTimeout(() => {
      audio.pause();
      URL.revokeObjectURL(url);
      resolve();
    }, 10000);
    audio.onended = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      reject(new Error('Audio playback failed'));
    };
    audio.play().catch((err) => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      reject(err);
    });
  });
}

const speakWithBrowserTts = (text: string, language: string, audioSpeed: number = 1.0): void => {
  if (!('speechSynthesis' in window)) return;

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
  if (selectedVoice) utterance.voice = selectedVoice;

  window.speechSynthesis.speak(utterance);
};

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

export const playSound = (type: 'correct' | 'wrong' | 'purchase' | 'combo'): void => {
  try {
    const audioContext = getAudioContext();
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
