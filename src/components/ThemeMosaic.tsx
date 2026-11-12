import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Texte as Text } from './Texte';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { CANDIDATES_BY_ID } from '../data/candidates';
import { THEMES } from '../data/themes';
import { alterneParCandidat } from '../utils/alternance';
import { PROPOSAL_EXPLANATIONS } from '../data/proposalExplanations';
import { Answers, AnswerValue, Proposal, ThemeTag } from '../types';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors, useThemeColor } from '../theme/ThemeContext';
import { RESSORT, usePression } from './mouvement';
import { ThemeIcon } from './ThemeIcon';

// Mosaïque colorée des thèmes, portant sur TOUT LE CATALOGUE embarqué et non
// sur le seul paquet de la session.
//
// Une version précédente n'affichait que le paquet, pour que ses décomptes
// recoupent ceux du classement provisoire, alors juste à côté. Mais l'app embarque
// désormais bien plus de propositions qu'une partie n'en tire : n'en montrer
// que la moitié revenait à cacher ce qu'on a sous la main. Le risque de
// confusion est traité autrement, en le disant — l'en-tête annonce les deux
// nombres, et chaque proposition déjà répondue porte la réponse donnée.
//
// Qui propose quoi reste masqué par défaut, pour ne pas biaiser les réponses
// pendant le swipe. L'état de la bascule est tenu par l'écran parent, qui
// l'applique aussi au classement par thème (voir SwipeScreen).
// LE THÈME OUVERT EST TENU PAR L'ÉCRAN, pas par ce composant.
//
// Il vivait ici, en état local, et c'était juste tant que la seule façon de
// refermer la liste était le chevron. Mais le retour matériel d'Android, lui,
// était capté plus haut : il ramenait droit au paquet de cartes depuis
// l'intérieur d'un thème, sautant par-dessus la mosaïque qu'on venait de
// quitter. Deux pas en arrière pour un seul geste.
//
// Remonter l'état plutôt qu'ajouter un second gestionnaire de retour est ce
// qui rend l'ordre certain : deux `BackHandler` concurrents se départagent par
// leur ordre d'inscription, donc par l'ordre des effets de React — un détail
// d'implémentation, pas une règle sur laquelle bâtir une navigation. Ici, un
// seul gestionnaire lit un seul état (voir SwipeScreen).
export function ThemeMosaic({
  proposals,
  deckIds,
  answers,
  revealCandidates,
  onToggleReveal,
  selectedTheme,
  onSelectTheme,
  paddingBas = 0,
}: {
  // Tout le catalogue, pas seulement le paquet en cours.
  proposals: Proposal[];
  // Identifiants des propositions tirées pour cette partie.
  deckIds: Set<string>;
  answers: Answers;
  revealCandidates: boolean;
  onToggleReveal: () => void;
  // Thème dont on lit les propositions, ou `null` pour la mosaïque.
  selectedTheme: ThemeTag | null;
  onSelectTheme: (theme: ThemeTag | null) => void;
  // Hauteur à dégager sous le contenu : la barre de navigation flotte
  // au-dessus de l'écran, et le défilement passe derrière elle. Sans cette
  // réserve, la dernière ligne s'arrêterait sous la barre sans qu'on puisse
  // la faire remonter.
  paddingBas?: number;
}) {
  const colors = useColors();
  const getThemeColor = useThemeColor();
  const pressionReveal = usePression(0.98);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { countByTheme, proposalsByTheme, themes } = useMemo(() => {
    const count: Record<string, number> = {};
    const byTheme: Record<string, Proposal[]> = {};
    for (const p of proposals) {
      count[p.themeId] = (count[p.themeId] ?? 0) + 1;
      (byTheme[p.themeId] ??= []).push(p);
    }
    // CHAQUE THÈME ALTERNE SES CANDIDATS (voir utils/alternance.ts). Le
    // catalogue arrive rangé candidat par candidat : sans cela, ouvrir un
    // thème donnait toutes les mesures du même avant d'atteindre le suivant,
    // et le même nom ouvrait les quinze listes.
    //
    // Le décalage vient du RANG DU THÈME dans la liste : un nombre stable, qui
    // ne dépend ni du hasard ni des réponses, si bien que la liste est la même
    // à chaque ouverture — mais il change d'un thème à l'autre, ce qui fait
    // tourner la place de tête.
    for (const themeId of Object.keys(byTheme)) {
      byTheme[themeId] = alterneParCandidat(
        byTheme[themeId],
        THEMES.findIndex((t) => t.id === themeId)
      );
    }
    return {
      countByTheme: count,
      proposalsByTheme: byTheme,
      themes: THEMES.filter((t) => count[t.id] > 0),
    };
  }, [proposals]);

  const toggleReveal = onToggleReveal;

  // Une RANGÉE PLEINE LARGEUR, pas une pastille centrée.
  //
  // La pastille flottait seule au-dessus de la mosaïque, bordée de vide des
  // deux côtés, et la phrase qui l'expliquait vivait en dessous, séparée : le
  // bandeau montait à près de 280 px avant la première tuile, pour un seul
  // réglage. En rassemblant l'interrupteur et son explication dans un même
  // bloc qui occupe toute la largeur, on supprime le vide latéral et on gagne
  // la hauteur d'un bloc — et l'explication redevient ce qu'elle doit être :
  // le sous-titre du bouton, pas un paragraphe indépendant.
  const revealToggle = (
    <Pressable
      onPress={toggleReveal}
      onPressIn={pressionReveal.onPressIn}
      onPressOut={pressionReveal.onPressOut}
      style={styles.revealPressable}
      accessibilityRole="switch"
      accessibilityState={{ checked: revealCandidates }}
      accessibilityLabel={
        revealCandidates
          ? 'Masquer les candidats, pour garder le suspense'
          : 'Afficher les candidats, cela révélera qui propose quoi'
      }
    >
      {/* Un bloc large s'enfonce peu : 2 %, là où un petit bouton descend à
          7 %. À réduction égale, un bloc de trois cents pixels reculerait de
          dix à chaque bord, ce qui n'est plus un appui mais un saut. */}
      <Animated.View
        style={[
          styles.revealToggle,
          revealCandidates && styles.revealToggleOn,
          pressionReveal.style,
        ]}
      >
        <View style={[styles.revealIcon, revealCandidates && styles.revealIconOn]}>
          <Ionicons
            name={revealCandidates ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color={revealCandidates ? colors.accentText : colors.textSecondary}
          />
        </View>
        <View style={styles.revealTexts}>
          <Text style={[styles.revealToggleText, revealCandidates && styles.revealToggleTextOn]}>
            {revealCandidates ? 'Candidats visibles' : 'Candidats masqués'}
          </Text>
          <Text style={styles.revealHint}>
            {revealCandidates
              ? 'Le nom s’affiche sous chaque proposition. Touche pour le masquer.'
              : 'Les propositions sont visibles, pas leurs auteurs. Touche pour les découvrir.'}
          </Text>
        </View>
        {/* Interrupteur dessiné, et non une icône.
            `toggle` et `toggle-outline` d'Ionicons portent TOUTES DEUX le
            curseur à droite : elles ne diffèrent que par le remplissage.
            L'état éteint s'affichait donc avec le curseur du côté allumé, ce
            qui disait exactement le contraire de la vérité. Deux vues
            suffisent, et la position du curseur devient la conséquence de
            l'état plutôt qu'une ressemblance approximative. */}
        <Interrupteur actif={revealCandidates} colors={colors} styles={styles} />
      </Animated.View>
    </Pressable>
  );

  if (selectedTheme) {
    const themeProposals = proposalsByTheme[selectedTheme.id] ?? [];
    return (
      <View style={styles.detail}>
        <View style={styles.detailHeader}>
          <Pressable
            onPress={() => onSelectTheme(null)}
            hitSlop={8}
            style={({ pressed }) => [styles.detailBack, pressed && styles.detailBackPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Retour à la mosaïque des thèmes, actuellement : ${selectedTheme.label}`}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            <View style={[styles.detailIconBadge, { backgroundColor: getThemeColor(selectedTheme.id) }]}>
              <ThemeIcon icon={selectedTheme.icon} size={16} color="#FFFFFF" weight="bold" />
            </View>
            <Text style={styles.detailTitle} numberOfLines={1}>
              {selectedTheme.label}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.detailList, { paddingBottom: spacing.xl + paddingBas }]}
          showsVerticalScrollIndicator={false}
        >
          {themeProposals.map((proposal) => {
            const candidate = revealCandidates ? CANDIDATES_BY_ID[proposal.candidateId] : null;
            if (revealCandidates && !candidate) return null;
            return (
              <View key={proposal.id} style={styles.propRow}>
                {candidate && <Avatar candidate={candidate} size={32} />}
                <View style={styles.propTextWrap}>
                  {candidate && <Text style={styles.propCandidateName}>{candidate.name}</Text>}
                  <Text style={styles.propText}>{proposal.text}</Text>
                  <AnswerBadge
                    answer={answers[proposal.id]}
                    inDeck={deckIds.has(proposal.id)}
                    colors={colors}
                    styles={styles}
                  />
                  {/* Même décodage que sur la carte de swipe, et seulement
                      quand la mesure en a besoin : les explications sont
                      facultatives depuis qu'une paraphrase ne compte plus
                      comme une explication. */}
                  {PROPOSAL_EXPLANATIONS[proposal.id] && (
                    <Text style={styles.propExplanation}>
                      {PROPOSAL_EXPLANATIONS[proposal.id]}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.grid, { paddingBottom: spacing.xl + paddingBas }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.gridToggleRow}>
        {revealToggle}
        {/* Les deux nombres sont dits explicitement : la mosaïque montre tout
            le catalogue, alors que le classement ne porte que sur le paquet
            tiré. Sans cette ligne, l'écart entre les deux écrans passerait
            pour une incohérence. Alignée à gauche sur la largeur du bloc, et
            non centrée sur 320 px : centrer un texte court au milieu d'une
            colonne large est précisément ce qui creusait du vide. */}
        <Text style={styles.catalogueNote}>
          {proposals.length} propositions au total, dont {deckIds.size} tirées pour cette partie.
        </Text>
      </View>
      <View style={styles.gridRow}>
        {themes.map((theme) => (
          <Pressable
            key={theme.id}
            onPress={() => onSelectTheme(theme)}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: getThemeColor(theme.id) },
              pressed && styles.tilePressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${theme.label}, ${countByTheme[theme.id] ?? 0} propositions`}
          >
            <ThemeIcon icon={theme.icon} size={30} color="#FFFFFF" weight="duotone" />
            <View>
              <Text style={styles.tileLabel} numberOfLines={2}>
                {theme.label}
              </Text>
              <Text style={styles.tileCount}>
                {countByTheme[theme.id] ?? 0} proposition{(countByTheme[theme.id] ?? 0) > 1 ? 's' : ''}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

// Ce que tu as répondu à cette proposition, ou le fait qu'elle ne soit pas
// dans ton paquet. C'est ta propre réponse : elle ne dit rien de l'auteur et
// ne trahit donc pas le principe aveugle.
function AnswerBadge({
  answer,
  inDeck,
  colors,
  styles,
}: {
  answer: AnswerValue | undefined;
  inDeck: boolean;
  colors: ColorTokens;
  styles: ReturnType<typeof makeStyles>;
}) {
  if (answer) {
    const map: Record<AnswerValue, { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }> = {
      like: { icon: 'heart', label: 'Tu as adhéré', color: colors.successText },
      superlike: { icon: 'star', label: 'Super like', color: colors.warningText },
      nope: { icon: 'close', label: 'Pas pour toi', color: colors.dangerText },
      skip: { icon: 'remove-outline', label: 'Sans avis', color: colors.textMuted },
    };
    const { icon, label, color } = map[answer];
    return (
      <View style={styles.badgeRow}>
        <Ionicons name={icon} size={12} color={color} />
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.badgeRow}>
      <Ionicons
        name={inDeck ? 'ellipse-outline' : 'layers-outline'}
        size={12}
        color={colors.textMuted}
      />
      <Text style={[styles.badgeText, { color: colors.textMuted }]}>
        {inDeck ? 'Pas encore vue' : 'Pas dans ce paquet'}
      </Text>
    </View>
  );
}

// LE CURSEUR GLISSE, LA PISTE SE TEINTE.
//
// Le déplacement se fait en dur, et c'est voulu : la piste et le curseur ont
// des tailles fixes (46 et 22, 3 de marge), donc le trajet aussi. Le mesurer
// coûterait une passe de mise en page pour retrouver un nombre écrit deux
// lignes plus haut dans la feuille de style.
//
// Les couleurs des deux états ne changent pas : ce sont celles qu'un test de
// contraste vérifie (data/themeColors.test.ts), curseur éteint sur piste
// éteinte et curseur allumé sur accent. Allumé, il prend `onAccent` et non un
// blanc figé : sur un accent lime, le blanc ne donnerait que 1.2:1.
const TRAJET_CURSEUR = 46 - 3 * 2 - 22;

function Interrupteur({
  actif,
  colors,
  styles,
}: {
  actif: boolean;
  colors: ColorTokens;
  styles: ReturnType<typeof makeStyles>;
}) {
  const stylePiste = useAnimatedStyle(() => ({
    backgroundColor: withTiming(actif ? colors.accent : colors.neutralTrack, { duration: 160 }),
  }));

  const styleCurseur = useAnimatedStyle(() => ({
    backgroundColor: withTiming(actif ? colors.onAccent : colors.textMuted, { duration: 160 }),
    transform: [{ translateX: withSpring(actif ? TRAJET_CURSEUR : 0, RESSORT) }],
  }));

  return (
    <Animated.View style={[styles.switchTrack, stylePiste]}>
      <Animated.View style={[styles.switchKnob, styleCurseur]} />
    </Animated.View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    catalogueNote: {
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.45,
      color: colors.textMuted,
      paddingHorizontal: spacing.xs,
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    badgeText: {
      fontSize: fonts.etiquette,
      fontWeight: '700',
    },
    grid: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    gridToggleRow: {
      alignSelf: 'stretch',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    revealHint: {
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.4,
      color: colors.textSecondary,
    },
    revealPressable: {
      alignSelf: 'stretch',
    },
    revealToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
    },
    revealIcon: {
      width: 34,
      height: 34,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    revealIconOn: {
      backgroundColor: colors.accentSoft,
    },
    // Piste et curseur de l'interrupteur. Le curseur part du bord gauche et
    // se déplace de `TRAJET_CURSEUR` : sa position n'est plus une affaire
    // d'alignement, puisqu'elle s'anime (voir `Interrupteur`).
    switchTrack: {
      width: 46,
      height: 28,
      borderRadius: radii.pill,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: colors.neutralTrack,
    },
    // Le curseur change de couleur avec l'etat, et pas seulement de cote.
    // Un curseur en `surface` ne donnait que 1.24:1 sur la piste en theme
    // clair et 1.32:1 en sombre : present, mais invisible. Ces deux teintes
    // tiennent le seuil de 3:1 des elements d'interface, verifie par un test.
    switchKnob: {
      width: 22,
      height: 22,
      borderRadius: radii.pill,
      backgroundColor: colors.textMuted,
    },
    // Occupe tout l'espace entre l'icone et l'interrupteur : c'est ce qui
    // colle le titre a gauche et l'interrupteur a droite, sans marge morte.
    revealTexts: {
      flex: 1,
      gap: 1,
    },
    revealToggleOn: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accentSoft,
    },
    revealToggleText: {
      fontSize: fonts.tiny + 1,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    revealToggleTextOn: {
      color: colors.accentText,
    },
    gridRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    tile: {
      width: '48%',
      aspectRatio: 1.15,
      borderRadius: radii.lg,
      padding: spacing.md,
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    tilePressed: {
      opacity: 0.85,
    },
    tileLabel: {
      fontSize: fonts.small,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    // Blanc plein, et non `rgba(255,255,255,0.85)` : les 15 % de transparence
    // laissaient remonter la couleur de la tuile et faisaient tomber le
    // contraste sous 4.5:1 sur 5 des 15 thèmes (pire cas : emploi à 4.08:1),
    // et sur 84 % des teintes possibles en mode arc-en-ciel, dont les couleurs
    // sont choisies pile au seuil face au blanc et n'ont donc aucune marge à
    // céder. La hiérarchie avec le libellé passe par la taille et la graisse.
    tileCount: {
      fontSize: fonts.tiny,
      fontWeight: '600',
      color: '#FFFFFF',
      marginTop: 2,
    },
    detail: {
      flex: 1,
    },
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    detailBack: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    detailBackPressed: {
      opacity: 0.7,
    },
    detailIconBadge: {
      width: 30,
      height: 30,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailTitle: {
      flex: 1,
      fontSize: fonts.body,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    detailList: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.sm,
    },
    propRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm + 2,
    },
    propTextWrap: {
      flex: 1,
      gap: 2,
    },
    propCandidateName: {
      fontSize: fonts.tiny + 1,
      fontWeight: '700',
      color: colors.accentText,
    },
    propText: {
      fontSize: fonts.tiny + 2,
      lineHeight: (fonts.tiny + 2) * 1.35,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    propExplanation: {
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.4,
      color: colors.textSecondary,
    },
  });
}
