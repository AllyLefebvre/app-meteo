import type { DateParts } from "./date-parts";

/*
 * Données de formatage par langue.
 *
 * Seul fr-CA existe pour l'instant ; en-CA et en-US seront ajoutés par
 * WMC-46 en complétant ce type et la table LOCALES.
 *
 * Les noms de jours et de mois sont écrits ici plutôt que tirés d'Intl, dont
 * la casse et les abréviations varient selon le navigateur (et causeraient
 * des écarts d'hydratation entre le serveur et le client).
 */

export type FormatLocale = "fr-CA";

/** Espace insécable. */
export const NBSP = " ";

export type LocaleData = {
  /** Du dimanche au samedi. */
  days: readonly string[];
  daysShort: readonly string[];
  /** De janvier à décembre. */
  months: readonly string[];
  monthsShort: readonly string[];
  today: string;
  todayShort: string;
  /** Libellé de l'heure en cours dans « Heure par heure ». */
  now: string;
  /** Heure seule : « 14 h 55 », « 16 h ». */
  time: (parts: DateParts) => string;
  /** Date longue sans l'heure : « Samedi 7 novembre ». */
  longDate: (parts: DateParts) => string;
  /** Date courte sans l'heure : « Sam. 7 nov. ». */
  shortDate: (parts: DateParts) => string;
  /** Séparateur entre la date et l'heure. */
  dateTimeSeparator: string;
};

const FR_CA_DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const FR_CA_DAYS_SHORT = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const FR_CA_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const FR_CA_MONTHS_SHORT = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

const frCA: LocaleData = {
  days: FR_CA_DAYS,
  daysShort: FR_CA_DAYS_SHORT,
  months: FR_CA_MONTHS,
  monthsShort: FR_CA_MONTHS_SHORT,
  today: "Aujourd'hui",
  todayShort: "Auj.",
  now: "Maint.",
  // Espaces insécables : l'heure n'est jamais coupée en fin de ligne.
  time: ({ hour, minute }) =>
    minute === 0
      ? `${hour}${NBSP}h`
      : `${hour}${NBSP}h${NBSP}${String(minute).padStart(2, "0")}`,
  longDate: ({ weekday, day, month }) =>
    `${FR_CA_DAYS[weekday]} ${day} ${FR_CA_MONTHS[month - 1]}`,
  shortDate: ({ weekday, day, month }) =>
    `${FR_CA_DAYS_SHORT[weekday]} ${day} ${FR_CA_MONTHS_SHORT[month - 1]}`,
  dateTimeSeparator: " · ",
};

export const LOCALES: Record<FormatLocale, LocaleData> = {
  "fr-CA": frCA,
};

export function getLocaleData(locale: FormatLocale): LocaleData {
  const data = LOCALES[locale];
  if (!data) throw new RangeError(`Langue non prise en charge : « ${locale} ».`);
  return data;
}
