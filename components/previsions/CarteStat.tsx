import Card from "@/components/ui/Card";
import Icon, { type IconName } from "@/components/ui/Icon";

type CarteStatProps = {
  icon: IconName;
  titre: string;
  /** Valeur affichée (« 18 km/h ») ; null si la donnée manque : un tiret la remplace. */
  valeur: string | null;
  /** Note sous la valeur (« Rafales à 32 km/h »). Absente si la valeur manque. */
  note?: string | null;
  /** Note plus courte pour le mobile (« Rafales 32 km/h »), comme dans la maquette. */
  noteCourte?: string | null;
  /** Carte absente de la maquette mobile : affichée seulement à partir de md. */
  desktopSeulement?: boolean;
};

/**
 * Carte de statistique du bloc « Détails du moment » (maquette 4:144) :
 * icône et titre, valeur, puis note. À placer dans une liste de définitions
 * (<dl>) : le titre est le terme, la valeur et la note sa description.
 */
export default function CarteStat({
  icon,
  titre,
  valeur,
  note = null,
  noteCourte = null,
  desktopSeulement = false,
}: CarteStatProps) {
  const courte = noteCourte ?? note;
  const affichage = desktopSeulement ? "hidden md:flex" : "flex";

  return (
    <Card
      variant="verre"
      className={`${affichage} min-h-[110px] flex-col p-4 md:min-h-[132px] md:p-5`}
    >
      <dt className="flex items-center gap-1.5 text-[13px] text-encre-douce md:text-sm">
        <Icon name={icon} size={16} className="shrink-0" />
        {titre}
      </dt>
      <dd className="mt-2 text-[22px] leading-tight font-semibold md:text-[28px]">
        {valeur ?? (
          <>
            <span aria-hidden>—</span>
            <span className="sr-only">Non disponible</span>
          </>
        )}
      </dd>
      {valeur !== null && note && (
        <dd className="mt-1 text-xs text-encre-douce md:text-[13px]">
          {courte !== note ? (
            <>
              <span className="md:hidden">{courte}</span>
              <span className="hidden md:inline">{note}</span>
            </>
          ) : (
            note
          )}
        </dd>
      )}
    </Card>
  );
}
