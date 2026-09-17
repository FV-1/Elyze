import { ThemeTag } from '../types';

// SUR QUOI PORTE CE CLASSEMENT.
//
// Une partie peut être jouée sur une sélection de thèmes (voir
// ThemeSelectScreen). Le classement qui en sort ne compare alors les candidats
// que sur ces sujets-là : un « 78 % avec X » obtenu sur la seule santé ne dit
// rien de l'économie ou de l'immigration.
//
// Tant qu'on reste dans l'app, le contexte est à portée de main — on vient de
// choisir ses thèmes, la barre du bas les rappelle. L'IMAGE PARTAGÉE, ELLE,
// VOYAGE SEULE : un podium nu, sorti de l'app, se lit comme un verdict général,
// et c'est le genre de malentendu qu'on ne rattrape pas une fois la capture
// envoyée. La portée doit donc être écrite sur le résultat lui-même.
//
// LE MOT « UNIQUEMENT » N'EST PAS DÉCORATIF : « Sur le thème Santé » pourrait
// se lire comme un détail de plus sous un classement général. C'est lui qui
// dit que le reste du programme n'a pas été compté.
//
// Rien n'est affiché quand tous les thèmes sont retenus : c'est le cas normal,
// et le préciser à chaque partie apprendrait à ne plus le lire — au moment
// précis où la mention compte.
//
// `themes` est la liste de référence, celle des thèmes qu'on peut choisir. La
// comparaison porte sur son nombre : une sélection qui les couvre tous est le
// classement général.
export function porteeDesThemes(selection: string[], themes: ThemeTag[]): string | null {
  const retenus = themes.filter((theme) => selection.includes(theme.id));
  if (retenus.length === 0 || retenus.length >= themes.length) return null;

  const noms = retenus.map((theme) => theme.label);
  if (noms.length === 1) return `Sur le thème ${noms[0]} uniquement`;
  // Au-delà de trois noms, la phrase devient une liste qu'on ne lit plus, et
  // elle déborde de la carte de partage. Le nombre suffit alors à dire que le
  // classement ne couvre pas tout.
  if (noms.length <= 3) {
    return `Sur les thèmes ${noms.slice(0, -1).join(', ')} et ${noms[noms.length - 1]} uniquement`;
  }
  return `Sur ${retenus.length} thèmes choisis sur ${themes.length}`;
}
