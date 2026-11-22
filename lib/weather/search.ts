import "server-only";

import { WeatherError } from "./errors";
import {
  DEFAULT_COUNT,
  MAX_COUNT,
  MAX_QUERY_LENGTH,
  MIN_QUERY_LENGTH,
  normalizeGeocoding,
} from "./geocoding";
import type { City } from "./types";

const FREE_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
const CUSTOMER_ENDPOINT = "https://customer-geocoding-api.open-meteo.com/v1/search";

/** Un nom de ville change rarement : résultats mis en cache un jour. */
const REVALIDATE_SECONDS = 86_400;
/** Délai maximal d'attente du fournisseur, en millisecondes. */
const TIMEOUT_MS = 8000;

/**
 * Construit l'URL de recherche. Si `OPEN_METEO_API_KEY` est défini (licence
 * commerciale), l'URL vise l'API client avec la clé ; sinon l'API gratuite.
 */
export function buildSearchUrl(
  query: string,
  count: number,
  apiKey = process.env.OPEN_METEO_API_KEY,
): URL {
  const url = new URL(apiKey ? CUSTOMER_ENDPOINT : FREE_ENDPOINT);
  url.search = new URLSearchParams({
    name: query,
    count: String(count),
    // Noms en français : « Montréal », « Québec », « États-Unis ».
    language: "fr",
    format: "json",
  }).toString();
  if (apiKey) url.searchParams.set("apikey", apiKey);
  return url;
}

/**
 * Cherche des villes par nom avec l'API de géocodage d'Open-Meteo. Code
 * serveur uniquement.
 *
 * Saisie vide ou trop courte : liste vide, sans appel au fournisseur.
 * Aucun résultat : liste vide, sans erreur.
 *
 * @throws {WeatherError} NETWORK, PROVIDER ou INVALID_RESPONSE.
 */
export async function searchCities(
  query: string,
  { count = DEFAULT_COUNT }: { count?: number } = {},
): Promise<City[]> {
  const name = query.trim().slice(0, MAX_QUERY_LENGTH);
  if (name.length < MIN_QUERY_LENGTH) return [];

  const limit = Math.min(Math.max(Math.trunc(count), 1), MAX_COUNT);
  const url = buildSearchUrl(name, limit);

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    throw new WeatherError(
      "NETWORK",
      "Le service de recherche de villes est injoignable pour le moment.",
      { cause },
    );
  }

  if (!response.ok) {
    throw new WeatherError(
      "PROVIDER",
      `Le service de géocodage a répondu ${response.status}.`,
      { status: response.status },
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (cause) {
    throw new WeatherError(
      "INVALID_RESPONSE",
      "Réponse de géocodage invalide : le corps n'est pas du JSON.",
      { cause },
    );
  }

  return normalizeGeocoding(body);
}
