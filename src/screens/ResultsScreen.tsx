import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Texte as Text } from '../components/Texte';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { haptics } from '../utils/haptics';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ResultRow } from '../components/ResultRow';
import { CandidateGrid } from '../components/CandidateGrid';
import { Bascule } from '../components/Bascule';
import { Podium, podiumRevealDelay } from '../components/Podium';
import { Confetti } from '../components/Confetti';
import { CURTAIN_STAGE_MS, CurtainReveal } from '../components/CurtainReveal';
import { ThemeAgreementList } from '../components/ThemeAgreementList';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  AnswerGroups,
  CandidateAnswersDialog,
  emptyAnswerGroups,
} from '../components/CandidateAnswersDialog';
import { CandidateInfoDialog } from '../components/CandidateInfoDialog';
import { ShareCard, SHARE_CARD_WIDTH, shareCardHeight } from '../components/ShareCard';
import { CANDIDATES, CANDIDATES_BY_ID } from '../data/candidates';
import { DATASET_DATE } from '../data/proposals';
import { THEMES } from '../data/themes';
import {
  computeResults,
  computeThemeAgreement,
  matchConfidenceLabel,
  pickTopMatch,
  topMatches,
} from '../utils/scoring';
import { dateEnFrancais } from '../utils/date';
import { porteeDesThemes } from '../utils/portee';
import { Answers, Proposal } from '../types';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Plafond de grossissement des deux libellés du pied de page. Ils cohabitent
// dans une rangée de largeur fixe, où « Accueil » et « Partager » se disputent
// la place dès que le réglage système grossit le texte. Même parti pris que la
// barre d'onglets : on plafonne le libellé, et le sens complet reste porté par
// l'accessibilityLabel du bouton, que les lecteurs d'écran annoncent en entier.
const FOOTER_MAX_SCALE = 1.4;

type RankingView = 'overview' | 'byTheme' | 'candidats';

