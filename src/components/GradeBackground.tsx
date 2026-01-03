import { motion } from 'framer-motion';

interface GradeBackgroundProps {
  gradeLevel: number;
}

export default function GradeBackground({ gradeLevel }: GradeBackgroundProps) {
  const getBackground = () => {
    if (gradeLevel >= 5) {
      const cyberHanzi = "数码网络未来智能电子01".split('');

      return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a1e] to-[#000814] overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => {
              const columnChars = Array(25).fill(0).map(() =>
                cyberHanzi[Math.floor(Math.random() * cyberHanzi.length)]
              ).join(' ');

              return (
                <motion.div
                  key={i}
                  className="absolute text-cyan-400 font-sans text-base opacity-15 animate-matrix"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    letterSpacing: '0.2em',
                  }}
                >
                  {columnChars}
                </motion.div>
              );
            })}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-30" />
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      );
    }

    if (gradeLevel >= 3) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#2a0a0a] via-[#4a1a1a] to-[#1a0a0a] overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-orange-500 rounded-full blur-xl animate-glow"
                style={{
                  width: `${50 + Math.random() * 100}px`,
                  height: `${50 + Math.random() * 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-transparent to-transparent opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#87CEEB] via-[#98D8E8] to-[#B0E0E6] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#00b06f_0%,transparent_20%)]"></div>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              top: `${10 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {['☁️', '🌤️', '⛅'][Math.floor(Math.random() * 3)]}
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full">
            <path d="M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z" fill="#00b06f" opacity="0.8" />
            <path d="M0,70 Q300,40 600,70 T1200,70 L1200,120 L0,120 Z" fill="#008f5b" opacity="0.6" />
          </svg>
        </div>
        {[...Array(20)].map((_, i) => (
          <div
            key={`grass-${i}`}
            className="absolute bottom-0 w-2 bg-green-700"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${20 + Math.random() * 30}px`,
            }}
          />
        ))}
      </div>
    );
  };

  return getBackground();
}
