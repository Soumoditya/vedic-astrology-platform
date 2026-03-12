"use client";

import React from 'react';
import { ChartData } from '../../lib/astrology/engine';

interface KundaliChartProps {
  chartData: ChartData;
  className?: string;
  theme?: 'dark' | 'light';
}

const houses = [
  { id: 1, points: "200,0 100,100 200,200 300,100", center: {x: 200, y: 100} },
  { id: 2, points: "0,0 200,0 100,100", center: {x: 100, y: 35} },
  { id: 3, points: "0,0 100,100 0,200", center: {x: 35, y: 100} },
  { id: 4, points: "0,200 100,100 200,200 100,300", center: {x: 100, y: 200} },
  { id: 5, points: "0,400 0,200 100,300", center: {x: 35, y: 300} },
  { id: 6, points: "0,400 100,300 200,400", center: {x: 100, y: 365} },
  { id: 7, points: "200,400 100,300 200,200 300,300", center: {x: 200, y: 300} },
  { id: 8, points: "400,400 200,400 300,300", center: {x: 300, y: 365} },
  { id: 9, points: "400,400 300,300 400,200", center: {x: 365, y: 300} },
  { id: 10, points: "400,200 300,100 200,200 300,300", center: {x: 300, y: 200} },
  { id: 11, points: "400,0 300,100 400,200", center: {x: 365, y: 100} },
  { id: 12, points: "400,0 200,0 300,100", center: {x: 300, y: 35} },
];

export const KundaliChart: React.FC<KundaliChartProps> = ({ chartData, className = "", theme = 'light' }) => {
  const { ascendantSign, planets } = chartData;

  const getHouseSign = (houseId: number) => {
    let sign = ascendantSign + (houseId - 1);
    // Modular logic to wrap around 12
    if (sign > 12) sign = sign % 12 === 0 ? 12 : sign % 12;
    return sign;
  };

  const getPlanetsInHouse = (houseId: number) => {
    const sign = getHouseSign(houseId);
    return planets.filter(p => p.sign === sign);
  };

  const isLight = theme === 'light';
  
  const containerClass = isLight 
    ? "bg-amber-50/50 p-2 rounded border border-amber-200/50 shadow-sm"
    : "bg-[#0b0f19] p-2 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.1)] border border-amber-900/50";
    
  const strokeColor = isLight ? "#ca8a04" : "#fbbf24";
  const textColor = isLight ? "fill-slate-800" : "fill-white";
  const numColor = isLight ? "fill-amber-700/60" : "fill-amber-500/50";

  return (
    <div className={`aspect-square w-full max-w-2xl mx-auto ${containerClass} backdrop-blur-md ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm font-sans" style={{fontFamily: 'Inter, sans-serif'}}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {houses.map((house) => (
          <g key={house.id}>
            <polygon
              points={house.points}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="1.5"
              className={`transition-colors duration-500 ${isLight ? 'hover:fill-amber-100/30' : 'hover:fill-amber-900/40'}`}
              style={!isLight ? { filter: 'url(#glow)', strokeOpacity: 0.6 } : undefined}
            />
            {/* Zodiac Sign Number */}
            <text
              x={house.center.x}
              y={house.center.y - 12}
              textAnchor="middle"
              className={`text-[10px] font-bold ${numColor} translate-y-[4px]`}
            >
              {getHouseSign(house.id)}
            </text>

            <text
              x={house.center.x}
              y={house.center.y + 6}
              textAnchor="middle"
              className={`text-[12px] font-medium ${textColor} tracking-tight`}
            >
              {getPlanetsInHouse(house.id).map((p, index) => {
                let symbol = '';
                if (p.isRetrograde) symbol += '*';
                if (p.isCombust) symbol += 'Λ';
                if (p.isExalted) symbol += '↑';
                if (p.isDebilitated) symbol += '↓';
                return (
                  <tspan
                    key={p.id}
                    x={house.center.x}
                    dy={index === 0 ? 0 : 14}
                  >
                    {p.name.substring(0, 2)}{symbol} {Math.floor(p.longitude % 30)}°
                  </tspan>
                );
              })}
            </text>
          </g>
        ))}
        {/* Outer Square Border */}
        <rect
          x="0" y="0" width="400" height="400"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="3"
          style={!isLight ? { filter: 'url(#glow)', strokeOpacity: 0.8 } : undefined}
        />
      </svg>
    </div>
  );
};
