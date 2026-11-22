import Link from "next/link";
import Icon from "@/components/ui/Icon";
import SearchInput from "@/components/ui/SearchInput";

type BarreOutilsProps = {
  /** Ville affichée, montrée dans la recherche (ex. « Montréal, QC »). */
  ville?: string;
};

/**
 * Barre d'outils desktop de la page Prévisions (maquette 6:160) : retour à
 * l'accueil à gauche, recherche (420 px) à droite. En mobile, l'en-tête
 * mobile porte déjà ces deux actions.
 */
export default function BarreOutils({ ville }: BarreOutilsProps) {
  return (
    <div className="hidden min-h-[74px] items-center justify-between gap-6 md:flex">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg text-[15px] font-medium text-encre-douce transition-colors hover:text-encre focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-encre"
      >
        <Icon name="retour" size={18} />
        Retour à l&apos;accueil
      </Link>
      <div className="w-[420px]">
        <SearchInput taille="compacte" placeholder={ville} />
      </div>
    </div>
  );
}
