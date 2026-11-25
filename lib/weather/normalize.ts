import { WeatherError } from "./errors";
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherData,
} from "./types";
import { getWeatherCondition } from "./wmo";

/*
 * Conversion d'une réponse brute d'Open-Meteo vers `WeatherData`.
 * Ce fichier est pur (aucun appel réseau) pour pouvoir être testé avec une
 * réponse enregistrée.
 */

/** Variables demandées à Open-Meteo, dans l'ordre où elles sont lues. */
export const CURRENT_VARIABLES = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "dew_point_2m",
  "visibility",
  "pressure_msl",
  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m",
  "weather_code",
  "is_day",
] as const;

export const HOURLY_VARIABLES = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation_probability",
  "wind_speed_10m",
  "pressure_msl",
  "weather_code",
  "is_day",
] as const;

export const DAILY_VARIABLES = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "sunrise",
  "sunset",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
] as const;

type UnknownRecord = Record<string, unknown>;

function invalid(detail: string): WeatherError {
  return new WeatherError(
    "INVALID_RESPONSE",
    `Réponse Open-Meteo invalide : ${detail}.`,
  );
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRecord(source: UnknownRecord, key: string): UnknownRecord {
  const value = source[key];
  if (!isRecord(value)) throw invalid(`« ${key} » manquant`);
  return value;
}

/** Nombre facultatif : null s'il est absent ou invalide, sans erreur. */
function readOptionalNumber(source: UnknownRecord, key: string): number | null {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readNumber(source: UnknownRecord, key: string, path: string): number {
  const value = source[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw invalid(`« ${path}.${key} » n'est pas un nombre`);
  }
  return value;
}

function readString(source: UnknownRecord, key: string, path: string): string {
  const value = source[key];
  if (typeof value !== "string" || value === "") {
    throw invalid(`« ${path}.${key} » n'est pas une chaîne`);
  }
  return value;
}

function readNumbers(
  source: UnknownRecord,
  key: string,
  path: string,
  length: number,
): number[] {
  const value = source[key];
  if (
    !Array.isArray(value) ||
    value.length < length ||
    !value.every((item) => typeof item === "number" && Number.isFinite(item))
  ) {
    throw invalid(`« ${path}.${key} » doit contenir ${length} nombres`);
  }
  return value as number[];
}

function readStrings(
  source: UnknownRecord,
  key: string,
  path: string,
  length: number,
): string[] {
  const value = source[key];
  if (
    !Array.isArray(value) ||
    value.length < length ||
    !value.every((item) => typeof item === "string" && item !== "")
  ) {
    throw invalid(`« ${path}.${key} » doit contenir ${length} chaînes`);
  }
  return value as string[];
}

export type NormalizeOptions = {
  /** Nombre d'heures attendues (12 par défaut). */
  hours?: number;
  /** Nombre de jours attendus (7 par défaut). */
  days?: number;
};

/**
 * Convertit une réponse JSON d'Open-Meteo (`/v1/forecast`) en `WeatherData`.
 * Lève une `WeatherError` de code INVALID_RESPONSE si un champ manque ou a un
 * type inattendu.
 */
export function normalizeOpenMeteo(
  raw: unknown,
  { hours = 12, days = 7 }: NormalizeOptions = {},
): WeatherData {
  if (!isRecord(raw)) throw invalid("le corps n'est pas un objet JSON");

  const location = {
    latitude: readNumber(raw, "latitude", "racine"),
    longitude: readNumber(raw, "longitude", "racine"),
    timezone: readString(raw, "timezone", "racine"),
    utcOffsetSeconds: readNumber(raw, "utc_offset_seconds", "racine"),
  };

  const hourly = normalizeHourly(readRecord(raw, "hourly"), hours);
  const daily = normalizeDaily(readRecord(raw, "daily"), days);
  const current = normalizeCurrent(readRecord(raw, "current"), hourly, daily[0]);

  return { location, current, hourly, daily };
}

function normalizeHourly(source: UnknownRecord, hours: number): HourlyForecast[] {
  const p = "hourly";
  const time = readStrings(source, "time", p, hours);
  const temperature = readNumbers(source, "temperature_2m", p, hours);
  const feelsLike = readNumbers(source, "apparent_temperature", p, hours);
  const rain = readNumbers(source, "precipitation_probability", p, hours);
  const wind = readNumbers(source, "wind_speed_10m", p, hours);
  const pressure = readNumbers(source, "pressure_msl", p, hours);
  const code = readNumbers(source, "weather_code", p, hours);
  const isDay = readNumbers(source, "is_day", p, hours);

  return time.slice(0, hours).map((t, i) => ({
    time: t,
    temperature: temperature[i],
    feelsLike: feelsLike[i],
    precipitationProbability: rain[i],
    windSpeed: wind[i],
    pressure: pressure[i],
    isDay: isDay[i] === 1,
    condition: getWeatherCondition(code[i], isDay[i] === 1),
  }));
}

function normalizeDaily(source: UnknownRecord, days: number): DailyForecast[] {
  const p = "daily";
  const date = readStrings(source, "time", p, days);
  const code = readNumbers(source, "weather_code", p, days);
  const max = readNumbers(source, "temperature_2m_max", p, days);
  const min = readNumbers(source, "temperature_2m_min", p, days);
  const sunrise = readStrings(source, "sunrise", p, days);
  const sunset = readStrings(source, "sunset", p, days);
  const rain = readNumbers(source, "precipitation_probability_max", p, days);
  const windMax = readNumbers(source, "wind_speed_10m_max", p, days);
  const gustsMax = readNumbers(source, "wind_gusts_10m_max", p, days);

  return date.slice(0, days).map((d, i) => ({
    date: d,
    min: min[i],
    max: max[i],
    sunrise: sunrise[i],
    sunset: sunset[i],
    precipitationProbability: rain[i],
    windSpeedMax: windMax[i],
    windGustsMax: gustsMax[i],
    condition: getWeatherCondition(code[i]),
  }));
}

function normalizeCurrent(
  source: UnknownRecord,
  hourly: HourlyForecast[],
  today: DailyForecast,
): CurrentWeather {
  const p = "current";
  const time = readString(source, "time", p);

  // Probabilité de pluie : celle de l'heure en cours (« 2026-11-21T14:15 »
  // tombe dans l'heure « 2026-11-21T14:00 »), sinon la première heure.
  const hourStart = `${time.slice(0, 13)}:00`;
  const currentHour = hourly.find((h) => h.time === hourStart) ?? hourly[0];

  return {
    time,
    temperature: readNumber(source, "temperature_2m", p),
    feelsLike: readNumber(source, "apparent_temperature", p),
    min: today.min,
    max: today.max,
    windSpeed: readNumber(source, "wind_speed_10m", p),
    // Mesures secondaires : facultatives (voir CurrentWeather).
    windGusts: readOptionalNumber(source, "wind_gusts_10m"),
    windDirection: readNumber(source, "wind_direction_10m", p),
    humidity: readOptionalNumber(source, "relative_humidity_2m"),
    dewPoint: readOptionalNumber(source, "dew_point_2m"),
    visibility: readOptionalNumber(source, "visibility"),
    pressure: readOptionalNumber(source, "pressure_msl"),
    sunrise: today.sunrise,
    sunset: today.sunset,
    precipitationProbability: currentHour.precipitationProbability,
    isDay: readNumber(source, "is_day", p) === 1,
    condition: getWeatherCondition(
      readNumber(source, "weather_code", p),
      readNumber(source, "is_day", p) === 1,
    ),
  };
}
