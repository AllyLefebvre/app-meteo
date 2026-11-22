import { Suspense } from "react";
import CarteVille, { CarteVilleSquelette } from "@/components/accueil/CarteVille";
import { getWeather, isWeatherError, type WeatherData } from "@/lib/weather";
import { NOMBRE_VILLES_MOBILE, villesPopulaires } from "@/lib/villesPopulaires";

/*
 * Section « Villes populaires » de l'accueil (maquette : section 6:71).
 * Desktop : cartes en ligne, 16 px entre elles. Mobile (sous md) : les
 * NOMBRE_VILLES_MOBILE premières cartes, empilées, 12 px entre elles.
 */
const LISTE = "flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-4";

/** Masque en mobile les cartes au-delà de NOMBRE_VILLES_MOBILE. */
function classeElement(index: number): string {
  return index < NOMBRE_VILLES_MOBILE ? "" : "hidden md:block";
}

/** Météo de chaque ville ; null pour une ville qui n'a pas répondu. */
async function chargerMeteos(): Promise<(WeatherData | null)[]> {
  // getWeather met chaque réponse en cache 10 min : au plus 4 appels par période.
  const resultats = await Promise.allSettled(
    villesPopulaires().map(({ latitude, longitude }) => getWeather({ latitude, longitude })),
  );

  return resultats.map((resultat, index) => {
    if (resultat.status === "fulfilled") return resultat.value;
    // Une ville en échec ne casse pas la section : sa carte passe en repli.
    const { reason } = resultat;
    const ville = villesPopulaires()[index].nom;
    if (isWeatherError(reason)) {
      console.error(`[villes-populaires] ${ville} : ${reason.code}`, reason.message);
    } else {
      console.error(`[villes-populaires] ${ville} : erreur inattendue`, reason);
    }
    return null;
  });
}

async function ListeVilles() {
  const meteos = await chargerMeteos();

  return (
    <ul className={LISTE}>
      {villesPopulaires().map((ville, index) => (
        <li key={ville.nomComplet} className={classeElement(index)}>
          <CarteVille ville={ville} meteo={meteos[index]} />
        </li>
      ))}
    </ul>
  );
}

/** Squelettes de même hauteur que les cartes : pas de saut de mise en page. */
function ListeVillesSquelette() {
  return (
    <ul className={LISTE} aria-busy="true">
      {villesPopulaires().map((ville, index) => (
        <li key={ville.nomComplet} className={classeElement(index)}>
          <CarteVilleSquelette />
        </li>
      ))}
      <li className="sr-only">Chargement de la météo des villes populaires…</li>
    </ul>
  );
}

/**
 * Le titre s'affiche tout de suite ; les cartes arrivent en streaming quand la
 * météo est chargée, sans bloquer le reste de la page.
 */
export default function VillesPopulaires() {
  return (
    <section aria-labelledby="villes-populaires-titre" className="flex w-full flex-col gap-[14px]">
      <h2
        id="villes-populaires-titre"
        className="text-xs font-semibold text-encre-douce uppercase md:text-center"
      >
        Villes populaires
      </h2>
      <Suspense fallback={<ListeVillesSquelette />}>
        <ListeVilles />
      </Suspense>
    </section>
  );
}
