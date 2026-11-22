import type { WeatherErrorCode } from "./errors";

/*
 * Contrat de la route GET /api/weather, partagé entre le serveur et
 * l'interface. Ce fichier ne contient aucun code serveur : un composant client
 * peut l'importer.
 *
 * Succès : 200 avec un `WeatherData` (voir `types.ts`).
 * Échec : un `WeatherApiErrorBody`, avec le statut indiqué par
 * `WEATHER_API_ERROR_STATUS`.
 */

export type WeatherApiErrorCode =
  | WeatherErrorCode
  /** Paramètre lat ou lon absent ou non numérique. */
  | "INVALID_PARAMS"
  /** Erreur inattendue côté serveur. */
  | "INTERNAL";

export type WeatherApiErrorBody = {
  error: {
    code: WeatherApiErrorCode;
    /** Message en français, affichable tel quel. */
    message: string;
  };
};

/** Statut HTTP renvoyé pour chaque code d'erreur. */
export const WEATHER_API_ERROR_STATUS: Record<WeatherApiErrorCode, number> = {
  INVALID_PARAMS: 400,
  INVALID_COORDINATES: 400,
  NETWORK: 502,
  PROVIDER: 502,
  INVALID_RESPONSE: 502,
  INTERNAL: 500,
};

/** Nombre décimal simple : « 45 », « -73.5673 ». Refuse « », « 1e3 », « 0x10 ». */
const DECIMAL = /^-?\d{1,3}(\.\d+)?$/;

/**
 * Précision gardée sur les coordonnées (4 décimales, environ 11 m). Deux
 * recherches très proches partagent ainsi la même entrée de cache.
 */
const PRECISION = 4;

export type ParsedCoordinates =
  | { ok: true; latitude: number; longitude: number }
  | { ok: false; code: "INVALID_PARAMS" | "INVALID_COORDINATES"; message: string };

/** Lit et valide les paramètres lat et lon d'une URL. */
export function parseCoordinates(params: URLSearchParams): ParsedCoordinates {
  const lat = params.get("lat")?.trim();
  const lon = params.get("lon")?.trim();

  if (!lat || !lon) {
    return {
      ok: false,
      code: "INVALID_PARAMS",
      message: "Les paramètres lat et lon sont obligatoires.",
    };
  }
  if (!DECIMAL.test(lat) || !DECIMAL.test(lon)) {
    return {
      ok: false,
      code: "INVALID_PARAMS",
      message: "Les paramètres lat et lon doivent être des nombres décimaux.",
    };
  }

  const latitude = Number(Number(lat).toFixed(PRECISION));
  const longitude = Number(Number(lon).toFixed(PRECISION));

  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return {
      ok: false,
      code: "INVALID_COORDINATES",
      message:
        "La latitude doit être entre -90 et 90, et la longitude entre -180 et 180.",
    };
  }

  return { ok: true, latitude, longitude };
}
