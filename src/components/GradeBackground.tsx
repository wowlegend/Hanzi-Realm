import ParticleBackground from './ParticleBackground';

interface GradeBackgroundProps {
  gradeLevel: number;
}

export default function GradeBackground({ gradeLevel }: GradeBackgroundProps) {
  const getVariant = () => {
    if (gradeLevel >= 5) return 'hacker';
    if (gradeLevel >= 3) return 'lava';
    return 'meadow';
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <ParticleBackground variant={getVariant()} />
    </div>
  );
}
