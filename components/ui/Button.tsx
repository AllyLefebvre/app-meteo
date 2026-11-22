import type { ButtonHTMLAttributes } from "react";
import Icon, { type IconName } from "@/components/ui/Icon";

export type ButtonVariant = "icone" | "icone-sombre";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  /**
   * - icone : bouton rond en verre de 44 × 44 (en-têtes mobiles : retour, position, recherche)
   * - icone-sombre : bouton encre de 48 × 48 (bouton de la barre de recherche)
   */
  variant?: ButtonVariant;
  /** Icône affichée dans le bouton. */
  icon: IconName;
  /** Libellé accessible, obligatoire : le bouton n'a pas de texte visible. */
  label: string;
};

export const BASE =
  "inline-flex shrink-0 items-center justify-center transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const VARIANTS: Record<ButtonVariant, { classes: string; iconSize: number }> = {
  icone: {
    classes:
      "size-11 rounded-full border border-verre-bordure bg-verre-fort text-encre " +
      "shadow-verre backdrop-blur-verre hover:bg-verre-survol",
    iconSize: 20,
  },
  "icone-sombre": {
    classes: "size-12 rounded-2xl bg-encre text-sur-encre hover:bg-encre/85",
    iconSize: 22,
  },
};

export default function Button({
  variant = "icone",
  icon,
  label,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const { classes, iconSize } = VARIANTS[variant];

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`${BASE} ${classes} ${className}`.trim()}
      {...props}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
