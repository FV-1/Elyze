import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Texte as Text } from './Texte';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PROPOSAL_ARGUMENTS } from '../data/proposalArguments';
import { PROPOSAL_EXPLANATIONS } from '../data/proposalExplanations';
import { Proposal, ThemeTag } from '../types';
import { ColorTokens, fonts, radii, spacing, police } from '../theme';
import { useColors, ZoneAccent } from '../theme/ThemeContext';
import { ThemeIcon } from './ThemeIcon';

// Le débat autour d'une mesure, ouvert depuis la carte.
//
// Volontairement hors de la carte : le swipe est le cœur de l'app et doit
// rester rapide, alors que lire des arguments demande de s'arrêter. Les deux
// ne peuvent pas vivre au même endroit sans que l'un gêne l'autre.
//
// L'écran ne nomme jamais le candidat, et n'affiche aucun lien vers la fiche
// de la mesure : l'adresse d'une fiche Poligraph commence par le nom de son
// auteur, ce qui suffirait à trahir le paquet.
type ProposDebatProps = {
  visible: boolean;
  proposal: Proposal | null;
  theme: ThemeTag | null;
  onClose: () => void;
};

// LES ARGUMENTS GARDENT L'ACCENT DE L'ÉCRAN D'OÙ ILS SORTENT.
//
// Ils ont été violets, au nom d'un accent par zone : le swipe lime, les
// arguments violets, les candidats pêche. Mais cette boîte s'ouvre EN TOUCHANT
// UNE CARTE, sans changer d'écran, et elle changeait de couleur en s'ouvrant —
// un violet posé sur une page lime, le temps d'une lecture, sans que rien ne
// justifie la bascule. Elle prend le lime de l'app ; l'enveloppe reste, parce
// qu'elle doit se trouver AU-DESSUS du composant qui lit les couleurs.
export function ProposalDebateDialog(props: ProposDebatProps) {
  return (
    <ZoneAccent accent="lime">
      <Debat {...props} />
    </ZoneAccent>
  );
}

function Debat({ visible, proposal, theme, onClose }: ProposDebatProps) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const debate = proposal ? PROPOSAL_ARGUMENTS[proposal.id] : undefined;
  const explanation = proposal ? PROPOSAL_EXPLANATIONS[proposal.id] : undefined;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          >
            <Ionicons name="chevron-down" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        {proposal && (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {theme && (
              <View style={styles.themeRow}>
                <ThemeIcon icon={theme.icon} size={15} color={colors.textSecondary} />
                <Text style={styles.themeLabel}>{theme.label}</Text>
              </View>
            )}

            <Text style={styles.measure}>{proposal.text}</Text>

            {explanation && (
              <View style={styles.plain}>
                <Text style={styles.plainLabel}>EN CLAIR</Text>
                <Text style={styles.plainText}>{explanation}</Text>
              </View>
            )}

            {debate ? (
              <>
                <View style={[styles.side, styles.forSide]}>
                  <View style={styles.sideHead}>
                    <Ionicons name="thumbs-up-outline" size={16} color={colors.successText} />
                    <Text style={[styles.sideLabel, { color: colors.successText }]}>
                      CE QU’EN DISENT SES PARTISANS
                    </Text>
                  </View>
                  <Text style={styles.sideText}>{debate.pour}</Text>
                </View>

                <View style={[styles.side, styles.againstSide]}>
                  <View style={styles.sideHead}>
                    <Ionicons name="thumbs-down-outline" size={16} color={colors.dangerText} />
                    <Text style={[styles.sideLabel, { color: colors.dangerText }]}>
                      CE QU’EN DISENT SES OPPOSANTS
                    </Text>
                  </View>
                  <Text style={styles.sideText}>{debate.contre}</Text>
                </View>

                <Text style={styles.note}>
                  Ces deux résumés sont écrits par l’app, pas par le candidat. Ils rapportent les
                  arguments avancés de part et d’autre. L’app ne dit pas qui a raison, c’est à toi
                  d’en juger.
                </Text>
              </>
            ) : (
              <Text style={styles.note}>
                Les arguments pour et contre cette mesure ne sont pas encore rédigés.
              </Text>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function makeStyles(colors: ColorTokens) {
  const soft = {
  } as const;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    topBar: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
    close: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
    },
    pressed: { opacity: 0.6 },
    scroll: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.md,
    },

    themeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
   
    themeLabel: {
      fontSize: fonts.tiny,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      fontFamily: police.mono[500],
      color: colors.textSecondary,
    },

    measure: {
      fontSize: fonts.body + 3,
      lineHeight: (fonts.body + 3) * 1.4,
      fontWeight: '700',
      color: colors.textPrimary,
    },

    plain: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.md,
      padding: spacing.md,
      gap: 4,
    },
    plainLabel: {
      fontSize: fonts.tiny - 1,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.accentText,
    },
    plainText: {
      fontSize: fonts.small + 1,
      lineHeight: (fonts.small + 1) * 1.5,
      color: colors.textSecondary,
    },

    side: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.lg,
      gap: spacing.sm,
      ...soft,
    },
    // Les deux blocs ont exactement la même mise en forme : une teinte plus
    // marquée d'un côté ferait pencher la lecture avant même de lire.
    forSide: {},
    againstSide: {},
    sideHead: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    sideLabel: {
      flex: 1,
      fontSize: fonts.tiny - 1,
      fontWeight: '800',
      letterSpacing: 0.8,
    },
    sideText: {
      fontSize: fonts.body,
      lineHeight: fonts.body * 1.55,
      color: colors.textPrimary,
    },

    note: {
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.55,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: spacing.sm,
      marginTop: spacing.sm,
    },
  });
}
