import Image from "next/image";

type LogoTaille = "desktop" | "mobile";

type LogoProps = {
  /** desktop : image 56 px et nom en 24 px · mobile : image 46 px et nom en 20 px. */
  taille?: LogoTaille;
  /** Affiche le nom « Whimcast » à côté du repère. */
  avecNom?: boolean;
  className?: string;
};

/**
 * Le dessin du logo-clair laisse de la marge autour du repère et du nuage :
 * l'image est donc plus grande que la place qu'elle occupe (`-my-1` retire
 * 4 px en haut et en bas), pour que les en-têtes gardent leur hauteur.
 * `nom` place le mot sous le bout du nuage : il recule sur la marge droite de
 * l'image (le nuage dépasse le repère) et descend un peu, en gardant environ
 * 8 px avec le repère.
 */
const TAILLES: Record<LogoTaille, { repere: number; texte: string; nom: string }> = {
  desktop: { repere: 56, texte: "text-2xl", nom: "-ml-2.5 translate-y-[5px]" },
  mobile: { repere: 46, texte: "text-xl", nom: "-ml-[7px] translate-y-1" },
};

/**
 * Logo Whimcast : repère (ville sous un ciel en dégradé, avec le nuage) suivi du
 * nom. On utilise la déclinaison logo-clair, sans modification.
 * Les autres déclinaisons (tuile, logo sombre, icônes d’appli, favicons)
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
        src="/brand/whimcast-logo-clair.svg"
        alt={avecNom ? "" : "Whimcast"}
        width={repere}
        height={repere}
        className="-my-1"
        preload
      />
      {avecNom && (
        <span className={`${texte} ${nom} font-bold text-encre`}>Whimcast</span>
      )}
    </span>
  );
}
