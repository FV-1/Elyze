import { StyleSheet, View } from 'react-native';
import { useColors } from '../theme/ThemeContext';

// LES CERCLES DE FOND, SIGNATURE DU SYSTÈME (DESIGN.md §3).
//
// Un ou deux par écran, jamais trois, et toujours coupés par un bord : c'est
// la coupe qui fait l'effet. Un cercle entier posé au milieu serait une forme ;
// un cercle dont on ne voit qu'un tiers est un fond.
//
// PLAT, ET NON DÉGRADÉ. Le document les décrit en dégradé radial, que React
// Native ne sait pas peindre sans dépendance supplémentaire — et un dégradé
// linéaire de remplacement produirait un bord franc là où il faut une
// disparition. On garde donc l'aplat le plus pâle de l'accent, ce qui
// s'accorde d'ailleurs avec le reste de l'identité, qui est plate.
//
// Le conteneur doit porter `overflow: 'hidden'`, sans quoi le cercle déborde
// de l'écran au lieu d'en être coupé.
export function Blob({
  taille,
  haut,
  bas,
  gauche,
  droite,
  couleur,
}: {
  taille: number;
  haut?: number;
  bas?: number;
  gauche?: number;
  droite?: number;
  // Par défaut la teinte la plus pâle de l'accent de l'écran.
  couleur?: string;
}) {
  const colors = useColors();
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.blob,
        {
          width: taille,
          height: taille,
          borderRadius: taille / 2,
          backgroundColor: couleur ?? colors.accentSoft,
          top: haut,
          bottom: bas,
          left: gauche,
          right: droite,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});
