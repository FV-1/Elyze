#!/usr/bin/env node
/**
 * Stabilité du podium : un même joueur, aux avis FIXES sur tout le vivier,
 * rejoue plusieurs parties. Combien de fois le podium désigne-t-il le « vrai »
 * premier — celui dont il approuve le plus de mesures sur tout le vivier — et
 * quand l'app annonce « Match net » ou « Bonne avance », a-t-elle raison ?
 *
 * C'est ce script qui a fixé les seuils de matchConfidenceLabel
 * (src/utils/scoring.ts). Il en recopie le score, le tirage (src/utils/deck.ts)
 * et les seuils : à tenir alignés si l'un d'eux change.
 *
 *   node scripts/simuler-stabilite.js
 */
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'proposals.ts'), 'utf8');
const vivier = [...src.matchAll(/themeId: '([^']+)',\s*candidateId: '([^']+)'/g)].map((m, i) => ({
  id: i,
  themeId: m[1],
  candidateId: m[2],
}));
const candidats = [...new Set(vivier.map((p) => p.candidateId))];

const JOUEURS = 400;
const PARTIES_PAR_JOUEUR = 50;
const PART_PAS_D_AVIS = 0.1;
const PART_SUPER_LIKE = 0.2; // parmi les « j'adhère »

// Recopiés de src/utils/scoring.ts.
const MIN_REPONSES_POUR_DEPARTAGER = 10;
const ECART_NET = 15;
const ECART_AVANCE = 8;

// Générateur à graine : deux lancements donnent les mêmes chiffres.
let graine = 42;
const hasard = () => (graine = (graine * 1664525 + 1013904223) % 4294967296) / 4294967296;
function melange(liste) {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(hasard() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Affinité d'un joueur pour un candidat, centrée sur 50 % : médiane de trois
// tirages uniformes, soit une loi bêta(2, 2).
const affinite = () => [hasard(), hasard(), hasard()].sort()[1];

// Même tirage que buildDeck : quota égal, rotation sur les thèmes.
function paquet(quota) {
  const choisies = [];
  for (const c of candidats) {
    const parTheme = new Map();
    for (const p of melange(vivier.filter((p) => p.candidateId === c))) {
      if (!parTheme.has(p.themeId)) parTheme.set(p.themeId, []);
      parTheme.get(p.themeId).push(p);
    }
    const files = melange([...parTheme.values()]);
    let pris = 0;
    while (pris < quota) {
      for (const f of files) {
        if (pris < quota && f.length) {
          choisies.push(f.shift());
          pris++;
        }
      }
    }
  }
  return choisies;
}

// Même score que computeResults.
function classement(propositions, avis) {
  const parCandidat = {};
  for (const p of propositions) {
    const r = avis[p.id];
    if (r === 'skip') continue;
    const poids = r === 'superlike' ? 3 : 1;
    const b = (parCandidat[p.candidateId] ??= { accord: 0, total: 0, reponses: 0 });
    b.total += poids;
    b.reponses += 1;
    if (r !== 'nope') b.accord += poids;
  }
  return Object.entries(parCandidat)
    .map(([c, b]) => ({
      c,
      reponses: b.reponses,
      score: (((b.accord / b.total) * b.reponses + 1) / (b.reponses + 2)) * 100,
    }))
    .sort((a, z) => z.score - a.score);
}

// Même message que matchConfidenceLabel.
function message([premier, second]) {
  if (Math.round(premier.score) === Math.round(second.score)) return 'égalité';
  if (Math.min(premier.reponses, second.reponses) < MIN_REPONSES_POUR_DEPARTAGER) return 'indicatif';
  const ecart = premier.score - second.score;
  return ecart >= ECART_NET ? 'match net' : ecart >= ECART_AVANCE ? 'bonne avance' : 'serré';
}

const pct = (a, b) => `${Math.round((100 * a) / b)} %`;

for (const [nom, quota] of [['courte', 5], ['longue', 15]]) {
  let justes = 0;
  let parties = 0;
  let memeVainqueur = 0;
  let paires = 0;
  const parMessage = {};

  for (let j = 0; j < JOUEURS; j++) {
    const aff = Object.fromEntries(candidats.map((c) => [c, affinite()]));
    const avis = {};
    for (const p of vivier) {
      if (hasard() < PART_PAS_D_AVIS) avis[p.id] = 'skip';
      else if (hasard() < aff[p.candidateId]) avis[p.id] = hasard() < PART_SUPER_LIKE ? 'superlike' : 'like';
      else avis[p.id] = 'nope';
    }
    // Le vrai premier se juge sur l'adhésion, sans le poids du super like.
    const avisBruts = Object.fromEntries(Object.entries(avis).map(([id, r]) => [id, r === 'superlike' ? 'like' : r]));
    const vrai = classement(vivier, avisBruts)[0].c;

    let precedent = null;
    for (let k = 0; k < PARTIES_PAR_JOUEUR; k++) {
      const res = classement(paquet(quota), avis);
      const m = message(res);
      const juste = res[0].c === vrai;
      parMessage[m] ??= { n: 0, justes: 0 };
      parMessage[m].n++;
      if (juste) {
        parMessage[m].justes++;
        justes++;
      }
      parties++;
      if (precedent) {
        paires++;
        if (precedent === res[0].c) memeVainqueur++;
      }
      precedent = res[0].c;
    }
  }

  console.log(`\nPartie ${nom} (${quota} cartes par candidat)`);
  console.log(`  Vrai premier en tête : ${pct(justes, parties)} des parties`);
  console.log(`  Même vainqueur d'une partie à l'autre : ${pct(memeVainqueur, paires)}`);
  for (const [m, v] of Object.entries(parMessage).sort((a, b) => b[1].n - a[1].n)) {
    console.log(`  « ${m} » : affiché dans ${pct(v.n, parties)} des parties, juste ${pct(v.justes, v.n)}`);
  }
}
