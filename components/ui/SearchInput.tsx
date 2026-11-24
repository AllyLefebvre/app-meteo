"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import BoutonMaPosition from "@/components/ui/BoutonMaPosition";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import SuggestionsVilles from "@/components/ui/SuggestionsVilles";
import { TEXTES_SUGGESTIONS, useSuggestionsVilles } from "@/components/ui/useSuggestionsVilles";
import { lienPrevisions } from "@/lib/previsions";
import type { GeocodeApiResponse } from "@/lib/weather/api";
import type { City } from "@/lib/weather/types";

export type SearchInputTaille = "large" | "compacte";

type SearchInputProps = {
  /**
   * - large : accueil, 350 × 78 px en mobile et 576 × 90 px en desktop, avec
   *   « Utiliser ma position » en dessous
   * - compacte : barre d'outils de la page Prévisions, 74 px de haut, largeur
   *   fixée par le parent (420 px)
   */
  taille?: SearchInputTaille;
  /**
   * Texte indicatif. Sur la page Prévisions, la ville affichée (« Montréal,
   * QC »), comme dans la maquette. Par défaut : « Rechercher une ville… ».
   */
  placeholder?: string;
};

type Etat =
  | { type: "repos" }
  | { type: "recherche" }
  | { type: "introuvable"; saisie: string }
  | { type: "erreur" };

const TAILLES: Record<SearchInputTaille, { conteneur: string; barre: string; halo: string }> = {
  large: {
    conteneur: "mx-auto w-full max-w-[576px]",
    barre: "h-[78px] gap-3 px-[15px] md:h-[90px] md:gap-4 md:px-[21px]",
    halo: "h-[78px] md:h-[90px]",
  },
  compacte: {
    conteneur: "w-full",
    barre: "h-[74px] gap-3 px-[13px]",
    halo: "h-[74px]",
  },
};

/** Message affiché sous la barre selon l'état de la recherche. */
function message(etat: Etat): string {
  switch (etat.type) {
    case "introuvable":
      return `Aucune ville trouvée pour « ${etat.saisie} ». Vérifiez l'orthographe.`;
    case "erreur":
      return "La recherche est indisponible pour le moment. Réessayez dans quelques instants.";
    default:
      return "";
  }
}

/**
 * Barre « Rechercher une ville » (maquette 4:108). À la validation, cherche la
 * ville avec GET /api/geocode, puis ouvre sa page Prévisions.
 *
 * Saisie vide : rien ne se passe. Ville introuvable ou service indisponible :
 * message sous la barre, annoncé par les lecteurs d'écran (messages provisoires,
 * en attendant la maquette des états, WMC-36).
 *
 * Pendant la saisie, des suggestions de villes s'affichent sous la barre
 * (combobox ARIA 1.2, WMC-24) : voir useSuggestionsVilles et SuggestionsVilles.
 */
