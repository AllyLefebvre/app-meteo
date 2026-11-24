"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { GeocodeApiResponse } from "@/lib/weather/api";
import { MIN_QUERY_LENGTH } from "@/lib/weather/geocoding";
import type { City } from "@/lib/weather/types";

/*
 * Suggestions de villes pendant la saisie (WMC-24), pour la barre de
 * recherche. Textes regroupés ici en attendant l'i18n (WMC-50, WMC-19).
 */
export const TEXTES_SUGGESTIONS = {
  nombre: (n: number) =>
    n === 1
      ? "1 ville trouvée. Utilisez les flèches haut et bas pour la sélectionner."
      : `${n} villes trouvées. Utilisez les flèches haut et bas pour les parcourir.`,
  aucune: (saisie: string) => `Aucune ville trouvée pour « ${saisie} ». Vérifiez l'orthographe.`,
  erreur: "Les suggestions sont indisponibles pour le moment. Réessayez dans quelques instants.",
} as const;

/** Délai de frappe : on attend une pause dans la saisie avant d'interroger l'API. */
export const DELAI_FRAPPE_MS = 300;
/** Nombre de suggestions demandées à GET /api/geocode. */
export const NOMBRE_SUGGESTIONS = 5;

export type StatutSuggestions =
  /** Saisie trop courte ou suggestions effacées. */
  | "inactif"
  /** Requête en attente (délai de frappe) ou en cours. */
  | "chargement"
  /** Réponse reçue pour `requete` (liste éventuellement vide). */
  | "pret"
  | "erreur";

type Options = {
  /** Appelé quand une suggestion est choisie au clavier (Entrée). */
  onChoisir: (ville: City) => void;
};

/**
 * Gère les suggestions de villes d'un champ de recherche (modèle combobox
 * ARIA 1.2) :
 * - `chercher(saisie)` à chaque frappe : délai de 300 ms, 2 caractères minimum ;
 * - les réponses obsolètes sont annulées (AbortController) et, par sécurité,
 *   ignorées si elles ne correspondent plus à la dernière saisie ;
 * - `gererClavier` : flèches (avec bouclage), Entrée, Échap et Tab.
 */
export function useSuggestionsVilles({ onChoisir }: Options) {
  const [villes, setVilles] = useState<City[]>([]);
  const [statut, setStatut] = useState<StatutSuggestions>("inactif");
  /** Saisie (nettoyée) à laquelle correspondent `villes` et `statut`. */
  const [requete, setRequete] = useState("");
  const [ouverte, setOuverte] = useState(false);
  const [indexActif, setIndexActif] = useState(-1);

  const minuterie = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controleur = useRef<AbortController | null>(null);
  /** Dernière saisie envoyée (ou programmée) : seule sa réponse est acceptée. */
  const derniereRequete = useRef<string | null>(null);

  /** Annule le délai de frappe et la requête en cours. */
  function annulerRequete() {
    if (minuterie.current) clearTimeout(minuterie.current);
    minuterie.current = null;
    controleur.current?.abort();
    controleur.current = null;
    derniereRequete.current = null;
  }

  // Au démontage (ex. navigation), rien ne doit continuer en arrière-plan.
  useEffect(() => annulerRequete, []);

  async function charger(q: string) {
    const ctrl = new AbortController();
    controleur.current = ctrl;
    try {
      const reponse = await fetch(
        `/api/geocode?q=${encodeURIComponent(q)}&count=${NOMBRE_SUGGESTIONS}`,
        { signal: ctrl.signal },
      );
      if (!reponse.ok) throw new Error(`Géocodage : ${reponse.status}`);
      const { results } = (await reponse.json()) as GeocodeApiResponse;
      if (ctrl.signal.aborted || derniereRequete.current !== q) return;

      setVilles(results);
      setRequete(q);
      setStatut("pret");
      setIndexActif(-1);
    } catch (error) {
      if (ctrl.signal.aborted || derniereRequete.current !== q) return;
      console.error("[suggestions]", error);
      setVilles([]);
      setRequete(q);
      setStatut("erreur");
      setIndexActif(-1);
      // Permet de réessayer la même saisie.
      derniereRequete.current = null;
    } finally {
      if (controleur.current === ctrl) controleur.current = null;
    }
  }

  /** À appeler à chaque changement de la saisie. */
  function chercher(saisie: string) {
    const q = saisie.trim();
    setIndexActif(-1);

    if (q.length < MIN_QUERY_LENGTH) {
      reinitialiser();
      return;
    }

    setOuverte(true);
    // Même saisie que la dernière demandée (ex. espace ajoutée) : rien à refaire.
    if (q === derniereRequete.current) return;

    annulerRequete();
    derniereRequete.current = q;
    setStatut("chargement");
    minuterie.current = setTimeout(() => {
      minuterie.current = null;
      void charger(q);
    }, DELAI_FRAPPE_MS);
  }

  /** Ferme la liste sans effacer les suggestions (flèche bas la rouvre). */
  function fermer() {
    setOuverte(false);
    setIndexActif(-1);
  }

  /** Efface tout : après un choix, une validation ou une saisie trop courte. */
  function reinitialiser() {
    annulerRequete();
    setVilles([]);
    setRequete("");
    setStatut("inactif");
    setOuverte(false);
    setIndexActif(-1);
  }

  const listeOuverte = ouverte && villes.length > 0;

  /**
   * Gestionnaire clavier du champ. Entrée sur un élément actif choisit la
   * suggestion et empêche l'envoi du formulaire ; sans élément actif, le
   * formulaire est envoyé normalement.
   */
  function gererClavier(event: KeyboardEvent<HTMLInputElement>) {
    const n = villes.length;
    switch (event.key) {
      case "ArrowDown":
        if (n === 0) return;
        event.preventDefault();
        if (!listeOuverte) {
          setOuverte(true);
          setIndexActif(0);
        } else {
          setIndexActif((i) => (i + 1) % n);
        }
        return;
      case "ArrowUp":
        if (n === 0) return;
        event.preventDefault();
        if (!listeOuverte) {
          setOuverte(true);
          setIndexActif(n - 1);
        } else {
          setIndexActif((i) => (i <= 0 ? n - 1 : i - 1));
        }
        return;
      case "Enter":
        if (listeOuverte && indexActif >= 0 && indexActif < n) {
          event.preventDefault();
          onChoisir(villes[indexActif]);
        }
        return;
      case "Escape":
        if (listeOuverte) {
          event.preventDefault();
          fermer();
        }
        return;
      case "Tab":
        fermer();
        return;
    }
  }

  return {
    villes,
    statut,
    requete,
    listeOuverte,
    indexActif,
    setIndexActif,
    chercher,
    fermer,
    reinitialiser,
    gererClavier,
  };
}
