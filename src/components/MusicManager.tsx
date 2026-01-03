import { useEffect, useRef, useCallback } from 'react';
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
  const currentStateRef = useRef<MusicState>(state);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fadeVolume = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number) => {
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
        }
      }
    }, stepDuration);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) {
        fadeVolume(audioRef.current, 0, 500);
      }
      return;
    }

    if (state !== currentStateRef.current || !audioRef.current) {
      if (audioRef.current) {
        fadeVolume(audioRef.current, 0, 300);
      }

      setTimeout(() => {
        const newAudio = new Audio(TRACKS[state]);
        newAudio.loop = true;
        newAudio.volume = 0;

        newAudio.play().then(() => {
          fadeVolume(newAudio, Math.min(volume, 0.1), 500);
        }).catch(() => {});

        audioRef.current = newAudio;
        currentStateRef.current = state;
      }, 350);
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [state, enabled, fadeVolume, volume]);

  useEffect(() => {
    if (audioRef.current && enabled) {
      audioRef.current.volume = Math.min(volume, 0.1);
    }
  }, [volume, enabled]);

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
