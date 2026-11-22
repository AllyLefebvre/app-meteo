import type { NextRequest } from "next/server";

import {
  WEATHER_API_ERROR_STATUS,
  parseCitySearch,
  type GeocodeApiResponse,
  type WeatherApiErrorBody,
  type WeatherApiErrorCode,
} from "@/lib/weather/api";
import { isWeatherError, searchCities } from "@/lib/weather";

/**
 * Cache navigateur et CDN : 1 heure de fraîcheur, puis 1 jour où une réponse
 * périmée peut être servie pendant la mise à jour. Côté serveur, les
 * résultats d'Open-Meteo sont déjà mis en cache 1 jour par Next.js.
 */
const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";

function errorResponse(code: WeatherApiErrorCode, message: string): Response {
  const body: WeatherApiErrorBody = { error: { code, message } };
  return Response.json(body, {
    status: WEATHER_API_ERROR_STATUS[code],
    headers: { "Cache-Control": "no-store" },
  });
}

/** GET /api/geocode?q=Montréal&count=5 */
export async function GET(request: NextRequest): Promise<Response> {
  const search = parseCitySearch(request.nextUrl.searchParams);
  if (!search.ok) {
    return errorResponse(search.code, search.message);
  }

  try {
    const body: GeocodeApiResponse = {
      results: await searchCities(search.query, { count: search.count }),
    };
    return Response.json(body, { headers: { "Cache-Control": CACHE_CONTROL } });
  } catch (error) {
    if (isWeatherError(error)) {
      console.error(`[api/geocode] ${error.code}`, error.message, error.cause ?? "");
      return errorResponse(
        error.code,
        "La recherche de villes est indisponible pour le moment. Réessayez dans quelques instants.",
      );
    }
    console.error("[api/geocode] erreur inattendue", error);
    return errorResponse("INTERNAL", "Une erreur inattendue est survenue.");
  }
}
