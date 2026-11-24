import MobileHeader from "@/components/layout/MobileHeader";
import PageBackground from "@/components/layout/PageBackground";
import Badge from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import VillesPopulaires from "@/components/accueil/VillesPopulaires";

/*
 * Hero de l'accueil (maquette : desktop 6:48, mobile 8:359).
 * Mobile : aligné en haut sous l'en-tête, 20 px des bords, 16 px entre les éléments.
 * Desktop : centré verticalement sur l'écran, 24 px entre les éléments.
 * L'en-tête desktop est posé par-dessus la page (40 px du haut, 50 px de
 * haut) : 130 px sont réservés en haut, et autant en bas pour garder le hero
 * centré sur l'écran. Sur un écran peu haut, il ne remonte donc plus sous
 * l'en-tête : la page défile.
 */
export default function Home() {
  return (
    <PageBackground variant="accueil">
      <MobileHeader variant="accueil" />
      <section className="flex flex-1 flex-col items-center gap-4 px-5 pt-6 pb-8 font-sans md:justify-center md:gap-6 md:px-4 md:py-[130px]">
        <Badge icon="etincelles">Prévisions expliquées par IA</Badge>
        <h1 className="text-titre md:text-titre-large text-encre text-center">
          Bienvenue sur Whimcast
        </h1>
        <p className="text-sous-titre md:text-sous-titre-large text-encre text-center">
          Planifiez votre journée avec une météo nouvelle génération!
        </p>
        <div className="w-full pt-2 md:pt-4">
          <SearchInput />
        </div>
        {/* Villes populaires (maquette : section 6:71, 32 px sous la recherche). */}
        <div className="w-full pt-4 md:pt-8">
          <VillesPopulaires />
        </div>
      </section>
    </PageBackground>
  );
}
