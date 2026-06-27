# Session SonarQube — 27 juin 2026

## Résultats

| Métrique | Avant | Après |
|---|---|---|
| Issues | 56 | **0** |
| Duplication de code | 4.9% | **0%** |
| Couverture de tests | 0% | **84%** |
| Tests | 0 | **47 (15 fichiers)** |

---

## 1. Correction des 56 issues SonarQube

### CSS (`S125`, `S4666`, `S7924`)
- **`welcome.module.css`** — suppression du code commenté, fusion des blocs `.imageLeft` et `.jobTitleContainer` dupliqués
- **`contact.module.css`** — fusion des deux blocs `.icons a`, couleur du bouton `#4cb1fa` → `#0d77d1` (contraste WCAG AA ~5:1)
- **`conception.module.css`** / **`about.module.css`** — suppression de toutes les lignes commentées

### Hooks (`S7721`, `S7723`, `S7764`)
- **`useRandomLetters.ts`** — `getSecureRandomIndex` sorti du hook au niveau module, `window.crypto` → `globalThis.crypto`, `Array(n)` → `new Array(n)`

### Composants React (`S6478`, `S6479`, `S2004`, `S6819`, `S4084`, `S1082`, `S6848`, `S7748`, `S7776`, `S1854`, `S6749`, `S6759`)
- **`welcome.tsx`** — remplacement des lambdas imbriquées par des fonctions nommées dans `useEffect`, clés stables via `useMemo` sur l'array de lettres
- **`projects.tsx`** — `<div role="button">` remplacé par `<button type="button">` (élément natif), `key={project.key}`, ajout de `<track kind="captions" />`
- **`about.tsx`** / **`backend.tsx`** / **`conception.tsx`** / **`frontend.tsx`** / **`devops.tsx`** — renderers inline remplacés par des fonctions stables hors du composant
- **`devops.tsx`** — `Array` → `Set` pour `RECT_ICONS`, `.includes()` → `.has()`, `1.0` → `1`
- **`layout.tsx`** — props typées `readonly`
- **`page.tsx`** — import `useTranslations` inutilisé supprimé, fragment redondant retiré

### Utilitaire partagé
- **`app/[locale]/utils/renderers.tsx`** (créé) — `renderStrong` et `makeSpanRenderer` centralisés, importés dans tous les composants

---

## 2. Réduction de la duplication (4.9% → 0%)

`backend.tsx` et `frontend.tsx` avaient une structure JSX quasi-identique (100 lignes, 4 blocs signalés).

**Solution** : extraction d'un composant partagé `ToolsSection`.

```
app/[locale]/Components/BackEnd/ToolsSection.tsx  (nouveau)
```

Props : `titleKey`, `descriptionPrefix`, `stepCount`, `images`, `reverse`, `altPrefix`

`backend.tsx` et `frontend.tsx` sont réduits à ~20 lignes chacun — de simples wrappers qui passent leurs données propres à `ToolsSection`.

---

## 3. Mise en place des tests (0% → 84%)

### Stack installée
- `vitest` + `@vitest/coverage-v8`
- `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom`
- `jsdom` + `@vitejs/plugin-react`

### Fichiers de configuration
| Fichier | Rôle |
|---|---|
| `vitest.config.ts` | Runner + couverture lcov |
| `vitest.setup.ts` | jest-dom + mock `HTMLMediaElement` |
| `vitest.d.ts` | Types globaux Vitest |
| `__mocks__/styleMock.js` | Proxy CSS modules (retourne le nom de classe) |
| `sonar-project.properties` | `sonar.javascript.lcov.reportPaths=coverage/lcov.info` |

### Stratégies de mock utilisées
- `next-intl` → `Object.assign(t, { rich: t })` (fonction + méthode `.rich`)
- `next/image` → `<img>` natif
- `next/font/google` → `() => ({ className: '...' })`
- `react-scroll` → `<a>` natif
- `embla-carousel-react` → `() => [vi.fn(), null]`
- CSS modules → Proxy identity via plugin Vite
- `IntersectionObserver` → `vi.fn(function() { return { observe, disconnect } })` (fonction régulière, constructible)
- `fetch` → `vi.stubGlobal('fetch', vi.fn(...))`

### Les 47 tests

| Fichier | Tests | Couverture |
|---|---|---|
| `renderers.test.tsx` | 4 | 100% |
| `useTypingText.test.ts` | 4 | 100% |
| `useRandomLetters.test.ts` | 4 | 100% |
| `LocaleSelect.test.tsx` | 3 | 100% |
| `Contact.test.tsx` | 4 | 90% |
| `ToolsSection.test.tsx` | 4 | 100% |
| `Projects.test.tsx` | 3 | 100% |
| `About.test.tsx` | 3 | 100% |
| `BackEnd.test.tsx` | 1 | 100% |
| `FrontEnd.test.tsx` | 1 | 100% |
| `MyTools.test.tsx` | 2 | 100% |
| `Conception.test.tsx` | 3 | 100% |
| `DevOps.test.tsx` | 4 | 67% |
| `Navbar.test.tsx` | 4 | 83% |
| `Welcome.test.tsx` | 3 | 67% |

---

## Commandes

```bash
npm run test             # mode watch
npm run test:coverage    # génère coverage/lcov.info (requis avant chaque scan)
```

> Toujours lancer `npm run test:coverage` avant un scan SonarQube.
