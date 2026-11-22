import BlocAVenir from "@/components/previsions/BlocAVenir";
import PrevisionsCadre from "@/components/previsions/PrevisionsCadre";
import PrevisionsGrille from "@/components/previsions/PrevisionsGrille";

/**
 * Chargement de la page Prévisions : la grille de la page, avec des cartes
 * vides qui pulsent. Version provisoire, en attendant la maquette (WMC-36).
 */
export default function ChargementPrevisions() {
  return (
    <PrevisionsCadre lieu="Chargement…" date="">
      <p role="status" className="sr-only">
        Chargement des prévisions…
      </p>
      <PrevisionsGrille
        actuelle={
          <BlocAVenir
            chargement
            titre="Météo actuelle"
            variant="verre-fort"
            hauteur="min-h-[227px] md:min-h-[355px]"
          />
        }
        resume={
          <BlocAVenir
            chargement
            titre="Résumé IA"
            variant="sombre"
            hauteur="min-h-[132px] md:min-h-[167px]"
          />
        }
        details={
          <BlocAVenir
            chargement
            titre="Détails du moment"
            hauteur="min-h-[287px] md:min-h-[473px]"
          />
        }
        heures={
          <BlocAVenir chargement titre="Heure par heure" hauteur="min-h-[184px] md:min-h-[191px]" />
        }
        jours={
          <BlocAVenir
            chargement
            titre="7 prochains jours"
            variant="verre-fort"
            hauteur="min-h-[393px] md:min-h-[440px]"
          />
        }
        conseils={
          <BlocAVenir
            chargement
            titre="Conseils Whimcast"
            variant="verre-fort"
            hauteur="md:min-h-[440px]"
          />
        }
      />
    </PrevisionsCadre>
  );
}
