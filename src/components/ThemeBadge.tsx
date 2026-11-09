import { StyleSheet, View } from 'react-native';
import { Texte as Text } from './Texte';
import { themeChipColors } from '../data/themeColors';
import { ThemeTag } from '../types';
import { fonts, MONO_SPACING, police, radii, spacing } from '../theme';
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
// Sans contour depuis que l'app en a fini avec eux : le fond teinté dit déjà
// que c'est une étiquette, et le trait ne faisait que redoubler la couleur.
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

  // ELLE DIT LE SUJET, PAS L'INTITULÉ COMPLET.
  //
  // « Solidarités & protection sociale » fait trente-trois caractères, et en
  // capitales monospace interlettrées cela dépasse la largeur de la carte :
  // l'étiquette passait sur deux lignes, cadrées à gauche dans une pastille
  // centrée, ce qui se voyait comme un défaut d'alignement. Le premier terme
  // suffit à dire de quoi parle la carte — l'intitulé entier reste sur la
  // mosaïque, où il a la place.
  //
  // La coupure se fait à l'esperluette et nulle part ailleurs : c'est la
  // charnière de tous les intitulés doubles de la liste, et le terme de tête
  // y est toujours le sujet principal.
  const sujet = theme.label.split(' & ')[0];

  return (
    <View style={[styles.badge, { backgroundColor: tint.background }]}>
      <Text style={styles.icon}>{theme.icon}</Text>
      <Text style={[styles.label, { color: tint.text }]} numberOfLines={1}>
        {sujet}
      </Text>
    </View>
  );
}

// Fond et couleur de texte sont posés à l'inline, puisqu'ils changent avec le
// thème de la carte : ce qui reste ici ne dépend d'aucune couleur.
const styles = StyleSheet.create({
  // LA PASTILLE DU SYSTÈME : mono, capitales, interlettrage large, et un trait
  // qui la pose sur la carte. C'est la forme que DESIGN.md donne à toutes les
  // étiquettes ; la couleur, elle, reste celle du thème.
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    // Filet de sécurité : si un intitulé devenait trop long malgré la coupure,
    // la pastille s'arrête au bord de la carte et le texte se centre dedans
    // plutôt que de déborder.
    maxWidth: '100%',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs + 3,
    paddingHorizontal: spacing.md,
    gap: spacing.xs + 2,
  },
  icon: {
    fontSize: fonts.etiquette,
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
    fontFamily: police.mono[500],
    fontSize: fonts.etiquette,
    letterSpacing: MONO_SPACING,
    textTransform: 'uppercase',
  },
});
