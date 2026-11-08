# WeatherMind

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
public/       Fichiers statiques
```

## Avant de contribuer

Cette version de Next.js comporte des changements importants. Consulte le guide concerné dans `node_modules/next/dist/docs/` avant d'écrire du code (voir `AGENTS.md`).
