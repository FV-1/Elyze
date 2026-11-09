import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IntroScreen, RestorableSummary } from './src/screens/IntroScreen';
import { ThemeSelectScreen } from './src/screens/ThemeSelectScreen';
import { SwipeScreen, SwipeTab } from './src/screens/SwipeScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { DuelScreen } from './src/screens/DuelScreen';
import { HowItWorksScreen } from './src/screens/HowItWorksScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ScreenTransition } from './src/components/ScreenTransition';
import { SwipeDirection } from './src/components/SwipeCard';
import { Answers, Proposal } from './src/types';
import { PROPOSALS, PROPOSALS_BY_ID } from './src/data/proposals';
import { CANDIDATES } from './src/data/candidates';
import { THEMES, THEMES_BY_ID } from './src/data/themes';
import {
  buildSessionDeck,
  FormatPartie,
  quotaDuFormat,
  QUOTA_PAR_CANDIDAT,
} from './src/utils/deck';
import { graineAleatoire, shuffleAvecGraine } from './src/utils/shuffle';
import { codeDepuisUrl, comparerDefi, Defi } from './src/utils/duel';
import { computeResults, pickTopMatch, topMatches } from './src/utils/scoring';

import {
  clearSession,
  hasSeenTutorial,
  loadSessionAvecEtat,
  quotaDeLaSession,
  markTutorialSeen,
  resetAllData,
  saveSession,
  StoredSession,
} from './src/utils/storage';
import { ThemeProvider, useColors, useThemeSettings, ZoneAccent } from './src/theme/ThemeContext';

type Screen =
  // Écran d'attente du tout premier rendu, le temps de savoir s'il y a une
  // session à reprendre. Il ne peint que le fond : sans lui, l'accueil
  // apparaîtrait un instant avant d'être remplacé par le paquet en cours.
  | 'booting'
  | 'intro'
  | 'themes'
  | 'swipe'
  | 'review'
  | 'results'
  | 'howItWorks'
  | 'settings'
  | 'duel';

const ALL_THEME_IDS = THEMES.map((t) => t.id);

// L'écran natif ne se retire pas tout seul : c'est nous qui décidons quand,
// une fois qu'il y a vraiment quelque chose à montrer (voir plus bas).
SplashScreen.preventAutoHideAsync().catch(() => {});

