import { contrastRatio, mixHex } from '../utils/color';

// --- LA PALETTE, ET RIEN D'AUTRE --------------------------------------------
//
// Toute couleur affichée par l'app en sort, directement ou par un mélange
// calculé plus bas. Le test theme/palette.test.ts y veille.
//
// UNE IDENTITÉ SOBRE. L'app avait une crème, une nuit violacée et trois
// accents vifs (lime, violet, pêche), un par écran. Pour un comparateur de
// programmes, c'était beaucoup de couleur autour d'un contenu qui demande
// d'abord du calme. Il reste des gris neutres et une encre : l'accent est
// l'encre elle-même, noire sur fond clair, blanche sur fond sombre. La
// couleur est réservée à ce qui porte un sens — les trois réponses du swipe,
// les thèmes et les médailles du podium.
export const PALETTE = {
  ink: '#18181B',
  ink2: '#3F3F46',
  ink3: '#5E5E66',

  paper: '#F5F5F6',
  paper2: '#EBEBED',
  white: '#FFFFFF',
  line: '#DCDCE0',

  night: '#111113',
  night2: '#1C1C1F',
  // Trois niveaux de texte sur fond sombre, comme en thème clair.
  snow: '#F4F4F5',
  snowDim: '#D4D4D8',
  mutedOnNight: '#A1A1AA',

  // Les marches du podium : or, argent et bronze, assourdis. L'encre s'écrit
  // dessus.
  gold: '#D8BC6A',
  silver: '#C6C8CD',
  bronze: '#CF9F78',

  // LES TROIS RÉPONSES ONT LEUR PROPRE COULEUR, ET NON CELLE DE L'ACCENT.
  //
  // Valider, c'était le lime — la couleur de l'écran de swipe ; refuser,
  // c'était la pêche ; et le super like prenait l'encre, donc un rond noir au
  // milieu de la rangée. Trois choix qui tenaient à une palette de trois
  // teintes, et qui demandaient à l'œil d'apprendre ce que chacune veut dire.
  // Le vert, le rouge et le jaune, eux, n'ont rien à apprendre à personne.
  //
  // LE VERT ET LE ROUGE SONT LA PAIRE QUE 8 % DES HOMMES CONFONDENT, et c'est
  // l'ennui du choix le plus évident qui soit. Le pictogramme les distingue
  // déjà — un cœur, une croix, et le sens du geste — mais la couleur peut
  // aider au lieu de s'en remettre à lui. Les deux teintes ont donc été
  // écartées EN CLARTÉ, la seule dimension qu'une vision deutéranope
  // conserve : simulées, elles passent d'une distance de 8 à 19 sur 100 en
  // thème clair, de 4 à 20 en sombre. Le rouge ne peut pas descendre plus bas
  // sans que l'encre du tampon cesse de s'y lire.
  //
  // Chaque teinte a trois valeurs, parce qu'une couleur ne fait pas le même
  // travail selon l'endroit : l'APLAT porte un signe d'encre (bouton plein,
  // tampon de swipe), l'ENCRE colorée s'écrit sur un fond très pâle de la même
  // teinte (le glyphe d'un bouton teinté), et la NUIT remplace les deux à la
  // fois — sur un fond sombre, une teinte claire sert d'aplat comme de signe.
  green: '#93C97F',
  greenInk: '#3A6C33',
  greenNight: '#ADD79E',

  red: '#D96860',
  redInk: '#A8352E',
  redNight: '#E28881',

  amber: '#E8C25A',
  amberInk: '#755A0E',
  amberNight: '#E6C169',
} as const;

// --- UN SEUL ACCENT ---------------------------------------------------------
//
// Chaque écran avait son accent (le swipe lime, le classement violet, les
// propositions pêche). L'identité sobre n'en garde qu'un, l'encre, partout.
// Les trois emplacements restent, pour que les écrans n'aient pas à changer
// leur façon de demander leur palette, mais ils donnent tous la même.
export type AccentId = 'lime' | 'violet' | 'peach';

export const ACCENTS: Record<AccentId, string> = {
  lime: PALETTE.ink,
  violet: PALETTE.ink,
  peach: PALETTE.ink,
};

export const DEFAULT_ACCENT: AccentId = 'lime';

