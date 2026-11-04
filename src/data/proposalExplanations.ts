// Décodage en français courant de CHAQUE proposition. Aucune exception : les
// 311 mesures du catalogue ont leur ligne ici.
//
// La règle a changé, et l'histoire vaut d'être retenue. Une première version
// exigeait déjà une explication partout ; elle a produit des paraphrases —
// quarante explications sur cent soixante-cinq reprenaient plus de 60 % du
// vocabulaire de leur mesure — et l'obligation a été levée. Un cadre vide
// n'est pourtant pas mieux qu'une paraphrase : la carte annonce « EN CLAIR »,
// et le lecteur qui bute sur une mesure une fois sur deux cesse de chercher.
//
// L'obligation est donc revenue, mais avec le garde-fou qui manquait la
// première fois : `node scripts/check-data.js` REFUSE une explication qui
// reprend 60 % ou plus du vocabulaire de sa mesure. Autrement dit, il ne
// suffit plus de remplir la case ; il faut le faire avec d'autres mots. C'est
// précisément ce que veut dire « en clair », et c'est ce qui rend la
// contrainte tenable : sur une mesure déjà limpide, on la redit dans la
// langue de tous les jours, et l'écart de vocabulaire suit tout seul.
//
// LES SIGLES SONT UNE OBLIGATION, pas une option. Une mesure citée mot pour
// mot ne peut pas être corrigée : quand elle écrit « CJIP », « UMJ » ou
// « DPE » sans le développer, c'est ici et nulle part ailleurs que le lecteur
// peut l'apprendre. `check-data.js` échoue si un sigle n'est ni développé
// entre parenthèses dans la mesure, ni expliqué ici.
//
// Deux exceptions, tenues courtes : les sigles d'usage courant (ONU, UE, GPS,
// SMIC...), dont le développement n'apprendrait rien, et ceux que la mesure
// développe déjà elle-même. Dans le doute, on explique.
//
// ATTENTION — avec proposalArguments.ts, ce fichier est l'un des deux seuls
// où un texte est ÉCRIT PAR L'APP à propos du programme d'une personne
// réelle. Partout ailleurs les mesures sont citées mot pour mot et les
// notices viennent de Wikipédia. Deux règles bornent le risque :
//
//  1. ON NE DÉCODE QUE CE QUI EST ÉCRIT. Aucun chiffre, aucune date, aucune
//     conséquence absente de la mesure. Seule exception : expliquer un terme
//     technique qu'elle emploie (« impôts de production », « octroi de mer »,
//     « décote », « peine plancher ») — c'est précisément ce qui bloque.
//     Réécrire un pourcentage en toutes lettres (70 % → « sept dixièmes »)
//     reste permis : c'est le même nombre, pas un nombre de plus.
//  2. AUCUN JUGEMENT. Ce qui relève du pour et du contre a sa place à part,
//     dans proposalArguments.ts.
//
// Le texte d'origine reste affiché au-dessus, et l'écran présente ces phrases
// comme celles de l'app (« EN CLAIR »), pas comme celles du candidat. Une
// phrase, 160 caractères au maximum : la carte est une boîte de taille fixe
// (voir le budget de place dans components/SwipeCard.tsx).

