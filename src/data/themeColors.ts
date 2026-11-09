import { contrastRatio, mixHex } from '../utils/color';

// Une couleur par thème pour la mosaïque de l'onglet « Propositions » — fixe,
// indépendante de l'accent choisi dans les réglages (le but est ici la variété
// colorée, pas la cohérence avec un seul accent).
//
// Trois contraintes façonnent ces valeurs, dans cet ordre :
//
//  1. LE TEXTE BLANC DOIT TENIR. La clarté n'est donc jamais choisie mais
//     CALCULÉE : pour chaque teinte on descend jusqu'à atteindre le contraste
//     visé. Mesuré ici de 4.60:1 à 5.76:1, là où le seuil AA est 4.5:1.
//
//     C'est la contrainte qui gouverne tout le reste, et elle est plus dure
//     qu'il n'y paraît. Une palette pastel demandée pour son côté clair
//     (clarté moyenne 73 %) ne peut PAS être reprise telle quelle : le blanc
//     n'y atteint que 1.39:1 à 3.33:1. La ramener au seuil la fait retomber à
//     43 % de clarté, où seule sa saturation subsiste. Un aplat qui porte du
//     texte blanc ne peut pas être pastel — les deux exigences s'excluent.
//
//  2. LES TEINTES DOIVENT RESTER DISTINCTES. Dériver mécaniquement une
//     palette existante rendait retraites/solidarités et santé/sécurité
//     rigoureusement identiques. Les quinze teintes sont donc réparties à la
//     main sur tout le cercle chromatique.
//
//  3. LES VOISINES DE GRILLE D'ABORD. La mosaïque a deux colonnes, et deux
//     cibles de contraste sont alternées EN DAMIER — alterner sur le seul
//     rang ne séparait que les voisines horizontales, jamais celles l'une
//     sous l'autre. Distance minimale entre deux tuiles qui se touchent : 45
//     sur l'échelle RVB.
//
//  4. ELLES SONT ADOUCIES, depuis. Quinze aplats à 74 % de saturation alignés
//     sur un même écran donnaient une mosaïque qui criait ; ils sont à 53 %.
//     La clarté, elle, n'a pas bougé d'un pouce : chaque teinte a été ramenée
//     au contraste qu'elle avait face au blanc, à deux centièmes près, ce qui
//     préserve le damier de la contrainte 3. C'est la distance entre voisines
//     qui paie, de 57 à 45 — assez pour qu'on les distingue encore, et c'est
//     le prix d'une mosaïque qu'on peut regarder.
//
// Depuis le passage à huit sujets (voir scripts/generate-data.js), la
// palette n'en garde que huit.
//
// PALETTE SOBRE : LES TUILES S'EFFACENT DEVANT L'ACCENT. L'app n'a plus
// qu'un accent saturé, l'iris, réservé à ce qu'on touche. Les huit tuiles
// sont donc ramenées à une même saturation, plus douce (0.12 en OKLCH, là où
// elles allaient de 0.08 à 0.20), et leurs teintes réparties en laissant libre
// la zone de l'iris : l'économie, qui était violette, aurait passé pour un
// bouton. Le damier de la contrainte 3 est rétabli tel quel (4.7:1 et 5.9:1
// face au blanc, en alternance), et deux tuiles qui se touchent ne partagent
// jamais une famille de teinte. Distance minimale entre voisines : 72.
export const THEME_COLORS: Record<string, string> = {
  economie: '#167AB1',
  travail: '#7F5F0B',

  sante: '#A24844',
  education: '#955FA5',

  ecologie: '#3D8241',
  logement: '#126F78',

  securite: '#9A4872',
  institutions: '#AA6221',
};

const FALLBACK_COLOR = '#4338CA';

// Plancher de contraste du texte blanc posé sur une tuile. Au-dessus du seuil
// AA (4.5) d'une marge volontaire : c'est la contrainte qu'on relâche pour en
// gagner une autre, et la relâcher jusqu'au seuil exact ne laisserait rien
// pour l'arrondi d'un futur réglage.
const PLANCHER_BLANC = 4.75;

// LA MÊME TEINTE, ÉCLAIRCIE SUR LA NUIT.
//
// Les quinze couleurs sont calculées pour porter du texte blanc, et elles le
// font dans les deux thèmes. Mais elles sont les mêmes partout, et sur une
// carte sombre huit d'entre elles tombaient entre 2.87:1 et 2.94:1 — sous les
// 3:1 qu'un aplat doit tenir pour qu'on voie où il commence.
//
// Plutôt que de réécrire à la main quinze valeurs pour le thème sombre, on
// remonte chaque teinte vers le blanc TANT QUE le texte blanc qu'elle porte
// reste au-dessus du plancher. La contrainte la plus dure garde la main, la
// teinte ne bouge que de ce qu'elle peut, et les couleurs tirées au sort par
// le mode arc-en-ciel passent par la même règle sans rien à prévoir.
//
// Mesuré sur les quinze : blanc de 4.60:1 à 5.03:1, tuile sur carte sombre de
// 3.40:1 à 3.74:1.
export function themeColorForScheme(baseColor: string, isDark: boolean): string {
  if (!isDark) return baseColor;
  let choisie = baseColor;
  for (let pas = 1; pas <= 30; pas++) {
    const essai = mixHex('#FFFFFF', baseColor, pas / 100);
    if (contrastRatio('#FFFFFF', essai) < PLANCHER_BLANC) break;
    choisie = essai;
  }
  return choisie;
}

export function getThemeColor(themeId: string): string {
  return THEME_COLORS[themeId] ?? FALLBACK_COLOR;
}

// Version douce d'une couleur de thème, pour les pastilles.
//
// Les valeurs ci-dessus sont des aplats saturés pensés pour porter du texte
// blanc : alignées à quinze dans une même liste, elles saturent l'écran. Ici
// on garde la teinte comme repère mais on la pose en fond très pâle, avec le
// texte dans la même teinte assombrie. Le dosage a été éprouvé sur les 360
// teintes possibles, et pas seulement sur les quinze de la palette fixe : le
// mode arc-en-ciel tire des couleurs au hasard, et les bleus très sombres
// tombaient à 4.34:1 avec un premier réglage. Pire cas actuel : 5.30:1 en
// thème clair, 5.37:1 en sombre.
export function themeChipColors(
  baseColor: string,
  surface: string,
  isDark: boolean
): { background: string; text: string } {
  return isDark
    ? {
        background: mixHex(baseColor, surface, 0.1),
        text: mixHex('#FFFFFF', baseColor, 0.5),
      }
    : {
        background: mixHex(baseColor, surface, 0.08),
        text: mixHex('#000000', baseColor, 0.1),
      };
}