export function isKnownAccentId(id: string): id is AccentId {
  return id === 'lime' || id === 'violet' || id === 'peach';
}

export type ColorTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  // Trait de séparation ordinaire. Discret, il range sans souligner.
  border: string;
  // Le trait qui doit tenir tout seul : un cadre de carte, un avatar, une
  // pastille cernée.
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // L'ACCENT, pour les petites surfaces : badge, état actif, jauge remplie.
  // C'est l'encre du thème ; `onAccent` est ce qu'on écrit dessus.
  accent: string;
  onAccent: string;
  accentSoft: string;

  // L'ACTION FORTE — le bouton plein, celui qu'on vient toucher.
  action: string;
  onAction: string;
  // L'état pressé de cette action.
  actionPressed: string;
  // L'accent en TEXTE sur un fond neutre : liens, libellés actifs.
  accentText: string;

  // Les quatre réponses du swipe. Ce sont des FONDS, pas des couleurs de
  // glyphe : sur cette palette, la couleur vit dans l'aplat et le signe qu'on
  // pose dessus reste de l'encre. Les variantes `…Text` servent aux rares
  // endroits où il faut écrire la notion sans pouvoir la remplir.
  success: string;
  successSoft: string;
  successText: string;
  onAccentSuccess: string;
  warning: string;
  warningSoft: string;
  warningText: string;
  onAccentWarning: string;
  danger: string;
  dangerSoft: string;
  dangerText: string;
  onAccentDanger: string;

  neutralFill: string;
  neutralTrack: string;
};

const base = {
  light: {
    bg: PALETTE.paper,
    surface: PALETTE.white,
    surfaceAlt: PALETTE.paper2,
    border: PALETTE.line,
    borderStrong: PALETTE.ink3,
    textPrimary: PALETTE.ink,
    textSecondary: PALETTE.ink2,
    textMuted: PALETTE.ink3,
    neutralFill: PALETTE.ink3,
    neutralTrack: PALETTE.paper2,
  },
  dark: {
    bg: PALETTE.night,
    // Sur fond sombre une ombre ne se voit pas : la carte se détache par son
    // fond, un cran plus clair que la page.
    surface: PALETTE.night2,
    surfaceAlt: '#27272B',
    border: '#2E2E33',
    borderStrong: '#6E6E77',
    textPrimary: PALETTE.snow,
    textSecondary: PALETTE.snowDim,
    textMuted: PALETTE.mutedOnNight,
    neutralFill: PALETTE.mutedOnNight,
    neutralTrack: '#2E2E33',
  },
} as const;

// Ce qu'on peut écrire sur un aplat de couleur : de l'encre, ou du blanc. On
// garde celle qui se lit le mieux.
function surAccent(hue: string): string {
  return contrastRatio(PALETTE.ink, hue) >= contrastRatio(PALETTE.white, hue)
    ? PALETTE.ink
    : PALETTE.white;
}

export function buildColors(scheme: 'light' | 'dark', _accentId: string): ColorTokens {
  const b = base[scheme];
  const sombre = scheme === 'dark';
  // L'accent est l'encre du thème : noire sur clair, blanche sur sombre.
  const encre = sombre ? PALETTE.snow : PALETTE.ink;
  const surEncre = sombre ? PALETTE.ink : PALETTE.white;

  return {
    ...b,

    accent: encre,
    onAccent: surEncre,
    accentSoft: mixHex(encre, b.surface, sombre ? 0.12 : 0.08),
    accentText: encre,
    action: encre,
    onAction: surEncre,
    actionPressed: mixHex(sombre ? PALETTE.night : PALETTE.white, encre, 0.2),

    // LES TROIS RÉPONSES, chacune sur sa teinte (voir PALETTE).
    //
    // Le fond très pâle et l'encre colorée vont ENSEMBLE : c'est le couple qui
    // habille un bouton teinté, un glyphe vert sur un rond vert pâle. Le
    // mélange est plus faible qu'avant (0.10 au lieu de 0.26) parce que le
    // glyphe se pose dessus : plus le fond est teinté, moins on lit ce qui est
    // écrit par-dessus. En thème sombre, une seule valeur fait les deux rôles.
    success: sombre ? PALETTE.greenNight : PALETTE.green,
    successSoft: mixHex(sombre ? PALETTE.greenNight : PALETTE.green, b.surface, sombre ? 0.08 : 0.1),
    successText: sombre ? PALETTE.greenNight : PALETTE.greenInk,
    onAccentSuccess: surAccent(sombre ? PALETTE.greenNight : PALETTE.green),

    warning: sombre ? PALETTE.amberNight : PALETTE.amber,
    warningSoft: mixHex(sombre ? PALETTE.amberNight : PALETTE.amber, b.surface, sombre ? 0.08 : 0.1),
    warningText: sombre ? PALETTE.amberNight : PALETTE.amberInk,
    onAccentWarning: surAccent(sombre ? PALETTE.amberNight : PALETTE.amber),

    danger: sombre ? PALETTE.redNight : PALETTE.red,
    dangerSoft: mixHex(sombre ? PALETTE.redNight : PALETTE.red, b.surface, sombre ? 0.08 : 0.1),
    dangerText: sombre ? PALETTE.redNight : PALETTE.redInk,
    onAccentDanger: surAccent(sombre ? PALETTE.redNight : PALETTE.red),
  };
}

