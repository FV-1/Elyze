# Elyze — Design System

Référence unique pour toute production visuelle Elyze (app, visuels store, carrousels sociaux).
À coller dans le contexte de Claude Code ou à garder à la racine du projet.

---

## 1. Couleurs

### Tokens

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#1A1625` | Texte principal, fonds noirs, bordures, boutons primaires |
| `--cream` | `#F2ECDF` | Fond clair par défaut (app en thème clair, slides claires) |
| `--cream-2` | `#E6DFD2` | Fond de panneau secondaire sur crème, pistes de toggle inactives |
| `--white` | `#FFFFFF` | Cartes posées sur crème (le seul vrai blanc) |
| `--night` | `#1E1233` | Fond violet foncé (slides sombres) |
| `--night-2` | `#241A33` | Panneau secondaire sur fond sombre |
| `--lime` | `#D4FF3F` | Accent n°1 : surlignages, badges, état actif, validation |
| `--violet` | `#6B4FFF` | Accent n°2 : labels de catégorie, liens, données |
| `--peach` | `#FFAB76` | Accent n°3 : 3ᵉ place, rejet, chaleur |
| `--lavender` | `#C9B4FF` | Blobs de fond uniquement, jamais du texte |

### Neutres de texte

| Token | Hex | Usage |
|---|---|---|
| `--ink-2` | `#3A2F47` | Corps de texte sur crème |
| `--ink-3` | `#5D4F6E` | Métadonnées, labels mono sur crème |
| `--sand` | `#CFC6B8` | Traits de séparation, jauges vides, 3ᵉ place neutre |
| `--cream-on-night` | `#F2ECDF` | Texte principal sur fond sombre |
| `--muted-on-night` | `#B4A6C6` | Métadonnées sur fond sombre |

### Règle de palette — la plus importante

**Un seul accent dominant par écran ou par slide.** L'app entière utilise les quatre accents, mais un
onglet donné n'en montre qu'un. Ex. : Swipe = lime, Arguments = violet, Candidats = pêche, Thèmes = lime.

- Maximum 2 couleurs de fond par livrable (crème + une sombre).
- Les accents ne servent jamais de fond de grande surface, sauf le lime sur une barre de podium
  ou un badge.
- Pas de dégradés multicolores, sauf s'ils sont le sujet même du visuel.

### Contraste

- Texte courant : 4.5:1 minimum. Sur lime, toujours `--ink` (jamais du blanc).
- Sur `--night`, ne pas descendre sous `--muted-on-night` pour du texte lisible.
- Les accents à pleine opacité pour le texte ; jamais de `opacity` ou `color-mix` sur de la typo.

---

## 2. Typographie

Deux familles, Google Fonts :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Space Grotesk** — titres (700) et corps de texte (400/500). Géométrique, bold.
- **DM Mono** — labels, compteurs, pourcentages, métadonnées. Toujours en capitales avec
  `letter-spacing: 0.08em` à `0.14em` pour les labels.

### Échelle (base 1080 px de large — visuels sociaux et captures store)

| Rôle | Taille | Poids | Interlignage | Letter-spacing |
|---|---|---|---|---|
| Titre de slide (display) | 82–104 px | 700 | 0.95–1.08 | −0.045em |
| Titre de section dans l'UI | 36–44 px | 700 | 1.1 | −0.03em |
| Texte de carte / proposition | 42–44 px | 700 | 1.2 | −0.02em |
| Sous-titre / chapô | 30–34 px | 400 | 1.3 | normal |
| Corps de texte UI | 25–30 px | 400 | 1.35 | normal |
| Label mono | 21–26 px | 400 | 1 | 0.08–0.14em |

Minimum absolu : **21 px** sur un canevas 1080 px. Rien en dessous.

Sur un écran web fluide, diviser par ~2.5 (titre 34–42 px, corps 16–18 px).

Titres : `text-wrap: pretty` systématique.

---

## 3. Éléments graphiques signature

### Blobs de fond

Cercles en dégradé radial, coupés par les bords, semi-transparents. 1 à 2 par visuel, jamais 3.

```css
position: absolute;
width: 860px; height: 860px;         /* 0.7–0.85 × la largeur du canevas */
border-radius: 50%;
background: radial-gradient(circle at 30% 30%, #D4FF3F, rgba(212,255,63,0));
top: -300px; right: -280px;          /* au moins 1/3 hors cadre */
opacity: 0.7;                        /* 0.55–0.8 */
```

Le conteneur parent est `position: relative; overflow: hidden;` et le contenu est lui aussi
`position: relative` pour passer au-dessus.

### Badges pilule

```css
/* sombre sur fond clair */
background: #1A1625; color: #D4FF3F;
font-family: 'DM Mono', monospace; font-size: 24px; letter-spacing: 0.12em;
padding: 12px 22px; border-radius: 999px;

/* lime sur fond sombre */
background: #D4FF3F; color: #1E1233;

/* contour, sur fond clair */
border: 2px solid #1A1625; color: #1A1625; background: transparent;
```

### Surlignage de titre

```css
background: #D4FF3F;
padding: 2px 16px;
border-radius: 16px;
box-decoration-break: clone;
-webkit-box-decoration-break: clone;
```

Le titre qui le contient doit avoir `line-height: 1.02` minimum, sinon les lignes se chevauchent.

### Rayons

| Élément | Rayon |
|---|---|
| Cadre de téléphone / grande carte | 44–56 px |
| Carte de contenu | 28–44 px |
| Ligne de liste, petite carte | 24–28 px |
| Pilule, bouton, avatar | `999px` / `50%` |

### Cadre de téléphone (captures store)