export const PROPOSAL_EXPLANATIONS: Record<string, string> = {
  // --- Bernard Cazeneuve -------------------------------------------------------
  'cazeneuve-economie-baisse-des-impots-de-production-':
    'Ces impôts frappent une entreprise avant tout bénéfice. Les ETI (entreprises de taille intermédiaire) et les petites sociétés en paieraient moins.',
  'cazeneuve-economie-instaurer-une-fiscalite-ciblant-':
    'Une rente financière est un revenu régulier tiré d’un capital placé. L’impôt viserait les patrimoines et les revenus de placement les plus élevés.',
  'cazeneuve-economie-mettre-en-place-un-plan-sur-dix-':
    'Un programme public de dix ans pour relancer l’industrie, avec des règles stables et des baisses d’impôt ciblées sur la recherche et les équipements.',
  'cazeneuve-economie-remplacer-l-exigence-d-equilibre':
    'La Sécurité sociale n’aurait plus à équilibrer ses comptes chaque année, mais sur cinq ans, avec des écarts permis en cas de crise.',
  'cazeneuve-numerique-donner-force-de-loi-a-l-evaluati':
    'L’INESIA est l’institut public français chargé d’évaluer la sécurité des systèmes d’intelligence artificielle.',
  'cazeneuve-numerique-stocker-les-donnees-des-francais':
    'Les informations personnelles seraient conservées sur des ordinateurs installés en Europe, et relèveraient des lois de la France.',
  'cazeneuve-emploi-generaliser-l-apprentissage-des-':
    'Apprentissage possible dès les premières années d’université, limites au recours aux stages, et retour du CDI comme contrat par défaut pour les jeunes.',
  'cazeneuve-emploi-resorption-des-ecarts-de-salaire':
    'Les femmes seraient payées autant que les hommes, et les pensions réduites par des arrêts de carrière, pour élever un enfant par exemple, relevées.',
  'cazeneuve-retraites-allongement-de-la-duree-de-cotis':
    'Pour une pension complète, on demanderait plus d’années de travail plutôt qu’un âge minimum plus tardif, après discussion avec les syndicats.',
  'cazeneuve-retraites-retablir-le-droit-a-un-depart-an':
    'Rouvrir le droit de partir plus tôt aux salariés exposés aux postures difficiles, aux charges lourdes, aux vibrations ou aux produits chimiques.',
  'cazeneuve-sante-faire-de-la-prise-en-charge-des-':
    '« Grande cause nationale » est un label officiel qui donne à un sujet une priorité publique. Soignants et enseignants y seraient formés.',
  'cazeneuve-sante-prise-en-charge-du-grand-age-de-':
    'L’accompagnement des personnes âgées et de leurs proches serait renforcé, sans reste à payer trop lourd pour les ménages modestes.',
  'cazeneuve-solidarites-accorder-une-aide-supplementaire':
    'Un étudiant qui touche déjà une bourse recevrait un versement en plus, au début de son parcours dans le supérieur.',
  'cazeneuve-solidarites-creer-une-avance-jeunesse-de-tro':
    'Somme versée par anticipation aux jeunes adultes sans diplôme ni travail, attribuée selon leurs revenus ; régions et communes pourraient y ajouter.',
  'cazeneuve-solidarites-simplification-unification-et-au':
    'Les grandes allocations seraient moins nombreuses, obéiraient aux mêmes règles et seraient versées sans qu’on ait à les demander.',
  'cazeneuve-education-au-moins-2-000-d-aide-supplement':
    'Les jeunes qui touchent une bourse recevraient une somme en plus lors de leurs deux premières années après le bac.',
  'cazeneuve-education-former-massivement-les-enseignan':
    'L’État créerait son propre service d’intelligence artificielle scolaire, formerait les professeurs aux outils informatiques et ouvrirait des labos mixtes.',
  'cazeneuve-education-lancer-un-plan-ecole-climat-soli':
    'Un plan de dix ans pour rénover les bâtiments scolaires et les rendre écologiques, en tenant compte des particularités de chaque territoire.',
  'cazeneuve-environnement-creer-une-datar-du-climat-rattac':
    'La DATAR était l’administration chargée de l’aménagement du territoire. Celle-ci recenserait les fragilités climatiques de chaque région.',
  'cazeneuve-environnement-filiere-electronucleaire-assumee':
    'Les réacteurs seraient remplacés selon un calendrier, éoliennes et panneaux solaires mieux ciblés, et l’électricité prendrait la place des fossiles.',
  'cazeneuve-agriculture-agriculture-prix-dignes-pour-les':
    'Les paysans seraient mieux payés, les terres cultivables protégées de la construction, et l’installation de nouveaux exploitants facilitée.',
  'cazeneuve-logement-lancer-un-grand-plan-de-construc':
    'Un grand plan de construction et de rénovation, à la fois social et écologique, avec de nouvelles façons de devenir propriétaire.',
  'cazeneuve-logement-renovation-massive-des-logements':
    'Un grand nombre d’habitations seraient isolées et modernisées, pour réduire à la fois les factures et la pollution.',
  'cazeneuve-transports-developpement-des-transports-col':
    'Bus, trains et cars seraient renforcés dans les zones rurales ou périurbaines où ils sont rares aujourd’hui.',
  'cazeneuve-securite-mettre-en-place-une-police-de-pr':
    'Des policiers affectés durablement à un quartier et formés pour y établir une relation de confiance.',
  'cazeneuve-defense-developper-une-reserve-citoyenne':
    'Ouvrir la réserve citoyenne à beaucoup plus de monde, pour rapprocher la société de son armée.',
  'cazeneuve-institutions-engager-une-revue-systematique-d':
    'Passer en revue toutes les règles existantes, et en supprimer deux chaque fois qu’on en crée une.',
  'cazeneuve-institutions-introduire-une-dose-de-proportio':
    'À la proportionnelle, les sièges se répartissent selon le nombre de voix. Une partie des députés serait élue ainsi, le reste comme aujourd’hui.',
  'cazeneuve-institutions-refonder-la-territorialite-de-la':
    'Répartir plus nettement les rôles entre communes, départements, régions et État, en confiant davantage de choix au niveau du terrain.',
  'cazeneuve-institutions-reformer-le-processus-decisionne':
    'Certaines décisions européennes requièrent aujourd’hui l’unanimité des États membres. Elles pourraient se prendre à la majorité.',
  // --- Bruno Retailleau --------------------------------------------------------
  'retailleau-economie-creation-d-un-fonds-france-produ':
    'Une enveloppe publique annuelle financerait machines et usines, et ce sont les conseils régionaux qui choisiraient les projets aidés.',
  'retailleau-economie-redonner-au-moins-30-milliards-d':
    'Le coût du travail est ce que l’employeur verse en plus du salaire net. La somme irait pour moitié aux revenus, pour moitié à cette charge.',
  'retailleau-economie-report-automatique-de-l-exigibil':
    'Quand une société est transmise, par exemple à un enfant, les taxes dues ne seraient payées qu’au moment où elle serait vendue.',
  'retailleau-economie-supprimer-toutes-les-cotisations':
    'Au-delà de 1 623 heures travaillées dans l’année, plus aucune cotisation sociale ne serait prélevée, ni sur le salaire ni sur l’employeur.',
  'retailleau-emploi-baisse-des-cotisations-de-30-mil':
    'Les prélèvements sur les salaires diminueraient, une moitié de la baisse allant directement sur la fiche de paie des employés.',
  'retailleau-emploi-code-du-travail-refonde-sur-un-s':
    'La loi ne fixerait plus que des règles de base ; le détail serait négocié dans chaque entreprise ou chaque secteur professionnel.',
  'retailleau-retraites-apres-l-age-legal-plus-aucune-co':
    'Un retraité qui travaille ne paierait plus que la CSG et la CRDS, deux prélèvements sur les revenus, et garderait une partie de sa pension.',
  'retailleau-retraites-creation-d-un-etage-de-retraite-':
    'En plus de la pension de base, chacun pourrait mettre de l’argent de côté sur un compte personnel pour ses vieux jours, sans obligation.',
  'retailleau-solidarites-compte-social-unique-total-des-a':
    'La somme des allocations sans lien avec les cotisations ne pourrait dépasser sept dixièmes du salaire minimum, sauf handicap ou grand âge.',
  'retailleau-solidarites-conge-de-naissance-facultatif-et':
    'Un des deux parents pourrait s’arrêter jusqu’aux six mois du bébé, en touchant sept dixièmes de son ancien salaire.',
  'retailleau-solidarites-creer-un-revenu-d-incitation-a-l':
    'Le RSA est le revenu des personnes sans ressources ; la prime d’activité complète les bas salaires ; l’allocation spécifique aide les chômeurs en fin de droits.',
  'retailleau-solidarites-fusionner-12-dispositifs-d-aide-':
    'Douze aides existantes seraient remplacées par 240 euros versés chaque mois et par enfant, de la naissance à 18 ans.',
  'retailleau-education-doubler-le-nombre-d-ingenieurs-s':
    'Deux fois plus de diplômés formés au calcul, aux machines qui apprennent, aux robots et aux réseaux qui font tourner l’informatique.',
  'retailleau-education-examen-d-entree-en-sixieme-deter':
    'Un test à la fin de l’école primaire répartirait les élèves en classes par niveau au collège, avec la possibilité d’en changer.',
  'retailleau-environnement-abroger-le-volet-electricite-de-':
    'La PPE, programmation pluriannuelle de l’énergie, est la feuille de route énergétique de la France. Sa partie électricité serait annulée.',
  'retailleau-environnement-fixer-d-emblee-a-80-ans-l-horizo':
    'Les réacteurs actuels seraient prévus pour fonctionner huit décennies, avec toujours une inspection de sécurité tous les dix ans.',
  'retailleau-environnement-inscrire-les-reacteurs-nucleaire':
    'Faire fonctionner les réacteurs nucléaires actuels jusqu’à 80 ans, avec un contrôle de leur état tous les dix ans.',
  'retailleau-agriculture-reautorisation-de-certains-neoni':
    'Des insecticides interdits en France seraient de nouveau permis, s’ils le sont ailleurs dans l’Union européenne.',
  'retailleau-agriculture-reconnaitre-les-projets-de-stock':
    'Donner aux projets de retenue d’eau pour l’agriculture le statut juridique le plus protecteur, celui d’« intérêt général majeur ».',
  'retailleau-logement-programme-d-accession-pour-les-l':
    'Un HLM est un logement social. Les familles qui louent une maison de ce type pourraient l’acheter, avec une cible d’un dixième de ces maisons.',
  'retailleau-logement-remettre-la-france-sur-une-traje':
    'Revenir à un rythme de 450 000 logements construits chaque année.',
  'retailleau-logement-supprimer-les-interdictions-de-l':
    'Le DPE est le diagnostic de performance énergétique, la note de A à G d’un logement. Un logement mal noté pourrait de nouveau être loué.',
  'retailleau-securite-autoriser-la-vision-par-ordinate':
    'Autoriser l’analyse automatique des images de vidéosurveillance contre la délinquance et le terrorisme, sans reconnaissance des visages en direct.',
  'retailleau-securite-verification-des-antecedents-de-':
    'Avant d’embaucher quelqu’un qui travaillera avec des enfants, on vérifierait son passé judiciaire, puis de façon continue.',
  'retailleau-immigration-acces-des-etrangers-aux-prestati':
    'Un étranger ne toucherait des aides qu’après cinq ans de résidence légale et d’emploi, une règle placée dans le texte suprême.',
  'retailleau-immigration-conditionner-le-benefice-plein-d':
    'Un étranger devrait résider et travailler cinq ans en France avant de toucher l’intégralité des aides aux familles.',
  'retailleau-defense-moyens-consacres-a-l-ia-de-defen':
    'Le budget militaire dédié à l’intelligence artificielle serait multiplié par cinq d’ici la fin du mandat.',
  'retailleau-defense-multiplier-par-cinq-les-moyens-c':
    'Cinq fois plus d’argent pour l’armée sur ces sujets : sécurité informatique, engins sans pilote à bord, machines et ordinateurs quantiques.',
  'retailleau-institutions-ne-pas-remplacer-125-000-departs':
    'Ne pas remplacer 125 000 fonctionnaires partant à la retraite, et déplacer autant d’agents des bureaux vers le terrain.',
  'retailleau-institutions-seuil-du-referendum-d-initiative':
    'Pour déclencher un vote citoyen avec des parlementaires, il suffirait de deux fois moins de signatures qu’aujourd’hui.',
  // --- Dominique de Villepin ---------------------------------------------------
  'villepin-economie-constituer-un-fonds-national-de-':
    'L’État placerait de l’argent dans des activités jugées stratégiques, en particulier pour réduire les émissions de carbone et dans l’informatique.',
  'villepin-economie-creer-un-impot-unique-sur-le-pat':
    'Les taxes actuelles sur la fortune seraient fondues en une seule, et la part prélevée sur ce que l’on reçoit en héritage augmenterait.',
  'villepin-economie-ramener-le-deficit-public-sous-3':
    'L’État, la Sécurité sociale et les collectivités ne dépenseraient plus qu’un peu au-delà de leurs recettes, et cela durablement.',
  'villepin-economie-ramener-toute-la-fiscalite-a-neu':
    'Les dizaines de taxes existantes seraient regroupées en neuf, et les règles fiscales tiendraient dans un court recueil.',
  'villepin-economie-supprimer-les-niches-fiscales-et':
    'Une niche est une réduction d’impôt ou de cotisation accordée pour encourager une dépense. Toutes ces exceptions disparaîtraient.',
  'villepin-emploi-adopter-une-grande-loi-d-accompa':
    'Une loi organiserait l’adaptation des métiers à l’intelligence artificielle, en anticipant les qualifications à former.',
  'villepin-emploi-basculer-plus-de-200-milliards-d':
    'Une partie des cotisations sur les salaires serait remplacée par la CSG (contribution sociale généralisée), qui touche aussi pensions et placements.',
  'villepin-retraites-reforme-des-retraites-preparee-p':
    'Syndicats, employeurs et citoyens tirés au sort prépareraient le texte, puis tous les électeurs voteraient pour l’adopter ou non.',
  'villepin-education-au-moins-cent-heures-annuelles-d':
    'Musique, dessin, théâtre ou danse occuperaient chaque année un volume minimal de cours pour tous les élèves.',
  'villepin-education-creer-signal-educ-plateforme-nat':
    'Un service national unique recueillerait les alertes, sans dépendre des responsables de l’Éducation.',
  'villepin-education-interdiction-effective-des-telep':
    'Les élèves ne pourraient plus utiliser leur portable nulle part à l’école, au collège ou au lycée, pauses comprises.',
  'villepin-education-revalorisation-salariale-d-au-mo':
    'Enseignants, surveillants et autres agents des écoles verraient leur paie augmenter d’un dixième au minimum.',
  'villepin-education-sanctuariser-le-budget-de-l-educ':
    'Les crédits de l’école, sans compter les retraites des agents, ne pourraient pas baisser, et la somme par enfant scolarisé monterait d’un cinquième.',
  'villepin-education-transformer-500-mediatheques-en-':
    'Des bibliothèques locales verraient leurs missions élargies pour devenir des lieux de culture proches des habitants.',
  'villepin-environnement-l-etat-fixe-les-objectifs-climat':
    'Le gouvernement décide des cibles pour le climat, et les communes reçoivent l’argent et le personnel pour les atteindre.',
  'villepin-environnement-planifier-l-electrification-des-':
    'Un budget sur plusieurs années organiserait le passage à l’électricité pour se chauffer, se déplacer et produire.',
  'villepin-environnement-retablir-un-prix-du-carbone-inte':
    'Une taxe sur les émissions de gaz à effet de serre serait réintroduite, et tout ce qu’elle rapporte serait reversé aux foyers.',
  'villepin-agriculture-etendre-graduellement-le-mecanis':
    'Les produits agricoles importés paieraient peu à peu une taxe à la frontière selon le carbone émis pour les produire.',
  'villepin-agriculture-reduire-de-moitie-l-usage-total-':
    'Les pesticides utilisés dans les champs devraient diminuer de moitié avant 2030.',
  'villepin-agriculture-viser-cinq-cent-mille-exploitati':
    'La France compterait au moins ce nombre de fermes en activité d’ici 2035.',
  'villepin-agriculture-viser-un-excedent-agricole-et-ag':
    'La France vendrait à l’étranger pour dix milliards de plus en produits de la terre et de l’alimentation qu’elle n’en achète.',
  'villepin-securite-creer-un-registre-national-de-tr':
    'Un fichier unique recenserait les personnes ayant maltraité des enfants, consultable par les services publics.',
  'villepin-immigration-pause-sur-schengen-et-coordinati':
    'La libre circulation sans contrôle aux frontières internes de l’Europe serait suspendue, et quelques pays agiraient ensemble sur l’asile.',
  'villepin-defense-creer-un-conseil-de-securite-eur':
    'Une instance réunirait les pays les plus influents de l’Union pour décider ensemble des questions de sécurité.',
  'villepin-defense-creer-une-darpa-europeenne-finan':
    'La DARPA est l’agence publique américaine qui finance la recherche de pointe pour la défense. L’Europe créerait la sienne, aussi bien dotée.',
  'villepin-defense-obliger-les-etablissements-d-ens':
    'Universités et écoles devraient permettre à chaque étudiant de passer six mois dans un autre pays de l’Union européenne.',
  'villepin-defense-pause-sur-les-elargissements-de-':
    'Aucun nouveau pays n’entrerait dans l’Union hors candidatures déjà avancées, et l’Ukraine y serait intégrée étape par étape.',
  'villepin-institutions-creer-un-conseil-de-l-ia-aupres-':
    'Un comité conseillerait l’Élysée sur l’intelligence artificielle, et un organisme indépendant en contrôlerait les risques, comme pour l’atome.',
  'villepin-institutions-encadrer-la-censure-du-gouvernem':
    'Les députés ne pourraient renverser le gouvernement que s’ils s’accordent sur une équipe pour le remplacer.',
  'villepin-institutions-nommer-un-gouvernement-resserre-':
    'Il y aurait environ dix ministres, et le pouvoir central se réunirait avec les présidents des conseils régionaux.',
  // --- Édouard Philippe --------------------------------------------------------
  'philippe-economie-conclure-un-pacte-fiscal-avec-le':
    'Un échange avec les entreprises : 50 milliards d’impôts en moins sur leur activité, contre 50 milliards d’aides publiques supprimées.',
  'philippe-economie-inscrire-dans-la-constitution-un':
    'La limitation des déficits deviendrait une obligation de rang constitutionnel, au-dessus des budgets votés chaque année.',
  'philippe-economie-moratoire-normatif-et-fiscal-auc':
    'Pendant cinq ans, ni règle supplémentaire ni taxe inédite ne seraient créées.',
  'philippe-economie-ramener-le-deficit-public-de-plu':
    'Le PIB est la richesse produite par le pays en un an. L’écart entre dépenses et recettes de l’État serait réduit de plus de moitié d’ici la fin du mandat.',
  'philippe-numerique-developper-une-infrastructure-d-':
    'Souverain signifie ici maîtrisé par l’Europe, sans dépendre d’un autre continent. Deux fois plus de puissance de calcul en cinq ans.',
  'philippe-emploi-creer-un-temps-partiel-parental-':
    'Après le congé de naissance, un parent pourrait travailler quatre jours sur cinq pendant deux mois sans perte de salaire.',
  'philippe-emploi-instaurer-un-droit-a-la-reconver':
    'Un salarié dont le métier est bouleversé par les outils automatisés pourrait obtenir une formation pour en changer.',
  'philippe-retraites-creer-un-pilier-de-capitalisatio':
    'Une part de la retraite (10 à 15 %) viendrait d’un capital placé et investi, en plus des cotisations versées par les actifs.',
  'philippe-sante-stabiliser-les-depenses-de-sante':
    'Ne plus augmenter le budget de la santé, mais le dépenser autrement : davantage de prévention et de technologies.',
  'philippe-solidarites-accorder-une-part-fiscale-des-le':
    'Une part fiscale allège l’impôt d’un foyer selon le nombre de personnes qui le composent. Le rang qui la déclenche passerait de trois à deux.',
  'philippe-solidarites-fusionner-les-dispositifs-exista':
    'Les différentes allocations familiales seraient remplacées par un versement unique, ouvert à tous les foyers avec enfants.',
  'philippe-education-creer-un-service-public-universe':
    'Un soutien scolaire gratuit pour tous, mêlant un assistant par intelligence artificielle et des professeurs à la retraite ou des étudiants volontaires.',
  'philippe-education-faire-des-chefs-d-etablissement-':
    'Le principal ou le proviseur déciderait de l’organisation, du règlement, de la tenue vestimentaire, et recruterait puis noterait ses professeurs.',
  'philippe-education-revaloriser-le-metier-de-profess':
    'Les enseignants seraient mieux payés et mieux formés, et l’école élémentaire se consacrerait d’abord aux savoirs de base.',
  'philippe-education-rythmes-scolaires-heures-de-cour':
    'Les matières principales seraient enseignées en matinée, et les après-midi consacrés aux activités physiques, artistiques ou aux langues.',
  'philippe-environnement-assurer-notre-souverainete-energ':
    'Produire notre électricité sans dépendre d’autres pays : relance du nucléaire, développement des renouvelables, et passage massif à l’électrique.',
  'philippe-environnement-doubler-le-montant-du-fonds-vert':
    'Doubler l’aide de l’État aux collectivités pour l’écologie, en la réservant à l’adaptation et au rafraîchissement des bâtiments publics.',
  'philippe-environnement-instaurer-un-prix-du-carbone-aux':
    'Une taxe à l’entrée de l’Union, calculée sur les gaz rejetés pour fabriquer un produit, afin que les usines d’ici ne soient pas désavantagées.',
  'philippe-environnement-lancer-un-plan-baignade-national':
    'Les cours d’eau seraient dépollués pour qu’on puisse s’y baigner, et les bassins municipaux remis en état.',
  'philippe-environnement-mettre-en-uvre-un-grand-plan-de-':
    'Plus de marchandises voyageraient par train, pour réduire le nombre de poids lourds sur les routes.',
  'philippe-agriculture-appliquer-le-principe-zero-surtr':
    'Quand la France applique une règle européenne aux agriculteurs, elle ne pourrait plus y ajouter d’exigences propres.',
  'philippe-agriculture-creer-100-territoires-de-souvera':
    'Créer 100 zones dédiées à la production alimentaire, et cesser d’appliquer des règles plus strictes que celles de l’Union européenne.',
  'philippe-logement-faciliter-le-demenagement-des-fa':
    'Un prêt sans intérêts à chaque naissance, pour permettre à la famille de déménager dans plus grand.',
  'philippe-securite-courtes-peines-des-la-premiere-i':
    'Dès un premier délit, de brefs séjours en prison seraient prononcés, et les crimes graves auraient une sanction minimale obligatoire.',
  'philippe-securite-donner-aux-maires-un-pouvoir-de-':
    'Le maire pourrait sanctionner lui-même les petites infractions du quotidien, sans passer par un tribunal.',
  'philippe-securite-renforcer-l-autorite-du-garde-de':
    'Le ministre de la Justice pourrait donner des instructions aux procureurs sur des affaires précises.',
  'philippe-immigration-denoncer-l-accord-de-1968-avec-l':
    'Mettre fin à l’accord franco-algérien de 1968, qui fixe des règles d’entrée et de séjour propres aux Algériens.',
  'philippe-immigration-mettre-en-place-des-quotas-migra':
    'Un nombre maximal d’entrées serait fixé par catégorie : plus de place pour le travail, moins pour le regroupement des familles.',
  'philippe-defense-grand-plan-munitions-pour-depass':
    'La France fabriquerait bien plus de projectiles d’artillerie chaque année, pour se rapprocher du volume allemand.',
  'philippe-defense-porter-le-nombre-de-reservistes-':
    'Un réserviste est un civil formé qui rejoint l’armée ponctuellement. Leur effectif, comme celui des engagés volontaires, augmenterait fortement.',
  // --- François Ruffin ---------------------------------------------------------
  'ruffin-economie-la-france-pourra-nationaliser-ce':
    'L’État pourrait devenir propriétaire d’entreprises jugées stratégiques, pour éviter que se répète l’affaire Alstom.',
  'ruffin-economie-referendum-sur-une-taxe-sur-les-':
    'Les Français voteraient sur un prélèvement sur les bénéfices distribués aux actionnaires, plus fort pour les entreprises qui en versent le plus.',
  'ruffin-economie-rendre-publics-les-montants-vers':
    'Un cabinet de conseil est une société privée payée pour aider l’administration. Les sommes qui leur sont réglées seraient rendues publiques.',
  'ruffin-economie-un-systeme-d-alerte-sera-mis-en-':
    'Un canal officiel permettrait aux entreprises et aux syndicats de signaler les tentatives d’influence étrangère dont ils ont connaissance.',
  'ruffin-emploi-deployer-un-plan-de-formation-na':
    'Un plan national de formation pour les métiers essentiels, afin de permettre d’évoluer au sein de son entreprise.',
  'ruffin-emploi-instaurer-une-remuneration-doubl':
    'Les heures travaillées avant 8 h ou après 18 h seraient payées deux fois plus.',
  'ruffin-emploi-mieux-remunerer-les-travailleuse':
    'Augmenter la paye des métiers dont la société ne peut pas se passer : soignants, aides à domicile, agents d’entretien, cuisiniers.',
  'ruffin-emploi-systematiser-la-remuneration-for':
    'Une coupure est un temps mort non payé au milieu de la journée. Au-delà de deux heures, elle donnerait droit à une somme fixe.',
  'ruffin-emploi-temps-de-transport-entre-deux-in':
    'Pour une aide à domicile, le trajet d’un client à l’autre serait payé, de même que les longues pauses imposées dans la journée.',
  'ruffin-retraites-un-trimestre-de-retraite-supplem':
    'Chaque année travaillée dans un emploi physiquement usant donnerait trois mois de droits en plus pour partir.',
  'ruffin-solidarites-elargir-le-pass-culture-aux-adul':
    'Le Pass Culture est un crédit offert par l’État pour des livres ou des places de spectacle. Il ne serait plus réservé aux jeunes.',
  'ruffin-solidarites-garantir-l-acces-de-toutes-et-to':
    'Le Pass’Sport est une aide de l’État pour l’inscription en club. Au-delà, la moitié du reste à payer serait prise en charge.',
  'ruffin-solidarites-simplifier-l-acces-aux-aides-pou':
    'Un seul guichet pour les aides aux vacances et aux loisirs, qui préviendrait automatiquement les personnes y ayant droit.',
  'ruffin-education-creer-une-route-des-metiers-d-ar':
    'Un parcours touristique national autour des métiers d’art, pensé pour rester accessible à tous.',
  'ruffin-education-garantir-a-chaque-enfant-francai':
    'Une colonie ou une classe de découverte payée par l’État, au moins une fois durant l’école, attribuée sans que les parents aient à la réclamer.',
  'ruffin-education-mettre-en-place-une-politique-am':
    'Un emploi non délocalisable ne peut pas être transféré à l’étranger : un spectacle ou un centre de vacances se tient forcément sur place.',
  'ruffin-education-transformer-la-plateforme-du-pas':
    'Souverain veut dire maîtrisé par la puissance publique plutôt que par une société privée. L’application pousserait vers les activités en groupe.',
  'ruffin-logement-affirmer-la-vocation-sociale-du-':
    'La contribution des entreprises au logement servirait d’abord à loger les travailleurs des métiers essentiels.',
  'ruffin-logement-garantir-par-la-loi-le-maintien-':
    'Non lucratif veut dire sans recherche de profit : villages vacances associatifs, auberges. Les subventions dépendraient de prix contenus.',
  'ruffin-logement-garantir-un-droit-au-logement-ab':
    'Les métiers indispensables au quotidien auraient droit à un toit peu cher, près de là où ils exercent.',
  'ruffin-logement-permettre-aux-travailleuses-et-t':
    'Loger tout près de leur poste les métiers indispensables, pour leur épargner les longs trajets quotidiens et ce qu’ils coûtent en repos.',
  'ruffin-transports-baisser-les-tarifs-des-peages-en':
    'Reprendre les autoroutes aux sociétés privées à la fin de leurs contrats, et fixer soi-même des péages moins chers.',
  'ruffin-transports-mettre-en-place-un-billet-popula':
    'Les TER sont les trains express régionaux, qui desservent les villes d’une même région en dehors des grandes lignes.',
  'ruffin-transports-plafonner-le-prix-des-billets-d-':
    'Plafonner, c’est fixer une limite à ne pas dépasser. Aucun vol entre la métropole et l’Outre-mer ne pourrait coûter davantage que ce seuil.',
  'ruffin-securite-interdire-toute-intervention-des':
    'Un magistrat du parquet enquête et réclame les peines. Le gouvernement ne pourrait plus peser sur sa nomination ni sur son avancement.',
  'ruffin-securite-renforcer-l-independance-du-parq':
    'Le gouvernement ne nommerait plus les procureurs.',
  'ruffin-securite-supprimer-la-convention-judiciai':
    'Cet accord permet à une entreprise poursuivie de payer une amende négociée sans procès ni condamnation pénale.',
  'ruffin-institutions-faire-de-la-probite-une-priorite':
    'La probité, c’est l’honnêteté dans l’exercice d’une fonction publique. Elle deviendrait une exigence centrale de l’action gouvernementale.',
  'ruffin-institutions-mettre-en-place-un-systeme-de-co':
    'Consulter les citoyens par défaut sur les décisions publiques, pour contrebalancer l’influence des lobbies.',
  'ruffin-institutions-soumettre-la-decision-du-ministr':
    'Une commission parlementaire est un groupe de députés spécialisé. Celui-ci examinerait le choix du ministre avant qu’il ne devienne définitif.',
  // --- Gabriel Attal -----------------------------------------------------------
  'attal-economie-double-regle-d-or-comptes-public':
    'Les recettes devraient couvrir les dépenses, et l’argent emprunté ne servirait qu’à investir, non à payer le fonctionnement courant.',
  'attal-economie-lancer-le-plan-france-2050-a-hau':
    'Un investissement public de 100 milliards d’euros concentré sur dix secteurs industriels et technologiques jugés décisifs.',
  'attal-economie-passer-la-tva-sur-les-vehicules-':
    'La TVA sur une voiture électrique passerait de 20 % à 5,5 % pendant cinq ans, en remplacement d’une partie de la prime à l’achat.',
  'attal-economie-ramener-les-impots-de-production':
    'Plafonner les impôts que les entreprises paient sur leur activité, qu’elles fassent des bénéfices ou non, à moins de 3 % de la richesse qu’elles produisent.',
  'attal-economie-viser-un-objectif-de-200-milliar':
    'Des fonds publics et privés seraient mobilisés pour faire du pays le leader européen de l’intelligence artificielle.',
  'attal-emploi-creer-un-conge-de-naissance-de-6':
    'Le plafond de la Sécurité sociale est un montant de référence qui sert à calculer les prestations. L’arrêt serait payé aux sept dixièmes de ce repère.',
  'attal-emploi-creer-un-contrat-reussite-etudia':
    'Un contrat réservé aux étudiants : 15 heures par semaine au maximum, charges allégées pour l’employeur, et pause pendant les examens.',
  'attal-emploi-creer-un-livret-d-epargne-sur-le':
    'Comme pour le logement social, l’argent placé par les épargnants servirait à ouvrir des crèches et à former leur personnel.',
  'attal-emploi-equivalent-d-un-13e-mois-pour-le':
    'Les salariés autour du revenu du milieu toucheraient l’équivalent d’une paie mensuelle de plus par an, grâce à moins de prélèvements.',
  'attal-emploi-former-10-millions-de-salaries-e':
    'Dix millions d’actifs seraient initiés en trois ans aux logiciels qui produisent seuls du texte ou des images, et à l’informatique en général.',
  'attal-retraites-introduire-la-retraite-par-capit':
    'La moitié des primes liées aux résultats de l’entreprise serait placée d’office pour les vieux jours du salarié.',
  'attal-retraites-supprimer-l-age-legal-de-depart-':
    'Il n’y aurait plus d’âge minimum : chacun pourrait s’arrêter une fois atteint le nombre d’années de travail requis.',
  'attal-sante-prevoir-une-couverture-sante-obl':
    'Une complémentaire santé obligatoire pour les personnes employées directement par des particuliers : ménage, aide à domicile, garde d’enfants.',
  'attal-solidarites-familles-monoparentales-ne-plus-':
    'L’argent versé par l’autre parent pour l’enfant ne serait plus imposé, et une carte offrirait des réductions aux parents seuls.',
  'attal-solidarites-mettre-en-place-un-droit-opposab':
    'Un droit à une place de garde qu’on pourrait faire valoir : si la commune n’en propose aucune, la CAF s’en chargerait.',
  'attal-education-augmenter-les-enseignants-d-au-m':
    'Les professeurs gagneraient au minimum 200 euros nets de plus chaque mois, et jusqu’à 500 pour certains.',
  'attal-education-loi-de-programmation-de-l-educat':
    'Un plan de moyens sur cinq ans serait voté, et cent établissements concentrant des élèves en grande difficulté seraient fermés.',
  'attal-education-maintenir-la-trajectoire-de-rein':
    'Le PIB est la richesse produite par le pays en un an. L’engagement d’y consacrer 3 % pour la recherche d’ici 2030 serait tenu.',
  'attal-environnement-engagement-de-stabilite-tarifair':
    'Le tarif du courant payé par les ménages resterait au même niveau pendant cinq ans.',
  'attal-environnement-faire-passer-le-rythme-de-reduct':
    'Chaque année jusqu’en 2030, la France devrait diminuer sa pollution climatique bien plus vite qu’aujourd’hui.',
  'attal-environnement-tenir-l-objectif-de-14-epr-d-ici':
    'Un EPR est un réacteur nucléaire de nouvelle génération. L’éolien en mer serait développé avec des autorisations instruites en deux ans.',
  'attal-agriculture-mettre-en-place-des-contrats-de-':
    'Des contrats liant l’État, la filière et l’agriculteur, portant sur le bien-être animal et la réduction de moitié des pesticides d’ici 2030.',
  'attal-logement-creer-jusqu-a-500-000-logements-':
    'Créer des logements sans étendre les villes : en surélevant les immeubles, en divisant les terrains et en construisant derrière les maisons existantes.',
  'attal-securite-rendre-systematique-la-police-mu':
    'Toute commune de plus de 10 000 habitants devrait avoir une police municipale, sauf vote contraire de son conseil.',
  'attal-securite-supprimer-le-juge-de-l-applicati':
    'Le magistrat qui aménage les sanctions après le jugement disparaîtrait, comme les réductions accordées d’office aux détenus.',
  'attal-immigration-instaurer-un-systeme-d-admission':
    'Les étrangers seraient sélectionnés selon un barème (diplôme, âge, maîtrise du français, promesse d’embauche), dans des limites votées par le Parlement.',
  'attal-immigration-systeme-d-immigration-a-points-i':
    'Pour venir s’installer, il faudrait réunir assez de critères notés : travail durable, toit, langue et adhésion aux principes républicains.',
  'attal-defense-etats-unis-d-europe-president-eu':
    'Les pays qui le souhaitent formeraient une fédération, avec à sa tête un dirigeant choisi directement par tous les Européens.',
  'attal-defense-instaurer-un-buy-european-tech-a':
    'Réserver les commandes publiques de défense et de technologie aux entreprises européennes et à celles des pays signataires des accords de l’OMC.',
  'attal-institutions-inscrire-dans-la-constitution-un':
    'L’administration devrait répondre en huit semaines au plus aux entreprises ou particuliers qui veulent lancer un projet.',
  // --- Jean-Luc Mélenchon ------------------------------------------------------
  'melenchon-economie-etablir-une-taxe-permanente-sur-':
    'Un superprofit est un bénéfice bien supérieur à celui des années ordinaires. Toutes les branches y seraient soumises, pas seulement l’énergie.',
  'melenchon-economie-retablir-et-renforcer-l-impot-de':
    'Rétablir un impôt annuel payé sur les grands patrimoines, alourdi pour ceux qui reposent sur des activités polluantes.',
  'melenchon-numerique-garantir-l-hebergement-des-donne':
    'Héberger, c’est stocker sur des machines. Celles des administrations et des sociétés vitales devraient se trouver sur le sol national.',
  'melenchon-numerique-garantir-l-utilisation-de-galile':
    'Galileo est le système européen de positionnement par satellite, le GPS son équivalent américain. La double compatibilité permet d’utiliser les deux.',
  'melenchon-emploi-garantir-les-droits-des-represen':
    'Un salarié protégé exerce un mandat, syndical ou électif, qui rend son renvoi soumis à autorisation. Cette garantie serait consolidée.',
  'melenchon-emploi-interdire-les-licenciements-bour':
    'Un dividende est la part du gain reversée aux actionnaires. Une société qui en verse, ou qui touche de l’argent public, ne pourrait plus renvoyer.',
  'melenchon-retraites-garantir-aux-agricultrices-et-ag':
    'Réformer les retraites agricoles pour garantir un niveau de pension décent aux agriculteurs.',
  'melenchon-retraites-supprimer-la-decote-qui-represen':
    'La décote ampute définitivement la pension de qui part sans avoir tous ses trimestres. Elle disparaîtrait.',
  'melenchon-sante-ajouter-le-droit-de-mourir-dans-':
    'Les soins palliatifs soulagent la douleur en fin de vie sans chercher à guérir. Ce droit, et celui d’être aidé à partir, entreraient dans la Constitution.',
  'melenchon-sante-proteger-la-recherche-de-la-fina':
    'Écarter les intérêts financiers et les entreprises privées de la recherche médicale et de l’hôpital.',
  'melenchon-solidarites-creer-un-service-public-de-la-pe':
    'L’accueil des tout-petits deviendrait une mission de l’État, avec un demi-million de places supplémentaires ouvertes en cinq ans.',
  'melenchon-solidarites-organiser-l-election-des-adminis':
    'Les assurés éliraient eux-mêmes les dirigeants de la Sécurité sociale, qui pourraient fixer le niveau des cotisations.',
  'melenchon-education-geler-les-ouvertures-de-places-d':
    'Lucratif veut dire qui vise le profit. Aucune nouvelle place n’y serait autorisée, et l’argent irait vers les structures publiques.',
  'melenchon-education-renforcer-le-controle-pedagogiqu':
    'Soumettre tous les établissements privés d’enseignement supérieur au contrôle du ministère.',
  'melenchon-environnement-agir-contre-les-consequences-des':
    'Un transfert de technologie, c’est céder un savoir-faire à un autre pays. S’y ajouteraient des versements et des équipements.',
  'melenchon-environnement-atteindre-le-tres-bon-etat-ecolo':
    'Une réserve souterraine, ou nappe, est l’eau retenue dans le sous-sol. L’objectif porte sur sa qualité comme sur celle des eaux de surface.',
  'melenchon-agriculture-determiner-de-nouvelles-normes-p':
    'Fixer de nouvelles règles d’élevage : accès à l’extérieur, pâturage, nombre d’animaux et surface minimale par bête.',
  'melenchon-agriculture-instaurer-un-moratoire-sur-les-e':
    'Un moratoire est une suspension provisoire. Les céphalopodes sont les poulpes, seiches et calmars : leur élevage serait proscrit d’emblée.',
  'melenchon-logement-lancer-un-plan-d-urgence-de-prev':
    'Éradiquer, c’est faire disparaître complètement. Des équipes créées par les collectivités seraient chargées de ces insectes.',
  'melenchon-logement-requisitionner-les-logements-vid':
    'L’État pourrait prendre les logements laissés vides pour les remettre en location, une fois rendus décents.',
  'melenchon-transports-lancer-des-grands-travaux-de-ren':
    'Rénover le réseau ferré et rouvrir les lignes et les gares fermées depuis trente ans.',
  'melenchon-transports-repenser-la-mobilite-individuell':
    'Une mobilité douce est un déplacement sans moteur. Il s’agit d’encourager le covoiturage, l’autopartage et les trajets à bicyclette.',
  'melenchon-securite-garantir-des-sessions-de-formati':
    'Un juge nommé dans un département d’Outre-mer dont il n’est pas issu suivrait des cours sur son passé, sa géographie et ses questions propres.',
  'melenchon-securite-interdire-la-publicite-pour-les-':
    'Un agrément est l’autorisation d’exercer délivrée par l’État. Une société de paris qui continuerait à faire de la réclame la perdrait.',
  'melenchon-immigration-garantir-le-droit-du-sol-integra':
    'Le droit du sol accorde la nationalité en raison du lieu de naissance. Il vaudrait partout et sans condition, et devenir français serait plus simple.',
  'melenchon-immigration-instituer-la-carte-de-sejour-de-':
    'Régulariser, c’est donner des papiers à une personne qui vit ici sans en avoir. Le permis de dix ans deviendrait la règle plutôt que l’exception.',
  'melenchon-defense-agir-pour-l-adoption-a-l-onu-d-u':
    'Une multinationale est une société implantée dans plusieurs pays. Un texte mondial l’obligerait à des règles de travail et de protection de la nature.',
  'melenchon-defense-renforcer-l-aide-au-developpemen':
    'Le Sahel est la bande de pays qui borde le sud du Sahara. Les versements y augmenteraient, mais cesseraient en cas de manquement.',
  'melenchon-institutions-reconnaitre-le-vote-blanc-mettre':
    'Compter le vote blanc, rendre le vote obligatoire, et exiger un minimum de votes exprimés pour qu’une élection soit valable.',
  'melenchon-institutions-rendre-obligatoire-le-recours-au':
    'Toute réécriture de la loi fondamentale, ou tout nouvel accord signé avec l’Union, devrait passer par un vote de tous les citoyens.',
  // --- Marine Le Pen -----------------------------------------------------------
  'lepen-economie-autoriser-l-etat-a-intervenir-da':
    'Un indice est un repère chiffré qui sert de base au calcul d’un tarif. La puissance publique pèserait sur sa construction dans quelques secteurs.',
  'lepen-economie-creer-sous-l-egide-de-la-caisse-':
    'Un fonds souverain est une réserve d’argent gérée par la puissance publique pour investir. Celui-ci se constituerait sur l’épargne des Français.',
  'lepen-economie-flecher-prioritairement-les-effo':
    'Les baisses d’impôts, les aides et les commandes de l’État iraient d’abord aux entreprises et aux foyers français.',
  'lepen-numerique-taxer-l-utilisation-des-reseaux-':
    'Faire payer aux géants du numérique l’usage qu’ils font des réseaux, pour un rendement annoncé de 550 millions d’euros en 2026.',
  'lepen-emploi-appliquer-a-competence-egale-une':
    'À qualification identique, un candidat français passerait devant. Les profils venus d’ailleurs et introuvables ici resteraient recrutables.',
  'lepen-emploi-stabiliser-la-legislation-sur-le':
    'Ne plus modifier les règles sur le temps de travail, et conserver les avantages fiscaux des heures supplémentaires.',
  'lepen-retraites-alleger-les-dispositifs-de-cumul':
    'Faciliter la poursuite d’activité des médecins et des infirmiers déjà retraités.',
  'lepen-retraites-indexer-l-age-d-ouverture-des-dr':
    'Plus on a commencé à travailler tôt, plus on partirait tôt : le moment du départ et le nombre de trimestres exigés suivraient l’entrée dans la vie active.',
  'lepen-sante-le-modele-de-l-hopital-de-valenc':
    'Étendre à tous les hôpitaux une organisation où les postes administratifs ne dépassent pas 10 % des effectifs.',
  'lepen-sante-mettre-en-place-des-2026-une-pro':
    'Une complémentaire prend en charge ce que la Sécurité sociale ne rembourse pas. Le personnel des hôpitaux publics en obtiendrait une.',
  'lepen-solidarites-controler-l-existence-des-benefi':
    'Vérifier que les personnes qui touchent une aide sont toujours en vie, surtout quand elles habitent hors de France.',
  'lepen-solidarites-suspendre-les-allocations-famili':
    'Couper les allocations familiales des parents dont l’enfant mineur récidive dans la délinquance.',
  'lepen-education-donner-dans-l-enseignement-prima':
    'À l’école élémentaire, ces trois matières passeraient avant toutes les autres dans l’emploi du temps.',
  'lepen-education-experimenter-un-service-national':
    'Un service national facultatif consacré à l’entretien des monuments et des espaces naturels.',
  'lepen-environnement-laisser-les-parcs-eoliens-actuel':
    'Ne plus prolonger les parcs éoliens existants, et démonter ceux qui abîment un paysage ou un monument.',
  'lepen-environnement-prolonger-et-optimiser-les-react':
    'Un EPR2 est un réacteur nucléaire de nouvelle génération ; les SMR sont de petits réacteurs modulaires, assemblés en usine.',
  'lepen-agriculture-annuler-la-baisse-de-500-million':
    'Une mission désigne un bloc du budget de l’État. Celle consacrée aux campagnes garderait la somme qu’il était prévu de lui retirer.',
  'lepen-agriculture-defendre-une-exception-agricultu':
    'Le libre-échange supprime droits de douane et quotas entre pays signataires. Les produits des fermes en seraient tenus à l’écart.',
  'lepen-logement-instaurer-dans-l-acces-au-logeme':
    'L’attribution d’un logement social donnerait la priorité aux Français, puis tiendrait compte du métier exercé.',
  'lepen-logement-remplacer-maprimerenov-par-un-di':
    'MaPrimeRénov’ est l’aide de l’État pour les travaux d’isolation et de chauffage. Elle céderait la place à un autre système, moins onéreux.',
  'lepen-transports-investir-dans-les-infrastructure':
    'Investir partout dans les réseaux numériques et les transports, avec notamment de nouvelles sorties d’autoroute.',
  'lepen-transports-supprimer-les-zones-a-faibles-em':
    'Ces zones interdisent aux véhicules les plus polluants de rouler dans certaines agglomérations. Elles seraient abolies.',
  'lepen-securite-identifier-des-lieux-pouvant-etr':
    'Repérer des bâtiments transformables en prisons allégées, pour les mineurs et les courtes peines.',
  'lepen-securite-mettre-en-place-des-peines-planc':
    'Une peine plancher est un minimum sous lequel le juge ne peut pas descendre. Elle viserait les repris de justice et les agressions d’agents publics.',
  'lepen-immigration-mettre-fin-a-l-accord-franco-alg':
    'Ce texte fixe aux Algériens des règles propres pour venir, travailler et s’installer, distinctes du droit commun. Il serait dénoncé.',
  'lepen-immigration-negocier-avec-les-partenaires-eu':
    'L’espace Schengen permet de passer d’un pays à l’autre sans contrôle aux frontières. Il serait fermé aux personnes venues d’ailleurs.',
  'lepen-defense-faire-de-la-lutte-contre-les-ing':
    'Une ingérence, c’est l’intervention d’une puissance extérieure dans les affaires du pays. Espionnage et diplomatie en feraient leur cible.',
  'lepen-defense-renforcer-les-controles-sur-les-':
    'Un fonds souverain est une réserve d’argent public destinée à investir. Il servirait à empêcher qu’une activité sensible passe à des mains étrangères.',
  'lepen-institutions-inscrire-dans-la-constitution-un':
    'Un référendum d’initiative citoyenne permet aux électeurs eux-mêmes de provoquer un vote sur un texte. Ce droit serait gravé dans la loi fondamentale.',
  'lepen-institutions-supprimer-une-large-partie-des-a':
    'Supprimer une grande partie des agences et autorités indépendantes, et rendre leurs missions à l’administration.',
  // --- Marine Tondelier --------------------------------------------------------
  'tondelier-economie-mettre-en-place-une-taxe-zucman-':
    'Un impôt annuel de 2 % sur la part d’un patrimoine qui dépasse 100 millions d’euros.',
  'tondelier-economie-taxation-supplementaire-de-10-de':
    'Les transmissions familiales dépassant ce montant supporteraient un impôt en plus, soit seulement le centième le plus riche.',
  'tondelier-numerique-faire-respecter-des-criteres-de-':
    'Les grands réseaux sociaux devraient rendre leurs algorithmes neutres, et couper les fils personnalisés pendant les campagnes électorales.',
  'tondelier-emploi-augmentation-du-smic-montant-non':
    'Le salaire minimum serait relevé, et les petites paies suivraient automatiquement la hausse des prix.',
  'tondelier-emploi-augmenter-les-salaires-des-ensei':
    'La rémunération des professeurs progresserait de quinze pour cent, la hausse étant répartie sur cinq années.',
  'tondelier-emploi-conge-paye-climatique-de-cinq-jo':
    'Les salariés disposeraient chaque année de jours rémunérés en plus, à prendre lors des épisodes de forte chaleur.',
  'tondelier-emploi-passer-le-salaire-minimum-a-2-00':
    'Le brut est le montant avant retenue des cotisations : ce que touche vraiment l’employé est inférieur. Ce plancher légal serait relevé.',
  'tondelier-retraites-retraite-a-60-ans-pour-les-salar':
    'Ceux entrés tôt dans la vie active ou dans un métier usant s’arrêteraient à 60 ans ; l’âge minimum serait de 62 ans pour tous les autres.',
  'tondelier-sante-creer-2-000-nouveaux-centres-de-':
    'Un centre de santé emploie des soignants salariés, sans dépassement d’honoraires. Deux mille ouvriraient, surtout loin des villes.',
  'tondelier-sante-interdiction-des-aliments-ultrat':
    'Les plats très industriels, riches en additifs, seraient bannis des repas scolaires, et les spots pour sucreries ne passeraient qu’en soirée.',
  'tondelier-solidarites-interdiction-du-secteur-lucratif':
    'Seuls des organismes publics ou à but non lucratif accueilleraient les enfants placés, suivis par l’ASE (aide sociale à l’enfance) jusqu’à 25 ans.',
  'tondelier-solidarites-securite-sociale-ecologique-dont':
    'La sécurité sociale de l’alimentation désigne une somme mensuelle versée à tous pour acheter des produits agréés, financée par des cotisations.',
  'tondelier-education-creation-d-un-ministere-de-l-enf':
    'Un seul ministère réunirait l’école, la jeunesse et les politiques pour les enfants, avec ses propres crédits.',
  'tondelier-education-reduire-la-taille-des-classes-de':
    'Pas plus de 19 élèves par classe en primaire d’ici 2032, et 12 dans les écoles les plus défavorisées.',
  'tondelier-environnement-modifier-la-ppe3-pour-que-la-par':
    'Porter à 44 % la part des renouvelables dans l’électricité consommée en 2030, en modifiant la feuille de route énergétique.',
  'tondelier-environnement-planifier-la-sortie-du-nucleaire':
    'Les projets de nouveaux réacteurs, grands (EPR-2) ou petits et modulaires (SMR), seraient abandonnés et les centrales fermées peu à peu.',
  'tondelier-agriculture-interdiction-aux-tres-gros-chalu':
    'Les plus grands navires de pêche industrielle ne pourraient plus travailler près du littoral, et les petits pêcheurs seraient aidés.',
  'tondelier-agriculture-planifier-une-sortie-progressive':
    'Arrêter progressivement les pesticides chimiques et les engrais azotés, d’ici 2050.',
  'tondelier-logement-atteindre-500-000-renovations-pe':
    'La précarité énergétique, c’est ne pas pouvoir se chauffer correctement faute de moyens. Un demi-million de logements seraient rénovés par an.',
  'tondelier-logement-generaliser-ameliorer-et-perenni':
    'Rendre permanent et étendre à tout le pays le plafonnement des loyers.',
  'tondelier-logement-limitation-du-nombre-d-autorisat':
    'Les communes délivreraient moins de permis pour louer des appartements aux vacanciers, sur des plateformes en ligne par exemple.',
  'tondelier-transports-creer-une-offre-de-location-soci':
    'Un million de voitures électriques proposées en location à tarif social sur cinq ans, en privilégiant les modèles européens.',
  'tondelier-securite-creer-9-000-postes-de-magistrats':
    'Un greffier consigne ce qui se dit à l’audience et tient les dossiers ; un attaché de justice seconde le juge. Ces effectifs augmenteraient tous.',
  'tondelier-securite-imprescriptibilite-de-tous-les-c':
    'Les crimes contre les enfants pourraient être jugés sans limite de temps, et un fichier servirait à prévenir les abus.',
  'tondelier-immigration-regularisation-des-travailleurs-':
    'Les étrangers en situation irrégulière qui ont un emploi obtiendraient des papiers valables plusieurs années, prolongés sans démarche.',
  'tondelier-immigration-regulariser-les-travailleurs-les':
    'Régulariser travailleurs, étudiants et parents d’élèves selon des critères fixes : durée de présence, liens familiaux et activité professionnelle.',
  'tondelier-defense-creation-d-un-haut-conseil-milit':
    'Les chefs militaires des pays européens disposeraient d’une instance commune, placée sous l’autorité des dirigeants de l’Union.',
  'tondelier-defense-creer-un-commandement-militaire-':
    'Un état-major européen commun, placé sous l’autorité des États membres, qui ne pourrait pas engager seul les armées nationales.',
  'tondelier-institutions-instauration-d-une-premiere-repu':
    'Une nouvelle Constitution remplacerait l’actuelle, avec un chef de l’État moins puissant et une place pour l’environnement et les citoyens.',
  'tondelier-institutions-instaurer-la-proportionnelle-int':
    'Élire les députés à la proportionnelle par région, sans sièges bonus pour le vainqueur, et réduire ce bonus à 25 % aux municipales.',
  // --- Raphaël Glucksmann ------------------------------------------------------
  'glucksmann-economie-donner-aux-territoires-notamment':
    'Entrer au capital, c’est acheter des parts d’une société et siéger parmi ses propriétaires. Les collectivités pourraient le faire.',
  'glucksmann-economie-flecher-une-part-des-revenus-de-':
    'L’octroi de mer est la taxe perçue sur les marchandises entrant en Outre-mer. Une fraction garantie de son produit irait aux équipements locaux.',
  'glucksmann-economie-taxe-sur-les-superprofits-des-mu':
    'Les grandes compagnies d’hydrocarbures paieraient un impôt spécial sur leurs gains exceptionnels, par exemple lors d’une flambée des prix.',
  'glucksmann-numerique-combattre-les-algorithmes-toxiqu':
    'Un algorithme est la recette qui décide de l’ordre des publications affichées. Les plateformes devraient l’encadrer dès la fabrication du service.',
  'glucksmann-numerique-contrecarrer-les-monopoles-techn':
    'GAFAM désigne les grandes plateformes américaines (Google, Apple, Facebook, Amazon, Microsoft), BATX leurs équivalentes chinoises.',
  'glucksmann-emploi-cheque-carburant-multiplie-par-t':
    'L’aide versée pour payer l’essence serait triplée, ouverte à plus de foyers et donnée sans démarche aux ménages déjà aidés pour l’énergie.',
  'glucksmann-emploi-hausse-de-la-remuneration-nette-':
    'Les plus grosses successions paieraient davantage, et cet argent servirait à augmenter la paie nette des salariés.',
  'glucksmann-retraites-abrogation-de-la-reforme-des-ret':
    'Le report de l’âge minimum décidé en 2023 serait annulé, et les métiers usants ouvriraient davantage de droits.',
  'glucksmann-retraites-depart-plus-tot-pour-les-carrier':
    'L’âge de fin d’activité varierait selon l’usure : plus tôt pour les métiers durs et les parcours morcelés, plus tard pour les autres.',
  'glucksmann-sante-assurer-la-contraception-gratuit':
    'Les protections périodiques sont les serviettes, tampons et coupes menstruelles. Elles seraient prises en charge, comme les moyens d’éviter une grossesse.',
  'glucksmann-sante-generaliser-le-pass-sport-sante-':
    'Ce dispositif aide à payer la pratique d’une activité physique. Il ne serait plus réservé à certaines tranches d’âge, mais ouvert à tous.',
  'glucksmann-solidarites-automatiser-l-acces-aux-droits-s':
    'Les aides seraient versées sans qu’on ait à les demander : un fichier commun aux administrations suffirait à les déclencher.',
  'glucksmann-solidarites-rendre-l-accessibilite-universel':
    'Un handicap sensoriel touche la vue ou l’ouïe, un handicap cognitif la mémoire ou l’attention. L’adaptation des lieux les viserait tous.',
  'glucksmann-education-hausse-de-10-du-salaire-de-tous-':
    'Tous les professeurs gagneraient un dixième de plus, puis davantage avec l’ancienneté, surtout en maternelle et en élémentaire.',
  'glucksmann-education-plan-de-5-ans-pour-l-ecole-baiss':
    'Pendant cinq ans, les classes élémentaires compteraient moins d’enfants, et les bâtiments scolaires seraient remis en état.',
  'glucksmann-education-relance-des-colonies-de-vacances':
    'Tout enfant pourrait partir au moins une fois en groupe, encadré par des animateurs, pendant les congés scolaires.',
  'glucksmann-education-service-civique-obligatoire-de-d':
    'Chaque jeune consacrerait près d’une année à une mission d’intérêt général, dans une association ou un service public.',
  'glucksmann-environnement-10-milliards-d-euros-pour-un-lea':
    'L’État aiderait les ménages modestes à louer une voiture électrique pour une mensualité réduite.',
  'glucksmann-environnement-deployer-des-conventions-citoyen':
    'Réunir dans chaque région des citoyens tirés au sort, et des assemblées locales, pour décider des mesures climatiques.',
  'glucksmann-agriculture-garantir-le-revenu-des-agriculte':
    'Un prix plancher est un minimum d’achat sous lequel nul ne peut descendre. Il serait fixé assez haut pour faire vivre celui qui produit.',
  'glucksmann-agriculture-instaurer-un-revenu-de-transitio':
    'Une somme versée le temps du changement de méthode, pour que se convertir au biologique ne prive pas de ressources ceux qui s’y engagent.',
  'glucksmann-logement-retablir-l-obligation-d-accessib':
    'Le BTP est le secteur du bâtiment et des travaux publics. L’accessibilité universelle vise des logements utilisables par les personnes handicapées.',
  'glucksmann-transports-relancer-les-trains-de-nuit-acce':
    'Rouvrir des trajets où l’on dort à bord, hâter les chantiers de voies rapides, et mieux relier entre eux les réseaux ferrés du continent.',
  'glucksmann-transports-rendre-l-accessibilite-universel':
    'Rendre bus, métros et gares utilisables par tous, quel que soit le handicap, pour n’être empêché ni de travailler ni de se soigner.',
  'glucksmann-securite-deployer-massivement-la-justice-':
    'La justice restaurative fait dialoguer l’auteur et la victime ; le travail d’intérêt général est une peine effectuée gratuitement pour la collectivité.',
  'glucksmann-immigration-creer-une-force-europeenne-de-sa':
    'Des navires financés par plusieurs pays iraient au secours des bateaux en perdition, avec l’obligation d’intervenir inscrite dans les textes.',
  'glucksmann-immigration-organisation-d-une-convention-ci':
    'Des citoyens tirés au sort débattraient de la politique migratoire et feraient des propositions au gouvernement.',
  'glucksmann-defense-grand-emprunt-europeen-au-servic':
    'Les pays de l’Union lèveraient ensemble de l’argent sur les marchés pour réduire leur dépendance vis-à-vis de l’étranger.',
  'glucksmann-defense-suppression-du-droit-de-veto-au-':
    'Un seul pays ne pourrait plus bloquer une décision européenne : un vote à la majorité suffirait dans tous les domaines.',
  'glucksmann-institutions-renouer-avec-l-esprit-des-accord':
    'Les accords de Nouméa organisent le transfert progressif de compétences de l’État vers la Nouvelle-Calédonie. On repartirait de leur méthode.',
  // --- Xavier Bertrand ---------------------------------------------------------
  'bertrand-economie-mettre-fin-aux-differences-de-jo':
    'Aligner le nombre de jours d’arrêt maladie non payés entre les fonctionnaires et les salariés du privé.',
  'bertrand-economie-relever-le-prelevement-forfaitai':
    'Augmenter le taux d’imposition unique qui s’applique aux revenus de l’épargne et des placements.',
  'bertrand-retraites-developper-la-retraite-par-capit':
    'Développer les retraites financées par un capital placé, en complément des cotisations versées par les actifs.',
  'bertrand-sante-adopter-une-loi-pluriannuelle-de':
    'Fixer le budget de la santé sur plusieurs années par une loi, au lieu de le rediscuter chaque année.',
  'bertrand-sante-creation-d-un-chu-en-corse-adapt':
    'Un CHU (centre hospitalier universitaire) soigne, forme les médecins et mène des recherches : il en serait ouvert un sur l’île.',
  'bertrand-sante-creer-en-corse-un-centre-hospita':
    'Doter la Corse d’un centre hospitalier universitaire réparti sur plusieurs sites, monté avec des partenaires privés.',
  'bertrand-education-consacrer-1-du-budget-de-l-etat-':
    'D’ici 2032, un centième des dépenses publiques nationales irait aux arts, au patrimoine et aux activités culturelles.',
  'bertrand-education-developper-le-mecenat-culturel-e':
    'Le mécénat, c’est le soutien d’une entreprise ou d’un particulier à une œuvre. Il viendrait s’ajouter à l’argent de l’État.',
  'bertrand-education-faire-en-sorte-que-chaque-eleve-':
    'Au cours de ses années d’études, tout enfant assisterait au moins une fois à une représentation ou découvrirait une création artistique.',
  'bertrand-education-soutenir-le-developpement-des-la':
    'Une langue régionale est un parler propre à un territoire, comme le breton ou l’occitan. Leur usage serait encouragé.',
  'bertrand-agriculture-supprimer-les-surtranspositions-':
    'Cesser d’imposer à l’agriculture française des règles plus strictes que celles décidées au niveau européen.',
  'bertrand-securite-instaurer-des-peines-minimales-p':
    'Fixer une peine plancher, sous laquelle un juge ne pourrait pas descendre, pour les agressions d’élus et de forces de secours.',
  'bertrand-securite-telesurveillance-et-drones-pour-':
    'Caméras et appareils volants surveilleraient les forêts pour repérer vite un incendie, et ceux qui l’allument seraient lourdement punis.',
  'bertrand-defense-proposer-avec-le-danemark-un-par':
    'Le Groenland est un territoire autonome rattaché au Danemark, mais hors de l’Union. Les liens entre les deux seraient resserrés.',
  'bertrand-defense-saisir-la-cour-de-justice-de-l-u':
    'Attaquer l’accord commercial avec le Mercosur devant la justice européenne s’il entre en vigueur.',
  'bertrand-institutions-republique-des-territoires-etat-':
    'L’État national garderait la police, la justice, les frontières, l’armée et la diplomatie ; les autres missions iraient aux collectivités.',
  'bertrand-institutions-accorder-a-la-corse-une-autonomi':
    'L’autonomie législative permettrait à l’île d’écrire elle-même certaines de ses règles, dans des limites fixées d’avance.',
  'bertrand-institutions-donner-un-cadre-pluriannuel-a-l-':
    'La continuité territoriale finance les liaisons entre l’île et le continent. Son budget serait arrêté pour plusieurs années au lieu d’une seule.',
  'bertrand-institutions-favorable-a-l-autonomie-de-la-co':
    'L’île disposerait de pouvoirs propres plus larges, mais seulement si ses habitants l’approuvent par un vote.',
  'bertrand-institutions-fusionner-une-partie-des-mandats':
    'Un même élu siégerait à la fois au département et à la région, ce qui supprimerait quatre sièges sur dix.',
  'bertrand-institutions-permettre-l-adaptation-des-lois-':
    'Une même règle nationale pourrait s’appliquer différemment selon les particularités d’un endroit.',
  'bertrand-institutions-s-il-est-elu-n-exercer-qu-un-seu':
    'Le président élu renoncerait à se représenter à la fin de ses cinq ans.',
  'bertrand-institutions-soumettre-l-autonomie-de-la-cors':
    'Un référendum est un vote direct sur une question posée. Ce sont les Corses eux-mêmes qui trancheraient sur leur statut.',
  'bertrand-institutions-transferer-aux-territoires-la-re':
    'Ce ne serait plus l’État mais les collectivités locales qui décideraient en matière de toit et de soins.',
};
