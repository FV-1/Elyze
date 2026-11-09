import type React from 'react';
import { StyleSheet, Text as TexteNatif, TextProps, TextStyle } from 'react-native';
import { police } from '../theme';

// LE TEXTE DE L'APP, ET POURQUOI IL NE PEUT PAS ÊTRE CELUI DE REACT NATIVE.
//
// Avec une police embarquée, `fontWeight` NE FAIT RIEN SUR ANDROID. Le système
// n'y sait pas épaissir un dessin de lettre : il faut lui donner le fichier de
// la graisse voulue, par son nom de famille. « Inter en 700 » ne s'écrit
// donc pas `fontWeight: '700'` mais `fontFamily: 'Inter_700Bold'`.
//
// Le faire à la main dans chaque style, c'était cent cinquante occasions de se
// tromper, et une police qui retombe silencieusement sur celle du système au
// premier oubli. Ce composant le fait une fois : il lit la graisse demandée et
// choisit le fichier correspondant. Les styles continuent de s'écrire avec
// `fontWeight`, comme partout ailleurs.
//
// UNE FAMILLE EXPLICITE L'EMPORTE TOUJOURS : c'est ainsi qu'on demande le
// style des étiquettes et des chiffres, sans que ce composant s'en mêle.
const FAMILLES: Record<string, string> = {
  '100': police.sans[400],
  '200': police.sans[400],
  '300': police.sans[400],
  '400': police.sans[400],
  normal: police.sans[400],
  '500': police.sans[500],
  '600': police.sans[600],
  '700': police.sans[700],
  '800': police.sans[700],
  '900': police.sans[700],
  bold: police.sans[700],
};

// LES CAPITALES SONT ÉCRITES, PAS DEMANDÉES AU STYLE.
//
// Android mesure un texte AVANT d'appliquer `textTransform: 'uppercase'`, puis
// coupe ce qui dépasse de la mesure. Avec une police à chasse fixe, minuscules
// et capitales ont la même largeur et rien ne se voyait ; avec Inter, les
// capitales sont plus larges, et « École » s'affichait « ÉCO… » dans sa
// pastille. Le texte est donc mis en capitales ici, avant d'être mesuré.
function enCapitales(enfants: React.ReactNode): React.ReactNode {
  if (typeof enfants === 'string') return enfants.toLocaleUpperCase('fr-FR');
  if (Array.isArray(enfants)) return enfants.map(enCapitales);
  return enfants;
}

export function Texte({ style, children, ...reste }: TextProps) {
  const aplati = StyleSheet.flatten(style) as TextStyle | undefined;
  const capitales = aplati?.textTransform === 'uppercase';
  const contenu = capitales ? enCapitales(children) : children;
  const sansTransformation = capitales ? { textTransform: 'none' as const } : null;

  if (aplati?.fontFamily) {
    return (
      <TexteNatif {...reste} style={[style, sansTransformation]}>
        {contenu}
      </TexteNatif>
    );
  }

  const poids = aplati?.fontWeight == null ? '400' : String(aplati.fontWeight);
  return (
    <TexteNatif
      {...reste}
      style={[style, sansTransformation, { fontFamily: FAMILLES[poids] ?? police.sans[400] }]}
    >
      {contenu}
    </TexteNatif>
  );
}
