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
        volume: volume,
        autoplay: true,
        onload: () => {
          console.log(`✓ BGM Loaded Successfully: ${state}`);
        },
        onloaderror: (id, err) => {
          console.error(`✗ BGM Load Failed for ${state}:`, err);
          console.error(`URL attempted: ${url}`);
        },
        onplayerror: (id, err) => {
          console.warn(`⚠ Autoplay Blocked (need user interaction):`, err);
          sound.once('unlock', () => {
            console.log('✓ Audio Unlocked - Playing Now');
            sound.play().catch(e => console.error('Play failed:', e));
          });
        },
        onplay: () => {
          console.log(`▶ Playing: ${state} at ${Math.round(volume * 100)}% volume`);
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
