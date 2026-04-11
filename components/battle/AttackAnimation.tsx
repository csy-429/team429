'use client';

interface AttackAnimationProps {
  type: 'player' | 'monster';
  visible: boolean;
}

export function AttackAnimation({ type, visible }: AttackAnimationProps) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {type === 'player' ? (
        <div className="animate-slash text-8xl">⚡</div>
      ) : (
        <div className="animate-shake text-8xl">💥</div>
      )}
    </div>
  );
}
