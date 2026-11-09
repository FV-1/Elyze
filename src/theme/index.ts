import { contrastRatio, mixHex } from '../utils/color';

// --- LA PALETTE, ET RIEN D'AUTRE --------------------------------------------
//
// Toute couleur affichée par l'app en sort, directement ou par un mélange
// calculé plus bas. Le test theme/palette.test.ts y veille.
//
// UNE PALETTE SOBRE. La crème, la nuit violacée et les trois accents vifs
// (lime, violet, pêche) cèdent la place à des gris légèrement froids et à un
// seul accent, un bleu-gris pâle. Les gris suivent l'échelle « slate » de
// Radix Colors, dont chaque cran a un rôle : fonds, bordures discrètes,
// bordures d'éléments interactifs, texte. L'accent garde le rôle exact du
// lime qu'il remplace — une teinte claire sur laquelle s'écrit l'encre —, si
// bien que chaque écran garde sa construction ; seules les couleurs changent.
export const PALETTE = {
  ink: '#1C2024',
  ink2: '#40444C',
  ink3: '#60646C',

  paper: '#F0F0F3',
  paper2: '#E8E8EC',
  white: '#FFFFFF',
  line: '#D9D9E0',
  // Le contour qui doit tenir seul (un champ de saisie, une carte cernée).
  // C'était l'encre pâle, à 7:1 : un trait de feutre autour de chaque
  // élément. Ce gris moyen tient les 3:1 que le WCAG demande à un contour
  // d'élément d'interface, et rien de plus.
  outline: '#80838D',

  night: '#111113',
  night2: '#212225',
  night3: '#2E3135',
  lineNight: '#363A3F',
  outlineNight: '#6C717A',
  snow: '#EDEEF0',
  snowDim: '#CDD0D5',
  mutedOnNight: '#B0B4BA',

  // L'accent unique, un bleu-gris pâle, et sa variante pour fond sombre, un
  // cran plus éteinte pour ne pas briller sur la nuit.
  accent: '#C3CEE3',
  accentNight: '#A9B8D3',

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
  // Fonds décoratifs seulement (les cercles flous de l'accueil). Jamais du
  // texte.
  lavender: '#D5DCEA',
} as const;

// --- UN SEUL ACCENT ---------------------------------------------------------
//
// Chaque écran avait son accent (le swipe lime, le classement violet, les
// propositions pêche). La palette sobre n'en garde qu'un, le même partout.
// Les trois emplacements restent, pour que les écrans continuent de demander
// leur palette de la même façon, mais ils donnent tous le même accent.
export type AccentId = 'lime' | 'violet' | 'peach';

export const ACCENTS: Record<AccentId, string> = {
  lime: PALETTE.accent,
  violet: PALETTE.accent,
  peach: PALETTE.accent,
};

export const DEFAULT_ACCENT: AccentId = 'lime';

export function isKnownAccentId(id: string): id is AccentId {
  return id === 'lime' || id === 'violet' || id === 'peach';
}

