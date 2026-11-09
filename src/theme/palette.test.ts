import { contrastRatio } from '../utils/color';
import { ACCENTS, AccentId, buildColors, ColorTokens, PALETTE } from './index';

// LA CHECKLIST DE DESIGN.md, EN TEST.
//
// Le document se termine par une liste de vérifications avant livraison. Celles
// qui peuvent se mesurer sont ici : elles valent pour les deux thèmes et pour
// les trois emplacements d'accent (qui donnent aujourd'hui la même encre).
//
// Ce fichier n'est pas une formalité. La palette est fixe, donc tout se joue au
// moment où l'on ajoute une couleur : un jour, quelqu'un aura besoin d'un vert
// « juste pour ce badge », et c'est ici que la réponse est écrite.

const SCHEMES = ['light', 'dark'] as const;
const ACCENT_IDS = Object.keys(ACCENTS) as AccentId[];
const TEXTE = 4.5;
const INTERFACE = 3;

function chaquePalette(f: (c: ColorTokens, nom: string) => void) {
  for (const scheme of SCHEMES) {
    for (const accent of ACCENT_IDS) {
      f(buildColors(scheme, accent), `${scheme}/${accent}`);
    }
  }
}

describe('la palette ne contient que les couleurs du document', () => {
  const autorisees = new Set(Object.values(PALETTE).map((c) => c.toUpperCase()));
  // Les fonds secondaires et les teintes pâles sont calculés à partir des
  // valeurs ci-dessus ; ce sont des SURFACES, jamais du texte.
  const derivees = new Set(['SURFACEALT', 'BORDER', 'NEUTRALTRACK', 'ACCENTSOFT', 'ACTIONPRESSED']);

  it('n’écrit jamais avec une couleur qui n’y est pas', () => {
    const intrus: string[] = [];
    chaquePalette((c, nom) => {
      const textes: (keyof ColorTokens)[] = [
        'textPrimary',
        'textSecondary',
        'textMuted',
        'accentText',
        'onAccent',
        'onAction',
        'successText',
        'warningText',
        'dangerText',
        'onAccentSuccess',
        'onAccentWarning',
        'onAccentDanger',
      ];
      for (const jeton of textes) {
        const valeur = String(c[jeton]).toUpperCase();
        if (!autorisees.has(valeur) && !derivees.has(jeton.toUpperCase())) {
          intrus.push(`${nom} ${jeton} = ${valeur}`);
        }
      }
    });
    expect(intrus).toEqual([]);
  });
});

describe('contrastes', () => {
  it('pose du texte lisible sur chaque fond', () => {
    const echecs: string[] = [];
    chaquePalette((c, nom) => {
      const fonds = [c.bg, c.surface, c.surfaceAlt, c.accentSoft, c.successSoft, c.dangerSoft];
      for (const fond of fonds) {
        // LES TROIS ENCRES DE RÉPONSE SONT DU TEXTE, ELLES AUSSI.
        //
        // Elles ne figuraient pas ici, et le trou s'est vu : l'or du super
        // like tenait ses 4.5:1 sur les fonds neutres et sur les pastilles
        // vertes, rouges ou jaunes, mais tombait à 4.36 sur le violet très
        // pâle d'un écran au classement. Un jeton de texte doit tenir sur
        // TOUS les fonds où l'app peut le poser, pas sur ceux auxquels on
        // pense en l'écrivant.
        for (const jeton of [
          'textPrimary',
          'textSecondary',
          'textMuted',
          'accentText',
          'successText',
          'warningText',
          'dangerText',
        ] as const) {
          const r = contrastRatio(c[jeton], fond);
          if (r < TEXTE) echecs.push(`${nom} ${jeton} sur ${fond} : ${r.toFixed(2)}`);
        }
      }
    });
    expect(echecs).toEqual([]);
  });

  it('écrit lisiblement sur chaque aplat de couleur', () => {
    const echecs: string[] = [];
    chaquePalette((c, nom) => {
      const couples: [string, string, string][] = [
        ['accent', c.onAccent, c.accent],
        ['action', c.onAction, c.action],
        ['success', c.onAccentSuccess, c.success],
        ['warning', c.onAccentWarning, c.warning],
        ['danger', c.onAccentDanger, c.danger],
      ];
      for (const [quoi, texte, fond] of couples) {
        const r = contrastRatio(texte, fond);
        if (r < TEXTE) echecs.push(`${nom} ${quoi} : ${r.toFixed(2)}`);
      }
    });
    expect(echecs).toEqual([]);
  });

  it('détache les traits et les jauges de leur fond', () => {
    const echecs: string[] = [];
    chaquePalette((c, nom) => {
      const paires: [string, number][] = [
        ['borderStrong/surface', contrastRatio(c.borderStrong, c.surface)],
        ['borderStrong/bg', contrastRatio(c.borderStrong, c.bg)],
        // Ce qui REMPLIT une jauge doit s'y détacher : c'est `action` qui le
        // fait, pas l'accent brut, qui ne sert qu'à de petits aplats posés sur
        // une carte (voir ProgressBar).
        ['action/neutralTrack', contrastRatio(c.action, c.neutralTrack)],
        ['neutralFill/neutralTrack', contrastRatio(c.neutralFill, c.neutralTrack)],
      ];
      for (const [quoi, r] of paires) {
        if (r < INTERFACE) echecs.push(`${nom} ${quoi} : ${r.toFixed(2)}`);
      }
    });
    expect(echecs).toEqual([]);
  });
});

describe('les quatre réponses du swipe se distinguent', () => {
  it('ne donne pas deux fois le même aplat', () => {
    chaquePalette((c, nom) => {
      const aplats = [c.success, c.warning, c.danger, c.surfaceAlt].map((x) => x.toUpperCase());
      expect({ nom, uniques: new Set(aplats).size }).toEqual({ nom, uniques: 4 });
    });
  });
});

describe('un seul accent, l’encre', () => {
  it('donne la même palette à tous les écrans', () => {
    for (const scheme of SCHEMES) {
      const accents = ACCENT_IDS.map((a) => buildColors(scheme, a).accent);
      expect(new Set(accents).size).toBe(1);
    }
  });

  it('prend l’encre du thème : le texte principal', () => {
    for (const scheme of SCHEMES) {
      const c = buildColors(scheme, 'lime');
      expect(c.accent).toBe(c.textPrimary);
    }
  });

  it('garde les mêmes fonds d’un accent à l’autre', () => {
    // Deux fonds maximum sur l'ensemble du livrable : changer d'écran change
    // l'accent, jamais le fond.
    for (const scheme of SCHEMES) {
      const fonds = ACCENT_IDS.map((a) => {
        const c = buildColors(scheme, a);
        return `${c.bg}/${c.surface}`;
      });
      expect(new Set(fonds).size).toBe(1);
    }
  });
});
