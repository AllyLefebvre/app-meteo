"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

type EtatErreurProps = {
  /** Relance le chargement. Par défaut, rafraîchit la page (données serveur). */
  onReessayer?: () => void;
};

/**
 * État d'erreur de la page Prévisions : la météo n'a pas pu être chargée.
 * Version provisoire, en attendant la maquette des états (WMC-36).
 */
export default function EtatErreur({ onReessayer }: EtatErreurProps) {
  const router = useRouter();
  const reessayer = onReessayer ?? (() => router.refresh());

  return (
    <Card
      variant="verre-fort"
      arrondi="bloc"
      role="alert"
      className="mx-auto flex max-w-[588px] flex-col items-center gap-4 p-8 text-center md:p-10"
    >
      <Icon name="nuage" size={56} strokeWidth={1.5} />
      <h2 className="text-[22px] font-semibold md:text-[26px]">Météo indisponible</h2>
      <p className="text-encre-douce">
        Les données météo n&apos;ont pas pu être chargées pour le moment. Réessayez dans quelques
        instants.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reessayer}
          className="h-11 rounded-full bg-encre px-6 font-medium text-sur-encre transition-colors hover:bg-encre/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="flex h-11 items-center rounded-full border border-verre-bordure bg-verre px-6 font-medium transition-colors hover:bg-verre-fort focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-encre"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </Card>
  );
}
