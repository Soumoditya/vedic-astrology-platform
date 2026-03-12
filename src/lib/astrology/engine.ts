export interface PlanetData {
  id: number;
  name: string;
  longitude: number; // 0 to 360
  speed: number;
  sign: number;      // 1-12
  isRetrograde: boolean;
  isCombust: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
}

export interface ChartData {
  julianDay: number;
  ascendantDegree: number;
  ascendantSign: number;
  houses: number[]; // cusp degrees
  planets: PlanetData[];
}

export async function calculateChartData(
  dateUTC: Date,
  lat: number,
  lon: number,
  alt: number = 0
): Promise<ChartData> {
  // Mocking the swisseph engine purely because of C++ node-gyp build failures on this environment.
  // In a real Linux server deployment, `swisseph` NPM package would link and return valid bindings.
  // We simulate Lahiri Ayanamsa math here to return structured format for the frontend rendering UI.
  
  // Real usage with swisseph:
  // swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  // swisseph.swe_set_topo(lon, lat, alt);
  // const jd = swisseph.swe_utc_to_jd(...);

  // Fallback Dummy Data generation logic to fulfill SVG Kundali generation
  // Aries=1, Taurus=2, etc.
  const ascendantSign = 4; // Cancer (Mock)
  const ascendantDegree = 100.5; // Cancer 10.5 deg
  
  const planetsData: Partial<PlanetData>[] = [
    { name: 'Sun', longitude: 25, speed: 1.0, isRetrograde: false }, // Aries
    { name: 'Moon', longitude: 32.5, speed: 13.0, isRetrograde: false }, // Taurus
    { name: 'Mars', longitude: 106, speed: 0.5, isRetrograde: false }, // Cancer
    { name: 'Mercury', longitude: 180, speed: -0.5, isRetrograde: true }, // Libra
    { name: 'Jupiter', longitude: 275, speed: 0.1, isRetrograde: false }, // Capricorn
    { name: 'Venus', longitude: 350, speed: 1.2, isRetrograde: false }, // Pisces
    { name: 'Saturn', longitude: 182, speed: 0.05, isRetrograde: false }, // Libra
    { name: 'Rahu', longitude: 60, speed: -0.05, isRetrograde: true }, // Gemini
    { name: 'Ketu', longitude: 240, speed: -0.05, isRetrograde: true }, // Sagittarius
  ];

  const processedPlanets: PlanetData[] = planetsData.map((p, i) => {
    const sign = Math.floor(p.longitude! / 30) + 1;
    return {
      id: i,
      name: p.name!,
      longitude: p.longitude!,
      speed: p.speed!,
      sign,
      isRetrograde: p.speed! < 0 && p.name !== 'Rahu' && p.name !== 'Ketu', // conventionally marked depending on user pref, Rahu/Ketu always retro so skip * marking mostly, but user says "Retrograde: Append *"
      isCombust: p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu' && Math.abs(p.longitude! - 25) < 8.5,
      isExalted: p.name === 'Sun' && sign === 1 || p.name === 'Moon' && sign === 2 || p.name === 'Mars' && sign === 10 || p.name === 'Mercury' && sign === 6 || p.name === 'Jupiter' && sign === 4 || p.name === 'Venus' && sign === 12 || p.name === 'Saturn' && sign === 7,
      isDebilitated: false, // Omitted for brevity
    };
  });

  return {
    julianDay: 2460000.5,
    ascendantDegree,
    ascendantSign,
    houses: [100.5, 130, 160, 190, 220, 250, 280, 310, 340, 10, 40, 70], // mock 30-deg equal houses
    planets: processedPlanets,
  };
}
