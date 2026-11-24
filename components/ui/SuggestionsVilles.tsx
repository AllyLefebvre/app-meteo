"use client";

import type { City } from "@/lib/weather/types";

type SuggestionsVillesProps = {
  /** Id de la listbox, référencé par `aria-controls` du champ. */
  id: string;
  villes: City[];
  /** Index de l'élément actif (-1 : aucun). */
  indexActif: number;
  /** Id de l'option à l'index donné, référencé par `aria-activedescendant`. */
  idOption: (index: number) => string;
  onChoisir: (ville: City) => void;
  onSurvol: (index: number) => void;
};

/** Région et pays, ex. « Québec, Canada ». */
function precision(ville: City): string {
  return [ville.region, ville.country].filter(Boolean).join(", ");
}

/**
 * Liste des suggestions de villes (listbox du modèle combobox ARIA 1.2), à
 * placer juste après la barre de recherche : elle s'affiche dessous, par-dessus
 * la page.
 *
 * PROVISOIRE : la liste n'est pas encore maquettée (WMC-36). Style sobre,
 * repris de la barre : panneau en verre, arrondi de carte, éléments de 44 px
 * minimum.
 *
 * Le focus reste dans le champ : les options ne le prennent jamais. Le
 * `preventDefault` au `mousedown` évite que le champ perde le focus (et ferme
 * la liste) avant que le clic soit pris en compte.
 */
export default function SuggestionsVilles({
  id,
  villes,
  indexActif,
  idOption,
  onChoisir,
  onSurvol,
}: SuggestionsVillesProps) {
  return (
    // Bloc de hauteur nulle : la liste s'y ancre sans décaler la page.
    <div className="relative z-30">
      <ul
        id={id}
        role="listbox"
        aria-label="Suggestions de villes"
        className="absolute inset-x-0 top-2 flex flex-col gap-0.5 rounded-carte border border-verre-bordure bg-verre-fort p-2 shadow-verre backdrop-blur-verre"
      >
        {villes.map((ville, index) => {
          const actif = index === indexActif;
          const detail = precision(ville);
          return (
            <li
              key={ville.id}
              id={idOption(index)}
              role="option"
              aria-selected={actif}
              onMouseDown={(event) => event.preventDefault()}
              onMouseMove={() => {
                if (!actif) onSurvol(index);
              }}
              onClick={() => onChoisir(ville)}
              className={`flex min-h-11 cursor-pointer flex-col justify-center rounded-puce px-4 py-1.5 transition-colors ${
                actif ? "bg-encre/10" : ""
              }`}
            >
              <span className="text-base leading-5 font-semibold text-encre">{ville.name}</span>
              {detail && <span className="text-[13px] leading-4 text-encre-douce">{detail}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
