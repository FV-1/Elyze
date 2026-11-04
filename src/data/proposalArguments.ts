// Ce qu'en disent les partisans, ce qu'en disent les opposants.
//
// CE QUE CE FICHIER FAIT, ET SURTOUT CE QU'IL NE FAIT PAS
//
// Il ne dit pas si une mesure est bonne. Il rapporte le débat qu'elle
// suscite : l'argument principal avancé par ceux qui la défendent, celui
// avancé par ceux qui s'y opposent. C'est une position tenable — résumer une
// controverse existante — là où « points positifs / points négatifs » aurait
// engagé l'app à prédire des effets que personne ne connaît. Une app de
// comparaison électorale qui trancherait à la place du lecteur ne vaudrait
// plus rien.
//
// Cinq règles, dont trois sont vérifiées par node scripts/check-data.js :
//
//  1. LES DEUX CÔTÉS, TOUJOURS. Une mesure sans son objection ferait pencher
//     l'app. Le contrôle refuse un argument isolé. [vérifié]
//
//  2. AUCUN NOM DE CANDIDAT. Le paquet est aveugle : nommer quelqu'un
//     révélerait l'auteur de la carte qu'on est en train de juger. [vérifié]
//
//  3. LONGUEURS COMPARABLES. Un « pour » de dix mots face à un « contre » de
//     quarante est un jugement déguisé. Plafond commun. [vérifié]
//
//  4. DES ARGUMENTS RÉELLEMENT AVANCÉS, pas inventés pour faire nombre. Quand
//     l'objection principale est technique (« inapplicable sans rouvrir tel
//     traité »), c'est celle-là qu'on donne, pas une objection de principe
//     plus commode.
//
//  5. AUCUN ADJECTIF ÉVALUATIF de la part de l'app. On écrit « ses opposants
//     avancent que », jamais « malheureusement » ni « à juste titre ».
//
// L'écran présente ces textes derrière un bouton, jamais sur la carte
// elle-même : le swipe doit rester rapide, et lire les arguments doit être un
// choix. Voir components/ProposalDebateDialog.tsx.

export type ProposalDebate = {
  // Ce qu'avancent ceux qui défendent la mesure.
  pour: string;
  // Ce qu'objectent ceux qui s'y opposent.
  contre: string;
};

