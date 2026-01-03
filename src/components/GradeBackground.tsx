import { ParticleBackground } from './ParticleBackground';

interface GradeBackgroundProps {
  gradeLevel: number;
}

export default function GradeBackground({ gradeLevel }: GradeBackgroundProps) {
  const getVariant = () => {
    if (gradeLevel >= 5) return 'hacker';
    if (gradeLevel >= 3) return 'lava';
    return 'meadow';
  };

  const getBackgroundColor = () => {
    if (gradeLevel >= 5) return 'bg-black';
    if (gradeLevel >= 3) return 'bg-[#1a0a0a]';
    return 'bg-[#87CEEB]';
  };

  const getOverlayGradient = () => {
    if (gradeLevel >= 5) return 'from-blue-900/30';
    if (gradeLevel >= 3) return 'from-red-900/30';
    return 'from-blue-400/20';
  };

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundColor()}`}>
      <ParticleBackground variant={getVariant()} />
      <div className={`absolute inset-0 bg-gradient-to-b ${getOverlayGradient()} to-transparent pointer-events-none`} />
      {gradeLevel < 3 && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1200 120" className="w-full">
            <path d="M0,50 Q300,20 600,50 T1200,50 L1200,120 L0,120 Z" fill="#00b06f" opacity="0.8" />
            <path d="M0,70 Q300,40 600,70 T1200,70 L1200,120 L0,120 Z" fill="#008f5b" opacity="0.6" />
          </svg>
        </div>
      )}
    </div>
  );
}
