import type { IconName } from "@/components/ui/Icon";

/**
 * Réponse météo normalisée de Whimcast.
 *
 * Ces types ne dépendent pas du format d'Open-Meteo : le reste de l'application
 * ne manipule que ces structures. Changer de fournisseur ne doit toucher que
 * `lib/weather/`.
 *
 * Unités : températures en °C, vent en km/h, pression en hPa, visibilité en
 * mètres, humidité et probabilités en pourcentage (0 à 100).
 *
 * Dates : chaînes ISO 8601 sans fuseau (« 2026-11-21T14:00 », « 2026-11-21 »),
 * exprimées dans l'heure locale du lieu. Le décalage UTC du lieu est dans
 * `location.utcOffsetSeconds`.
 */

/** Conditions météo lisibles, tirées d'un code WMO. */
export type WeatherCondition = {
  /** Code météo WMO d'origine (0 à 99). */
  code: number;
  /** Libellé français, ex. « Pluie modérée ». */
  label: string;
  /** Icône de la maquette à afficher. */
  icon: IconName;
};

export type WeatherLocation = {
  latitude: number;
  longitude: number;
  /** Fuseau IANA du lieu, ex. « America/Toronto ». */
  timezone: string;
  /** Décalage par rapport à UTC, en secondes. */
  utcOffsetSeconds: number;
};

export type CurrentWeather = {
  /** Heure de la mesure, heure locale du lieu. */
  time: string;
  temperature: number;
  feelsLike: number;
  /** Minimum du jour. */
  min: number;
  /** Maximum du jour. */
  max: number;
  windSpeed: number;
  windGusts: number;
  /** Direction d'où vient le vent, en degrés (0 = nord). */
  windDirection: number;
  humidity: number;
  dewPoint: number;
  visibility: number;
  pressure: number;
  /** Lever du soleil du jour, heure locale du lieu. */
  sunrise: string;
  /** Coucher du soleil du jour, heure locale du lieu. */
  sunset: string;
  /** Probabilité de pluie pour l'heure en cours. */
  precipitationProbability: number;
  isDay: boolean;
  condition: WeatherCondition;
};

export type HourlyForecast = {
  /** Début de l'heure, heure locale du lieu. */
  time: string;
  temperature: number;
  feelsLike: number;
  precipitationProbability: number;
  windSpeed: number;
  isDay: boolean;
  condition: WeatherCondition;
};

export type DailyForecast = {
  /** Jour, au format « AAAA-MM-JJ ». */
  date: string;
  min: number;
  max: number;
  sunrise: string;
  sunset: string;
  /** Probabilité de pluie maximale de la journée. */
  precipitationProbability: number;
  windSpeedMax: number;
  windGustsMax: number;
  condition: WeatherCondition;
};

export type WeatherData = {
  location: WeatherLocation;
  current: CurrentWeather;
  /** Les 12 prochaines heures, à partir de l'heure en cours. */
  hourly: HourlyForecast[];
  /** Les 7 prochains jours, à partir d'aujourd'hui. */
  daily: DailyForecast[];
};
