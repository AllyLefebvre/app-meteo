import { WeatherError } from "./errors";
import type { City } from "./types";

/*
 * Conversion d'une réponse brute de l'API de géocodage d'Open-Meteo vers
 * `City[]`. Ce fichier est pur (aucun appel réseau) pour pouvoir être testé
 * avec une réponse enregistrée.
 */

/**
 * En dessous de 2 caractères, Open-Meteo ne renvoie rien : on évite l'appel.
 * Au-delà de 100, la saisie n'est pas un nom de ville.
 */
export const MIN_QUERY_LENGTH = 2;
export const MAX_QUERY_LENGTH = 100;
/** Nombre de résultats par défaut et maximal. */
export const DEFAULT_COUNT = 5;
export const MAX_COUNT = 10;

/**
 * Codes des provinces et territoires canadiens, indexés par identifiant
 * GeoNames (`admin1_id`). L'identifiant est stable, contrairement au nom,
 * qui change avec la langue demandée.
 */
export const CANADIAN_PROVINCE_CODES: Readonly<Record<number, string>> = {
  5883102: "AB", // Alberta
  5909050: "BC", // Colombie-Britannique
  6065171: "MB", // Manitoba
  6087430: "NB", // Nouveau-Brunswick
  6354959: "NL", // Terre-Neuve-et-Labrador
  6091530: "NS", // Nouvelle-Écosse
  6091069: "NT", // Territoires du Nord-Ouest
  6091732: "NU", // Nunavut
  6093943: "ON", // Ontario
  6113358: "PE", // Île-du-Prince-Édouard
  6115047: "QC", // Québec
  6141242: "SK", // Saskatchewan
  6185811: "YT", // Yukon
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/** « Montréal, QC » au Canada, « Paris, France » ailleurs. */
export function formatCityLabel(city: {
  name: string;
  country: string;
  countryCode: string;
  region: string | null;
  regionId?: number;
}): string {
  if (city.countryCode === "CA") {
    const province =
      city.regionId !== undefined ? CANADIAN_PROVINCE_CODES[city.regionId] : undefined;
    return `${city.name}, ${province ?? city.region ?? city.country}`;
  }
  return `${city.name}, ${city.country}`;
}

/** Convertit un résultat ; renvoie null s'il manque une information utile. */
function normalizeResult(raw: unknown): City | null {
  if (!isRecord(raw)) return null;

  const { id, latitude, longitude } = raw;
  const name = optionalString(raw.name);
  const country = optionalString(raw.country);
  const countryCode = optionalString(raw.country_code);
  const timezone = optionalString(raw.timezone);
  const region = optionalString(raw.admin1);

  if (
    typeof id !== "number" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !name ||
    !country ||
    !countryCode ||
    !timezone
  ) {
    return null;
  }

  const regionId = typeof raw.admin1_id === "number" ? raw.admin1_id : undefined;

  return {
    id,
    name,
    region,
    country,
    countryCode,
    latitude,
    longitude,
    timezone,
    label: formatCityLabel({ name, country, countryCode, region, regionId }),
  };
}

/**
 * Normalise la réponse de `/v1/search`. Sans résultat, Open-Meteo omet la clé
 * `results` : on renvoie alors une liste vide. Les résultats incomplets (sans
 * pays ou sans fuseau, par exemple) sont ignorés.
 *
 * @throws {WeatherError} INVALID_RESPONSE si le corps n'a pas le format attendu.
 */
export function normalizeGeocoding(raw: unknown): City[] {
  if (!isRecord(raw)) {
    throw new WeatherError(
      "INVALID_RESPONSE",
      "Réponse de géocodage invalide : le corps n'est pas un objet JSON.",
    );
  }
  if (raw.results === undefined) return [];
  if (!Array.isArray(raw.results)) {
    throw new WeatherError(
      "INVALID_RESPONSE",
      "Réponse de géocodage invalide : « results » n'est pas une liste.",
    );
  }

  return raw.results
    .map(normalizeResult)
    .filter((city): city is City => city !== null);
}
