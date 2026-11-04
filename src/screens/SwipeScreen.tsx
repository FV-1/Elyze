import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { Texte as Text } from '../components/Texte';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../components/ProgressBar';
import { usePression } from '../components/mouvement';
import { SwipeDeck, SwipeDeckHandle } from '../components/SwipeDeck';
import { ActionButtons } from '../components/ActionButtons';
import { SwipeTutorialOverlay } from '../components/SwipeTutorialOverlay';
import { BottomTabBar, BottomTabItem } from '../components/BottomTabBar';
import { Bascule } from '../components/Bascule';
import { ThemeMosaic } from '../components/ThemeMosaic';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ProposalDebateDialog } from '../components/ProposalDebateDialog';
import { SwipeDirection } from '../components/SwipeCard';
import { PROPOSALS } from '../data/proposals';
import { THEMES, THEMES_BY_ID } from '../data/themes';
import { haptics } from '../utils/haptics';
import { loadRevealCandidates, saveRevealCandidates } from '../utils/storage';
import { Answers, Proposal, ThemeTag } from '../types';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';

type Props = {
  proposals: Proposal[];
  currentIndex: number;
  answers: Answers;
  onAnswer: (proposalId: string, direction: SwipeDirection) => void;
  onUndo: () => void;
  onFinish: () => void;
  onSeeResult: () => void;
  onRestart: () => void;
  onExit: () => void;
  onOpenThemeFilter: () => void;
  // Thèmes retenus pour cette session. Sert uniquement à signaler dans la
  // barre du bas qu'on ne swipe pas tout le catalogue — le paquet, lui, est
  // déjà filtré en amont et arrive tout fait dans `proposals`.
  selectedThemeIds: string[];
  onOpenSettings: () => void;
  showTutorial: boolean;
  onDismissTutorial: () => void;
  tab: SwipeTab;
  onChangeTab: (tab: SwipeTab) => void;
};

// L'ONGLET EST TENU PAR L'ÉCRAN PARENT, comme l'était déjà le thème ouvert.
//
// Cet écran est démonté dès qu'on le quitte — pour le duel, la révision, les
// réglages — et son état local repartait alors sur « Swiper » : le retour ne
// ramenait pas là d'où l'on venait.
export type SwipeTab = 'swipe' | 'propositions';

// Deux onglets, plus l'action « Thèmes » que la barre affiche à part (voir
// BottomTabBar). Cette action a brièvement été déplacée dans l'en-tête pour
// libérer un slot ; c'était une erreur, elle y devenait une icône muette alors
// qu'elle commande ce qu'on swipe. L'en-tête n'a de toute façon pas la place
// d'un libellé : la piste de la barre de progression n'y fait qu'une centaine
// de pixels, et un troisième bouton la réduisait de moitié.
//
// Ils étaient quatre. « Candidats » est parti le premier, puis « Classement » :
// un classement provisoire doublait l'écran de résultat, et le voir monter en
// cours de partie pouvait orienter les réponses suivantes. Le classement et le
// trombinoscope des candidats vivent désormais sur l'écran de résultat.
// Hauteur retenue au bas de chaque vue tant que la barre du bas n'a pas été
// mesurée, c'est-à-dire le temps d'une seule passe de mise en page. Prise
// large : trop peu cacherait une ligne de la mosaïque pendant une image, trop
// ne laisse qu'un blanc qui se referme aussitôt.
const DEGAGEMENT_PAR_DEFAUT = 96;

const SWIPE_TABS: BottomTabItem<SwipeTab>[] = [
  { key: 'swipe', label: 'Swiper', icon: 'layers-outline' },
  { key: 'propositions', label: 'Propositions', icon: 'grid-outline' },
];

