import { NBSP } from "./locales";

/*
 * Mesures du bloc « Détails du moment », au format fr-CA de la maquette :
 * espace insécable avant l'unité, virgule décimale. Unités métriques, comme
 * les données (km/h, %, mètres, hPa). Les unités impériales arriveront avec
 * l'épopée WMC-44.
 */

/** « 18 km/h » */
export function formatWindSpeed(kmh: number): string {
  return `${Math.round(kmh)}${NBSP}km/h`;
}

/** « 72 % » */
export function formatPercent(percent: number): string {
  return `${Math.round(percent)}${NBSP}%`;
}

/** « 1016 hPa » (sans séparateur de milliers, comme dans la maquette). */
export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)}${NBSP}hPa`;
}

/**
 * Visibilité :
 * - 10 km et plus : au kilomètre (« 10 km », « 24 km ») ;
 * - de 1 à 10 km : au dixième (« 2,5 km », « 4 km ») ;
 * - moins de 1 km : par centaines de mètres (« 800 m », « 0 m »).
 */
export function formatDistance(meters: number): string {
  const m = Math.max(0, meters);
  if (m >= 10_000) return `${Math.round(m / 1000)}${NBSP}km`;
  if (m >= 1000) {
    const km = Math.round(m / 100) / 10;
    return `${String(km).replace(".", ",")}${NBSP}km`;
  }
  return `${Math.round(m / 100) * 100}${NBSP}m`;
}
