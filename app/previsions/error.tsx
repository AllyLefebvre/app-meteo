"use client"; // Les frontières d'erreur sont des composants client.

import { useEffect } from "react";
import EtatErreur from "@/components/previsions/EtatErreur";
import PrevisionsCadre from "@/components/previsions/PrevisionsCadre";

/**
 * Erreur inattendue sur la page Prévisions. Les erreurs du service météo,
 * prévues, sont traitées dans la page elle-même.
 */
export default function ErreurPrevisions({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[previsions] erreur inattendue", error);
  }, [error]);

  return (
    <PrevisionsCadre lieu="Prévisions" date="">
      <EtatErreur onReessayer={() => unstable_retry()} />
    </PrevisionsCadre>
  );
}
