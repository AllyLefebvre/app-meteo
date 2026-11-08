import PageBackground from "@/components/layout/PageBackground";
import SearchInput from "@/components/ui/SearchInput";

export default function Home() {
  return (
    <PageBackground variant="accueil">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 font-sans">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-purple-950 text-center">
          Bienvenue sur WeatherMind
        </h1>
        <h3 className="text-xl md:text-3xl font-medium text-purple-950">
          Planifiez votre journée avec une météo nouvelle génération!
        </h3>
        <SearchInput />
      </div>
    </PageBackground>
  );
}
