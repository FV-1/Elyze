import { contrastRatio } from '../utils/color';
import { ColorTokens } from './index';

// --- Mode arc-en-ciel -------------------------------------------------------
//
// Repeint TOUTE l'application avec des couleurs tirées au hasard : fonds,
// textes, accents, couleurs des thèmes, marches du podium. Comme chaque
// composant construit ses styles à partir de `ColorTokens`, il suffit de
// fabriquer un jeu de tokens aléatoire pour que tout l'écran suive.
//
// Ce qui est tiré au sort, c'est la TEINTE (et un peu la saturation) : la
// CLARTÉ, elle, est calculée. Une couleur totalement aléatoire donnerait une
// fois sur deux du texte illisible sur son fond ; ici chaque couleur de texte
// est descendue (ou remontée) juste ce qu'il faut pour atteindre le contraste
// WCAG AA sur tous les fonds où elle peut apparaître. Le résultat reste
// franchement bariolé, mais l'app reste lisible.

// Générateur pseudo-aléatoire déterministe : une même graine redonne
// exactement la même palette, ce qui permet de la mémoriser et de la
// retrouver au redémarrage.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (v: number) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

// Réexporté depuis utils/color, où il a déménagé : la palette fixe s'en sert
// autant que le mode arc-en-ciel, et les tests l'importent d'ici depuis
// toujours.
export { contrastRatio };

// Cherche la clarté la MOINS extrême qui atteigne `minRatio` face à tous les
// fonds donnés : on garde ainsi la couleur aussi vive que possible, sans
// jamais descendre sous le seuil de lisibilité.
function pickReadable(
  hue: number,
  saturation: number,
  backgrounds: string[],
  minRatio: number,
  direction: 'darker' | 'lighter'
): string {
  const step = direction === 'darker' ? -1 : 1;
  for (let i = 0; i <= 100; i++) {
    const l = 50 + step * i * 0.5;
    if (l < 0 || l > 100) break;
    const candidate = hslToHex(hue, saturation, l);
    if (backgrounds.every((bg) => contrastRatio(candidate, bg) >= minRatio)) return candidate;
  }
  return direction === 'darker' ? '#000000' : '#FFFFFF';
}

// Le même choix, mais sans imposer le sens. `pickReadable` part de 50 % de
// clarté et s'enfonce dans une seule direction : quand la couleur doit se
// détacher à la fois du fond ET d'une piste tirée au sort ailleurs, la bonne
// réponse est parfois de l'autre côté.
function pickReadableEitherWay(
  hue: number,
  saturation: number,
  backgrounds: string[],
  minRatio: number,
  direction: 'darker' | 'lighter'
): string {
  const premier = pickReadable(hue, saturation, backgrounds, minRatio, direction);
  if (backgrounds.every((bg) => contrastRatio(premier, bg) >= minRatio)) return premier;
  return pickReadable(
    hue,
    saturation,
    backgrounds,
    minRatio,
    direction === 'darker' ? 'lighter' : 'darker'
  );
}

// Seuils WCAG : 4.5:1 pour du texte courant, 3:1 pour un élément graphique.
const TEXT_RATIO = 4.5;
const GRAPHIC_RATIO = 3;

// LA PISTE D'UNE JAUGE DOIT LAISSER VOIR CE QUI LA REMPLIT.
//
// Elle était tirée comme un fond : une clarté au hasard dans une plage, sans
// rien vérifier. Sur trois cents tirages simulés, la jauge de progression
// remplie se retrouvait à 1.01:1 de sa piste dans le pire cas, c'est-à-dire
// invisible — et la barre d'un candidat dans le classement avec elle.
//
// On balaie donc les cent clartés possibles, on garde celles qui détachent la
// piste de TOUT ce qui vient se poser dessus, et parmi elles la plus proche de
// la clarté voulue pour le thème. La teinte, elle, reste celle du tirage :
// c'est la clarté qui est calculée, jamais la couleur.
function pisteLisible(
  hue: number,
  saturation: number,
  contre: string[],
  clartePreferee: number
): string {
  let meilleure = hslToHex(hue, saturation, clartePreferee);
  let distance = Infinity;
  for (let l = 0; l <= 100; l++) {
    const candidate = hslToHex(hue, saturation, l);
    if (!contre.every((c) => contrastRatio(candidate, c) >= GRAPHIC_RATIO)) continue;
    const d = Math.abs(l - clartePreferee);
    if (d < distance) {
      distance = d;
      meilleure = candidate;
    }
  }
  return meilleure;
}

