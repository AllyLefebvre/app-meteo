/*
 * Position de l'utilisateur, demandée au navigateur (« Utiliser ma position »).
 *
 * Vie privée : la position ne sert qu'à construire l'URL de la page Prévisions
 * (arrondie à 4 décimales par lienPrevisions, environ 10 m). Elle n'est ni
 * conservée ni envoyée ailleurs par ce module.
 *
 * Déploiement (WMC-39) : la géolocalisation n'est permise que dans un contexte
 * sécurisé (HTTPS ; http://localhost est toléré en développement).
 */

export type Coordonnees = { latitude: number; longitude: number };

/**
 * - refus : l'utilisateur ou le navigateur a refusé l'accès à la position
 * - indisponible : la position n'a pas pu être déterminée
 * - delai : la position n'est pas arrivée à temps
 * - incompatible : navigateur sans géolocalisation, ou page hors HTTPS
 */
export type RaisonGeolocalisation = "refus" | "indisponible" | "delai" | "incompatible";

export class ErreurGeolocalisation extends Error {
  constructor(readonly raison: RaisonGeolocalisation) {
    super(`Géolocalisation : ${raison}`);
    this.name = "ErreurGeolocalisation";
  }
}

const OPTIONS: PositionOptions = {
  // Précision de quartier suffisante pour la météo : plus rapide et moins énergivore.
  enableHighAccuracy: false,
  timeout: 10_000,
  // Une position de moins de 5 minutes est encore bonne pour la météo.
  maximumAge: 5 * 60_000,
};

/** Codes de GeolocationPositionError (1, 2, 3), voir la spécification. */
const RAISONS: Record<number, RaisonGeolocalisation> = {
  1: "refus",
  2: "indisponible",
  3: "delai",
};

/** Demande la position actuelle. Rejette avec une ErreurGeolocalisation. */
export function obtenirPosition(): Promise<Coordonnees> {
  return new Promise((resolve, reject) => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator) ||
      // Hors HTTPS, le navigateur refuse sans rien demander : ce n'est pas un refus de l'utilisateur.
      (typeof window !== "undefined" && window.isSecureContext === false)
    ) {
      reject(new ErreurGeolocalisation("incompatible"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (erreur) => reject(new ErreurGeolocalisation(RAISONS[erreur.code] ?? "indisponible")),
      OPTIONS,
    );
  });
}
