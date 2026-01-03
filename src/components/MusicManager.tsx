import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
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
  const howlRef = useRef<Howl | null>(null);
  const currentStateRef = useRef<MusicState | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (!userInteracted || !enabled) {
      if (howlRef.current) {
        howlRef.current.fade(howlRef.current.volume(), 0, 500);
        setTimeout(() => {
          howlRef.current?.stop();
        }, 500);
      }
      return;
    }

    if (state !== currentStateRef.current) {
      if (howlRef.current) {
        howlRef.current.fade(howlRef.current.volume(), 0, 300);
        setTimeout(() => {
          howlRef.current?.stop();
          howlRef.current?.unload();
          createAndPlayTrack();
        }, 300);
      } else {
        createAndPlayTrack();
      }
    }

    function createAndPlayTrack() {
      const newHowl = new Howl({
        src: [TRACKS[state]],
        html5: true,
        loop: true,
        volume: 0,
        onload: () => {
          newHowl.play();
          newHowl.fade(0, Math.min(volume, 0.15), 800);
        },
        onloaderror: (id, error) => {
          console.warn('Music load error:', error);
        },
        onplayerror: () => {
          newHowl.once('unlock', () => {
            newHowl.play();
          });
        },
      });

      howlRef.current = newHowl;
      currentStateRef.current = state;
    }
  }, [state, enabled, userInteracted, volume]);

  useEffect(() => {
    if (howlRef.current && enabled && userInteracted) {
      howlRef.current.volume(Math.min(volume, 0.15));
    }
  }, [volume, enabled, userInteracted]);

  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, []);

  return null;
}
