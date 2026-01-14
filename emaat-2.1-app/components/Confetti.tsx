import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-2" style={style}></div>
);

const Confetti: React.FC = () => {
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6'];
  const pieces = Array.from({ length: 100 }).map((_, i) => {
    const color = colors[i % colors.length];
    const style: React.CSSProperties = {
      backgroundColor: color,
      left: `${Math.random() * 100}%`,
      top: `${-20 + Math.random() * -80}px`,
      transform: `rotate(${Math.random() * 360}deg)`,
      animation: `fall ${2 + Math.random() * 2}s ${Math.random() * 4}s linear forwards`,
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">{pieces}</div>;
};

export default Confetti;
