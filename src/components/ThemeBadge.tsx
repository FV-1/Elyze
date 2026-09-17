import { StyleSheet, Text, View } from 'react-native';
import { themeChipColors } from '../data/themeColors';
import { ThemeTag } from '../types';
import { fonts, radii, spacing } from '../theme';
import { useColors, useThemeColor, useThemeSettings } from '../theme/ThemeContext';

// L'étiquette de thème posée en haut de chaque carte.
//
// ELLE PORTE LA COULEUR DE SON THÈME, et non celle de l'accent. En accent,
// les quinze thèmes se ressemblaient tous : l'étiquette disait le sujet en
// toutes lettres mais ne le signalait pas, et rien ne distinguait d'un coup
// d'œil la carte sur la santé de celle sur les transports. La teinte fait ce
// travail avant la lecture — c'est la même que celle de la mosaïque et des
// fiches candidat, si bien qu'un thème garde sa couleur d'un écran à l'autre.
//
// Le dosage passe par `themeChipColors`, qui pose la teinte en fond très pâle
// et reprend la même assombrie pour le texte : les quinze aplats saturés de
// la palette sont faits pour porter du blanc, et une pastille de cette
// intensité en haut d'une carte volerait le regard au texte de la mesure.
// Le contraste y est garanti sur les 360 teintes possibles, mode arc-en-ciel
// compris (voir data/themeColors.ts).
export function ThemeBadge({ theme }: { theme: ThemeTag }) {
  const colors = useColors();
  const getThemeColor = useThemeColor();
  const { effectiveScheme } = useThemeSettings();

  const tint = themeChipColors(
    getThemeColor(theme.id),
    colors.surface,
    effectiveScheme === 'dark'
  );

  return (
    <View style={[styles.badge, { backgroundColor: tint.background }]}>
      <Text style={styles.icon}>{theme.icon}</Text>
      <Text style={[styles.label, { color: tint.text }]}>{theme.label}</Text>
    </View>
  );
}

// Fond et couleur de texte sont posés à l'inline, puisqu'ils changent avec le
// thème de la carte : ce qui reste ici ne dépend d'aucune couleur.
const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  icon: {
    fontSize: fonts.body,
  },
  label: {
    fontSize: fonts.small,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
