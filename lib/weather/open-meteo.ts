import "server-only";

import { WeatherError } from "./errors";
import {
  CURRENT_VARIABLES,
  DAILY_VARIABLES,
  HOURLY_VARIABLES,
  normalizeOpenMeteo,
} from "./normalize";
import type { WeatherData } from "./types";

const FREE_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const CUSTOMER_ENDPOINT = "https://customer-api.open-meteo.com/v1/forecast";

const HOURS = 12;
const DAYS = 7;
/** Durée de mise en cache d'une prévision par Next.js, en secondes. */
const REVALIDATE_SECONDS = 600;
/** Délai maximal d'attente du fournisseur, en millisecondes. */
const TIMEOUT_MS = 8000;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

function assertCoordinates({ latitude, longitude }: Coordinates): void {
  const valid =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;
  if (!valid) {
    throw new WeatherError(
      "INVALID_COORDINATES",
      `Coordonnées invalides : ${latitude}, ${longitude}.`,
    );
  }
}

/**
 * Construit l'URL Open-Meteo. Si `OPEN_METEO_API_KEY` est défini (licence
 * commerciale), l'URL vise l'API client avec la clé ; sinon l'API gratuite.
 */
export function buildForecastUrl(
  { latitude, longitude }: Coordinates,
  apiKey = process.env.OPEN_METEO_API_KEY,
): URL {
  const url = new URL(apiKey ? CUSTOMER_ENDPOINT : FREE_ENDPOINT);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_VARIABLES.join(","),
    hourly: HOURLY_VARIABLES.join(","),
    daily: DAILY_VARIABLES.join(","),
    // Les heures partent de l'heure en cours, les jours d'aujourd'hui.
    forecast_hours: String(HOURS),
    forecast_days: String(DAYS),
    timezone: "auto",
    // Unités par défaut d'Open-Meteo, explicitées : °C, km/h, mm.
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  }).toString();
  if (apiKey) url.searchParams.set("apikey", apiKey);
  return url;
}

/**
 * Récupère la météo actuelle, des 12 prochaines heures et des 7 prochains
 * jours pour un point. Code serveur uniquement.
 *
 * @throws {WeatherError} INVALID_COORDINATES, NETWORK, PROVIDER ou
 * INVALID_RESPONSE.
 */
export async function getWeather(coordinates: Coordinates): Promise<WeatherData> {
  assertCoordinates(coordinates);
  const url = buildForecastUrl(coordinates);

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    throw new WeatherError(
      "NETWORK",
      "Le service météo est injoignable pour le moment.",
      { cause },
    );
  }

  if (!response.ok) {
    // Open-Meteo renvoie { error: true, reason: "…" } en cas d'erreur.
    const reason = await response
      .json()
      .then((body: { reason?: unknown }) =>
        typeof body?.reason === "string" ? body.reason : undefined,
      )
      .catch(() => undefined);
    throw new WeatherError(
      "PROVIDER",
      `Le service météo a répondu ${response.status}${reason ? ` : ${reason}` : ""}.`,
      { status: response.status },
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (cause) {
    throw new WeatherError(
      "INVALID_RESPONSE",
      "Réponse Open-Meteo invalide : le corps n'est pas du JSON.",
      { cause },
    );
  }

  return normalizeOpenMeteo(body, { hours: HOURS, days: DAYS });
}
