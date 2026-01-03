import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

type ParticleVariant = 'meadow' | 'lava' | 'hacker';

interface ParticleBackgroundProps {
  variant: ParticleVariant;
}

export const ParticleBackground = ({ variant }: ParticleBackgroundProps) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const getConfig = () => {
    switch (variant) {
      case 'meadow':
        return {
          background: {
            color: {
              value: 'transparent',
            },
          },
          particles: {
            color: {
              value: ['#ffffff', '#ffeb3b', '#fff9c4'],
            },
            move: {
              enable: true,
              direction: 'right' as const,
              speed: 1.5,
              random: true,
              straight: false,
              outModes: {
                default: 'out' as const,
              },
            },
            number: {
              value: 60,
              density: {
                enable: true,
                area: 800,
              },
            },
            opacity: {
              value: 0.6,
              random: true,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 2, max: 6 },
              random: true,
            },
          },
        };

      case 'lava':
        return {
          background: {
            color: {
              value: 'transparent',
            },
          },
          particles: {
            color: {
              value: ['#ff5722', '#ff9800', '#ffeb3b'],
            },
            move: {
              enable: true,
              direction: 'top' as const,
              speed: 2,
              random: true,
              straight: false,
              outModes: {
                default: 'out' as const,
              },
            },
            number: {
              value: 80,
              density: {
                enable: true,
                area: 800,
              },
            },
            opacity: {
              value: 0.7,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.3,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 2, max: 5 },
              random: true,
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.05,
                opacity: 1,
              },
            },
          },
        };

      case 'hacker':
        return {
          background: {
            color: {
              value: 'transparent',
            },
          },
          particles: {
            color: {
              value: '#00ff00',
            },
            move: {
              enable: true,
              direction: 'bottom' as const,
              speed: 5,
              straight: true,
              outModes: {
                default: 'out' as const,
              },
            },
            number: {
              value: 50,
              density: {
                enable: true,
                area: 800,
              },
            },
            opacity: {
              value: 0.8,
              random: true,
            },
            shape: {
              type: 'char' as const,
              options: {
                char: {
                  value: ['0', '1', '汉', '字', 'A', 'B', 'C'],
                  font: 'monospace',
                  fill: true,
                  style: '',
                  weight: '400',
                },
              },
            },
            size: {
              value: { min: 12, max: 18 },
              random: true,
            },
          },
        };
    }
  };

  return (
    <Particles
      id={`particles-${variant}`}
      init={particlesInit}
      options={getConfig()}
      className="absolute inset-0 -z-10"
    />
  );
};
