import { getDateParts, isSameDay, isSameHour, type DateInput } from "./date-parts";
import { getLocaleData, type FormatLocale } from "./locales";

/*
 * Formats de date et d'heure de la maquette.
 *
 * Chaque fonction reçoit la langue et le fuseau de la ville consultée :
 * l'heure affichée est celle de la ville, pas celle de l'utilisateur.
 */

export type DateFormatOptions = {
  locale: FormatLocale;
  /** Fuseau IANA de la ville, ex. « America/Toronto ». */
  timeZone: string;
};

export type RelativeFormatOptions = DateFormatOptions & {
  /**
   * Instant de référence pour « Aujourd'hui » et « Maint. » (maintenant par
   * défaut). Passer la même valeur au rendu serveur et client pour éviter un
   * écart d'hydratation.
   */
  now?: Date;
};

/** fr-CA : « 14 h 55 », ou « 16 h » à l'heure pile. */
export function formatTime(input: DateInput, { locale, timeZone }: DateFormatOptions): string {
  return getLocaleData(locale).time(getDateParts(input, timeZone));
}

/**
 * Libellé d'une colonne « Heure par heure ». fr-CA : « Maint. » pour l'heure
 * en cours dans la ville, sinon « 16 h ».
 */
export function formatHourLabel(
  input: DateInput,
  { locale, timeZone, now = new Date() }: RelativeFormatOptions,
): string {
  const data = getLocaleData(locale);
  const parts = getDateParts(input, timeZone);
  return isSameHour(parts, getDateParts(now, timeZone)) ? data.now : data.time(parts);
}

/** fr-CA : « Samedi 7 novembre · 14 h 55 » */
export function formatLongDateTime(
  input: DateInput,
  { locale, timeZone }: DateFormatOptions,
): string {
  const data = getLocaleData(locale);
  const parts = getDateParts(input, timeZone);
  return `${data.longDate(parts)}${data.dateTimeSeparator}${data.time(parts)}`;
}

/** fr-CA : « Sam. 7 nov. · 14 h 55 » */
export function formatShortDateTime(
  input: DateInput,
  { locale, timeZone }: DateFormatOptions,
): string {
  const data = getLocaleData(locale);
  const parts = getDateParts(input, timeZone);
  return `${data.shortDate(parts)}${data.dateTimeSeparator}${data.time(parts)}`;
}

/** fr-CA : « Aujourd'hui » pour le jour en cours dans la ville, sinon « Dimanche ». */
export function formatDayName(
  input: DateInput,
  { locale, timeZone, now = new Date() }: RelativeFormatOptions,
): string {
  const data = getLocaleData(locale);
  const parts = getDateParts(input, timeZone);
  return isSameDay(parts, getDateParts(now, timeZone)) ? data.today : data.days[parts.weekday];
}

/** fr-CA : « Auj. » pour le jour en cours dans la ville, sinon « Dim. ». */
export function formatDayNameShort(
  input: DateInput,
  { locale, timeZone, now = new Date() }: RelativeFormatOptions,
): string {
  const data = getLocaleData(locale);
  const parts = getDateParts(input, timeZone);
  return isSameDay(parts, getDateParts(now, timeZone))
    ? data.todayShort
    : data.daysShort[parts.weekday];
}
