import Link from "next/link";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { formatTemperature } from "@/lib/format";
import { lienPrevisions } from "@/lib/previsions";
import type { VillePopulaire } from "@/lib/villesPopulaires";
import type { WeatherData } from "@/lib/weather";

type CarteVilleProps = {
  ville: VillePopulaire;
  /** null : la météo n'a pas pu être chargée (état de repli). */
  meteo: WeatherData | null;
};

/*
 * Mesures de la maquette (carte 4:118) : 16 px en haut et en bas, 20 px sur
 * les côtés, 14 px entre l'icône, le texte et la température. Hauteur fixe
 * (78 px, bordure comprise) pour que le squelette ait la même hauteur. En
 * mobile, la carte prend toute la largeur ; en desktop, celle de son contenu.
 */
const TAILLE = "h-[78px] w-full";

/**
 * Carte d'une ville populaire : icône, ville, condition et température.
 * Toute la carte est un lien vers la page Prévisions de la ville.
 */
export default function CarteVille({ ville, meteo }: CarteVilleProps) {
  const href = lienPrevisions({
    latitude: ville.latitude,
    longitude: ville.longitude,
    nom: ville.nomComplet,
  });

  const temperature = meteo ? formatTemperature(meteo.current.temperature) : null;
  const condition = meteo ? meteo.current.condition.label : "Météo indisponible";
  const nomAccessible = meteo
    ? `${ville.nom}, ${temperature}, ${condition}`
    : `${ville.nom}, ${condition}`;

  return (
    <Card arrondi="puce" interactive className={`${TAILLE} md:w-auto md:min-w-[220px]`}>
      <Link
        href={href}
        aria-label={nomAccessible}
        className="flex h-full items-center gap-[14px] rounded-puce px-5 py-4 outline-none"
      >
        <Icon
          name={meteo ? meteo.current.condition.icon : "nuage"}
          size={28}
          className={`shrink-0 ${meteo ? "" : "opacity-60"}`}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-base leading-6 font-semibold">{ville.nom}</span>
          <span className="truncate text-[13px] leading-[18px] text-encre-douce">{condition}</span>
        </span>
        {temperature && (
          <span className="shrink-0 text-2xl leading-8 font-semibold">{temperature}</span>
        )}
      </Link>
    </Card>
  );
}

/** Carte vide qui pulse, de la taille d'une carte ville, pendant le chargement. */
export function CarteVilleSquelette() {
  return (
    <Card
      arrondi="puce"
      aria-hidden
      className={`${TAILLE} animate-pulse motion-reduce:animate-none md:w-[240px]`}
    />
  );
}
