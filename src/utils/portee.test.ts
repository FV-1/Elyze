import { porteeDesThemes } from './portee';
import { ThemeTag } from '../types';

const theme = (id: string, label: string): ThemeTag => ({ id, label, icon: '•' });

const THEMES: ThemeTag[] = [
  theme('sante', 'Santé'),
  theme('economie', 'Économie'),
  theme('logement', 'Logement'),
  theme('defense', 'Défense'),
  theme('ecole', 'École'),
];

describe('porteeDesThemes', () => {
  it('ne dit rien quand tous les thèmes sont retenus', () => {
    expect(porteeDesThemes(THEMES.map((t) => t.id), THEMES)).toBeNull();
  });

  it('nomme le thème unique, et dit qu’il est le seul', () => {
    expect(porteeDesThemes(['sante'], THEMES)).toBe('Sur le thème Santé uniquement');
  });

  it('énumère jusqu’à trois thèmes', () => {
    expect(porteeDesThemes(['sante', 'economie'], THEMES)).toBe(
      'Sur les thèmes Santé et Économie uniquement'
    );
    expect(porteeDesThemes(['sante', 'economie', 'logement'], THEMES)).toBe(
      'Sur les thèmes Santé, Économie et Logement uniquement'
    );
  });

  it('compte au-delà de trois, plutôt que d’aligner une liste', () => {
    expect(porteeDesThemes(['sante', 'economie', 'logement', 'defense'], THEMES)).toBe(
      'Sur 4 thèmes choisis sur 5'
    );
  });

  it('suit l’ordre de la liste de référence, pas celui de la sélection', () => {
    expect(porteeDesThemes(['logement', 'sante'], THEMES)).toBe(
      'Sur les thèmes Santé et Logement uniquement'
    );
  });

  it('ignore un identifiant inconnu, et se tait sur une sélection vide', () => {
    expect(porteeDesThemes(['inconnu'], THEMES)).toBeNull();
    expect(porteeDesThemes([], THEMES)).toBeNull();
    expect(porteeDesThemes(['sante', 'inconnu'], THEMES)).toBe('Sur le thème Santé uniquement');
  });
});