function resolveProposals(ids: string[]): Proposal[] {
  return ids.map((id) => PROPOSALS_BY_ID[id]).filter((p): p is Proposal => Boolean(p));
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
  const colors = useColors();
  const {
    effectiveScheme,
    setSchemePreference,
    setHapticsEnabled,
    setRainbowUnlocked,
  } = useThemeSettings();

  const [screen, setScreen] = useState<Screen>('booting');
  const [howItWorksReturnTo, setHowItWorksReturnTo] = useState<Screen>('intro');
  const [settingsReturnTo, setSettingsReturnTo] = useState<Screen>('intro');
  const [themesReturnTo, setThemesReturnTo] = useState<Screen>('intro');
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>(ALL_THEME_IDS);
  const [sessionProposals, setSessionProposals] = useState<Proposal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  // Graine du mélange de la partie en cours. Conservée pour pouvoir refabriquer
  // son code de défi à tout moment (voir utils/duel.ts).
  const [graine, setGraine] = useState(0);
  // Propositions par candidat de la partie en cours. Conservée avec la graine
  // et pour la même raison : refabriquer le code de défi (voir utils/duel.ts).
  const [quota, setQuota] = useState(QUOTA_PAR_CANDIDAT);
  // Longueur choisie pour la PROCHAINE partie. La courte est le défaut, et
  // elle le redevient à chaque lancement : c'est le parcours qu'on termine.
  const [format, setFormat] = useState<FormatPartie>('court');
  // Une partie était enregistrée, mais d'un autre catalogue.
  const [sessionPerimee, setSessionPerimee] = useState(false);
  // Réponses de l'adversaire, quand cette partie est un défi relevé.
  const [adversaire, setAdversaire] = useState<Answers | undefined>(undefined);

  // Résumé de la session enregistrée au lancement de l'app. Dès qu'une session
  // est en cours en mémoire, c'est elle qui fait foi (voir `restorable`).
  const [storedRestorable, setStoredRestorable] = useState<RestorableSummary | null>(null);
  const [pendingRestore, setPendingRestore] = useState<StoredSession | null>(null);

  // Code de duel reçu par lien profond (elyze://d?c=…), le cas échéant.
  const [duelCode, setDuelCode] = useState<string | null>(null);

  // Onglet courant de l'écran de swipe. Tenu ici parce que cet écran est
  // démonté dès qu'on le quitte : sans cela, revenir du duel ou des réglages
  // déposait sur les cartes, jamais sur l'onglet d'où l'on était parti.
  const [swipeTab, setSwipeTab] = useState<SwipeTab>('swipe');

  // LES DEUX POLICES SONT EMBARQUÉES, PAS TÉLÉCHARGÉES. L'app ne fait aucun
  // appel réseau, et ce n'est pas une police qui va commencer : les fichiers
  // partent dans le paquet et se chargent depuis le disque.
  //
  // Le second membre du couple est ignoré : une police qui ne se charge pas
  // laisse le système prendre le relais, ce qui est moche mais lisible. Faire
  // dépendre le démarrage de leur succès serait échanger un défaut d'aspect
  // contre un écran vide.
  const [policesPretes] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showTutorial, setShowTutorial] = useState(false);
  // Le "moment de révélation" (haptique + animations) de l'écran de résultat
  // ne doit jouer qu'une fois par résultat, pas à chaque retour sur l'écran
  // (ex. après avoir ouvert l'explorateur ou "Comment ça marche").
  const [resultsRevealed, setResultsRevealed] = useState(false);

  // OÙ REVENIR EN QUITTANT LE RÉSULTAT.
  //
  // Cet écran a cinq entrées : la révision, l'écran de fin du paquet, la carte
  // « ton dernier résultat » de l'accueil, le lancement de l'app sur une
  // partie déjà finie, et la sortie du duel. Le retour, lui, était écrit en
  // dur sur la révision — la seule de ces cinq provenances pour laquelle il
  // était juste. Ouvrir l'app sur son résultat de la veille et toucher le
  // chevron déposait donc dans une liste de cent soixante-cinq lignes qu'on
  // n'avait jamais demandée, à deux pas de plus de l'accueil.
  //
  // Même motif que `settingsReturnTo` et ses voisins : chaque entrée pose sa
  // provenance, le retour la relit.
  const [resultsReturnTo, setResultsReturnTo] = useState<Screen>('intro');
  const openResults = (depuis: Screen) => {
    setResultsReturnTo(depuis);
    setScreen('results');
  };

  // Où revenir en quittant le duel.
  //
  // MÉMORISÉ QUAND ON VIENT DE QUELQUE PART, calculé sinon : on entre dans le
  // duel depuis le résultat, l'accueil et l'onglet Classement, mais aussi par
  // un lien profond qui ouvre l'app fermée — cas où aucun « écran précédent »
  // n'a jamais existé, et où seul l'état de la partie peut décider.
  const [duelReturnTo, setDuelReturnTo] = useState<Screen | null>(null);
  const openDuel = (depuis: Screen) => {
    setDuelReturnTo(depuis);
    setScreen('duel');
  };
  const quitterDuel = useCallback(() => {
    setDuelCode(null);
    if (duelReturnTo) {
      setScreen(duelReturnTo);
      setDuelReturnTo(null);
      return;
    }
    if (sessionProposals.length === 0) {
      setScreen('intro');
      return;
    }
    setScreen(currentIndex >= sessionProposals.length ? 'results' : 'swipe');
  }, [duelReturnTo, sessionProposals.length, currentIndex]);

  useEffect(() => {
    const handler = () => {
      if (screen === 'duel') {
        quitterDuel();
        return true;
      }
      if (screen === 'settings') {
        setScreen(settingsReturnTo);
        return true;
      }
      if (screen === 'howItWorks') {
        setScreen(howItWorksReturnTo);
        return true;
      }
      if (screen === 'themes') {
        setScreen(themesReturnTo);
        return true;
      }
      if (screen === 'results') {
        // Symétrique au bouton visible en haut à gauche de cet écran : on
        // revient là d'où l'on est venu (voir `resultsReturnTo`).
        setScreen(resultsReturnTo);
        return true;
      }
      if (screen === 'review') {
        // Symétrique au bouton retour visible de cet écran.
        setScreen('results');
        return true;
      }
      if (screen === 'swipe') {
        // Pas de perte de données : la session est déjà persistée à chaque
        // réponse, donc revenir à l'accueil laisse la carte "Reprendre"
        // disponible plutôt que de fermer l'app.
        setScreen('intro');
        return true;
      }
      // Écran racine (accueil) : on laisse le comportement par défaut du
      // système (quitter l'app), comme c'est la convention Android.
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => subscription.remove();
  }, [screen, howItWorksReturnTo, settingsReturnTo, themesReturnTo, resultsReturnTo, quitterDuel]);

  // Au lancement, on ne passe PAS par l'accueil quand une partie est en cours.
  //
  // L'accueil est un point de départ, pas un point de reprise : y revenir à
  // chaque ouverture obligeait à retrouver la carte « Reprendre » avant de
  // pouvoir enchaîner une carte, alors que quitter l'app en plein paquet est
  // le cas normal — on swipe quelques minutes, on ferme, on y revient. On
  // reprend donc là où la session s'est arrêtée, et l'accueil reste à un
  // toucher (icône maison en haut à gauche).
  // Un lien de duel l'emporte sur la reprise de session.
  //
  // Les deux se résolvent de façon asynchrone au démarrage et appellent tous
  // deux `setScreen` : sans arbitre, c'est le plus lent qui gagne, et scanner
  // le QR code d'un ami ouvrait l'app sur les cartes une fois sur deux. Cette
  // marque est posée AVANT le `setScreen` du lien, donc de façon synchrone, et
  // la reprise de session la consulte avant de décider quoi que ce soit.
  const lienTraite = useRef(false);

  useEffect(() => {
    const traiter = (url: string | null) => {
      if (!url) return;
      const code = codeDepuisUrl(url);
      if (!code) return;
      lienTraite.current = true;
      setDuelCode(code);
      setDuelReturnTo(null);
      setScreen('duel');
    };

    // Lien qui a lancé l'app (elle était fermée)…
    Linking.getInitialURL()
      .then(traiter)
      .catch(() => {});
    // …et lien reçu alors qu'elle tournait déjà.
    const abonnement = Linking.addEventListener('url', (evenement) => traiter(evenement.url));
    return () => abonnement.remove();
  }, []);

  useEffect(() => {
    loadSessionAvecEtat().then(({ session, perimee }) => {
      setSessionPerimee(perimee);
      // LA SESSION EST TOUJOURS REMISE EN PLACE ; SEULE LA DESTINATION CÈDE.
      //
      // Une première version abandonnait toute la restauration dès qu'un lien
      // de duel avait été reçu. C'était l'inverse de ce qu'il faut : arriver
      // par le QR code de quelqu'un ouvre précisément l'écran qui a besoin de
      // TON classement pour le comparer au sien. L'app s'ouvrait donc sur une
      // comparaison vide, en annonçant qu'on n'avait pas encore de résultat,
      // alors que la partie était terminée et enregistrée.
      const aller = (ecran: Screen) => {
        if (!lienTraite.current) setScreen(ecran);
      };

      if (!session) {
        aller('intro');
        return;
      }
      const proposals = resolveProposals(session.proposalIds);
      if (proposals.length === 0) {
        aller('intro');
        return;
      }

      const isComplete = session.currentIndex >= proposals.length;
      let topCandidateName: string | undefined;
      let topPct: number | undefined;
      let topCount: number | undefined;
      if (isComplete) {
        const classement = computeResults(session.answers, proposals, CANDIDATES);
        const top = pickTopMatch(classement);
        topCandidateName = top?.candidate.name;
        topPct = top?.pct;
        topCount = topMatches(classement).length;
      }

      setPendingRestore(session);
      setStoredRestorable({
        currentIndex: session.currentIndex,
        total: proposals.length,
        isComplete,
        topCandidateName,
        topPct,
        topCount,
      });

      // Même remise en état que « Reprendre », jouée d'office.
      setSelectedThemeIds(session.selectedThemeIds);
      setSessionProposals(proposals);
      setGraine(session.graine);
      setQuota(quotaDeLaSession(session));
      setAdversaire(session.adversaire);
      setCurrentIndex(session.currentIndex);
      setAnswers(session.answers);
      // Un paquet déjà terminé rouvre sur son résultat, et sans rejouer la
      // révélation : ce moment appartient à la fois où le paquet s'est
      // terminé, pas à chaque ouverture de l'app.
      setResultsRevealed(isComplete);
      // On arrive de nulle part : la sortie est l'accueil.
      if (isComplete) setResultsReturnTo('intro');
      aller(isComplete ? 'results' : 'swipe');
    });

    hasSeenTutorial().then((seen) => setShowTutorial(!seen));
  }, []);

  // Retrait de l'écran natif quand il y a QUELQUE CHOSE À MONTRER, et pas
  // avant.
  //
  // Le retirer dès le premier rendu de React découvrait l'écran d'attente
  // `booting`, qui ne peint que le fond : on voyait le logo, puis une page
  // vide, puis l'app. Ici il tient jusqu'à ce que la session ait été relue et
  // l'écran de destination choisi, si bien que le logo cède la place
  // directement aux cartes ou à l'accueil.
  //
  // Le minuteur n'est pas une précaution de principe. Si la lecture de la
  // session n'aboutissait jamais, l'app resterait indéfiniment sur son logo,
  // sans rien pour en sortir ni le moindre message pour l'expliquer : c'est la
  // panne la plus déroutante pour qui la subit, et la moins chère à rendre
  // impossible.
  // Les polices entrent dans la même condition : découvrir l'app avec la
  // police du système, puis la voir sauter une fraction de seconde plus tard,
  // est exactement ce que le logo est là pour éviter.
  useEffect(() => {
    if (screen !== 'booting' && policesPretes) {
      SplashScreen.hideAsync().catch(() => {});
      return;
    }
    const filet = setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 3000);
    return () => clearTimeout(filet);
  }, [screen, policesPretes]);

  // Une session démarrée pendant cette exécution de l'app reste "reprenable"
  // tant qu'elle n'a pas été explicitement effacée. Sans ce calcul, revenir à
  // l'accueil (bouton retour Android depuis le swipe, par exemple) faisait disparaître le bouton "Reprendre" : la
  // progression semblait perdue, et "Commencer" l'écrasait pour de bon.
  const liveRestorable = useMemo<RestorableSummary | null>(() => {
    if (sessionProposals.length === 0) return null;
    const isComplete = currentIndex >= sessionProposals.length;
    if (!isComplete) {
      return { currentIndex, total: sessionProposals.length, isComplete: false };
    }
    const classement = computeResults(answers, sessionProposals, CANDIDATES);
    const top = pickTopMatch(classement);
    return {
      currentIndex,
      total: sessionProposals.length,
      isComplete: true,
      topCandidateName: top?.candidate.name,
      topPct: top?.pct,
      topCount: topMatches(classement).length,
    };
  }, [sessionProposals, currentIndex, answers]);

  const restorable = liveRestorable ?? storedRestorable;

  // CE QUE LA COMPARAISON DIRA, EN DEUX NOMBRES.
  //
  // C'est la raison d'être du duel, et elle vivait entièrement sur l'écran de
  // duel : ailleurs, rien ne disait qu'il y avait quelque chose à aller voir.
  // Annoncée en chiffres plutôt qu'en promesse — « 32 accords sur 48 cartes
  // tranchées par vous deux » donne envie d'ouvrir, « vous pourrez comparer »
  // non.
  //
  // Nul tant que le paquet n'est pas fini : une comparaison partielle changerait
  // à chaque carte, et le défi ne se lit qu'une fois joué en entier.
  // Cartes encore à swiper : non nul quand on regarde son résultat avant la
  // fin, depuis l'onglet Classement.
  const cartesRestantes = Math.max(0, sessionProposals.length - currentIndex);

  const resumeDuel = useMemo(() => {
    if (!adversaire || sessionProposals.length === 0) return null;
    if (currentIndex < sessionProposals.length) return null;
    const c = comparerDefi(sessionProposals, answers, adversaire);
    return { accords: c.accords, tranchees: c.tranchees };
  }, [adversaire, sessionProposals, currentIndex, answers]);

  const persist = (
    currentIndexToSave: number,
    answersToSave: Answers,
    proposalsToSave: Proposal[],
    themeIds: string[],
    graineASauver: number = graine,
    adversaireASauver: Answers | undefined = adversaire,
    quotaASauver: number = quota
  ) => {
    saveSession({
      selectedThemeIds: themeIds,
      proposalIds: proposalsToSave.map((p) => p.id),
      currentIndex: currentIndexToSave,
      answers: answersToSave,
      graine: graineASauver,
      adversaire: adversaireASauver,
      quota: quotaASauver,
    });
  };

  // Le swipe sur l'ensemble des propositions est le cœur de l'app : "Commencer"
  // y va directement, sans passer par la sélection des thèmes. Choisir des
  // thèmes en particulier reste possible, mais comme une option secondaire
  // (voir `handleCustomizeThemes`), pas comme une étape imposée.
  const startSession = (themeIds: string[], quotaDemande: number) => {
    // DEUX FAÇONS DE COMPOSER LE PAQUET, selon l'étendue de la sélection.
    //
    // Sur TOUS les thèmes, il est TIRÉ du vivier embarqué et non pris en
    // entier : l'app connaît environ deux fois plus de propositions qu'une
    // partie n'en montre, pour qu'un deuxième passage apporte des cartes
    // neuves, et le tirage garantit le même nombre par candidat sans quoi le
    // score serait faussé.
    //
    // Sur une sélection de thèmes, il prend tout ce qu'ils contiennent : le
    // quota y ramenait la partie au candidat le moins prolixe, et on obtenait
    // onze cartes pour un thème qui en compte trente. Voir utils/deck.ts.
    // LA GRAINE EST TIRÉE ICI, ET ELLE SUFFIT À REFAIRE LE PAQUET.
    // C'est ce qui permet le duel : au lieu de transmettre cent soixante-cinq
    // identifiants, le code de défi transporte cette graine et la liste des
    // thèmes, et l'autre téléphone reconstruit exactement le même paquet.
    const nouvelleGraine = graineAleatoire();
    const filtered = PROPOSALS.filter((p) => themeIds.includes(p.themeId));
    const order = buildSessionDeck(
      filtered,
      themeIds.length === ALL_THEME_IDS.length,
      shuffleAvecGraine(nouvelleGraine),
      quotaDemande
    );
    setSelectedThemeIds(themeIds);
    setSessionProposals(order);
    setGraine(nouvelleGraine);
    setQuota(quotaDemande);
    setSessionPerimee(false);
    setAdversaire(undefined);
    setCurrentIndex(0);
    setAnswers({});
    setStoredRestorable(null);
    setPendingRestore(null);
    setResultsRevealed(false);
    setSwipeTab('swipe');
    setScreen('swipe');
    persist(0, {}, order, themeIds, nouvelleGraine, undefined, quotaDemande);
  };

  // Relever un défi : on rejoue EXACTEMENT le paquet de l'autre, et l'on garde
  // ses réponses de côté pour la comparaison finale. C'est une nouvelle partie,
  // elle remplace donc celle en cours — l'écran de duel le demande avant.
  const accepterDefi = (defi: Defi) => {
    setSelectedThemeIds(defi.themeIds);
    setSessionProposals(defi.paquet);
    setGraine(defi.graine);
    // La longueur est celle du défi : on rejoue SES cartes, pas les nôtres.
    setQuota(defi.quota);
    setSessionPerimee(false);
    setAdversaire(defi.reponses);
    setCurrentIndex(0);
    setAnswers({});
    setStoredRestorable(null);
    setPendingRestore(null);
    setResultsRevealed(false);
    setDuelCode(null);
    setDuelReturnTo(null);
    setSwipeTab('swipe');
    setScreen('swipe');
    persist(0, {}, defi.paquet, defi.themeIds, defi.graine, defi.reponses, defi.quota);
  };

  const handleStartFresh = () => startSession(ALL_THEME_IDS, quotaDuFormat(format));

  const handleCustomizeThemes = () => {
    setThemesReturnTo(screen);
    setScreen('themes');
  };

  const handleThemesConfirmed = (themeIds: string[]) => {
    // Sur une sélection de thèmes, le paquet prend tout ce qu'ils contiennent
    // et le quota ne s'applique pas (voir utils/deck.ts) ; il reste enregistré
    // tel quel, pour que le code de défi refasse le même paquet en face.
    startSession(themeIds, quotaDuFormat(format));
  };

  const handleResume = () => {
    // Session déjà chargée en mémoire (on est simplement repassé par
    // l'accueil) : il n'y a rien à recharger, juste à revenir au bon écran.
    if (sessionProposals.length > 0) {
      if (currentIndex >= sessionProposals.length) openResults('intro');
      else setScreen('swipe');
      return;
    }
    if (!pendingRestore) return;
    const proposals = resolveProposals(pendingRestore.proposalIds);
    setSelectedThemeIds(pendingRestore.selectedThemeIds);
    setSessionProposals(proposals);
    setGraine(pendingRestore.graine);
    setAdversaire(pendingRestore.adversaire);
    setCurrentIndex(pendingRestore.currentIndex);
    setAnswers(pendingRestore.answers);
    if (pendingRestore.currentIndex >= proposals.length) openResults('intro');
    else setScreen('swipe');
  };

  const handleAnswer = (proposalId: string, direction: SwipeDirection) => {
    const nextAnswers = { ...answers, [proposalId]: direction };
    const nextIndex = currentIndex + 1;
    setAnswers(nextAnswers);
    setCurrentIndex(nextIndex);
    persist(nextIndex, nextAnswers, sessionProposals, selectedThemeIds);
  };

  const handleUndo = () => {
    if (currentIndex === 0) return;
    const prevProposal = sessionProposals[currentIndex - 1];
    const nextAnswers = { ...answers };
    delete nextAnswers[prevProposal.id];
    const nextIndex = currentIndex - 1;
    setAnswers(nextAnswers);
    setCurrentIndex(nextIndex);
    persist(nextIndex, nextAnswers, sessionProposals, selectedThemeIds);
  };

  const handleDismissTutorial = () => {
    setShowTutorial(false);
    markTutorialSeen();
  };

  // La dernière carte mène droit au résultat. La relecture y passait d'abord,
  // obligatoire ; elle est devenue un bouton du résultat (« Revoir mes
  // réponses »), pour qui veut corriger une réponse.
  const handleSwipeFinish = () => openResults('swipe');

  const handleReviewChange = (proposalId: string, direction: SwipeDirection) => {
    const nextAnswers = { ...answers, [proposalId]: direction };
    setAnswers(nextAnswers);
    persist(currentIndex, nextAnswers, sessionProposals, selectedThemeIds);
  };

  const handleReviewContinue = () => setScreen('results');

  const handleRestart = () => {
    clearSession();
    setStoredRestorable(null);
    setPendingRestore(null);
    setSessionProposals([]);
    setGraine(0);
    setAdversaire(undefined);
    setCurrentIndex(0);
    setAnswers({});
    setResultsRevealed(false);
    setScreen('intro');
  };

  // Réinitialisation complète (bouton "Réinitialiser les données" des
  // réglages) : distincte de `handleRestart`, qui ne remet à zéro que la
  // session en cours — ici on efface aussi le thème, l'accent et les
  // vibrations, et on repart de l'état par défaut de l'app.
  const handleResetAllData = () => {
    resetAllData();
    setSchemePreference('system');
    setHapticsEnabled(true);
    // Reverrouiller éteint déjà le mode arc-en-ciel (voir ThemeContext).
    setRainbowUnlocked(false);
    setStoredRestorable(null);
    setPendingRestore(null);
    setSelectedThemeIds(ALL_THEME_IDS);
    setSessionProposals([]);
    setGraine(0);
    setAdversaire(undefined);
    setCurrentIndex(0);
    setAnswers({});
    setResultsRevealed(false);
    setScreen('intro');
  };

  const openHowItWorks = () => {
    setHowItWorksReturnTo(screen);
    setScreen('howItWorks');
  };

  const openSettings = () => {
    setSettingsReturnTo(screen);
    setScreen('settings');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />

        <ErrorBoundary>
          {screen === 'intro' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <IntroScreen
                onStartFresh={handleStartFresh}
                onCustomizeThemes={handleCustomizeThemes}
                restorable={restorable}
                onResume={handleResume}
                onOpenHowItWorks={openHowItWorks}
                onOpenSettings={openSettings}
                format={format}
                onChangeFormat={setFormat}
                onOpenDuel={() => openDuel('intro')}
                sessionPerimee={sessionPerimee}
              />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {screen === 'settings' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <SettingsScreen
                onBack={() => setScreen(settingsReturnTo)}
                onResetAllData={handleResetAllData}
              />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {screen === 'howItWorks' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <HowItWorksScreen onBack={() => setScreen(howItWorksReturnTo)} />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {screen === 'themes' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <ThemeSelectScreen
                initialSelection={selectedThemeIds}
                quota={quotaDuFormat(format)}
                onConfirm={handleThemesConfirmed}
                onBack={() => setScreen(themesReturnTo)}
              />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {screen === 'swipe' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <SwipeScreen
                proposals={sessionProposals}
                currentIndex={currentIndex}
                answers={answers}
                onAnswer={handleAnswer}
                onUndo={handleUndo}
                onFinish={handleSwipeFinish}
                onSeeResult={() => openResults('swipe')}
                onRestart={handleRestart}
                onExit={() => setScreen('intro')}
                onOpenThemeFilter={handleCustomizeThemes}
                selectedThemeIds={selectedThemeIds}
                onOpenSettings={openSettings}
                showTutorial={showTutorial}
                onDismissTutorial={handleDismissTutorial}
                tab={swipeTab}
                onChangeTab={setSwipeTab}
                duel={
                  adversaire
                    ? { resume: resumeDuel, onVoir: () => openDuel('swipe') }
                    : null
                }
              />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {screen === 'review' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <ReviewScreen
                proposals={sessionProposals}
                themesById={THEMES_BY_ID}
                answers={answers}
                onChangeAnswer={handleReviewChange}
                onContinue={handleReviewContinue}
                // On n'arrive plus ici que depuis le résultat : on y retourne.
                onBack={() => setScreen('results')}
              />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {/* LE RÉSULTAT REPREND L'ACCENT DE L'APP, et non un accent à lui.
              Il a porté le violet, au nom d'un accent par écran : l'écran le
              plus regardé de l'app se retrouvait alors seul de sa couleur,
              podium, boutons et sous-onglets compris, sans rien qui le relie à
              la partie qu'on venait de jouer. */}
          {screen === 'results' && (
            <ZoneAccent accent="lime">
            <ScreenTransition>
              <ResultsScreen
                proposals={sessionProposals}
                answers={answers}
                selectedThemeIds={selectedThemeIds}
                onRestart={handleRestart}
                onBack={() => setScreen(resultsReturnTo)}
                // L'icône du bouton de retour suit sa destination : une maison
                // quand il ramène à l'accueil, un chevron quand il rend un vrai
                // pas en arrière dans le parcours.
                backIsHome={resultsReturnTo === 'intro'}
                // Rien n'est effacé : la session complète reste enregistrée,
                // et l'accueil rouvre ce résultat par sa carte dédiée.
                onGoHome={() => setScreen('intro')}
                onOpenHowItWorks={openHowItWorks}
                onOpenSettings={openSettings}
                // Le bloc du duel change de discours quand la partie EST un
                // défi : il ne s'agit plus d'en lancer un, mais d'aller voir
                // ce que l'autre a répondu.
                duel={resumeDuel}
                onOpenDuel={() => openDuel('results')}
                onOpenReview={() => setScreen('review')}
                // Un aperçu demandé en cours de partie ne consomme pas le
                // rideau : il reste réservé au vrai résultat, à la fin.
                alreadyRevealed={resultsRevealed || cartesRestantes > 0}
                onReveal={() => setResultsRevealed(true)}
                cartesRestantes={cartesRestantes}
              />
            </ScreenTransition>
            </ZoneAccent>
          )}

          {screen === 'duel' && (
            <ZoneAccent accent="peach">
            <ScreenTransition>
              <DuelScreen
                proposals={sessionProposals}
                answers={answers}
                graine={graine}
                themeIds={selectedThemeIds}
                quota={quota}
                adversaire={adversaire}
                deckDone={
                  sessionProposals.length > 0 && currentIndex >= sessionProposals.length
                }
                codeRecu={duelCode}
                onAccepterDefi={accepterDefi}
                onBack={quitterDuel}
              />
            </ScreenTransition>
            </ZoneAccent>
          )}
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
