import SearchInput from "@/components/ui/SearchInput";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans bg-gradient-to-br from-purple-500 via-fuchsia-250 to-orange-200 gap-6 px-4 py-8">
      <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-purple-950 text-center">
        Bienvenue sur WeatherMind
      </h1>
      <h3 className="text-xl md:text-3xl font-medium text-purple-950">
        Planifiez votre journée avec une météo nouvelle génération!
      </h3>
      <SearchInput />
    </div>
  );
}
