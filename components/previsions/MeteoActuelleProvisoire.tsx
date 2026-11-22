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
        {/* En mobile, le lieu et la date sont déjà dans l'en-tête. */}
        <div className="hidden items-center justify-between gap-4 md:flex">
          <p className="flex min-w-0 items-center gap-2 text-[22px] font-semibold">
            <Icon name="position" size={20} />
            <span className="truncate">{nom}</span>
          </p>
          <p className="shrink-0 text-[15px] text-encre-douce">{date}</p>
        </div>
        <div className="flex items-center justify-between gap-4 md:mt-2">
          <p className="text-[104px] leading-none font-bold tracking-tight md:text-[160px]">
            {formatTemperature(current.temperature)}
          </p>
          <span className="md:hidden">
            <Icon name={current.condition.icon} size={84} strokeWidth={1.5} />
          </span>
          <span className="hidden md:block">
            <Icon name={current.condition.icon} size={132} strokeWidth={1.5} />
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
