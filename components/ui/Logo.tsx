import Image from "next/image";

type LogoTaille = "desktop" | "mobile";

type LogoProps = {
  /** desktop : tuile 36 px et nom en 20 px · mobile : tuile 32 px et nom en 18 px (maquettes). */
  taille?: LogoTaille;
  /** Affiche le nom « Whimcast » à côté de la tuile. */
  avecNom?: boolean;
  className?: string;
};

const TAILLES: Record<LogoTaille, { tuile: number; texte: string }> = {
  desktop: { tuile: 36, texte: "text-xl" },
  mobile: { tuile: 32, texte: "text-lg" },
};

/**
 * Logo Whimcast : tuile (repère, ville et nuage sur fond encre) suivie du nom.
 * Les autres déclinaisons (logo clair ou sombre sans fond, icônes d'appli, favicons)
 * sont dans public/brand.
 */
export default function Logo({
  taille = "desktop",
  avecNom = true,
  className = "",
}: LogoProps) {
  const { tuile, texte } = TAILLES[taille];

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <Image
        src="/brand/whimcast-tuile-site.svg"
        alt={avecNom ? "" : "Whimcast"}
        width={tuile}
        height={tuile}
        preload
      />
      {avecNom && <span className={`${texte} font-bold text-encre`}>Whimcast</span>}
    </span>
  );
}
