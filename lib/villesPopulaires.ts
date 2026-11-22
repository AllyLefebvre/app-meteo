/*
 * Villes de la section « Villes populaires » de l'accueil.
 *
 * Les coordonnées sont fixées ici : aucun géocodage à chaque chargement.
 *
 * i18n à venir (épopée WMC-44) : la liste dépendra de la langue. Pour
 * l'ajouter, il suffira d'ajouter une entrée à VILLES_PAR_LANGUE, par exemple :
 * - en-CA : Toronto, Vancouver, Montréal, Calgary ;
 * - en-US : New York, Chicago, Los Angeles, Miami (à confirmer).
 * Seul fr-CA existe pour l'instant.
 */

export type VillePopulaire = {
  /** Nom affiché sur la carte, ex. « Montréal ». */
  nom: string;
  /** Nom passé à la page Prévisions, ex. « Montréal, QC ». */
  nomComplet: string;
  latitude: number;
  longitude: number;
};

export type LangueVillesPopulaires = "fr-CA";

const VILLES_PAR_LANGUE: Record<LangueVillesPopulaires, readonly VillePopulaire[]> = {
  "fr-CA": [
    { nom: "Montréal", nomComplet: "Montréal, QC", latitude: 45.5088, longitude: -73.5878 },
    { nom: "Québec", nomComplet: "Québec, QC", latitude: 46.8123, longitude: -71.2145 },
    { nom: "Sherbrooke", nomComplet: "Sherbrooke, QC", latitude: 45.4001, longitude: -71.8991 },
    { nom: "Gatineau", nomComplet: "Gatineau, QC", latitude: 45.4772, longitude: -75.7015 },
  ],
};

/** Villes populaires d'une langue, dans l'ordre d'affichage. */
export function villesPopulaires(
  langue: LangueVillesPopulaires = "fr-CA",
): readonly VillePopulaire[] {
  return VILLES_PAR_LANGUE[langue];
}

/**
 * En mobile, seules les premières villes sont affichées (3 cartes empilées).
 * La ville masquée (la dernière, Gatineau en fr-CA) est à confirmer.
 */
export const NOMBRE_VILLES_MOBILE = 3;
