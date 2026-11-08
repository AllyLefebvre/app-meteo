import PageBackground from "@/components/layout/PageBackground";
import SearchInput from "@/components/ui/SearchInput";

export default function Home() {
  return (
    <PageBackground variant="accueil">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 font-sans">
        <h1 className="text-titre md:text-titre-large text-encre text-center">
          Bienvenue sur WeatherMind
        </h1>
        <h3 className="text-sous-titre md:text-sous-titre-large text-encre text-center">
          Planifiez votre journée avec une météo nouvelle génération!
        </h3>
        <SearchInput />
      </div>
    </PageBackground>
  );
}