export function SwipeScreen({
  proposals,
  currentIndex,
  answers,
  onAnswer,
  onUndo,
  onFinish,
  onSeeResult,
  onRestart,
  onExit,
  onOpenThemeFilter,
  selectedThemeIds,
  onOpenSettings,
  showTutorial,
  onDismissTutorial,
  tab,
  onChangeTab,
}: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const deckRef = useRef<SwipeDeckHandle>(null);
  const insets = useSafeAreaInsets();
  // LA BARRE DU BAS FLOTTE AU-DESSUS DU CONTENU : elle est sortie du flux, et
  // rien ne lui réserve donc de place. Chaque vue dégage elle-même la hauteur
  // qu'elle occupe, mesurée plutôt que devinée — elle change avec la marge de
  // sécurité de l'appareil et avec le grossissement des libellés.
  const [hauteurBarre, setHauteurBarre] = useState(DEGAGEMENT_PAR_DEFAUT);
  const degagement = hauteurBarre + spacing.md;
  const [confirmingThemeFilter, setConfirmingThemeFilter] = useState(false);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  // Débat autour d'une mesure, ouvert depuis la carte.
  const [debateProposal, setDebateProposal] = useState<Proposal | null>(null);
  // La bascule « montrer qui propose quoi » de la mosaïque, retenue d'une
  // session à l'autre.
  const [revealCandidates, setRevealCandidates] = useState(false);
  // Thème ouvert dans l'onglet Propositions, remonté de la mosaïque pour que
  // le retour matériel puisse le refermer avant de quitter l'onglet (voir le
  // gestionnaire plus bas, et l'entête de ThemeMosaic).
  const [openTheme, setOpenTheme] = useState<ThemeTag | null>(null);

  useEffect(() => {
    loadRevealCandidates().then(setRevealCandidates);
  }, []);

  const toggleReveal = () => {
    const next = !revealCandidates;
    setRevealCandidates(next);
    saveRevealCandidates(next);
    haptics.selection();
  };

  // Ce qui a été tiré pour cette partie, pour distinguer dans l'onglet
  // Propositions les cartes du paquet des autres.
  const deckIds = useMemo(() => new Set(proposals.map((p) => p.id)), [proposals]);

  const isDeckDone = currentIndex >= proposals.length;
  // Une fois le paquet terminé, plus rien à protéger : les noms s'affichent.
  const showCandidates = revealCandidates || isDeckDone;

  // On enchaîne vers la révision au MOMENT où la dernière carte est répondue,
  // mais pas si l'écran est rouvert alors que le paquet est déjà terminé :
  // sinon revenir ici renverrait aussitôt ailleurs, et l'écran de fin
  // ci-dessous serait inatteignable.
  const finishReported = useRef(isDeckDone);
  useEffect(() => {
    if (!isDeckDone) {
      finishReported.current = false;
      return;
    }
    if (finishReported.current) return;
    finishReported.current = true;
    onFinish();
    // onFinish est stable pour la durée de vie de l'écran ; seule l'atteinte
    // de la fin du paquet doit déclencher la transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeckDone]);

  const canUndo = currentIndex > 0;


  // Retour matériel : UN PAS EN ARRIÈRE, PAS DEUX.
  //
  // Depuis l'onglet Propositions, il ramène au swipe plutôt que de quitter
  // l'écran : parcourir le catalogue ne doit pas donner l'impression d'avoir
  // perdu sa progression.
  //
  // Mais l'onglet Propositions a lui-même deux niveaux : la mosaïque des
  // thèmes, puis la liste des propositions d'un thème. Depuis cette liste, le
  // retour sautait les deux d'un coup et atterrissait sur les cartes — alors
  // que le chevron affiché juste à l'écran, lui, revenait bien à la mosaïque.
  // Deux gestes censés faire la même chose n'en faisaient pas la même.
  //
  // Enregistré ici pour passer avant le gestionnaire global d'App.tsx.
  useEffect(() => {
    if (tab === 'swipe' && !openTheme) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      // Le palier le plus profond d'abord : la liste d'un thème se referme
      // sur la mosaïque, et on reste dans l'onglet Propositions.
      if (openTheme) {
        setOpenTheme(null);
        return true;
      }
      onChangeTab('swipe');
      return true;
    });
    return () => subscription.remove();
  }, [tab, openTheme, onChangeTab]);


  // Un thème sans proposition ne peut pas être sélectionné (l'écran de choix
  // ne l'affiche pas), donc le total de référence est le nombre de thèmes
  // réellement proposables, pas THEMES.length.
  const themeFilter = useMemo(() => {
    const total = THEMES.filter((t) => PROPOSALS.some((p) => p.themeId === t.id)).length;
    const selected = selectedThemeIds.length;
    return { selected, total, filtered: selected > 0 && selected < total };
  }, [selectedThemeIds]);

  // Boutons éteints le temps que la carte sorte de l'écran.
  //
  // La double validation est déjà rendue impossible dans SwipeCard, qui ne
  // laisse une carte répondre qu'une fois. Cet état-ci ne sert donc pas à la
  // correction mais à la lisibilité : sans lui, un second appui pendant les
  // 190 ms de sortie ne produit rien du tout, et l'absence de réaction se lit
  // comme un appui manqué.
  //
  // Il ne peut pas rester bloqué : on ne l'arme que si une animation a
  // réellement démarré (`swipeTop` le dit), et il retombe dès que l'index
  // avance — ce que la validation de la carte provoque toujours.
  const [swiping, setSwiping] = useState(false);
  const [indexArme, setIndexArme] = useState(currentIndex);
  if (indexArme !== currentIndex) {
    setIndexArme(currentIndex);
    setSwiping(false);
  }

  const triggerSwipe = (direction: SwipeDirection) => {
    if (swiping) return;
    if (deckRef.current?.swipeTop(direction)) setSwiping(true);
  };

  const handleOpenThemeFilter = () => {
    if (currentIndex > 0) {
      setConfirmingThemeFilter(true);
    } else {
      onOpenThemeFilter();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* L'EN-TÊTE EST AU BORD, ET C'EST VOULU. Il a brièvement été une île
          flottante, en écho à la barre du bas : deux objets posés, deux
          ombres, deux fois quatre coins arrondis, et la page prise en
          sandwich entre eux. Rien dans les deux systèmes ne fait ça — là où
          ils font flotter une barre du haut, elle est en verre translucide,
          pas en carte opaque.
          Et l'en-tête PARLE DU CONTENU, il dit où l'on en est dans le paquet.
          Ce qui décrit le contenu lui reste attaché ; ce qui commande la
          navigation, en bas, a le droit de flotter au-dessus. */}
      <View style={styles.header}>
        {/* UNE MAISON, PAS UN CHEVRON.
            Ce bouton n'a jamais fait « page précédente » : il quitte la
            session pour l'accueil. Un chevron promet un pas en arrière dans un
            fil de navigation, alors qu'ici on sort d'un parcours de cinquante
            à cent soixante-cinq cartes — l'icône annonçait une chose et en
            faisait une autre.
            L'action, elle, n'a pas changé : la session étant enregistrée à
            chaque réponse, revenir à l'accueil ne perd rien et « Reprendre »
            attend sur place.
            Sans ce bouton, iOS n'offrirait aucune sortie, le retour n'étant
            câblé que sur la touche matérielle d'Android. */}
        <BoutonRond
          icon="home-outline"
          onPress={onExit}
          accessibilityLabel="Revenir à l’accueil, ta progression est gardée"
          colors={colors}
          styles={styles}
        />
        <View style={styles.progressWrap}>
          <ProgressBar current={currentIndex} total={proposals.length} />
        </View>
        {/* Les thèmes ne sont PAS ici. L'en-tête n'a pas la place d'un
            libellé : la piste de la barre de progression n'a pas de largeur à
            revendre, et un troisième bouton la réduisait de moitié.
            L'accès aux thèmes est dans la barre du bas, où il peut porter son
            nom et son état. */}
        <BoutonRond
          icon="options-outline"
          onPress={onOpenSettings}
          accessibilityLabel="Réglages"
          colors={colors}
          styles={styles}
        />
      </View>

      {/* CHAQUE ONGLET ENTRE EN FONDU. Les trois vues se remplaçaient d'une
          image à la suivante, ce qui ressemblait plus à un écran de plus qu'à
          la même page qui change de vue. Pas de clé à donner : la condition
          monte et démonte déjà la vue, donc l'entrée a lieu à chaque bascule. */}
      {tab === 'swipe' && (
        <Bascule style={styles.zoneOnglet}>
          {isDeckDone ? (
            <View style={[styles.doneArea, { paddingBottom: degagement }]}>
              <View style={styles.doneBadge}>
                <Ionicons name="checkmark" size={34} color={colors.onAccent} />
              </View>
              <Text style={styles.doneTitle}>Tu as répondu à toutes les propositions</Text>
              <Text style={styles.doneText}>
                Il n’y a plus de carte à swiper. Ton classement complet t’attend, et tu peux
                toujours parcourir les propositions par thème.
              </Text>

              <Pressable
                onPress={onSeeResult}
                style={({ pressed }) => [styles.donePrimary, pressed && styles.donePrimaryPressed]}
                accessibilityRole="button"
                accessibilityLabel="Voir mon résultat"
              >
                <Text style={styles.donePrimaryText}>Voir mon résultat</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.onAction} />
              </Pressable>

              <Pressable
                onPress={() => setConfirmingRestart(true)}
                style={({ pressed }) => [styles.doneSecondary, pressed && styles.doneSecondaryPressed]}
                accessibilityRole="button"
                accessibilityLabel="Recommencer à zéro"
              >
                <Ionicons name="refresh" size={16} color={colors.accentText} />
                <Text style={styles.doneSecondaryText}>Recommencer</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.deckArea}>
                <SwipeDeck
                  ref={deckRef}
                  proposals={proposals}
                  currentIndex={currentIndex}
                  themesById={THEMES_BY_ID}
                  onSwipe={onAnswer}
                  onOpenDebate={setDebateProposal}
                />
              </View>

              <View style={[styles.actionsArea, { paddingBottom: degagement }]}>
                <ActionButtons
                  canUndo={canUndo}
                  disabled={swiping}
                  onUndo={onUndo}
                  onNope={() => triggerSwipe('nope')}
                  onSkip={() => triggerSwipe('skip')}
                  onLike={() => triggerSwipe('like')}
                  onSuperlike={() => triggerSwipe('superlike')}
                />
              </View>
            </>
          )}
        </Bascule>
      )}

      {tab === 'propositions' && (
        <Bascule style={styles.zoneOnglet}>
          <ThemeMosaic
            // Tout le catalogue embarqué, et non le seul paquet tiré : cet
            // onglet sert à parcourir ce que l'app contient, pas à refléter
            // la partie en cours.
            proposals={PROPOSALS}
            deckIds={deckIds}
            answers={answers}
            revealCandidates={showCandidates}
            onToggleReveal={toggleReveal}
            selectedTheme={openTheme}
            onSelectTheme={setOpenTheme}
            paddingBas={degagement}
          />
        </Bascule>
      )}

      {showTutorial && currentIndex === 0 && tab === 'swipe' && !isDeckDone && (
        <SwipeTutorialOverlay onDismiss={onDismissTutorial} />
      )}

      {/* La marge de sécurité du bas est posée ICI et non plus par
          `SafeAreaView` : la barre étant en position absolue, c'est à elle de
          rester au-dessus de la barre d'accueil de l'appareil. Le reste de
          l'écran, lui, a le droit de passer dessous. */}
      <View
        style={[styles.barreFlottante, { paddingBottom: insets.bottom }]}
        onLayout={(e) => {
          const hauteur = e.nativeEvent.layout.height;
          setHauteurBarre((precedente) =>
            Math.abs(precedente - hauteur) < 1 ? precedente : hauteur
          );
        }}
      >
        <BottomTabBar
          tabs={SWIPE_TABS}
          active={tab}
          onChange={onChangeTab}
          extra={{
            // Le compte ne s'affiche que s'il y a quelque chose à signaler :
            // « 8 thèmes » en permanence banaliserait le repère, alors que
            // c'est en swipant une sélection restreinte qu'on a besoin de s'en
            // souvenir sans quitter l'écran.
            label: themeFilter.filtered
              ? `${themeFilter.selected} thème${themeFilter.selected > 1 ? 's' : ''}`
              : 'Thèmes',
            icon: 'pricetags-outline',
            onPress: handleOpenThemeFilter,
            accessibilityLabel: themeFilter.filtered
              ? `Thèmes : ${themeFilter.selected} sur ${themeFilter.total} sélectionnés. En changer redémarrera la session.`
              : 'Choisir les thèmes à swiper. En changer redémarrera la session.',
          }}
        />
      </View>

      <ConfirmDialog
        visible={confirmingRestart}
        title="Recommencer ?"
        message="Ta session actuelle (réponses et résultat) sera effacée définitivement."
        confirmLabel="Recommencer"
        onConfirm={() => {
          setConfirmingRestart(false);
          onRestart();
        }}
        onCancel={() => setConfirmingRestart(false)}
      />

      <ConfirmDialog
        visible={confirmingThemeFilter}
        title="Changer de thèmes ?"
        message="Choisir d’autres thèmes redémarrera ta session actuelle : tes réponses en cours seront perdues."
        confirmLabel="Changer"
        onConfirm={() => {
          setConfirmingThemeFilter(false);
          onOpenThemeFilter();
        }}
        onCancel={() => setConfirmingThemeFilter(false)}
      />

      <ProposalDebateDialog
        visible={debateProposal !== null}
        proposal={debateProposal}
        theme={debateProposal ? THEMES_BY_ID[debateProposal.themeId] ?? null : null}
        onClose={() => setDebateProposal(null)}
      />
    </SafeAreaView>
  );
}

