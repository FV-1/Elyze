import { contrastRatio, mixHex } from '../utils/color';

// --- LA PALETTE, ET RIEN D'AUTRE --------------------------------------------
//
// Ces onze valeurs sont celles de DESIGN.md. Elles ne se dérivent pas, ne se
// mélangent pas à la main et ne se complètent pas : toute couleur affichée par
// l'app en sort, directement ou par un mélange calculé plus bas.
//
// Deux fonds, jamais trois : la crème et la nuit. Le blanc n'est pas un fond,
// c'est la carte qu'on pose SUR la crème. Le lime, le violet et la pêche sont
// des accents, donc des petites surfaces — un badge, une marche de podium, un
// état actif. Jamais un aplat qui occupe l'écran.
//
// LES TEINTES ONT ÉTÉ ADOUCIES, et c'est un choix d'ensemble, pas un réglage
// écran par écran. Le lime était un néon (#D4FF3F), le violet une couleur de
// saturation maximale (#6B4FFF), la pêche un orange franc : trois couleurs qui
// criaient plus fort que ce qu'elles désignaient, et qui fatiguaient sur un
// parcours de cent soixante-cinq cartes. Chacune garde sa teinte — on reconnaît
// le même lime, le même violet — mais rendue à une saturation qu'un écran peut
// tenir longtemps. Les fonds ont suivi : la crème tire moins au jaune, la nuit
// moins au violet.
//
// Les contrastes, eux, n'ont pas bougé d'un pouce : les seuils sont vérifiés
// par theme/palette.test.ts, et aucune de ces valeurs n'a été choisie sans que
// le test repasse.
export const PALETTE = {
  ink: '#211C2B',
  ink2: '#453A55',
  ink3: '#675A78',

  cream: '#F4F0E8',
  cream2: '#EAE4DA',
  white: '#FFFFFF',
  sand: '#D6CFC4',

  night: '#221C2E',
  night2: '#2A2437',
  mutedOnNight: '#BCB4C9',
  // Le document donne deux neutres sur fond sombre : la crème pour le texte
  // principal, `mutedOnNight` pour les métadonnées. L'app en a trois niveaux,
  // comme en thème clair — celui-ci est le palier du milieu, et il est nommé
  // ici plutôt qu'inventé au fil des écrans.
  creamDim: '#D7D0E0',

  lime: '#C7DE77',
  violet: '#7059C9',
  peach: '#F0B48D',
  // Fonds décoratifs seulement (les cercles flous). Jamais du texte : sa
  // clarté ne tient 4.5:1 sur aucun de nos deux fonds.
  lavender: '#C3B7DF',
} as const;

// --- UN ACCENT DOMINANT PAR ÉCRAN -------------------------------------------
//
// C'est la règle principale de DESIGN.md, et elle a remplacé le choix de
// couleur qui vivait dans les réglages. L'app utilise bien ses trois accents,
// mais un écran donné n'en montre qu'un : le swipe est lime, le classement
// violet, les propositions pêche. On ne mélange pas deux accents sur une même
// vue, on change d'accent en changeant de vue.
//
// Le choix par l'utilisateur a disparu avec ça : une identité qui se repeint
// au goût de chacun n'est plus une identité. Le mode arc-en-ciel, lui, reste —
// c'est une farce assumée, pas un réglage d'apparence (voir theme/rainbow.ts).
export type AccentId = 'lime' | 'violet' | 'peach';

