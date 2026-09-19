import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReducedMotion } from '../hooks/useReducedMotion';

// LE CHANGEMENT D'ONGLET, EN FONDU.
//
// Passer d'un onglet à l'autre remplaçait tout le contenu d'une image à la
// suivante. Rien ne disait que c'était la même page qui changeait de vue
// plutôt qu'un écran de plus : le classement, la mosaïque et le paquet
// apparaissaient à la façon d'une coupure de montage.
//
// Un fondu court, 180 ms, plus bref que celui des changements d'écran (220,
// voir ScreenTransition) : un onglet est un plus petit pas qu'un écran, et
// son animation doit être plus discrète, pas plus visible.
//
// PAS D'ANIMATION DE SORTIE, et c'est un choix. Faire disparaître l'ancien
// contenu avant d'amener le nouveau double l'attente ; le nouveau arrive donc
// tout de suite, et l'ancien s'efface sous lui.
//
// `cle` sert quand les deux vues se ressemblent assez pour que React garde la
// même instance (deux listes à la même place, par exemple) : en la changeant,
// on force le remontage, sans quoi l'animation d'entrée n'aurait pas lieu.
// Quand la vue est déjà montée et démontée par une condition, elle est
// inutile.
export function Bascule({
  cle,
  style,
  children,
}: {
  cle?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      key={cle}
      style={style}
      entering={reducedMotion ? undefined : FadeIn.duration(180)}
    >
      {children}
    </Animated.View>
  );
}
