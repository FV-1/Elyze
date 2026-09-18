// Mélange deux couleurs hexadécimales (#RRGGBB) : `ratio` est le poids de
// `hexA` (0 = full hexB, 1 = full hexA). Sert à dériver automatiquement une
// teinte pastel ("soft") à partir d'une couleur d'accent et de la couleur de
// surface courante, sans avoir à vérifier une couleur à la main par thème.
export function mixHex(hexA: string, hexB: string, ratio: number): string {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  const r = Math.round(a.r * ratio + b.r * (1 - ratio));
  const g = Math.round(a.g * ratio + b.g * (1 - ratio));
  const bl = Math.round(a.b * ratio + b.b * (1 - ratio));
  return toHex(r, g, bl);
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const part = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

// --- Contraste WCAG ---------------------------------------------------------
//
// Deux couleurs, un rapport. C'est la mesure sur laquelle repose toute la
// palette : chaque couleur de texte est vérifiée face aux fonds où elle peut
// apparaître, et les tests du dépôt refusent une palette qui descendrait sous
// 4.5:1 (voir theme/palette.test.ts).
//
// Vivait dans theme/rainbow.ts, qui en avait besoin le premier. Sa place est
// ici : la construction de la palette fixe s'en sert désormais autant, et
// l'importer depuis le thème créerait un cycle.
export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// La version de `couleur` la plus proche qui tienne `minRatio` sur `fond` : on
// la pousse vers l'encre ou vers la crème, pas à pas, et on s'arrête dès que
// le seuil est atteint. Sert aux accents utilisés en TEXTE, où la teinte pure
// ne suffit pas toujours (le lime sur crème, par exemple, ne se lit pas).
export function readableOn(
  couleur: string,
  fond: string,
  vers: string,
  minRatio = 4.5
): string {
  if (contrastRatio(couleur, fond) >= minRatio) return couleur;
  for (let i = 1; i <= 20; i++) {
    const essai = mixHex(vers, couleur, i / 20);
    if (contrastRatio(essai, fond) >= minRatio) return essai;
  }
  return vers;
}
