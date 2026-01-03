import { useEffect, useRef, useCallback, useState } from 'react';
import { MusicState } from '../types';

interface MusicManagerProps {
  state: MusicState;
  volume: number;
  enabled: boolean;
}

const TRACKS: Record<MusicState, string> = {
  menu: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
  map: 'https://assets.mixkit.co/music/preview/mixkit-spirit-in-the-woods-139.mp3',
  battle: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3',
  boss: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
};

export default function MusicManager({ state, volume, enabled }: MusicManagerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentStateRef = useRef<MusicState | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const pendingStateRef = useRef<MusicState | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const fadeVolume = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number, onComplete?: () => void) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      audio.volume = Math.max(0, Math.min(1, startVolume + volumeDiff * progress));

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        if (targetVolume === 0) {
          audio.pause();
          audio.currentTime = 0;
        }
        onComplete?.();
      }
    }, stepDuration);
  }, []);

  const playTrack = useCallback((trackState: MusicState, targetVolume: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const newAudio = new Audio(TRACKS[trackState]);
    newAudio.loop = true;
    newAudio.volume = 0;
    newAudio.preload = 'auto';

    newAudio.play()
      .then(() => {
        fadeVolume(newAudio, Math.min(targetVolume, 0.15), 800);
        audioRef.current = newAudio;
        currentStateRef.current = trackState;
      })
      .catch((err) => {
        console.warn('Audio playback failed:', err.message);
        pendingStateRef.current = trackState;
      });
  }, [fadeVolume]);

  useEffect(() => {
    if (!userInteracted) {
      pendingStateRef.current = state;
      return;
    }

    if (pendingStateRef.current && enabled) {
      playTrack(pendingStateRef.current, volume);
      pendingStateRef.current = null;
      return;
    }

    if (!enabled) {
      if (audioRef.current) {
        fadeVolume(audioRef.current, 0, 500);
      }
      return;
    }

    if (state !== currentStateRef.current) {
      if (audioRef.current) {
        fadeVolume(audioRef.current, 0, 300, () => {
          playTrack(state, volume);
        });
      } else {
        playTrack(state, volume);
      }
    }
  }, [state, enabled, userInteracted, volume, fadeVolume, playTrack]);

  useEffect(() => {
    if (audioRef.current && enabled && userInteracted) {
      audioRef.current.volume = Math.min(volume, 0.15);
    }
  }, [volume, enabled, userInteracted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  return null;
}