// Palettes fixes, indépendantes du contexte de thème — utilisées uniquement
// par l'ErrorBoundary, qui doit pouvoir s'afficher même si le système de thème
// lui-même est en cause.
export const lightColors: ColorTokens = buildColors('light', DEFAULT_ACCENT);
export const darkColors: ColorTokens = buildColors('dark', DEFAULT_ACCENT);

// --- FORMES ----------------------------------------------------------------
//
// Une ombre à peine marquée, la même partout, pour poser une carte sur la
// page. Elle ne se voit pas sur fond sombre : là, ce sont les fonds qui font
// le relief (voir `surface` du thème sombre).
export const ombre = {
  shadowColor: PALETTE.ink,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 1,
} as const;

// Des arrondis mesurés : assez pour adoucir, pas assez pour qu'on les remarque.
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// --- TYPOGRAPHIE ------------------------------------------------------------
//
// Inter pour tout, y compris les étiquettes et les chiffres, qui avaient leur
// police à part (DM Mono). Une seule famille, embarquée (voir App.tsx) : aucune
// police n'est téléchargée à l'exécution.
//
// LA GRAISSE EST DANS LE NOM DE LA FAMILLE : avec une police embarquée,
// `fontWeight` n'a aucun effet sur Android. C'est le composant `Texte` qui
// traduit l'un en l'autre.
//
// `mono` reste un nom, pas une autre police : c'est le rôle « étiquette ou
// chiffre », écrit en Inter un cran plus gras.
export const police = {
  sans: {
    400: 'Inter_400Regular',
    500: 'Inter_500Medium',
    600: 'Inter_600SemiBold',
    700: 'Inter_700Bold',
  },
  mono: {
    400: 'Inter_500Medium',
    500: 'Inter_600SemiBold',
  },
} as const;

// L'échelle du document, divisée par ~2.5 pour un écran de téléphone, arrondie
// à des tailles qui tombent juste. Le plancher est à 12 : en dessous, un
// libellé mono espacé de 0.12em cesse d'être lisible.
export const fonts = {
  // TOUTES LES ÉTIQUETTES À LA MÊME TAILLE. Pastilles de thème, puces d'accord
  // ou de désaccord, compteurs de fiche : elles s'écrivaient entre 11 et 15 px
  // selon l'écran, un écart qu'on ne voyait pas tant que la typographie était
  // celle du système. Avec une police embarquée, les mêmes deux pixels d'écart
  // se lisent comme deux styles différents. Une étiquette est une étiquette,
  // elle a une taille.
  etiquette: 12,
  hero: 44,
  title: 28,
  // Le texte de la carte de swipe, plafond avant que la mesure ne le réduise
  // selon sa longueur. Un pixel de moins qu'avant : la typographie est plus
  // large, et la même taille ne portait plus le même nombre de mots.
  cardText: 23,
  body: 17,
  small: 14,
  tiny: 12,
} as const;

// Interlettrage des étiquettes, toujours en capitales. Inter est plus serrée
// qu'une police mono : un léger espacement suffit.
export const MONO_SPACING = 0.6;