export type ColorTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  // Trait de séparation ordinaire : le sable sur crème, un violet sourd sur la
  // nuit. Discret, il range sans souligner.
  border: string;
  // LE TRAIT D'ENCRE. L'identité est plate — pas d'ombre portée, pas de
  // dégradé — donc ce qui détache un élément de son fond est son contour.
  // Réservé à ce qui doit tenir tout seul : un cadre de carte, un avatar, une
  // pastille cernée.
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // L'ACCENT LUI-MÊME, pour les PETITES surfaces : badge, état actif, marche
  // de podium, jauge remplie. C'est là que la couleur de l'écran se voit.
  // `onAccent` est ce qu'on écrit dessus — de l'encre sur le lime et la pêche,
  // du blanc sur le violet, qui ne tient pas la crème (4.26:1).
  accent: string;
  onAccent: string;
  accentSoft: string;

  // L'ACTION FORTE — le bouton plein, celui qu'on vient toucher.
  //
  // Le document le montre en pastille d'encre portant l'accent : c'est le cas
  // du lime et de la pêche. Le violet, lui, ne se lit pas sur l'encre (3.53:1)
  // et devient donc le fond, avec du blanc dessus. Un bouton n'est pas une
  // « grande surface » au sens du document — un fond d'écran l'est.
  action: string;
  onAction: string;
  // L'état pressé de cette action.
  actionPressed: string;
  // L'accent en TEXTE sur un fond neutre, quand il peut s'y lire. Le violet le
  // peut, le lime et la pêche non : ils cèdent la place à l'encre plutôt que
  // de s'assombrir en une couleur qui n'est plus la leur.
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
    borderStrong: PALETTE.outline,
    textPrimary: PALETTE.ink,
    textSecondary: PALETTE.ink2,
    textMuted: PALETTE.ink3,
    neutralFill: PALETTE.ink3,
    neutralTrack: PALETTE.paper2,
  },
  dark: {
    bg: PALETTE.night,
    // Sur la nuit une ombre ne se voit pas : la carte se détache par son fond,
    // un cran plus clair que la page.
    surface: PALETTE.night2,
    surfaceAlt: PALETTE.night3,
    border: PALETTE.lineNight,
    borderStrong: PALETTE.outlineNight,
    textPrimary: PALETTE.snow,
    textSecondary: PALETTE.snowDim,
    textMuted: PALETTE.mutedOnNight,
    neutralFill: PALETTE.mutedOnNight,
    // Un cran au-dessus de la page : à la couleur du fond, la partie vide de
    // la barre de progression disparaissait.
    neutralTrack: PALETTE.night3,
  },
} as const;

// Ce qu'on peut écrire sur un aplat d'accent : de l'encre, ou du blanc. Deux
// valeurs de la palette, et on garde celle qui se lit le mieux — sans jamais
// fabriquer une troisième couleur pour s'en sortir.
function surAccent(hue: string): string {
  return contrastRatio(PALETTE.ink, hue) >= contrastRatio(PALETTE.white, hue)
    ? PALETTE.ink
    : PALETTE.white;
}

// Le bouton plein. Sur fond clair, c'est une pastille d'encre qui porte
// l'accent — sauf si l'accent ne s'y lit pas, auquel cas les rôles s'inversent.
// Sur fond sombre, l'encre disparaîtrait dans la nuit : c'est l'accent qui
// devient le fond.
function actionColors(scheme: 'light' | 'dark', hue: string) {
  if (scheme === 'dark' || contrastRatio(hue, PALETTE.ink) < 4.5) {
    return {
      action: hue,
      onAction: surAccent(hue),
      actionPressed: mixHex(PALETTE.ink, hue, 0.2),
    };
  }
  return {
    action: PALETTE.ink,
    onAction: hue,
    actionPressed: mixHex(PALETTE.white, PALETTE.ink, 0.16),
  };
}

