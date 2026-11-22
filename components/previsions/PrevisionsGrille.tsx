import type { ReactNode } from "react";

type PrevisionsGrilleProps = {
  actuelle: ReactNode;
  resume: ReactNode;
  details: ReactNode;
  heures: ReactNode;
  jours: ReactNode;
  /** Desktop seulement : la maquette mobile n'a pas de bloc Conseils. */
  conseils: ReactNode;
};

/*
 * Disposition des blocs de la page Prévisions (maquettes 6:142 et 8:431).
 *
 * Desktop (1200 px) : rangées espacées de 40 px, colonnes de 24 px.
 *   1. Météo actuelle et Résumé IA à gauche, Détails à droite (2 × 588 px)
 *   2. Heure par heure, pleine largeur
 *   3. 7 prochains jours (776 px) et Conseils (400 px)
 *
 * Mobile : une colonne, blocs espacés de 24 px, dans l'ordre Météo actuelle,
 * Résumé IA, Heure par heure, Détails, 7 jours. Les conteneurs desktop sont en
 * `display: contents` sous md : leurs enfants deviennent des éléments de la
 * colonne et `order` les replace dans l'ordre mobile.
 */
export default function PrevisionsGrille({
  actuelle,
  resume,
  details,
  heures,
  jours,
  conseils,
}: PrevisionsGrilleProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="contents md:grid md:grid-cols-2 md:items-start md:gap-6">
        <div className="contents md:flex md:flex-col md:gap-6">
          <div className="order-1 md:order-none">{actuelle}</div>
          <div className="order-2 md:order-none">{resume}</div>
        </div>
        <div className="order-4 md:order-none">{details}</div>
      </div>
      <div className="order-3 md:order-none">{heures}</div>
      <div className="contents md:grid md:grid-cols-[776fr_400fr] md:items-start md:gap-6">
        <div className="order-5 md:order-none">{jours}</div>
        <div className="hidden md:block">{conseils}</div>
      </div>
    </div>
  );
}
