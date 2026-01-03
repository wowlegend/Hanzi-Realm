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
              value: ['#ffffff', '#ffeb3b', '#fff9c4', '#87CEEB'],
            },
            move: {
              enable: true,
              direction: 'right' as const,
              speed: 1,
              random: true,
              straight: false,
              outModes: {
                default: 'out' as const,
              },
            },
            number: {
              value: 100,
              density: {
                enable: true,
                area: 600,
              },
            },
            opacity: {
              value: 0.8,
              random: true,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 4, max: 10 },
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
              value: ['#ff5722', '#ff9800', '#ffeb3b', '#ff6b35'],
            },
            move: {
              enable: true,
              direction: 'top' as const,
              speed: 1.5,
              random: true,
              straight: false,
              outModes: {
                default: 'out' as const,
              },
            },
            number: {
              value: 120,
              density: {
                enable: true,
                area: 600,
              },
            },
            opacity: {
              value: 0.9,
              random: true,
              animation: {
                enable: true,
                speed: 0.8,
                minimumValue: 0.5,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 4, max: 12 },
              random: true,
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.08,
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
              value: ['#00ff00', '#00cc00', '#33ff33'],
            },
            move: {
              enable: true,
              direction: 'bottom' as const,
              speed: 4,
              straight: true,
              outModes: {
                default: 'out' as const,
              },
            },
            number: {
              value: 80,
              density: {
                enable: true,
                area: 600,
              },
            },
            opacity: {
              value: 0.9,
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
                  weight: '700',
                },
              },
            },
            size: {
              value: { min: 14, max: 22 },
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
      className="absolute inset-0 z-0"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
};
