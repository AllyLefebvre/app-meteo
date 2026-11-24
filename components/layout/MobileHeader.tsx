import BoutonMaPosition from "@/components/ui/BoutonMaPosition";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import Logo from "@/components/ui/Logo";

type MobileHeaderProps =
  | { variant: "accueil" }
  | {
      variant: "previsions";
      /** Ex. « Montréal, QC ». */
      lieu: string;
      /** Date et heure déjà formatées, ex. « Sam. 7 nov. · 14 h 55 ». */
      date: string;
    };

/** Maquettes 390 px : 20 px des bords, 56 px du haut, 44 px de haut. */
const CONTENEUR = "px-5 pt-14 md:hidden";

/**
 * En-têtes mobiles (sous le point de rupture md, où le menu de l'en-tête desktop disparaît).
 * Chaque page affiche le sien en haut de son contenu.
 */
export default function MobileHeader(props: MobileHeaderProps) {
  if (props.variant === "accueil") {
    return (
      <header className={CONTENEUR}>
        <div className="flex h-11 items-center justify-between">
          <Logo taille="mobile" />
          {/* Message de refus ou d'échec affiché sous l'en-tête. */}
          <BoutonMaPosition apparence="rond" />
        </div>
      </header>
    );
  }

  return (
    <header className={CONTENEUR}>
      {/* Colonnes latérales de même largeur : le lieu reste centré sur l'écran. */}
      <div className="grid h-11 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3">
        <ButtonLink href="/" icon="retour" label="Retour à l'accueil" />
        <div className="flex min-w-0 flex-col items-center gap-0.5 text-center">
          <p className="w-full truncate text-[17px] font-semibold text-encre">{props.lieu}</p>
          <p className="w-full truncate text-xs text-encre-douce">{props.date}</p>
        </div>
        {/* Action branchée avec la recherche de ville. */}
        <Button icon="recherche" label="Rechercher une ville" />
      </div>
    </header>
  );
}
