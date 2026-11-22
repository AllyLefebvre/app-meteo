import Link, { type LinkProps } from "next/link";
import Icon, { type IconName } from "@/components/ui/Icon";
import { BASE, VARIANTS, type ButtonVariant } from "@/components/ui/Button";

type ButtonLinkProps = LinkProps & {
  /** Même apparence que Button : icone (44 × 44) ou icone-sombre (48 × 48). */
  variant?: ButtonVariant;
  icon: IconName;
  /** Libellé accessible, obligatoire : le lien n'a pas de texte visible. */
  label: string;
  className?: string;
};

/**
 * Lien qui a l'apparence d'un bouton icône (ex. retour à l'accueil).
 * À utiliser plutôt que Button quand l'action est une navigation.
 */
export default function ButtonLink({
  variant = "icone",
  icon,
  label,
  className = "",
  ...props
}: ButtonLinkProps) {
  const { classes, iconSize } = VARIANTS[variant];

  return (
    <Link
      aria-label={label}
      title={label}
      className={`${BASE} ${classes} ${className}`.trim()}
      {...props}
    >
      <Icon name={icon} size={iconSize} />
    </Link>
  );
}
