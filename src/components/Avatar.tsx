import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Texte as Text } from './Texte';
import { Candidate } from '../types';
import { CANDIDATE_PHOTOS } from '../data/candidatePhotos';
import { MONO_SPACING, police } from '../theme';
import { useColors } from '../theme/ThemeContext';

type Props = {
  candidate: Candidate;
  size: number;
  emphasized?: boolean;
  // Rend la photo tactile : ouvre la fiche du candidat. À ne câbler que là où
  // l'avatar est assez grand pour être visé, et où il n'est pas déjà dans une
  // zone tactile qui fait autre chose.
  onPress?: () => void;
};

export function Avatar({ candidate, size, emphasized, onPress }: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(), []);
  const photo = CANDIDATE_PHOTOS[candidate.id];
  // LE TRAIT D'ENCRE FAIT LE TOUR DE CHAQUE VISAGE.
  //
  // C'est la règle du document pour les portraits, et elle remplace le liseré
  // gris pâle d'avant : sans ombre pour les détacher, ce sont ces contours qui
  // posent les avatars sur le fond. Le premier du podium le porte plus épais,
  // ce qui suffit à le distinguer sans changer sa couleur.
  const borderColor = colors.borderStrong;
  const borderWidth = emphasized ? 3 : 2;
  const shape = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // Plus aucun recadrage à l'affichage : les onze portraits sont carrés et
  // déjà cadrés sur le visage (voir data/candidatePhotos). Trois d'entre eux
  // étaient auparavant redressés ici, à coups de hauteur calculée et de marge
  // négative, parce que `resizeMode="cover"` rogne au centre et décapitait un
  // portrait vertical. Le problème se règle dans le fichier, pas à l'écran.
  const content = photo ? (
    <Image
      source={photo}
      resizeMode="cover"
      accessible
      accessibilityRole="image"
      accessibilityLabel={candidate.name}
      style={[shape, styles.photo, { borderColor, borderWidth }]}
    />
  ) : (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={candidate.name}
      style={[
        shape,
        styles.fallback,
        {
          borderColor,
          borderWidth,
          backgroundColor: emphasized ? colors.accent : colors.surfaceAlt,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.32,
            color: emphasized ? colors.onAccent : colors.textSecondary,
          },
        ]}
      >
        {candidate.initials}
      </Text>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      accessibilityRole="button"
      accessibilityLabel={`${candidate.name}, voir sa fiche`}
    >
      {content}
    </Pressable>
  );
}

function makeStyles() {
  return StyleSheet.create({
    photo: {
      borderWidth: 1,
    },
    fallback: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Les initiales tiennent lieu de portrait : en mono, comme tout ce qui est
    // une étiquette dans cette app.
    initials: {
      fontFamily: police.mono[500],
      letterSpacing: MONO_SPACING,
    },
    pressed: {
      opacity: 0.7,
    },
  });
}