export function ResultsScreen({
  proposals,
  answers,
  selectedThemeIds,
  onRestart,
  onBack,
  backIsHome,
  onGoHome,
  onOpenHowItWorks,
  onOpenSettings,
  duel,
  onOpenDuel,
  onOpenReview,
  alreadyRevealed,
  onReveal,
  cartesRestantes = 0,
}: {
  proposals: Proposal[];
  answers: Answers;
  // Les thèmes sur lesquels la partie a été jouée. Ils ne changent rien au
  // calcul — le paquet en découle déjà — mais ils disent SUR QUOI porte le
  // classement, mention qui part avec l'image partagée (voir utils/portee.ts).
  selectedThemeIds: string[];
  onRestart: () => void;
  // Retour à l'écran d'où l'on vient — la révision, l'écran de fin du paquet
  // ou l'accueil selon le chemin emprunté (voir `resultsReturnTo` dans App).
  onBack: () => void;
  // Ce retour mène-t-il à l'accueil ? DEUX CHOSES EN DÉPENDENT.
  //
  // L'ICÔNE, d'abord : une maison plutôt qu'un chevron. Un chevron promet un
  // pas en arrière dans un fil de navigation ; quand la destination est la
  // sortie, la maison le dit — c'est déjà la règle de l'écran de swipe.
  //
  // LE PIED DE PAGE, ensuite : le bouton « Accueil » y disparaît, puisque le
  // coin haut-gauche mène déjà là. Deux boutons pour une même destination, à
  // deux endroits différents, c'est ce qui rendait la sortie imprévisible.
  backIsHome: boolean;
  // Sortie vers l'accueil, quand le retour va ailleurs. Le résultat reste
  // enregistré, et l'accueil le rouvre par sa carte « ton dernier résultat ».
  onGoHome: () => void;
  onOpenHowItWorks: () => void;
  onOpenSettings: () => void;
  // Non nul quand la partie qui vient de se terminer ÉTAIT le défi de
  // quelqu'un. Le bloc du duel change alors de discours : il ne s'agit plus
  // d'en lancer un, mais d'aller voir ce que l'autre a répondu — la seule
  // raison pour laquelle on a relevé ce défi.
  duel: { accords: number; tranchees: number } | null;
  // Comparer son classement à celui de quelqu'un d'autre (écran Duel).
  onOpenDuel: () => void;
  // Relire et corriger ses réponses. C'était une étape obligatoire entre la
  // dernière carte et le résultat ; c'est devenu un choix, depuis le résultat.
  onOpenReview?: () => void;
  // Le "moment de révélation" (haptique + animations d'entrée) ne doit avoir
  // lieu qu'une fois par résultat, pas à chaque fois qu'on revient sur cet
  // écran depuis "Comment ça marche" — voir App.tsx.
  alreadyRevealed: boolean;
  onReveal: () => void;
  // Cartes encore à swiper quand on vient voir son résultat avant la fin,
  // depuis l'onglet Classement. 0 une fois le paquet terminé.
  cartesRestantes?: number;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const shareCardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  // Fiche d'un candidat, ouverte en touchant sa photo.
  const [infoCandidateId, setInfoCandidateId] = useState<string | null>(null);
  // Le podium reste au-dessus, et on choisit ensuite entre le classement
  // complet, le détail sujet par sujet et les candidats, au lieu de dérouler
  // le tout à la suite.
  const [rankingView, setRankingView] = useState<RankingView>('overview');

  const selectRankingView = (next: RankingView) => {
    haptics.selection();
    setRankingView(next);
  };
  const portee = useMemo(() => porteeDesThemes(selectedThemeIds, THEMES), [selectedThemeIds]);
  const reducedMotion = useReducedMotion();
  // `alreadyRevealed` est FIGÉ au montage, et ce n'est pas un détail.
  //
  // L'écran signale sa propre révélation (`onReveal`) dans un effet de
  // montage, ce qui remonte aussitôt la valeur à `true` par le parent. Lue
  // directement, la prop bascule donc en pleine animation : le rideau se
  // serait démonté au premier rendu suivant, et le pourcentage sautait déjà
  // à sa valeur finale sans défiler — le décompte ne se voyait jamais.
  const [wasRevealed] = useState(alreadyRevealed);
  const skipEntrance = reducedMotion || wasRevealed;

  // Instant où le premier monte sur sa marche : c'est le point d'orgue, et
  // tout ce qui doit le souligner s'y accroche — la vibration, les confettis,
  // le décompte du pourcentage, puis l'étiquette de fiabilité.
  const winnerAt = CURTAIN_STAGE_MS + podiumRevealDelay(1);

  const results = useMemo(
    () => computeResults(answers, proposals, CANDIDATES),
    [answers, proposals]
  );
  const topMatch = useMemo(() => pickTopMatch(results), [results]);
  // Tous les premiers, et non « le » premier : sur une partie filtrée par
  // thèmes, l'égalité en tête est la règle plutôt que l'exception.
  const premiers = useMemo(() => topMatches(results), [results]);
  const confidenceLabel = useMemo(() => matchConfidenceLabel(results), [results]);
  // Sujet par sujet, avec qui l'on est
  // d'accord et sur combien de propositions. L'ancienne version ne montrait
  // que les pourcentages du seul vainqueur, ce qui faisait de l'écran final le
  // moins informatif des deux.
  const themeAgreement = useMemo(
    () => computeThemeAgreement(answers, proposals, CANDIDATES, THEMES),
    [answers, proposals]
  );
  const selectedCandidateAnswers = useMemo<AnswerGroups>(() => {
    const groups = emptyAnswerGroups();
    if (!selectedCandidateId) return groups;
    for (const p of proposals) {
      if (p.candidateId !== selectedCandidateId) continue;
      const a = answers[p.id];
      if (a) groups[a].push(p);
    }
    return groups;
  }, [selectedCandidateId, proposals, answers]);

  useEffect(() => {
    if (!topMatch || alreadyRevealed) return;
    onReveal();
    // La vibration accompagne le moment où le podium apparaît, pas l'arrivée
    // sur l'écran : tant que le rideau est fermé, il n'y a rien à saluer.
    const quand = setTimeout(
      () => haptics.notification(Haptics.NotificationFeedbackType.Success),
      skipEntrance ? 0 : winnerAt
    );
    return () => clearTimeout(quand);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestartPress = () => setConfirmingRestart(true);

  const handleConfirmRestart = () => {
    setConfirmingRestart(false);
    onRestart();
  };

  const handleShare = async () => {
    if (!topMatch || sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 1 });
      const canShareFile = await Sharing.isAvailableAsync();
      if (canShareFile) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Partager mon résultat' });
      } else {
        // Repli si le partage de fichier n'est pas disponible sur l'appareil :
        // on reprend le même contenu que l'image, podium compris.
        const medals = ['🥇', '🥈', '🥉'];
        const podium = results
          .slice(0, 3)
          // La médaille suit le RANG, pas la position : deux ex æquo
          // reçoivent la même, comme sur le podium à l’écran.
          .map((r) => `${medals[Math.min(r.rank, 3) - 1]} ${r.candidate.name} : ${r.pct}%`)
          .join('\n');
        const tete =
          premiers.length > 1 ? `\n\n${premiers.length} candidats à égalité en tête.` : '';
        // Le repli dit exactement ce que dit l'image, portée comprise : c'est
        // le même résultat qui circule, par un autre canal.
        const surQuoi = portee ? `\n${portee}.` : '';
        await Share.share({
          message:
            `Mon podium pour la présidentielle 2027 🗳️${surQuoi}\n\n${podium}${tete}` +
            `\n\nDécouvre le tien avec Élyze, sans savoir qui propose quoi avant la fin.`,
        });
      }
    } catch {
      // Partage annulé ou indisponible : on laisse simplement tomber.
    } finally {
      setSharing(false);
    }
  };

  if (results.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={({ pressed }) => [
            styles.backButton,
            { top: insets.top + spacing.sm },
            pressed && styles.settingsButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={backIsHome ? 'Revenir à l’accueil' : 'Retour'}
        >
          <Ionicons
            name={backIsHome ? 'home-outline' : 'chevron-back'}
            size={backIsHome ? 20 : 22}
            color={colors.textSecondary}
          />
        </Pressable>
        <Pressable
          onPress={onOpenSettings}
          hitSlop={10}
          style={({ pressed }) => [
            styles.settingsButton,
            { top: insets.top + spacing.sm },
            pressed && styles.settingsButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Réglages"
        >
          <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🤔</Text>
          <Text style={styles.emptyTitle}>Pas encore de résultat</Text>
          <Text style={styles.emptyText}>
            Aucune de tes réponses n’a pu être comptabilisée. Tu as sans doute répondu « pas
            d’avis » à toutes les propositions. Réponds « j’adhère » ou « pas pour moi » à au
            moins une proposition pour voir un résultat.
          </Text>
          <Pressable
            onPress={handleRestartPress}
            style={({ pressed }) => [styles.restartButton, styles.emptyRestartButton, pressed && styles.restartPressed]}
            accessibilityRole="button"
            accessibilityLabel="Recommencer"
          >
            <Ionicons name="refresh" size={18} color={colors.onAction} />
            <Text style={styles.restartText}>Recommencer</Text>
          </Pressable>
          {/* Cet écran-ci est celui où l'on risque le plus de se sentir
              coincé : il n'offrait qu'un chevron et une action destructive.
              Une sortie franche évite d'avoir à choisir entre revenir en
              arrière à l'aveugle et tout effacer. Inutile en revanche quand le
              coin haut-gauche est déjà une maison. */}
          {!backIsHome && (
            <Pressable
              onPress={onGoHome}
              style={({ pressed }) => [styles.homeButton, pressed && styles.homePressed]}
              accessibilityRole="button"
              accessibilityLabel="Revenir à l’accueil"
            >
              <Ionicons name="home-outline" size={19} color={colors.accentText} />
              <Text style={styles.homeText}>Accueil</Text>
            </Pressable>
          )}
        </View>

        <ConfirmDialog
          visible={confirmingRestart}
          title="Recommencer ?"
          message="Ta session actuelle (réponses et résultat) sera effacée définitivement."
          confirmLabel="Recommencer"
          destructive
          onConfirm={handleConfirmRestart}
          onCancel={() => setConfirmingRestart(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={({ pressed }) => [
          styles.backButton,
          { top: insets.top + spacing.sm },
          pressed && styles.settingsButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={backIsHome ? 'Revenir à l’accueil, ton résultat est gardé' : 'Retour'}
      >
        <Ionicons
          name={backIsHome ? 'home-outline' : 'chevron-back'}
          size={backIsHome ? 20 : 22}
          color={colors.textSecondary}
        />
      </Pressable>
      <Pressable
        onPress={onOpenSettings}
        hitSlop={10}
        style={({ pressed }) => [
          styles.settingsButton,
          { top: insets.top + spacing.sm },
          pressed && styles.settingsButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Réglages"
      >
        <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
      </Pressable>

      {/* Carte de partage : montée mais hors-écran, uniquement pour la capture. */}
      <View
        style={[styles.offscreen, { height: shareCardHeight(portee) }]}
        pointerEvents="none"
      >
        {topMatch && (
          <ShareCard
            ref={shareCardRef}
            results={results}
            confidenceLabel={confidenceLabel}
            portee={portee}
          />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chapeau}>
          <Text style={styles.eyebrow}>
            {premiers.length > 1 ? 'TES MEILLEURS MATCHS' : 'TON MEILLEUR MATCH'}
          </Text>
          {/* Hors du rideau : la portée n'est pas une révélation, c'est ce
              qu'il faut savoir pour lire celle qui vient. */}
          {portee && <Text style={styles.portee}>{portee}</Text>}
        </View>

        {/* UN RÉSULTAT DEMANDÉ AVANT LA FIN le dit, et rend la partie. Sans
            ce bandeau, rien ne distinguait un aperçu d'un résultat final. */}
        {cartesRestantes > 0 && (
          <View style={styles.enCours}>
            <Text style={styles.enCoursTexte}>
              Partie en cours : encore {cartesRestantes} carte{cartesRestantes > 1 ? 's' : ''} à
              swiper. Ce résultat s’affinera.
            </Text>
            <Pressable
              onPress={onBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Continuer à swiper"
            >
              <Text style={styles.enCoursLien}>Continuer à swiper</Text>
            </Pressable>
          </View>
        )}

        {topMatch && (
          <Animated.View
            style={styles.heroCard}
            entering={skipEntrance ? undefined : FadeInDown.duration(400)}
          >
            {/* Rideau de théâtre : c'est ici, et nulle part ailleurs, que
                l'app dévoile enfin qui portait quoi. */}
            <CurtainReveal play={!skipEntrance}>
              <Podium
                results={results}
                instant={wasRevealed}
                // Le podium se remplit place par place, du troisième au
                // premier, dès que les pans s'entrouvrent.
                revealAt={skipEntrance ? undefined : CURTAIN_STAGE_MS}
                // Le décompte démarre avec le vainqueur, pas avant : le
                // chiffre défile pendant qu'il monte sur sa marche.
                countDelayMs={skipEntrance ? 0 : winnerAt}
                onCandidatePress={setInfoCandidateId}
              />
            </CurtainReveal>
            {/* Débordent volontairement du podium : la pluie couvre toute la
                carte, pas la seule zone des marches. */}
            {!skipEntrance && <Confetti play delayMs={winnerAt} />}
            {confidenceLabel && (
              <Animated.View
                entering={skipEntrance ? undefined : FadeIn.delay(winnerAt + 250).duration(350)}
              >
                <View style={styles.confidencePill}>
                  <Text style={styles.confidencePillText}>{confidenceLabel}</Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* LE DUEL, JUSTE SOUS LE PODIUM.
            Il a d'abord vécu en bas de l'écran, après les onze lignes du
            classement complet : une invitation qu'il fallait aller chercher au
            terme d'un long défilement, donc que presque personne n'aurait
            trouvée. Sa place est ici, à l'instant où l'on vient d'apprendre
            son résultat et où la seule question qui reste est de savoir ce que
            les autres ont eu.

            IL EST LÀ DÈS LE DÉPART, ET IL NE BOUGE PLUS. Il entrait autrefois
            en fondu, une demi-seconde après le sacre du vainqueur : la
            proposition principale de l'écran se mettait donc à exister sans
            prévenir, sous le doigt de qui faisait défiler pendant ce temps,
            et le contenu qui la suivait se décalait d'autant. Une invitation
            qu'on peut manquer parce qu'elle n'était pas encore arrivée n'est
            pas une invitation. Le rideau reste le seul moment mis en scène ;
            le reste de l'écran l'attend en place. */}
        <Pressable
          onPress={onOpenDuel}
          style={({ pressed }) => [styles.duelButton, pressed && styles.duelPressed]}
          accessibilityRole="button"
          accessibilityLabel={
            duel
              ? 'Voir ce que chacun a validé, carte par carte'
              : 'Défier quelqu’un, comparer ton classement au sien'
          }
        >
          <View style={styles.duelIcone}>
            <Ionicons
              name={duel ? 'git-compare' : 'qr-code'}
              size={22}
              color={colors.onAccent}
            />
          </View>
          <View style={styles.duelTexts}>
            <Text style={styles.duelTitle}>
              {duel ? 'Voir qui a validé quoi' : 'Défier quelqu’un'}
            </Text>
            <Text style={styles.duelHint}>
              {duel
                ? `Vous avez tranché ${duel.tranchees} carte${duel.tranchees > 1 ? 's' : ''} tous les deux, et vous êtes d’accord sur ${duel.accords}.`
                : 'Il répondra aux mêmes cartes que toi, et vous verrez ce que chacun a validé.'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accentText} />
        </Pressable>

        <View style={styles.subTabRow}>
          <Pressable
            onPress={() => selectRankingView('overview')}
            style={[styles.subTab, rankingView === 'overview' && styles.subTabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: rankingView === 'overview' }}
            accessibilityLabel="Classement des candidats"
          >
            <Text style={[styles.subTabText, rankingView === 'overview' && styles.subTabTextActive]}>
              Classement
            </Text>
          </Pressable>
          <Pressable
            onPress={() => selectRankingView('byTheme')}
            style={[styles.subTab, rankingView === 'byTheme' && styles.subTabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: rankingView === 'byTheme' }}
            accessibilityLabel="Avec qui tu es d’accord, sujet par sujet"
          >
            <Text style={[styles.subTabText, rankingView === 'byTheme' && styles.subTabTextActive]}>
              Par thème
            </Text>
          </Pressable>
          {/* Le trombinoscope est aussi dans l'onglet Classement de la
              partie ; ici, il reste la porte vers les notices une fois le
              paquet fini. */}
          <Pressable
            onPress={() => selectRankingView('candidats')}
            style={[styles.subTab, rankingView === 'candidats' && styles.subTabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: rankingView === 'candidats' }}
            accessibilityLabel="Les candidats"
          >
            <Text style={[styles.subTabText, rankingView === 'candidats' && styles.subTabTextActive]}>
              Candidats
            </Text>
          </Pressable>
        </View>

        {/* Les deux vues occupent la même place et se ressemblent assez
            pour que React garde la même instance : sans clé, le fondu
            d'entrée n'aurait jamais lieu. */}
        <Bascule cle={rankingView}>
          {rankingView === 'overview' ? (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Classement complet</Text>
              <Pressable onPress={onOpenHowItWorks} accessibilityRole="link" accessibilityLabel="Comment ce classement est calculé">
                <Text style={styles.sectionCaption}>
                  Le pourcentage tient compte du nombre de propositions auxquelles tu as répondu :
                  approuver deux mesures ne vaut pas approuver quinze.{' '}
                  <Text style={styles.sectionCaptionLink}>Comment ça marche →</Text>
                </Text>
              </Pressable>
              {results.map((result) => (
                <ResultRow
                  key={result.candidate.id}
                  result={result}
                  // Le rang, égalités comprises : deux ex æquo portent la même
                  // médaille, comme sur le podium juste au-dessus.
                  rank={result.rank}
                  emphasized={result.rank === 1}
                  onPress={() => setSelectedCandidateId(result.candidate.id)}
                />
              ))}
            </View>
          ) : rankingView === 'candidats' ? (
            <CandidateGrid onSelect={setInfoCandidateId} />
          ) : (
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Avec qui tu es d’accord, sujet par sujet</Text>
              <Text style={styles.sectionCaption}>
                Les nombres sont ceux de tes réponses, pas des pourcentages : sur un sujet donné,
                un candidat n’a souvent qu’une ou deux propositions dans le paquet.
              </Text>
              {/* Le questionnaire est terminé : plus rien à masquer ici. */}
              <ThemeAgreementList entries={themeAgreement} showCandidates hiddenNote="" />
            </View>
          )}
        </Bascule>

        {onOpenReview && (
          <Pressable
            onPress={onOpenReview}
            style={styles.reviewLink}
            accessibilityRole="button"
            accessibilityLabel="Revoir et corriger mes réponses"
          >
            <Ionicons name="list-outline" size={17} color={colors.accentText} />
            <Text style={styles.reviewLinkText}>Revoir mes réponses</Text>
          </Pressable>
        )}

        {/* La date est ici et pas ailleurs : c'est sous le classement qu'on
            se demande sur quoi il repose, et un programme continue de s'écrire
            après l'arrêt des données. */}
        <Text style={styles.footnote}>
          Propositions recensées par Poligraph (poligraph.fr) et 2027 et moi (2027etmoi.fr), à raison du même nombre par
          candidat
          {dateEnFrancais(DATASET_DATE) ? `, arrêtées au ${dateEnFrancais(DATASET_DATE)}` : ''}. Le
          pourcentage reflète uniquement les propositions présentées dans cette app, pas
          l’intégralité d’un programme.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {/* Recommencer ne figure plus ici : il vit sur l'écran de fin de
              l'onglet Swiper, pour qu'une action destructive ne côtoie pas le
              résultat qu'on vient consulter.
              L'accueil, lui, n'apparaît QUE si le coin haut-gauche mène
              ailleurs — c'est-à-dire quand on est arrivé par la révision ou
              par l'écran de fin du paquet. Venu de l'accueil, le retour y
              ramène déjà, et un second bouton pour la même destination, à
              l'autre bout de l'écran, était précisément ce qui rendait la
              sortie imprévisible. */}
          {!backIsHome && (
            <Pressable
              onPress={onGoHome}
              style={({ pressed }) => [styles.homeButton, pressed && styles.homePressed]}
              accessibilityRole="button"
              accessibilityLabel="Revenir à l’accueil, ton résultat est gardé"
            >
              <Ionicons name="home-outline" size={19} color={colors.accentText} />
              {/* Deux boutons se partagent une rangée de largeur fixe : au delà
                  de ce grossissement, l'un mange la place de l'autre. Le libellé
                  complet reste dans l'accessibilityLabel du bouton. */}
              <Text style={styles.homeText} maxFontSizeMultiplier={FOOTER_MAX_SCALE} numberOfLines={1}>
                Accueil
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleShare}
            disabled={sharing}
            style={({ pressed }) => [styles.shareButton, pressed && styles.sharePressed]}
            accessibilityRole="button"
            accessibilityLabel="Partager mon résultat en image"
          >
            <Ionicons name="share-outline" size={20} color={colors.onAction} />
            <Text style={styles.shareText} maxFontSizeMultiplier={FOOTER_MAX_SCALE} numberOfLines={1}>
              Partager
            </Text>
          </Pressable>
        </View>
      </View>

      <CandidateAnswersDialog
        visible={selectedCandidateId !== null}
        candidate={selectedCandidateId ? CANDIDATES_BY_ID[selectedCandidateId] : null}
        groups={selectedCandidateAnswers}
        // Le questionnaire est terminé : plus rien à protéger sur cet écran.
        revealProposals
        onClose={() => setSelectedCandidateId(null)}
        // On referme le détail avant d'ouvrir la fiche : deux modales
        // empilées ne s'affichent pas de façon fiable sur iOS.
        onOpenInfo={() => {
          const id = selectedCandidateId;
          setSelectedCandidateId(null);
          setInfoCandidateId(id);
        }}
      />

      <CandidateInfoDialog
        visible={infoCandidateId !== null}
        candidate={infoCandidateId ? CANDIDATES_BY_ID[infoCandidateId] : null}
        proposals={proposals}
        answers={answers}
        revealThemes
        onClose={() => setInfoCandidateId(null)}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    backButton: {
      position: 'absolute',
      left: spacing.lg,
      zIndex: 1,
      width: 36,
      height: 36,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
    },
    settingsButton: {
      position: 'absolute',
      right: spacing.lg,
      zIndex: 1,
      width: 36,
      height: 36,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
    },
    settingsButtonPressed: {
      opacity: 0.7,
    },
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
    },
    emptyEmoji: {
      fontSize: 40,
      marginBottom: spacing.sm,
    },
    emptyTitle: {
      fontSize: fonts.title,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: fonts.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: fonts.body * 1.4,
      marginBottom: spacing.md,
      maxWidth: 320,
    },
    emptyRestartButton: {
      flex: 0,
      paddingHorizontal: spacing.xl,
    },
    offscreen: {
      position: 'absolute',
      top: 0,
      left: -SHARE_CARD_WIDTH - 50,
      width: SHARE_CARD_WIDTH,
    },
    chapeau: {
      gap: spacing.xs,
    },
    enCours: {
      backgroundColor: colors.accentSoft,
      borderRadius: radii.sm,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      gap: spacing.xs,
    },
    enCoursTexte: {
      fontSize: fonts.small,
      lineHeight: fonts.small * 1.4,
      fontWeight: '600',
      color: colors.accentText,
    },
    enCoursLien: {
      fontSize: fonts.small,
      fontWeight: '800',
      color: colors.accentText,
      textDecorationLine: 'underline',
    },
    portee: {
      fontSize: fonts.small,
      fontWeight: '600',
      color: colors.accentText,
      textAlign: 'center',
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.xl,
    },
    eyebrow: {
      fontSize: fonts.tiny,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: colors.textMuted,
      textAlign: 'center',
    },
    heroCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    confidencePill: {
      marginTop: spacing.sm,
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
    },
    confidencePillText: {
      fontSize: fonts.tiny,
      fontWeight: '600',
      color: colors.textMuted,
      textAlign: 'center',
    },
    subTabRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.pill,
      padding: 4,
      gap: 4,
    },
    subTab: {
      flex: 1,
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
    listSection: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    sectionCaption: {
      fontSize: fonts.tiny,
      color: colors.textMuted,
      marginBottom: spacing.xs,
      lineHeight: fonts.tiny * 1.5,
    },
    reviewLink: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
    },
    reviewLinkText: {
      fontSize: fonts.small,
      fontWeight: '700',
      color: colors.accentText,
    },
    sectionCaptionLink: {
      color: colors.accentText,
      fontWeight: '700',
    },
    footnote: {
      fontSize: fonts.tiny,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: fonts.tiny * 1.5,
      paddingHorizontal: spacing.md,
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,
      paddingTop: spacing.sm,
    },
    footerRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    // Fond teinté et non plein : le bouton plein de cet écran est
    // « Partager », en bas, et deux aplats d'accent à l'écran en même temps ne
    // désigneraient plus rien. La présence vient de la place occupée, de la
    // pastille pleine et du liseré, pas d'un aplat de plus.
    duelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.accentSoft,
      borderRadius: radii.lg,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    duelPressed: {
      opacity: 0.7,
    },
    // La seule chose pleinement colorée de l'encart, et elle porte un QR code :
    // c'est ce dessin qui dit en un coup d'œil de quoi il s'agit, là où
    // « défier » seul resterait abstrait.
    duelIcone: {
      width: 40,
      height: 40,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
    },
    duelTexts: {
      flex: 1,
      gap: 2,
    },
    duelTitle: {
      fontSize: fonts.body,
      fontWeight: '800',
      color: colors.accentText,
    },
    duelHint: {
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.4,
      color: colors.accentText,
    },
    restartButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.action,
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
    },
    restartPressed: {
      backgroundColor: colors.actionPressed,
    },
    restartText: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.onAction,
    },
    // Accent atténué contre accent plein : sortir et partager sont deux
    // actions ordinaires, mais une seule est celle qu'on vient chercher sur
    // cet écran. Sans flex, le bouton se règle sur son libellé et laisse le
    // reste de la rangée au partage.
    homeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs + 2,
      backgroundColor: colors.accentSoft,
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    homePressed: {
      opacity: 0.65,
    },
    homeText: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.accentText,
    },
    shareButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.action,
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
    },
    sharePressed: {
      backgroundColor: colors.actionPressed,
    },
    shareText: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.onAction,
    },
  });
}
