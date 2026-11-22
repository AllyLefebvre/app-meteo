/**
 * Une date à formater :
 * - une chaîne ISO sans fuseau (« 2026-11-21T14:55 », « 2026-11-21 »), comme
 *   celles d'Open-Meteo : elle est déjà dans l'heure locale de la ville et
 *   n'est pas convertie ;
 * - un `Date`, ou une chaîne ISO avec fuseau (« …Z », « …-05:00 ») : c'est un
 *   instant, converti dans le fuseau demandé.
 */
export type DateInput = Date | string;

/** Date et heure telles qu'affichées dans le fuseau de la ville. */
export type DateParts = {
  year: number;
  /** 1 à 12. */
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 = dimanche, 6 = samedi. */
  weekday: number;
};

const LOCAL_ISO = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?)?$/;

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Un formateur par fuseau, réutilisé d'un appel à l'autre. */
const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    // Lève une RangeError si le fuseau n'existe pas.
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

function fromLocalIso(match: RegExpExecArray): DateParts {
  const [, y, mo, d, h = "0", mi = "0"] = match;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  const hour = Number(h);
  const minute = Number(mi);
  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  // Refuse les dates impossibles (« 2026-02-30 », « 25:00 »).
  if (
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day ||
    utc.getUTCHours() !== hour ||
    utc.getUTCMinutes() !== minute
  ) {
    throw new RangeError(`Date invalide : « ${match[0]} ».`);
  }
  return { year, month, day, hour, minute, weekday: utc.getUTCDay() };
}

function fromInstant(date: Date, timeZone: string): DateParts {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Date invalide.");
  }
  const parts: Record<string, string> = {};
  for (const { type, value } of getFormatter(timeZone).formatToParts(date)) {
    parts[type] = value;
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: WEEKDAYS_EN.indexOf(parts.weekday),
  };
}

/** Date et heure de `input` dans le fuseau `timeZone` (IANA, ex. « America/Toronto »). */
export function getDateParts(input: DateInput, timeZone: string): DateParts {
  // Valide le fuseau même quand la chaîne est déjà locale.
  getFormatter(timeZone);
  if (typeof input === "string") {
    const match = LOCAL_ISO.exec(input);
    return match ? fromLocalIso(match) : fromInstant(new Date(input), timeZone);
  }
  return fromInstant(input, timeZone);
}

export function isSameDay(a: DateParts, b: DateParts): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isSameHour(a: DateParts, b: DateParts): boolean {
  return isSameDay(a, b) && a.hour === b.hour;
}
