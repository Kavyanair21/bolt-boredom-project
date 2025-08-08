import React, { useEffect, useState } from 'react';

interface SpeedometerGaugeProps {
  percentage: number;
}

const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({ percentage }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage]);

  // Calculate rotation for the needle (0% = -90deg, 100% = 90deg)
  const needleRotation = -90 + (animatedPercentage / 100) * 180;
  
  // Determine color based on percentage
  const getColor = (percent: number) => {
    if (percent <= 30) return '#10B981'; // Green (not bored)
    if (percent <= 70) return '#F59E0B'; // Yellow (moderately bored)
    return '#EF4444'; // Red (dead inside)
  };

  const color = getColor(percentage);
  const strokeColor = getColor(animatedPercentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 mb-4">
        {/* Background Arc */}
        <svg
          className="w-full h-full transform"
          viewBox="0 0 200 100"
          style={{ overflow: 'visible' }}
        >
          {/* Background gauge */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Animated progress arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="251.2" // Circumference of semicircle
            strokeDashoffset={251.2 - (251.2 * animatedPercentage) / 100}
            className="transition-all duration-2000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor})`
            }}
          />

          {/* Needle */}
          <g className="transition-transform duration-2000 ease-out">
            <line
              x1="100"
              y1="80"
              x2="100"
              y2="35"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              filter={`drop-shadow(0 0 4px ${color})`}
              transform={`rotate(${needleRotation} 100 80)`}
            />
            {/* Needle center dot */}
            <circle
              cx="100"
              cy="80"
              r="4"
              fill={color}
              filter={`drop-shadow(0 0 4px ${color})`}
            />
          </g>

          {/* Scale markers */}
          {[0, 25, 50, 75, 100].map((value, index) => {
            const angle = -90 + (value / 100) * 180;
            const radian = (angle * Math.PI) / 180;
            const x1 = 100 + Math.cos(radian) * 65;
            const y1 = 80 + Math.sin(radian) * 65;
            const x2 = 100 + Math.cos(radian) * 75;
            const y2 = 80 + Math.sin(radian) * 75;

            return (
              <g key={value}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="2"
                />
                <text
                  x={100 + Math.cos(radian) * 90}
                  y={80 + Math.sin(radian) * 90 + 5}
                  fill="rgba(255, 255, 255, 0.8)"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse"
          style={{ 
            background: `radial-gradient(circle, ${strokeColor} 0%, transparent 70%)`,
            transform: 'scale(1.5)'
          }}
        />
      </div>

      {/* Percentage Display */}
      <div className="text-center">
        <div 
          className="text-4xl font-bold mb-2 transition-colors duration-1000"
          style={{ color: strokeColor, textShadow: `0 0 20px ${strokeColor}` }}
        >
          {Math.round(animatedPercentage)}%
        </div>
        <div className="text-sm text-purple-300 font-medium">
          Boredom Level
        </div>
      </div>
    </div>
  );
};

export default SpeedometerGauge;