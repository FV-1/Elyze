import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Podium } from './Podium';
import { ResultRow } from './ResultRow';
import { ThemeAgreementList } from './ThemeAgreementList';
import { CandidateGrid } from './CandidateGrid';
import { CandidateResult, ThemeAgreement } from '../types';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';
import { Bascule } from './Bascule';
import { usePression } from './mouvement';

// Contenu de l'onglet « Classement » pendant le swipe : le podium provisoire,
// puis au choix le classement complet ou l'accord thème par thème.
//
// Extrait de SwipeScreen, qui approchait les 740 lignes. Le découpage suit une
// ligne simple : l'écran garde ce qui relève de la SESSION (l'index courant,
// les réponses, le paquet, les modales qu'il pilote), et délègue chaque onglet
// à un composant qui ne reçoit que du calculé. Celui-ci ne connaît ni les
// réponses ni les propositions — seulement des résultats déjà agrégés.
//
// Le sous-onglet vit ici, pas dans l'écran : il ne concerne que ce panneau, et
// le remonter obligeait l'écran à tenir un état dont il ne faisait rien.
//
// « Candidats » a rejoint ces vues en quittant la barre du bas, ou il tenait
// un cinquieme onglet permanent pour un trombinoscope qui ne change jamais
// (voir CandidateGrid). Sa place est ici : ce panneau est deja celui des
// personnes, et on y touche un nom pour ouvrir la meme notice.
type RankingView = 'overview' | 'byTheme' | 'candidats';

