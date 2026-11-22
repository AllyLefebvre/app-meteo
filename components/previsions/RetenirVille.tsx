"use client";

import { useEffect } from "react";
import { DERNIERE_VILLE_COOKIE, versCookieVille, type PrevisionsLieu } from "@/lib/previsions";

/** Un an : la ville reste retenue d'une visite à l'autre. */
const DUREE_COOKIE = 60 * 60 * 24 * 365;

/**
 * Retient la ville affichée comme dernière ville consultée (cookie lu par
 * proxy.ts). Écrit dans le navigateur, une fois la page affichée : un simple
 * préchargement de lien ne compte pas comme une visite.
 */
export default function RetenirVille({ latitude, longitude, nom }: PrevisionsLieu) {
  useEffect(() => {
    const valeur = encodeURIComponent(versCookieVille({ latitude, longitude, nom }));
    const securise = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${DERNIERE_VILLE_COOKIE}=${valeur}; Path=/; Max-Age=${DUREE_COOKIE}; SameSite=Lax${securise}`;
  }, [latitude, longitude, nom]);

  return null;
}
