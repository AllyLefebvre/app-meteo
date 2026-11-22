import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BlocAVenir from "@/components/previsions/BlocAVenir";
import EtatErreur from "@/components/previsions/EtatErreur";
import MeteoActuelleProvisoire from "@/components/previsions/MeteoActuelleProvisoire";
import PrevisionsCadre from "@/components/previsions/PrevisionsCadre";
import PrevisionsGrille from "@/components/previsions/PrevisionsGrille";
import { formatShortDateTime } from "@/lib/format";
import { lirePrevisionsParams } from "@/lib/previsions";
import { getWeather, isWeatherError, type WeatherData } from "@/lib/weather";

type PrevisionsProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PrevisionsProps): Promise<Metadata> {
  const lieu = lirePrevisionsParams(await searchParams);
  return { title: lieu ? `${lieu.nom} · Prévisions · Whimcast` : "Prévisions · Whimcast" };
}

/** Charge la météo ; null si le service est indisponible (erreur prévue). */
async function chargerMeteo(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    return await getWeather({ latitude, longitude });
  } catch (error) {
    if (isWeatherError(error)) {
      console.error(`[previsions] ${error.code}`, error.message, error.cause ?? "");
      return null;
    }
    // Erreur inattendue : affichée par app/previsions/error.tsx.
    throw error;
  }
}

/**
 * Page Prévisions : /previsions?lat=45.5088&lon=-73.5878&nom=Montréal%2C+QC
 * (format décrit dans lib/previsions.ts).
 */
export default async function Previsions({ searchParams }: PrevisionsProps) {
  const lieu = lirePrevisionsParams(await searchParams);
  // Coordonnées absentes ou invalides : retour à l'accueil pour choisir une ville.
  if (!lieu) redirect("/");

  const meteo = await chargerMeteo(lieu.latitude, lieu.longitude);

  if (!meteo) {
    return (
      <PrevisionsCadre lieu={lieu.nom} date="" ville={lieu.nom}>
        <EtatErreur />
      </PrevisionsCadre>
    );
  }

  const date = formatShortDateTime(meteo.current.time, {
    locale: "fr-CA",
    timeZone: meteo.location.timezone,
  });

  return (
    <PrevisionsCadre lieu={lieu.nom} date={date} ville={lieu.nom}>
      <h1 className="sr-only">Prévisions pour {lieu.nom}</h1>
      <PrevisionsGrille
        actuelle={<MeteoActuelleProvisoire nom={lieu.nom} meteo={meteo} />}
        resume={
          <BlocAVenir
            titre="Résumé IA"
            variant="sombre"
            hauteur="min-h-[132px] md:min-h-[167px]"
          />
        }
        details={
          <BlocAVenir titre="Détails du moment" hauteur="min-h-[287px] md:min-h-[473px]" />
        }
        heures={<BlocAVenir titre="Heure par heure" hauteur="min-h-[184px] md:min-h-[191px]" />}
        jours={
          <BlocAVenir
            titre="7 prochains jours"
            variant="verre-fort"
            hauteur="min-h-[393px] md:min-h-[440px]"
          />
        }
        conseils={
          <BlocAVenir
            titre="Conseils Whimcast"
            variant="verre-fort"
            hauteur="md:min-h-[440px]"
          />
        }
      />
    </PrevisionsCadre>
  );
}