export function RankingPanel({
  results,
  topMatch,
  confidenceLabel,
  themeAgreement,
  deckDone,
  showCandidates,
  portee,
  duel,
  onSeeResult,
  onSelectCandidate,
  onOpenCandidateInfo,
  paddingBas = 0,
}: {
  results: CandidateResult[];
  // `null` tant qu'aucune réponse comptabilisée n'a été donnée : le panneau
  // affiche alors son état vide plutôt qu'un podium de zéros.
  topMatch: CandidateResult | null;
  confidenceLabel: string | null;
  themeAgreement: ThemeAgreement[];
  // Plus une seule carte à répondre : le classement n'est plus provisoire.
  deckDone: boolean;
  // Le classement peut nommer les candidats — c'est un agrégat, il ne dit pas
  // qui a écrit telle carte. La vue par thème, elle, s'en approche assez pour
  // devoir suivre la même bascule que la mosaïque (voir SwipeScreen).
  showCandidates: boolean;
  // « Sur le thème Santé uniquement », ou `null` sur tous les thèmes. Le
  // podium ne dit pas de lui-même sur quoi il porte (voir utils/portee.ts).
  portee: string | null;
  // LA PARTIE EN COURS EST-ELLE LE DÉFI DE QUELQU'UN ?
  //
  // Ce panneau n'en savait rien, et c'était un tort : la comparaison carte par
  // carte est ce qu'on vient chercher en relevant un défi, et elle n'était
  // annoncée nulle part ailleurs que sur l'écran de duel — qu'il fallait donc
  // déjà savoir ouvrir. On swipait le paquet d'un ami en voyant son classement
  // monter, sans qu'un mot ne dise que le meilleur restait à venir.
  //
  // `resume` arrive avec la dernière carte : avant, il n'y a rien à annoncer
  // qu'une promesse.
  duel: {
    resume: { accords: number; tranchees: number } | null;
    onVoir: () => void;
  } | null;
  // Ouvrir l'écran de résultat. Une fois le paquet terminé, c'est la seule
  // chose que ce panneau propose de plus que le podium (voir plus bas).
  onSeeResult: () => void;
  onSelectCandidate: (candidateId: string) => void;
  onOpenCandidateInfo: (candidateId: string) => void;
  // Hauteur à dégager sous le contenu : la barre de navigation flotte
  // au-dessus de l'écran, et le défilement passe derrière elle. Sans cette
  // réserve, la dernière ligne s'arrêterait sous la barre sans qu'on puisse
  // la faire remonter.
  paddingBas?: number;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [view, setView] = useState<RankingView>('overview');

  // Le podium ne coiffe que les deux vues qui parlent de TES réponses. Au
  // dessus du trombinoscope il donnerait à lire une grille alphabétique comme
  // la suite d’un classement, ce qu’elle n’est pas.
  const montrerPodium = topMatch !== null && view !== 'candidats';

  // L’absence de résultat ne vide plus tout le panneau. Elle ne concerne que
  // le classement et l’accord par thème ; les candidats, eux, sont
  // consultables dès la première seconde et n’attendent aucune réponse.
  const vide = (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyEmoji}>🤔</Text>
      <Text style={styles.emptyText}>
        Pas encore assez de réponses pour un aperçu. Reviens sur l’onglet Swiper.
      </Text>
    </View>
  );

  // UNE FOIS LE PAQUET TERMINÉ, CE PANNEAU N'EST PLUS UN CLASSEMENT.
  //
  // Il en montrait un, complet, sujet par sujet — c'est-à-dire exactement ce
  // que l'écran de résultat montre, à deux touchers de là et sans le partage
  // ni le duel. Deux écrans disaient la même chose sans que rien ne désigne
  // lequel était LE résultat, et l'écran de fin du paquet renvoyait vers « ton
  // classement complet » alors qu'un onglet du même nom était visible juste en
  // dessous.
  //
  // Il garde donc ce qu'il est seul à donner : le podium, en résumé, et la
  // grille des candidats — la seule porte vers les notices Wikipédia. Le reste
  // est derrière un bouton, et il n'y a plus qu'une réponse à la question
  // « où est mon résultat ? ».
  if (deckDone) {
    return (
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xl + paddingBas }]}
        showsVerticalScrollIndicator={false}
      >
        {portee && <Text style={styles.portee}>{portee}</Text>}
        {topMatch && (
          <>
            <Podium results={results} instant onCandidatePress={onOpenCandidateInfo} />
            {confidenceLabel && <Text style={styles.confidence}>{confidenceLabel}</Text>}
          </>
        )}

        {/* LA COMPARAISON PASSE DEVANT LE CLASSEMENT quand la partie est un
            défi. Le classement, on l'aurait eu de toute façon ; ce qu'on est
            venu chercher en relevant le défi de quelqu'un, c'est de voir où
            l'on se sépare. */}
        {duel?.resume ? (
          <View style={styles.finBloc}>
            <Text style={styles.finTitre}>Votre comparaison t’attend</Text>
            <Text style={styles.finTexte}>
              Vous avez tranché {duel.resume.tranchees} carte
              {duel.resume.tranchees > 1 ? 's' : ''} tous les deux, et vous êtes d’accord sur{' '}
              {duel.resume.accords}. Carte par carte, voilà où vous vous séparez.
            </Text>
            <Pressable
              onPress={duel.onVoir}
              style={({ pressed }) => [styles.finBouton, pressed && styles.finBoutonPresse]}
              accessibilityRole="button"
              accessibilityLabel="Voir ce que chacun a validé, carte par carte"
            >
              <Ionicons name="git-compare-outline" size={18} color={colors.onAccent} />
              <Text style={styles.finBoutonTexte}>Voir qui a validé quoi</Text>
            </Pressable>
            <Pressable
              onPress={onSeeResult}
              hitSlop={8}
              style={styles.finLienWrap}
              accessibilityRole="button"
              accessibilityLabel="Voir mon résultat"
            >
              <Text style={styles.finLien}>Voir mon résultat</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.finBloc}>
            <Text style={styles.finTitre}>
              {topMatch ? 'Ton classement est définitif' : 'Tu as répondu à toutes les cartes'}
            </Text>
            <Text style={styles.finTexte}>
              {topMatch
                ? 'Le classement complet, l’accord sujet par sujet et le partage t’attendent sur ton résultat.'
                : 'Aucune de tes réponses n’a pu être comptabilisée. Ton résultat t’explique pourquoi.'}
            </Text>
            <Pressable
              onPress={onSeeResult}
              style={({ pressed }) => [styles.finBouton, pressed && styles.finBoutonPresse]}
              accessibilityRole="button"
              accessibilityLabel="Voir mon résultat"
            >
              <Text style={styles.finBoutonTexte}>Voir mon résultat</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
            </Pressable>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Les candidats comparés</Text>
          <CandidateGrid onSelect={onOpenCandidateInfo} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: spacing.xl + paddingBas }]}
      showsVerticalScrollIndicator={false}
    >
      {portee && <Text style={styles.portee}>{portee}</Text>}

      {/* Le défi, annoncé PENDANT qu'on le joue. Sans cette ligne, le
          classement provisoire qui monte est tout ce qu'on voit, et rien ne
          laisse deviner qu'une comparaison carte par carte attend à l'arrivée. */}
      {duel && (
        <View style={styles.defiEnCours}>
          <Ionicons name="git-compare-outline" size={17} color={colors.accentText} />
          <Text style={styles.defiEnCoursTexte}>
            Tu joues le défi de quelqu’un. À la dernière carte, vous verrez l’un et l’autre ce
            que chacun a validé.
          </Text>
        </View>
      )}

      {/* « Continue à répondre » n'a plus de sens une fois la dernière carte
          tranchée : il n'en reste aucune. La phrase invitait alors à une
          action impossible, et laissait croire que le classement affiché
          n'était pas le résultat final. Le paquet terminé part désormais dans
          une autre branche (voir plus haut), si bien que le seul chemin qui
          arrive ici est celui d'une partie en cours. */}
      {montrerPodium && (
        <Text style={styles.hint}>
          Provisoire, ça va encore bouger. Continue à répondre pour un résultat plus fiable.
        </Text>
      )}

      {montrerPodium && (
        <>
          <Podium results={results} instant onCandidatePress={onOpenCandidateInfo} />
          {confidenceLabel && <Text style={styles.confidence}>{confidenceLabel}</Text>}
        </>
      )}

      <View style={styles.subTabRow}>
        <SubTab
          styles={styles}
          label="Classement"
          accessibilityLabel="Classement des candidats"
          selected={view === 'overview'}
          onPress={() => setView('overview')}
        />
        <SubTab
          styles={styles}
          label="Par thème"
          accessibilityLabel="Avec qui tu es d’accord, sujet par sujet"
          selected={view === 'byTheme'}
          onPress={() => setView('byTheme')}
        />
        <SubTab
          styles={styles}
          label="Candidats"
          accessibilityLabel="Qui sont les candidats comparés"
          selected={view === 'candidats'}
          onPress={() => setView('candidats')}
        />
      </View>

      {/* Les trois vues partagent une seule bascule : elles s'excluent, donc
          une seule est montée à la fois, et la clé dit laquelle. Le podium et
          la rangée de sous-onglets, eux, restent en place : c'est la page qui
          change de vue, pas l'écran qui change de page. */}
      <Bascule cle={view}>
        {view === 'candidats' && <CandidateGrid onSelect={onOpenCandidateInfo} />}

        {view === 'overview' &&
        (topMatch ? (
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Qui a le plus de votes</Text>
          {results.map((result) => (
            <ResultRow
              key={result.candidate.id}
              result={result}
              // Le rang, égalités comprises : deux ex æquo portent la même
              // médaille, comme sur le podium juste au-dessus.
              rank={result.rank}
              emphasized={result.candidate.id === topMatch.candidate.id}
              onPress={() => onSelectCandidate(result.candidate.id)}
            />
          ))}
        </View>
        ) : (
          vide
        ))}

        {view === 'byTheme' &&
        (topMatch ? (
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Avec qui tu es d’accord, sujet par sujet</Text>
          <Text style={styles.sectionCaption}>
            Les nombres sont ceux de tes réponses, pas des pourcentages : sur un sujet donné, un
            candidat n’a souvent qu’une ou deux propositions dans le paquet.
          </Text>

          <ThemeAgreementList
            entries={themeAgreement}
            showCandidates={showCandidates}
            hiddenNote="Les noms restent masqués tant que tu swipes. Tu peux les afficher depuis l’onglet Propositions."
          />
        </View>
        ) : (
          vide
        ))}
      </Bascule>
    </ScrollView>
  );
}

