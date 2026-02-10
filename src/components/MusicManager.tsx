import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { MusicState } from '../types';

interface MusicManagerProps {
  state: MusicState;
  volume: number;
  enabled: boolean;
}

const TRACKS: Record<MusicState, string> = {
  menu: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pamgaea.mp3',
  map: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Adventure%20Meme.mp3',
  battle: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pixel%20Peeker%20Polka%20-%20Faster.mp3',
  boss: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ready%20Aim%20Fire.mp3',
};

const preloadedTracks = new Map<MusicState, Howl>();

function preloadTrack(state: MusicState): void {
  if (preloadedTracks.has(state)) return;

  const sound = new Howl({
    src: [TRACKS[state]],
    html5: true,
    loop: true,
    volume: 0,
    preload: true,
  });

  preloadedTracks.set(state, sound);
}

export default function MusicManager({ state, volume, enabled }: MusicManagerProps) {
  const howlRef = useRef<Howl | null>(null);
  const currentStateRef = useRef<MusicState | null>(null);

  useEffect(() => {
    const unlockAudio = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    (['battle', 'boss'] as MusicState[]).forEach(preloadTrack);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (currentStateRef.current === state && howlRef.current && enabled) {
      return;
    }

    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    currentStateRef.current = state;

    if (!enabled) return;

    try {
      const cached = preloadedTracks.get(state);
      const sound = cached || new Howl({
        src: [TRACKS[state]],
        html5: true,
        loop: true,
        volume: volume,
        autoplay: true,
        onplayerror: () => {
          sound.once('unlock', () => {
            sound.play();
          });
        },
      });

      if (cached) {
        cached.volume(volume);
        cached.play();
      }

      howlRef.current = sound;

      return () => {
        try {
          sound.stop();
          if (!preloadedTracks.has(state)) {
            sound.unload();
          }
        } catch {
          // cleanup errors are non-critical
        }
      };
    } catch {
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
