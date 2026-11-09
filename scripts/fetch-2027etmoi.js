#!/usr/bin/env node
/**
 * Récupère les programmes des candidats du paquet depuis le dépôt public de
 * « 2027 et moi » et écrit 2027etmoi_programmes.json.
 *
 *   node scripts/fetch-2027etmoi.js
 *
 * Pourquoi cette deuxième source. Poligraph a placé son site derrière une
 * protection anti-robots, et son API n'expose pas les mesures : les sources
 * des mesures ajoutées par fetch-candidates.js n'ont jamais pu être lues, et
 * 142 cartes sur 311 sont arrivées dans l'app sans provenance. « 2027 et moi »
 * publie ses données sur GitHub, un fichier par candidat, chaque mesure avec
 * sa source, sa date et sa NATURE (programme, déclaration, presse).
 *
 * On lit le dépôt à un commit précis, noté dans le fichier produit : deux
 * régénérations à partir du même fichier donnent le même paquet, et l'on sait
 * exactement quelle version des données l'app embarque.
 *
 * Licence Ouverte 2.0 (Etalab) : réutilisation libre, à condition de citer la
 * source et la date de mise à jour — voir src/data/source.ts.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '..', '2027etmoi_programmes.json');
const DEPOT = '2027etmoi/2027etmoi';
const UA = 'elyze-app/1.0 (perso)';

// Identifiant du fichier chez « 2027 et moi » -> identifiant dans l'app.
const CANDIDATS = {
  attal: 'attal',
  bertrand: 'bertrand',
  cazeneuve: 'cazeneuve',
  glucksmann: 'glucksmann',
  'le-pen': 'lepen',
  melenchon: 'melenchon',
  philippe: 'philippe',
  retailleau: 'retailleau',
  ruffin: 'ruffin',
  tondelier: 'tondelier',
  villepin: 'villepin',
};

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => (res.statusCode === 200 ? resolve(body) : reject(new Error(`HTTP ${res.statusCode} ${url}`))));
      })
      .on('error', reject);
  });
}

(async () => {
  const commit = JSON.parse(await get(`https://api.github.com/repos/${DEPOT}/commits/main`));
  const sha = commit.sha;
  const meta = JSON.parse(await get(`https://raw.githubusercontent.com/${DEPOT}/${sha}/data/meta.json`));

  const resultat = {
    source: 'https://2027etmoi.fr',
    depot: `https://github.com/${DEPOT}`,
    commit: sha,
    mise_a_jour: meta.donnees,
    licence: 'Licence Ouverte 2.0 (Etalab), mention de la source et de la date de mise à jour',
    candidats: [],
  };

  for (const [fichier, id] of Object.entries(CANDIDATS)) {
    const prog = JSON.parse(await get(`https://raw.githubusercontent.com/${DEPOT}/${sha}/data/programmes/${fichier}.json`));
    // Une mesure sans lien vers sa source n'entre pas : c'est la raison même
    // de cette source.
    const mesures = (prog.mesures || []).filter((m) => m.source && m.source.url);
    resultat.candidats.push({ id, mise_a_jour: prog.mise_a_jour, etat_programme: prog.programme?.etat ?? null, mesures });
    console.log(`  ${id.padEnd(12)} ${String(mesures.length).padStart(3)} mesures sourcées (programme ${prog.programme?.etat ?? '?'})`);
  }

  fs.writeFileSync(OUT, JSON.stringify(resultat, null, 1) + '\n', 'utf8');
  console.log(`\nÉcrit : 2027etmoi_programmes.json (commit ${sha.slice(0, 7)}, données du ${meta.donnees})`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
