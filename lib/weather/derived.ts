import type { CurrentWeather, HourlyForecast, WeatherData } from "./types";

/*
 * Libellés dérivés du bloc « Détails du moment » : ce que la maquette affiche
 * sous une valeur mais que l'API ne fournit pas.
 *
 * Les fonctions sont pures et renvoient un code, jamais un texte : le texte
 * vient de DERIVED_LABELS selon la langue (épopée WMC-44). Elles renvoient
 * null quand les données manquent ou sont invalides, sans lever d'erreur.
 *
 * Tous les seuils s'appliquent aux données d'origine, en métrique (hPa, mètres,
 * °C, km/h), quelles que soient les unités affichées.
 */

/* ------------------------------------------------------------------ */
/* Tendance de pression                                               */
/* ------------------------------------------------------------------ */

export type PressureTrend = "rising" | "steady" | "falling";

/** Écart sur lequel la tendance est mesurée, en heures. */
export const PRESSURE_TREND_HOURS = 3;
/**
 * Variation minimale, en hPa sur 3 heures, pour parler de hausse ou de baisse
 * (même seuil qu'Environnement Canada : 0,1 kPa). En dessous : « Stable ».
 */
export const PRESSURE_TREND_THRESHOLD_HPA = 1;

/**
 * Tendance de pression prévue sur les 3 prochaines heures : compare l'heure en
 * cours (`hourly[0]`) à 3 heures plus tard (`hourly[3]`).
 */
export function getPressureTrend(
  hourly: readonly Pick<HourlyForecast, "pressure">[],
): PressureTrend | null {
  const now = hourly[0]?.pressure;
  const later = hourly[PRESSURE_TREND_HOURS]?.pressure;
  if (!isNumber(now) || !isNumber(later)) return null;

  const change = later - now;
  if (change >= PRESSURE_TREND_THRESHOLD_HPA) return "rising";
  if (change <= -PRESSURE_TREND_THRESHOLD_HPA) return "falling";
  return "steady";
}

/* ------------------------------------------------------------------ */
/* Qualité de la visibilité                                           */
/* ------------------------------------------------------------------ */

export type VisibilityQuality = "excellent" | "good" | "moderate" | "poor" | "very-poor";

/**
 * Seuils en mètres, du meilleur au pire : la visibilité est classée dans le
 * premier palier qu'elle atteint. 10 km donne « Excellente », comme dans la
 * maquette ; moins de 1 km correspond au brouillard.
 */
export const VISIBILITY_THRESHOLDS_M: readonly [VisibilityQuality, number][] = [
  ["excellent", 10_000],
  ["good", 5_000],
  ["moderate", 2_000],
  ["poor", 1_000],
  ["very-poor", 0],
];

export function getVisibilityQuality(meters: number): VisibilityQuality | null {
  if (!isNumber(meters) || meters < 0) return null;
  for (const [quality, min] of VISIBILITY_THRESHOLDS_M) {
    if (meters >= min) return quality;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Phrase de ressenti                                                 */
/* ------------------------------------------------------------------ */

export type FeelsLike = "similar" | "wind-chill" | "colder" | "humid" | "warmer";

/** Écart minimal, en °C, entre ressenti et température réelle pour en parler. */
export const FEELS_LIKE_THRESHOLD_C = 2;
/** Vent à partir duquel un ressenti plus froid est attribué au vent, en km/h. */
export const WIND_CHILL_MIN_KMH = 10;
/** Humidité à partir de laquelle un ressenti plus chaud est attribué à l'humidité, en %. */
export const HUMID_MIN_PERCENT = 60;

export type FeelsLikeInput = Pick<
  CurrentWeather,
  "temperature" | "feelsLike" | "windSpeed" | "humidity"
>;

/**
 * Phrase de ressenti selon l'écart avec la température réelle et sa cause :
 * - écart de moins de 2 °C : « similar » ;
 * - plus froid avec du vent (10 km/h et plus) : « wind-chill », sinon « colder » ;
 * - plus chaud avec de l'humidité (60 % et plus) : « humid », sinon « warmer ».
 */
export function getFeelsLike({
  temperature,
  feelsLike,
  windSpeed,
  humidity,
}: FeelsLikeInput): FeelsLike | null {
  if (!isNumber(temperature) || !isNumber(feelsLike)) return null;

  const diff = feelsLike - temperature;
  if (Math.abs(diff) < FEELS_LIKE_THRESHOLD_C) return "similar";
  if (diff < 0) {
    return isNumber(windSpeed) && windSpeed >= WIND_CHILL_MIN_KMH ? "wind-chill" : "colder";
  }
  return isNumber(humidity) && humidity >= HUMID_MIN_PERCENT ? "humid" : "warmer";
}

/* ------------------------------------------------------------------ */
/* Ensemble et libellés                                               */
/* ------------------------------------------------------------------ */

export type DerivedStats = {
  pressureTrend: PressureTrend | null;
  visibility: VisibilityQuality | null;
  feelsLike: FeelsLike | null;
};

/** Les trois codes du bloc « Détails du moment » pour une réponse météo. */
export function getDerivedStats({
  current,
  hourly,
}: Pick<WeatherData, "current" | "hourly">): DerivedStats {
  return {
    pressureTrend: getPressureTrend(hourly),
    visibility: getVisibilityQuality(current.visibility),
    feelsLike: getFeelsLike(current),
  };
}

/** Langue des libellés (langue courte, voir WMC-45). */
export type DerivedLanguage = "fr" | "en";

type DerivedCode = PressureTrend | VisibilityQuality | FeelsLike;

/**
 * Libellés par langue. « Stable », « Excellente » et « Le vent refroidit
 * l'air » viennent de la maquette ; les autres sont à valider.
 */
export const DERIVED_LABELS: Record<
  DerivedLanguage,
  {
    pressureTrend: Record<PressureTrend, string>;
    visibility: Record<VisibilityQuality, string>;
    feelsLike: Record<FeelsLike, string>;
  }
> = {
  fr: {
    pressureTrend: { rising: "En hausse", steady: "Stable", falling: "En baisse" },
    visibility: {
      excellent: "Excellente",
      good: "Bonne",
      moderate: "Moyenne",
      poor: "Faible",
      "very-poor": "Très faible",
    },
    feelsLike: {
      similar: "Proche de la température réelle",
      "wind-chill": "Le vent refroidit l'air",
      colder: "Plus froid que la température réelle",
      humid: "L'humidité réchauffe l'air",
      warmer: "Plus chaud que la température réelle",
    },
  },
  en: {
    pressureTrend: { rising: "Rising", steady: "Steady", falling: "Falling" },
    visibility: {
      excellent: "Excellent",
      good: "Good",
      moderate: "Moderate",
      poor: "Poor",
      "very-poor": "Very poor",
    },
    feelsLike: {
      similar: "Close to the actual temperature",
      "wind-chill": "Wind makes it feel colder",
      colder: "Feels colder than it is",
      humid: "Humidity makes it feel warmer",
      warmer: "Feels warmer than it is",
    },
  },
};

/** Les trois libellés dans une langue ; null là où le code est null. */
export function getDerivedLabels(
  stats: DerivedStats,
  language: DerivedLanguage,
): Record<keyof DerivedStats, string | null> {
  const labels = DERIVED_LABELS[language];
  return {
    pressureTrend: label(labels.pressureTrend, stats.pressureTrend),
    visibility: label(labels.visibility, stats.visibility),
    feelsLike: label(labels.feelsLike, stats.feelsLike),
  };
}

function label<C extends DerivedCode>(table: Record<C, string>, code: C | null): string | null {
  return code === null ? null : table[code];
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
