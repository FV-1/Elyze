// Une date ISO en français, sans dépendance.
//
// `Intl.DateTimeFormat` ferait le travail, mais son jeu de locales dépend de
// la façon dont Hermes a été compilé : sur certains appareils Android la
// locale française retombe sur l'anglais, et la date des données s'afficherait
// « August 29, 2026 » au milieu d'une phrase française. Douze mots dans un
// tableau coûtent moins cher qu'un doute.
//
// L'entrée est une date d'export, donc un jour civil sans heure ni fuseau :
// elle est découpée telle qu'écrite, sans passer par `Date`, qui interpréterait
// « 2026-08-29 » en UTC et pourrait rendre la veille selon le fuseau.
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export function dateEnFrancais(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const annee = Number(m[1]);
  const mois = Number(m[2]);
  const jour = Number(m[3]);
  if (mois < 1 || mois > 12 || jour < 1 || jour > 31) return null;
  // « 1er », et non « 1 » : c'est la seule irrégularité du français ici.
  const quantieme = jour === 1 ? '1er' : String(jour);
  return `${quantieme} ${MOIS[mois - 1]} ${annee}`;
}
