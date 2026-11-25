import PuceHoraire from "@/components/previsions/PuceHoraire";
import { formatPercent, formatTemperature, formatTime, getLocaleData } from "@/lib/format";
import type { WeatherData } from "@/lib/weather";

type HeureParHeureProps = {
  meteo: WeatherData;
};

/**
 * Bloc « Heure par heure » de la page Prévisions (maquettes 6:279 et 8:464) :
 * les 12 prochaines heures, dans le fuseau de la ville.
 *
 * - Desktop large (lg) : 12 puces réparties sur la largeur.
 * - Mobile et tablette : rangée qui défile horizontalement, aimantée sur
 *   chaque puce. La rangée déborde jusqu'aux bords de l'écran (marges
 *   négatives) sans faire déborder la page. Elle reçoit le focus clavier
 *   pour défiler avec les flèches.
 */
export default function HeureParHeure({ meteo }: HeureParHeureProps) {
  const { hourly, location } = meteo;
  // hourly[0] est l'heure en cours (voir WeatherData) : « Maint. », même si la
  // prévision en cache date de l'heure précédente.
  const maintenant = getLocaleData("fr-CA").now;

  return (
    <section aria-label="Heure par heure">
      <h2 className="text-lg font-semibold md:text-[22px]">Heure par heure</h2>
      <ul
        tabIndex={0}
        aria-label="12 prochaines heures"
        className={[
          // pb-10 / -mb-8 : place pour l'ombre des puces, que la zone qui défile couperait net.
          "-mx-5 mt-2 -mb-8 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pt-2 pb-10 md:-mx-6 md:mt-3 md:scroll-px-6 md:px-6",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Focus clavier : contour sur chaque puce plutôt que sur la zone, qui
          // déborde sous le bloc (place pour l'ombre).
          "group outline-none",
          "lg:mx-0 lg:mt-4 lg:mb-0 lg:grid lg:grid-cols-12 lg:gap-2 lg:overflow-visible lg:px-0 lg:pt-0 lg:pb-0",
        ].join(" ")}
      >
        {hourly.map((heure, index) => (
          <li
            key={heure.time}
            className="h-32 w-[72px] shrink-0 snap-start rounded-puce group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-encre lg:h-[150px] lg:w-auto"
          >
            <PuceHoraire
              heure={
                index === 0
                  ? maintenant
                  : formatTime(heure.time, { locale: "fr-CA", timeZone: location.timezone })
              }
              icon={heure.condition.icon}
              condition={heure.condition.label}
              temperature={formatTemperature(heure.temperature)}
              pluie={formatPercent(heure.precipitationProbability)}
              active={index === 0}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
