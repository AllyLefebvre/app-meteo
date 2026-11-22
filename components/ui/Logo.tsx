import Image from "next/image";

type LogoTaille = "desktop" | "mobile";

type LogoProps = {
  /** desktop : repère 48 px et nom en 24 px · mobile : repère 40 px et nom en 20 px. */
  taille?: LogoTaille;
  /** Affiche le nom « Whimcast » à côté du repère. */
  avecNom?: boolean;
  className?: string;
};

/**
 * `nom` place le mot sous le bout du nuage : il recule sur la marge droite de
 * l'image (le nuage dépasse le repère) et descend un peu, en gardant environ
 * 8 px avec le repère.
 */
const TAILLES: Record<LogoTaille, { repere: number; texte: string; nom: string }> = {
  desktop: { repere: 48, texte: "text-2xl", nom: "-ml-1.5 translate-y-[5px]" },
  mobile: { repere: 40, texte: "text-xl", nom: "-ml-[5px] translate-y-1" },
};

/**
 * Logo Whimcast : repère (ville sous un ciel en dégradé, avec le nuage) suivi du
 * nom. La déclinaison repere-nuage combine le grand repère du favicon, qui garde
 * le dégradé lisible dans l’en-tête, et le nuage du logo complet.
 * Les autres déclinaisons (tuile, logo clair ou sombre, icônes d’appli, favicons)
 * sont dans public/brand.
 */
export default function Logo({
  taille = "desktop",
  avecNom = true,
  className = "",
}: LogoProps) {
  const { repere, texte, nom } = TAILLES[taille];

  return (
    <span className={`inline-flex items-center ${className}`.trim()}>
      <Image
        src="/brand/whimcast-repere-nuage.svg"
        alt={avecNom ? "" : "Whimcast"}
        width={repere}
        height={repere}
        preload
      />
      {avecNom && (
        <span className={`${texte} ${nom} font-bold text-encre`}>Whimcast</span>
      )}
    </span>
  );
}
