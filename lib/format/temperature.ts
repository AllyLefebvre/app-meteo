/**
 * Arrondit une température au degré près, la moitié s'éloignant de zéro
 * (2,5 → 3 et -2,5 → -3, alors que `Math.round(-2.5)` donne -2). Ne renvoie
 * jamais -0.
 */
export function roundTemperature(celsius: number): number {
  if (!Number.isFinite(celsius)) {
    throw new RangeError(`Température invalide : ${celsius}.`);
  }
  const rounded = Math.sign(celsius) * Math.round(Math.abs(celsius));
  return rounded === 0 ? 0 : rounded;
}

/** « 12° », « -3° », « 0° » (jamais « -0° »). Température en °C. */
export function formatTemperature(celsius: number): string {
  return `${roundTemperature(celsius)}°`;
}
