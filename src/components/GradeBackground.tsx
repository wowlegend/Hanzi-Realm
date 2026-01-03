import { ParticleBackground } from './ParticleBackground';

interface GradeBackgroundProps {
  gradeLevel: number;
}

export default function GradeBackground({ gradeLevel }: GradeBackgroundProps) {
  const getBackground = () => {
    if (gradeLevel >= 5) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a1e] to-[#000814] overflow-hidden">
          <ParticleBackground variant="hacker" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-30" />
        </div>
      );
    }

    if (gradeLevel >= 3) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#2a0a0a] via-[#4a1a1a] to-[#1a0a0a] overflow-hidden">
          <ParticleBackground variant="lava" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-transparent to-transparent opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#87CEEB] via-[#98D8E8] to-[#B0E0E6] overflow-hidden">
        <ParticleBackground variant="meadow" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#00b06f_0%,transparent_20%)]"></div>
        <div className="absolute bottom-0 left-0 right-0">
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