export const ACCENTS: Record<AccentId, string> = {
  lime: PALETTE.lime,
  violet: PALETTE.violet,
  peach: PALETTE.peach,
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
    bg: PALETTE.cream,
    surface: PALETTE.white,
    surfaceAlt: PALETTE.cream2,
    border: PALETTE.sand,
    // L'ENCRE PÂLE, ET NON L'ENCRE PLEINE. Un cadre noir autour de chaque
    // carte, de chaque avatar et de chaque bouton pesait plus lourd que ce
    // qu'il entourait. Ce ton tient 7:1 sur la carte blanche, largement
    // au-dessus des 3:1 demandés, sans dessiner la page au feutre.
    borderStrong: PALETTE.ink3,
    textPrimary: PALETTE.ink,
    textSecondary: PALETTE.ink2,
    textMuted: PALETTE.ink3,
    neutralFill: PALETTE.ink3,
    neutralTrack: PALETTE.cream2,
  },
  dark: {
    bg: PALETTE.night,
    // LA CARTE SE DÉTACHE PAR SON FOND, PLUS PAR SON CONTOUR.
    //
    // Les traits d'encre qui cernaient chaque surface ont été retirés ; sur la
    // nuit, une ombre ne se voit pas, et il ne restait rien pour dire où une
    // carte commence — la carte valait 1.08:1 sur la page. Les deux surfaces
    // sont donc remontées d'un cran : 1.35:1 pour la carte, comme la plupart
    // des thèmes sombres du commerce, où c'est l'écart de fond qui fait le
    // relief.
    surface: '#38304C',
    // Un cran au-dessus de la surface : sur la nuit, un panneau secondaire ne
    // peut pas être plus sombre que la carte qui le porte.
    surfaceAlt: '#423A58',
    border: '#3B2F4E',
    // LE TRAIT FORT N'EST PAS LA CRÈME, SUR LA NUIT.
    //
    // À pleine valeur, il cernait d'un blanc cassé les cartes, la barre du
    // bas, les avatars et le cadre du téléphone : sur un fond sombre, quinze
    // contours clairs se voient avant ce qu'ils entourent. Le document
    // demande un trait d'encre, pas une lumière.
    //
    // Cette teinte reste un trait franc — 3.64:1 sur la carte, 3.88:1 sur le
    // fond, au-dessus des 3:1 que le test exige — sans virer au blanc. Elle
    // ne peut pas descendre beaucoup plus bas : cette identité n'a pas
    // d'ombre, et c'est le contour, seul, qui dit où une surface s'arrête.
    borderStrong: '#8878A4',
    textPrimary: PALETTE.cream,
    textSecondary: PALETTE.creamDim,
    textMuted: PALETTE.mutedOnNight,
    neutralFill: PALETTE.mutedOnNight,
    // Plus sombre que le trait de séparation, et pour une raison mesurée : une
    // jauge remplie de violet ne se détachait pas d'une piste à #3B2F4E
    // (2.46:1), ni à #2A2039 une fois le violet adouci (2.90:1). À cette
    // valeur, elle tient 3.03:1 — et les deux autres accents largement.
    neutralTrack: '#251E2F',
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
  const hue = ACCENTS[isKnownAccentId(accentId) ? accentId : DEFAULT_ACCENT];
  const sombre = scheme === 'dark';

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
  const versLisible = sombre ? PALETTE.cream : PALETTE.ink;
  const enTexte = (c: string) =>
    fonds.every((fond) => contrastRatio(c, fond) >= 4.5) ? c : versLisible;

  return {
    ...b,

    accent: hue,
    onAccent: surAccent(hue),
    accentSoft: mixHex(hue, b.surface, sombre ? 0.1 : 0.22),
    accentText: enTexte(hue),
    ...actionColors(scheme, hue),

    // Validation : le lime, toujours.
    success: PALETTE.lime,
    successSoft: mixHex(PALETTE.lime, b.surface, sombre ? 0.1 : 0.26),
    successText: enTexte(PALETTE.lime),
    onAccentSuccess: surAccent(PALETTE.lime),

    // Le super like ne prend pas un troisième accent : il prend le contraire
    // du fond, ce qui en fait la réponse la plus appuyée des quatre sans
    // ajouter une couleur à l'écran.
    warning: sombre ? PALETTE.cream : PALETTE.ink,
    warningSoft: b.surfaceAlt,
    warningText: sombre ? PALETTE.cream : PALETTE.ink,
    onAccentWarning: sombre ? PALETTE.ink : PALETTE.lime,

    // Rejet : la pêche.
    danger: PALETTE.peach,
    dangerSoft: mixHex(PALETTE.peach, b.surface, sombre ? 0.1 : 0.28),
    dangerText: enTexte(PALETTE.peach),
    onAccentDanger: surAccent(PALETTE.peach),
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
