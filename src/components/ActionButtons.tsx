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
        <Ionicons name="close" size={30} color={colors.dangerText} />
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
        <Ionicons name="heart" size={26} color={colors.successText} />
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
        <Ionicons name="star" size={20} color={colors.warningText} />
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
    // TEINTE SUR TEINTE : un signe rouge sur un rond rouge pâle, un vert sur
    // du vert pâle, un jaune sur du jaune pâle.
    //
    // Les quatre pastilles étaient des aplats pleins portant un signe d'encre,
    // et le super like un rond noir — quatre taches franches sous une carte
    // qu'on regarde pendant onze minutes. Le fond très pâle rend la rangée
    // beaucoup plus calme, et la couleur dit toujours la même chose, puisque
    // c'est maintenant elle qu'on lit dans le signe.
    //
    // Les deux valeurs de chaque couple viennent du thème (`…Soft` et
    // `…Text`), et leur contraste est vérifié par le test de palette : ce
    // n'est pas un dosage fait à l'œil.
    nopeButton: {
      backgroundColor: colors.dangerSoft,
    },
    likeButton: {
      backgroundColor: colors.successSoft,
    },
    superlikeButton: {
      backgroundColor: colors.warningSoft,
    },
    skipButton: {
      backgroundColor: colors.surfaceAlt,
    },
    // ANNULER N'EST PAS UNE RÉPONSE, et cela se disait par un contour vide :
    // pas d'aplat, juste le trait. Les contours ayant quitté l'app, ce bouton
    // s'est retrouvé sans rien — un fond transparent, plus de trait, et une
    // ombre qui n'avait plus de forme à porter. Il reprend l'aplat de la
    // carte, le plus neutre de la rangée : c'est sa taille, la moitié des
    // autres, qui dit qu'il n'est pas une réponse.
    undoButton: {
      backgroundColor: colors.surface,
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
