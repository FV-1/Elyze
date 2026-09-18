import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Texte as Text } from './Texte';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ColorTokens, fonts, PALETTE, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Ce panneau s'affiche toujours sur un voile sombre, quel que soit le thème.
// Les trois accents de la palette y tiennent tels quels — ils sont clairs, et
// c'est sur du sombre qu'ils donnent le meilleur d'eux-mêmes (la pêche à
// 8.9:1, le lime à 14.3:1). Aucune couleur calibrée à part n'est plus
// nécessaire : ce sont les couleurs de l'app, à pleine valeur.
const ON_SCRIM_NOPE = PALETTE.peach;
const ON_SCRIM_LIKE = PALETTE.lime;
const ON_SCRIM_STAR = PALETTE.cream;
const ON_SCRIM_NEUTRAL = PALETTE.mutedOnNight;

export function SwipeTutorialOverlay({ onDismiss }: { onDismiss: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const reducedMotion = useReducedMotion();
  const handX = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      handX.value = 0;
      return;
    }
    handX.value = withRepeat(
      withSequence(
        withTiming(46, { duration: 650 }),
        withTiming(-46, { duration: 900 }),
        withTiming(0, { duration: 450 })
      ),
      -1,
      false
    );
  }, [reducedMotion, handX]);

  const handStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: handX.value }, { rotate: '-14deg' }],
  }));

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <View style={styles.scrim} />
      <View style={styles.content}>
        <Animated.Text style={[styles.hand, handStyle]}>👆</Animated.Text>
        <Text style={styles.title}>Glisse la carte</Text>
        <View style={styles.legend}>
          <Text style={styles.legendText}>← Pas pour moi</Text>
          <Text style={styles.legendText}>J’adhère →</Text>
        </View>
        <Text style={styles.subtitle}>Ou utilise les boutons en dessous de la carte :</Text>

        <View style={styles.buttonsLegend}>
          <View style={styles.buttonRow}>
            <Ionicons name="arrow-undo" size={16} color={ON_SCRIM_NEUTRAL} />
            <Text style={styles.buttonRowText}>Annuler le dernier choix</Text>
          </View>
          <View style={styles.buttonRow}>
            <Ionicons name="close" size={18} color={ON_SCRIM_NOPE} />
            <Text style={styles.buttonRowText}>Pas pour moi</Text>
          </View>
          <View style={styles.buttonRow}>
            <Ionicons name="remove-outline" size={16} color={ON_SCRIM_NEUTRAL} />
            <Text style={styles.buttonRowText}>Pas d’avis</Text>
          </View>
          <View style={styles.buttonRow}>
            <Ionicons name="heart" size={16} color={ON_SCRIM_LIKE} />
            <Text style={styles.buttonRowText}>J’adhère</Text>
          </View>
          <View style={styles.buttonRow}>
            <Ionicons name="star" size={16} color={ON_SCRIM_STAR} />
            <Text style={styles.buttonRowText}>Super like, compte 3 fois plus dans ton résultat</Text>
          </View>
        </View>

        <Pressable
          onPress={onDismiss}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Compris, fermer le tutoriel"
        >
          <Text style={styles.buttonText}>Compris</Text>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrim: {
      ...StyleSheet.absoluteFill,
      // 0.86 plutôt que 0.72 : en thème clair, le fond de l'app transparaissait
      // assez pour ramener le voile à un gris moyen sur lequel plus aucune
      // icône colorée ne passait le contraste.
      backgroundColor: 'rgba(10,9,14,0.86)',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
    },
    hand: {
      fontSize: 56,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fonts.title,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    legend: {
      flexDirection: 'row',
      gap: spacing.xl,
      marginTop: spacing.xs,
    },
    legendText: {
      fontSize: fonts.small,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: fonts.small,
      color: 'rgba(255,255,255,0.75)',
      textAlign: 'center',
      lineHeight: fonts.small * 1.4,
      maxWidth: 280,
      marginTop: spacing.xs,
    },
    buttonsLegend: {
      alignSelf: 'stretch',
      gap: spacing.sm,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    buttonRowText: {
      flex: 1,
      fontSize: fonts.tiny + 1,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    button: {
      backgroundColor: colors.action,
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xxl,
    },
    buttonPressed: {
      backgroundColor: colors.actionPressed,
    },
    buttonText: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.onAction,
    },
  });
}
