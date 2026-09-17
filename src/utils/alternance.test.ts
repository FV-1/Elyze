import { alterneParCandidat } from './alternance';

type Mesure = { id: string; candidateId: string };

const mesures = (compte: Record<string, number>): Mesure[] =>
  Object.entries(compte).flatMap(([candidateId, n]) =>
    Array.from({ length: n }, (_, i) => ({ id: `${candidateId}${i + 1}`, candidateId }))
  );

const ids = (items: Mesure[]) => items.map((m) => m.id);

describe('alterneParCandidat', () => {
  it('prend les candidats à tour de rôle, dans l’ordre de leurs identifiants', () => {
    expect(ids(alterneParCandidat(mesures({ c: 2, a: 2, b: 2 })))).toEqual([
      'a1', 'b1', 'c1', 'a2', 'b2', 'c2',
    ]);
  });

  it('décale le candidat de tête d’un thème à l’autre', () => {
    const pool = mesures({ a: 1, b: 1, c: 1 });
    expect(ids(alterneParCandidat(pool, 0))[0]).toBe('a1');
    expect(ids(alterneParCandidat(pool, 1))[0]).toBe('b1');
    expect(ids(alterneParCandidat(pool, 2))[0]).toBe('c1');
    // Le décalage boucle, et un décalage négatif reste un index valide.
    expect(ids(alterneParCandidat(pool, 3))[0]).toBe('a1');
    expect(ids(alterneParCandidat(pool, -1))[0]).toBe('c1');
  });

  it('n’oublie ni ne duplique aucune proposition, même à programmes inégaux', () => {
    const pool = mesures({ a: 5, b: 1, c: 3 });
    const sortie = alterneParCandidat(pool, 1);
    expect(sortie).toHaveLength(pool.length);
    expect([...ids(sortie)].sort()).toEqual([...ids(pool)].sort());
  });

  it('continue avec ceux qui restent quand un programme est épuisé', () => {
    expect(ids(alterneParCandidat(mesures({ a: 3, b: 1 })))).toEqual(['a1', 'b1', 'a2', 'a3']);
  });

  it('garde à chaque candidat l’ordre du catalogue', () => {
    const sortie = alterneParCandidat(mesures({ a: 3, b: 3 }), 1);
    expect(ids(sortie).filter((id) => id.startsWith('a'))).toEqual(['a1', 'a2', 'a3']);
  });

  it('donne le même résultat à chaque appel', () => {
    const pool = mesures({ a: 4, b: 2, c: 3 });
    expect(ids(alterneParCandidat(pool, 2))).toEqual(ids(alterneParCandidat(pool, 2)));
  });

  it('accepte une liste vide', () => {
    expect(alterneParCandidat([])).toEqual([]);
  });
});
