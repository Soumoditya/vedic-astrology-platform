"use server";

import { ChartData, PlanetData } from '@/lib/astrology/engine';
import { isExalted, isDebilitated } from '@/lib/astrology/mathUtils';

// This server action prevents Next.js client-side Webpack from trying to bundle native C++ addons
export async function generateAccurateChart(dateUTC: Date, lat: number, lon: number, alt: number = 0): Promise<ChartData> {
  const swisseph = require('swisseph');
  
  // Set Lahiri Ayanamsa as strictly requested
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  swisseph.swe_set_topo(lon, lat, alt);
  
  const year = dateUTC.getUTCFullYear();
  const month = dateUTC.getUTCMonth() + 1;
  const day = dateUTC.getUTCDate();
  const hour = dateUTC.getUTCHours();
  const min = dateUTC.getUTCMinutes();
  const sec = dateUTC.getUTCSeconds();
  
  // Convert UTC Date to Ephemeris Julian Day Return Object
  const jdReturn = swisseph.swe_utc_to_jd(year, month, day, hour, min, sec, swisseph.SE_GREG_CAL);
  const jd_ut = jdReturn.julianDay;
  
  // Standard flags for accurate sidereal and speed calculations
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;
  
  // Array of Planets to Calculate
  const planetList = [
    { id: swisseph.SE_SUN, name: 'Sun' },
    { id: swisseph.SE_MOON, name: 'Moon' },
    { id: swisseph.SE_MARS, name: 'Mars' },
    { id: swisseph.SE_MERCURY, name: 'Mercury' },
    { id: swisseph.SE_JUPITER, name: 'Jupiter' },
    { id: swisseph.SE_VENUS, name: 'Venus' },
    { id: swisseph.SE_SATURN, name: 'Saturn' },
    { id: swisseph.SE_TRUE_NODE, name: 'Rahu' } // True Node calculation
  ];

  const planetsData: PlanetData[] = [];
  let sunLongitude = 0;

  for (let i = 0; i < planetList.length; i++) {
    const p = planetList[i];
    const calcReturn = swisseph.swe_calc_ut(jd_ut, p.id, flags);
    
    // Degrees are 0 to 360 relative to Aries 0 deg.
    const longitude = calcReturn.longitude;
    const speed = calcReturn.longitudeSpeed;
    
    if (p.name === 'Sun') sunLongitude = longitude;
    
    // Zodiac Sign check (1 = Aries ... 12 = Pisces)
    const sign = Math.floor(longitude / 30) + 1;
    
    planetsData.push({
      id: i,
      name: p.name,
      longitude,
      speed,
      sign,
      // Retrograde: Speed < 0. Sun and Moon never retrograde. Nodes are always retrograde but we handle Ketu differently below.
      isRetrograde: speed < 0 && p.name !== 'Sun' && p.name !== 'Moon' && p.name !== 'Rahu',
      // We will check combustion against Sun's degree.
      isCombust: false, // Calculated after we have all 
      isExalted: isExalted(p.name, sign),
      isDebilitated: isDebilitated(p.name, sign)
    });

    // Automatically Add Ketu exactly 180 degrees opposite of Rahu
    if (p.name === 'Rahu') {
      let ketuLongitude = longitude + 180;
      if (ketuLongitude >= 360) ketuLongitude -= 360;
      const ketuSign = Math.floor(ketuLongitude / 30) + 1;
      
      planetsData.push({
        id: i + 1,
        name: 'Ketu',
        longitude: ketuLongitude,
        speed: speed, // same inverse speed conceptually,
        sign: ketuSign,
        isRetrograde: false, // Nodes append standard UI logic
        isCombust: false,
        isExalted: isExalted('Ketu', ketuSign),
        isDebilitated: isDebilitated('Ketu', ketuSign)
      });
    }
  }

  // Combust logic: Difference between Sun and Planet is less than ~8.5 degrees (general approximation, exact depends on planet)
  planetsData.forEach(p => {
    if (p.name !== 'Sun' && p.name !== 'Moon' && p.name !== 'Rahu' && p.name !== 'Ketu') {
      let diff = Math.abs(p.longitude - sunLongitude);
      if (diff > 180) diff = 360 - diff;
      p.isCombust = diff <= 8.5;
    } else {
      p.isCombust = false; // Nodes and Moon/Sun don't count
    }
    
    // As per user specification: Retrograde logic append '*' but strictly check negative speed via true swisseph engine
    if (p.name === 'Rahu' || p.name === 'Ketu') {
      p.isRetrograde = true; // Traditionally nodes are always *
    }
  });

  // Calculate Ascendant (Lagna) and Houses using Topocentric coordinates
  const housesReturn = swisseph.swe_houses_ex(jd_ut, flags, lat, lon, 'W'); // Whole Sign house system
  
  const ascendantDegree = housesReturn.ascendant;
  const ascendantSign = Math.floor(ascendantDegree / 30) + 1;

  // Compile final context state
  return {
    julianDay: jd_ut,
    ascendantDegree,
    ascendantSign,
    houses: housesReturn.house,
    planets: planetsData
  };
}
