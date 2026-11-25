import Card from "@/components/ui/Card";
import Icon, { type IconName } from "@/components/ui/Icon";

type PuceHoraireProps = {
  /** « Maint. » pour l'heure en cours, sinon « 16 h ». */
  heure: string;
  icon: IconName;
  /** Condition lue par les lecteurs d'écran à la place de l'icône (« Pluie faible »). */
  condition: string;
  /** « 4° » */
  temperature: string;
  /** « 10 % » (affiché aussi à 0 %). */
  pluie: string;
  /** Heure en cours : verre plus opaque, comme dans la maquette. */
  active?: boolean;
};

/**
 * Puce du bloc « Heure par heure » (maquette 4:130) : heure, icône de la
 * condition, température, puis probabilité de pluie.
 */
export default function PuceHoraire({
  heure,
  icon,
  condition,
  temperature,
  pluie,
  active = false,
}: PuceHoraireProps) {
  return (
    <Card
      variant={active ? "verre-fort" : "verre"}
      arrondi="puce"
      className="flex h-full flex-col items-center justify-between gap-2 px-2 py-4 text-center"
    >
      <p className="text-[13px] font-medium text-encre-douce">{heure}</p>
      <Icon name={icon} size={26} label={condition} />
      <p className="text-[17px] leading-none font-bold">{temperature}</p>
      <p className="text-[11px] text-encre-douce">
        <span className="sr-only">Probabilité de pluie : </span>
        {pluie}
      </p>
    </Card>
  );
}
