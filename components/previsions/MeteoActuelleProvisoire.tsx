import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { formatLongDateTime, formatTemperature } from "@/lib/format";
import type { WeatherData } from "@/lib/weather";

type MeteoActuelleProvisoireProps = {
  nom: string;
  meteo: WeatherData;
};

/**
 * Version minimale du bloc « Météo actuelle », avec les vraies données : elle
 * vérifie le branchement de la page. Le bloc conforme à la maquette arrive
 * avec WMC-28.
 */
export default function MeteoActuelleProvisoire({ nom, meteo }: MeteoActuelleProvisoireProps) {
  const { current, location } = meteo;
  const date = formatLongDateTime(current.time, {
    locale: "fr-CA",
    timeZone: location.timezone,
  });

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
          <p className="text-[15px] text-encre-douce lg:shrink-0">{date}</p>
        </div>
        <div className="flex items-center justify-between gap-4 md:mt-2">
          <p className="shrink-0 text-[104px] leading-none font-bold tracking-tight md:text-[120px] lg:text-[160px]">
            {formatTemperature(current.temperature)}
          </p>
          {/*
            L'icône prend la place laissée par la température, sans dépasser
            84 px en mobile et 132 px en desktop large : elle ne sort jamais
            de la carte, même avec « -12° » ou sur tablette.
          */}
          <span className="flex min-w-0 flex-1 justify-end">
            <Icon
              name={current.condition.icon}
              size={132}
              strokeWidth={3}
              className="h-auto w-full max-w-[84px] lg:max-w-[132px]"
            />
          </span>
        </div>
        <p className="mt-1 text-[22px] font-semibold md:text-[26px]">{current.condition.label}</p>
        <p className="mt-1 text-sm text-encre-douce md:text-base">
          Ressenti {formatTemperature(current.feelsLike)} · Max {formatTemperature(current.max)} · Min{" "}
          {formatTemperature(current.min)}
        </p>
      </Card>
    </section>
  );
}
