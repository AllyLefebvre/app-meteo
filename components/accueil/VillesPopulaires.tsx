import { Suspense } from "react";
import CarteVille, { CarteVilleSquelette } from "@/components/accueil/CarteVille";
import { getWeather, isWeatherError, type WeatherData } from "@/lib/weather";
import {
  NOMBRE_VILLES_MOBILE,
  PAYS,
  scriptPaysVisiteur,
  villesPopulaires,
  type Pays,
} from "@/lib/villesPopulaires";

/*
 * Section « Villes populaires » de l'accueil (maquette : section 6:71).
 * Desktop : cartes en ligne, 16 px entre elles. Mobile (sous md) : les
 * NOMBRE_VILLES_MOBILE premières cartes, empilées, 12 px entre elles.
 *
 * Une liste par pays (Canada, États-Unis) est rendue dans le HTML. Un petit
 * script, exécuté avant l'affichage des cartes, pose data-pays sur la section
 * selon le fuseau horaire du visiteur ; le CSS ci-dessous n'affiche que la
 * bonne liste. Sans pays reconnu (ou sans JavaScript) : liste canadienne.
 */
const LISTE = "flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-4";

/** Liste visible selon data-pays (classes écrites en entier pour Tailwind). */
const VISIBILITE: Record<Pays, string> = {
  CA: "group-data-[pays=US]/villes:hidden",
  US: "hidden group-data-[pays=US]/villes:block",
};

/** Masque en mobile les cartes au-delà de NOMBRE_VILLES_MOBILE. */
function classeElement(index: number): string {
  return index < NOMBRE_VILLES_MOBILE ? "" : "hidden md:block";
}

/** Météo de chaque ville d'un pays ; null pour une ville qui n'a pas répondu. */
async function chargerMeteos(pays: Pays): Promise<(WeatherData | null)[]> {
  const villes = villesPopulaires(pays);
  // getWeather met chaque réponse en cache 10 min : au plus 8 appels (4 villes
  // par pays) par période, quel que soit le nombre de visiteurs.
  const resultats = await Promise.allSettled(
    villes.map(({ latitude, longitude }) => getWeather({ latitude, longitude })),
  );

  return resultats.map((resultat, index) => {
    if (resultat.status === "fulfilled") return resultat.value;
    // Une ville en échec ne casse pas la section : sa carte passe en repli.
    const { reason } = resultat;
    const ville = villes[index].nom;
    if (isWeatherError(reason)) {
      console.error(`[villes-populaires] ${ville} : ${reason.code}`, reason.message);
    } else {
      console.error(`[villes-populaires] ${ville} : erreur inattendue`, reason);
    }
    return null;
  });
}

async function ListesVilles() {
  const meteos = await Promise.all(PAYS.map((pays) => chargerMeteos(pays)));

  return PAYS.map((pays, indexPays) => (
    <div key={pays} className={VISIBILITE[pays]}>
      <ul className={LISTE}>
        {villesPopulaires(pays).map((ville, index) => (
          <li key={ville.nomComplet} className={classeElement(index)}>
            <CarteVille ville={ville} meteo={meteos[indexPays][index]} />
          </li>
        ))}
      </ul>
    </div>
  ));
}

/**
 * Squelettes de même hauteur que les cartes : pas de saut de mise en page.
 * Les deux pays ont le même nombre de villes, un seul squelette suffit.
 */
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
    <section
      aria-labelledby="villes-populaires-titre"
      className="group/villes flex w-full flex-col gap-[14px]"
      // data-pays est posé par le script avant l'hydratation.
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: scriptPaysVisiteur() }} />
      <h2
        id="villes-populaires-titre"
        className="text-xs font-semibold text-encre-douce uppercase md:text-center"
      >
        Villes populaires
      </h2>
      <Suspense fallback={<ListeVillesSquelette />}>
        <ListesVilles />
      </Suspense>
    </section>
  );
}
