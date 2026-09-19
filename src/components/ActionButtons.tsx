import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '../utils/haptics';
import { ColorTokens, ombre, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';

type Props = {
  onNope: () => void;
  onSkip: () => void;
  onLike: () => void;
  onSuperlike: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
};

export function ActionButtons({
  onNope,
  onSkip,
  onLike,
  onSuperlike,
  onUndo,
  canUndo,
  disabled,
}: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Le retour haptique de nope/skip/like est déclenché une seule fois, à la
  // fin de l'animation de la carte (voir SwipeCard.finishSwipe), pour rester
  // identique que le swipe vienne d'un drag ou d'un appui sur ces boutons.
  const handleNope = () => {
    if (disabled) return;
    onNope();
  };

  const handleSkip = () => {
    if (disabled) return;
    onSkip();
  };

  const handleLike = () => {
    if (disabled) return;
    onLike();
  };

  const handleSuperlike = () => {
    if (disabled) return;
    onSuperlike();
  };

  const handleUndo = () => {
    if (disabled || !canUndo) return;
    haptics.selection();
    onUndo();
  };

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handleUndo}
        disabled={!canUndo}
        style={({ pressed }) => [
          styles.button,
          styles.smallButton,
          styles.undoButton,
          pressed && styles.pressed,
          !canUndo && styles.buttonDisabled,
        ]}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Annuler le dernier choix"
        accessibilityState={{ disabled: !canUndo }}
      >
        <Ionicons name="arrow-undo" size={18} color={canUndo ? colors.textSecondary : colors.textMuted} />
      </Pressable>

      <Pressable
        onPress={handleNope}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          styles.nopeButton,
          pressed && styles.pressed,
          disabled && styles.buttonDisabled,
        ]}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Pas pour moi"
        accessibilityState={{ disabled: !!disabled }}
      >
        <Ionicons name="close" size={30} color={colors.onAccentDanger} />
      </Pressable>

      <Pressable
        onPress={handleSkip}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          styles.smallButton,
          styles.skipButton,
          pressed && styles.pressed,
          disabled && styles.buttonDisabled,
        ]}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Pas d’avis"
        accessibilityState={{ disabled: !!disabled }}
      >
        <Ionicons name="remove-outline" size={20} color={colors.textSecondary} />
      </Pressable>

      <Pressable
        onPress={handleLike}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          styles.likeButton,
          pressed && styles.pressed,
          disabled && styles.buttonDisabled,
        ]}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="J’adhère"
        accessibilityState={{ disabled: !!disabled }}
      >
        <Ionicons name="heart" size={26} color={colors.onAccentSuccess} />
      </Pressable>

      <Pressable
        onPress={handleSuperlike}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          styles.smallButton,
          styles.superlikeButton,
          pressed && styles.pressed,
          disabled && styles.buttonDisabled,
        ]}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Super like, compte plus dans le résultat"
        accessibilityState={{ disabled: !!disabled }}
      >
        <Ionicons name="star" size={20} color={colors.onAccentWarning} />
      </Pressable>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // 12 et non 16 : les cinq boutons (44+64+44+64+44 = 260) plus quatre
      // espaces de 16 faisaient 324 px et débordaient sur les écrans de
      // 320 px de large. À 12, l'ensemble tient en 308.
      gap: spacing.sm + 4,
    },
    // LA COULEUR EST DANS L'APLAT, PAS DANS LE GLYPHE.
    //
    // Ces boutons portaient un signe coloré sur un fond blanc cerné de la même
    // couleur en plus pâle. Sur cette palette, cela ne pouvait plus tenir : un
    // cœur lime sur du blanc ne se lit pas, et le document demande justement
    // l'inverse — des aplats francs, cernés d'encre, avec un signe d'encre
    // dessus. Chaque réponse devient donc une pastille pleine, et les quatre se
    // distinguent par leur couleur autant que par leur signe.
    button: {
      width: 64,
      height: 64,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      // Sans contour : l'ombre suffit à poser les quatre pastilles sur la
      // page, et un aplat de couleur cerné d'encre pesait deux fois.
      ...ombre,
    },
    smallButton: {
      width: 44,
      height: 44,
    },
    nopeButton: {
      backgroundColor: colors.danger,
    },
    likeButton: {
      backgroundColor: colors.success,
    },
    // Le super like prend le contraire du fond : c'est la réponse la plus
    // appuyée des quatre, et elle le montre sans ajouter une couleur de plus.
    superlikeButton: {
      backgroundColor: colors.warning,
    },
    skipButton: {
      backgroundColor: colors.surfaceAlt,
    },
    // Annuler n'est pas une réponse : pas d'aplat, juste le trait.
    undoButton: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    pressed: {
      transform: [{ scale: 0.92 }],
      opacity: 0.85,
    },
  });
}
