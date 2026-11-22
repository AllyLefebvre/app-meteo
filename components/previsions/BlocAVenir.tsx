import Card, { type CardVariant } from "@/components/ui/Card";

type BlocAVenirProps = {
  titre: string;
  /** Hauteur de la maquette, ex. « min-h-[184px] md:min-h-[191px] ». */
  hauteur: string;
  variant?: CardVariant;
  /** Mode chargement : carte vide qui pulse, sans texte. */
  chargement?: boolean;
};

/**
 * Emplacement réservé d'un bloc de la page Prévisions, aux dimensions de la
 * maquette. Chaque bloc le remplace dans son ticket (WMC-28 à WMC-34).
 */
export default function BlocAVenir({
  titre,
  hauteur,
  variant = "verre",
  chargement = false,
}: BlocAVenirProps) {
  if (chargement) {
    return (
      <Card
        variant={variant}
        arrondi="bloc"
        aria-hidden
        className={`${hauteur} animate-pulse motion-reduce:animate-none`}
      />
    );
  }

  const sombre = variant === "sombre";

  return (
    <section aria-label={titre}>
      <Card variant={variant} arrondi="bloc" className={`${hauteur} p-5 md:p-7`}>
        <h2 className="text-lg font-semibold md:text-[22px]">{titre}</h2>
        <p className={`mt-2 text-sm ${sombre ? "text-sur-encre/75" : "text-encre-douce"}`}>
          Bientôt disponible.
        </p>
      </Card>
    </section>
  );
}
