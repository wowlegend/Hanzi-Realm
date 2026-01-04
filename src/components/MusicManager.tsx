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
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const url = TRACKS[state];

    if (currentUrlRef.current === url && howlRef.current) {
      if (!howlRef.current.playing() && enabled) {
        howlRef.current.play();
      }
      return;
    }

    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }

    if (!enabled) return;

    const sound = new Howl({
      src: [url],
      html5: true,
      loop: true,
      volume: volume,
      autoplay: true,
      onloaderror: (id, err) => console.warn('BGM Load Error:', err),
      onplayerror: (id, err) => {
        console.warn('BGM Play Error (Autoplay blocked):', err);
        sound.once('unlock', () => {
          sound.play();
        });
      },
    });

    howlRef.current = sound;
    currentUrlRef.current = url;

    return () => {
      sound.stop();
      sound.unload();
    };
  }, [state, enabled]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (howlRef.current) {
      if (enabled) {
        if (!howlRef.current.playing()) {
          howlRef.current.play();
        }
      } else {
        howlRef.current.pause();
      }
    }
  }, [enabled]);

  return null;
}
