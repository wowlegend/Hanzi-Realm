import { ParticleBackground } from './ParticleBackground';

interface GradeBackgroundProps {
  gradeLevel: number;
}

export default function GradeBackground({ gradeLevel }: GradeBackgroundProps) {
  const getBackground = () => {
    if (gradeLevel >= 5) {
      return (
        <div className="fixed inset-0 overflow-hidden -z-50 bg-black">
          <ParticleBackground variant="hacker" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-transparent pointer-events-none z-10" />
        </div>
      );
    }

    if (gradeLevel >= 3) {
      return (
        <div className="fixed inset-0 overflow-hidden -z-50 bg-[#1a0a0a]">
          <ParticleBackground variant="lava" />
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-transparent pointer-events-none z-10" />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 overflow-hidden -z-50 bg-[#87CEEB]">
        <ParticleBackground variant="meadow" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" className="w-full">
            <path d="M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z" fill="#00b06f" opacity="0.8" />
            <path d="M0,70 Q300,40 600,70 T1200,70 L1200,120 L0,120 Z" fill="#008f5b" opacity="0.6" />
          </svg>
        </div>
      </div>
    );
  };

  return getBackground();
}
