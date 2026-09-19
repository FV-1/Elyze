import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ColorTokens, fonts, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';
import { usePression } from './mouvement';

// En-tête partagé (chevron retour + titre) pour les écrans secondaires, afin
// qu'ils restent visuellement alignés entre eux.
//
// IL RESTE AU BORD, sans fond ni ombre. Il a brièvement été une île posée,
// en écho à la barre du bas ; sur six écrans qui ne sont que du titre et du
// contenu, la carte n'ajoutait rien qu'un cadre de plus à regarder. Seul le
// chevron a gardé quelque chose de ce passage : il s'enfonce sous le doigt.
export function ScreenHeader({
  title,
  onBack,
  rightAccessory,
}: {
  title: string;
  onBack?: () => void;
  rightAccessory?: React.ReactNode;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {onBack ? (
        <BoutonRetour onPress={onBack} colors={colors} styles={styles} />
      ) : (
        <View style={styles.side} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>{rightAccessory}</View>
    </View>
  );
}

function BoutonRetour({
  onPress,
  colors,
  styles,
}: {
  onPress: () => void;
  colors: ColorTokens;
  styles: ReturnType<typeof makeStyles>;
}) {
  const pression = usePression();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pression.onPressIn}
      onPressOut={pression.onPressOut}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Retour"
    >
      <Animated.View style={[styles.side, pression.style]}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    side: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontSize: fonts.body + 2,
      fontWeight: '800',
      color: colors.textPrimary,
    },
  });
}
