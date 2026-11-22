# Whimcast

Application météo avec des prévisions expliquées par IA, pour planifier sa journée.

Le projet est en cours de développement : la page d'accueil et son champ de recherche sont en place, mais les données météo ne sont pas encore branchées.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 et TypeScript
- Tailwind CSS 4
- Icônes [lucide-react](https://lucide.dev)

## Lancer le projet

Prérequis : Node.js et npm.

```bash
npm install
npm run dev
```

L'application est ensuite disponible sur [http://localhost:3000](http://localhost:3000).

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Crée la version de production |
| `npm run start` | Lance la version de production |
| `npm run lint` | Vérifie le code avec ESLint |

## Structure

```
app/          Pages et mise en page globale
components/   Composants d'interface
lib/format/   Formatage des dates, heures et températures (par langue)
lib/weather/  Client météo (serveur) et types de la réponse normalisée
public/       Fichiers statiques
```

## Formatage

`lib/format/` regroupe les formats de la maquette, utilisables côté serveur comme côté client. Chaque fonction de date reçoit la langue et le fuseau :

```ts
formatLongDateTime("2026-11-07T14:55", { locale: "fr-CA", timeZone: "America/Toronto" });
// « Samedi 7 novembre · 14 h 55 »
```

| Fonction | Exemple en fr-CA |
|---|---|
| `formatTime(date, options)` | « 14 h 55 », « 16 h » |
| `formatHourLabel(date, options)` | « Maint. » pour l'heure en cours, sinon « 16 h » |
| `formatLongDateTime(date, options)` | « Samedi 7 novembre · 14 h 55 » |
| `formatShortDateTime(date, options)` | « Sam. 7 nov. · 14 h 55 » |
| `formatDayName(date, options)` | « Aujourd'hui », « Dimanche » |
| `formatDayNameShort(date, options)` | « Auj. », « Dim. » |
| `formatTemperature(°C)` | « 12° », « -3° », « 0° » (jamais « -0° ») |

- Langues : fr-CA seulement pour l'instant. Les formats de chaque langue sont dans `lib/format/locales.ts` ; en-CA et en-US arrivent avec WMC-46 (épopée E8, WMC-44).
- Le fuseau est celui de la ville consultée (`location.timezone` de `WeatherData`), pas celui de l'utilisateur.
- Les dates d'Open-Meteo (« 2026-11-07T14:55 », sans fuseau) sont déjà à l'heure de la ville et ne sont pas converties. Un `Date` ou une chaîne avec fuseau (« …Z ») est converti dans le fuseau donné.
- Pour éviter un écart d'hydratation, passer la même option `now` au rendu serveur et au rendu client.
- Les espaces à l'intérieur d'une heure sont insécables (`NBSP`).

## Données météo

Les prévisions viennent de l'API [Open-Meteo](https://open-meteo.com), appelée uniquement côté serveur par `getWeather()` dans `lib/weather/`. Le client renvoie les conditions actuelles, les 12 prochaines heures et les 7 prochains jours dans un format propre à Whimcast (`WeatherData`), indépendant de celui d'Open-Meteo. Les réponses sont mises en cache 10 minutes par Next.js.

### Conditions d'usage d'Open-Meteo

Vérifiées le 21 novembre 2026 sur les pages [Terms](https://open-meteo.com/en/terms), [Pricing](https://open-meteo.com/en/pricing) et [Licence](https://open-meteo.com/en/licence).

- **API gratuite** : réservée à un usage non commercial, sans clé. Limites : 600 appels par minute, 5 000 par heure, 10 000 par jour et 300 000 par mois. Les limites s'appliquent par adresse IP ; les hébergeurs partagés (Vercel, Netlify, Render) peuvent les atteindre plus tôt. Aucune garantie de disponibilité.
- **Usage commercial** : une application avec abonnement ou publicité est commerciale et nécessite un abonnement payant. Il fournit une clé pour l'API client (`customer-api.open-meteo.com`), de même syntaxe. Pour l'activer, définir la variable d'environnement `OPEN_METEO_API_KEY` : le client bascule alors automatiquement sur cette API.
- **Attribution obligatoire** : les données sont sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), gratuite ou payante. Un lien vers Open-Meteo doit figurer partout où les données sont affichées, par exemple « Weather data by Open-Meteo.com » pointant vers https://open-meteo.com/.

| Variable d'environnement | Obligatoire | Rôle |
|---|---|---|
| `OPEN_METEO_API_KEY` | Non | Clé de l'abonnement commercial Open-Meteo. Sans clé, l'API gratuite est utilisée. |

## Avant de contribuer

Cette version de Next.js comporte des changements importants. Consulte le guide concerné dans `node_modules/next/dist/docs/` avant d'écrire du code (voir `AGENTS.md`).
