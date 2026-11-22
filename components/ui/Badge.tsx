import type { ReactNode } from "react";

import Icon, { type IconName } from "@/components/ui/Icon";

type BadgeProps = {
  children: ReactNode;
  /** Icône décorative placée avant le texte. */
  icon?: IconName;
  className?: string;
};

/**
 * Pastille en verre de la maquette (ex. « Prévisions expliquées par IA » du hero).
 * Mobile : 12 px, icône 12 px. Desktop : 13 px, icône 14 px.
 */
export default function Badge({ children, icon, className = "" }: BadgeProps) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full border border-verre-bordure bg-verre px-3 py-1.5 text-xs font-medium text-encre shadow-verre backdrop-blur-verre md:gap-2 md:px-3.5 md:text-[13px] ${className}`.trim()}
    >
      {icon && <Icon name={icon} size={14} className="size-3 shrink-0 md:size-3.5" />}
      {children}
    </p>
  );
}
