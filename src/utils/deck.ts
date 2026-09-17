import { Proposal } from '../types';
import { shuffle } from './shuffle';

// Tirage du paquet d'une session dans le vivier embarqué.
//
// L'app embarque environ deux fois plus de propositions qu'une partie n'en
// montre, pour qu'un deuxième passage ne repose pas sur les mêmes cartes.
// Le tirage doit respecter deux contraintes, et la première n'est pas
// négociable :
//
//  1. LE MÊME NOMBRE POUR CHAQUE CANDIDAT. Tout le calcul du score suppose
//     que chacun pèse pareil (voir utils/scoring.ts). Un candidat qui aurait
//     18 cartes contre 12 à un autre serait mécaniquement avantagé, et aucun
//     lissage ne rattraperait ça.
//
//  2. UNE RÉPARTITION PAR THÈME. Prendre au hasard dans le vivier d'un
//     candidat donnerait, une fois sur deux, cinq cartes sur l'économie et
//     aucune sur la santé — alors que la vue « par thème » de l'écran de
//     résultat suppose de croiser plusieurs sujets. On tourne donc sur ses
//     thèmes, en en prenant une à chaque tour.
//
// Le nombre par candidat est ramené au plus petit vivier disponible : si un
// candidat n'a que 12 propositions dans les thèmes choisis, tout le monde en
// aura 12. Mieux vaut un paquet plus court qu'un paquet biaisé.
//
// --- L'EXCEPTION DES THÈMES CHOISIS --------------------------------------
//
// Ce tirage vaut pour le paquet COMPLET, et seulement pour lui. Sur une
// sélection de thèmes, il produisait des parties absurdes : un thème où le
// candidat le moins prolixe n'a qu'une seule mesure ramenait tout le monde à
// une carte, soit onze cartes pour un thème qui en compte trente. On
// choisissait « Santé » et on obtenait une poignée de propositions au lieu du
// sujet entier.
//
// Sur une sélection, le paquet prend donc TOUT ce que les thèmes contiennent.
// L'égalité des quotas y est perdue, et ce n'est pas grave ici : le score est
// un TAUX par candidat, pas une somme (voir utils/scoring.ts). Un candidat
// avec huit mesures sur le thème n'est pas avantagé, il est simplement mesuré
// plus finement — et le lissage bayésien tire justement vers 50 % celui dont
// on ne sait presque rien. Le déséquilibre porte sur la fiabilité, pas sur le
// résultat, et c'est exactement ce que le score sait déjà représenter.
//
// Sur le paquet complet, en revanche, l'égalité reste non négociable : là,
// prendre tout donnerait à un programme de trois cents mesures dix fois le
// poids d'un programme de trente.

// --- DEUX LONGUEURS DE PARTIE ----------------------------------------------
//
// Onze candidats à quinze propositions font cent soixante-cinq cartes : onze
// minutes sans s'arrêter, et une partie qui ne se termine pas ne donne aucun
// résultat — juste un classement provisoire. La partie courte en tire cinq par
// candidat, cinquante-cinq cartes, quatre minutes : de quoi arriver au bout.
//
// LE SCORE TIENT À CINQ CARTES PAR CANDIDAT, et ce n'est pas une concession :
// le lissage est précisément fait pour ça (voir utils/scoring.ts). Cinq
// propositions approuvées sur cinq donnent 86 % et non 100 % — l'app dit
// qu'elle en sait moins, au lieu de faire comme si de rien n'était.
//
// QUOTA_PAR_CANDIDAT doit rester aligné sur celui de scripts/generate-data.js,
// qui dimensionne le vivier en conséquence.
export const QUOTA_PAR_CANDIDAT = 15;
export const QUOTA_COURT = 5;

export type FormatPartie = 'court' | 'long';

export function quotaDuFormat(format: FormatPartie): number {
  return format === 'court' ? QUOTA_COURT : QUOTA_PAR_CANDIDAT;
}

export function formatDuQuota(quota: number): FormatPartie {
  return quota === QUOTA_COURT ? 'court' : 'long';
}

type ShuffleFn = <T>(items: T[]) => T[];

export function candidatesQuota(pool: Proposal[], quota: number): number {
  const parCandidat = new Map<string, number>();
  for (const p of pool) parCandidat.set(p.candidateId, (parCandidat.get(p.candidateId) ?? 0) + 1);
  if (parCandidat.size === 0) return 0;
  return Math.min(quota, ...parCandidat.values());
}

// Le paquet d'une partie. `complet` dit si la sélection porte sur TOUS les
// thèmes : c'est le seul cas où le quota par candidat s'applique.
//
// Le quota voyage avec le défi (voir utils/duel.ts) : deux joueurs doivent
// refaire le MÊME paquet, et une partie courte n'en tire pas les mêmes cartes
// qu'une longue — même graine, même catalogue, autre paquet.
export function buildSessionDeck(
  pool: Proposal[],
  complet: boolean,
  melange: ShuffleFn = shuffle,
  quota: number = QUOTA_PAR_CANDIDAT
): Proposal[] {
  return complet ? buildDeck(pool, quota, melange) : melange(pool);
}

export function buildDeck(
  pool: Proposal[],
  quota: number,
  melange: ShuffleFn = shuffle
): Proposal[] {
  const effectif = candidatesQuota(pool, quota);
  if (effectif === 0) return [];

  const parCandidat = new Map<string, Proposal[]>();
  for (const p of pool) {
    const liste = parCandidat.get(p.candidateId);
    if (liste) liste.push(p);
    else parCandidat.set(p.candidateId, [p]);
  }

  const choisies: Proposal[] = [];

  for (const propositions of parCandidat.values()) {
    // Regroupement par thème, chaque groupe mélangé : c'est ce qui fait
    // qu'une même proposition ne revient pas systématiquement d'une partie
    // à l'autre.
    const parTheme = new Map<string, Proposal[]>();
    for (const p of melange(propositions)) {
      const liste = parTheme.get(p.themeId);
      if (liste) liste.push(p);
      else parTheme.set(p.themeId, [p]);
    }

    // L'ordre des thèmes change aussi : sans cela, les premiers thèmes de la
    // liste seraient toujours servis en premier quand le quota ne permet pas
    // de faire un tour complet.
    const themes = melange([...parTheme.keys()]);

    const prises: Proposal[] = [];
    let tour = 0;
    while (prises.length < effectif) {
      let ajout = 0;
      for (const themeId of themes) {
        const liste = parTheme.get(themeId)!;
        if (liste.length <= tour) continue;
        prises.push(liste[tour]);
        ajout++;
        if (prises.length >= effectif) break;
      }
      if (ajout === 0) break; // vivier épuisé
      tour++;
    }

    choisies.push(...prises);
  }

  // Mélange final : sinon les cartes sortiraient candidat par candidat, ce
  // qui laisserait deviner qui porte quoi.
  return melange(choisies);
}