```css
background: #FFFFFF;
border: 6px solid #1A1625;
border-radius: 56px;
overflow: hidden;
padding: 28px 26px;
```

### Avatars et photos manquantes

Placeholder rayé, jamais un aplat gris :

```css
background: repeating-linear-gradient(135deg, #D5CBBD 0 8px, #CFC4B4 8px 16px);
border: 4px solid #1A1625;
border-radius: 50%;
```

### Ce qu'on n'utilise pas

- Ombres portées (l'identité est plate, le contraste vient des aplats et du trait d'encre).
- Dégradés de fond pleine surface.
- Bordures colorées en accent à gauche d'une carte.
- Plus d'un emoji par écran, et seulement s'il est dans le texte fourni.
- Icônes dessinées en SVG ad hoc : privilégier des glyphes simples (`✓ ✕ — ↺ ★ ‹ ≡ ⌂`).

---

## 4. Mise en page

### Formats

| Livrable | Dimensions |
|---|---|
| Capture store | 1080 × 1920 |
| Carrousel Instagram | 1080 × 1080 |
| Couverture / bannière | 1024 × 500 |
| Icône app | 512 × 512 |

Ces formats gardent des pixels fixes. Tout autre livrable (page web, doc) doit être fluide :
`max-width`, pas de `width` fixe, grilles en `minmax(0, 1fr)`.

### Espacements

Padding extérieur d'un visuel 1080 : `64px 68px` (carrousel) ou `64px 52px 52px` (capture store).
Gouttières internes : 18 / 22 / 26 / 40 px. Tout en `display: flex` ou `grid` avec `gap`, jamais
des marges par élément ni des espaces inline.

### Structure d'une slide

Trois zones en `justify-content: space-between` :
1. En-tête — logo `elyze` + compteur mono (`01 / 03`).
2. Bloc central — badge, titre, texte.
3. Pied — CTA ou métadonnée + indicateur de position (3 points de 20 px).

Beaucoup de vide. Si une zone paraît creuse, c'est un problème de mise en page, pas un manque
de contenu : ne pas remplir.

---

## 5. Logo et ton

- Logo : `elyze` en minuscules, Space Grotesk 700, `letter-spacing: -0.02em`, encre sur crème
  ou crème sur sombre. Jamais en accent, jamais en capitales.
- Nom en prose : « Elyze » avec majuscule.
- Ton des textes : factuel, direct, tutoiement. Pas de superlatifs, pas de métadiscours.
- L'app ne tranche jamais politiquement — le vocabulaire reste neutre (« ce qu'en disent ses
  partisans / ses opposants », « c'est à toi d'en juger »).

---

## 6. Gabarit de départ

```html
<div style="width: 1080px; height: 1080px; background: #F2ECDF; position: relative;
            overflow: hidden; display: flex; flex-direction: column;
            justify-content: space-between; padding: 64px 68px; box-sizing: border-box;
            font-family: 'Space Grotesk', system-ui, sans-serif;">

  <div style="position: absolute; width: 860px; height: 860px; border-radius: 50%;
              background: radial-gradient(circle at 30% 30%, #D4FF3F, rgba(212,255,63,0));
              top: -300px; right: -280px; opacity: 0.75;"></div>

  <div style="position: relative; display: flex; align-items: center;
              justify-content: space-between;">
    <div style="font-size: 38px; font-weight: 700; letter-spacing: -0.02em;
                color: #1A1625;">elyze</div>
    <div style="font-family: 'DM Mono', monospace; font-size: 24px;
                letter-spacing: 0.08em; color: #5D4F6E;">01 / 03</div>
  </div>

  <div style="position: relative; display: flex; flex-direction: column; gap: 32px;">
    <div style="align-self: flex-start; background: #1A1625; color: #D4FF3F;
                font-family: 'DM Mono', monospace; font-size: 24px;
                letter-spacing: 0.12em; padding: 12px 22px; border-radius: 999px;">BADGE</div>
    <h1 style="margin: 0; font-size: 92px; line-height: 1.02; font-weight: 700;
               letter-spacing: -0.045em; color: #1A1625; text-wrap: pretty;">Titre</h1>
    <div style="font-size: 34px; line-height: 1.3; color: #3A2F47;
                max-width: 700px;">Sous-titre.</div>
  </div>

  <div style="position: relative; display: flex; align-items: center;
              justify-content: space-between;">
    <div style="background: #1A1625; color: #D4FF3F; font-size: 36px; font-weight: 700;
                padding: 26px 40px; border-radius: 999px;">CTA</div>
    <div style="display: flex; gap: 12px;">
      <div style="width: 20px; height: 20px; border-radius: 50%; background: #1A1625;"></div>
      <div style="width: 20px; height: 20px; border-radius: 50%; background: #CFC6B8;"></div>
      <div style="width: 20px; height: 20px; border-radius: 50%; background: #CFC6B8;"></div>
    </div>
  </div>
</div>
```

---

## 7. Checklist avant livraison

- [ ] Un seul accent dominant sur l'écran / la slide.
- [ ] Deux fonds maximum sur l'ensemble du livrable.
- [ ] Aucun texte sous 21 px (canevas 1080).
- [ ] Space Grotesk pour tout, sauf labels et chiffres en DM Mono capitales espacées.
- [ ] Un ou deux blobs, coupés par le bord, opacité ≤ 0,8.
- [ ] Pas d'ombre portée, pas de dégradé de fond.
- [ ] Logo `elyze` en minuscules, en encre ou en crème.
- [ ] Layout en flex/grid + `gap`.
- [ ] Rien n'est ajouté « pour remplir ».
