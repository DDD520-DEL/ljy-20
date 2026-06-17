import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  labelStyle?: 'percentage' | 'count';
  current?: number;
  total?: number;
  animationDuration?: number;
}

export const ProgressRing = ({
  progress,
  size = 160,
  strokeWidth = 12,
  color = '#3f51b5',
  bgColor = '#e0e0e0',
  showLabel = true,
  labelStyle = 'percentage',
  current,
  total,
  animationDuration = 0.6,
}: ProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  const gradientId = `progress-gradient-${color.replace('#', '')}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: `stroke-dashoffset ${animationDuration}s ease-in-out`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {labelStyle === 'percentage' ? (
            <>
              <span className="text-3xl font-bold" style={{ color, fontFamily: '"Noto Serif SC", serif' }}>
                {animatedProgress}%
              </span>
              <span className="text-sm text-slate-500">整体进度</span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold" style={{ color, fontFamily: '"Noto Serif SC", serif' }}>
                {current}
                <span className="text-lg text-slate-400">/{total}</span>
              </span>
              <span className="text-sm text-slate-500">已完成</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
