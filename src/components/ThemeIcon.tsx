import { Ionicons } from '@expo/vector-icons';
import { IconeDeTheme } from '../types';

// L'ICÔNE D'UN SUJET, DESSINÉE ET NON EN EMOJI.
//
// Les sujets portaient un emoji (💶, 🏥, 🎓…). Un emoji ne prend pas la couleur
// de ce qui l'entoure, se dessine différemment d'un téléphone à l'autre, et
// tenir lieu d'icône est l'un des signes les plus reconnus d'une interface
// générée sans qu'on la décide. L'app dessine déjà ses autres icônes avec
// Ionicons : les sujets suivent, à la couleur de leur support.
export function ThemeIcon({
  icon,
  size,
  color,
  style,
}: {
  icon: IconeDeTheme;
  size: number;
  color: string;
  style?: React.ComponentProps<typeof Ionicons>['style'];
}) {
  return (
    <Ionicons
      name={icon}
      size={size}
      color={color}
      style={style}
      // Décorative : le nom du sujet est toujours écrit à côté.
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
