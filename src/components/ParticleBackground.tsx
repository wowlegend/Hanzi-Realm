import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

type ParticleVariant = 'meadow' | 'lava' | 'hacker';

interface ParticleBackgroundProps {
  variant?: ParticleVariant;
}

export default function ParticleBackground({ variant = 'meadow' }: ParticleBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const getConfig = () => {
    switch (variant) {
      case 'hacker':
        return {
          background: {
            color: {
              value: '#000000',
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: '#00ff00',
            },
            move: {
              direction: 'bottom' as const,
              enable: true,
              outModes: {
                default: 'out' as const,
              },
              random: false,
              speed: 3,
              straight: true,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 100,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'char' as const,
              character: {
                value: ['0', '1', 'ä', 'ü', 'ö', '学', '习', '中', '文'],
                font: 'monospace',
                style: '',
                weight: '400',
                fill: true,
              },
            },
            size: {
              value: { min: 12, max: 18 },
            },
          },
          detectRetina: true,
        };

      case 'lava':
        return {
          background: {
            color: {
              value: 'linear-gradient(to bottom, #330000, #660000)',
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ['#ff6b35', '#ff3e3e', '#ffa500', '#ff4500'],
            },
            move: {
              direction: 'top' as const,
              enable: true,
              outModes: {
                default: 'out' as const,
              },
              random: true,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: { min: 0.3, max: 0.8 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 3, max: 8 },
            },
          },
          detectRetina: true,
        };

      case 'meadow':
      default:
        return {
          background: {
            color: {
              value: 'linear-gradient(to bottom, #87CEEB, #98D8E8)',
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ['#ffffff', '#fffacd', '#ffffe0'],
            },
            move: {
              direction: 'right' as const,
              enable: true,
              outModes: {
                default: 'out' as const,
              },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 40,
            },
            opacity: {
              value: { min: 0.3, max: 0.6 },
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.1,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 2, max: 5 },
            },
          },
          detectRetina: true,
        };
    }
  };

  return (
    <div className="absolute inset-0">
      <Particles
        id={`tsparticles-${variant}`}
        init={particlesInit}
        options={getConfig()}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
