import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Texte as Text } from './Texte';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { CandidateResult } from '../types';
import { ColorTokens, fonts, spacing, police } from '../theme';
import { useColors } from '../theme/ThemeContext';

const BAR_HEIGHT = 10;
const BAR_RADIUS = 4;

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function ResultRow({
  result,
  emphasized,
  rank,
  onPress,
}: {
  result: CandidateResult;
  emphasized: boolean;
  rank: number;
  onPress: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  // `answered` (et non `total`, qui est pondéré par les super likes) : la
  // ligne doit afficher un nombre de propositions, pas un poids de calcul.
  const { candidate, pct, answered, tied } = result;
  const fillColor = emphasized ? colors.accent : colors.neutralFill;
  const medal = MEDALS[rank];
  const rankWord = rank === 1 ? '1er' : `${rank}e`;
  // Le badge visuel (médaille/numéro) est décoratif et masqué aux lecteurs
  // d'écran ; l'information de rang est restituée via cette étiquette unique
  // sur toute la ligne, pour ne pas être invisible en VoiceOver/TalkBack.
  const a11yLabel = `${tied ? 'Ex æquo, ' : ''}${rankWord} : ${candidate.name}, ${candidate.party}, ${pct}% de compatibilité sur ${answered} proposition${answered > 1 ? 's' : ''}. Touche pour voir le détail.`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      <View style={styles.rankBadge} accessibilityElementsHidden importantForAccessibility="no">
        {medal ? (
          <Text style={styles.rankMedal}>{medal}</Text>
        ) : (
          <Text style={styles.rankNumber}>{rank}</Text>
        )}
      </View>

      <Avatar candidate={candidate} size={40} emphasized={emphasized} />

      <View style={styles.middle}>
        {/* LE POURCENTAGE EST À CÔTÉ DE LA BARRE, PAS EN BOUT DE RANGÉE.
            En colonne à droite, il prenait la largeur sur toute la hauteur, et
            le nom n'avait plus qu'une centaine de points : « Édouard Phili… »
            tronqué, puis sur deux lignes (rangées inégales), puis rétréci
            (tailles inégales d'un nom à l'autre). Placé au bout de la barre
            qu'il chiffre, il rend au nom toute la largeur. */}
        <Text style={styles.name} numberOfLines={1}>
          {candidate.name}
        </Text>
        <View style={styles.barLine}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor }]} />
          </View>
          <Text style={[styles.pct, emphasized && styles.pctEmphasized]}>{pct}%</Text>
        </View>
        {/* Le décompte d'abord : c'est lui qui dit le poids du pourcentage. Quand
            la ligne déborde, c'est le nom du parti qui se fait couper. */}
        <Text style={styles.caption} numberOfLines={1}>
          {answered} proposition{answered > 1 ? 's' : ''} · {candidate.party}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm + 2,
    },
    rowPressed: {
      opacity: 0.7,
    },
    rankBadge: {
      width: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rankMedal: {
      fontSize: 16,
    },
    rankNumber: {
      fontSize: fonts.tiny,
      fontWeight: '700',
      color: colors.textMuted,
    },
    middle: {
      flex: 1,
      gap: 6,
    },
    name: {
      fontSize: fonts.body - 1,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    barLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    track: {
      flex: 1,
      height: BAR_HEIGHT,
      borderRadius: BAR_RADIUS,
      backgroundColor: colors.neutralTrack,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderTopRightRadius: BAR_RADIUS,
      borderBottomRightRadius: BAR_RADIUS,
    },
    caption: {
      fontSize: fonts.tiny,
      color: colors.textMuted,
    },
    pct: {
      fontSize: fonts.body + 1,
      fontWeight: '700',
      color: colors.textSecondary,
      minWidth: 46,
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
      fontFamily: police.mono[500],
    },
    pctEmphasized: {
      color: colors.accentText,
    },
  });
}