export default function SearchInput({
  taille = "large",
  placeholder = "Rechercher une ville…",
}: SearchInputProps) {
  const router = useRouter();
  const id = useId();
  const [saisie, setSaisie] = useState("");
  const [etat, setEtat] = useState<Etat>({ type: "repos" });
  const [navigation, demarrerNavigation] = useTransition();

  const suggestions = useSuggestionsVilles({ onChoisir: choisirVille });

  const enCours = etat.type === "recherche" || navigation;
  // Message visible : celui de la validation, sinon celui des suggestions.
  const texte =
    message(etat) ||
    (suggestions.statut === "erreur"
      ? TEXTES_SUGGESTIONS.erreur
      : suggestions.statut === "pret" && suggestions.villes.length === 0
        ? TEXTES_SUGGESTIONS.aucune(suggestions.requete)
        : "");
  // Nombre de suggestions : annoncé aux lecteurs d'écran seulement (la liste est visible).
  const annonce =
    !texte && suggestions.listeOuverte ? TEXTES_SUGGESTIONS.nombre(suggestions.villes.length) : "";
  const idListe = `${id}-suggestions`;
  const idOption = (index: number) => `${id}-suggestion-${index}`;
  const { conteneur, barre, halo } = TAILLES[taille];

  /** Ouvre la page Prévisions d'une suggestion (clic ou Entrée). */
  function choisirVille(ville: City) {
    suggestions.reinitialiser();
    setEtat({ type: "repos" });
    setSaisie("");
    demarrerNavigation(() => {
      router.push(
        lienPrevisions({ latitude: ville.latitude, longitude: ville.longitude, nom: ville.label }),
      );
    });
  }

  async function rechercher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ville = saisie.trim();
    if (!ville || enCours) return;

    suggestions.reinitialiser();
    setEtat({ type: "recherche" });
    try {
      const reponse = await fetch(`/api/geocode?q=${encodeURIComponent(ville)}&count=1`);
      if (!reponse.ok) throw new Error(`Géocodage : ${reponse.status}`);
      const { results } = (await reponse.json()) as GeocodeApiResponse;
      const resultat = results[0];

      if (!resultat) {
        setEtat({ type: "introuvable", saisie: ville });
        return;
      }

      setEtat({ type: "repos" });
      setSaisie("");
      demarrerNavigation(() => {
        router.push(
          lienPrevisions({
            latitude: resultat.latitude,
            longitude: resultat.longitude,
            nom: resultat.label,
          }),
        );
      });
    } catch (error) {
      console.error("[recherche]", error);
      setEtat({ type: "erreur" });
    }
  }

  return (
    <div className={`group relative ${conteneur}`}>
      {/* Halo coloré derrière la barre, plus intense au survol. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 rounded-carte bg-linear-to-r from-accent via-fond-milieu to-chaud-fort opacity-40 blur-xl transition-opacity group-hover:opacity-70 ${halo}`}
      />

      <form
        role="search"
        onSubmit={rechercher}
        className={`relative flex items-center rounded-carte border border-verre-bordure bg-verre shadow-verre backdrop-blur-verre transition duration-300 focus-within:border-verre-bordure-survol focus-within:bg-verre-fort hover:-translate-y-0.5 hover:border-verre-bordure-survol hover:shadow-verre-survol motion-reduce:hover:translate-y-0 ${barre}`}
      >
        <Button
          type="submit"
          variant="icone-sombre"
          icon={enCours ? "chargement" : "recherche"}
          label={enCours ? "Recherche en cours" : "Rechercher"}
          disabled={enCours}
          aria-busy={enCours}
          className={`shadow-lg ${enCours ? "[&_svg]:animate-spin motion-reduce:[&_svg]:animate-none" : ""}`}
        />
        <label htmlFor={`${id}-ville`} className="sr-only">
          Rechercher une ville
        </label>
        <input
          id={`${id}-ville`}
          type="text"
          value={saisie}
          onChange={(event) => {
            setSaisie(event.target.value);
            if (etat.type !== "recherche") setEtat({ type: "repos" });
            suggestions.chercher(event.target.value);
          }}
          onKeyDown={suggestions.gererClavier}
          onBlur={suggestions.fermer}
          role="combobox"
          aria-expanded={suggestions.listeOuverte}
          aria-controls={idListe}
          aria-autocomplete="list"
          aria-activedescendant={
            suggestions.listeOuverte && suggestions.indexActif >= 0
              ? idOption(suggestions.indexActif)
              : undefined
          }
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          maxLength={100}
          aria-invalid={etat.type === "introuvable"}
          aria-describedby={texte ? `${id}-message` : undefined}
          className="min-w-0 flex-1 bg-transparent text-lg text-encre outline-none placeholder:text-encre/60"
        />
        {/* Badge absent de la barre compacte (maquette). Rôle à définir dans WMC-35. */}
        {taille === "large" && (
          <span className="hidden shrink-0 md:block">
            <Badge icon="etincelles">IA</Badge>
          </span>
        )}
      </form>

      {suggestions.listeOuverte && (
        <SuggestionsVilles
          id={idListe}
          villes={suggestions.villes}
          indexActif={suggestions.indexActif}
          idOption={idOption}
          onChoisir={choisirVille}
          onSurvol={suggestions.setIndexActif}
        />
      )}

      <div
        className={
          taille === "large"
            ? "mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-1 md:mt-3.5"
            : "absolute inset-x-0 top-full mt-2 px-1"
        }
      >
        <p
          id={`${id}-message`}
          role="status"
          className="min-w-0 flex-1 text-sm font-medium text-encre"
        >
          {texte}
          {annonce && <span className="sr-only">{annonce}</span>}
        </p>
        {/* Hors du formulaire, type="button" : ne lance jamais la recherche. */}
        {taille === "large" && <BoutonMaPosition apparence="lien" />}
      </div>
    </div>
  );
}
