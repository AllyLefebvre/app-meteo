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
lib/weather/  Client météo (serveur) et types de la réponse normalisée
public/       Fichiers statiques
```

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

### Route `GET /api/weather`

Point d'entrée des données météo pour l'interface : `app/api/weather/route.ts`. Le contrat (types d'erreur, statuts, lecture des paramètres) est dans `lib/weather/api.ts`, importable côté client.

```
GET /api/weather?lat=45.5017&lon=-73.5673
```

- `lat` et `lon` : nombres décimaux (« 45.5017 », « -73.5673 »), entre -90 et 90 pour la latitude et entre -180 et 180 pour la longitude. Ils sont arrondis à 4 décimales (environ 11 m) pour que des recherches voisines partagent le même cache.
- **200** : un objet `WeatherData`, avec l'en-tête `Cache-Control: public, max-age=300, stale-while-revalidate=300`.
- **Erreur** : `{ "error": { "code": "…", "message": "…" } }`, avec l'en-tête `Cache-Control: no-store`. Le message est en français et peut être affiché tel quel.

| Code | Statut | Cas |
|---|---|---|
| `INVALID_PARAMS` | 400 | `lat` ou `lon` absent ou non numérique |
| `INVALID_COORDINATES` | 400 | Coordonnées hors limites |
| `NETWORK` | 502 | Open-Meteo injoignable ou délai dépassé (8 s) |
| `PROVIDER` | 502 | Open-Meteo a répondu avec une erreur |
| `INVALID_RESPONSE` | 502 | Réponse d'Open-Meteo dans un format inattendu |
| `INTERNAL` | 500 | Erreur inattendue |

Pour les erreurs 502, le détail technique est écrit dans les journaux du serveur, pas dans la réponse.

Côté serveur, un même point n'est demandé à Open-Meteo qu'une fois toutes les 10 minutes : les appels suivants sont servis par le cache de Next.js.

## Avant de contribuer

Cette version de Next.js comporte des changements importants. Consulte le guide concerné dans `node_modules/next/dist/docs/` avant d'écrire du code (voir `AGENTS.md`).
