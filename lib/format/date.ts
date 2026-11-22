import {
  getDateParts,
  isSameDay,
  isSameHour,
  type DateInput,
  type DateParts,
} from "./date-parts";

/*
 * Formats de date et d'heure de la maquette, en français du Québec.
 *
 * Chaque fonction reçoit le fuseau de la ville consultée : l'heure affichée
 * est celle de la ville, pas celle de l'utilisateur. Les noms de jours et de
 * mois sont écrits ici plutôt que tirés d'Intl, dont la casse et les
 * abréviations varient selon le navigateur (et causeraient des écarts
 * d'hydratation entre le serveur et le client).
 *
 * Les espaces à l'intérieur d'une heure (« 14 h 55 ») sont insécables, pour
 * que l'heure ne soit jamais coupée en fin de ligne.
 */

/** Espace insécable. */
export const NBSP = " ";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAYS_SHORT = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const MONTHS_SHORT = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

export const TODAY = "Aujourd'hui";
export const TODAY_SHORT = "Auj.";
export const NOW_SHORT = "Maint.";

function timeOf({ hour, minute }: DateParts): string {
  return minute === 0
    ? `${hour}${NBSP}h`
    : `${hour}${NBSP}h${NBSP}${String(minute).padStart(2, "0")}`;
}

/** « 14 h 55 », ou « 16 h » à l'heure pile. */
export function formatTime(input: DateInput, timeZone: string): string {
  return timeOf(getDateParts(input, timeZone));
}

/**
 * Libellé d'une colonne « Heure par heure » : « Maint. » pour l'heure en
 * cours dans la ville, sinon « 16 h ».
 */
export function formatHourLabel(
  input: DateInput,
  timeZone: string,
  now: Date = new Date(),
): string {
  const parts = getDateParts(input, timeZone);
  return isSameHour(parts, getDateParts(now, timeZone)) ? NOW_SHORT : timeOf(parts);
}

/** « Samedi 7 novembre · 14 h 55 » */
export function formatLongDateTime(input: DateInput, timeZone: string): string {
  const parts = getDateParts(input, timeZone);
  return `${DAYS[parts.weekday]} ${parts.day} ${MONTHS[parts.month - 1]} · ${timeOf(parts)}`;
}

/** « Sam. 7 nov. · 14 h 55 » */
export function formatShortDateTime(input: DateInput, timeZone: string): string {
  const parts = getDateParts(input, timeZone);
  return `${DAYS_SHORT[parts.weekday]} ${parts.day} ${MONTHS_SHORT[parts.month - 1]} · ${timeOf(parts)}`;
}

/** « Aujourd'hui » pour le jour en cours dans la ville, sinon « Dimanche ». */
export function formatDayName(
  input: DateInput,
  timeZone: string,
  now: Date = new Date(),
): string {
  const parts = getDateParts(input, timeZone);
  return isSameDay(parts, getDateParts(now, timeZone)) ? TODAY : DAYS[parts.weekday];
}

/** « Auj. » pour le jour en cours dans la ville, sinon « Dim. ». */
export function formatDayNameShort(
  input: DateInput,
  timeZone: string,
  now: Date = new Date(),
): string {
  const parts = getDateParts(input, timeZone);
  return isSameDay(parts, getDateParts(now, timeZone))
    ? TODAY_SHORT
    : DAYS_SHORT[parts.weekday];
}
