import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { formatLongDateTime, formatTemperature } from "@/lib/format";
import type { WeatherData } from "@/lib/weather";

type MeteoActuelleProps = {
  /** Lieu affiché, ex. « Montréal, QC ». */
  nom: string;
  meteo: WeatherData;
};

/**
 * En très grand, le trait d'union de « -12° » paraît court et haut : on
 * affiche le vrai signe moins (U+2212), lu « moins » par les lecteurs d'écran.
 */
function avecSigneMoins(texte: string): string {
  return texte.replace("-", "−");
}

/** Place gardée pour l'icône à côté de la température : 56 px + 16 px d'écart. */
const RESERVE_ICONE = 72;

/**
 * Largeur approximative de la température, en multiples de sa taille de
 * police (mesurée : « 12° » ≈ 1,45, « −12° » ≈ 1,95, « −40° » ≈ 2,2), avec
 * une marge.
 */
function largeurEnEm(texte: string): number {
  return texte.length * 0.58;
}

/**
 * Bloc « Météo actuelle » de la page Prévisions (maquettes 6:178 et 8:446) :
 * lieu et date (desktop), température, icône, condition, puis ressenti,
 * maximum et minimum du jour.
 */
export default function MeteoActuelle({ nom, meteo }: MeteoActuelleProps) {
  const { current, location } = meteo;
  const date = formatLongDateTime(current.time, {
    locale: "fr-CA",
    timeZone: location.timezone,
  });
  const temperature = avecSigneMoins(formatTemperature(current.temperature));
  const details = [
    `Ressenti ${formatTemperature(current.feelsLike)}`,
    `Max ${formatTemperature(current.max)}`,
    `Min ${formatTemperature(current.min)}`,
  ];

  return (
    <section aria-label="Météo actuelle">
      <Card
        variant="verre-fort"
        arrondi="bloc"
        className="min-h-[227px] p-6 md:min-h-[355px] md:p-8"
      >
        {/*
          En mobile, le lieu et la date sont déjà dans l'en-tête. Sur tablette,
          la carte est étroite : la date passe sous le lieu. En desktop large,
          ils sont sur la même ligne (maquette).
        */}
        <div className="hidden flex-col items-start gap-1 md:flex lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <p className="flex w-full min-w-0 items-center gap-2 text-[22px] font-semibold lg:w-auto">
            <Icon name="position" size={20} className="shrink-0" />
            <span className="truncate">{nom}</span>
          </p>
          <time dateTime={current.time} className="text-[15px] text-encre-douce lg:shrink-0">
            {date}
          </time>
        </div>

        <div className="@container flex items-center justify-between gap-4 md:mt-2">
          {/*
            Taille de la maquette (104 px mobile, 120 px tablette, 160 px
            desktop large), réduite si la température ne tient pas à côté
            d'une icône d'au moins 56 px : « −40° » ou « 104° » sont environ
            50 % plus larges que « 12° ».
          */}
          <p
            className="shrink-0 leading-none font-bold tracking-tight [--taille-max:104px] md:[--taille-max:120px] lg:[--taille-max:160px]"
            style={{
              fontSize: `min(var(--taille-max), calc((100cqi - ${RESERVE_ICONE}px) / ${largeurEnEm(temperature)}))`,
            }}
          >
            {temperature}
          </p>
          {/*
            L'icône prend la place laissée par la température : au moins 56 px,
            au plus 84 px en mobile et 132 px en desktop large.
          */}
          <span className="flex min-w-14 flex-1 justify-end">
            <Icon
              name={current.condition.icon}
              size={132}
              strokeWidth={3}
              className="h-auto w-full max-w-[84px] lg:max-w-[132px]"
            />
          </span>
        </div>

        <p className="mt-1 text-[22px] leading-tight font-semibold text-balance md:text-[26px]">
          {current.condition.label}
        </p>
        {/* Sur un écran étroit, la ligne passe à la ligne entre deux valeurs. */}
        <ul className="mt-2 flex flex-wrap gap-x-2 text-sm text-encre-douce md:text-base">
          {details.map((texte, index) => (
            <li key={texte} className="flex gap-x-2">
              {index > 0 && <span aria-hidden>·</span>}
              {texte}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
