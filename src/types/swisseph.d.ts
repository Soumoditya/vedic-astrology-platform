declare module 'swisseph' {
  export const SE_SIDM_LAHIRI: number;
  export const SEFLG_SWIEPH: number;
  export const SEFLG_SIDEREAL: number;
  export const SEFLG_SPEED: number;
  
  export const SE_SUN: number;
  export const SE_MOON: number;
  export const SE_MERCURY: number;
  export const SE_VENUS: number;
  export const SE_MARS: number;
  export const SE_JUPITER: number;
  export const SE_SATURN: number;
  export const SE_TRUE_NODE: number;
  export const SE_MEAN_NODE: number;

  export const SE_GREG_CAL: number;

  export function swe_set_sid_mode(sid_mode: number, t0: number, ayan_t0: number): void;
  export function swe_set_topo(lon: number, lat: number, alt: number): void;
  
  export interface SweDateReturn {
    error: any;
    julianDay: number;
  }
  export function swe_utc_to_jd(year: number, month: number, day: number, hour: number, min: number, sec: number, gregflag: number): SweDateReturn;
  
  export interface SweCalcReturn {
    error?: any;
    longitude: number;
    latitude: number;
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
  }
  export function swe_calc_ut(jd_ut: number, ipl: number, iflag: number): SweCalcReturn;
  
  export interface SweHousesReturn {
    error?: any;
    ascendant: number;
    mc: number;
    armc: number;
    vertex: number;
    equatorialAscendant: number;
    coAscendant: number;
    polarAscendant: number;
    house: number[];
  }
  export function swe_houses_ex(jd_ut: number, iflag: number, geolat: number, geolon: number, hsys: string): SweHousesReturn;
}
