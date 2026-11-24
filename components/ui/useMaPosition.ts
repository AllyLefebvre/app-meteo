"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ErreurGeolocalisation,
  obtenirPosition,
  type RaisonGeolocalisation,
} from "@/lib/geolocalisation";
import { lienPrevisions } from "@/lib/previsions";

/**
 * Textes de « Utiliser ma position », regroupés pour la traduction (WMC-50).
 * Messages d'erreur provisoires, en attendant la maquette des états (WMC-36).
 */
export const TEXTES_MA_POSITION = {
  action: "Utiliser ma position",
  enCours: "Localisation…",
  /*
   * Nom affiché sur la page Prévisions. Aucun géocodage inverse n'est
   * disponible pour trouver la ville ; « Ma position » se lit mieux que des
   * coordonnées. Limite : un lien partagé affichera aussi « Ma position ».
   */
  nomLieu: "Ma position",
  erreurs: {
    refus: "Autorisez l'accès à votre position dans le navigateur, ou cherchez une ville.",
    indisponible: "Votre position n'a pas pu être trouvée. Réessayez ou cherchez une ville.",
    delai: "Votre position n'a pas pu être trouvée. Réessayez ou cherchez une ville.",
    incompatible: "Votre navigateur ne permet pas la géolocalisation. Cherchez une ville.",
  } satisfies Record<RaisonGeolocalisation, string>,
} as const;

type Etat =
  | { type: "repos" }
  | { type: "localisation" }
  | { type: "erreur"; raison: RaisonGeolocalisation };

/**
 * Action « Utiliser ma position » : demande la position au navigateur, puis
 * ouvre la page Prévisions de cet endroit. Partagée par le lien sous la barre
 * de recherche et le bouton de l'en-tête mobile (BoutonMaPosition).
 */
export function useMaPosition() {
  const router = useRouter();
  const [etat, setEtat] = useState<Etat>({ type: "repos" });
  const [navigation, demarrerNavigation] = useTransition();

  // Le chargement reste affiché jusqu'à l'ouverture de la page Prévisions.
  const enCours = etat.type === "localisation" || navigation;
  const message = etat.type === "erreur" ? TEXTES_MA_POSITION.erreurs[etat.raison] : "";

  async function demander() {
    if (enCours) return;

    setEtat({ type: "localisation" });
    try {
      const { latitude, longitude } = await obtenirPosition();
      setEtat({ type: "repos" });
      demarrerNavigation(() => {
        // Seul usage de la position : l'URL de la page Prévisions (arrondie à 4 décimales).
        router.push(lienPrevisions({ latitude, longitude, nom: TEXTES_MA_POSITION.nomLieu }));
      });
    } catch (erreur) {
      const raison = erreur instanceof ErreurGeolocalisation ? erreur.raison : "indisponible";
      if (!(erreur instanceof ErreurGeolocalisation)) console.error("[ma position]", erreur);
      setEtat({ type: "erreur", raison });
    }
  }

  return { enCours, message, demander };
}
