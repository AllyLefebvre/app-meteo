import type { ReactNode } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import PageBackground from "@/components/layout/PageBackground";
import BarreOutils from "@/components/previsions/BarreOutils";

type PrevisionsCadreProps = {
  /** Lieu et date de l'en-tête mobile. */
  lieu: string;
  date: string;
  /**
   * Ville affichée, montrée dans la recherche desktop. Absente pendant le
   * chargement : la recherche affiche alors « Rechercher une ville… ».
   */
  ville?: string;
  children: ReactNode;
};

/**
 * Cadre de la page Prévisions, commun à la page, au chargement et à l'erreur.
 * Desktop : l'en-tête du site (posé par-dessus) occupe les 90 premiers px, la
 * barre d'outils commence à 130 px, puis le contenu 40 px plus bas.
 * Mobile : en-tête mobile, puis le contenu 24 px plus bas, à 20 px des bords.
 */
export default function PrevisionsCadre({ lieu, date, ville, children }: PrevisionsCadreProps) {
  return (
    <PageBackground variant="previsions">
      <MobileHeader variant="previsions" lieu={lieu} date={date} />
      <main className="mx-auto w-full max-w-[1248px] px-5 pt-6 pb-10 text-encre md:px-6 md:pt-[130px] md:pb-16">
        <BarreOutils ville={ville} />
        <div className="md:mt-10">{children}</div>
      </main>
    </PageBackground>
  );
}
