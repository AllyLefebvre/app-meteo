import type { IconName } from "@/components/ui/Icon";
import type { WeatherCondition } from "./types";

type ConditionInfo = Omit<WeatherCondition, "code">;

/**
 * Codes météo WMO (table 4677, sous-ensemble utilisé par Open-Meteo)
 * vers un libellé français et une icône de la maquette.
 *
 * La maquette n'a que cinq icônes de conditions : brouillard → nuage,
 * bruine, pluie verglaçante et orages → pluie, grains de neige → neige.
 */
export const WMO_CONDITIONS: Record<number, ConditionInfo> = {
  0: { label: "Ciel dégagé", icon: "soleil" },
  1: { label: "Plutôt dégagé", icon: "nuage-soleil" },
  2: { label: "Partiellement nuageux", icon: "nuage-soleil" },
  3: { label: "Couvert", icon: "nuage" },
  45: { label: "Brouillard", icon: "nuage" },
  48: { label: "Brouillard givrant", icon: "nuage" },
  51: { label: "Bruine légère", icon: "pluie" },
  53: { label: "Bruine modérée", icon: "pluie" },
  55: { label: "Bruine dense", icon: "pluie" },
  56: { label: "Bruine verglaçante légère", icon: "pluie" },
  57: { label: "Bruine verglaçante dense", icon: "pluie" },
  61: { label: "Pluie faible", icon: "pluie" },
  63: { label: "Pluie modérée", icon: "pluie" },
  65: { label: "Pluie forte", icon: "pluie" },
  66: { label: "Pluie verglaçante faible", icon: "pluie" },
  67: { label: "Pluie verglaçante forte", icon: "pluie" },
  71: { label: "Neige faible", icon: "neige" },
  73: { label: "Neige modérée", icon: "neige" },
  75: { label: "Neige forte", icon: "neige" },
  77: { label: "Grains de neige", icon: "neige" },
  80: { label: "Averses de pluie faibles", icon: "pluie" },
  81: { label: "Averses de pluie modérées", icon: "pluie" },
  82: { label: "Averses de pluie violentes", icon: "pluie" },
  85: { label: "Averses de neige faibles", icon: "neige" },
  86: { label: "Averses de neige fortes", icon: "neige" },
  95: { label: "Orage", icon: "pluie" },
  96: { label: "Orage avec grêle légère", icon: "pluie" },
  99: { label: "Orage avec grêle forte", icon: "pluie" },
};

/** Valeur renvoyée pour un code absent de la table. */
export const UNKNOWN_CONDITION: ConditionInfo = {
  label: "Conditions inconnues",
  icon: "nuage",
};

/** De nuit, le soleil des icônes devient une lune. */
const ICONES_DE_NUIT: Partial<Record<IconName, IconName>> = {
  soleil: "lune",
  "nuage-soleil": "nuage-lune",
};

/**
 * Condition d'un code WMO. `isDay` à false (heures de nuit) remplace le
 * soleil par une lune : « Ciel dégagé » à 22 h affiche une lune. Les jours
 * (prévisions sur 7 jours) gardent l'icône de jour.
 */
export function getWeatherCondition(code: number, isDay = true): WeatherCondition {
  const info = WMO_CONDITIONS[code] ?? UNKNOWN_CONDITION;
  const icon = isDay ? info.icon : (ICONES_DE_NUIT[info.icon] ?? info.icon);
  return { code, ...info, icon };
}
