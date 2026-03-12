import React from 'react';
import { ChartData } from '../../lib/astrology/engine';
import { Badge } from "@/components/ui/badge";

interface DoshaIndicatorsProps {
  chartData: ChartData | null;
}

export const DoshaIndicators: React.FC<DoshaIndicatorsProps> = ({ chartData }) => {
  if (!chartData) return null;

  // Manglik Dosha: Mars in 1, 4, 7, 8, or 12th house
  const isManglik = () => {
    // 1st house is ascendantSign.
    const ascSign = chartData.ascendantSign;
    const mars = chartData.planets.find(p => p.name === 'Mars');
    if (!mars) return false;

    let marsHouse = mars.sign - ascSign + 1;
    if (marsHouse <= 0) marsHouse += 12;

    return [1, 4, 7, 8, 12].includes(marsHouse);
  };

  // Simplistic Sade Sati Check (Assume transiting Saturn in Pisces, sign 12)
  const isSadeSati = () => {
    const moon = chartData.planets.find(p => p.name === 'Moon');
    if (!moon) return false;

    // Sade sati occurs when transiting saturn is 1 before, in, or 1 after the Moon sign.
    // Let's assume current transit Saturn is in Pisces (12) or Aries (1). We will just mock it to False for UI purposes unless it hits.
    const transitSaturnSign = 11; // Aquarius current transit actually
    let diff = transitSaturnSign - moon.sign;
    if (diff < -6) diff += 12;
    if (diff > 6) diff -= 12;
    
    return Math.abs(diff) <= 1;
  };

  const manglik = isManglik();
  const sadesati = isSadeSati();

  return (
    <div className="flex gap-2 mb-6 pointer-events-none">
      <Badge variant={manglik ? "destructive" : "outline"} className={`px-3 py-1 text-sm font-semibold tracking-wide shadow-sm border ${manglik ? "bg-rose-600 border-rose-700 text-white" : "border-slate-300 text-slate-500"}`}>
        {manglik ? "Severe Mangal Dosha" : "No Mangal Dosha"}
      </Badge>
      <Badge variant={sadesati ? "destructive" : "outline"} className={`px-3 py-1 text-sm font-semibold tracking-wide shadow-sm border ${sadesati ? "bg-amber-600 border-amber-700 text-white" : "border-slate-300 text-slate-500"}`}>
        {sadesati ? "Shani Sade Sati Active" : "No Sade Sati"}
      </Badge>
    </div>
  );
};