function SubTab({
  styles,
  label,
  accessibilityLabel,
  selected,
  onPress,
}: {
  styles: ReturnType<typeof makeStyles>;
  label: string;
  accessibilityLabel: string;
  selected: boolean;
  onPress: () => void;
}) {
  // Comme le rail des thèmes dans les réglages, ce groupe s'allume sur place
  // plutôt que de faire glisser une pastille : le libellé choisi passe au
  // blanc pour se lire sur l'accent, et ce blanc serait illisible sur le fond
  // clair du rail pendant tout le trajet (voir components/mouvement.ts).
  const pression = usePression(0.95);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pression.onPressIn}
      onPressOut={pression.onPressOut}
      style={styles.subTabSlot}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[styles.subTab, selected && styles.subTabActive, pression.style]}>
        <Text
          style={[styles.subTabText, selected && styles.subTabTextActive]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xl,
      gap: spacing.lg,
    },
    subTabRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.pill,
      padding: 4,
      gap: 4,
    },
    // La zone tactile garde sa largeur ; c'est le bloc coloré qui s'enfonce.
    subTabSlot: {
      flex: 1,
    },
    subTab: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderRadius: radii.pill,
    },
    subTabActive: {
      backgroundColor: colors.accent,
    },
    subTabText: {
      fontSize: fonts.tiny + 1,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    subTabTextActive: {
      color: colors.onAccent,
    },
    confidence: {
      marginTop: spacing.sm,
      fontSize: fonts.tiny + 1,
      fontWeight: '600',
      color: colors.textMuted,
      textAlign: 'center',
    },
    hint: {
      fontSize: fonts.tiny + 1,
      lineHeight: (fonts.tiny + 1) * 1.4,
      color: colors.textMuted,
      textAlign: 'center',
    },
    // Sur quoi porte ce classement, quand ce n'est pas sur tout.
    portee: {
      fontSize: fonts.small,
      fontWeight: '700',
      color: colors.accentText,
      textAlign: 'center',
    },
    // Le rappel du défi en cours, pendant qu'on le joue.
    defiEnCours: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      backgroundColor: colors.accentSoft,
      borderRadius: radii.sm,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
    },
    defiEnCoursTexte: {
      flex: 1,
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.45,
      fontWeight: '600',
      color: colors.accentText,
    },
    // Le bloc qui remplace le classement dupliqué une fois le paquet fini.
    finBloc: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.lg,
      gap: spacing.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    finTitre: {
      fontSize: fonts.body,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    finTexte: {
      fontSize: fonts.small,
      lineHeight: fonts.small * 1.45,
      color: colors.textSecondary,
    },
    finBouton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginTop: spacing.xs,
      backgroundColor: colors.accent,
      borderRadius: radii.pill,
      paddingVertical: spacing.md - 2,
    },
    finBoutonPresse: {
      backgroundColor: colors.accentStrong,
    },
    finBoutonTexte: {
      fontSize: fonts.small + 2,
      fontWeight: '700',
      color: colors.onAccent,
    },
    // Le classement devient le second choix quand une comparaison l'attend :
    // un lien, pas un bouton, pour que le premier reste le premier.
    finLienWrap: {
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    finLien: {
      fontSize: fonts.small,
      fontWeight: '700',
      color: colors.accentText,
    },
    listSection: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    sectionCaption: {
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.45,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    emptyWrap: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xxl,
    },
    emptyEmoji: {
      fontSize: 32,
    },
    emptyText: {
      fontSize: fonts.body,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280,
    },
  });
}
