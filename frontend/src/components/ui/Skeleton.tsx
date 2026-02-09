import React from 'react';

export default function Skeleton({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div
        className={className}
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s linear infinite',
          borderRadius: 12,
          minHeight: 12,
          ...style,
        }}
      />
    </>
  );
}
