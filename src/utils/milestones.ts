// Paliers de la barre de progression : où la barre se découpe en segments.
//
// Ils servaient aussi à annoncer, par une fenêtre, que le classement
// provisoire devenait lisible. Ce classement a quitté la partie (il doublait
// l'écran de résultat, et le voir monter en cours de jeu pouvait orienter les
// réponses) ; les annonces sont parties avec lui. Restent les segments, qui
// donnent un rythme à la progression.

export type Milestone = {
  ratio: number;
};

const MAX_JALONS = 3;

// COMBIEN de paliers, et non plus où : le nombre suit la longueur du paquet.
//
// Les trois paliers étaient posés à 25 / 50 / 75 % quelle que soit la partie.
// Sur le paquet complet (165 cartes) cela fait une annonce toutes les
// quarante et une cartes, ce qui est le rythme voulu. Mais un paquet filtré
// par thèmes est bien plus court — le tirage descend jusqu'à 22 ou 33 cartes
// (voir utils/deck.ts) — et le même pourcentage y produisait trois popups en
// moins de trois minutes de jeu, pour un classement qui de toute façon
// n'avait pas le temps de beaucoup bouger entre deux.
//
// On raisonne donc en CARTES et non en pourcentage : un palier par tranche
// d'environ quarante cartes, au plus trois. Les positions restent réparties
// régulièrement, ce qui redonne exactement 25 / 50 / 75 % sur le paquet
// complet — l'ancien comportement est le cas particulier du nouveau.
export const CARTES_PAR_JALON = 40;

// En dessous, aucun palier : une partie de moins de vingt cartes est trop
// courte pour être découpée.
const MIN_TOTAL_POUR_JALON = 20;

export function milestonesFor(total: number): Milestone[] {
  if (total < MIN_TOTAL_POUR_JALON) return [];

  const combien = Math.min(MAX_JALONS, Math.max(1, Math.floor(total / CARTES_PAR_JALON)));

  // Réparties régulièrement : `combien` paliers découpent la barre en
  // `combien + 1` segments égaux.
  return Array.from({ length: combien }, (_, i) => ({ ratio: (i + 1) / (combien + 1) }));
}

// Rang de carte à partir duquel un palier est considéré comme franchi.
export function milestoneThreshold(total: number, ratio: number): number {
  return Math.ceil(total * ratio);
}
