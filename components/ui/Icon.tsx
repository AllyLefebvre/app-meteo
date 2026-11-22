import {
  ArrowLeft,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplet,
  Eye,
  Gauge,
  LoaderCircle,
  MapPin,
  Search,
  Sparkle,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * Correspondance entre les 16 icônes de la maquette Figma (page « Composants »)
 * et leur équivalent lucide-react, plus `chargement` (indicateur d'attente,
 * à faire tourner avec `animate-spin`).
 */
const ICONS = {
  recherche: Search,
  position: MapPin,
  etincelles: Sparkle,
  soleil: Sun,
  nuage: Cloud,
  "nuage-soleil": CloudSun,
  pluie: CloudRain,
  neige: CloudSnow,
  vent: Wind,
  goutte: Droplet,
  thermometre: Thermometer,
  oeil: Eye,
  "lever-soleil": Sunrise,
  "coucher-soleil": Sunset,
  pression: Gauge,
  retour: ArrowLeft,
  chargement: LoaderCircle,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

type IconProps = Omit<LucideProps, "ref" | "absoluteStrokeWidth"> & {
  /** Nom de l'icône ; un nom inconnu est refusé par TypeScript. */
  name: IconName;
  /** Côté de l'icône en pixels (12 à 132 dans la maquette). */
  size?: number;
  /** Épaisseur du trait en pixels, constante quelle que soit la taille (2 dans la maquette). */
  strokeWidth?: number;
  /** Libellé lu par les lecteurs d'écran. Sans libellé, l'icône est décorative et masquée. */
  label?: string;
};

export default function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  label,
  ...props
}: IconProps) {
  const LucideIcon = ICONS[name];
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true as const, focusable: "false" as const };

  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      {...a11y}
      {...props}
    />
  );
}
