import CarteStat from "@/components/previsions/CarteStat";
import {
  formatDistance,
  formatPercent,
  formatPressure,
  formatTemperature,
  formatTime,
  formatWindSpeed,
} from "@/lib/format";
import { getDerivedLabels, getDerivedStats, type WeatherData } from "@/lib/weather";

type DetailsDuMomentProps = {
  meteo: WeatherData;
};

/** Applique un format seulement si la valeur existe. */
function siPresent(valeur: number | null, format: (n: number) => string): string | null {
  return valeur === null ? null : format(valeur);
}

/**
 * Bloc « Détails du moment » de la page Prévisions (maquettes 6:203 et 8:576).
 * Desktop : 6 cartes sur 2 colonnes. Mobile : 4 cartes, sans Ressenti ni
 * Lever / coucher (déjà dans Météo actuelle et absents de la maquette mobile).
 * Une mesure manquante affiche un tiret, sans note.
 */
export default function DetailsDuMoment({ meteo }: DetailsDuMomentProps) {
  const { current, location } = meteo;
  const libelles = getDerivedLabels(getDerivedStats(meteo), "fr");
  const heure = (iso: string) =>
    formatTime(iso, { locale: "fr-CA", timeZone: location.timezone });
  const rafales = siPresent(current.windGusts, formatWindSpeed);
  const rosee = siPresent(current.dewPoint, formatTemperature);

  return (
    <section aria-label="Détails du moment">
      <h2 className="text-lg font-semibold md:text-[22px]">
        Détails du moment
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:gap-4">
        <CarteStat
          icon="vent"
          titre="Vent"
          valeur={formatWindSpeed(current.windSpeed)}
          note={rafales && `Rafales à ${rafales}`}
          noteCourte={rafales && `Rafales ${rafales}`}
        />
        <CarteStat
          icon="goutte"
          titre="Humidité"
          valeur={siPresent(current.humidity, formatPercent)}
          note={rosee && `Point de rosée ${rosee}`}
          noteCourte={rosee && `Rosée ${rosee}`}
        />
        <CarteStat
          icon="thermometre"
          titre="Ressenti"
          valeur={formatTemperature(current.feelsLike)}
          note={libelles.feelsLike}
          desktopSeulement
        />
        <CarteStat
          icon="oeil"
          titre="Visibilité"
          valeur={siPresent(current.visibility, formatDistance)}
          note={libelles.visibility}
        />
        <CarteStat
          icon="pression"
          titre="Pression"
          valeur={siPresent(current.pressure, formatPressure)}
          note={libelles.pressureTrend}
        />
        <CarteStat
          icon="lever-soleil"
          titre="Lever / coucher"
          valeur={heure(current.sunrise)}
          note={`Coucher à ${heure(current.sunset)}`}
          desktopSeulement
        />
      </dl>
    </section>
  );
}
