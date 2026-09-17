import { dateEnFrancais } from './date';
import { DATASET_DATE } from '../data/proposals';

describe('dateEnFrancais', () => {
  it('écrit la date en toutes lettres', () => {
    expect(dateEnFrancais('2026-08-29')).toBe('29 août 2026');
    expect(dateEnFrancais('2027-04-12')).toBe('12 avril 2027');
  });

  it('dit « 1er » pour le premier du mois', () => {
    expect(dateEnFrancais('2026-01-01')).toBe('1er janvier 2026');
  });

  it('refuse ce qui n’est pas une date ISO, plutôt que d’inventer', () => {
    expect(dateEnFrancais('29/08/2026')).toBeNull();
    expect(dateEnFrancais('2026-13-01')).toBeNull();
    expect(dateEnFrancais('')).toBeNull();
  });

  it('sait lire la date du catalogue embarqué', () => {
    // Ce que l'app affiche vient de là : si le générateur change de format,
    // c'est ici qu'on l'apprend, pas dans les réglages.
    expect(dateEnFrancais(DATASET_DATE)).not.toBeNull();
  });
});