// Les deux boutons de l'en-tête. Ils s'enfoncent sous le doigt comme ceux de
// la barre du bas ; c'est le seul mouvement qu'un bouton d'en-tête doit faire,
// puisqu'il ouvre un autre écran plutôt que de changer celui-ci.
function BoutonRond({
  icon,
  onPress,
  accessibilityLabel,
  colors,
  styles,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  colors: ColorTokens;
  styles: ReturnType<typeof makeStyles>;
}) {
  const pression = usePression();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pression.onPressIn}
      onPressOut={pression.onPressOut}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[styles.headerButton, pression.style]}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    // La barre du bas est hors du flux, donc au-dessus du contenu. `zIndex`
    // tranche l'ordre d'empilement ; la barre ne porte aucune ombre ni
    // `elevation`, la charte n'en veut pas.
    // Chaque onglet occupe toute la place restante entre l'en-tête et la
    // barre du bas.
    zoneOnglet: {
      flex: 1,
    },
    barreFlottante: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    progressWrap: {
      flex: 1,
      paddingHorizontal: spacing.sm,
    },

    // La marge tombe de 16 à 4 px de chaque côté. C'est ce qui, avec les
    // 24 px repris à la barre de progression elle-même, rend à la piste une
    // cinquantaine de pixels : elle n'en faisait qu'une centaine pour dire
    // l'avancement d'une partie qui peut compter cent soixante-cinq cartes.
    headerButton: {
      width: 32,
      height: 32,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
      marginHorizontal: spacing.xs,
    },
    deckArea: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    actionsArea: {
      paddingBottom: spacing.lg,
      paddingTop: spacing.sm,
    },
    doneArea: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      gap: spacing.sm,
    },
    doneBadge: {
      width: 72,
      height: 72,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      marginBottom: spacing.md,
    },
    doneTitle: {
      fontSize: fonts.title - 2,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    doneText: {
      fontSize: fonts.small + 1,
      lineHeight: (fonts.small + 1) * 1.45,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 300,
      marginBottom: spacing.lg,
    },
    donePrimary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      alignSelf: 'stretch',
      maxWidth: 320,
      backgroundColor: colors.action,
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
    },
    donePrimaryPressed: {
      backgroundColor: colors.actionPressed,
    },
    donePrimaryText: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.onAction,
    },
    // LA COULEUR CHOISIE DANS LES RÉGLAGES, pas un gris de service.
    //
    // Recommencer est une action ordinaire : on relance une partie, on ne
    // casse rien d'irremplaçable. En gris, posé sous un bouton d'accent plein,
    // il se lisait comme désactivé. Il garde son rang de second rôle par son
    // fond atténué (`accentSoft`) face au plein du bouton principal, et non
    // plus en renonçant à la couleur de l'app.
    doneSecondary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs + 2,
      alignSelf: 'stretch',
      maxWidth: 320,
      marginTop: spacing.xs,
      backgroundColor: colors.accentSoft,
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    doneSecondaryPressed: {
      opacity: 0.65,
    },
    doneSecondaryText: {
      fontSize: fonts.small + 1,
      fontWeight: '700',
      color: colors.accentText,
    },
  });
}