export function buildRainbowColors(scheme: 'light' | 'dark', seed: number): ColorTokens {
  const rand = mulberry32(seed);
  const hue = () => Math.floor(rand() * 360);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const isDark = scheme === 'dark';

  // Fonds : teinte libre, mais clarté cantonnée aux extrêmes pour rester des
  // fonds (très clairs en thème clair, très sombres en thème sombre).
  const surfaceL = isDark ? between(10, 16) : between(97, 100);
  const bgL = isDark ? between(6, 11) : between(94, 98);
  const altL = isDark ? between(17, 23) : between(90, 95);

  const bg = hslToHex(hue(), between(12, 45), bgL);
  const surface = hslToHex(hue(), between(8, 35), surfaceL);
  const surfaceAlt = hslToHex(hue(), between(15, 50), altL);

  // Teintes pastel (thème clair) ou sourdes (thème sombre) servant de fond aux
  // pastilles colorées : elles accueillent du texte, donc elles comptent parmi
  // les fonds à vérifier.
  const softL = isDark ? between(14, 21) : between(88, 94);
  const accentSoft = hslToHex(hue(), between(30, 70), softL);
  const successSoft = hslToHex(hue(), between(30, 70), softL);
  const warningSoft = hslToHex(hue(), between(30, 70), softL);
  const dangerSoft = hslToHex(hue(), between(30, 70), softL);

  // Tout texte doit rester lisible sur n'importe lequel de ces fonds.
  const allBackgrounds = [bg, surface, surfaceAlt, accentSoft, successSoft, warningSoft, dangerSoft];
  const textDirection = isDark ? 'lighter' : 'darker';

  const textPrimary = pickReadable(hue(), between(20, 60), allBackgrounds, 7, textDirection);
  const textSecondary = pickReadable(hue(), between(25, 65), allBackgrounds, TEXT_RATIO, textDirection);
  const textMuted = pickReadable(hue(), between(20, 55), allBackgrounds, TEXT_RATIO, textDirection);

  // Les couleurs "pleines" portent du texte blanc : c'est donc face au blanc
  // qu'elles doivent tenir le contraste, pas face au fond.
  const onAccent = '#FFFFFF';
  const accent = pickReadable(hue(), between(55, 95), [onAccent], TEXT_RATIO, 'darker');
  // L'action forte du mode arc-en-ciel : même teinte que l'accent, en plus
  // contrastée, et son état pressé encore un cran au-dessus.
  const action = accent;
  const onAction = onAccent;
  const actionPressed = pickReadable(hue(), between(55, 95), [onAccent], 7, 'darker');
  // LES TROIS RÉPONSES PORTENT UN MOT, et pas seulement un pictogramme : le
  // tampon qui traverse la carte affiche « J'ADHÈRE », « JE PASSE », « NON ».
  // Elles étaient tirées au seuil des éléments graphiques (3:1), où ce mot
  // tombait exactement à 3.00:1 contre les 4.5:1 qu'un texte demande.
  const success = pickReadable(hue(), between(55, 95), [onAccent], TEXT_RATIO, 'darker');
  const warning = pickReadable(hue(), between(55, 95), [onAccent], TEXT_RATIO, 'darker');
  const danger = pickReadable(hue(), between(55, 95), [onAccent], TEXT_RATIO, 'darker');

  // Déclinaisons "texte" des couleurs sémantiques, posées sur les fonds.
  const accentText = pickReadable(hue(), between(45, 90), allBackgrounds, TEXT_RATIO, textDirection);
  const successText = pickReadable(hue(), between(45, 90), allBackgrounds, TEXT_RATIO, textDirection);
  const warningText = pickReadable(hue(), between(45, 90), allBackgrounds, TEXT_RATIO, textDirection);
  const dangerText = pickReadable(hue(), between(45, 90), allBackgrounds, TEXT_RATIO, textDirection);

  // ÉLÉMENTS GRAPHIQUES : seuil 3:1, il ne s'agit pas de texte. L'ordre de ces
  // trois lignes est la correction elle-même, et il se lit comme une chaîne :
  // `action` est déjà fixé par le texte blanc qu'il porte ; la piste se range
  // par rapport à lui ; le remplissage neutre se range par rapport à la piste.
  // Chacun ne contraint que le suivant, si bien qu'aucun tirage ne peut tomber
  // sur un couple invisible.
  const neutralTrack = pisteLisible(hue(), between(20, 55), [action], isDark ? 26 : 88);
  const neutralFill = pickReadableEitherWay(
    hue(),
    between(35, 75),
    [bg, surface, neutralTrack],
    GRAPHIC_RATIO,
    textDirection
  );
  const border = hslToHex(hue(), between(20, 60), isDark ? between(26, 34) : between(78, 86));
  // Le trait d'encre du mode arc-en-ciel. Il a été la couleur du texte
  // principal, la seule dont on sache qu'elle tient sur tous les fonds tirés
  // au sort — mais à 7:1 sur un fond sombre, un contour se lit avant ce qu'il
  // entoure. `neutralFill` tient le 3:1 des éléments graphiques sur le fond
  // comme sur la carte : franc, et pas éclatant.
  const borderStrong = neutralFill;

  return {
    bg,
    surface,
    surfaceAlt,
    border,
    borderStrong,
    textPrimary,
    textSecondary,
    textMuted,
    accent,
    onAccent,
    accentSoft,
    accentText,
    action,
    onAction,
    actionPressed,
    success,
    successSoft,
    successText,
    onAccentSuccess: onAccent,
    warning,
    warningSoft,
    warningText,
    onAccentWarning: onAccent,
    danger,
    dangerSoft,
    dangerText,
    onAccentDanger: onAccent,
    neutralFill,
    neutralTrack,
  };
}

// Couleurs des tuiles de la mosaïque : du texte blanc est posé dessus, elles
// doivent donc tenir 4.5:1 avec le blanc, comme la palette fixe habituelle.
export function buildRainbowThemeColors(themeIds: string[], seed: number): Record<string, string> {
  // Décalage de graine pour ne pas rejouer la même suite que la palette.
  const rand = mulberry32(seed + 0x9e3779b9);
  const out: Record<string, string> = {};
  for (const id of themeIds) {
    const hue = Math.floor(rand() * 360);
    const sat = 55 + rand() * 40;
    out[id] = pickReadable(hue, sat, ['#FFFFFF'], 4.5, 'darker');
  }
  return out;
}

// Marches du podium : fond plein avec le rang écrit en blanc dessus.
export function buildRainbowMedals(seed: number): [string, string, string] {
  const rand = mulberry32(seed + 0x85ebca6b);
  const pick = () => pickReadable(Math.floor(rand() * 360), 55 + rand() * 40, ['#FFFFFF'], 4.5, 'darker');
  return [pick(), pick(), pick()];
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}
