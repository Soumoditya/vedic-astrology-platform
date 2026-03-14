"use client";

import React from 'react';
import { ChartData } from '../../lib/astrology/engine';

interface KundaliChartProps {
  chartData: ChartData;
  className?: string;
  theme?: 'dark' | 'light';
}

const houses = [
  { id: 1, points: "250,0 125,125 250,250 375,125", center: {x: 250, y: 125} },
  { id: 2, points: "0,0 250,0 125,125", center: {x: 125, y: 45} },
  { id: 3, points: "0,0 125,125 0,250", center: {x: 45, y: 125} },
  { id: 4, points: "0,250 125,125 250,250 125,375", center: {x: 125, y: 250} },
  { id: 5, points: "0,500 0,250 125,375", center: {x: 45, y: 375} },
  { id: 6, points: "0,500 125,375 250,500", center: {x: 125, y: 455} },
  { id: 7, points: "250,500 125,375 250,250 375,375", center: {x: 250, y: 375} },
  { id: 8, points: "500,500 250,500 375,375", center: {x: 375, y: 455} },
  { id: 9, points: "500,500 375,375 500,250", center: {x: 455, y: 375} },
  { id: 10, points: "500,250 375,125 250,250 375,375", center: {x: 375, y: 250} },
  { id: 11, points: "500,0 375,125 500,250", center: {x: 455, y: 125} },
  { id: 12, points: "500,0 250,0 375,125", center: {x: 375, y: 45} },
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
  
  const strokeColor = isLight ? "#B8860B" : "#D4AF37"; // Premium Gold Accent
  const strokeOpacity = isLight ? 1 : 0.6;
  const textColor = isLight ? "fill-[#2C3E50]" : "fill-white";
  const numColor = isLight ? "fill-[#B8860B]" : "fill-[#D4AF37]";

  return (
    <div className={`aspect-square w-full max-w-3xl mx-auto rounded-xl overflow-hidden ${isLight ? 'bg-white/80 p-2 shadow-sm' : 'bg-transparent'} ${className}`}>
      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-md font-sans overflow-visible" style={{fontFamily: 'Inter, sans-serif'}}>
        {houses.map((house) => {
          const housePlanets = getPlanetsInHouse(house.id);
          const hasMultiple = housePlanets.length > 2;
          
          return (
            <g key={house.id}>
              <polygon
                points={house.points}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeOpacity={strokeOpacity}
                className={`transition-colors duration-500 ${isLight ? 'hover:fill-[#D4AF37]/10' : 'hover:fill-[#D4AF37]/10'}`}
              />
              
              {/* Zodiac Sign Number - Placed slightly offset from center for elegance */}
              <text
                x={house.center.x}
                y={house.center.y - (housePlanets.length > 0 ? 22 : -6)}
                textAnchor="middle"
                className={`text-lg font-bold ${numColor} opacity-70 select-none tracking-widest`}
              >
                {getHouseSign(house.id)}
              </text>

              {/* Planets mapping stacked cleanly */}
              <text
                x={house.center.x}
                y={house.center.y + (hasMultiple ? -6 : 6)}
                textAnchor="middle"
                className={`text-base font-semibold ${textColor} tracking-wider uppercase`}
              >
                {housePlanets.map((p, index) => {
                  let symbol = '';
                  if (p.isRetrograde) symbol += 'ᴿ'; // Proper superscript for Retrograde
                  return (
                    <tspan
                      key={p.id}
                      x={house.center.x}
                      dy={index === 0 ? 0 : 18} // Increased vertical line height
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
          x="0" y="0" width="500" height="500"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="3"
          strokeOpacity={strokeOpacity + 0.3}
        />
      </svg>
    </div>
  );
};
