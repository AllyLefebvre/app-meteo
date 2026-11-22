/**
 * Formats d'affichage provisoires, en attendant WMC-20 (formats de date).
 * L'heure est celle du lieu affiché : on passe son fuseau horaire.
 */

function majuscule(texte: string) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** « Sam. 7 nov. · 14 h 55 » (en-tête mobile de Prévisions). */
export function formaterDateCourte(date: Date, fuseau: string) {
  const jour = new Intl.DateTimeFormat("fr-CA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: fuseau,
  }).format(date);
  const heure = new Intl.DateTimeFormat("fr-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: fuseau,
  }).format(date);

  return `${majuscule(jour)} · ${heure}`;
}
