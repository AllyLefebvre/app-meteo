import type { NextRequest } from "next/server";

import {
  WEATHER_API_ERROR_STATUS,
  parseCoordinates,
  type WeatherApiErrorBody,
  type WeatherApiErrorCode,
} from "@/lib/weather/api";
import { getWeather, isWeatherError } from "@/lib/weather";

/**
 * Cache navigateur et CDN : 5 minutes de fraîcheur, puis 5 minutes où une
 * réponse périmée peut être servie pendant la mise à jour. Côté serveur, le
 * client Open-Meteo est déjà mis en cache 10 minutes par Next.js.
 */
const CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=300";

function errorResponse(code: WeatherApiErrorCode, message: string): Response {
  const body: WeatherApiErrorBody = { error: { code, message } };
  return Response.json(body, {
    status: WEATHER_API_ERROR_STATUS[code],
    headers: { "Cache-Control": "no-store" },
  });
}

/** GET /api/weather?lat=45.5017&lon=-73.5673 */
export async function GET(request: NextRequest): Promise<Response> {
  const coordinates = parseCoordinates(request.nextUrl.searchParams);
  if (!coordinates.ok) {
    return errorResponse(coordinates.code, coordinates.message);
  }

  try {
    const data = await getWeather(coordinates);
    return Response.json(data, { headers: { "Cache-Control": CACHE_CONTROL } });
  } catch (error) {
    if (isWeatherError(error)) {
      console.error(`[api/weather] ${error.code}`, error.message, error.cause ?? "");
      // Message générique pour les erreurs du fournisseur : le détail reste
      // dans les journaux du serveur.
      const message =
        error.code === "INVALID_COORDINATES"
          ? error.message
          : "Les données météo sont indisponibles pour le moment. Réessayez dans quelques instants.";
      return errorResponse(error.code, message);
    }
    console.error("[api/weather] erreur inattendue", error);
    return errorResponse("INTERNAL", "Une erreur inattendue est survenue.");
  }
}
