import type { HTMLAttributes } from "react";

export type CardVariant = "verre" | "verre-fort" | "sombre";
export type CardArrondi = "puce" | "carte" | "bloc";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * - verre : cartes stat, cartes ville, 7 prochains jours
   * - verre-fort : Météo actuelle, Conseils, puce horaire active
   * - sombre : Résumé IA
   */
  variant?: CardVariant;
  /** puce : 20 px · carte : 24 px · bloc : 28 px en mobile, 32 px en desktop. */
  arrondi?: CardArrondi;
  /** Ajoute le contour de focus clavier pour une carte cliquable (ex. carte ville). */
  interactive?: boolean;
};

const VERRE_BASE =
  "border border-verre-bordure shadow-verre backdrop-blur-verre text-encre";

const VARIANTS: Record<CardVariant, string> = {
  verre: `${VERRE_BASE} bg-verre`,
  "verre-fort": `${VERRE_BASE} bg-verre-fort`,
  sombre: "bg-encre text-sur-encre",
};

const ARRONDIS: Record<CardArrondi, string> = {
  puce: "rounded-puce",
  carte: "rounded-carte",
  bloc: "rounded-bloc md:rounded-bloc-large",
};

// Au survol, le fond ne change pas pour garder le dégradé visible au travers du verre.
const SURVOL_BASE =
  "transition duration-200 hover:shadow-verre-survol hover:-translate-y-0.5 motion-reduce:hover:translate-y-0";

const SURVOL: Record<CardVariant, string> = {
  verre: `${SURVOL_BASE} hover:border-verre-bordure-survol`,
  "verre-fort": `${SURVOL_BASE} hover:border-verre-bordure-survol`,
  sombre: SURVOL_BASE,
};

const FOCUS =
  "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-encre";

export default function Card({
  variant = "verre",
  arrondi = "carte",
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const classes = [
    VARIANTS[variant],
    ARRONDIS[arrondi],
    SURVOL[variant],
    interactive && FOCUS,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
