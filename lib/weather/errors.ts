export type WeatherErrorCode =
  /** Latitude ou longitude absente ou hors limites. */
  | "INVALID_COORDINATES"
  /** Le fournisseur n'a pas pu être joint (réseau, délai dépassé). */
  | "NETWORK"
  /** Le fournisseur a répondu avec un statut HTTP d'erreur. */
  | "PROVIDER"
  /** La réponse du fournisseur n'a pas le format attendu. */
  | "INVALID_RESPONSE";

/** Erreur typée levée par le client météo. */
export class WeatherError extends Error {
  readonly code: WeatherErrorCode;
  /** Statut HTTP renvoyé par le fournisseur, pour le code PROVIDER. */
  readonly status?: number;

  constructor(
    code: WeatherErrorCode,
    message: string,
    options?: { status?: number; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "WeatherError";
    this.code = code;
    this.status = options?.status;
  }
}

export function isWeatherError(error: unknown): error is WeatherError {
  return error instanceof WeatherError;
}