export function buildColors(scheme: 'light' | 'dark', accentId: string): ColorTokens {
  const b = base[scheme];
  const sombre = scheme === 'dark';
  const hue = sombre
    ? PALETTE.accentNight
    : ACCENTS[isKnownAccentId(accentId) ? accentId : DEFAULT_ACCENT];

  // UN ACCENT EN TEXTE, OU PAS D'ACCENT DU TOUT.
  //
  // DESIGN.md est net là-dessus : « les accents à pleine opacité pour le
  // texte ; jamais de opacity ou color-mix sur de la typo ». Une teinte qui ne
  // tient pas le contraste ne s'assombrit donc pas jusqu'à passer — elle
  // deviendrait une autre couleur, absente de la palette. Elle cède la place à
  // l'encre, ou à la crème sur fond sombre.
  //
  // Concrètement : le violet s'écrit en violet, le lime et la pêche s'écrivent
  // en encre. C'est pour cela que le violet est, dans le document, l'accent
  // des libellés et des liens.
  // Et il doit tenir sur LES TROIS FONDS, pas seulement sur la carte blanche :
  // le violet passe à 5.01 sur le blanc, mais retombe à 4.26 sur la crème et à
  // 3.79 sur un panneau. Un accent de texte qui ne vaut que sur un fond serait
  // un piège tendu au premier écran qui l'emploie ailleurs.
  const fonds = [b.bg, b.surface, b.surfaceAlt];
  const versLisible = sombre ? PALETTE.snow : PALETTE.ink;
  const enTexte = (c: string) =>
    fonds.every((fond) => contrastRatio(c, fond) >= 4.5) ? c : versLisible;

  return {
    ...b,

    accent: hue,
    onAccent: surAccent(hue),
    accentSoft: mixHex(hue, b.surface, sombre ? 0.1 : 0.22),
    accentText: enTexte(hue),
    ...actionColors(scheme, hue),

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

// --- RAYONS -----------------------------------------------------------------
//
// Généreux : DESIGN.md va de 24 px pour une ligne de liste à 56 px pour un
// cadre de téléphone, sur un canevas de 1080. Ramenés à la largeur d'un
// téléphone, ces rapports donnent l'échelle ci-dessous — plus ronde que
// l'ancienne, ce qui est tout le sujet.
// CE QUI POSE UN OBJET SUR LA PAGE, MAINTENANT QUE LES CONTOURS SONT PARTIS.
//
// L'identité était plate et cernée : chaque carte, chaque bouton, chaque
// avatar portait un trait d'encre. À l'usage, ces traits dessinaient la page
// au feutre et se lisaient avant leur contenu. Ils sont remplacés par une
// ombre douce — la même partout, pour que deux objets posés côte à côte
// flottent à la même hauteur.
//
// Elle ne se voit pas sur la nuit, et c'est normal : là-bas, ce sont les fonds
// qui font le relief (voir `surface` du thème sombre).
export const ombre = {
  shadowColor: PALETTE.ink,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 3,
} as const;

export const radii = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 44,
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
// Space Grotesk pour tout, DM Mono pour les étiquettes, les compteurs et les
// pourcentages. Les deux sont embarquées (voir App.tsx) : aucune police n'est
// téléchargée à l'exécution, l'app ne fait aucun appel réseau.
//
// LA GRAISSE EST DANS LE NOM DE LA FAMILLE, et ce n'est pas un détail : avec
// une police embarquée, `fontWeight` n'a aucun effet sur Android. C'est le
// composant `Texte` qui traduit l'un en l'autre, une fois pour toutes.
export const police = {
  sans: {
    400: 'SpaceGrotesk_400Regular',
    500: 'SpaceGrotesk_500Medium',
    600: 'SpaceGrotesk_600SemiBold',
    700: 'SpaceGrotesk_700Bold',
  },
  mono: {
    400: 'DMMono_400Regular',
    500: 'DMMono_500Medium',
  },
} as const;

// L'échelle du document, divisée par ~2.5 pour un écran de téléphone, arrondie
// à des tailles qui tombent juste. Le plancher est à 12 : en dessous, un
// libellé mono espacé de 0.12em cesse d'être lisible.
export const fonts = {
  // TOUTES LES ÉTIQUETTES À LA MÊME TAILLE. Pastilles de thème, puces d'accord
  // ou de désaccord, compteurs de fiche : elles s'écrivaient entre 11 et 15 px
  // selon l'écran, un écart qu'on ne voyait pas tant que la typographie était
  // celle du système. Space Grotesk est plus large et plus présente : les
  // mêmes deux pixels d'écart se lisent maintenant comme deux styles
  // différents. Une étiquette est une étiquette, elle a une taille.
  etiquette: 12,
  hero: 52,
  title: 30,
  // Le texte de la carte de swipe, plafond avant que la mesure ne le réduise
  // selon sa longueur. Un pixel de moins qu'avant : la typographie est plus
  // large, et la même taille ne portait plus le même nombre de mots.
  cardText: 23,
  body: 17,
  small: 14,
  tiny: 12,
} as const;

// Interlettrage des étiquettes mono, toujours en capitales (DESIGN.md §2).
export const MONO_SPACING = 1.2;
