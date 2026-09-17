// ALTERNER LES CANDIDATS DANS UNE LISTE DE PROPOSITIONS.
//
// POURQUOI. Le catalogue est rangé candidat par candidat : c'est l'ordre de
// l'export de la source, et il n'a rien de neutre une fois affiché. Ouvrir un
// thème donnait quinze mesures du même candidat avant d'atteindre celles du
// suivant — celui du bas n'était lu que par qui défilait jusqu'au bout, et
// c'était toujours le même qui ouvrait la liste. Une application qui prétend
// faire découvrir des programmes sans en favoriser un ne peut pas laisser la
// place de tête à l'ordre alphabétique d'un fichier.
//
// LE TRI SEUL NE SUFFIT PAS. Ranger les candidats de A à Z corrige l'arbitraire
// mais pas le déséquilibre : le premier de l'alphabet occuperait alors le haut
// des quinze thèmes. On fait donc deux choses à la fois :
//
//  1. ALTERNANCE — on prend une proposition par candidat, à tour de rôle, puis
//     on recommence. Chacun est présent dans les premières lignes, quelle que
//     soit la longueur de son programme sur ce thème.
//
//  2. ROTATION — le candidat qui ouvre la liste se décale d'un thème à l'autre.
//     Le point de départ est calculé, pas tiré au sort : la même liste doit se
//     retrouver à l'identique d'une ouverture à l'autre, sans quoi on ne
//     pourrait ni y revenir ni la vérifier.
//
// L'ordre des candidats dans le cycle est celui de leurs identifiants, tirés
// de leur nom de famille : un ordre vérifiable, que rien dans l'app ne peut
// influencer. Chaque candidat garde par ailleurs ses propres mesures dans
// l'ordre du catalogue — l'alternance mélange les auteurs, pas leurs idées.
export function alterneParCandidat<T extends { candidateId: string }>(
  items: T[],
  decalage = 0
): T[] {
  const parCandidat = new Map<string, T[]>();
  for (const item of items) {
    const liste = parCandidat.get(item.candidateId);
    if (liste) liste.push(item);
    else parCandidat.set(item.candidateId, [item]);
  }

  const candidats = [...parCandidat.keys()].sort();
  if (candidats.length === 0) return [];

  // Un décalage négatif ou plus grand que le nombre de candidats reste valide :
  // le modulo est ramené dans l'intervalle avant d'être utilisé comme index.
  const depart = ((decalage % candidats.length) + candidats.length) % candidats.length;
  const cycle = [...candidats.slice(depart), ...candidats.slice(0, depart)];

  const resultat: T[] = [];
  const plusLong = Math.max(...cycle.map((c) => parCandidat.get(c)?.length ?? 0));
  for (let rang = 0; rang < plusLong; rang++) {
    for (const candidat of cycle) {
      const proposition = parCandidat.get(candidat)?.[rang];
      if (proposition) resultat.push(proposition);
    }
  }
  return resultat;
}
