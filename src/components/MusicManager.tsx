import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
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
  const currentStateRef = useRef<MusicState | null>(null);
  const isUnlocked = useRef(false);

  useEffect(() => {
    const unlock = () => {
      isUnlocked.current = true;
    };

    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !isUnlocked.current) {
      if (howlRef.current) {
        howlRef.current.stop();
      }
      return;
    }

    if (state !== currentStateRef.current) {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }

      try {
        const sound = new Howl({
          src: [TRACKS[state]],
          html5: true,
          loop: true,
          volume: Math.min(volume, 0.2),
          autoplay: true,
          onloaderror: (id, err) => {
            console.warn(`Failed to load music: ${err}`);
          },
          onplayerror: (id, err) => {
            console.warn(`Failed to play music: ${err}`);
            sound.once('unlock', () => {
              sound.play();
            });
          },
        });

        howlRef.current = sound;
        currentStateRef.current = state;
      } catch (err) {
        console.warn('Error creating audio:', err);
      }
    }
  }, [state, enabled, volume]);

  useEffect(() => {
    if (howlRef.current && enabled) {
      howlRef.current.volume(Math.min(volume, 0.2));
    }
  }, [volume, enabled]);

  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }
    };
  }, []);

  return null;
}
