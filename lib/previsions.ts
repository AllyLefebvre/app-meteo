import { parseCoordinates } from "@/lib/weather/api";

/*
 * URL de la page Prévisions, partageable :
 * /previsions?lat=45.5088&lon=-73.5878&nom=Montréal%2C+QC
 *
 * - lat, lon : obligatoires, servent à charger la météo.
 * - nom : facultatif, affiché tel quel (« Montréal, QC »). Il évite un second
 *   appel de géocodage ; sans lui, on affiche les coordonnées.
 *
 * Ce format est public (liens partagés) : ne pas le changer sans garder la
 * compatibilité.
 */

export const PREVISIONS_PATH = "/previsions";

/** Au-delà, le nom n'est pas un libellé de ville : on le coupe. */
const MAX_NOM = 100;

export type PrevisionsLieu = {
  latitude: number;
  longitude: number;
  /** Libellé court, ex. « Montréal, QC ». */
  nom: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

/** Première valeur d'un paramètre (un paramètre répété donne un tableau). */
function premier(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** « 45,5088, -73,5878 » : affiché quand l'URL n'a pas de nom. */
function nomParDefaut(latitude: number, longitude: number): string {
  const format = (n: number) => n.toLocaleString("fr-CA", { maximumFractionDigits: 4 });
  return `${format(latitude)}, ${format(longitude)}`;
}

/** Lit le lieu dans les paramètres de la page ; null si lat ou lon est absent ou invalide. */
export function lirePrevisionsParams(params: SearchParams): PrevisionsLieu | null {
  const search = new URLSearchParams();
  const lat = premier(params.lat);
  const lon = premier(params.lon);
  if (lat !== undefined) search.set("lat", lat);
  if (lon !== undefined) search.set("lon", lon);

  const coordonnees = parseCoordinates(search);
  if (!coordonnees.ok) return null;

  const { latitude, longitude } = coordonnees;
  const nom = premier(params.nom)?.trim().slice(0, MAX_NOM);

  return { latitude, longitude, nom: nom || nomParDefaut(latitude, longitude) };
}

/** Lien vers la page Prévisions d'une ville (ex. depuis la recherche). */
export function lienPrevisions({
  latitude,
  longitude,
  nom,
}: {
  latitude: number;
  longitude: number;
  nom?: string;
}): string {
  const search = new URLSearchParams({
    lat: String(Number(latitude.toFixed(4))),
    lon: String(Number(longitude.toFixed(4))),
  });
  if (nom) search.set("nom", nom);
  return `${PREVISIONS_PATH}?${search.toString()}`;
}

/*
 * Dernière ville consultée : retenue dans un cookie par RetenirVille à chaque
 * visite de la page Prévisions. Le lien « Prévisions » du menu (/previsions,
 * sans ville) rouvre cette ville, ou la ville par défaut à la première visite.
 */

export const DERNIERE_VILLE_COOKIE = "whimcast-derniere-ville";

/** Ville ouverte quand aucune ville n'a encore été consultée. */
export const VILLE_PAR_DEFAUT: PrevisionsLieu = {
  latitude: 45.5088,
  longitude: -73.5878,
  nom: "Montréal, QC",
};

/** Valeur du cookie : les paramètres de l'URL (lat=…&lon=…&nom=…). */
export function versCookieVille(lieu: PrevisionsLieu): string {
  return lienPrevisions(lieu).slice(PREVISIONS_PATH.length + 1);
}

/** Lieu lu dans le cookie ; null s'il est absent ou invalide. */
export function lireCookieVille(valeur: string | undefined): PrevisionsLieu | null {
  if (!valeur) return null;
  return lirePrevisionsParams(Object.fromEntries(new URLSearchParams(valeur)));
}