export const PROPOSAL_ARGUMENTS: Record<string, ProposalDebate> = {
  // --- Bernard Cazeneuve -----------------------------------------------------
  'cazeneuve-economie-baisse-des-impots-de-production-': {
    pour:
      'Taxer l’activité avant le bénéfice pénalise l’industrie française face à ses voisines : alléger cette charge aide à produire en France.',
    contre:
      'Les aides fiscales supprimées en contrepartie profitent souvent aux mêmes entreprises : le gain net pour elles pourrait être faible.',
  },
  'cazeneuve-economie-instaurer-une-fiscalite-ciblant-': {
    pour:
      'Les revenus du capital sont aujourd\'hui moins taxés que ceux du travail : rééquilibrer rapporterait sans peser sur les salaires.',
    contre:
      'Les grands patrimoines sont mobiles. Si les plus gros contribuables s\'installent ailleurs, le rendement attendu s\'effondre.',
  },
  'cazeneuve-economie-mettre-en-place-un-plan-sur-dix-': {
    pour:
      'C\'est la visibilité qui manque aux industriels : les à-coups fiscaux découragent des projets qui s\'amortissent sur quinze ans.',
    contre:
      'Un plan d\'État choisit les filières à la place du marché, et l\'argent public peut se figer sur des secteurs déjà dépassés.',
  },
  'cazeneuve-economie-remplacer-l-exigence-d-equilibre': {
    pour:
      'La règle annuelle force à couper pendant les récessions, au pire moment. Lisser sur un cycle évite cette austérité automatique.',
    contre:
      'Repousser l\'équilibre revient souvent à ne jamais l\'atteindre, et la dette sociale finit payée par les générations suivantes.',
  },
  'cazeneuve-numerique-donner-force-de-loi-a-l-evaluati': {
    pour:
      'Les systèmes les plus puissants sont déployés sans qu\'aucune autorité ne puisse les examiner avant leur mise sur le marché.',
    contre:
      'Un examen préalable retarde l\'arrivée des services en Europe et suppose une expertise que peu d\'agences possèdent.',
  },
  'cazeneuve-numerique-stocker-les-donnees-des-francais': {
    pour:
      'Des lois étrangères permettent à des autorités d\'accéder aux données détenues par leurs entreprises, où qu\'elles soient stockées.',
    contre:
      'L\'offre européenne reste limitée : imposer une localisation renchérit le service et retarde certains projets publics.',
  },
  'cazeneuve-emploi-generaliser-l-apprentissage-des-': {
    pour:
      'Trop de jeunes enchaînent stages et contrats courts pendant des années : ramener le CDI comme norme raccourcit cette période d\'attente.',
    contre:
      'Imposer le CDI pousse les employeurs à embaucher moins, faute de pouvoir se séparer d\'un salarié qui ne convient pas.',
  },
  'cazeneuve-emploi-resorption-des-ecarts-de-salaire': {
    pour:
      'À poste égal, des écarts de paie subsistent, et ils se prolongent à la retraite : les corriger relève de l’égalité de traitement.',
    contre:
      'La mesure ne dit ni comment ni avec quel financement : relever ces pensions coûte cher à un système déjà en déficit.',
  },
  'cazeneuve-retraites-allongement-de-la-duree-de-cotis': {
    pour:
      'Jouer sur la durée plutôt que sur l’âge ménage ceux qui ont commencé tôt, et la négociation facilite l’acceptation.',
    contre:
      'Allonger la durée exigée pénalise ceux qui entrent tard sur le marché du travail ou ont des carrières hachées.',
  },
  'cazeneuve-retraites-retablir-le-droit-a-un-depart-an': {
    pour:
      'Certains métiers usent le corps au point de réduire l\'espérance de vie : partir plus tôt y rétablit une égalité réelle.',
    contre:
      'Définir la pénibilité par une liste de critères revient à en oublier d\'autres, et ouvre un contentieux sans fin.',
  },
  'cazeneuve-sante-faire-de-la-prise-en-charge-des-': {
    pour:
      'Les troubles psychiques touchent un adulte sur cinq et sont repérés tard, faute de formation des adultes qui côtoient les jeunes.',
    contre:
      'Le label de grande cause nationale n\'apporte pas de moyens, alors que le manque de pédopsychiatres est le vrai goulot.',
  },
  'cazeneuve-sante-prise-en-charge-du-grand-age-de-': {
    pour:
      'Le nombre de personnes âgées dépendantes va fortement augmenter, et le coût d’un établissement dépasse souvent la pension.',
    contre:
      'La mesure ne chiffre pas son coût, alors que financer la dépendance suppose des milliards supplémentaires chaque année.',
  },
  'cazeneuve-solidarites-accorder-une-aide-supplementaire': {
    pour:
      'Les deux premières années sont celles où l\'on décroche le plus, souvent pour des raisons matérielles plutôt que scolaires.',
    contre:
      'L\'aide ne traite pas la dépense principale, le logement, dont le coût dépasse largement ce montant dans les villes universitaires.',
  },
  'cazeneuve-solidarites-creer-une-avance-jeunesse-de-tro': {
    pour:
      'Les 18-24 ans sans diplôme ni emploi n\'ont droit à presque rien : cette avance comble un trou de la protection sociale.',
    contre:
      'Verser une somme sans accompagnement change rarement la situation, et le dispositif se superposerait au contrat d\'engagement jeune.',
  },
  'cazeneuve-solidarites-simplification-unification-et-au': {
    pour:
      'Beaucoup de personnes éligibles ne demandent pas leurs aides : un versement automatique réduit ce non-recours.',
    contre:
      'Unifier des aides aux règles différentes crée des perdants, et le versement automatique suppose des données fiables.',
  },
  'cazeneuve-education-au-moins-2-000-d-aide-supplement': {
    pour:
      'L’échec en première année touche surtout les étudiants modestes, souvent obligés de travailler à côté de leurs études.',
    contre:
      'Une aide limitée aux deux premières années ne règle pas la précarité de ceux qui poursuivent plus longtemps.',
  },
  'cazeneuve-education-former-massivement-les-enseignan': {
    pour:
      'Les élèves utilisent déjà ces outils : sans formation, l\'écart se creuse entre ce qu\'enseignent les professeurs et ce qui se passe en classe.',
    contre:
      'Le numérique éducatif a déjà englouti des budgets sans effet mesuré sur les apprentissages.',
  },
  'cazeneuve-education-lancer-un-plan-ecole-climat-soli': {
    pour:
      'Des milliers d\'écoles sont des passoires thermiques, invivables l\'été et coûteuses l\'hiver : les rénover agit sur les deux.',
    contre:
      'Les bâtiments appartiennent aux communes et aux départements : un plan d\'État suppose un cofinancement rarement au rendez-vous.',
  },
  'cazeneuve-environnement-creer-une-datar-du-climat-rattac': {
    pour:
      'L\'adaptation demande une vision de long terme que des ministères remaniés tous les deux ans ne peuvent pas porter.',
    contre:
      'Une structure de coordination de plus ne remplace pas les moyens d\'agir, qui restent dans les ministères.',
  },
  'cazeneuve-environnement-filiere-electronucleaire-assumee': {
    pour:
      'Le nucléaire produit une électricité stable et peu émettrice : le planifier avec les renouvelables sécurise l’approvisionnement.',
    contre:
      'Les nouveaux réacteurs coûtent cher et prennent du retard, et la production nucléaire laisse des déchets à long terme.',
  },
  'cazeneuve-agriculture-agriculture-prix-dignes-pour-les': {
    pour:
      'Beaucoup d’agriculteurs vendent à perte et une grande partie partira bientôt à la retraite : il faut revenus et terres pour les remplacer.',
    contre:
      'La mesure ne dit pas comment garantir ces prix, alors que la concurrence européenne et mondiale pèse sur les cours.',
  },
  'cazeneuve-logement-lancer-un-grand-plan-de-construc': {
    pour:
      'L\'offre est insuffisante et le parc mal isolé : traiter les deux dans un même plan évite de construire ce qu\'il faudra rénover.',
    contre:
      'L\'annonce ne dit ni combien de logements ni avec quel financement, alors que le blocage est d\'abord foncier et bancaire.',
  },
  'cazeneuve-logement-renovation-massive-des-logements': {
    pour:
      'Les logements mal isolés pèsent sur les factures des ménages modestes et sur les émissions : les rénover sert les deux.',
    contre:
      'Les programmes de rénovation existants avancent lentement, faute d’artisans et à cause d’un reste à charge élevé.',
  },
  'cazeneuve-transports-developpement-des-transports-col': {
    pour:
      'Sans transports en commun, la voiture devient obligatoire : en développer réduit les dépenses des ménages et les émissions.',
    contre:
      'Dans les zones peu denses, les lignes régulières circulent souvent presque vides et coûtent cher aux collectivités.',
  },
  'cazeneuve-securite-mettre-en-place-une-police-de-pr': {
    pour:
      'Des policiers connus des habitants recueillent l\'information qui permet d\'anticiper, au lieu d\'intervenir après coup.',
    contre:
      'Ces effectifs seront prélevés sur d\'autres missions, et l\'expérience précédente a été abandonnée faute de résultats mesurés.',
  },
  'cazeneuve-defense-developper-une-reserve-citoyenne': {
    pour:
      'Le lien entre la société et son armée s\'est distendu depuis la fin de la conscription, et la réserve le reconstitue.',
    contre:
      'Une réserve élargie demande des cadres d\'active pour l\'encadrer, prélevés sur des unités déjà très sollicitées.',
  },
  'cazeneuve-institutions-engager-une-revue-systematique-d': {
    pour:
      'L\'inflation normative pèse sur les entreprises comme sur les communes : une règle de compensation force à trancher.',
    contre:
      'Compter les normes ne dit rien de leur utilité : on peut en supprimer deux inoffensives pour en créer une très lourde.',
  },
  'cazeneuve-institutions-introduire-une-dose-de-proportio': {
    pour:
      'Des millions d\'électeurs n\'ont aucun député qui les représente : une part de proportionnelle corrige cette distorsion.',
    contre:
      'La proportionnelle rend les majorités plus difficiles à réunir, au risque de l\'instabilité des républiques précédentes.',
  },
  'cazeneuve-institutions-refonder-la-territorialite-de-la': {
    pour:
      'L\'enchevêtrement des compétences fait qu\'aucun échelon n\'est clairement responsable devant l\'électeur.',
    contre:
      'Chaque réforme territoriale a ajouté une strate au lieu d\'en retirer, et celle-ci ne dit pas laquelle disparaîtrait.',
  },
  'cazeneuve-institutions-reformer-le-processus-decisionne': {
    pour:
      'L\'unanimité permet à un seul État de bloquer les vingt-six autres, notamment en politique étrangère et en fiscalité.',
    contre:
      'Renoncer à l\'unanimité, c\'est accepter d\'être mis en minorité sur des sujets qui touchent à la souveraineté.',
  },
  // --- Bruno Retailleau ------------------------------------------------------
  'retailleau-economie-creation-d-un-fonds-france-produ': {
    pour:
      'Les régions connaissent leur tissu industriel : leur confier l’enveloppe rapproche les décisions des entreprises qui investissent.',
    contre:
      'Rapporté à l’ensemble de l’industrie, le montant reste modeste, et le répartir entre régions risque de le disperser en petits projets.',
  },
  'retailleau-economie-redonner-au-moins-30-milliards-d': {
    pour:
      'Baisser en même temps le coût du travail et les prélèvements sur les salaires soutient l\'emploi et le pouvoir d\'achat.',
    contre:
      'Trente milliards de recettes en moins doivent être trouvés ailleurs, et la mesure ne dit pas dans quel budget.',
  },
  'retailleau-economie-report-automatique-de-l-exigibil': {
    pour:
      'Payer ces droits au moment de la transmission oblige parfois à vendre une partie de l’entreprise : différer l’impôt la garde intacte.',
    contre:
      'Un paiement repoussé sans terme fixe peut devenir une exonération de fait, au bénéfice des héritiers d’entreprises très valorisées.',
  },
  'retailleau-economie-supprimer-toutes-les-cotisations': {
    pour:
      'Au-delà du seuil, chaque heure rapporte nettement plus au salarié sans rien coûter de plus à l\'employeur.',
    contre:
      'Les cotisations financent retraites et assurance maladie : les supprimer sur une part du travail creuse un trou à combler.',
  },
  'retailleau-emploi-baisse-des-cotisations-de-30-mil': {
    pour:
      'Le coût du travail est élevé en France : baisser les cotisations augmente le salaire net et encourage les embauches.',
    contre:
      'Ces cotisations financent la protection sociale : les réduire impose de trouver ailleurs trente milliards chaque année.',
  },
  'retailleau-emploi-code-du-travail-refonde-sur-un-s': {
    pour:
      'Des règles négociées au plus près du terrain s’adaptent mieux aux réalités de chaque secteur qu’un code uniforme.',
    contre:
      'Dans les petites entreprises, le salarié pèse peu dans la négociation : renvoyer à l’accord local peut réduire ses protections.',
  },
  'retailleau-retraites-apres-l-age-legal-plus-aucune-co': {
    pour:
      'Prolonger son activité deviendrait plus rentable, ce qui aide les entreprises à garder l’expérience et les savoir-faire des seniors.',
    contre:
      'Ces retraités cesseraient de contribuer au système qui paie leur pension, ce qui réduit ses recettes au moment où il manque.',
  },
  'retailleau-retraites-creation-d-un-etage-de-retraite-': {
    pour:
      'Compléter la répartition par l’épargne diversifie les ressources des futurs retraités face au vieillissement de la population.',
    contre:
      'Seuls ceux qui ont les moyens d’épargner en profiteraient, et le montant obtenu dépendrait des marchés financiers.',
  },
  'retailleau-solidarites-compte-social-unique-total-des-a': {
    pour:
      'Le travail doit toujours rapporter plus que les aides : plafonner leur cumul renforce l’incitation à reprendre un emploi.',
    contre:
      'Le plafond pénaliserait les familles nombreuses et les plus précaires, dont les besoins dépassent ce montant.',
  },
  'retailleau-solidarites-conge-de-naissance-facultatif-et': {
    pour:
      'Un congé mieux payé et plus long permet de s’occuper de l’enfant sans renoncer à presque tout revenu.',
    contre:
      'Rendu facultatif, ce congé reste surtout pris par les mères, ce qui peut freiner leur carrière, et son coût est élevé.',
  },
  'retailleau-solidarites-creer-un-revenu-d-incitation-a-l': {
    pour:
      'Trois aides distinctes créent des seuils où reprendre un travail fait perdre plus qu\'il ne rapporte : une allocation unique les supprime.',
    contre:
      'Fusionner trois dispositifs aux règles différentes fait toujours des perdants, rarement identifiés avant la réforme.',
  },
  'retailleau-solidarites-fusionner-12-dispositifs-d-aide-': {
    pour:
      'Douze dispositifs se recoupent et personne ne sait à quoi il a droit : un montant unique dès le premier enfant est lisible.',
    contre:
      'Un montant identique pour tous supprime la modulation selon les revenus, au détriment des familles les plus modestes.',
  },
  'retailleau-education-doubler-le-nombre-d-ingenieurs-s': {
    pour:
      'Le pays forme trop peu d\'ingénieurs dans ces domaines, et les entreprises recrutent à l\'étranger faute de candidats.',
    contre:
      'Doubler les diplômés suppose des enseignants-chercheurs qu\'on ne forme pas en cinq ans, et une demande qui suive.',
  },
  'retailleau-education-examen-d-entree-en-sixieme-deter': {
    pour:
      'Regrouper les élèves par niveau permet d’adapter l’enseignement et d’aider plus vite ceux qui ont des lacunes.',
    contre:
      'Classer les élèves dès onze ans risque de figer les inégalités, les groupes faibles ayant du mal à rattraper les autres.',
  },
  'retailleau-environnement-abroger-le-volet-electricite-de-': {
    pour:
      'La programmation actuelle impose un rythme de renouvelables jugé coûteux et déconnecté des besoins réels du réseau.',
    contre:
      'Abroger sans remplacer laisse la filière sans visibilité et bloque des investissements déjà engagés.',
  },
  'retailleau-environnement-fixer-d-emblee-a-80-ans-l-horizo': {
    pour:
      'Prolonger les réacteurs existants fournit une électricité peu chère et décarbonée, comme le font déjà les États-Unis.',
    contre:
      'Aucun réacteur de ce type n’a fonctionné quatre-vingts ans : fixer l’horizon d’emblée anticipe sur les contrôles de sûreté.',
  },
  'retailleau-environnement-inscrire-les-reacteurs-nucleaire': {
    pour:
      'Prolonger un réacteur existant coûte bien moins cher que d\'en construire un neuf, si la sûreté le permet.',
    contre:
      'Aucun réacteur au monde n\'a fonctionné aussi longtemps : la trajectoire est fixée avant la démonstration de sûreté.',
  },
  'retailleau-agriculture-reautorisation-de-certains-neoni': {
    pour:
      'Les agriculteurs français subissent une concurrence déloyale quand des voisins européens utilisent des produits interdits ici.',
    contre:
      'Ces insecticides sont associés au déclin des abeilles et des pollinisateurs, et soulèvent des questions de santé.',
  },
  'retailleau-agriculture-reconnaitre-les-projets-de-stock': {
    pour:
      'Les sécheresses se répètent : stocker l\'eau de l\'hiver sécurise les récoltes de l\'été.',
    contre:
      'Ce statut permet de passer outre des protections environnementales, et prélever en amont assèche les milieux en aval.',
  },
  'retailleau-logement-programme-d-accession-pour-les-l': {
    pour:
      'Devenir propriétaire de son logement constitue un patrimoine et stabilise les quartiers, tout en finançant de nouvelles constructions.',
    contre:
      'Chaque logement vendu sort du parc social, alors que plus de deux millions de ménages attendent une attribution.',
  },
  'retailleau-logement-remettre-la-france-sur-une-traje': {
    pour:
      'La production est tombée bien en dessous des besoins, ce qui nourrit la hausse des prix et l\'allongement des files d\'attente.',
    contre:
      'Fixer un chiffre ne lève aucun des obstacles réels : coût du foncier, taux d\'intérêt, refus de permis.',
  },
  'retailleau-logement-supprimer-les-interdictions-de-l': {
    pour:
      'Interdire la location des logements mal notés retire du marché des biens que rien ne remplace, surtout en zone tendue.',
    contre:
      'Ces logements coûtent cher à chauffer et deviennent invivables l\'été : l\'interdiction protège d\'abord les locataires.',
  },
  'retailleau-securite-autoriser-la-vision-par-ordinate': {
    pour:
      'Analyser automatiquement les images permet de repérer un comportement dangereux là où aucun opérateur ne peut tout regarder.',
    contre:
      'La frontière avec la reconnaissance faciale est technique et mouvante : l\'exclure par principe ne l\'empêche pas en pratique.',
  },
  'retailleau-securite-verification-des-antecedents-de-': {
    pour:
      'Des agresseurs ont pu travailler avec des enfants faute de contrôle : une vérification systématique protège les mineurs.',
    contre:
      'Contrôler en permanence des millions d’intervenants, bénévoles compris, demande des moyens administratifs considérables.',
  },
  'retailleau-immigration-acces-des-etrangers-aux-prestati': {
    pour:
      'Lier les aides à une durée de résidence et de travail renforce la contribution préalable et limite l’attrait des prestations.',
    contre:
      'Conditionner des prestations à la durée de séjour se heurte au principe d’égalité, d’où le besoin de réviser la Constitution.',
  },
  'retailleau-immigration-conditionner-le-benefice-plein-d': {
    pour:
      'Lier l\'accès aux aides à une durée de résidence et de travail rapproche les droits ouverts de la contribution versée.',
    contre:
      'Retarder l\'accès aux aides familiales touche d\'abord des enfants, qui n\'ont aucune part dans la situation de leurs parents.',
  },
  'retailleau-defense-moyens-consacres-a-l-ia-de-defen': {
    pour:
      'Les armées étrangères investissent massivement dans ces technologies : prendre du retard affaiblirait la défense.',
    contre:
      'L’enjeu dépasse le budget : il faut des ingénieurs et des données, et l’usage militaire de ces outils pose des questions éthiques.',
  },
  'retailleau-defense-multiplier-par-cinq-les-moyens-c': {
    pour:
      'Les conflits récents montrent que drones et guerre électronique décident autant que les blindés.',
    contre:
      'Multiplier le budget par cinq suppose une base industrielle et des ingénieurs qui restent à constituer.',
  },
  'retailleau-institutions-ne-pas-remplacer-125-000-departs': {
    pour:
      'La masse salariale publique est le premier poste de dépense : ne pas remplacer une partie des départs la réduit sans licencier.',
    contre:
      'Les départs ne surviennent pas là où les effectifs sont excédentaires, et le redéploiement suppose des compétences transférables.',
  },
  'retailleau-institutions-seuil-du-referendum-d-initiative': {
    pour:
      'Le seuil actuel est si élevé qu’aucun référendum de ce type n’a abouti : l’abaisser rend l’outil utilisable.',
    contre:
      'Des référendums plus fréquents peuvent affaiblir le Parlement et se transformer en votes sur la popularité du pouvoir.',
  },
  // --- Dominique de Villepin -------------------------------------------------
  'villepin-economie-constituer-un-fonds-national-de-': {
    pour:
      'Un fonds public permet d’investir sur le long terme dans des secteurs que les marchés financent mal, en gardant la maîtrise nationale.',
    contre:
      'L’État n’a pas toujours su choisir ses investissements, et un tel fonds suppose des ressources que le budget actuel n’a pas.',
  },
  'villepin-economie-creer-un-impot-unique-sur-le-pat': {
    pour:
      'Un impôt unique sur le patrimoine est plus lisible, et les héritages concentrent une part croissante de la richesse des ménages.',
    contre:
      'Les patrimoines mobiles peuvent quitter le pays, et taxer davantage les héritages touche aussi des familles aux biens peu liquides.',
  },
  'villepin-economie-ramener-le-deficit-public-sous-3': {
    pour:
      'La dette coûte de plus en plus cher en intérêts : réduire le déficit redonne des marges et respecte les règles européennes.',
    contre:
      'Atteindre cet objectif exige des économies ou des hausses d’impôts importantes, qui peuvent freiner la croissance et l’emploi.',
  },
  'villepin-economie-ramener-toute-la-fiscalite-a-neu': {
    pour:
      'Un système fiscal plus simple coûte moins à gérer, se contourne moins facilement et se comprend mieux par les contribuables.',
    contre:
      'Fusionner des impôts aux assiettes très différentes crée des gagnants et des perdants difficiles à prévoir pendant la transition.',
  },
  'villepin-economie-supprimer-les-niches-fiscales-et': {
    pour:
      'Ces exceptions compliquent l’impôt et profitent souvent aux plus aisés, qui savent les utiliser : les supprimer élargit la base.',
    contre:
      'Beaucoup soutiennent l’emploi à domicile, le logement ou les dons : les retirer d’un coup frapperait des secteurs entiers.',
  },
  'villepin-emploi-adopter-une-grande-loi-d-accompa': {
    pour:
      'Cette technologie va transformer de nombreux emplois : planifier les formations limite les reconversions subies.',
    contre:
      'Prévoir les compétences de demain est incertain, et une loi générale risque de rester sans effet concret sur les métiers.',
  },
  'villepin-emploi-basculer-plus-de-200-milliards-d': {
    pour:
      'Faire payer la solidarité par tous les revenus, et non par le seul travail, augmente le salaire net sans alourdir le coût d’embauche.',
    contre:
      'La CSG frappe aussi les retraités et les revenus modestes du capital : le gain des salariés serait payé en partie par eux.',
  },
  'villepin-retraites-reforme-des-retraites-preparee-p': {
    pour:
      'Les dernières réformes ont été imposées sans adhésion : associer syndicats et citoyens puis voter donne une légitimité forte.',
    contre:
      'Un référendum réduit un sujet technique à un oui ou un non, et risque de devenir un vote pour ou contre le pouvoir.',
  },
  'villepin-education-au-moins-cent-heures-annuelles-d': {
    pour:
      'Les activités artistiques développent la confiance et la créativité, et l’école est le seul lieu où tous y ont accès.',
    contre:
      'Ces heures se prendraient sur un emploi du temps déjà chargé, alors que les résultats en français et en calcul reculent.',
  },
  'villepin-education-creer-signal-educ-plateforme-nat': {
    pour:
      'Des faits graves ont été étouffés par la voie hiérarchique : un canal indépendant protège ceux qui signalent.',
    contre:
      'Un guichet national éloigné du terrain risque d’être engorgé et de court-circuiter les équipes qui connaissent la situation.',
  },
  'villepin-education-interdiction-effective-des-telep': {
    pour:
      'Le portable nuit à la concentration et favorise le harcèlement : l’interdire dans l’établissement protège les élèves.',
    contre:
      'L’interdiction existe déjà au collège et reste difficile à faire respecter sans moyens de contrôle supplémentaires.',
  },
  'villepin-education-revalorisation-salariale-d-au-mo': {
    pour:
      'Les métiers de l’école peinent à recruter : mieux payer l’ensemble des personnels rend ces postes plus attractifs.',
    contre:
      'Une hausse générale de 10 % coûterait plusieurs milliards par an, sans financement précisé dans la mesure.',
  },
  'villepin-education-sanctuariser-le-budget-de-l-educ': {
    pour:
      'Protéger ce budget des coupes donne de la visibilité aux établissements et traduit la priorité donnée à l’éducation.',
    contre:
      'Le nombre d’élèves baisse : figer le budget et augmenter la dépense par élève limite les marges pour d’autres priorités.',
  },
  'villepin-education-transformer-500-mediatheques-en-': {
    pour:
      'Les médiathèques sont souvent le seul équipement culturel d’une commune : les renforcer réduit les écarts entre territoires.',
    contre:
      'Ces équipements dépendent des communes, et leur transformation suppose des budgets de fonctionnement durables.',
  },
  'villepin-environnement-l-etat-fixe-les-objectifs-climat': {
    pour:
      'Les communes connaissent leur territoire : leur donner les moyens d’agir rend la transition plus concrète et plus rapide.',
    contre:
      'Les petites communes manquent d’expertise, et transférer des moyens importants suppose des finances que l’État n’a pas.',
  },
  'villepin-environnement-planifier-l-electrification-des-': {
    pour:
      'Remplacer le pétrole et le gaz par l’électricité réduit les émissions et la dépendance aux importations.',
    contre:
      'Une électrification rapide exige de produire bien plus d’électricité et d’adapter le réseau, à un coût élevé.',
  },
  'villepin-environnement-retablir-un-prix-du-carbone-inte': {
    pour:
      'Taxer le carbone oriente les choix vers les solutions propres, et reverser la recette évite d’appauvrir les ménages.',
    contre:
      'La hausse de la taxe carbone a déclenché le mouvement des Gilets jaunes : le reversement ne garantit pas son acceptation.',
  },
  'villepin-agriculture-etendre-graduellement-le-mecanis': {
    pour:
      'Taxer le carbone des importations évite que les agriculteurs européens, soumis à des normes strictes, soient concurrencés à bas prix.',
    contre:
      'Calculer le carbone d’un produit agricole est complexe, et la taxe renchérirait les aliments importés pour les consommateurs.',
  },
  'villepin-agriculture-reduire-de-moitie-l-usage-total-': {
    pour:
      'Ces produits contaminent l’eau et nuisent à la biodiversité comme à la santé des agriculteurs eux-mêmes.',
    contre:
      'Les plans précédents fixant le même objectif ont échoué, faute de solutions de remplacement pour certaines cultures.',
  },
  'villepin-agriculture-viser-cinq-cent-mille-exploitati': {
    pour:
      'Le nombre de fermes baisse depuis des décennies : enrayer ce déclin préserve l’emploi rural et la souveraineté alimentaire.',
    contre:
      'La concentration des fermes suit des contraintes économiques fortes, et la mesure ne dit pas comment l’inverser.',
  },
  'villepin-agriculture-viser-un-excedent-agricole-et-ag': {
    pour:
      'La balance agricole française se dégrade : viser un excédent renforce les producteurs et la souveraineté alimentaire.',
    contre:
      'Un objectif de commerce extérieur dépend des marchés mondiaux et des accords européens, que l’État maîtrise mal.',
  },
  'villepin-securite-creer-un-registre-national-de-tr': {
    pour:
      'Un fichier national évite qu’une personne condamnée dans un département travaille auprès d’enfants dans un autre.',
    contre:
      'Le fichier des auteurs d’infractions sexuelles joue déjà en partie ce rôle, et un accès élargi pose des questions de libertés.',
  },
  'villepin-immigration-pause-sur-schengen-et-coordinati': {
    pour:
      'Sans contrôle aux frontières intérieures, les failles d’un pays profitent aux passeurs : rétablir les contrôles renforce la sécurité.',
    contre:
      'Suspendre la libre circulation pénalise les travailleurs frontaliers et le commerce, et suppose l’accord des partenaires.',
  },
  'villepin-defense-creer-un-conseil-de-securite-eur': {
    pour:
      'Face aux menaces, l’Europe décide trop lentement à vingt-sept : un cercle restreint permettrait de réagir plus vite.',
    contre:
      'Un conseil réservé aux grands pays marginaliserait les plus petits et risque de diviser l’Union au lieu de l’unir.',
  },
  'villepin-defense-creer-une-darpa-europeenne-finan': {
    pour:
      'L’Europe dépend des technologies américaines : une agence dotée de moyens comparables favoriserait des innovations de rupture.',
    contre:
      'Le budget américain se compte en milliards par an : le reproduire supposerait un accord financier difficile entre États.',
  },
  'villepin-defense-obliger-les-etablissements-d-ens': {
    pour:
      'Étudier ailleurs en Europe développe les langues et le sentiment européen : l’ouvrir à tous évite d’en faire un privilège.',
    contre:
      'Un séjour à l’étranger coûte cher aux étudiants modestes, et l’obligation pèserait sur des établissements sous tension.',
  },
  'villepin-defense-pause-sur-les-elargissements-de-': {
    pour:
      'L’Union doit réformer son fonctionnement avant de s’agrandir, et une intégration graduelle de l’Ukraine limite les chocs.',
    contre:
      'Geler les adhésions risque de pousser des pays candidats vers la Russie ou la Chine, et de décevoir des alliés.',
  },
  'villepin-institutions-creer-un-conseil-de-l-ia-aupres-': {
    pour:
      'Cette technologie soulève des risques nouveaux : une autorité indépendante permet de la surveiller comme le nucléaire.',
    contre:
      'Des règles européennes encadrent déjà ce domaine, et une instance de plus risque d’ajouter des lourdeurs.',
  },
  'villepin-institutions-encadrer-la-censure-du-gouvernem': {
    pour:
      'Renverser un gouvernement sans solution de rechange crée l’instabilité : exiger une alternative préserve la continuité.',
    contre:
      'Rendre la censure plus difficile réduit le contrôle du Parlement sur un gouvernement qui ne dispose pas d’une majorité.',
  },
  'villepin-institutions-nommer-un-gouvernement-resserre-': {
    pour:
      'Une équipe resserrée décide plus vite, et associer les régions rapproche l’État des réalités locales.',
    contre:
      'Avec dix ministères, certains sujets risquent d’être délaissés, et un conseil de plus ne garantit pas de décisions.',
  },
  // --- Édouard Philippe ------------------------------------------------------
  'philippe-economie-conclure-un-pacte-fiscal-avec-le': {
    pour:
      'Les impôts de production frappent l\'entreprise avant tout bénéfice. Les échanger contre des aides mal ciblées simplifie le circuit.',
    contre:
      'Les aides supprimées soutiennent aussi des activités fragiles, et rien ne garantit que les deux montants se compensent.',
  },
  'philippe-economie-inscrire-dans-la-constitution-un': {
    pour:
      'Une règle inscrite au sommet du droit protège les finances publiques des promesses de court terme, comme en Allemagne.',
    contre:
      'Une règle rigide empêche de laisser filer le déficit en cas de crise, quand la dépense publique peut soutenir l’activité.',
  },
  'philippe-economie-moratoire-normatif-et-fiscal-auc': {
    pour:
      'L’empilement des règles et des impôts décourage les entreprises : une pause donne de la visibilité à ceux qui investissent.',
    contre:
      'S’interdire toute norme ou tout impôt pendant cinq ans prive l’État de réponse face à une crise ou à un besoin imprévu.',
  },
  'philippe-economie-ramener-le-deficit-public-de-plu': {
    pour:
      'Réduire le déficit redonne des marges pour la prochaine crise et allège la charge des intérêts, devenue un des premiers postes.',
    contre:
      'Un tel effort en cinq ans suppose des coupes ou des hausses d\'impôts dont la mesure ne dit rien.',
  },
  'philippe-numerique-developper-une-infrastructure-d-': {
    pour:
      'La capacité de calcul est devenue un facteur de production : en manquer, c\'est dépendre de fournisseurs extérieurs.',
    contre:
      'Ces infrastructures consomment énormément d\'électricité et d\'eau, ce que la mesure n\'aborde pas.',
  },
  'philippe-emploi-creer-un-temps-partiel-parental-': {
    pour:
      'Le retour au travail après une naissance est souvent brutal : une reprise progressive aide les parents, notamment les mères.',
    contre:
      'Le financement de la part non travaillée n’est pas précisé, et les petites entreprises absorbent mal ces absences.',
  },
  'philippe-emploi-instaurer-un-droit-a-la-reconver': {
    pour:
      'Les métiers touchés par cette technologie se multiplient : garantir une reconversion protège les salariés exposés.',
    contre:
      'Des dispositifs de reconversion existent déjà et sont peu utilisés ; un droit de plus ne garantit ni financement ni débouchés.',
  },
  'philippe-retraites-creer-un-pilier-de-capitalisatio': {
    pour:
      'Un complément par capitalisation réduit la dépendance au seul rapport entre actifs et retraités, qui se dégrade.',
    contre:
      'La capitalisation expose les pensions aux marchés, et la transition fait cotiser deux fois la génération qui la met en place.',
  },
  'philippe-sante-stabiliser-les-depenses-de-sante': {
    pour:
      'Les dépenses augmentent plus vite que la richesse produite : sans réorganisation, le système devient insoutenable.',
    contre:
      'Stabiliser le budget dans un pays qui vieillit revient à réduire les moyens par patient, alors que l\'hôpital est déjà tendu.',
  },
  'philippe-solidarites-accorder-une-part-fiscale-des-le': {
    pour:
      'Le deuxième enfant coûte autant que le troisième, mais la fiscalité ne reconnaît cette charge qu\'à partir du troisième.',
    contre:
      'Le quotient familial profite surtout aux foyers les plus imposés : l\'étendre creuse cet avantage.',
  },
  'philippe-solidarites-fusionner-les-dispositifs-exista': {
    pour:
      'Une aide unique est plus simple à comprendre et à obtenir que la dizaine de prestations familiales actuelles.',
    contre:
      'Une aide universelle touche aussi les familles aisées, et la fusion ferait des perdants parmi les plus modestes.',
  },
  'philippe-education-creer-un-service-public-universe': {
    pour:
      'Le soutien scolaire privé coûte cher et creuse les écarts : le rendre gratuit rétablit une égalité réelle.',
    contre:
      'Un service public reposant sur des bénévoles devient inégal selon les territoires, et l\'IA ne remplace pas un enseignant.',
  },
  'philippe-education-faire-des-chefs-d-etablissement-': {
    pour:
      'Un chef d\'établissement qui choisit son équipe peut porter un projet cohérent, comme dans les réseaux qui réussissent.',
    contre:
      'Le recrutement local ouvre la porte à l\'arbitraire et creuserait l\'écart entre établissements attractifs et les autres.',
  },
  'philippe-education-revaloriser-le-metier-de-profess': {
    pour:
      'Les résultats en lecture et en calcul reculent : recentrer le primaire sur ces bases et attirer des enseignants y répond.',
    contre:
      'Concentrer l’école sur les fondamentaux réduit la place des arts, du sport ou des sciences dans les premières années.',
  },
  'philippe-education-rythmes-scolaires-heures-de-cour': {
    pour:
      'Les élèves sont plus attentifs le matin : y placer les cours principaux et alléger l’après-midi améliore les apprentissages.',
    contre:
      'Libérer les après-midi suppose des intervenants et des équipements que beaucoup de communes ne peuvent pas financer.',
  },
  'philippe-environnement-assurer-notre-souverainete-energ': {
    pour:
      'Combiner les deux sources et électrifier les usages réduit à la fois les émissions et la dépendance aux importations.',
    contre:
      'Mener les deux fronts de front disperse des moyens financiers et industriels qui sont limités.',
  },
  'philippe-environnement-doubler-le-montant-du-fonds-vert': {
    pour:
      'Écoles et maisons de retraite deviennent invivables l\'été : les rafraîchir relève de l\'urgence sanitaire.',
    contre:
      'Recentrer le fonds sur la climatisation le détourne de la réduction des émissions, que la climatisation augmente.',
  },
  'philippe-environnement-instaurer-un-prix-du-carbone-aux': {
    pour:
      'Sans ce mécanisme, décarboner en Europe revient à faire produire ailleurs, avec plus d\'émissions et moins d\'emplois.',
    contre:
      'Il renchérit les importations pour le consommateur et expose à des mesures de rétorsion commerciales.',
  },
  'philippe-environnement-lancer-un-plan-baignade-national': {
    pour:
      'Avec les canicules, les lieux de baignade manquent, et une eau propre à la baignade est bonne pour l’environnement.',
    contre:
      'Dépolluer les rivières prend des années et coûte cher, et la rénovation des piscines pèse sur les communes.',
  },
  'philippe-environnement-mettre-en-uvre-un-grand-plan-de-': {
    pour:
      'Un train de marchandises remplace des dizaines de poids lourds : il réduit les émissions, l’usure des routes et les accidents.',
    contre:
      'Le transport de marchandises par le rail recule depuis des décennies, faute de fiabilité et de prix compétitifs.',
  },
  'philippe-agriculture-appliquer-le-principe-zero-surtr': {
    pour:
      'Les règles plus strictes qu’ailleurs en Europe pénalisent les agriculteurs français face à leurs concurrents.',
    contre:
      'Certaines règles nationales protègent la santé ou l’environnement, et y renoncer pourrait réduire ces protections.',
  },
  'philippe-agriculture-creer-100-territoires-de-souvera': {
    pour:
      'Appliquer des règles plus strictes que les voisins pénalise les producteurs sans bénéfice sanitaire démontré.',
    contre:
      'Ces règles protègent parfois la santé ou l\'environnement : les supprimer en bloc revient à y renoncer sans examen.',
  },
  'philippe-logement-faciliter-le-demenagement-des-fa': {
    pour:
      'Une famille qui s\'agrandit reste souvent bloquée dans un logement trop petit, faute d\'apport pour déménager.',
    contre:
      'Solvabiliser la demande sans augmenter l\'offre alimente surtout la hausse des prix.',
  },
  'philippe-securite-courtes-peines-des-la-premiere-i': {
    pour:
      'Une sanction rapide dès le premier délit dissuade la récidive, à l’image de certains pays d’Europe du Nord.',
    contre:
      'Les prisons sont surpeuplées, et l’effet des peines planchers appliquées de 2007 à 2014 sur la récidive n’a pas été démontré.',
  },
  'philippe-securite-donner-aux-maires-un-pouvoir-de-': {
    pour:
      'Les petites infractions ne sont presque jamais poursuivies : le maire est le mieux placé pour y répondre vite.',
    contre:
      'Confier une sanction pénale à un élu confond l\'exécutif local et le juge, sans les garanties d\'un procès.',
  },
  'philippe-securite-renforcer-l-autorite-du-garde-de': {
    pour:
      'Le ministre est responsable de la politique pénale devant le Parlement : il doit pouvoir la faire appliquer.',
    contre:
      'Les instructions individuelles ont été supprimées précisément parce qu\'elles permettaient de peser sur des affaires particulières.',
  },
  'philippe-immigration-denoncer-l-accord-de-1968-avec-l': {
    pour:
      'Cet accord crée un régime dérogatoire au droit commun, que les gouvernements successifs n\'ont pas réussi à renégocier.',
    contre:
      'Une dénonciation unilatérale dégraderait des relations dont dépendent la coopération sécuritaire et les laissez-passer consulaires.',
  },
  'philippe-immigration-mettre-en-place-des-quotas-migra': {
    pour:
      'Fixer des volumes permet de choisir l’immigration selon les besoins de l’économie et de mieux préparer l’intégration.',
    contre:
      'Le regroupement familial est protégé par le droit européen et les conventions internationales, ce qui limite les quotas.',
  },
  'philippe-defense-grand-plan-munitions-pour-depass': {
    pour:
      'La guerre en Ukraine a montré l’importance des stocks de munitions : produire davantage renforce la capacité à tenir.',
    contre:
      'Multiplier la production demande des usines, des matières premières et des commandes garanties sur plusieurs années.',
  },
  'philippe-defense-porter-le-nombre-de-reservistes-': {
    pour:
      'Une réserve nombreuse est ce qui permet de tenir dans la durée en cas d\'engagement majeur.',
    contre:
      'Multiplier par cinq suppose équipement, encadrement et disponibilité des employeurs : aucun des trois n\'est réglé.',
  },
  // --- François Ruffin -------------------------------------------------------
  'ruffin-economie-la-france-pourra-nationaliser-ce': {
    pour:
      'Certaines technologies critiques ne doivent pas dépendre d\'un acheteur étranger, et l\'État est seul à pouvoir bloquer une vente.',
    contre:
      'Racheter coûte cher, et l\'État actionnaire n\'a pas toujours fait la preuve d\'une meilleure gestion industrielle.',
  },
  'ruffin-economie-referendum-sur-une-taxe-sur-les-': {
    pour:
      'Les dividendes versés ont fortement progressé : y prélever une part finance la transition sans toucher aux revenus du travail.',
    contre:
      'Taxer les dividendes réduit l’attrait d’investir dans les entreprises françaises, et le rendement attendu reste incertain.',
  },
  'ruffin-economie-rendre-publics-les-montants-vers': {
    pour:
      'Publier les montants permet de vérifier ce que l\'État achète et à qui, ce qui suffit souvent à faire reculer les excès.',
    contre:
      'La transparence ne réduit pas le recours en elle-même, et certaines missions sensibles supportent mal une publication intégrale.',
  },
  'ruffin-economie-un-systeme-d-alerte-sera-mis-en-': {
    pour:
      'Les entreprises repèrent les tentatives d\'influence avant l\'État : leur ouvrir un canal officiel accélère la réaction.',
    contre:
      'Un dispositif de signalement peut servir à dénoncer un concurrent, et suppose un tri qui mobilise des moyens.',
  },
  'ruffin-emploi-deployer-un-plan-de-formation-na': {
    pour:
      'Ces métiers offrent peu de perspectives : la formation est ce qui permet d\'y faire carrière plutôt que d\'y rester bloqué.',
    contre:
      'La formation ne crée pas les postes qualifiés vers lesquels évoluer, et bute sur des horaires déjà fragmentés.',
  },
  'ruffin-emploi-instaurer-une-remuneration-doubl': {
    pour:
      'Les horaires décalés abîment la santé et la vie familiale : les payer davantage en fait un choix plutôt qu\'une contrainte subie.',
    contre:
      'Le surcoût pousse à réduire ces plages horaires, donc les heures et le revenu de ceux qui en dépendent.',
  },
  'ruffin-emploi-mieux-remunerer-les-travailleuse': {
    pour:
      'Ces métiers ne peuvent être ni automatisés ni délocalisés, et peinent à recruter faute de salaires suffisants.',
    contre:
      'Beaucoup dépendent de financements publics : la revalorisation suppose un budget que la mesure ne chiffre pas.',
  },
  'ruffin-emploi-systematiser-la-remuneration-for': {
    pour:
      'Une journée coupée immobilise le salarié sans le payer : la compenser décourage les plannings à trous.',
    contre:
      'Certaines activités ont une charge concentrée matin et soir ; renchérir la coupure peut supprimer ces postes.',
  },
  'ruffin-emploi-temps-de-transport-entre-deux-in': {
    pour:
      'Ces salariés passent des heures sur la route sans être payés : compter ces trajets corrige une perte de revenu bien réelle.',
    contre:
      'Le surcoût pèserait sur des services d’aide déjà fragiles, financés en partie par les départements et les familles.',
  },
  'ruffin-retraites-un-trimestre-de-retraite-supplem': {
    pour:
      'L’espérance de vie en bonne santé est plus courte dans les métiers pénibles : partir plus tôt compense cette usure.',
    contre:
      'Définir la liste des métiers pénibles est source de conflits, et le coût pour les caisses de retraite n’est pas chiffré.',
  },
  'ruffin-solidarites-elargir-le-pass-culture-aux-adul': {
    pour:
      'L\'isolement et la précarité éloignent durablement de toute pratique culturelle, et rien n\'existe pour les adultes.',
    contre:
      'Le dispositif pour les jeunes a surtout servi à acheter des biens : l\'étendre sans le corriger reproduirait ce travers.',
  },
  'ruffin-solidarites-garantir-l-acces-de-toutes-et-to': {
    pour:
      'Le coût d\'une licence écarte des familles entières, alors que le sport reste un des rares lieux de mixité.',
    contre:
      'Prendre en charge la moitié des licences et financer des postes d\'animateurs suppose un budget que la mesure ne précise pas.',
  },
  'ruffin-solidarites-simplifier-l-acces-aux-aides-pou': {
    pour:
      'Prévenir automatiquement ceux qui y ont droit est le seul moyen réellement efficace contre le non-recours.',
    contre:
      'Croiser les fichiers pour détecter les droits concentre des données personnelles sensibles.',
  },
  'ruffin-education-creer-une-route-des-metiers-d-ar': {
    pour:
      'Ces savoir-faire sont un patrimoine vivant, et un tourisme de proximité fait vivre des territoires délaissés.',
    contre:
      'Le dispositif reste marginal face aux difficultés de transmission, qui tiennent d\'abord au manque de formation.',
  },
  'ruffin-education-garantir-a-chaque-enfant-francai': {
    pour:
      'Un enfant sur trois ne part jamais en vacances : le départ automatique supprime la barrière de la démarche à accomplir.',
    contre:
      'Financer un séjour pour toute une classe d\'âge représente un budget considérable, sans effet mesuré sur la scolarité.',
  },
  'ruffin-education-mettre-en-place-une-politique-am': {
    pour:
      'Ces emplois s\'exercent sur place et ne peuvent pas partir ailleurs, contrairement à ceux de l\'industrie.',
    contre:
      'Le secteur dépend fortement de la subvention : les emplois créés durent le temps du financement public.',
  },
  'ruffin-education-transformer-la-plateforme-du-pas': {
    pour:
      'Le dispositif actuel profite surtout aux grandes plateformes et à l\'achat de biens, pas à la pratique artistique.',
    contre:
      'Restreindre les usages réduit la liberté de choix des jeunes, qui est précisément ce qui a fait le succès du dispositif.',
  },
  'ruffin-logement-affirmer-la-vocation-sociale-du-': {
    pour:
      'Cette contribution a été créée pour loger les salariés : la recentrer sur ceux qui en ont le plus besoin renoue avec son objet.',
    contre:
      'Réserver ce financement à une catégorie de salariés en prive d\'autres, tout aussi mal logés.',
  },
  'ruffin-logement-garantir-par-la-loi-le-maintien-': {
    pour:
      'Les villages de vacances associatifs disparaissent, et avec eux la possibilité de partir pour les familles modestes.',
    contre:
      'Conditionner les aides à des tarifs modérés peut décourager les opérateurs et réduire l\'offre au lieu de la maintenir.',
  },
  'ruffin-logement-garantir-un-droit-au-logement-ab': {
    pour:
      'Les métiers essentiels s\'exercent là où les loyers sont les plus élevés : leurs salariés sont repoussés toujours plus loin.',
    contre:
      'Un droit sans logements supplémentaires ne fait que déplacer la file d\'attente entre catégories de demandeurs.',
  },
  'ruffin-logement-permettre-aux-travailleuses-et-t': {
    pour:
      'Deux heures de transport par jour usent la santé et désorganisent la vie familiale de ceux dont la ville dépend.',
    contre:
      'Cela suppose un parc dédié en centre-ville, là où le foncier est justement le plus rare et le plus cher.',
  },
  'ruffin-transports-baisser-les-tarifs-des-peages-en': {
    pour:
      'Les concessions arrivent à échéance et ont rapporté bien plus que prévu : les reprendre permettrait de baisser les tarifs.',
    contre:
      'L\'État devrait alors financer l\'entretien du réseau, aujourd\'hui à la charge des concessionnaires.',
  },
  'ruffin-transports-mettre-en-place-un-billet-popula': {
    pour:
      'Un tarif unique et lisible remplit des trains qui roulent à moitié vides l\'été et rend le train accessible.',
    contre:
      'Le coût retombe sur les régions, qui financent déjà le TER, et les lignes saturées ne peuvent pas absorber la demande.',
  },
  'ruffin-transports-plafonner-le-prix-des-billets-d-': {
    pour:
      'Le prix des billets rend le lien avec l\'hexagone inaccessible à une part des habitants, sans alternative possible.',
    contre:
      'Un plafond sans compensation pousse les compagnies à réduire les fréquences sur des lignes déjà peu rentables.',
  },
  'ruffin-securite-interdire-toute-intervention-des': {
    pour:
      'Un magistrat dont l\'avancement dépend du pouvoir ne peut pas enquêter librement sur ce pouvoir.',
    contre:
      'Couper tout lien pose la question du contrôle démocratique d\'un corps qui ne rendrait alors de comptes à personne.',
  },
  'ruffin-securite-renforcer-l-independance-du-parq': {
    pour:
      'Tant que le gouvernement nomme les procureurs, le soupçon d\'intervention politique pèse sur chaque affaire sensible.',
    contre:
      'Un parquet sans lien avec l\'exécutif conduit une politique pénale sans mandat électif ni contrôle.',
  },
  'ruffin-securite-supprimer-la-convention-judiciai': {
    pour:
      'Supprimer ce mécanisme rétablit une justice identique pour tous, sans transaction négociée à l\'abri d\'un procès.',
    contre:
      'Sans elle, ces affaires très techniques aboutissent rarement : l\'État perd le procès et les sommes qu\'il récupérait.',
  },
  'ruffin-institutions-faire-de-la-probite-une-priorite': {
    pour:
      'La défiance envers les responsables publics nourrit l\'abstention : la probité conditionne tout le reste.',
    contre:
      'L\'affirmation reste générale et ne décrit aucun mécanisme : rien n\'y est vérifiable ni opposable.',
  },
  'ruffin-institutions-mettre-en-place-un-systeme-de-co': {
    pour:
      'Les groupes d\'intérêt disposent d\'un accès permanent aux décideurs que les citoyens n\'ont pas : la consultation rétablit un équilibre.',
    contre:
      'Consulter systématiquement allonge chaque décision, et ce sont les groupes les mieux organisés qui répondent le plus.',
  },
  'ruffin-institutions-soumettre-la-decision-du-ministr': {
    pour:
      'Des décisions industrielles majeures se prennent aujourd\'hui sans que le Parlement en soit seulement saisi.',
    contre:
      'Un avis préalable ralentit des décisions parfois urgentes, notamment face à une offre de rachat hostile.',
  },
  // --- Gabriel Attal ---------------------------------------------------------
  'attal-economie-double-regle-d-or-comptes-public': {
    pour:
      'Emprunter pour payer le quotidien reporte la charge sur les générations futures ; réserver la dette à l’investissement la justifie.',
    contre:
      'La frontière entre fonctionnement et investissement est floue : payer enseignants et soignants prépare aussi l’avenir.',
  },
  'attal-economie-lancer-le-plan-france-2050-a-hau': {
    pour:
      'Concentrer l\'effort sur dix domaines évite le saupoudrage qui a dispersé les plans d\'investissement précédents.',
    contre:
      'Choisir dix priorités aujourd\'hui, c\'est parier sur des technologies qui peuvent être dépassées avant la fin du plan.',
  },
  'attal-economie-passer-la-tva-sur-les-vehicules-': {
    pour:
      'Une TVA réduite baisse le prix affiché pour tout le monde, sans dossier à remplir contrairement à une prime.',
    contre:
      'La baisse profite aussi à ceux qui auraient acheté de toute façon, et ampute durablement les recettes de TVA.',
  },
  'attal-economie-ramener-les-impots-de-production': {
    pour:
      'Ces impôts sont dus même à perte, ce qui pénalise l\'industrie plus que les services : les plafonner rétablit l\'équilibre.',
    contre:
      'Ils financent les collectivités, qu\'il faudra compenser. Sans compensation, ce sont les services locaux qui paient.',
  },
  'attal-economie-viser-un-objectif-de-200-milliar': {
    pour:
      'Cette technologie sera décisive pour l’économie : attirer centres de calcul et chercheurs évite de dépendre de l’étranger.',
    contre:
      'L’essentiel du montant repose sur des investisseurs privés, souvent étrangers, sur lesquels l’État n’a qu’une prise limitée.',
  },
  'attal-emploi-creer-un-conge-de-naissance-de-6': {
    pour:
      'Le congé actuel est trop court pour la garde et trop peu payé pour être pris par les pères : allonger et mieux rémunérer change les deux.',
    contre:
      'Six mois de plus coûtent cher à la Sécurité sociale et éloignent durablement du marché du travail celui qui les prend.',
  },
  'attal-emploi-creer-un-contrat-reussite-etudia': {
    pour:
      'Au-delà de quinze heures par semaine, les chances de réussite d\'un étudiant chutent nettement : encadrer protège les études.',
    contre:
      'Plafonner les heures réduit le revenu de ceux qui travaillent par nécessité, sans rien prévoir pour compenser cette perte.',
  },
  'attal-emploi-creer-un-livret-d-epargne-sur-le': {
    pour:
      'Le manque de places en crèche freine le retour à l’emploi des parents : mobiliser l’épargne finance des places sans impôt.',
    contre:
      'Le manque de crèches tient surtout au manque de professionnels, que l’argent seul ne suffit pas à recruter rapidement.',
  },
  'attal-emploi-equivalent-d-un-13e-mois-pour-le': {
    pour:
      'Les classes moyennes ont le sentiment de payer sans recevoir : alléger leurs prélèvements améliore directement leur pouvoir d’achat.',
    contre:
      'Baisser les charges sur ces salaires coûte des milliards à la protection sociale, sans financement précisé en contrepartie.',
  },
  'attal-emploi-former-10-millions-de-salaries-e': {
    pour:
      'L\'écart se creuse entre ceux qui maîtrisent ces outils et les autres : une formation de masse évite un décrochage durable.',
    contre:
      'Former dix millions de personnes en trois ans suppose des formateurs et des heures libérées dont le pays ne dispose pas.',
  },
  'attal-retraites-introduire-la-retraite-par-capit': {
    pour:
      'Une part d’épargne placée complète les pensions et profite du rendement des marchés sur une longue durée.',
    contre:
      'Le salarié ne disposerait plus librement de ces primes, et son épargne dépendrait des aléas des marchés financiers.',
  },
  'attal-retraites-supprimer-l-age-legal-de-depart-': {
    pour:
      'Fonder le départ sur les années travaillées est plus juste pour ceux qui ont commencé tôt, et laisse chacun choisir.',
    contre:
      'Ceux qui ont étudié longtemps ou connu des interruptions partiraient très tard, et le nombre d’années exigé reste à fixer.',
  },
  'attal-sante-prevoir-une-couverture-sante-obl': {
    pour:
      'Ces salariés sont les seuls à ne pas bénéficier de la complémentaire obligatoire dont profitent tous les autres.',
    contre:
      'Le coût retombe sur des particuliers employeurs, ce qui peut réduire le nombre d\'heures déclarées.',
  },
  'attal-solidarites-familles-monoparentales-ne-plus-': {
    pour:
      'Les parents seuls, souvent des mères, sont parmi les plus exposés à la pauvreté : ces mesures allègent leurs dépenses.',
    contre:
      'Défiscaliser les pensions alimentaires profite surtout aux foyers imposables, pas aux familles les plus pauvres.',
  },
  'attal-solidarites-mettre-en-place-un-droit-opposab': {
    pour:
      'L\'absence de place de crèche est la première raison qui empêche un parent, le plus souvent la mère, de reprendre un emploi.',
    contre:
      'Un droit opposable sans places supplémentaires ne produit que du contentieux : les communes n\'ont ni locaux ni personnel.',
  },
  'attal-education-augmenter-les-enseignants-d-au-m': {
    pour:
      'Les salaires des enseignants français sont inférieurs à ceux de pays comparables, ce qui pèse sur le recrutement.',
    contre:
      'La hausse coûterait plusieurs milliards par an, et les conditions de travail comptent autant que la paie pour attirer.',
  },
  'attal-education-loi-de-programmation-de-l-educat': {
    pour:
      'Concentrer les difficultés dans quelques collèges enferme les élèves ; les répartir favorise la mixité sociale.',
    contre:
      'Fermer un collège de quartier allonge les trajets et peut déplacer le problème sans réduire les inégalités.',
  },
  'attal-education-maintenir-la-trajectoire-de-rein': {
    pour:
      'Le pays stagne sous cet objectif depuis vingt ans, et le décrochage se lit sur les brevets et les publications.',
    contre:
      'Tenir la trajectoire dépend surtout de l\'effort privé, sur lequel l\'État n\'a qu\'un levier indirect.',
  },
  'attal-environnement-engagement-de-stabilite-tarifair': {
    pour:
      'Des prix stables protègent le budget des ménages et donnent de la visibilité aux entreprises, après des années de hausses.',
    contre:
      'Si les coûts de production augmentent, l’écart devra être payé par l’État ou par l’opérateur public.',
  },
  'attal-environnement-faire-passer-le-rythme-de-reduct': {
    pour:
      'Les engagements européens imposent une baisse rapide des émissions d’ici 2030 : le rythme actuel ne suffit pas à les tenir.',
    contre:
      'Accélérer à ce point suppose des investissements et des contraintes lourdes, sans que la mesure précise lesquels.',
  },
  'attal-environnement-tenir-l-objectif-de-14-epr-d-ici': {
    pour:
      'Doubler le parc pilotable et l\'éolien en mer couvre la hausse attendue de la consommation d\'électricité.',
    contre:
      'Quatorze réacteurs d\'ici 2030 est hors de portée au vu des délais constatés sur les chantiers en cours.',
  },
  'attal-agriculture-mettre-en-place-des-contrats-de-': {
    pour:
      'Engager l\'État, la filière et l\'agriculteur ensemble évite de faire porter le coût de la transition au seul producteur.',
    contre:
      'L\'objectif de réduction de moitié a déjà été fixé deux fois et jamais atteint, faute d\'alternatives disponibles.',
  },
  'attal-logement-creer-jusqu-a-500-000-logements-': {
    pour:
      'Construire sur l\'existant produit des logements sans consommer de terres agricoles ni étendre les réseaux.',
    contre:
      'Surélever suppose l\'accord des copropriétés et une structure porteuse : le potentiel réel est très inférieur à l\'objectif.',
  },
  'attal-securite-rendre-systematique-la-police-mu': {
    pour:
      'La présence sur la voie publique rassure et décharge la police nationale des missions du quotidien.',
    contre:
      'L\'obligation transfère aux communes une charge que les plus pauvres d\'entre elles ne pourront pas financer.',
  },
  'attal-securite-supprimer-le-juge-de-l-applicati': {
    pour:
      'La peine réellement effectuée s’écarte souvent de celle prononcée : supprimer ces aménagements rend la sanction lisible.',
    contre:
      'Les aménagements de peine préparent la sortie et limitent la récidive, et les supprimer aggraverait la surpopulation carcérale.',
  },
  'attal-immigration-instaurer-un-systeme-d-admission': {
    pour:
      'Un barème transparent voté par le Parlement remplace des décisions au cas par cas, peu lisibles et contestées.',
    contre:
      'Un système à points sélectionne les diplômés et laisse sans réponse les métiers peu qualifiés, où le manque est réel.',
  },
  'attal-immigration-systeme-d-immigration-a-points-i': {
    pour:
      'Un système transparent fondé sur des critères clairs attire les profils dont l’économie a besoin et facilite l’intégration.',
    contre:
      'La France reçoit surtout une immigration familiale et d’asile, que ce type de système ne permet pas de sélectionner.',
  },
  'attal-defense-etats-unis-d-europe-president-eu': {
    pour:
      'Un dirigeant élu par les citoyens donnerait à l’Europe une voix forte et plus de légitimité face aux grandes puissances.',
    contre:
      'Une fédération transfère des pouvoirs nationaux, et beaucoup de pays comme de citoyens n’y sont pas prêts.',
  },
  'attal-defense-instaurer-un-buy-european-tech-a': {
    pour:
      'Les commandes publiques européennes financent souvent des industriels non européens, au détriment de la base industrielle.',
    contre:
      'Fermer les marchés publics expose à des mesures symétriques et peut renchérir des équipements sans équivalent européen.',
  },
  'attal-institutions-inscrire-dans-la-constitution-un': {
    pour:
      'Les délais administratifs freinent l’investissement : une obligation constitutionnelle de répondre vite donne de la visibilité.',
    contre:
      'Un délai trop court peut conduire à des décisions bâclées, notamment sur les sujets environnementaux ou de sécurité.',
  },
  // --- Jean-Luc Mélenchon ----------------------------------------------------
  'melenchon-economie-etablir-une-taxe-permanente-sur-': {
    pour:
      'Des profits nés d\'une crise ou d\'une rente, et non d\'un effort, peuvent être partagés sans décourager l\'investissement.',
    contre:
      'Définir un « superprofit » hors énergie reste juridiquement flou, et l\'incertitude fiscale pèse sur les décisions d\'implantation.',
  },
  'melenchon-economie-retablir-et-renforcer-l-impot-de': {
    pour:
      'Le patrimoine s\'est concentré depuis la suppression de cet impôt : le rétablir vise ceux dont la contribution a le plus baissé.',
    contre:
      'L\'ancien impôt rapportait peu au regard des départs qu\'il provoquait, et frappait des patrimoines difficiles à vendre.',
  },
  'melenchon-numerique-garantir-l-hebergement-des-donne': {
    pour:
      'Les données des services publics touchent à la souveraineté : sous droit français, elles échappent aux lois étrangères.',
    contre:
      'Peu d\'acteurs français atteignent le niveau de service attendu : la contrainte risque de dégrader les outils publics.',
  },
  'melenchon-numerique-garantir-l-utilisation-de-galile': {
    pour:
      'Dépendre d\'un seul système de positionnement expose à une interruption décidée ailleurs, y compris pour des usages critiques.',
    contre:
      'Imposer une double compatibilité renchérit tous les appareils, pour un risque que beaucoup jugent théorique.',
  },
  'melenchon-emploi-garantir-les-droits-des-represen': {
    pour:
      'Les délégués sont exposés à des représailles déguisées : les protéger est la condition d\'une négociation réelle.',
    contre:
      'Une protection étendue rend difficile de se séparer d\'un salarié même pour un motif étranger à son mandat.',
  },
  'melenchon-emploi-interdire-les-licenciements-bour': {
    pour:
      'Licencier tout en versant des dividendes revient à faire porter l\'ajustement aux seuls salariés.',
    contre:
      'L\'interdiction peut retarder des restructurations nécessaires et fragiliser l\'entreprise entière plutôt qu\'une partie.',
  },
  'melenchon-retraites-garantir-aux-agricultrices-et-ag': {
    pour:
      'Les pensions agricoles comptent parmi les plus faibles, après une vie de travail sans interruption.',
    contre:
      'Ce régime est déjà financé en grande partie par la solidarité nationale : relever les pensions accroît ce transfert.',
  },
  'melenchon-retraites-supprimer-la-decote-qui-represen': {
    pour:
      'La décote frappe deux fois ceux qui ont une carrière incomplète, souvent des femmes et des travailleurs précaires.',
    contre:
      'Elle incite à cotiser plus longtemps : la supprimer avance les départs et alourdit la charge du régime.',
  },
  'melenchon-sante-ajouter-le-droit-de-mourir-dans-': {
    pour:
      'Inscrire ce droit dans la Constitution le met à l\'abri des alternances, et garantit du même coup l\'accès aux soins palliatifs.',
    contre:
      'Constitutionnaliser fige un sujet qui évolue, et une partie des soignants redoute une pression sur les patients les plus vulnérables.',
  },
  'melenchon-sante-proteger-la-recherche-de-la-fina': {
    pour:
      'Le financement privé oriente la recherche vers ce qui est rentable plutôt que vers ce qui est le plus utile.',
    contre:
      'Le privé finance une part majeure des essais cliniques : l\'écarter sans le remplacer ralentirait l\'accès aux traitements.',
  },
  'melenchon-solidarites-creer-un-service-public-de-la-pe': {
    pour:
      'Il manque des centaines de milliers de places, et le secteur privé n\'a pas comblé ce manque malgré les aides reçues.',
    contre:
      'Ouvrir 500 000 places en cinq ans suppose de recruter des dizaines de milliers de professionnels dans un métier déjà en pénurie.',
  },
  'melenchon-solidarites-organiser-l-election-des-adminis': {
    pour:
      'La Sécurité sociale a été conçue pour être gérée par ceux qui la financent : leur rendre ce pouvoir renoue avec son principe.',
    contre:
      'Laisser fixer les cotisations hors du Parlement sort de son contrôle une part majeure des prélèvements obligatoires.',
  },
  'melenchon-education-geler-les-ouvertures-de-places-d': {
    pour:
      'Le supérieur privé lucratif s\'est développé sans contrôle, avec des diplômes parfois sans valeur reconnue.',
    contre:
      'Le privé absorbe une demande que le public ne peut pas accueillir : geler sans ouvrir ailleurs laisse des jeunes sans place.',
  },
  'melenchon-education-renforcer-le-controle-pedagogiqu': {
    pour:
      'Des établissements facturent des milliers d\'euros pour des formations dont le contenu n\'est vérifié par personne.',
    contre:
      'Un contrôle systématique demande des moyens d\'inspection considérables, et peut fermer des formations sans solution de repli.',
  },
  'melenchon-environnement-agir-contre-les-consequences-des': {
    pour:
      'Les pays les moins responsables du réchauffement en subissent les effets les plus violents, sans moyens d\'y faire face.',
    contre:
      'L\'aide au développement est déjà sous tension, et les transferts de technologie posent des questions de propriété industrielle.',
  },
  'melenchon-environnement-atteindre-le-tres-bon-etat-ecolo': {
    pour:
      'La qualité de l\'eau se dégrade et conditionne autant l\'eau potable que la biodiversité.',
    contre:
      'Le très bon état est plus exigeant que ce qu\'impose le droit européen, et suppose de revoir profondément les pratiques agricoles.',
  },
  'melenchon-agriculture-determiner-de-nouvelles-normes-p': {
    pour:
      'Les conditions d\'élevage intensif sont mal acceptées par le public et font aussi peser un risque sanitaire.',
    contre:
      'Des normes plus strictes qu\'ailleurs, sans équivalent aux frontières, remplacent la production locale par des importations.',
  },
  'melenchon-agriculture-instaurer-un-moratoire-sur-les-e': {
    pour:
      'Interdire avant l\'installation d\'une filière évite d\'avoir à la démanteler ensuite, avec des emplois en jeu.',
    contre:
      'Interdire par anticipation une activité légale ailleurs prive le pays d\'une production qu\'il importera de toute façon.',
  },
  'melenchon-logement-lancer-un-plan-d-urgence-de-prev': {
    pour:
      'L\'infestation s\'étend, coûte cher aux ménages et touche d\'abord les logements les plus modestes.',
    contre:
      'Créer un service public dédié mobilise des moyens permanents pour un problème qu\'un dispositif d\'aide suffirait à traiter.',
  },
  'melenchon-logement-requisitionner-les-logements-vid': {
    pour:
      'Des centaines de milliers de logements restent vides pendant que des personnes dorment dehors.',
    contre:
      'La réquisition se heurte au droit de propriété, et beaucoup de ces logements sont vides pour cause de travaux ou de succession.',
  },
  'melenchon-transports-lancer-des-grands-travaux-de-ren': {
    pour:
      'Le réseau vieillit plus vite qu\'il n\'est rénové, et des territoires entiers ont perdu tout accès au train.',
    contre:
      'Rouvrir une ligne coûte très cher pour une fréquentation souvent faible, au détriment du réseau principal.',
  },
  'melenchon-transports-repenser-la-mobilite-individuell': {
    pour:
      'Les voitures circulent aux trois quarts vides : le partage et le vélo réduisent le trafic sans construire d\'infrastructure.',
    contre:
      'Ces solutions fonctionnent en zone dense mais restent inadaptées là où la voiture est la seule option.',
  },
  'melenchon-securite-garantir-des-sessions-de-formati': {
    pour:
      'Juger sans connaître l\'histoire ni les réalités locales conduit à des décisions mal comprises et mal acceptées.',
    contre:
      'Une formation ne compense pas la rotation rapide des magistrats, qui est le problème de fond.',
  },
  'melenchon-securite-interdire-la-publicite-pour-les-': {
    pour:
      'La publicité cible les jeunes et les publics fragiles, alors que l\'addiction aux paris progresse rapidement.',
    contre:
      'L\'interdiction prive le sport de financements et déplace les joueurs vers des sites non régulés.',
  },
  'melenchon-immigration-garantir-le-droit-du-sol-integra': {
    pour:
      'Un enfant né et grandi ici n\'a pas d\'autre pays : lui reconnaître la nationalité ne fait qu\'entériner la réalité.',
    contre:
      'Ses opposants y voient un facteur d\'attractivité migratoire et un droit détaché de tout choix d\'appartenance.',
  },
  'melenchon-immigration-instituer-la-carte-de-sejour-de-': {
    pour:
      'Renouveler un titre chaque année occupe les préfectures et maintient les personnes dans une précarité permanente.',
    contre:
      'Généraliser un titre long et régulariser largement revient, pour ses opposants, à valider l\'entrée irrégulière.',
  },
  'melenchon-defense-agir-pour-l-adoption-a-l-onu-d-u': {
    pour:
      'Les engagements volontaires n\'ont empêché ni les atteintes aux droits ni les dommages environnementaux.',
    contre:
      'Un texte contraignant suppose l\'accord d\'États qui s\'y opposent, ce qui rend son adoption improbable.',
  },
  'melenchon-defense-renforcer-l-aide-au-developpemen': {
    pour:
      'L\'aide sans condition a soutenu des régimes dont les pratiques ont nourri le rejet de la France dans la région.',
    contre:
      'Conditionner l\'aide laisse le champ libre à d\'autres puissances qui, elles, ne posent aucune condition.',
  },
  'melenchon-institutions-reconnaitre-le-vote-blanc-mettre': {
    pour:
      'Reconnaître le vote blanc donne une expression à ceux qui se déplacent sans se reconnaître dans l\'offre politique.',
    contre:
      'Rendre le vote obligatoire sanctionne l\'abstention sans en traiter la cause, et un seuil de validité peut bloquer une élection.',
  },
  'melenchon-institutions-rendre-obligatoire-le-recours-au': {
    pour:
      'Modifier la Constitution ou signer un traité engage durablement le pays : le faire ratifier directement en renforce la légitimité.',
    contre:
      'Un référendum se transforme souvent en vote sur celui qui le convoque, et rendrait toute révision quasi impossible.',
  },
  // --- Marine Le Pen ---------------------------------------------------------
  'lepen-economie-autoriser-l-etat-a-intervenir-da': {
    pour:
      'Des prix garantis protègent les producteurs des variations brutales du marché mondial, qu\'ils ne maîtrisent pas.',
    contre:
      'Fixer administrativement un prix fausse la concurrence et expose la France à des recours devant la justice européenne.',
  },
  'lepen-economie-creer-sous-l-egide-de-la-caisse-': {
    pour:
      'Mobiliser l\'épargne des Français pour financer l\'appareil productif évite de dépendre de capitaux étrangers.',
    contre:
      'L\'épargne réglementée finance déjà le logement social : la réorienter se fait forcément au détriment d\'un autre emploi.',
  },
  'lepen-economie-flecher-prioritairement-les-effo': {
    pour:
      'L\'argent public prélevé en France peut légitimement soutenir d\'abord l\'activité et les emplois situés en France.',
    contre:
      'Une préférence nationale dans la commande publique contrevient aux règles du marché intérieur et expose à des rétorsions.',
  },
  'lepen-numerique-taxer-l-utilisation-des-reseaux-': {
    pour:
      'Quelques services concentrent l\'essentiel du trafic sans participer au coût des réseaux qu\'ils saturent.',
    contre:
      'La taxe se répercute sur les abonnements, et remet en cause le principe de neutralité du réseau.',
  },
  'lepen-emploi-appliquer-a-competence-egale-une': {
    pour:
      'À compétence égale, la mesure réserve l\'emploi aux nationaux dans un pays où le chômage reste élevé.',
    contre:
      'Une préférence fondée sur la nationalité contrevient au droit européen et au principe d\'égalité, et serait censurée.',
  },
  'lepen-emploi-stabiliser-la-legislation-sur-le': {
    pour:
      'Employeurs comme salariés ont besoin de règles qui ne changent pas à chaque législature pour s\'organiser.',
    contre:
      'Figer la règle empêche aussi de corriger ce qui ne marche pas, et l\'exonération des heures supplémentaires coûte à la Sécurité sociale.',
  },
  'lepen-retraites-alleger-les-dispositifs-de-cumul': {
    pour:
      'Des soignants retraités souhaitent poursuivre mais y renoncent, leurs cotisations ne leur ouvrant plus aucun droit.',
    contre:
      'La mesure traite un symptôme du manque de soignants sans agir sur la formation, qui en est la cause.',
  },
  'lepen-retraites-indexer-l-age-d-ouverture-des-dr': {
    pour:
      'Celui qui commence à 18 ans cotise bien plus longtemps que celui qui commence à 25 : indexer rétablit l\'équité entre carrières.',
    contre:
      'Définir l\'entrée dans un emploi stable est très complexe pour des parcours faits de contrats courts et d\'alternance.',
  },
  'lepen-sante-le-modele-de-l-hopital-de-valenc': {
    pour:
      'La part administrative a crû plus vite que le soin : la ramener libère des moyens pour les équipes soignantes.',
    contre:
      'Un ratio uniforme ignore la taille et la mission de chaque hôpital, et une partie de l\'administratif est imposée par la loi.',
  },
  'lepen-sante-mettre-en-place-des-2026-une-pro': {
    pour:
      'Les agents hospitaliers sont moins bien couverts que les salariés du privé, alors qu\'ils sont plus exposés.',
    contre:
      'La mesure engage une dépense récurrente pour l\'État employeur, dont le financement n\'est pas précisé.',
  },
  'lepen-solidarites-controler-l-existence-des-benefi': {
    pour:
      'Des pensions continuent d\'être versées après un décès non signalé à l\'étranger : le contrôle porte sur une fraude documentée.',
    contre:
      'Les sommes en jeu sont faibles au regard du coût des contrôles, qui peuvent suspendre des droits parfaitement légitimes.',
  },
  'lepen-solidarites-suspendre-les-allocations-famili': {
    pour:
      'La responsabilité des parents doit avoir une traduction concrète lorsqu\'un mineur récidive.',
    contre:
      'Retirer une allocation appauvrit une famille déjà fragile et frappe aussi les frères et sœurs, qui n\'ont rien fait.',
  },
  'lepen-education-donner-dans-l-enseignement-prima': {
    pour:
      'Les résultats en français et en mathématiques baissent : concentrer les heures sur ces matières est la réponse la plus directe.',
    contre:
      'Réduire la place des autres disciplines appauvrit la formation, et l\'histoire enseignée devient un enjeu politique.',
  },
  'lepen-education-experimenter-un-service-national': {
    pour:
      'Beaucoup de monuments et de sites se dégradent faute de bras, et l\'engagement crée du lien entre générations.',
    contre:
      'Le volontariat suppose un encadrement coûteux, et une restauration demande des compétences de métier.',
  },
  'lepen-environnement-laisser-les-parcs-eoliens-actuel': {
    pour:
      'Des parcs ont été implantés sans considération pour les paysages et le patrimoine, parfois contre l\'avis des habitants.',
    contre:
      'Renoncer à l\'éolien prive le pays de la capacité de production la plus rapide à installer, alors que la demande augmente.',
  },
  'lepen-environnement-prolonger-et-optimiser-les-react': {
    pour:
      'Un programme de long terme redonne à la filière la visibilité industrielle qu\'elle a perdue depuis trente ans.',
    contre:
      'Vingt réacteurs représentent un investissement colossal, et les petits réacteurs modulaires ne sont pas encore éprouvés.',
  },
  'lepen-agriculture-annuler-la-baisse-de-500-million': {
    pour:
      'Réduire le budget agricole au moment où les revenus s\'effondrent envoie un signal difficile à tenir.',
    contre:
      'Maintenir l\'enveloppe sans dire ce qu\'elle finance ne règle pas la question de l\'efficacité de ces aides.',
  },
  'lepen-agriculture-defendre-une-exception-agricultu': {
    pour:
      'Exposer l\'agriculture à des concurrents qui n\'ont pas les mêmes normes revient à lui demander l\'impossible.',
    contre:
      'Sortir l\'agriculture des accords prive aussi les exportateurs français de débouchés, notamment vins et fromages.',
  },
  'lepen-logement-instaurer-dans-l-acces-au-logeme': {
    pour:
      'Le parc social est financé par la collectivité nationale, ce qui justifierait d\'en réserver l\'accès en priorité.',
    contre:
      'Un critère de nationalité dans l\'attribution contrevient au principe d\'égalité et serait censuré.',
  },
  'lepen-logement-remplacer-maprimerenov-par-un-di': {
    pour:
      'Le dispositif actuel est illisible, mal contrôlé et a nourri des fraudes : le remplacer permet de repartir sur des bases saines.',
    contre:
      'L\'économie annoncée suppose de rénover moins, alors que le parc mal isolé reste considérable.',
  },
  'lepen-transports-investir-dans-les-infrastructure': {
    pour:
      'Certains bassins d\'emploi restent mal reliés, ce qui décourage l\'installation d\'entreprises.',
    contre:
      'De nouvelles sorties autoroutières encouragent l\'étalement urbain et la circulation, à rebours des objectifs climatiques.',
  },
  'lepen-transports-supprimer-les-zones-a-faibles-em': {
    pour:
      'Ces zones excluent de fait ceux qui ne peuvent pas changer de véhicule, souvent sans transport alternatif.',
    contre:
      'Elles répondent à une pollution de l\'air responsable de dizaines de milliers de décès prématurés par an.',
  },
  'lepen-securite-identifier-des-lieux-pouvant-etr': {
    pour:
      'Les prisons sont surpeuplées, et mélanger courtes peines et détenus dangereux favorise la récidive.',
    contre:
      'Ouvrir des lieux allégés sans personnel supplémentaire déplace le problème au lieu de le résoudre.',
  },
  'lepen-securite-mettre-en-place-des-peines-planc': {
    pour:
      'Une peine minimale garantit une réponse ferme pour les récidivistes et ceux qui s\'en prennent aux agents publics.',
    contre:
      'Ces peines, déjà expérimentées puis abandonnées, ont surtout rempli les prisons sans faire baisser la récidive.',
  },
  'lepen-immigration-mettre-fin-a-l-accord-franco-alg': {
    pour:
      'Ce régime particulier échappe au droit commun des étrangers et n\'a jamais pu être renégocié depuis sa signature.',
    contre:
      'Le dénoncer sans accord de remplacement risque de bloquer la délivrance des laissez-passer nécessaires aux éloignements.',
  },
  'lepen-immigration-negocier-avec-les-partenaires-eu': {
    pour:
      'La libre circulation a été conçue entre États européens : la réserver à leurs ressortissants revient à son intention initiale.',
    contre:
      'Contrôler la nationalité aux frontières intérieures suppose de vérifier chaque passage, ce qui paralyserait la circulation.',
  },
  'lepen-defense-faire-de-la-lutte-contre-les-ing': {
    pour:
      'L\'espionnage économique vise directement les entreprises innovantes, souvent sans qu\'elles s\'en aperçoivent.',
    contre:
      'La mesure affirme une priorité sans indiquer les moyens supplémentaires ni la réorganisation nécessaires.',
  },
  'lepen-defense-renforcer-les-controles-sur-les-': {
    pour:
      'Le rachat d\'entreprises stratégiques par des capitaux étrangers a déjà fait perdre des technologies critiques.',
    contre:
      'Un contrôle trop large décourage l\'investissement étranger, dont dépendent aussi des emplois.',
  },
  'lepen-institutions-inscrire-dans-la-constitution-un': {
    pour:
      'Ce référendum permet de soumettre au vote un sujet que les élus refusent d\'inscrire à l\'ordre du jour.',
    contre:
      'Selon le seuil retenu, il peut servir à remettre en cause des droits fondamentaux par une majorité de circonstance.',
  },
  'lepen-institutions-supprimer-une-large-partie-des-a': {
    pour:
      'Beaucoup d\'autorités se sont ajoutées sans que leurs missions soient réévaluées, avec leurs budgets et leurs doublons.',
    contre:
      'Ces autorités existent précisément pour échapper au pouvoir politique : les réinternaliser supprime cette garantie.',
  },
  // --- Marine Tondelier ------------------------------------------------------
  'tondelier-economie-mettre-en-place-une-taxe-zucman-': {
    pour:
      'Les très grands patrimoines déclarent peu de revenus imposables : taxer l\'actif lui-même contourne cet écueil.',
    contre:
      'Évaluer chaque année un patrimoine non coté est complexe, et un taux annuel peut dépasser ce que le bien rapporte.',
  },
  'tondelier-economie-taxation-supplementaire-de-10-de': {
    pour:
      'Les très gros héritages concentrent la richesse d’une génération à l’autre : les taxer davantage réduit cette inégalité de départ.',
    contre:
      'Les grandes fortunes disposent de moyens pour transmettre autrement ou s’installer ailleurs, ce qui réduirait le rendement.',
  },
  'tondelier-numerique-faire-respecter-des-criteres-de-': {
    pour:
      'Un classement personnalisé enferme chacun dans ce qui le conforte, ce qui pèse particulièrement pendant une campagne.',
    contre:
      'Définir la neutralité d\'un algorithme est très difficile, et un fil non trié devient vite inutilisable.',
  },
  'tondelier-emploi-augmentation-du-smic-montant-non': {
    pour:
      'Quand les prix augmentent, les bas salaires perdent du pouvoir d’achat : les indexer protège les ménages les plus modestes.',
    contre:
      'Indexer les salaires sur les prix peut entretenir l’inflation, et une hausse du salaire minimum pèse sur les petites entreprises.',
  },
  'tondelier-emploi-augmenter-les-salaires-des-ensei': {
    pour:
      'Le métier ne recrute plus : des académies terminent la rentrée avec des postes vacants, faute de candidats.',
    contre:
      'Quinze pour cent sur près d\'un million d\'agents représentent plusieurs milliards par an, sans garantie que les vocations reviennent.',
  },
  'tondelier-emploi-conge-paye-climatique-de-cinq-jo': {
    pour:
      'Les canicules rendent certains postes dangereux : des jours dédiés protègent la santé des travailleurs les plus exposés.',
    contre:
      'Ces jours désorganiseraient le travail aux mêmes dates partout, et leur coût retomberait sur les employeurs.',
  },
  'tondelier-emploi-passer-le-salaire-minimum-a-2-00': {
    pour:
      'Le salaire minimum actuel ne suit plus le coût du logement et de l\'alimentation dans les grandes agglomérations.',
    contre:
      'Une hausse brutale renchérit le bas de l\'échelle, peut supprimer les emplois les moins qualifiés et tasse toute la grille.',
  },
  'tondelier-retraites-retraite-a-60-ans-pour-les-salar': {
    pour:
      'Revenir sur le recul de l’âge à 64 ans soulage les carrières longues et les métiers usants, qui en ont le plus souffert.',
    contre:
      'Abaisser l’âge de départ coûte plusieurs milliards par an au système de retraite, sans recette nouvelle précisée.',
  },
  'tondelier-sante-creer-2-000-nouveaux-centres-de-': {
    pour:
      'Les centres qui salarient leurs médecins attirent là où le libéral ne s\'installe plus, et pratiquent le tiers payant.',
    contre:
      'Ouvrir des murs ne crée pas de médecins : en situation de pénurie, ces centres se disputeraient les mêmes praticiens.',
  },
  'tondelier-sante-interdiction-des-aliments-ultrat': {
    pour:
      'Ces produits sont associés à l’obésité et à des maladies chroniques : en protéger les enfants est un enjeu de santé publique.',
    contre:
      'La définition d’un aliment « ultratransformé » ne fait pas consensus, et l’interdiction renchérirait les repas des cantines.',
  },
  'tondelier-solidarites-interdiction-du-secteur-lucratif': {
    pour:
      'Des enfants placés sont confiés à des structures privées peu contrôlées, et beaucoup se retrouvent seuls à 18 ans.',
    contre:
      'Les structures privées pallient le manque de places publiques : les exclure risque d’aggraver la pénurie d’accueil.',
  },
  'tondelier-solidarites-securite-sociale-ecologique-dont': {
    pour:
      'Mal se nourrir coûte en santé publique : garantir à tous une alimentation de qualité soutient aussi les producteurs.',
    contre:
      'Le coût d’une telle allocation pour toute la population serait considérable, et son financement n’est pas précisé.',
  },
  'tondelier-education-creation-d-un-ministere-de-l-enf': {
    pour:
      'Les politiques de l’enfance sont dispersées entre plusieurs ministères : les regrouper améliore leur cohérence.',
    contre:
      'Réorganiser les ministères prend du temps et ne garantit pas, à lui seul, davantage de moyens pour les enfants.',
  },
  'tondelier-education-reduire-la-taille-des-classes-de': {
    pour:
      'L\'effet d\'un effectif réduit est mesuré et durable sur les premières années, surtout pour les élèves les plus fragiles.',
    contre:
      'Cela suppose des dizaines de milliers de postes et de salles, alors que le métier peine déjà à recruter.',
  },
  'tondelier-environnement-modifier-la-ppe3-pour-que-la-par': {
    pour:
      'Les renouvelables s\'installent en quelques années là où un réacteur demande plus d\'une décennie.',
    contre:
      'Une part élevée d\'électricité intermittente suppose du stockage et du réseau que la mesure ne finance pas.',
  },
  'tondelier-environnement-planifier-la-sortie-du-nucleaire': {
    pour:
      'Le nucléaire produit des déchets durables et coûte de plus en plus cher : investir dans les renouvelables serait plus sûr.',
    contre:
      'Sortir du nucléaire impose de remplacer une électricité peu émettrice, au risque de recourir davantage au gaz.',
  },
  'tondelier-agriculture-interdiction-aux-tres-gros-chalu': {
    pour:
      'Les très grands chalutiers épuisent les stocks de poissons près des côtes, au détriment des petits pêcheurs locaux.',
    contre:
      'Les zones de pêche relèvent largement de l’Union européenne, et la France ne peut pas les réglementer seule.',
  },
  'tondelier-agriculture-planifier-une-sortie-progressive': {
    pour:
      'Un horizon lointain et annoncé laisse à la recherche et aux filières le temps de s\'adapter sans rupture brutale.',
    contre:
      'Aucune alternative n\'existe pour certaines cultures : fixer une date sans solution fait porter le risque aux producteurs.',
  },
  'tondelier-logement-atteindre-500-000-renovations-pe': {
    pour:
      'Seule une rénovation complète fait vraiment baisser la facture : les gestes isolés ne suffisent pas.',
    contre:
      'Le rythme visé est plusieurs fois supérieur au rythme actuel, dans un secteur qui manque déjà de main-d\'œuvre.',
  },
  'tondelier-logement-generaliser-ameliorer-et-perenni': {
    pour:
      'Là où il s\'applique, l\'encadrement a freiné la hausse des loyers sans faire disparaître l\'offre.',
    contre:
      'Plafonner le loyer décourage la mise en location et l\'entretien, et pousse vers la location de courte durée.',
  },
  'tondelier-logement-limitation-du-nombre-d-autorisat': {
    pour:
      'Dans les villes touristiques, ces locations retirent des logements aux habitants et font monter les loyers.',
    contre:
      'Ces locations apportent un revenu à de nombreux propriétaires et font vivre le tourisme dans les villes concernées.',
  },
  'tondelier-transports-creer-une-offre-de-location-soci': {
    pour:
      'Beaucoup de ménages ne peuvent pas acheter électrique mais pourraient louer : la location lève la barrière du prix d\'achat.',
    contre:
      'Un million de véhicules sur cinq ans suppose une production européenne qui n\'existe pas encore à ce volume.',
  },
  'tondelier-securite-creer-9-000-postes-de-magistrats': {
    pour:
      'Les délais de jugement atteignent plusieurs années, et le pays compte beaucoup moins de magistrats que ses voisins.',
    contre:
      'Recruter à ce rythme suppose de former pendant des années et de disposer de tribunaux pour les accueillir.',
  },
  'tondelier-securite-imprescriptibilite-de-tous-les-c': {
    pour:
      'Les victimes d’abus dans l’enfance parlent souvent très tard : supprimer le délai leur garantit de pouvoir porter plainte.',
    contre:
      'Des décennies après les faits, les preuves sont rares, et l’imprescriptibilité est réservée aux crimes contre l’humanité.',
  },
  'tondelier-immigration-regularisation-des-travailleurs-': {
    pour:
      'Ces travailleurs occupent des emplois dont l’économie a besoin : les régulariser les protège de l’exploitation.',
    contre:
      'Une régularisation large peut encourager de nouvelles arrivées irrégulières, et limite le contrôle des séjours.',
  },
  'tondelier-immigration-regulariser-les-travailleurs-les': {
    pour:
      'Des critères écrits remplacent le pouvoir d\'appréciation des préfectures, qui produit aujourd\'hui des décisions très inégales.',
    contre:
      'Des critères connus d\'avance constituent, pour ses opposants, une régularisation permanente et prévisible.',
  },
  'tondelier-defense-creation-d-un-haut-conseil-milit': {
    pour:
      'Coordonner les armées européennes évite les doublons et permet de réagir ensemble plus vite en cas de crise.',
    contre:
      'La défense reste une compétence nationale, et la plupart des pays européens s’en remettent d’abord à l’OTAN.',
  },
  'tondelier-defense-creer-un-commandement-militaire-': {
    pour:
      'Les Européens dépensent beaucoup pour des armées qui ne savent pas opérer ensemble : un commandement commun y remédie.',
    contre:
      'Un commandement dépourvu du pouvoir de mobiliser les armées reste une structure symbolique de plus.',
  },
  'tondelier-institutions-instauration-d-une-premiere-repu': {
    pour:
      'Le pouvoir est trop concentré entre les mains du chef de l’État : le rééquilibrer au profit du Parlement renforce la démocratie.',
    contre:
      'Changer de République ouvre une période d’incertitude, alors que la Constitution actuelle assure la stabilité des institutions.',
  },
  'tondelier-institutions-instaurer-la-proportionnelle-int': {
    pour:
      'La proportionnelle intégrale fait correspondre la composition de l\'Assemblée aux voix réellement exprimées.',
    contre:
      'Sans prime majoritaire, aucune majorité ne se dégage et le pouvoir passe aux négociations d\'après-scrutin.',
  },
  // --- Raphaël Glucksmann ----------------------------------------------------
  'glucksmann-economie-donner-aux-territoires-notamment': {
    pour:
      'Une région peut ainsi peser contre la fermeture d\'un site dont dépend tout un bassin d\'emploi.',
    contre:
      'Les collectivités n\'ont ni les moyens ni le métier d\'actionnaire, et engagent l\'argent public sur un risque industriel.',
  },
  'glucksmann-economie-flecher-une-part-des-revenus-de-': {
    pour:
      'Cette taxe est payée sur place : en réserver une part garantit qu\'elle finance des équipements sur place.',
    contre:
      'Elle finance déjà le budget de fonctionnement des communes, dont la marge se réduit d\'autant.',
  },
  'glucksmann-economie-taxe-sur-les-superprofits-des-mu': {
    pour:
      'Ces bénéfices viennent de la hausse des prix mondiaux plus que d’un effort des entreprises : les partager est jugé légitime.',
    contre:
      'Définir un bénéfice « exceptionnel » est délicat, et ces groupes réalisent l’essentiel de leurs profits hors de France.',
  },
  'glucksmann-numerique-combattre-les-algorithmes-toxiqu': {
    pour:
      'Corriger après coup n\'a jamais fonctionné : encadrer dès la conception s\'attaque à la cause plutôt qu\'aux symptômes.',
    contre:
      'L\'énoncé reste général : sans définir ce qu\'est un algorithme toxique, la règle est inapplicable.',
  },
  'glucksmann-numerique-contrecarrer-les-monopoles-techn': {
    pour:
      'Quelques entreprises fixent seules les règles d\'accès à des marchés entiers, et les amendes n\'y changent rien.',
    contre:
      'Ces sanctions relèvent de la Commission européenne : une position nationale a peu de portée à elle seule.',
  },
  'glucksmann-emploi-cheque-carburant-multiplie-par-t': {
    pour:
      'Dans les zones sans transports en commun, la voiture est indispensable : aider à payer le carburant soutient ces ménages.',
    contre:
      'Subventionner le carburant encourage sa consommation et coûte cher, alors que l’objectif affiché est de réduire les émissions.',
  },
  'glucksmann-emploi-hausse-de-la-remuneration-nette-': {
    pour:
      'Les très gros héritages se concentrent dans peu de mains : les taxer pour soutenir les revenus du travail rééquilibre l’effort.',
    contre:
      'Le rendement des taxes sur les héritages est incertain, et une hausse durable des salaires ne peut reposer sur cette seule recette.',
  },
  'glucksmann-retraites-abrogation-de-la-reforme-des-ret': {
    pour:
      'La réforme de 2023 a été adoptée sans vote final de l’Assemblée alors qu’une majorité de Français s’y opposait dans les sondages.',
    contre:
      'L’annuler coûte plusieurs milliards par an et aggrave le déficit des retraites, sans financement précisé.',
  },
  'glucksmann-retraites-depart-plus-tot-pour-les-carrier': {
    pour:
      'Tous ne vieillissent pas de la même façon : moduler l’âge selon l’usure rend l’effort demandé plus équitable.',
    contre:
      'Mesurer l’espérance de vie en bonne santé métier par métier est complexe, et toute frontière créera des contestations.',
  },
  'glucksmann-sante-assurer-la-contraception-gratuit': {
    pour:
      'Le coût des protections écarte des femmes précaires d\'un besoin qui n\'a rien d\'optionnel.',
    contre:
      'La gratuité pour toutes coûte sensiblement plus cher qu\'un dispositif ciblé sur celles qui en ont besoin.',
  },
  'glucksmann-sante-generaliser-le-pass-sport-sante-': {
    pour:
      'L\'activité physique est le moyen le mieux documenté de prévenir les maladies chroniques, et coûte moins cher que de les soigner.',
    contre:
      'Le dispositif profite surtout à ceux qui pratiquent déjà : toucher les sédentaires demande autre chose qu\'une aide financière.',
  },
  'glucksmann-solidarites-automatiser-l-acces-aux-droits-s': {
    pour:
      'Le non-recours atteint un tiers des ayants droit pour certaines aides : le versement automatique supprime la démarche.',
    contre:
      'Un dossier partagé entre tous les acteurs concentre des données très sensibles en un point unique.',
  },
  'glucksmann-solidarites-rendre-l-accessibilite-universel': {
    pour:
      'L\'accessibilité s\'est longtemps limitée au fauteuil roulant ; les handicaps cognitifs et sensoriels restent des angles morts.',
    contre:
      'Étendre l\'obligation à tous les handicaps représente un coût de mise aux normes considérable pour les communes et les commerces.',
  },
  'glucksmann-education-hausse-de-10-du-salaire-de-tous-': {
    pour:
      'Les enseignants du primaire sont moins payés que la moyenne européenne : une hausse rend le métier plus attractif.',
    contre:
      'Six milliards par an pèsent lourd dans un budget contraint, et la hausse ne règle pas seule les difficultés du métier.',
  },
  'glucksmann-education-plan-de-5-ans-pour-l-ecole-baiss': {
    pour:
      'Des classes moins chargées permettent de mieux suivre chaque élève, et beaucoup d’écoles sont mal isolées ou vétustes.',
    contre:
      'Réduire les effectifs exige de recruter des enseignants que l’on peine déjà à trouver, et les écoles relèvent des communes.',
  },
  'glucksmann-education-relance-des-colonies-de-vacances': {
    pour:
      'Beaucoup d’enfants ne partent jamais en vacances : un séjour collectif leur ouvre d’autres horizons et favorise la mixité.',
    contre:
      'Le secteur manque d’animateurs et de centres d’accueil, et garantir un séjour à chaque enfant aurait un coût élevé.',
  },
  'glucksmann-education-service-civique-obligatoire-de-d': {
    pour:
      'Une mission commune à tous les jeunes brasse les milieux sociaux et renforce l’engagement au service de la collectivité.',
    contre:
      'Encadrer chaque année une classe d’âge entière demande des moyens considérables, et l’obligation retarde études et emploi.',
  },
  'glucksmann-environnement-10-milliards-d-euros-pour-un-lea': {
    pour:
      'Le prix d’une voiture électrique reste hors de portée de beaucoup de ménages : la location aidée rend la transition accessible.',
    contre:
      'Dix milliards représentent une dépense élevée par véhicule, pour un effet sur les émissions jugé coûteux au regard d’autres aides.',
  },
  'glucksmann-environnement-deployer-des-conventions-citoyen': {
    pour:
      'Les mesures climatiques passent mieux quand des citoyens en ont délibéré que lorsqu\'elles sont imposées d\'en haut.',
    contre:
      'La précédente convention a vu ses propositions largement écartées : répéter l\'exercice sans engagement nourrit la déception.',
  },
  'glucksmann-agriculture-garantir-le-revenu-des-agriculte': {
    pour:
      'Un prix plancher empêche la vente à perte, ce que les lois successives n\'ont pas réussi à faire respecter.',
    contre:
      'Un prix garanti détaché du marché encourage la surproduction et se heurte aux règles de concurrence européennes.',
  },
  'glucksmann-agriculture-instaurer-un-revenu-de-transitio': {
    pour:
      'Le passage au bio fait chuter les rendements plusieurs années : accompagner ce creux est précisément ce qui manque.',
    contre:
      'Le dispositif finance la conversion sans garantir les débouchés, alors que la demande en bio a reculé.',
  },
  'glucksmann-logement-retablir-l-obligation-d-accessib': {
    pour:
      'Rendre accessible dès la construction coûte une fraction d\'une adaptation ultérieure, et la population vieillit.',
    contre:
      'L\'obligation renchérit chaque logement neuf et réduit les surfaces habitables, dans un marché déjà tendu.',
  },
  'glucksmann-transports-relancer-les-trains-de-nuit-acce': {
    pour:
      'Le train de nuit remplace l\'avion sur des trajets où la grande vitesse ne serait pas rentable.',
    contre:
      'Le matériel de nuit a été démantelé et coûte cher à reconstituer, pour un nombre de voyageurs limité.',
  },
  'glucksmann-transports-rendre-l-accessibilite-universel': {
    pour:
      'Sans transport accessible, l\'emploi et les soins restent hors d\'atteinte quels que soient les autres droits reconnus.',
    contre:
      'Mettre aux normes des réseaux anciens représente des coûts que les collectivités ne peuvent pas absorber seules.',
  },
  'glucksmann-securite-deployer-massivement-la-justice-': {
    pour:
      'La confrontation aux conséquences de l\'acte réduit la récidive plus efficacement qu\'une courte peine de prison.',
    contre:
      'Ces dispositifs demandent un encadrement important et restent mal compris des victimes comme du public.',
  },
  'glucksmann-immigration-creer-une-force-europeenne-de-sa': {
    pour:
      'Des milliers de personnes meurent chaque année en Méditerranée, et le sauvetage repose surtout sur des navires associatifs.',
    contre:
      'Ses opposants estiment qu\'un dispositif permanent de secours encourage les départs et l\'activité des passeurs.',
  },
  'glucksmann-immigration-organisation-d-une-convention-ci': {
    pour:
      'Le sujet est très polarisé : un débat entre citoyens tirés au sort permet de dépasser les postures et d’informer.',
    contre:
      'Les conclusions de la convention pour le climat ont été en partie écartées, et ce format ne tranche pas le débat.',
  },
  'glucksmann-defense-grand-emprunt-europeen-au-servic': {
    pour:
      'Emprunter ensemble coûte moins cher et permet des investissements qu’aucun pays ne peut financer seul, comme en 2020.',
    contre:
      'Plusieurs pays du Nord s’opposent à une nouvelle dette commune, qui alourdirait les remboursements futurs.',
  },
  'glucksmann-defense-suppression-du-droit-de-veto-au-': {
    pour:
      'Un seul État peut aujourd’hui paralyser l’Union, notamment en politique étrangère : voter à la majorité la rend plus efficace.',
    contre:
      'La France perdrait elle aussi la possibilité de bloquer une décision contraire à ses intérêts, et la réforme exige l’accord de tous.',
  },
  'glucksmann-institutions-renouer-avec-l-esprit-des-accord': {
    pour:
      'Le retour au dialogue est la seule issue après des affrontements qui ont montré l\'échec d\'une décision imposée.',
    contre:
      'Rouvrir la discussion sans cadre clair prolonge une incertitude qui pèse sur l\'économie et la sécurité de l\'archipel.',
  },
  // --- Xavier Bertrand -------------------------------------------------------
  'bertrand-economie-mettre-fin-aux-differences-de-jo': {
    pour:
      'Une même règle pour tous les salariés met fin à une différence de traitement que peu de gens savent justifier.',
    contre:
      'Aligner par le bas revient à réduire la protection de millions d\'agents plutôt qu\'à relever celle du privé.',
  },
  'bertrand-economie-relever-le-prelevement-forfaitai': {
    pour:
      'Un taux unique bas rend les revenus du capital moins imposés que le salaire : le relever rapproche les deux.',
    contre:
      'Ce taux unique avait mis fin à la fuite de l\'épargne ; le relever peut relancer les arbitrages vers l\'étranger.',
  },
  'bertrand-retraites-developper-la-retraite-par-capit': {
    pour:
      'Un étage par capitalisation complète la répartition et diversifie les sources de financement des pensions.',
    contre:
      'La capitalisation soumet la retraite aux marchés financiers et ne protège pas ceux qui n\'ont rien à épargner.',
  },
  'bertrand-sante-adopter-une-loi-pluriannuelle-de': {
    pour:
      'Le budget voté chaque année empêche les hôpitaux de planifier leurs recrutements et leurs investissements.',
    contre:
      'Une trajectoire pluriannuelle contraint aussi : elle enferme le système si une crise sanitaire survient.',
  },
  'bertrand-sante-creation-d-un-chu-en-corse-adapt': {
    pour:
      'Faute d’hôpital universitaire, de nombreux patients doivent se faire soigner sur le continent, ce qui retarde les soins.',
    contre:
      'Un tel hôpital exige un bassin de population et de médecins suffisant pour former et soigner à un niveau universitaire.',
  },
  'bertrand-sante-creer-en-corse-un-centre-hospita': {
    pour:
      'L\'île n\'a pas de centre hospitalier universitaire, ce qui oblige à évacuer des patients vers le continent.',
    contre:
      'Les partenariats public-privé hospitaliers ont laissé des loyers très lourds, parfois pendant trente ans.',
  },
  'bertrand-education-consacrer-1-du-budget-de-l-etat-': {
    pour:
      'Un objectif chiffré protège la culture des coupes budgétaires et soutient un secteur qui fait vivre de nombreux territoires.',
    contre:
      'Augmenter la part de la culture suppose de réduire d’autres dépenses, dans un budget déjà sous tension.',
  },
  'bertrand-education-developper-le-mecenat-culturel-e': {
    pour:
      'Le mécénat apporte des financements que le budget public ne fournit plus, et implique les entreprises d\'un territoire.',
    contre:
      'Il va vers ce qui est visible et prestigieux, rarement vers la création risquée ou les zones isolées.',
  },
  'bertrand-education-faire-en-sorte-que-chaque-eleve-': {
    pour:
      'Beaucoup d’enfants n’entrent jamais dans un théâtre ou un musée : l’école peut leur garantir au moins une rencontre.',
    contre:
      'Une seule sortie sur toute la scolarité reste modeste, et son organisation dépend des moyens de chaque établissement.',
  },
  'bertrand-education-soutenir-le-developpement-des-la': {
    pour:
      'Ces langues disparaissent avec leurs derniers locuteurs, et l\'enseignement est le seul moyen de les transmettre.',
    contre:
      'Les heures qu\'elles occupent se prennent sur d\'autres enseignements, dans un temps scolaire déjà plein.',
  },
  'bertrand-agriculture-supprimer-les-surtranspositions-': {
    pour:
      'Les producteurs français appliquent des règles plus contraignantes que leurs concurrents sur le même marché.',
    contre:
      'Certaines de ces règles protègent la santé ou l\'eau : les supprimer sans distinction revient à un alignement par le bas.',
  },
  'bertrand-securite-instaurer-des-peines-minimales-p': {
    pour:
      'Les agressions contre élus et secours augmentent, et une peine plancher affirme une protection particulière.',
    contre:
      'Une peine minimale retire au juge la faculté d\'adapter la sanction, ce que le Conseil constitutionnel encadre strictement.',
  },
  'bertrand-securite-telesurveillance-et-drones-pour-': {
    pour:
      'Détecter un feu dans les premières minutes change tout pour l’éteindre, et la plupart des incendies sont d’origine humaine.',
    contre:
      'Surveiller des millions d’hectares coûte cher, et les sanctions lourdes existent déjà sans dissuader les incendiaires.',
  },
  'bertrand-defense-proposer-avec-le-danemark-un-par': {
    pour:
      'Le Groenland concentre des ressources critiques et une position stratégique que d\'autres puissances convoitent.',
    contre:
      'Un tel partenariat dépend d\'abord de la volonté des Groenlandais, que la mesure ne peut pas préjuger.',
  },
  'bertrand-defense-saisir-la-cour-de-justice-de-l-u': {
    pour:
      'L\'accord expose les agriculteurs à des produits qui ne respectent pas les normes imposées en Europe.',
    contre:
      'Un recours a peu de chances d\'aboutir contre un accord ratifié, et isolerait la France parmi ses partenaires.',
  },
  'bertrand-institutions-republique-des-territoires-etat-': {
    pour:
      'Les collectivités sont plus proches des besoins : leur confier davantage rend l’action publique plus efficace et lisible.',
    contre:
      'Décentraliser fortement peut creuser les écarts entre territoires riches et pauvres, au détriment de l’égalité.',
  },
  'bertrand-institutions-accorder-a-la-corse-une-autonomi': {
    pour:
      'Une île éloignée du continent a des réalités que la loi nationale traite mal : pouvoir adapter les règles y répond.',
    contre:
      'Créer une catégorie à part dans la République ouvre la voie à des demandes comparables ailleurs.',
  },
  'bertrand-institutions-donner-un-cadre-pluriannuel-a-l-': {
    pour:
      'Une enveloppe renégociée chaque année empêche de planifier les liaisons et les investissements de long terme.',
    contre:
      'Figer une enveloppe sur plusieurs années réduit la capacité de l\'ajuster quand les besoins changent.',
  },
  'bertrand-institutions-favorable-a-l-autonomie-de-la-co': {
    pour:
      'L’île a une identité et des contraintes particulières : une autonomie validée par ses habitants respecte leur choix.',
    contre:
      'Une autonomie pour un territoire peut en appeler d’autres et remettre en cause l’unité de la République.',
  },
  'bertrand-institutions-fusionner-une-partie-des-mandats': {
    pour:
      'Le nombre d\'élus locaux est parmi les plus élevés d\'Europe, et les compétences des deux échelons se recoupent largement.',
    contre:
      'Moins d\'élus, c\'est moins de proximité, surtout dans les territoires ruraux déjà éloignés des services publics.',
  },
  'bertrand-institutions-permettre-l-adaptation-des-lois-': {
    pour:
      'Une même règle appliquée en montagne et en zone dense produit des effets opposés : l\'adaptation relève du bon sens.',
    contre:
      'L\'égalité devant la loi est un principe constitutionnel, que multiplier les régimes locaux fragilise.',
  },
  'bertrand-institutions-s-il-est-elu-n-exercer-qu-un-seu': {
    pour:
      'Sans perspective de réélection, un président peut prendre des décisions impopulaires mais nécessaires.',
    contre:
      'Un président qui ne peut être réélu perd de l’autorité en fin de mandat, et les électeurs ne peuvent pas le reconduire.',
  },
  'bertrand-institutions-soumettre-l-autonomie-de-la-cors': {
    pour:
      'Un changement de statut engage durablement l\'île : le soumettre à ses habitants en assure la légitimité.',
    contre:
      'Un vote local sur une question constitutionnelle pose la question de qui décide, l\'île ou la nation tout entière.',
  },
  'bertrand-institutions-transferer-aux-territoires-la-re': {
    pour:
      'Les besoins en logement et en soins varient énormément d\'un territoire à l\'autre : décider sur place colle mieux au réel.',
    contre:
      'Transférer la santé aux territoires risque d\'installer des différences d\'accès aux soins selon le lieu de résidence.',
  },
};
