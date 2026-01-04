import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { MusicState } from '../types';

interface MusicManagerProps {
  state: MusicState;
  volume: number;
  enabled: boolean;
}

const TRACKS: Record<MusicState, string> = {
  menu: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
  map: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3',
  battle: 'https://assets.mixkit.co/music/preview/mixkit-spirit-in-the-woods-139.mp3',
  boss: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
};

export default function MusicManager({ state, volume, enabled }: MusicManagerProps) {
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    const unlockAudio = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
          console.log('AudioContext Resumed by User Interaction');
        });
      }
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }

    if (!enabled) {
      console.log('Music Disabled');
      return;
    }

    console.log(`Attempting to play: ${state}`);
    const url = TRACKS[state];

    try {
      const sound = new Howl({
        src: [url],
        html5: true,
        loop: true,
        volume: Math.max(volume, 0.5),
        autoplay: true,
        onload: () => console.log(`Loaded BGM: ${state}`),
        onloaderror: (id, err) => {
          console.warn(`BGM Load Error for ${state} (non-critical):`, err);
        },
        onplayerror: (id, err) => {
          console.warn(`BGM Autoplay Blocked for ${state}:`, err);
          sound.once('unlock', () => {
            console.log('Unlocked and Playing');
            sound.play().catch(e => console.warn('Play failed:', e));
          });
        },
      });

      howlRef.current = sound;

      return () => {
        try {
          sound.stop();
          sound.unload();
        } catch (e) {
          console.warn('Error cleaning up audio:', e);
        }
      };
    } catch (error) {
      console.warn('Error initializing background music:', error);
      return;
    }
  }, [state, enabled]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  return null;
}
