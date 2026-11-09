#!/usr/bin/env node
/**
 * Génère les fichiers de données de l'app à partir de l'export Poligraph.
 *
 *   node scripts/generate-data.js
 *
 * Produit : src/data/candidates.ts, themes.ts, proposals.ts
 *
 * Deux arbitrages structurent la génération, parce que l'export brut ne peut
 * pas être utilisé tel quel :
 *
 * 1. VOLUME — l'export contient 1360 mesures. Swiper 1360 cartes n'a aucun
 *    sens ; on en retient un sous-ensemble.
 *
 * 2. ÉQUILIBRE — la répartition brute est très inégale (Mélenchon 759 mesures,
 *    soit 56 % du total, contre 2 pour d'autres). Or l'app calcule un
 *    pourcentage de compatibilité PAR CANDIDAT : si un candidat occupait la
 *    moitié du paquet, il gagnerait mécaniquement, et les candidats à 2 ou 3
 *    mesures afficheraient des scores de 0 % ou 100 % dénués de sens.
 *    On applique donc un quota identique pour tous.
 *
 * 3. QUI FIGURE DANS L'APP — voir ROSTER plus bas. C'est une liste explicite,
 *    et non plus un seuil automatique : le changement est assumé et l'écran
 *    « Comment ça marche » le dit aux utilisateurs.
 *
 * Trois fichiers, fusionnés dans cet ordre — le dédoublonnage garde la
 * première occurrence, donc l'ordre dit qui l'emporte :
 *
 *  1. l'export machine de Poligraph (29 août 2026), sourcé ;
 *  2. le dépôt de « 2027 et moi » (scripts/fetch-2027etmoi.js), sourcé, plus
 *     récent, et qui dit la NATURE de chaque mesure ;
 *  3. les pages de Poligraph lues par scripts/fetch-candidates.js, dont les
 *     sources n'ont jamais pu être récupérées. Elles ne servent plus qu'aux
 *     candidats de SANS_SOURCE_TOLERE.
 *
 * 4. PROVENANCE — une mesure sans lien vers son document d'origine n'entre
 *    pas dans l'app, sauf exception nommée (SANS_SOURCE_TOLERE).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'poligraph_presidentielle_2027_export.json');
const AJOUTS = path.join(ROOT, 'poligraph_candidats_ajoutes.json');
const ETMOI = path.join(ROOT, '2027etmoi_programmes.json');
const OUT = path.join(ROOT, 'src', 'data');

// Taille du VIVIER par candidat : ce que l'app embarque.
//
// Le paquet d'une session n'en tire qu'une partie (voir utils/deck.ts), pour
// qu'un deuxième passage ne repose pas sur les mêmes cartes. Deux fois le
// quota donne environ la moitié de cartes nouvelles à chaque partie.
//
// Certains candidats n'ont pas publié assez de mesures pour atteindre ce
// vivier (Bertrand 23, Cazeneuve 24) : on prend alors ce qui existe. La
// variété est moindre pour eux, mais l'ÉQUITÉ ne bouge pas — c'est le paquet
// tiré, pas le vivier, qui doit compter le même nombre pour tout le monde.
const POOL_PAR_CANDIDAT = 30;

// Nombre de propositions tirées par candidat dans une session. Identique pour
// tous : c'est ce qui rend les pourcentages comparables entre eux.
const QUOTA_PAR_CANDIDAT = 15;

// Un candidat qui n'atteint pas ce seuil ne peut de toute façon pas être
// comparé : le pourcentage affiché reposerait sur trop peu de réponses pour
// vouloir dire quoi que ce soit. C'est une condition nécessaire, plus
// suffisante (voir ROSTER).
const MIN_MESURES = QUOTA_PAR_CANDIDAT;

// --- Qui figure dans l'app -------------------------------------------------
//
// Liste explicite, tenue à la main. Elle a remplacé la règle automatique
// « tout candidat ayant publié au moins QUOTA mesures », qui admettait
// 16 candidatures — dont plusieurs sans fonction élective nationale ni
// représentation parlementaire.
//
// Le critère retenu est indiqué en regard de chaque nom, et il est
// VÉRIFIABLE plutôt que pronostique : avoir exercé une fonction exécutive
// nationale, diriger un parti disposant d'un groupe au Parlement, ou avoir
// conduit une liste nationale au dernier scrutin européen. Aucun pronostic
// électoral n'entre ici — ce serait invérifiable et daté.
//
// Ce choix est éditorial et l'app doit le dire : voir la section « Pourquoi
// ces candidats » de screens/HowItWorksScreen.tsx, qui décrit ce critère.
// Modifier cette liste sans modifier cet écran ferait mentir l'app.
const ROSTER = {
  'Édouard Philippe': 'ancien Premier ministre',
  'Gabriel Attal': 'ancien Premier ministre',
  'Bernard Cazeneuve': 'ancien Premier ministre',
  'Dominique de Villepin': 'ancien Premier ministre',
  'Marine Le Pen': 'préside le groupe RN à l’Assemblée',
  'Jean-Luc Mélenchon': 'fondateur de LFI, groupe à l’Assemblée',
  'Bruno Retailleau': 'ancien ministre de l’Intérieur, président de LR',
  'Xavier Bertrand': 'ancien ministre, président de région',
  'Raphaël Glucksmann': 'tête de liste nationale aux européennes de 2024',
  'Marine Tondelier': 'secrétaire nationale des Écologistes',
  'François Ruffin': 'député, candidature déclarée',
};

// Correspondance slug Poligraph -> identité, pour les mesures récupérées sur
// le site (scripts/fetch-candidates.js) et fusionnées ici.
//
// L'export du 29 août est devenu très incomplet : le site a publié depuis des
// centaines de mesures pour des candidats qui n'en avaient qu'une poignée
// (Attal 15 -> 251, Tondelier 16 -> 192). On lit donc le site pour TOUS les
// candidats. L'export garde une utilité : il est le seul à porter la
// qualification « objectif chiffré » et le document source, absents des pages
// publiques. Comme il est fusionné EN PREMIER et que le dédoublonnage garde
// la première occurrence d'un texte, ses métadonnées survivent.
const CANDIDATS_AJOUTES = {
  'gabriel-attal': { nom: 'Gabriel Attal', parti: 'Renaissance' },
  'bernard-cazeneuve': { nom: 'Bernard Cazeneuve', parti: 'La Convention' },
  'marine-le-pen': { nom: 'Marine Le Pen', parti: 'RN' },
  'jean-luc-melenchon': { nom: 'Jean-Luc Mélenchon', parti: 'LFI' },
  'edouard-philippe': { nom: 'Édouard Philippe', parti: 'Horizons' },
  'bruno-retailleau': { nom: 'Bruno Retailleau', parti: 'LR' },
  'francois-ruffin': { nom: 'François Ruffin', parti: 'Nous président' },
  'marine-tondelier': { nom: 'Marine Tondelier', parti: 'EELV' },
  'xavier-bertrand': { nom: 'Xavier Bertrand', parti: 'Nous France' },
  'dominique-de-villepin': { nom: 'Dominique de Villepin', parti: 'LFH' },
  'raphael-glucksmann': { nom: 'Raphaël Glucksmann', parti: 'Place publique' },
};

// --- La provenance, et son unique exception ---------------------------------
//
// L'app affiche sous chaque carte d'où vient la mesure. Une carte sans source
// affirmerait implicitement quelque chose qu'elle ne peut pas montrer : elle
// n'entre donc pas dans le vivier.
//
// Deux candidats font exception, par décision assumée : ni Poligraph (sources
// illisibles) ni « 2027 et moi » (13 et 8 mesures) n'offrent assez de mesures
// sourcées pour tenir le quota. Les en retirer aurait sorti deux candidats de
// l'app ; on complète donc leur vivier avec les mesures Poligraph non
// sourcées, APRÈS toutes leurs mesures sourcées. scripts/check-data.js refuse
// une carte sans source pour tout autre candidat.
//
// Cette liste doit rester alignée sur celle de check-data.js.
const SANS_SOURCE_TOLERE = new Set(['Raphaël Glucksmann', 'Xavier Bertrand']);

// Les textes très longs débordent de la carte de swipe, les très courts sont
// souvent trop vagues pour qu'on puisse se prononcer.
//
// LONGUEUR_MAX est un filtre STRICT, plus une simple préférence. Tant que
// l'app tirait 15 mesures par candidat dans un export étroit, l'imposer aurait
// pu vider certains paquets ; on l'assouplissait donc, et une mesure de 448
// caractères s'est retrouvée dans le vivier — au delà de ce que la carte peut
// afficher (voir le budget de place dans components/SwipeCard.tsx). Avec plus
// de mille mesures disponibles, la contrainte ne coûte plus rien.
const LONGUEUR_MIN = 40;
const LONGUEUR_MAX = 240;
const LONGUEUR_IDEALE = 130;

// --- Les huit sujets affichés --------------------------------------------
//
// L'app présentait quinze thèmes, rangés en quatre catégories. C'était trop :
// l'écran de choix empilait cases de catégorie et cases de thème, et les plus
// petits thèmes (numérique, transports) ne donnaient qu'une poignée de cartes
// par candidat, d'où un avertissement de paquet trop maigre dès qu'on les
// choisissait seuls. Huit sujets de 28 à 53 cartes, sans catégorie, suffisent.
//
// L'ordre de cette liste est celui de l'écran.
const SUJETS = [
  { id: 'economie', label: 'Économie & numérique', icon: '💶' },
  { id: 'travail', label: 'Travail & retraites', icon: '🤝' },
  { id: 'sante', label: 'Santé & solidarités', icon: '🏥' },
  { id: 'education', label: 'École & culture', icon: '🎓' },
  { id: 'ecologie', label: 'Écologie & agriculture', icon: '🌱' },
  { id: 'logement', label: 'Logement & transports', icon: '🏠' },
  { id: 'securite', label: 'Sécurité & immigration', icon: '⚖️' },
  { id: 'institutions', label: 'Institutions & défense', icon: '🏛️' },
];

// --- Les quinze thèmes des sources, et le sujet de chacun ------------------
//
// L'identifiant FIN (`id`) reste celui des quinze anciens thèmes, et il entre
// dans l'identifiant de chaque carte. C'est voulu : l'explication et les
// arguments de chaque carte sont rangés sous cet identifiant, et les
// regrouper sous huit sujets ne doit pas les détacher de leur carte. Seul le
// `themeId` publié dans proposals.ts devient celui du sujet.
const THEME_META = {
  'economie-budget': { id: 'economie', sujet: 'economie' },
  'numerique-tech': { id: 'numerique', sujet: 'economie' },

  'emploi-travail': { id: 'emploi', sujet: 'travail' },
  retraites: { id: 'retraites', sujet: 'travail' },

  sante: { id: 'sante', sujet: 'sante' },
  'solidarites-protection-sociale': { id: 'solidarites', sujet: 'sante' },

  'education-culture': { id: 'education', sujet: 'education' },

  'environnement-energie': { id: 'environnement', sujet: 'ecologie' },
  'agriculture-alimentation': { id: 'agriculture', sujet: 'ecologie' },

  'logement-urbanisme': { id: 'logement', sujet: 'logement' },
  transports: { id: 'transports', sujet: 'logement' },

  'securite-justice': { id: 'securite', sujet: 'securite' },
  immigration: { id: 'immigration', sujet: 'securite' },

  'affaires-etrangeres-defense': { id: 'defense', sujet: 'institutions' },
  institutions: { id: 'institutions', sujet: 'institutions' },
};
const SUJET_DU_THEME = Object.fromEntries(Object.values(THEME_META).map((t) => [t.id, t.sujet]));

// --- Thèmes de « 2027 et moi » -> slug de thème de l'app -------------------
//
// Onze thèmes ont un équivalent direct. « territoires » mélange agriculture,
// transports et décentralisation : chaque mesure y est classée par mots-clés,
// dans l'ordre de la liste, et une mesure qu'aucun motif ne reconnaît est
// écartée (et signalée au rapport) plutôt que rangée au hasard.
const THEMES_ETMOI = {
  economie: 'economie-budget',
  travail: 'emploi-travail',
  retraites: 'retraites',
  education: 'education-culture',
  sante: 'sante',
  logement: 'logement-urbanisme',
  ecologie: 'environnement-energie',
  securite: 'securite-justice',
  immigration: 'immigration',
  international: 'affaires-etrangeres-defense',
  institutions: 'institutions',
};
const TERRITOIRES_ETMOI = [
  [/agricult|agricole|\bPAC\b|pesticide|phytosanitaire|néonicotino|pêche|chalutier|mégabassine|alimentaire/i, 'agriculture-alimentation'],
  [/SNCF|ferroviaire|transports?\b|avion/i, 'transports'],
  [/artificialisation|\bZAN\b/i, 'logement-urbanisme'],
  [/décentralisation|Corse|collectivités/i, 'institutions'],
  [/médiathèque|salles des fêtes|culturel/i, 'education-culture'],
  [/biodiversité|régies publiques de l'eau|climatique/i, 'environnement-energie'],
  [/contrats aidés/i, 'emploi-travail'],
];

// « retraites » couvre aussi, chez « 2027 et moi », la famille et l'enfance
// (« part fiscale dès le deuxième enfant », « protection de l'enfance ») :
// sans mot propre aux retraites, la mesure va aux solidarités.
const RETRAITES_VRAIES = /retraite|pension de|cotisation|âge légal|trimestre|départ/i;

// Mesures qui désignent leur auteur à coup sûr : le paquet est aveugle, et la
// mesure étant citée telle quelle, on ne peut que l'écarter. Une région
// qu'il préside, une ville qu'il dirige.
const REVELE_L_AUTEUR = [/sur le modèle des Hauts-de-France/i];

function themeEtmoi(mesure) {
  if (REVELE_L_AUTEUR.some((re) => re.test(mesure.texte))) return null;
  if (mesure.theme === 'retraites' && !RETRAITES_VRAIES.test(mesure.texte)) return 'solidarites-protection-sociale';
  if (THEMES_ETMOI[mesure.theme]) return THEMES_ETMOI[mesure.theme];
  if (mesure.theme !== 'territoires') return null;
  const trouve = TERRITOIRES_ETMOI.find(([re]) => re.test(mesure.texte));
  return trouve ? trouve[1] : null;
}

// Nature de la mesure, affichée en tête de la ligne de provenance. C'est
// l'information que Poligraph ne donnait pas : une promesse écrite dans un
// programme n'engage pas comme une phrase lâchée en interview.
const NATURE_ETMOI = {
  programme: 'Programme',
  declaration: 'Déclaration publique',
  presse: 'Rapporté par la presse',
};

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// « 2026-09-13 » -> « 13 septembre 2026 », « 2025-01 » -> « janvier 2025 » :
// la forme qu'emploie déjà Poligraph, pour que les cartes se lisent pareil.
function dateFr(iso) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(iso || '');
  if (!m) return null;
  const mois = MOIS[parseInt(m[2], 10) - 1];
  return m[3] ? `${parseInt(m[3], 10)} ${mois} ${m[1]}` : `${mois} ${m[1]}`;
}

// Identifiants stables et initiales, par nom tel qu'il apparaît dans l'export.
// Les identifiants reprennent ceux déjà utilisés par l'app quand le candidat
// y figurait, pour que les photos existantes restent associées.
const CANDIDAT_META = {
  'Gabriel Attal': { id: 'attal', initials: 'GA' },
  'Bernard Cazeneuve': { id: 'cazeneuve', initials: 'BC' },
  'Jérôme Guedj': { id: 'guedj', initials: 'JG' },
  'Anasse Kazib': { id: 'kazib', initials: 'AK' },
  'Marine Le Pen': { id: 'lepen', initials: 'MLP' },
  'David Lisnard': { id: 'lisnard', initials: 'DL' },
  'Jean-Luc Mélenchon': { id: 'melenchon', initials: 'JLM' },
  'Édouard Philippe': { id: 'philippe', initials: 'EP' },
  'Bruno Retailleau': { id: 'retailleau', initials: 'BR' },
  'François Ruffin': { id: 'ruffin', initials: 'FR' },
  'Marine Tondelier': { id: 'tondelier', initials: 'MT' },
  'Nathalie Arthaud': { id: 'arthaud', initials: 'NA' },
  'Clara Egger': { id: 'egger', initials: 'CE' },
  'Antoine Mikolajczak': { id: 'mikolajczak', initials: 'AM' },
  'Nicolas Dupont-Aignan': { id: 'dupont_aignan', initials: 'NDA' },
  'Raphaël Glucksmann': { id: 'glucksmann', initials: 'RG' },
  'Xavier Bertrand': { id: 'bertrand', initials: 'XB' },
  'Dominique de Villepin': { id: 'villepin', initials: 'DDV' },
};

// Libellés de partis harmonisés (l'export donne parfois un sigle brut).
const PARTI_LABEL = {
  Renaissance: 'Renaissance',
  'La Convention': 'La Convention',
  PS: 'Parti socialiste',
  'Révolution permanente': 'Révolution permanente',
  RN: 'Rassemblement national',
  'Nouvelle Énergie': 'Nouvelle Énergie',
  LFI: 'La France insoumise',
  Horizons: 'Horizons',
  LR: 'Les Républicains',
  'Nous président': 'Nous président',
  EELV: 'Les Écologistes',
  'Nous France': 'Nous France',
  'Place publique': 'Place publique',
  // Le site n'affiche que le sigle ; sa notice donne le nom complet.
  LFH: 'La France humaniste',
};

// Identifiants dont une explication existe déjà, pour les préférer au tirage
// du vivier. L'identifiant dérivant du texte de la mesure, une mesure encore
// présente sur le site retrouve exactement le même.
const EXPLICATIONS = (() => {
  const f = path.join(OUT, 'proposalExplanations.ts');
  if (!fs.existsSync(f)) return new Set();
  const src = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  return new Set([...src.matchAll(/^ {2}'([a-z0-9-]+)':/gm)].map((m) => m[1]));
})();

function dejaExplique(mesure) {
  const meta = CANDIDAT_META[mesure.nom];
  if (!meta) return false;
  return EXPLICATIONS.has(`${meta.id}-${mesure.themeId}-${slugifyId(mesure.texte).slice(0, 32)}`);
}

function slugifyId(texte) {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

// Échappe une chaîne pour l'insérer entre apostrophes simples dans du TS.
function q(str) {
  if (str === undefined || str === null) return undefined;
  return `'${String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function main() {
  const raw = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));

  // 1. Aplatir l'export (thème > candidat > mesures) en une liste de mesures.
  const toutes = [];
  for (const theme of raw.themes) {
    const meta = THEME_META[theme.theme_slug];
    if (!meta) throw new Error(`Thème inconnu dans l'export : ${theme.theme_slug}`);
    for (const cand of theme.candidats) {
      for (const mesure of cand.mesures || []) {
        const texte = (mesure.texte || '').trim();
        if (!texte) continue;
        // Le lien de chaque mesure commence par le slug du candidat sur
        // Poligraph : on le récupère ici plutôt que de le déduire du nom, pour
        // que le lien vers sa fiche soit toujours celui du site.
        const fiche = (mesure.url_fiche || '').split('/mesures/')[1] || null;
        toutes.push({
          slugSource: fiche,
          themeId: meta.id,
          themeSlug: theme.theme_slug,
          nom: cand.nom,
          parti: cand.parti,
          texte,
          precision: mesure.precision_code || null,
          detailUrl: mesure.url_fiche || null,
          source: (mesure.sources || [])[0] || null,
        });
      }
    }
  }

  // 1 bis. « 2027 et moi », AVANT les pages Poligraph non sourcées : à texte
  //        équivalent, c'est la version sourcée qui survit au dédoublonnage.
  const nonClassees = [];
  let etmoi = null;
  if (fs.existsSync(ETMOI)) {
    etmoi = JSON.parse(fs.readFileSync(ETMOI, 'utf8'));
    const nomParId = Object.fromEntries(Object.entries(CANDIDAT_META).map(([nom, m]) => [m.id, nom]));
    const partiParId = Object.fromEntries(
      Object.values(CANDIDATS_AJOUTES).map((c) => [CANDIDAT_META[c.nom].id, c.parti])
    );
    for (const cand of etmoi.candidats) {
      const nom = nomParId[cand.id];
      if (!nom) throw new Error(`Candidat de « 2027 et moi » sans identité : ${cand.id}`);
      for (const mesure of cand.mesures) {
        const themeSlug = themeEtmoi(mesure);
        if (!themeSlug) {
          nonClassees.push(`${cand.id} [${mesure.theme}] ${mesure.texte.slice(0, 70)}`);
          continue;
        }
        toutes.push({
          slugSource: null,
          themeId: THEME_META[themeSlug].id,
          themeSlug,
          nom,
          parti: partiParId[cand.id],
          texte: mesure.texte.trim(),
          precision: null,
          detailUrl: null,
          source: {
            type: NATURE_ETMOI[mesure.nature] || null,
            date: dateFr(mesure.source.date),
            url: mesure.source.url,
          },
        });
      }
    }
  }

  // 1 ter. Fusionner les candidats récupérés séparément, ramenés à la même
  //        forme. Le fichier est facultatif : sans lui, la génération se
  //        poursuit avec le seul export, et le contrôle du ROSTER plus bas
  //        signalera les candidats manquants.
  if (fs.existsSync(AJOUTS)) {
    const ajouts = JSON.parse(fs.readFileSync(AJOUTS, 'utf8'));
    for (const cand of ajouts.candidats || []) {
      const meta = CANDIDATS_AJOUTES[cand.slug];
      if (!meta) throw new Error(`Candidat ajouté sans métadonnées : ${cand.slug}`);
      for (const mesure of cand.mesures || []) {
        const themeMeta = THEME_META[mesure.themeSlug];
        if (!themeMeta) continue; // thème absent de l'app
        const texte = (mesure.texte || '').trim();
        if (!texte) continue;
        toutes.push({
          slugSource: mesure.fiche,
          themeId: themeMeta.id,
          themeSlug: mesure.themeSlug,
          nom: meta.nom,
          parti: meta.parti,
          texte,
          // La qualification n'est pas publiée sur le site : elle reste vide
          // plutôt que d'être devinée (voir scripts/fetch-candidates.js).
          precision: null,
          detailUrl: `https://poligraph.fr/elections/presidentielle-2027/mesures/${mesure.fiche}`,
          source: mesure.source
            ? { type: mesure.source.type, date: mesure.source.date, url: mesure.source.url }
            : null,
        });
      }
    }
  }

  // 2. Écarter ce que la carte ne peut pas afficher, ce qui n'a pas de source
  //    (hors exception), et les doublons.
  //
  //    Deux sources décrivent souvent la même mesure en des termes voisins
  //    (« Prix planchers pour les agriculteurs » / « Instaurer des prix
  //    planchers agricoles ») : la comparaison exacte des textes ne suffit
  //    plus. On compare les mots pleins, et au-delà de SEUIL_DOUBLON de mots
  //    communs, la seconde occurrence est écartée.
  const sansSource = {};
  const parNom = new Map();
  const uniques = toutes.filter((m) => {
    if (m.texte.length < LONGUEUR_MIN || m.texte.length > LONGUEUR_MAX) return false;
    if (!m.source?.url && !SANS_SOURCE_TOLERE.has(m.nom)) {
      sansSource[m.nom] = (sansSource[m.nom] || 0) + 1;
      return false;
    }
    const mots = motsPleins(m.texte);
    const deja = parNom.get(m.nom) || [];
    if (deja.some((autres) => ressemblance(mots, autres) >= SEUIL_DOUBLON)) return false;
    deja.push(mots);
    parNom.set(m.nom, deja);
    return true;
  });

  // 3. Regrouper par candidat, écarter ceux sous le seuil.
  const parCandidat = new Map();
  for (const m of uniques) {
    if (!parCandidat.has(m.nom)) parCandidat.set(m.nom, []);
    parCandidat.get(m.nom).push(m);
  }

  // Deux conditions, dans cet ordre : figurer dans la liste éditoriale, ET
  // avoir assez de mesures pour que le quota soit tenable. La seconde n'est
  // pas redondante — un candidat de la liste dont la source aurait retiré des
  // mesures produirait un paquet déséquilibré en silence.
  const retenus = [];
  const ecartes = [];
  for (const [nom, mesures] of parCandidat) {
    const dansListe = Object.prototype.hasOwnProperty.call(ROSTER, nom);
    (dansListe && mesures.length >= MIN_MESURES ? retenus : ecartes).push({ nom, mesures });
  }

  const manquants = Object.keys(ROSTER).filter((nom) => !retenus.some((r) => r.nom === nom));
  if (manquants.length) {
    throw new Error(
      `Candidats de la liste sans assez de mesures disponibles : ${manquants.join(', ')}.\n` +
        `Lancer d'abord : node scripts/fetch-candidates.js <slug>`
    );
  }
  retenus.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  ecartes.sort((a, b) => b.mesures.length - a.mesures.length);

  // 4. Pour chaque candidat retenu, choisir QUOTA mesures réparties sur ses
  //    thèmes (tourniquet), en privilégiant les textes de longueur lisible.
  const ordreThemes = Object.values(THEME_META).map((t) => t.id);

  const selection = [];
  for (const { mesures } of retenus) {
    const parTheme = new Map();
    for (const m of mesures) {
      if (!parTheme.has(m.themeId)) parTheme.set(m.themeId, []);
      parTheme.get(m.themeId).push(m);
    }
    // Tri déterministe. Les mesures DÉJÀ EXPLIQUÉES passent devant : chaque
    // proposition du vivier demande une explication et deux arguments écrits
    // à la main, et régénérer les données ne doit pas jeter ce travail sans
    // raison. À défaut, on préfère les longueurs proches de l'idéal, puis
    // l'ordre alphabétique pour lever les ex aequo.
    //
    // Avant tout cela, les mesures SOURCÉES : pour les candidats de
    // SANS_SOURCE_TOLERE, les mesures sans source ne viennent qu'en complément.
    for (const liste of parTheme.values()) {
      liste.sort((a, b) => {
        const srcA = a.source?.url ? 0 : 1;
        const srcB = b.source?.url ? 0 : 1;
        if (srcA !== srcB) return srcA - srcB;
        const dejaA = dejaExplique(a) ? 0 : 1;
        const dejaB = dejaExplique(b) ? 0 : 1;
        if (dejaA !== dejaB) return dejaA - dejaB;
        const scoreA = noteLongueur(a.texte);
        const scoreB = noteLongueur(b.texte);
        if (scoreA !== scoreB) return scoreA - scoreB;
        return a.texte.localeCompare(b.texte, 'fr');
      });
    }

    // Plusieurs passes de tourniquet. La première ne prend que les mesures
    // sourcées ET déjà rédigées ; les suivantes complètent. En une seule
    // passe, le tourniquet préférait une mesure neuve d'un thème encore vide
    // à une mesure rédigée d'un thème déjà servi : l'arrivée de « 2027 et
    // moi » jetait ainsi des explications écrites et relues, pour en exiger
    // d'autres à leur place. La répartition par thème reste assurée au
    // tirage de chaque partie (voir utils/deck.ts).
    const choisies = [];
    const prises = new Set();
    const tourniquet = (admise) => {
      while (choisies.length < POOL_PAR_CANDIDAT) {
        let ajoutTour = 0;
        for (const themeId of ordreThemes) {
          const candidates = (parTheme.get(themeId) || []).filter((m) => !prises.has(m) && admise(m));
          if (candidates.length === 0) continue;
          choisies.push(candidates[0]);
          prises.add(candidates[0]);
          ajoutTour++;
          if (choisies.length >= POOL_PAR_CANDIDAT) break;
        }
        if (ajoutTour === 0) break; // plus rien à prendre
      }
    };
    // Ordre de préférence : sourcée et rédigée, sourcée, rédigée, le reste.
    // Les deux dernières passes ne servent qu'aux candidats de
    // SANS_SOURCE_TOLERE. Sans la troisième, une régénération changeait leurs
    // cartes non sourcées à chaque fois, et jetait leurs textes.
    const sourcee = (m) => Boolean(m.source?.url);
    tourniquet((m) => sourcee(m) && dejaExplique(m));
    tourniquet(sourcee);
    tourniquet(dejaExplique);
    tourniquet(() => true);
    selection.push(...choisies);
  }

  // 5. Ordre final stable : par sujet, par thème, puis par candidat.
  const ordreSujets = SUJETS.map((t) => t.id);
  selection.sort((a, b) => {
    const sa = ordreSujets.indexOf(SUJET_DU_THEME[a.themeId]);
    const sb = ordreSujets.indexOf(SUJET_DU_THEME[b.themeId]);
    if (sa !== sb) return sa - sb;
    const ta = ordreThemes.indexOf(a.themeId);
    const tb = ordreThemes.indexOf(b.themeId);
    if (ta !== tb) return ta - tb;
    if (a.nom !== b.nom) return a.nom.localeCompare(b.nom, 'fr');
    return a.texte.localeCompare(b.texte, 'fr');
  });

  // 6. Identifiants de propositions, uniques et stables.
  const idsUtilises = new Set();
  for (const m of selection) {
    const meta = CANDIDAT_META[m.nom];
    if (!meta) throw new Error(`Candidat sans identifiant défini : ${m.nom}`);
    let base = `${meta.id}-${m.themeId}-${slugifyId(m.texte).slice(0, 32)}`;
    let id = base;
    let n = 2;
    while (idsUtilises.has(id)) id = `${base}-${n++}`;
    idsUtilises.add(id);
    m.id = id;
    m.candidateId = meta.id;
  }

  ecrireFichiers({ raw, etmoi, selection, retenus, ecartes });
  rapport({ raw, uniques, selection, retenus, ecartes, sansSource, nonClassees });
}

const SEUIL_DOUBLON = 0.6;
const MOTS_VIDES = new Set(
  'les des une pour par aux avec dans sur est sont qui que leur leurs plus son ses cette ces tout tous être faire mettre'.split(' ')
);

function motsPleins(texte) {
  return new Set(
    texte
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !MOTS_VIDES.has(w))
  );
}

// Part des mots du plus court des deux textes qu'on retrouve dans l'autre.
function ressemblance(a, b) {
  const [petit, grand] = a.size <= b.size ? [a, b] : [b, a];
  if (petit.size === 0) return 0;
  let communs = 0;
  for (const w of petit) if (grand.has(w)) communs++;
  return communs / petit.size;
}

// Plus la note est basse, meilleure est la longueur.
function noteLongueur(texte) {
  const n = texte.length;
  if (n < LONGUEUR_MIN || n > LONGUEUR_MAX) return 1_000_000 + Math.abs(n - LONGUEUR_IDEALE);
  return Math.abs(n - LONGUEUR_IDEALE);
}

function ecrireFichiers({ raw, etmoi, selection, retenus }) {
  const entete = (quoi) =>
    `// FICHIER GÉNÉRÉ — ne pas modifier à la main.\n` +
    `// Source : ${raw.source}\n` +
    `// Export du ${raw.extrait_le} · ${raw.licence}\n` +
    (etmoi
      ? `// Source : ${etmoi.source} (${etmoi.depot}, commit ${etmoi.commit.slice(0, 7)})\n` +
        `// Données du ${etmoi.mise_a_jour} · ${etmoi.licence}\n`
      : '') +
    `// Régénérer avec : node scripts/generate-data.js\n` +
    `// (${quoi})\n\n`;

  // --- themes.ts (uniquement les sujets réellement représentés) ---
  const sujetsPresents = new Set(selection.map((m) => SUJET_DU_THEME[m.themeId]));
  const themes = SUJETS.filter((t) => sujetsPresents.has(t.id));
  const themesTs =
    entete('les huit sujets affichés, qui regroupent les quinze thèmes des sources') +
    `import { ThemeTag } from '../types';\n\n` +
    `export const THEMES: ThemeTag[] = [\n` +
    themes
      .map(
        (t) =>
          `  { id: ${q(t.id)}, label: ${q(t.label)}, icon: ${q(t.icon)} },`
      )
      .join('\n') +
    `\n];\n\n` +
    `export const THEMES_BY_ID: Record<string, ThemeTag> = Object.fromEntries(\n` +
    `  THEMES.map((t) => [t.id, t])\n);\n`;
  fs.writeFileSync(path.join(OUT, 'themes.ts'), themesTs, 'utf8');

  // --- candidates.ts ---
  const partiParNom = new Map();
  const slugParNom = new Map();
  for (const m of selection) {
    if (!partiParNom.has(m.nom)) partiParNom.set(m.nom, m.parti);
    if (m.slugSource) {
      const connu = slugParNom.get(m.nom);
      if (!connu) slugParNom.set(m.nom, m.slugSource);
      else {
        // Plus long préfixe commun entre deux liens du même candidat.
        let i = 0;
        while (i < connu.length && i < m.slugSource.length && connu[i] === m.slugSource[i]) i++;
        slugParNom.set(m.nom, connu.slice(0, i));
      }
    }
  }
  const candidatsTs =
    entete(
      `${retenus.length} candidats retenus : ceux ayant au moins ${MIN_MESURES} mesures publiées`
    ) +
    `import { Candidate } from '../types';\n\n` +
    `export const CANDIDATES: Candidate[] = [\n` +
    retenus
      .map(({ nom }) => {
        const meta = CANDIDAT_META[nom];
        const parti = partiParNom.get(nom);
        const label = PARTI_LABEL[parti] || parti || 'Sans étiquette';
        // Un candidat dont aucune carte ne vient de Poligraph (toutes tirées de
        // « 2027 et moi ») garde sa fiche : la table des candidats la connaît.
        const slugConnu = Object.keys(CANDIDATS_AJOUTES).find((k) => CANDIDATS_AJOUTES[k].nom === nom);
        const slug = (slugParNom.get(nom) || slugConnu || '').replace(/-+$/, '');
        const slugField = slug ? `, poligraphSlug: ${q(slug)}` : '';
        return `  { id: ${q(meta.id)}, name: ${q(nom)}, initials: ${q(meta.initials)}, party: ${q(label)}${slugField} },`;
      })
      .join('\n') +
    `\n];\n\n` +
    `export const CANDIDATES_BY_ID: Record<string, Candidate> = Object.fromEntries(\n` +
    `  CANDIDATES.map((c) => [c.id, c])\n);\n`;
  fs.writeFileSync(path.join(OUT, 'candidates.ts'), candidatsTs, 'utf8');

  // --- proposals.ts ---
  const lignes = selection.map((m) => {
    const champs = [
      `    id: ${q(m.id)},`,
      `    themeId: ${q(SUJET_DU_THEME[m.themeId])},`,
      `    candidateId: ${q(m.candidateId)},`,
      `    text: ${q(m.texte)},`,
    ];
    if (m.precision === 'CHIFFREE') champs.push(`    precision: 'chiffree',`);
    else if (m.precision === 'OBJECTIF_SANS_CHIFFRE') champs.push(`    precision: 'non_chiffree',`);
    if (m.source?.type) champs.push(`    sourceType: ${q(m.source.type)},`);
    if (m.source?.date) champs.push(`    sourceDate: ${q(m.source.date)},`);
    if (m.source?.url) champs.push(`    sourceUrl: ${q(m.source.url)},`);
    if (m.detailUrl) champs.push(`    detailUrl: ${q(m.detailUrl)},`);
    return `  {\n${champs.join('\n')}\n  },`;
  });

  const proposalsTs =
    entete(
      `${selection.length} propositions — ${QUOTA_PAR_CANDIDAT} par candidat, réparties sur ses thèmes`
    ) +
    `import { Proposal } from '../types';\n\n` +
    `// Date de l'export Poligraph qui a produit ce catalogue. Affichée dans\n` +
    `// l'app : un comparateur de programmes qui ne dit pas de quand datent ses\n` +
    `// données demande une confiance qu'il ne justifie pas.\n` +
    `export const DATASET_DATE = ${q(etmoi && etmoi.mise_a_jour > raw.extrait_le ? etmoi.mise_a_jour : raw.extrait_le)};\n\n` +
    `// Date de chacune des deux sources. La Licence Ouverte de « 2027 et moi »\n` +
    `// impose de citer la date de mise à jour des données avec leur source.\n` +
    `export const POLIGRAPH_DATE = ${q(raw.extrait_le)};\n` +
    `export const ETMOI_DATE = ${q(etmoi ? etmoi.mise_a_jour : null) || 'null'};\n\n` +
    `export const PROPOSALS: Proposal[] = [\n${lignes.join('\n')}\n];\n\n` +
    `export const PROPOSALS_BY_ID: Record<string, Proposal> = Object.fromEntries(\n` +
    `  PROPOSALS.map((p) => [p.id, p])\n);\n`;
  fs.writeFileSync(path.join(OUT, 'proposals.ts'), proposalsTs, 'utf8');
}

function rapport({ uniques, selection, retenus, ecartes, sansSource, nonClassees }) {
  console.log(`Mesures uniques dans l'export : ${uniques.length}`);
  console.log(`Candidats retenus (>= ${MIN_MESURES} mesures) : ${retenus.length}`);
  console.log(`Propositions générées : ${selection.length}\n`);

  const parCand = {};
  const parTheme = {};
  for (const m of selection) {
    parCand[m.nom] = (parCand[m.nom] || 0) + 1;
    parTheme[SUJET_DU_THEME[m.themeId]] = (parTheme[SUJET_DU_THEME[m.themeId]] || 0) + 1;
  }
  console.log('Par candidat :');
  for (const [n, v] of Object.entries(parCand).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${n.padEnd(24)} ${v}`);
  }
  console.log('\nPar thème :');
  for (const [t, v] of Object.entries(parTheme).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(16)} ${v}`);
  }
  // Deux motifs bien distincts, qu'il ne faut pas confondre dans le rapport :
  // un candidat peut avoir publié des centaines de mesures et ne pas figurer
  // dans la liste éditoriale.
  console.log('\nCandidats écartés (hors liste, ou trop peu de mesures) :');
  for (const { nom, mesures } of ecartes) console.log(`  ${nom.padEnd(24)} ${mesures.length}`);

  console.log('\nÉcartées faute de source :');
  for (const [n, v] of Object.entries(sansSource)) console.log(`  ${n.padEnd(24)} ${v}`);
  const nonSourcees = selection.filter((m) => !m.source?.url);
  console.log(`\nCartes retenues sans source (exception assumée) : ${nonSourcees.length}`);
  if (nonClassees.length) {
    console.log(`\nMesures « 2027 et moi » écartées — sans thème correspondant, ou révélant leur auteur (${nonClassees.length}) :`);
    for (const l of nonClassees) console.log(`  ${l}`);
  }

  const longueurs = selection.map((m) => m.texte.length).sort((a, b) => a - b);
  console.log(
    `\nLongueur des textes retenus : min ${longueurs[0]} / médiane ${
      longueurs[Math.floor(longueurs.length / 2)]
    } / max ${longueurs[longueurs.length - 1]}`
  );
}

main();
