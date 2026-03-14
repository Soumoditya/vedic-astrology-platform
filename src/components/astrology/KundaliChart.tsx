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
    if (sign > 12) sign = sign % 12 === 0 ? 12 : sign % 12;
    return sign;
  };

  const getPlanetsInHouse = (houseId: number) => {
    const sign = getHouseSign(houseId);
    return planets.filter(p => p.sign === sign);
  };

  const isLight = theme === 'light';
  
  const containerClass = isLight 
    ? "bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 shadow-sm"
    : "bg-transparent w-full";
    
  const strokeColor = isLight ? "#ca8a04" : "#fbbf24";
  const strokeOpacity = isLight ? 1 : 0.4;
  const textColor = isLight ? "fill-slate-800" : "fill-white";
  const numColor = isLight ? "fill-amber-700/80" : "fill-amber-500/70";

  return (
    <div className={`aspect-square w-full max-w-2xl mx-auto ${containerClass} ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md font-sans overflow-visible" style={{fontFamily: 'Inter, sans-serif'}}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {houses.map((house) => {
          const housePlanets = getPlanetsInHouse(house.id);
          const hasMultiple = housePlanets.length > 1;
          
          return (
            <g key={house.id}>
              <polygon
                points={house.points}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeOpacity={strokeOpacity}
                className={`transition-colors duration-500 ${isLight ? 'hover:fill-amber-100/30' : 'hover:fill-amber-900/40'}`}
                style={!isLight ? { filter: 'url(#glow)' } : undefined}
              />
              
              {/* Zodiac Sign Number precisely placed in a subtle corner of the centroid */}
              <text
                x={house.center.x}
                y={house.center.y - (hasMultiple ? 18 : 14)}
                textAnchor="middle"
                className={`text-[11px] font-bold ${numColor} mix-blend-screen opacity-80 select-none`}
              >
                {getHouseSign(house.id)}
              </text>

              {/* Planets mapping stacked cleanly */}
              <text
                x={house.center.x}
                y={house.center.y + (hasMultiple ? -4 : 2)}
                textAnchor="middle"
                className={`text-[10px] font-medium ${textColor} tracking-wider`}
              >
                {housePlanets.map((p, index) => {
                  let symbol = '';
                  if (p.isRetrograde) symbol += 'R';
                  return (
                    <tspan
                      key={p.id}
                      x={house.center.x}
                      dy={index === 0 ? 0 : 12}
                    >
                      {p.name.substring(0, 2)}{symbol} {Math.floor(p.longitude % 30)}°
                    </tspan>
                  );
                })}
              </text>
            </g>
          );
        })}
        {/* Outer Square Border */}
        <rect
          x="0" y="0" width="400" height="400"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="2"
          strokeOpacity={strokeOpacity + 0.2}
          style={!isLight ? { filter: 'url(#glow)' } : undefined}
        />
      </svg>
    </div>
  );
};
