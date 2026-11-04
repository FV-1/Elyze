import React from 'react';
import renderer, { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';
import { IntroScreen } from './IntroScreen';
import { SwipeScreen, SwipeTab } from './SwipeScreen';
import { ReviewScreen } from './ReviewScreen';
import { ResultsScreen } from './ResultsScreen';
import { ThemeSelectScreen } from './ThemeSelectScreen';
import { SettingsScreen } from './SettingsScreen';
import { HowItWorksScreen } from './HowItWorksScreen';
import { DuelScreen } from './DuelScreen';
import { comparerDefi, encoderDefi, paquetDuDefi } from '../utils/duel';
import { ThemeProvider } from '../theme/ThemeContext';
import { PROPOSALS } from '../data/proposals';
import { THEMES, THEMES_BY_ID } from '../data/themes';
import { buildDeck, QUOTA_PAR_CANDIDAT } from '../utils/deck';
import { Answers } from '../types';

// Tests de MONTAGE des sept écrans.
//
// Ils ne vérifient pas une mise en page — un moteur de rendu de test ne
// calcule aucune géométrie, donc ils ne diront jamais qu'un texte est coupé ou
// qu'un bouton sort de l'écran. Ce n'est pas leur rôle.
//
// Ce qu'ils attrapent est la catégorie de panne qui, jusqu'ici, ne se voyait
// qu'en branchant un téléphone : un écran qui ne se monte plus du tout, une
// entrée de navigation disparue, un bouton devenu inerte. La couverture des
// écrans était de 0 % et celle des composants de 2 % ; c'est ce trou-là qu'on
// bouche, pas la vérification visuelle, qui demande un vrai rendu.
//
// Les modules natifs sont neutralisés dans jest.setup.js.

// Un paquet réaliste : le vrai tirage, sur les vraies données.
const DECK = buildDeck(PROPOSALS, QUOTA_PAR_CANDIDAT);

// Des réponses sur les vingt premières cartes, réparties sur les quatre
// gestes, pour que les écrans de résultat aient de quoi calculer.
const ANSWERS: Answers = Object.fromEntries(
  DECK.slice(0, 20).map((p, i) => [p.id, (['like', 'nope', 'superlike', 'skip'] as const)[i % 4]])
);

// Les arbres montés sont démontés après chaque test. Sans cela, la liste
// virtualisée de l'écran de révision continuait de planifier du travail une
// fois le test terminé, et jest s'en plaignait à juste titre : ce qui tourne
// encore après la fin d'un test n'est plus observé par personne.
const montes: ReactTestRenderer[] = [];

afterEach(() => {
  renderer.act(() => {
    while (montes.length) montes.pop()!.unmount();
  });
});

function mount(element: React.ReactElement): ReactTestRenderer {
  let tree!: ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  montes.push(tree);
  return tree;
}

// Les nombres comptent autant que les chaînes : « Reprendre (42/165) » est un
// `Text` dont les enfants alternent chaînes et nombres, et n'en garder que les
// chaînes donnait « Reprendre ( / ) ».
function texts(tree: ReactTestRenderer): string[] {
  const out: string[] = [];
  const visiter = (child: unknown) => {
    if (typeof child === 'string' || typeof child === 'number') out.push(String(child));
    else if (Array.isArray(child)) child.forEach(visiter);
  };
  for (const node of tree.root.findAllByType(Text)) visiter(node.props.children);
  return out;
}

function touchables(tree: ReactTestRenderer): ReactTestInstance[] {
  return tree.root.findAll(
    (node: ReactTestInstance) =>
      typeof node.type !== 'string' && typeof node.props?.onPress === 'function'
  );
}

// Un écran vide se « monte » sans erreur : on exige donc du contenu et de quoi
// en sortir, sans quoi le test passerait sur une page blanche.
function expectUsable(tree: ReactTestRenderer, minTouchables = 1) {
  expect(texts(tree).length).toBeGreaterThan(0);
  expect(touchables(tree).length).toBeGreaterThanOrEqual(minTouchables);
}

const noop = () => {};

// L'onglet courant vit désormais dans l'écran parent (voir App.tsx) : ces
// tests, qui touchent des onglets et observent ce qui change, doivent donc le
// tenir eux-mêmes. Sans cela, appuyer sur « Classement » n'appellerait qu'une
// fonction inerte.
function SwipeAvecOnglets(
  props: Omit<React.ComponentProps<typeof SwipeScreen>, 'tab' | 'onChangeTab'>
) {
  const [tab, setTab] = React.useState<SwipeTab>('swipe');
  return <SwipeScreen {...props} tab={tab} onChangeTab={setTab} />;
}

describe('montage des écrans', () => {
  it("l'accueil propose de commencer et de choisir ses thèmes", () => {
    const tree = mount(
      <IntroScreen
        onStartFresh={noop}
        onCustomizeThemes={noop}
        restorable={null}
        onResume={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        format="court"
        onChangeFormat={noop}
        onOpenDuel={noop}
        sessionPerimee={false}
      />
    );
    expectUsable(tree, 3);
    expect(texts(tree)).toContain('Commencer');
    // Le choix des thèmes commande ce qu'on swipe : il doit rester atteignable
    // depuis l'accueil, là où il ne coûte encore aucune progression. Il y
    // partage désormais une ligne avec l'entrée du duel, à égalité de largeur.
    expect(texts(tree)).toContain('Mes thèmes');
    expect(texts(tree)).toContain('Code défi');
  });

  it('l’accueil propose les deux longueurs, la courte par défaut', () => {
    let choisi: string | null = null;
    const tree = mount(
      <IntroScreen
        onStartFresh={noop}
        onCustomizeThemes={noop}
        restorable={null}
        onResume={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        format="court"
        onChangeFormat={(f) => {
          choisi = f;
        }}
        onOpenDuel={noop}
        sessionPerimee={false}
      />
    );
    // Le nombre de cartes est écrit : « courte » ne dit pas à quoi on s'engage.
    // Chiffre et libellé sont deux enfants d'un même Text, d'où le recollage.
    expect(texts(tree).join('')).toContain('55 cartes');
    expect(texts(tree).join('')).toContain('165 cartes');

    const courte = touchables(tree).find(
      (n: ReactTestInstance) => n.props.accessibilityLabel === 'Partie courte, 55 cartes'
    );
    expect(courte?.props.accessibilityState).toEqual({ checked: true });

    const longue = touchables(tree).find(
      (n: ReactTestInstance) => n.props.accessibilityLabel === 'Partie longue, 165 cartes'
    );
    renderer.act(() => longue!.props.onPress());
    expect(choisi).toBe('long');
  });

  it('l’accueil ouvre le duel, sans exiger d’avoir fini sa partie', () => {
    // C'était la porte manquante : un code reçu par message ne pouvait être
    // saisi que depuis l'écran de résultat.
    let ouvert = false;
    const tree = mount(
      <IntroScreen
        onStartFresh={noop}
        onCustomizeThemes={noop}
        restorable={{ currentIndex: 12, total: 55, isComplete: false }}
        onResume={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        format="court"
        onChangeFormat={noop}
        onOpenDuel={() => {
          ouvert = true;
        }}
        sessionPerimee={false}
      />
    );
    const lien = touchables(tree).find(
      (n: ReactTestInstance) =>
        n.props.accessibilityLabel === 'Relever le défi de quelqu’un avec son code'
    );
    expect(lien).toBeDefined();
    renderer.act(() => lien!.props.onPress());
    expect(ouvert).toBe(true);

    // Les thèmes, eux, ne sont pas proposés à côté d'un « Reprendre » : en
    // changer redémarre la partie, et rien ici ne le dirait.
    expect(texts(tree)).not.toContain('Mes thèmes');
  });

  it("l'accueil propose de reprendre une session en cours", () => {
    const tree = mount(
      <IntroScreen
        onStartFresh={noop}
        onCustomizeThemes={noop}
        restorable={{ currentIndex: 42, total: 165, isComplete: false }}
        onResume={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        format="court"
        onChangeFormat={noop}
        onOpenDuel={noop}
        sessionPerimee={false}
      />
    );
    expect(texts(tree).join(' ')).toContain('42');
  });

  it('le swipe expose ses deux onglets et le choix des thèmes', () => {
    const tree = mount(
      <SwipeAvecOnglets
        proposals={DECK}
        currentIndex={0}
        answers={{}}
        onAnswer={noop}
        onUndo={noop}
        onFinish={noop}
        onSeeResult={noop}
        onRestart={noop}
        onExit={noop}
        onOpenThemeFilter={noop}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onOpenSettings={noop}
        showTutorial={false}
        onDismissTutorial={noop}
      />
    );
    const found = texts(tree);
    for (const label of ['Swiper', 'Propositions', 'Thèmes']) {
      expect(found).toContain(label);
    }
    // Pas de classement pendant la partie : il doublait l'écran de résultat,
    // et un classement visible en cours de jeu peut orienter les réponses.
    expect(found).not.toContain('Classement');
    expect(found).not.toContain('Candidats');
  });

  it('le swipe sort vers l’accueil par le bouton du haut', () => {
    let sorti = false;
    const tree = mount(
      <SwipeAvecOnglets
        proposals={DECK}
        currentIndex={12}
        answers={ANSWERS}
        onAnswer={noop}
        onUndo={noop}
        onFinish={noop}
        onSeeResult={noop}
        onRestart={noop}
        onExit={() => {
          sorti = true;
        }}
        onOpenThemeFilter={noop}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onOpenSettings={noop}
        showTutorial={false}
        onDismissTutorial={noop}
      />
    );
    // Ce bouton quitte la session ; son libellé doit le dire, parce que son
    // icône était un chevron qui promettait un simple pas en arrière.
    const sortie = touchables(tree).find(
      (n: ReactTestInstance) =>
        n.props.accessibilityLabel === 'Revenir à l’accueil, ta progression est gardée'
    );
    expect(sortie).toBeDefined();
    renderer.act(() => sortie!.props.onPress());
    expect(sorti).toBe(true);
  });

  it('le swipe signale une sélection de thèmes restreinte', () => {
    const tree = mount(
      <SwipeAvecOnglets
        proposals={DECK}
        currentIndex={0}
        answers={{}}
        onAnswer={noop}
        onUndo={noop}
        onFinish={noop}
        onSeeResult={noop}
        onRestart={noop}
        onExit={noop}
        onOpenThemeFilter={noop}
        selectedThemeIds={['sante', 'education', 'logement']}
        onOpenSettings={noop}
        showTutorial={false}
        onDismissTutorial={noop}
      />
    );
    expect(texts(tree)).toContain('3 thèmes');
  });

  it('le swipe affiche son écran de fin quand le paquet est terminé', () => {
    const tree = mount(
      <SwipeAvecOnglets
        proposals={DECK}
        currentIndex={DECK.length}
        answers={ANSWERS}
        onAnswer={noop}
        onUndo={noop}
        onFinish={noop}
        onSeeResult={noop}
        onRestart={noop}
        onExit={noop}
        onOpenThemeFilter={noop}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onOpenSettings={noop}
        showTutorial={false}
        onDismissTutorial={noop}
      />
    );
    expect(texts(tree)).toContain('Voir mon résultat');
  });

  it('la révision se monte avec les réponses données', () => {
    const tree = mount(
      <ReviewScreen
        proposals={DECK}
        themesById={THEMES_BY_ID}
        answers={ANSWERS}
        onChangeAnswer={noop}
        onContinue={noop}
        onBack={noop}
      />
    );
    expectUsable(tree, 2);
  });

  it('la révision ouvre une proposition en entier', () => {
    const tree = mount(
      <ReviewScreen
        proposals={DECK}
        themesById={THEMES_BY_ID}
        answers={ANSWERS}
        onChangeAnswer={noop}
        onContinue={noop}
        onBack={noop}
      />
    );
    const premiere = DECK[0];
    // La liste tronque à trois lignes ; ce bouton est le seul moyen de lire
    // une mesure longue en entier avant de trancher.
    const ouvrir = touchables(tree).find(
      (n: ReactTestInstance) =>
        n.props.accessibilityLabel === `Lire en entier : ${premiere.text}`
    );
    expect(ouvrir).toBeDefined();

    // On vise un marqueur propre à la fiche, et non le texte de la mesure :
    // `numberOfLines` tronque à l'affichage seulement, si bien que le texte
    // entier est déjà dans l'arbre rendu de la ligne de liste.
    const MARQUEUR = 'CE QU’EN DISENT SES PARTISANS';
    expect(texts(tree)).not.toContain(MARQUEUR);
    renderer.act(() => ouvrir!.props.onPress());
    expect(texts(tree)).toContain(MARQUEUR);
    expect(texts(tree)).toContain(premiere.text);
  });

  it('le résultat se monte et nomme un candidat', () => {
    const tree = mount(
      <ResultsScreen
        proposals={DECK}
        answers={ANSWERS}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onRestart={noop}
        onBack={noop}
        backIsHome={false}
        onGoHome={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        duel={null}
        onOpenDuel={noop}
        alreadyRevealed
        onReveal={noop}
      />
    );
    expectUsable(tree, 2);
    // À la fin du paquet, le voile est levé : c'est le seul moment où l'app
    // relie une proposition à son auteur, et l'écran ne vaudrait rien sans.
    expect(texts(tree).join(' ')).toMatch(/[A-ZÉÈ][a-zéèêë]+ [A-ZÉÈ]/);
  });

  it('le résultat offre de sortir vers l’accueil à côté du partage', () => {
    const sorties: string[] = [];
    const tree = mount(
      <ResultsScreen
        proposals={DECK}
        answers={ANSWERS}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onRestart={noop}
        onBack={() => sorties.push('review')}
        backIsHome={false}
        onGoHome={() => sorties.push('accueil')}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        duel={null}
        onOpenDuel={noop}
        alreadyRevealed
        onReveal={noop}
      />
    );
    expect(texts(tree)).toContain('Accueil');
    expect(texts(tree)).toContain('Partager');

    const accueil = touchables(tree).find(
      (n: ReactTestInstance) =>
        n.props.accessibilityLabel === 'Revenir à l’accueil, ton résultat est gardé'
    );
    expect(accueil).toBeDefined();
    renderer.act(() => accueil!.props.onPress());
    // Sortir n'est pas revenir en arrière : les deux gestes cohabitent sur cet
    // écran et ne doivent pas mener au même endroit.
    expect(sorties).toEqual(['accueil']);
  });

  it('après un défi, le résultat renvoie vers la comparaison et non vers un nouveau défi', () => {
    let ouvert = false;
    const tree = mount(
      <ResultsScreen
        proposals={DECK}
        answers={ANSWERS}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onRestart={noop}
        onBack={noop}
        backIsHome={false}
        onGoHome={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        duel={{ accords: 32, tranchees: 48 }}
        onOpenDuel={() => {
          ouvert = true;
        }}
        alreadyRevealed
        onReveal={noop}
      />
    );
    const vu = texts(tree).join('');
    expect(vu).toContain('Voir qui a validé quoi');
    expect(vu).toContain('d’accord sur 32');
    expect(vu).not.toContain('Défier quelqu’un');

    const bloc = touchables(tree).find(
      (n: ReactTestInstance) =>
        n.props.accessibilityLabel === 'Voir ce que chacun a validé, carte par carte'
    );
    renderer.act(() => bloc!.props.onPress());
    expect(ouvert).toBe(true);
  });

  it('un classement sur une sélection de thèmes le dit, à l’écran comme sur l’image', () => {
    // L'image de partage voyage seule : un podium nu se lit comme un verdict
    // sur tout un programme (voir utils/portee.ts). La carte de partage est
    // montée hors-écran par cet écran, donc la mention doit s'y trouver aussi.
    const surSante = mount(
      <ResultsScreen
        proposals={DECK}
        answers={ANSWERS}
        selectedThemeIds={['sante']}
        onRestart={noop}
        onBack={noop}
        backIsHome={false}
        onGoHome={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        duel={null}
        onOpenDuel={noop}
        alreadyRevealed
        onReveal={noop}
      />
    );
    const mention = 'Sur le thème Santé & solidarités uniquement';
    expect(texts(surSante).filter((t) => t === mention)).toHaveLength(2);

    // Sur tous les thèmes, c'est le classement général : rien à préciser.
    const surTout = mount(
      <ResultsScreen
        proposals={DECK}
        answers={ANSWERS}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onRestart={noop}
        onBack={noop}
        backIsHome={false}
        onGoHome={noop}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        duel={null}
        onOpenDuel={noop}
        alreadyRevealed
        onReveal={noop}
      />
    );
    // « uniquement » figure aussi dans la note de bas de page sur la portée du
    // pourcentage : on vise les tournures de la mention, pas le mot seul.
    expect(texts(surTout).join(' ')).not.toMatch(/Sur le thème|Sur les thèmes|thèmes choisis sur/);
  });

  it('venu de l’accueil, le résultat n’offre qu’une sortie, en haut à gauche', () => {
    // Le chevron devient une maison et le bouton du pied de page disparaît :
    // deux boutons pour la même destination, à deux endroits de l'écran, sont
    // précisément ce qui rendait la sortie imprévisible (voir App.tsx).
    const sorties: string[] = [];
    const tree = mount(
      <ResultsScreen
        proposals={DECK}
        answers={ANSWERS}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onRestart={noop}
        onBack={() => sorties.push('accueil')}
        backIsHome
        onGoHome={() => sorties.push('pied de page')}
        onOpenHowItWorks={noop}
        onOpenSettings={noop}
        duel={null}
        onOpenDuel={noop}
        alreadyRevealed
        onReveal={noop}
      />
    );
    expect(texts(tree)).not.toContain('Accueil');
    expect(texts(tree)).toContain('Partager');

    const retour = touchables(tree).find(
      (n: ReactTestInstance) =>
        n.props.accessibilityLabel === 'Revenir à l’accueil, ton résultat est gardé'
    );
    expect(retour).toBeDefined();
    renderer.act(() => retour!.props.onPress());
    expect(sorties).toEqual(['accueil']);
  });

  it('le choix des thèmes se monte avec la sélection reçue', () => {
    const tree = mount(
      <ThemeSelectScreen initialSelection={['sante']} onConfirm={noop} onBack={noop} />
    );
    expectUsable(tree, 3);
    expect(texts(tree)).toContain('Santé & solidarités');
  });

  // L'écran annonçait toujours le paquet long : « Jouer : 165 cartes » pour
  // une partie courte qui n'en tire que 55.
  it('le choix des thèmes annonce le paquet du format choisi', () => {
    const tous = THEMES.map((t) => t.id);
    const court = mount(
      <ThemeSelectScreen initialSelection={tous} quota={5} onConfirm={noop} onBack={noop} />
    );
    expect(texts(court)).toContain('Jouer : 55 cartes');
    const long = mount(
      <ThemeSelectScreen
        initialSelection={tous}
        quota={QUOTA_PAR_CANDIDAT}
        onConfirm={noop}
        onBack={noop}
      />
    );
    expect(texts(long)).toContain('Jouer : 165 cartes');
  });

  it('les réglages se montent', () => {
    const tree = mount(<SettingsScreen onBack={noop} onResetAllData={noop} />);
    expectUsable(tree, 3);
  });

  it('« comment ça marche » se monte', () => {
    const tree = mount(<HowItWorksScreen onBack={noop} />);
    expectUsable(tree);
  });
});

describe('le voile sur les candidats', () => {
  // La règle centrale de l'app : pendant le swipe, aucun écran ne dit quel
  // candidat a proposé quelle mesure. Le classement provisoire peut montrer
  // des noms — c'est un agrégat — mais jamais accolés au texte d'une carte.
  it('aucun nom de candidat n’apparaît sur les cartes en cours de partie', () => {
    const tree = mount(
      <SwipeAvecOnglets
        proposals={DECK}
        currentIndex={0}
        answers={{}}
        onAnswer={noop}
        onUndo={noop}
        onFinish={noop}
        onSeeResult={noop}
        onRestart={noop}
        onExit={noop}
        onOpenThemeFilter={noop}
        selectedThemeIds={THEMES.map((t) => t.id)}
        onOpenSettings={noop}
        showTutorial={false}
        onDismissTutorial={noop}
      />
    );

    // Les trois premières cartes de la pile sont montées ; on vérifie qu'aucun
    // nom de famille ne se trouve dans le texte rendu de l'onglet Swiper.
    const rendu = texts(tree).join(' ');
    const auteurs = DECK.slice(0, 3).map((p) => p.candidateId);
    const noms: Record<string, string> = {
      cazeneuve: 'Cazeneuve',
      retailleau: 'Retailleau',
      villepin: 'Villepin',
      philippe: 'Philippe',
      ruffin: 'Ruffin',
      attal: 'Attal',
      melenchon: 'Mélenchon',
      lepen: 'Le Pen',
      tondelier: 'Tondelier',
      glucksmann: 'Glucksmann',
      bertrand: 'Bertrand',
    };
    for (const id of auteurs) {
      expect(rendu).not.toContain(noms[id]);
    }
  });
});

describe('duel', () => {
  // Le paquet du duel est reproductible : l'écran refabrique son code à partir
  // de la graine, les deux doivent donc concorder. L'écran rend en outre un QR
  // code entier, soit quelques centaines de vues imbriquées produites par un
  // encodeur écrit à la main : c'est exactement le genre d'écran qui se monte
  // en théorie et explose en pratique.
  const GRAINE = 7;
  const TOUS = THEMES.map((t) => t.id);
  const PAQUET = paquetDuDefi(GRAINE, TOUS);
  const TOUTES: Answers = Object.fromEntries(
    PAQUET.map((p, i) => [p.id, (['like', 'nope', 'superlike'] as const)[i % 3]])
  );
  const SIENNES: Answers = Object.fromEntries(
    PAQUET.map((p, i) => [p.id, (['nope', 'like'] as const)[i % 2]])
  );

  function duel(props: Partial<React.ComponentProps<typeof DuelScreen>> = {}) {
    return mount(
      <DuelScreen
        proposals={PAQUET}
        answers={TOUTES}
        graine={GRAINE}
        themeIds={TOUS}
        quota={QUOTA_PAR_CANDIDAT}
        adversaire={undefined}
        deckDone
        codeRecu={null}
        onAccepterDefi={noop}
        onBack={noop}
        {...props}
      />
    );
  }

  it('affiche un défi à montrer, et de quoi en ouvrir un autre', () => {
    const rendu = texts(duel()).join(' ');
    expect(rendu).toContain('Ton défi');
    expect(rendu).toContain('Le défi de quelqu’un');
  });

  it('un défi reçu propose de le relever, sans rien dévoiler des réponses', () => {
    const rendu = texts(duel({ codeRecu: encoderDefi(GRAINE, TOUS, SIENNES) })).join(' ');
    expect(rendu).toContain('Un défi t’attend');
    expect(rendu).toContain('Relever le défi');
    // Rien du contenu du paquet ne doit paraître : ni les propositions, ni ce
    // qu'il en a fait. On ne montre que la taille du défi.
    for (const proposition of PAQUET.slice(0, 5)) {
      expect(rendu).not.toContain(proposition.text);
    }
  });

  it('la comparaison montre les accords, carte par carte et sans candidat', () => {
    const rendu = texts(duel({ adversaire: SIENNES })).join(' ');
    expect(rendu).toContain('propositions où vous êtes du même avis');
    // La liste porte le texte des mesures, jamais leur auteur.
    expect(rendu).toContain(PAQUET[0].text);
  });

  it('la comparaison se filtre sur les accords ou les désaccords', () => {
    const attendu = comparerDefi(PAQUET, TOUTES, SIENNES);
    const unAccord = attendu.lignes.find((l) => l.accord)!;
    const unDesaccord = attendu.lignes.find((l) => l.desaccord)!;
    expect(unAccord).toBeDefined();
    expect(unDesaccord).toBeDefined();

    const tree = duel({ adversaire: SIENNES });
    const chip = (libelle: string) =>
      touchables(tree).find((n: ReactTestInstance) =>
        String(n.props.accessibilityLabel ?? '').startsWith(libelle)
      );

    // Tout est là au départ, désaccords comme accords.
    expect(texts(tree).join(' ')).toContain(unDesaccord.proposal.text);
    expect(texts(tree).join(' ')).toContain(unAccord.proposal.text);

    renderer.act(() => chip('Accords')!.props.onPress());
    expect(texts(tree).join(' ')).toContain(unAccord.proposal.text);
    expect(texts(tree).join(' ')).not.toContain(unDesaccord.proposal.text);

    renderer.act(() => chip('Désaccords')!.props.onPress());
    expect(texts(tree).join(' ')).toContain(unDesaccord.proposal.text);
    expect(texts(tree).join(' ')).not.toContain(unAccord.proposal.text);
  });

  it('dit le pourcentage des têtes de classement, qui explique les égalités', () => {
    // Deux listes de longueurs différentes ne sont pas une incohérence : ce
    // sont les ex æquo de chacun. Le pourcentage affiché le rend lisible.
    const attendu = comparerDefi(PAQUET, TOUTES, SIENNES);
    const rendu = texts(duel({ adversaire: SIENNES })).join('');
    expect(rendu).toContain(`${attendu.mesResultats[0].pct} %`);
    if (attendu.sesPremiers.length > 1) {
      expect(rendu).toContain(`${attendu.sesPremiers.length} à égalité`);
    }
  });

  it('attend la fin du paquet avant de comparer', () => {
    const rendu = texts(duel({ adversaire: SIENNES, deckDone: false })).join(' ');
    expect(rendu).toContain('Défi en cours');
    expect(rendu).not.toContain('propositions où vous êtes du même avis');
  });
});