/*
 * Villes de la section « Villes populaires » de l'accueil : une liste pour le
 * Canada, une pour les États-Unis.
 *
 * Les coordonnées sont fixées ici (aucun géocodage à chaque chargement) et
 * reprises du géocodage, pour que la page Prévisions soit la même que celle
 * ouverte par la recherche.
 *
 * Le pays du visiteur est deviné dans le navigateur à partir du fuseau horaire
 * de l'appareil, sans demande d'autorisation (voir scriptPaysVisiteur).
 */

export type Pays = "CA" | "US";

export type VillePopulaire = {
  /** Nom affiché sur la carte, ex. « Montréal ». */
  nom: string;
  /** Nom passé à la page Prévisions, ex. « Montréal, QC ». */
  nomComplet: string;
  latitude: number;
  longitude: number;
};

/** Pays affiché quand le pays du visiteur est inconnu (ou sans JavaScript). */
export const PAYS_PAR_DEFAUT: Pays = "CA";

const VILLES_PAR_PAYS: Record<Pays, readonly VillePopulaire[]> = {
  CA: [
    { nom: "Montréal", nomComplet: "Montréal, QC", latitude: 45.5088, longitude: -73.5878 },
    { nom: "Toronto", nomComplet: "Toronto, ON", latitude: 43.7064, longitude: -79.3986 },
    { nom: "Vancouver", nomComplet: "Vancouver, BC", latitude: 49.2497, longitude: -123.1193 },
    { nom: "Calgary", nomComplet: "Calgary, AB", latitude: 51.0501, longitude: -114.0853 },
  ],
  US: [
    { nom: "New York", nomComplet: "New York, États-Unis", latitude: 40.7143, longitude: -74.006 },
    {
      nom: "Los Angeles",
      nomComplet: "Los Angeles, États-Unis",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    { nom: "Chicago", nomComplet: "Chicago, États-Unis", latitude: 41.85, longitude: -87.6501 },
    { nom: "Miami", nomComplet: "Miami, États-Unis", latitude: 25.7743, longitude: -80.1937 },
  ],
};

/** Pays proposés, dans l'ordre où leurs listes sont rendues. */
export const PAYS = Object.keys(VILLES_PAR_PAYS) as Pays[];

/** Villes populaires d'un pays, dans l'ordre d'affichage. */
export function villesPopulaires(pays: Pays = PAYS_PAR_DEFAUT): readonly VillePopulaire[] {
  return VILLES_PAR_PAYS[pays];
}

/**
 * En mobile, seules les premières villes sont affichées (3 cartes empilées) :
 * Calgary et Miami sont masquées.
 */
export const NOMBRE_VILLES_MOBILE = 3;

/*
 * Fuseaux horaires IANA de chaque pays : un nom exact (« America/Toronto ») ou
 * un préfixe terminé par « / » (« America/Indiana/ » couvre tout l'Indiana).
 * Les anciens alias (« Canada/Eastern », « US/Pacific ») sont couverts.
 */
const FUSEAUX: Record<Pays, readonly string[]> = {
  CA: [
    "Canada/",
    "America/St_Johns",
    "America/Halifax",
    "America/Glace_Bay",
    "America/Moncton",
    "America/Goose_Bay",
    "America/Blanc-Sablon",
    "America/Montreal",
    "America/Toronto",
    "America/Nipigon",
    "America/Thunder_Bay",
    "America/Iqaluit",
    "America/Pangnirtung",
    "America/Atikokan",
    "America/Winnipeg",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Resolute",
    "America/Regina",
    "America/Swift_Current",
    "America/Edmonton",
    "America/Cambridge_Bay",
    "America/Yellowknife",
    "America/Inuvik",
    "America/Creston",
    "America/Dawson_Creek",
    "America/Fort_Nelson",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Dawson",
  ],
  US: [
    "US/",
    "America/Indiana/",
    "America/Kentucky/",
    "America/North_Dakota/",
    "America/New_York",
    "America/Detroit",
    "America/Louisville",
    "America/Fort_Wayne",
    "America/Indianapolis",
    "America/Chicago",
    "America/Menominee",
    "America/Denver",
    "America/Boise",
    "America/Phoenix",
    "America/Los_Angeles",
    "America/Anchorage",
    "America/Juneau",
    "America/Sitka",
    "America/Metlakatla",
    "America/Yakutat",
    "America/Nome",
    "America/Adak",
    "Pacific/Honolulu",
  ],
};

/**
 * Script exécuté par le navigateur avant l'affichage des cartes. Il devine le
 * pays du visiteur et le pose en data-pays sur son élément parent ; le CSS
 * n'affiche alors que la liste de ce pays. La page reste statique et rien ne
 * change à l'écran après coup.
 *
 * Le fuseau horaire de l'appareil passe en premier. À défaut, la région de la
 * langue du navigateur (« en-US » → US), moins fiable : beaucoup de Canadiens
 * ont un navigateur en « en-US ». Sinon, rien n'est posé : liste par défaut.
 *
 * Écrit en JavaScript simple (ES5) : il est injecté tel quel dans le HTML.
 */
export function scriptPaysVisiteur(): string {
  return `(function(){try{
var f=${JSON.stringify(FUSEAUX)},z=Intl.DateTimeFormat().resolvedOptions().timeZone||"",p=null,k,i,v;
for(k in f)for(i=0;i<f[k].length;i++){v=f[k][i];if(v.slice(-1)==="/"?z.indexOf(v)===0:z===v)p=p||k}
if(!p){v=(navigator.language||"").split("-")[1];v=v&&v.toUpperCase();if(f[v])p=v}
if(p)document.currentScript.parentElement.setAttribute("data-pays",p)
}catch(e){}})()`;
}
