"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { TEXTES_MA_POSITION, useMaPosition } from "@/components/ui/useMaPosition";

type BoutonMaPositionProps = {
  /**
   * - lien : lien texte sous la barre de recherche de l'accueil (taille large)
   * - rond : bouton rond de l'en-tête mobile de l'accueil
   */
  apparence: "lien" | "rond";
};

/** Icône qui tourne pendant le chargement, immobile si l'utilisateur réduit les animations. */
const ROTATION = "animate-spin motion-reduce:animate-none";

/**
 * « Utiliser ma position » : ouvre la page Prévisions de l'endroit où se trouve
 * l'utilisateur. `type="button"` : ne soumet jamais le formulaire de recherche.
 *
 * Refus ou échec : message près du bouton, annoncé par les lecteurs d'écran ;
 * la recherche de ville reste utilisable. Les états de chargement et d'erreur
 * ne sont pas maquettés (WMC-36) : présentation provisoire, avec les tokens.
 */
export default function BoutonMaPosition({ apparence }: BoutonMaPositionProps) {
  const { enCours, message, demander } = useMaPosition();
  const libelle = enCours ? TEXTES_MA_POSITION.enCours : TEXTES_MA_POSITION.action;

  if (apparence === "rond") {
    return (
      <div className="relative">
        <Button
          icon={enCours ? "chargement" : "position"}
          label={libelle}
          onClick={demander}
          disabled={enCours}
          aria-busy={enCours}
          className={enCours ? "[&_svg]:animate-spin motion-reduce:[&_svg]:animate-none" : ""}
        />
        {/* Sous l'en-tête, aligné à droite sur la largeur du contenu (20 px des bords). */}
        <p
          role="status"
          className={
            message
              ? "absolute top-full right-0 z-10 mt-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-verre-bordure bg-verre-fort px-4 py-3 text-sm font-medium text-encre shadow-verre backdrop-blur-verre"
              : "sr-only"
          }
        >
          {message}
        </p>
      </div>
    );
  }

  return (
    // Le message s'affiche sous le lien, sans déplacer celui de la recherche.
    <div className="ml-auto flex max-w-full shrink-0 flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={demander}
        disabled={enCours}
        aria-busy={enCours}
        className="flex items-center gap-1.5 rounded-lg text-sm text-encre-douce transition-colors hover:text-encre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre disabled:cursor-wait disabled:hover:text-encre-douce"
      >
        <Icon
          name={enCours ? "chargement" : "position"}
          size={16}
          className={enCours ? ROTATION : undefined}
        />
        {libelle}
      </button>
      <p role="status" className="max-w-64 text-right text-sm font-medium text-encre">
        {message}
      </p>
    </div>
  );
}
