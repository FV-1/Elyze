import { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Podium } from './Podium';
import { topMatches } from '../utils/scoring';
import { CandidateResult } from '../types';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';

export const SHARE_CARD_WIDTH = 360;
// Le podium (marche + avatar + nom sur deux lignes + pourcentage) mesure à lui
// seul ~250 px : avec le résumé et la mention de fiabilité, le contenu atteint
// ~420 px. À l'ancienne hauteur de 460 il débordait sur la marque et le pied
// de carte, tous deux positionnés en absolu.
export const SHARE_CARD_HEIGHT = 560;

// La mention de portée ajoute une pastille et son interligne. Quarante pixels
// de plus plutôt qu'une marge rognée : le contenu est centré entre une marque
// et un pied de carte posés en absolu, et le serrer les ferait se toucher.
// Hauteur inchangée pour un classement général, qui reste le cas courant.
export const SHARE_CARD_HEIGHT_PORTEE = 600;

export function shareCardHeight(portee: string | null): number {
  return portee ? SHARE_CARD_HEIGHT_PORTEE : SHARE_CARD_HEIGHT;
}

type Props = {
  results: CandidateResult[];
  confidenceLabel: string | null;
  // « Sur le thème Santé uniquement », ou `null` pour un classement général.
  // C'est LA raison d'être de cette mention : l'image part seule, et un podium
  // nu se lit comme un verdict sur tout un programme (voir utils/portee.ts).
  portee: string | null;
};

// Carte dédiée au partage : capturée en image via react-native-view-shot,
// donc pensée pour être lisible seule (hors contexte de l'app), avec la
// marque et le podium directement dessus. On y montre le top 3 et pas
// seulement le vainqueur : l'écart avec les suivants fait partie du résultat,
// et c'est bien plus parlant à partager qu'un seul nom.
export const ShareCard = forwardRef<View, Props>(function ShareCard(
  { results, confidenceLabel, portee },
  ref
) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const top = results[0];
  const premiers = topMatches(results);

  return (
    <View ref={ref} style={[styles.card, { height: shareCardHeight(portee) }]} collapsable={false}>
      <Text style={styles.brand}>ÉLYZE 2027</Text>

      {/* Au-dessus du podium, et non en petits caractères sous le pied de
          carte : qui regarde une image s'arrête au podium, et la portée doit
          être lue avant lui, pas après. */}
      {portee && (
        <View style={styles.porteePill}>
          <Text style={styles.porteeText} numberOfLines={2}>
            {portee}
          </Text>
        </View>
      )}

      <View style={styles.podiumWrap}>
        {/* `instant` : la capture peut avoir lieu avant la fin de l'animation
            du pourcentage, qui serait alors figée sur une valeur partielle. */}
        <Podium results={results} instant nameLines={2} />
      </View>

      {top && (
        <View style={styles.summary}>
          {/* L'image partagée ne peut pas se permettre de désigner un
              vainqueur quand il n'y en a pas : c'est elle qui circule, sans
              l'app autour pour nuancer. */}
          <Text style={styles.summaryLabel}>
            {premiers.length > 1 ? 'MES MEILLEURS MATCHS' : 'MON MEILLEUR MATCH'}
          </Text>
          <Text style={styles.summaryValue} numberOfLines={2}>
            {premiers.length > 1
              ? `${top.pct}% avec ${premiers.length} candidats à égalité`
              : `${top.pct}% avec ${top.candidate.name}`}
          </Text>
          {premiers.length === 1 && (
            <View style={styles.partyPill}>
              <Text style={styles.partyPillText} numberOfLines={1}>
                {top.candidate.party}
              </Text>
            </View>
          )}
        </View>
      )}

      {confidenceLabel && <Text style={styles.confidence}>{confidenceLabel}</Text>}

      <Text style={styles.footer}>Sans savoir qui propose quoi avant la fin. Fais le test toi aussi</Text>
    </View>
  );
});

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    card: {
      width: SHARE_CARD_WIDTH,
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      alignItems: 'center',
      justifyContent: 'center',
      // Marges latérales resserrées par rapport au reste de l'app : les trois
      // colonnes du podium doivent tenir dans une largeur fixe.
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xxl,
      gap: spacing.sm,
    },
    brand: {
      position: 'absolute',
      top: spacing.lg,
      fontSize: fonts.tiny,
      fontWeight: '800',
      letterSpacing: 2,
      color: colors.accentText,
    },
    // Teintée d'accent et non grise : c'est une précision qui change la
    // lecture du chiffre, pas une note de bas de page.
    porteePill: {
      backgroundColor: colors.accentSoft,
      borderRadius: radii.pill,
      paddingVertical: 5,
      paddingHorizontal: spacing.md,
      maxWidth: SHARE_CARD_WIDTH - spacing.lg * 2,
    },
    porteeText: {
      fontSize: fonts.tiny,
      fontWeight: '700',
      color: colors.accentText,
      textAlign: 'center',
    },
    podiumWrap: {
      alignSelf: 'stretch',
      paddingHorizontal: spacing.xs,
      marginBottom: spacing.md,
    },
    summary: {
      alignItems: 'center',
      gap: 4,
    },
    summaryLabel: {
      fontSize: fonts.tiny - 1,
      fontWeight: '800',
      letterSpacing: 1.2,
      color: colors.textMuted,
    },
    summaryValue: {
      fontSize: fonts.body + 4,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    partyPill: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.pill,
      paddingVertical: 4,
      paddingHorizontal: spacing.md,
      marginTop: spacing.xs,
      maxWidth: SHARE_CARD_WIDTH - spacing.xl * 2,
    },
    partyPillText: {
      fontSize: fonts.tiny,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    confidence: {
      marginTop: spacing.xs,
      fontSize: fonts.tiny + 1,
      fontWeight: '600',
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
    },
    footer: {
      position: 'absolute',
      bottom: spacing.lg,
      fontSize: fonts.tiny - 1,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: spacing.xl,
    },
  });
}
