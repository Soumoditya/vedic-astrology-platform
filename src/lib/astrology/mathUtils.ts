export function getZodiacSign(longitude: number): number {
  return Math.floor(longitude / 30) + 1; // 1-12 (Aries to Pisces)
}

export function getZodiacSignName(signNumber: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  return signs[signNumber - 1];
}

export function isRetrograde(speed: number): boolean {
  return speed < 0;
}

export function isCombust(planetDegree: number, sunDegree: number, tolerance: number = 8.5): boolean {
  let diff = Math.abs(planetDegree - sunDegree);
  if (diff > 180) diff = 360 - diff;
  return diff <= tolerance;
}

export const exaltedSigns: Record<string, number> = {
  Sun: 1,       // Aries
  Moon: 2,      // Taurus
  Mars: 10,     // Capricorn
  Mercury: 6,   // Virgo
  Jupiter: 4,   // Cancer
  Venus: 12,    // Pisces
  Saturn: 7,    // Libra
  Rahu: 3,      // Gemini
  Ketu: 9,      // Sagittarius
};

export function isExalted(planetName: string, sign: number): boolean {
  return exaltedSigns[planetName] === sign;
}

export const debilitatedSigns: Record<string, number> = {
  Sun: 7,
  Moon: 8,
  Mars: 4,
  Mercury: 12,
  Jupiter: 10,
  Venus: 6,
  Saturn: 1,
  Rahu: 9,
  Ketu: 3,
};

export function isDebilitated(planetName: string, sign: number): boolean {
  return debilitatedSigns[planetName] === sign;
}
