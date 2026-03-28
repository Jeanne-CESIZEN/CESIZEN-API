import "dotenv/config";
import { prisma } from "../../../src/config/database.js";

// ---------------------------------------------------------------------------
// Articles de démonstration avec contenu HTML réel sur la santé mentale
// 2 à 3 articles par catégorie (5 catégories = 13 articles)
// ---------------------------------------------------------------------------

const DEMO_ARTICLES: {
  categoryName: string;
  title: string;
  description: string;
  content: string;
}[] = [
  // ──────────────────────────────────────────────────────
  // SANTÉ MENTALE
  // ──────────────────────────────────────────────────────
  {
    categoryName: "Santé mentale",
    title: "Comprendre l'anxiété : causes, symptômes et pistes d'action",
    description:
      "L'anxiété est l'une des formes de souffrance psychologique les plus répandues. Comprendre ses mécanismes est la première étape pour mieux la gérer au quotidien.",
    content: `<h2>Qu'est-ce que l'anxiété ?</h2>
<p>L'anxiété est une réaction naturelle de l'organisme face à une situation perçue comme menaçante ou incertaine. Elle mobilise notre corps et notre esprit pour faire face au danger. Mais lorsqu'elle devient excessive, persistante ou disproportionnée par rapport à la situation réelle, elle peut sérieusement altérer la qualité de vie.</p>
<p>On distingue plusieurs formes d'anxiété :</p>
<ul>
  <li><strong>L'anxiété généralisée</strong> : un état de préoccupation chronique concernant de nombreux aspects de la vie quotidienne.</li>
  <li><strong>Les crises de panique</strong> : des épisodes soudains et intenses de peur accompagnés de symptômes physiques marqués.</li>
  <li><strong>Les phobies</strong> : une peur intense et irrationnelle d'un objet ou d'une situation spécifique.</li>
  <li><strong>L'anxiété sociale</strong> : une peur du jugement d'autrui dans les situations sociales.</li>
</ul>

<h2>Les symptômes à reconnaître</h2>
<p>L'anxiété se manifeste sur plusieurs plans :</p>
<ul>
  <li><strong>Physiquement</strong> : palpitations, tension musculaire, transpiration, maux de tête, troubles du sommeil, difficultés digestives.</li>
  <li><strong>Cognitivement</strong> : pensées intrusives, ruminations, scénarios catastrophistes, difficultés de concentration.</li>
  <li><strong>Comportementalement</strong> : évitement des situations redoutées, irritabilité, repli sur soi.</li>
</ul>

<h2>Pourquoi devient-on anxieux ?</h2>
<p>Les causes sont multiples et souvent intriquées : facteurs génétiques, expériences traumatiques passées, environnement de vie stressant, perfectionnisme, faible estime de soi. La bonne nouvelle ? Ces facteurs peuvent être travaillés.</p>

<h2>Que faire concrètement ?</h2>
<p>Plusieurs approches ont fait leurs preuves :</p>
<ul>
  <li>La <strong>cohérence cardiaque</strong> pour calmer rapidement le système nerveux</li>
  <li>Les <strong>thérapies cognitives et comportementales (TCC)</strong>, efficaces pour modifier les schémas de pensée anxieux</li>
  <li>La <strong>pleine conscience (mindfulness)</strong> pour développer une présence au moment présent</li>
  <li>L'<strong>activité physique régulière</strong>, dont les effets anxiolytiques sont scientifiquement documentés</li>
  <li>Un <strong>soutien professionnel</strong> (psychologue, psychiatre) lorsque l'anxiété devient handicapante</li>
</ul>
<p>N'hésitez pas à en parler à votre médecin traitant : l'anxiété est une réalité médicale, pas une faiblesse.</p>`,
  },
  {
    categoryName: "Santé mentale",
    title: "Burnout : reconnaître l'épuisement professionnel avant qu'il ne s'installe",
    description:
      "Le burnout ne survient pas du jour au lendemain. Il s'installe progressivement, et ses signes avant-coureurs peuvent rester longtemps invisibles. Comment les repérer à temps ?",
    content: `<h2>Le burnout, qu'est-ce que c'est exactement ?</h2>
<p>Le syndrome d'épuisement professionnel, communément appelé <strong>burnout</strong>, est un état d'épuisement intense — physique, émotionnel et mental — résultant d'une exposition prolongée à des situations de travail exigeantes. Il a été reconnu par l'Organisation mondiale de la santé (OMS) comme un phénomène lié au travail.</p>
<p>Il se caractérise par trois dimensions :</p>
<ul>
  <li>L'<strong>épuisement émotionnel</strong> : sentiment d'être vidé de ses ressources intérieures</li>
  <li>La <strong>dépersonnalisation</strong> : attitude de détachement, de cynisme vis-à-vis du travail et des collègues</li>
  <li>La <strong>réduction du sentiment d'accomplissement personnel</strong> : sentiment d'inefficacité et de perte de sens</li>
</ul>

<h2>Les signaux d'alarme à surveiller</h2>
<p>Le burnout s'installe insidieusement. Voici les signes à ne pas ignorer :</p>
<ul>
  <li>Fatigue persistante qui ne disparaît pas après le repos</li>
  <li>Difficulté à se lever le matin, appréhension du lendemain</li>
  <li>Irritabilité, impatience, sautes d'humeur</li>
  <li>Oublis fréquents, difficultés de concentration</li>
  <li>Sentiment de ne plus être à la hauteur malgré de gros efforts</li>
  <li>Isolement progressif, désintérêt pour les activités autrefois appréciées</li>
  <li>Douleurs physiques sans cause organique trouvée</li>
</ul>

<h2>Qui est concerné ?</h2>
<p>Contrairement aux idées reçues, le burnout ne touche pas uniquement les personnes "trop investies dans leur travail". Il peut atteindre toute personne exposée à des exigences excessives, un manque de reconnaissance, une perte d'autonomie ou des conflits de valeurs au travail. Les aidants, les soignants et les enseignants sont statistiquement parmi les plus touchés.</p>

<h2>Comment s'en sortir ?</h2>
<p>La récupération prend du temps et nécessite souvent une pause professionnelle. Elle passe par :</p>
<ul>
  <li>Un <strong>arrêt de travail</strong> si nécessaire — c'est un acte médical, pas un échec</li>
  <li>Un <strong>accompagnement thérapeutique</strong> (psychologue, médecin du travail)</li>
  <li>Une <strong>réorganisation de ses priorités</strong> et de ses limites personnelles</li>
  <li>La <strong>reconstruction progressive</strong> de ressources : sommeil, activité physique, liens sociaux</li>
</ul>
<p>Si vous vous reconnaissez dans ces signes, parlez-en sans attendre à votre médecin.</p>`,
  },
  {
    categoryName: "Santé mentale",
    title: "Dépression et tristesse : comment faire la différence ?",
    description:
      "Ressentir de la tristesse est humain et nécessaire. Mais quand cette tristesse devient un état permanent qui envahit tous les aspects de la vie, on parle de dépression. Voici comment distinguer l'une de l'autre.",
    content: `<h2>La tristesse, une émotion indispensable</h2>
<p>La tristesse est une émotion fondamentale, universelle, qui apparaît naturellement face à une perte, une déception ou une difficulté. Elle est utile : elle nous permet de prendre conscience d'un manque, de ralentir et de nous reconnecter à nos besoins profonds. En ce sens, ressentir de la tristesse est <strong>sain et nécessaire</strong>.</p>
<p>Une tristesse normale est liée à un événement identifiable, d'intensité proportionnée, et s'estompe progressivement avec le temps.</p>

<h2>La dépression, une maladie à part entière</h2>
<p>La dépression est tout autre chose. C'est un trouble de l'humeur caractérisé par une tristesse profonde, persistante (au moins deux semaines) et envahissante, sans lien nécessaire avec un événement déclencheur. Elle touche environ <strong>1 personne sur 5</strong> au cours de sa vie.</p>
<p>Ses critères diagnostiques incluent :</p>
<ul>
  <li>Humeur dépressive la majeure partie du temps</li>
  <li>Perte d'intérêt ou de plaisir pour les activités habituelles (anhédonie)</li>
  <li>Fatigue importante, perte d'énergie</li>
  <li>Troubles du sommeil (insomnie ou hypersomnie)</li>
  <li>Troubles de l'appétit (perte ou prise de poids)</li>
  <li>Difficultés de concentration, troubles de la mémoire</li>
  <li>Sentiments de dévalorisation, de culpabilité excessive</li>
  <li>Dans les cas graves : pensées liées à la mort ou au suicide</li>
</ul>

<h2>Les différences clés</h2>
<p>Quelques repères pour distinguer tristesse ordinaire et dépression :</p>
<ul>
  <li><strong>La durée</strong> : la dépression dure, la tristesse passe</li>
  <li><strong>L'intensité</strong> : la dépression envahit tous les domaines de la vie</li>
  <li><strong>La capacité à ressentir du plaisir</strong> : dans la dépression, elle disparaît presque entièrement</li>
  <li><strong>Le lien au contexte</strong> : la tristesse est liée à une cause, la dépression pas forcément</li>
</ul>

<h2>Demander de l'aide</h2>
<p>Si vous pensez souffrir de dépression, consultez un médecin ou un professionnel de santé mentale. La dépression est une maladie — pas une faiblesse, pas un manque de volonté. Elle se traite, souvent avec de bons résultats, grâce à la psychothérapie, aux médicaments ou à leur combinaison.</p>`,
  },

  // ──────────────────────────────────────────────────────
  // BIEN-ÊTRE
  // ──────────────────────────────────────────────────────
  {
    categoryName: "Bien-être",
    title: "Le sommeil, pilier fondamental de la santé mentale",
    description:
      "On sait que le sommeil est vital pour le corps. Mais son rôle sur la santé psychologique est tout aussi décisif. Un mauvais sommeil fragilise notre équilibre émotionnel, notre mémoire et notre résistance au stress.",
    content: `<h2>Pourquoi le sommeil est-il si important pour le mental ?</h2>
<p>Pendant le sommeil, le cerveau est loin d'être inactif. Il consolide les souvenirs, régule les émotions, élimine les déchets métaboliques accumulés durant la journée. C'est aussi pendant le sommeil profond que l'organisme secrète les hormones de récupération et régule le cortisol, l'hormone du stress.</p>
<p>Un manque de sommeil chronique entraîne :</p>
<ul>
  <li>Une plus grande réactivité émotionnelle et une irritabilité accrue</li>
  <li>Des difficultés de concentration et de prise de décision</li>
  <li>Une vulnérabilité augmentée à l'anxiété et à la dépression</li>
  <li>Une altération des mécanismes de régulation du stress</li>
</ul>

<h2>De combien d'heures avez-vous besoin ?</h2>
<p>Les besoins varient selon les individus, mais les recommandations générales sont :</p>
<ul>
  <li>Adultes : <strong>7 à 9 heures</strong> par nuit</li>
  <li>Adolescents : 8 à 10 heures</li>
  <li>Personnes âgées : 7 à 8 heures (avec souvent plus de difficultés à atteindre un sommeil profond)</li>
</ul>
<p>Au-delà de la durée, c'est la <strong>qualité</strong> du sommeil qui compte : un sommeil morcelé, même long, ne remplit pas pleinement ses fonctions réparatrices.</p>

<h2>Les ennemis du sommeil</h2>
<ul>
  <li><strong>Les écrans</strong> : la lumière bleue inhibe la mélatonine, l'hormone du sommeil</li>
  <li><strong>La caféine</strong> : sa demi-vie est de 5 à 7 heures — un café en début d'après-midi peut encore perturber l'endormissement</li>
  <li><strong>L'alcool</strong> : s'il favorise l'endormissement, il fragmente le sommeil et supprime les phases de sommeil paradoxal</li>
  <li><strong>Les horaires irréguliers</strong> : ils perturbent l'horloge biologique interne</li>
  <li><strong>Le stress et les ruminations</strong> : l'anxiété nocturne est l'une des principales causes d'insomnie</li>
</ul>

<h2>Conseils pratiques pour mieux dormir</h2>
<ul>
  <li>Maintenir des horaires de coucher et de lever réguliers, même le week-end</li>
  <li>Créer un rituel de décompression 30 à 60 minutes avant le coucher (lecture, bain chaud, respiration)</li>
  <li>Éviter les écrans au moins une heure avant de dormir</li>
  <li>Garder la chambre fraîche (18-19°C), sombre et calme</li>
  <li>Ne pas rester au lit si vous n'arrivez pas à dormir : levez-vous et faites une activité calme</li>
  <li>En cas d'insomnie chronique, consulter : les thérapies cognitives et comportementales pour l'insomnie (TCC-I) sont très efficaces</li>
</ul>`,
  },
  {
    categoryName: "Bien-être",
    title: "Alimentation et humeur : ce que vous mettez dans votre assiette affecte votre cerveau",
    description:
      "Le lien entre alimentation et santé mentale est de mieux en mieux documenté. Les nutriments que nous consommons influencent directement la production de nos neurotransmetteurs, et donc notre humeur.",
    content: `<h2>Le cerveau, un organe très gourmand</h2>
<p>Le cerveau représente environ 2% du poids corporel mais consomme à lui seul <strong>20% de notre énergie totale</strong>. Il a besoin d'un apport constant et équilibré en nutriments pour fonctionner de façon optimale. Ce n'est pas anodin : ce que nous mangeons a un impact direct sur notre production de neurotransmetteurs comme la sérotonine (impliquée dans la régulation de l'humeur), la dopamine (liée à la motivation et au plaisir) ou le GABA (qui favorise la détente).</p>

<h2>Les nutriments clés pour la santé mentale</h2>
<ul>
  <li><strong>Les oméga-3</strong> (poissons gras, noix, graines de lin) : essentiels à la structure des membranes neuronales et aux fonctions anti-inflammatoires cérébrales. Des études associent leur carence à un risque accru de dépression.</li>
  <li><strong>Le tryptophane</strong> (œufs, légumineuses, banane, fromage) : précurseur de la sérotonine, le tryptophane est un acide aminé essentiel que l'organisme ne sait pas synthétiser seul.</li>
  <li><strong>Le magnésium</strong> (chocolat noir, légumes verts, noix) : intervient dans plus de 300 réactions enzymatiques. Sa carence est associée à l'anxiété et à la fatigue nerveuse.</li>
  <li><strong>Les vitamines B</strong> (céréales complètes, légumineuses, viandes) : indispensables au métabolisme cérébral et à la production d'énergie neuronale.</li>
  <li><strong>Le fer</strong> (viandes, légumineuses, épinards) : une carence peut causer fatigue mentale, difficultés de concentration et humeur basse.</li>
</ul>

<h2>Le microbiote intestinal, un "deuxième cerveau"</h2>
<p>L'intestin et le cerveau sont reliés par le <strong>nerf vague</strong> et communiquent en permanence via ce qu'on appelle l'axe intestin-cerveau. Le microbiote intestinal (l'ensemble des bactéries qui peuplent notre intestin) influence directement notre humeur, notre niveau de stress et notre cognition.</p>
<p>Pour prendre soin de votre microbiote :</p>
<ul>
  <li>Consommez des aliments fermentés (yaourt, kéfir, choucroute, kimchi)</li>
  <li>Augmentez votre consommation de fibres (légumes, fruits, légumineuses, céréales complètes)</li>
  <li>Limitez les aliments ultra-transformés et le sucre raffiné</li>
</ul>

<h2>Ce qu'il vaut mieux limiter</h2>
<ul>
  <li><strong>Le sucre raffiné</strong> : provoque des pics et des chutes de glycémie qui se traduisent par des variations d'humeur</li>
  <li><strong>L'alcool</strong> : dépresseur du système nerveux central malgré son effet euphorisant initial</li>
  <li><strong>Les aliments ultra-transformés</strong> : associés à un risque accru de dépression et d'anxiété dans plusieurs études épidémiologiques</li>
  <li><strong>La caféine en excès</strong> : peut amplifier l'anxiété et perturber le sommeil</li>
</ul>`,
  },

  // ──────────────────────────────────────────────────────
  // PRATIQUES
  // ──────────────────────────────────────────────────────
  {
    categoryName: "Pratiques",
    title: "La cohérence cardiaque : une technique simple pour gérer le stress en 5 minutes",
    description:
      "La cohérence cardiaque est une technique de régulation du système nerveux autonome basée sur la respiration. Accessible à tous, elle peut être pratiquée n'importe où, en quelques minutes.",
    content: `<h2>Qu'est-ce que la cohérence cardiaque ?</h2>
<p>La cohérence cardiaque est un état physiologique particulier dans lequel le rythme cardiaque oscille de façon régulière et harmonieuse, synchronisé avec la respiration. Cet état est associé à un équilibre optimal du système nerveux autonome, avec une réduction mesurable du cortisol (hormone du stress) et une augmentation de la DHEA (hormone de bien-être).</p>
<p>Elle a été popularisée par le Dr David Servan-Schreiber et validée par de nombreuses études scientifiques, notamment celles du HeartMath Institute aux États-Unis.</p>

<h2>Le principe : respirer à 6 cycles par minute</h2>
<p>Le protocole le plus répandu est le <strong>365</strong> :</p>
<ul>
  <li><strong>3</strong> fois par jour</li>
  <li><strong>6</strong> respirations par minute</li>
  <li><strong>5</strong> minutes à chaque séance</li>
</ul>
<p>Une respiration à 6 cycles par minute correspond à :</p>
<ul>
  <li><strong>Inspiration</strong> : 5 secondes</li>
  <li><strong>Expiration</strong> : 5 secondes</li>
</ul>
<p>C'est tout. Pas besoin d'équipement, pas de posture particulière — juste votre respiration.</p>

<h2>Les effets documentés</h2>
<ul>
  <li>Réduction du cortisol salivaire d'environ 23% après 6 semaines de pratique régulière</li>
  <li>Diminution de l'anxiété et amélioration de l'humeur</li>
  <li>Meilleure récupération après un événement stressant</li>
  <li>Amélioration des performances cognitives (concentration, mémoire de travail)</li>
  <li>Bénéfices sur la variabilité de la fréquence cardiaque, indicateur de bonne santé cardiovasculaire</li>
</ul>

<h2>Quand la pratiquer ?</h2>
<p>Le moment idéal est le matin au réveil (pour bien démarrer la journée), avant le déjeuner (pour décompresser la matinée) et en fin d'après-midi (pour préparer la soirée). Mais l'essentiel est la régularité : <strong>5 minutes par jour, tous les jours</strong>, sont plus efficaces que 30 minutes deux fois par semaine.</p>
<p>Elle est particulièrement utile avant une situation stressante (réunion, examen, entretien) ou lors d'un pic d'anxiété.</p>

<h2>Pour aller plus loin</h2>
<p>Il existe de nombreuses variantes (748, 46, etc.) et applications pour se guider. L'application CESIZen propose un exercice de cohérence cardiaque guidé que vous pouvez personnaliser selon vos préférences.</p>`,
  },
  {
    categoryName: "Pratiques",
    title: "Méditation de pleine conscience : par où commencer ?",
    description:
      "La pleine conscience (mindfulness) est aujourd'hui l'une des pratiques les mieux documentées scientifiquement pour réduire le stress et améliorer le bien-être. Voici un guide pratique pour débutants.",
    content: `<h2>La pleine conscience, c'est quoi exactement ?</h2>
<p>La pleine conscience (ou <em>mindfulness</em> en anglais) est la capacité à porter intentionnellement son attention sur l'expérience du moment présent — sensations corporelles, pensées, émotions — avec une attitude d'ouverture et de non-jugement.</p>
<p>Ce n'est pas de "ne penser à rien" (ce qui est impossible) ni de "se relaxer" au sens passif du terme. C'est plutôt <strong>observer ce qui se passe en soi et autour de soi, sans chercher à le changer</strong>.</p>

<h2>Ce que dit la science</h2>
<p>Des centaines d'études cliniques ont démontré les effets bénéfiques de la méditation de pleine conscience sur :</p>
<ul>
  <li>La réduction du stress et de l'anxiété</li>
  <li>La prévention des rechutes dépressives</li>
  <li>L'amélioration de la qualité du sommeil</li>
  <li>La gestion de la douleur chronique</li>
  <li>L'augmentation de la concentration et des capacités attentionnelles</li>
  <li>Le renforcement du système immunitaire</li>
</ul>

<h2>Par où commencer : un exercice de 5 minutes</h2>
<p>Pas besoin de cours ni d'application pour commencer. Voici un exercice simple :</p>
<ol>
  <li>Installez-vous confortablement, assis ou allongé</li>
  <li>Fermez les yeux et portez votre attention sur votre respiration</li>
  <li>Observez le souffle : l'air qui entre, les poumons qui se gonflent, l'air qui sort</li>
  <li>Quand votre esprit s'échappe vers des pensées (c'est inévitable !), notez-le simplement et ramenez doucement l'attention sur la respiration</li>
  <li>Sans vous juger. Sans frustration. Recommencer, c'est déjà méditer.</li>
</ol>

<h2>Conseils pour installer une pratique durable</h2>
<ul>
  <li><strong>Commencez petit</strong> : 5 minutes par jour valent mieux que 30 minutes une fois par semaine</li>
  <li><strong>Choisissez un moment fixe</strong> : le matin avant de regarder votre téléphone est souvent idéal</li>
  <li><strong>Ne visez pas la perfection</strong> : une séance où l'esprit vagabonde beaucoup est une bonne séance aussi</li>
  <li><strong>Utilisez des applications guide</strong> si le silence vous déstabilise au départ (Petit Bambou, Insight Timer…)</li>
</ul>

<h2>La pleine conscience dans la vie quotidienne</h2>
<p>La méditation formelle (assis, en silence) n'est qu'une porte d'entrée. L'objectif est d'intégrer la pleine conscience dans les gestes du quotidien : manger en savourant chaque bouchée, marcher en sentant le sol sous ses pieds, écouter vraiment quelqu'un sans penser à sa réponse. C'est ce qu'on appelle la <strong>pratique informelle</strong>, et elle peut transformer profondément la relation à l'expérience quotidienne.</p>`,
  },
  {
    categoryName: "Pratiques",
    title: "Le journal émotionnel : écrire pour mieux se comprendre",
    description:
      "Tenir un journal de ses émotions est une pratique simple et puissante pour développer la conscience de soi, identifier ses déclencheurs émotionnels et construire une plus grande stabilité intérieure.",
    content: `<h2>Pourquoi tenir un journal émotionnel ?</h2>
<p>L'écriture a un effet unique sur notre psychisme. Elle nous force à <strong>mettre des mots sur des ressentis</strong> souvent vagues, ce qui les rend plus maniables, moins envahissants. Des recherches menées par le Dr James Pennebaker, psychologue à l'Université du Texas, ont montré que l'écriture expressive régulière améliore la santé physique et mentale, réduit l'anxiété et renforce le système immunitaire.</p>
<p>Le journal émotionnel, spécifiquement, permet de :</p>
<ul>
  <li>Identifier ses émotions récurrentes et leurs déclencheurs</li>
  <li>Prendre du recul sur les situations difficiles</li>
  <li>Observer l'évolution de son état intérieur dans le temps</li>
  <li>Développer sa tolérance à l'inconfort émotionnel</li>
</ul>

<h2>Comment commencer ?</h2>
<p>Il n'y a pas de règle rigide. Voici quelques approches qui fonctionnent bien :</p>
<ul>
  <li><strong>L'entrée quotidienne libre</strong> : 5 à 10 minutes le soir pour noter ce que vous avez ressenti dans la journée, sans filtre ni correction</li>
  <li><strong>La méthode RULER</strong> : après un événement marquant, noter l'émotion <em>Reconnaître</em>, en <em>Comprendre</em> la cause, <em>Nommer</em> ce que vous ressentez, <em>Exprimer</em> de façon appropriée, et <em>Réguler</em> l'émotion</li>
  <li><strong>Les questions de réflexion</strong> : "Qu'est-ce qui m'a stressé aujourd'hui ?", "Qu'est-ce qui m'a rendu heureux ?", "Qu'est-ce que je ressens dans mon corps en ce moment ?"</li>
</ul>

<h2>Les pièges à éviter</h2>
<ul>
  <li>Se transformer en <strong>rumination écrite</strong> : écrire pour ressasser sans chercher à comprendre ou à trouver une perspective. Si vous écrivez les mêmes choses en boucle, changez d'angle.</li>
  <li>L'<strong>autocritique excessive</strong> : le journal est un espace de bienveillance envers soi, pas un tribunal intérieur.</li>
  <li>La pression de la <strong>régularité parfaite</strong> : écrire 3 fois par semaine en conscience vaut mieux que d'écrire tous les jours par obligation.</li>
</ul>

<h2>Le tracker d'émotions CESIZen comme journal simplifié</h2>
<p>Si l'écriture longue ne vous convient pas, le tracker d'émotions de l'application vous permet de noter rapidement votre état émotionnel du jour, d'ajouter un commentaire court et de visualiser vos tendances sur la semaine, le mois ou l'année. C'est une forme de journal émotionnel allégée, pensée pour s'intégrer facilement dans le quotidien.</p>`,
  },

  // ──────────────────────────────────────────────────────
  // CROISSANCE
  // ──────────────────────────────────────────────────────
  {
    categoryName: "Croissance",
    title: "Développer sa résilience : apprendre à rebondir face à l'adversité",
    description:
      "La résilience n'est pas une qualité innée réservée à quelques-uns. C'est une capacité qui se développe tout au long de la vie. Voici comment la cultiver activement.",
    content: `<h2>Qu'est-ce que la résilience ?</h2>
<p>La résilience psychologique désigne la capacité à faire face à des situations difficiles, à traverser l'adversité — deuil, échec, traumatisme — et à trouver les ressources pour continuer à se développer. Le terme vient du latin <em>resilire</em>, qui signifie "rebondir".</p>
<p>Contrairement à une idée reçue, être résilient ne signifie pas ne pas souffrir. Cela signifie <strong>traverser la souffrance sans en rester prisonnier</strong>. Les personnes résilientes ressentent la douleur ; elles ont simplement développé des stratégies pour composer avec elle.</p>

<h2>Les piliers de la résilience</h2>
<p>La recherche en psychologie positive a identifié plusieurs facteurs protecteurs :</p>
<ul>
  <li><strong>Le sens</strong> : la capacité à trouver une signification à ce que l'on traverse, un "pourquoi" qui aide à supporter le "comment"</li>
  <li><strong>Les liens sociaux</strong> : le soutien de proches de confiance est l'un des facteurs les plus robustement associés à la résilience</li>
  <li><strong>La flexibilité cognitive</strong> : la capacité à envisager une situation sous différents angles, à ne pas rester bloqué sur une seule interprétation</li>
  <li><strong>Le sentiment d'efficacité personnelle</strong> : croire en sa capacité à influencer sa situation</li>
  <li><strong>L'acceptation</strong> : accepter ce qui ne peut pas être changé sans pour autant se résigner à ce qui peut l'être</li>
</ul>

<h2>Des pratiques concrètes pour développer sa résilience</h2>
<ul>
  <li><strong>Cultiver la gratitude</strong> : noter chaque soir 3 choses positives de la journée, même petites, oriente l'attention vers ce qui fonctionne</li>
  <li><strong>Développer ses ressources internes</strong> : activité physique, méditation, créativité — tout ce qui nourrit votre sentiment de compétence et d'ancrage</li>
  <li><strong>Maintenir des liens</strong> : ne pas s'isoler dans les moments difficiles</li>
  <li><strong>Apprendre de l'adversité</strong> : s'interroger sur ce qu'une épreuve nous a appris, sans minimiser la souffrance</li>
  <li><strong>Prendre soin de soi physiquement</strong> : sommeil, alimentation et exercice constituent la base physiologique de la résilience émotionnelle</li>
</ul>

<h2>La résilience n'est pas un idéal solitaire</h2>
<p>La culture contemporaine tend à présenter la résilience comme une vertu individuelle. Mais la recherche montre qu'elle est fondamentalement <strong>relationnelle et sociale</strong>. Elle se construit dans la relation aux autres, dans la transmission inter-générationnelle, dans le contexte social et économique. Si vous traversez une période particulièrement difficile, chercher de l'aide n'est pas un signe de faiblesse — c'est en soi un acte de résilience.</p>`,
  },
  {
    categoryName: "Croissance",
    title: "L'intelligence émotionnelle : comprendre et gérer ses émotions",
    description:
      "Popularisée par Daniel Goleman, l'intelligence émotionnelle est aujourd'hui reconnue comme un facteur déterminant de bien-être, de réussite professionnelle et de qualité des relations interpersonnelles.",
    content: `<h2>Qu'est-ce que l'intelligence émotionnelle ?</h2>
<p>L'intelligence émotionnelle (IE) désigne la capacité à identifier, comprendre, utiliser et gérer ses propres émotions et celles des autres de façon constructive. Conceptualisée par les psychologues Peter Salovey et John Mayer, elle a été popularisée par Daniel Goleman dans son livre de 1995 <em>Emotional Intelligence</em>.</p>
<p>Elle repose sur quatre compétences principales :</p>
<ul>
  <li><strong>La perception émotionnelle</strong> : savoir identifier les émotions en soi et chez les autres (expressions, postures, ton de voix)</li>
  <li><strong>L'utilisation des émotions</strong> : mobiliser ses émotions pour faciliter la réflexion et la créativité</li>
  <li><strong>La compréhension émotionnelle</strong> : saisir la logique des émotions, leurs enchaînements et leurs causes</li>
  <li><strong>La régulation émotionnelle</strong> : gérer ses états émotionnels de façon adaptée, sans les réprimer ni les laisser tout envahir</li>
</ul>

<h2>Pourquoi développer son intelligence émotionnelle ?</h2>
<p>Des études montrent que l'IE est fortement corrélée à :</p>
<ul>
  <li>Une meilleure santé mentale et une plus grande résistance au stress</li>
  <li>Des relations interpersonnelles plus satisfaisantes</li>
  <li>De meilleures performances professionnelles, notamment dans les rôles impliquant de la collaboration</li>
  <li>Une plus grande capacité à prendre des décisions éclairées (les émotions fournissent une information précieuse)</li>
</ul>

<h2>Comment développer son intelligence émotionnelle ?</h2>
<ul>
  <li><strong>Nommer ses émotions avec précision</strong> : ne pas se contenter de "je me sens bien/mal" mais chercher le mot juste (est-ce de l'anxiété, de la frustration, de la mélancolie, de la déception ?)</li>
  <li><strong>Pratiquer l'auto-observation</strong> : s'interroger régulièrement sur ce que l'on ressent et pourquoi</li>
  <li><strong>Développer l'empathie</strong> : s'intéresser vraiment aux émotions des autres, sans chercher à les résoudre immédiatement</li>
  <li><strong>Travailler sa tolérance à l'inconfort émotionnel</strong> : accepter de ressentir des émotions désagréables sans les fuir systématiquement</li>
  <li><strong>Utiliser un journal émotionnel</strong> ou une application de tracking pour prendre conscience de ses patterns émotionnels récurrents</li>
</ul>`,
  },

  // ──────────────────────────────────────────────────────
  // RELATIONS
  // ──────────────────────────────────────────────────────
  {
    categoryName: "Relations",
    title: "Communication non-violente : exprimer ses besoins sans blesser",
    description:
      "La Communication Non-Violente (CNV), développée par Marshall Rosenberg, est une approche relationnelle qui permet d'exprimer ce que l'on ressent et ce dont on a besoin, tout en restant connecté à l'autre.",
    content: `<h2>Qu'est-ce que la Communication Non-Violente ?</h2>
<p>La Communication Non-Violente (CNV), parfois appelée "communication bienveillante", est une approche de la communication interpersonnelle développée dans les années 1960 par le psychologue américain Marshall Rosenberg. Elle repose sur l'idée que <strong>tous les êtres humains ont des besoins fondamentaux</strong>, et que les conflits surviennent principalement lorsque ces besoins ne sont pas reconnus ou satisfaits.</p>
<p>La CNV ne signifie pas être mou ou céder à tout. Elle signifie communiquer avec clarté, honnêteté et respect — pour soi et pour l'autre.</p>

<h2>Les 4 composantes de la CNV</h2>
<p>La CNV s'articule autour d'un processus en 4 étapes, souvent résumé par l'acronyme OSBD :</p>
<ul>
  <li><strong>O — Observation</strong> : décrire les faits de façon neutre, sans jugement ni interprétation. "Quand tu arrives en retard à nos réunions" plutôt que "Tu es toujours en retard".</li>
  <li><strong>S — Sentiment</strong> : exprimer ce que l'on ressent face à cette observation. "Je me sens frustré(e)..." en utilisant "je" plutôt que "tu m'énèrves".</li>
  <li><strong>B — Besoin</strong> : identifier le besoin non satisfait à l'origine du sentiment. "...parce que j'ai besoin de fiabilité et de respect du temps commun."</li>
  <li><strong>D — Demande</strong> : formuler une demande concrète, réalisable et négociable. "Est-ce que tu pourrais me prévenir si tu as du retard ?"</li>
</ul>

<h2>Un exemple concret</h2>
<p>❌ Réaction habituelle : "Tu ne m'écoutes jamais quand je parle ! C'est épuisant."</p>
<p>✅ CNV : "Quand je te parle d'un problème et que tu regardes ton téléphone (observation), je me sens seul(e) et peu important(e) (sentiment), parce que j'ai besoin de me sentir écouté(e) et valorisé(e) dans notre relation (besoin). Est-ce que tu pourrais poser ton téléphone quand je te parle de quelque chose d'important pour moi ? (demande)"</p>

<h2>Les obstacles courants</h2>
<ul>
  <li><strong>Confondre observation et jugement</strong> : "il est agressif" est un jugement, "il a haussé la voix" est une observation</li>
  <li><strong>Confondre sentiment et pensée</strong> : "je me sens incompris" est souvent une pensée sur l'autre, pas un sentiment. "je me sens triste" est un sentiment</li>
  <li><strong>Faire des demandes déguisées en exigences</strong> : une demande CNV laisse la liberté de dire non</li>
</ul>

<h2>Pour aller plus loin</h2>
<p>La CNV s'apprend progressivement. Des livres comme <em>Les mots sont des fenêtres (ou des murs)</em> de Marshall Rosenberg et des ateliers de pratique peuvent vous aider à intégrer cette approche dans votre quotidien.</p>`,
  },
  {
    categoryName: "Relations",
    title: "Reconnaître et sortir d'une relation toxique",
    description:
      "Les relations toxiques peuvent prendre de nombreuses formes et s'installer progressivement. Identifier les signaux d'alerte et comprendre les mécanismes en jeu est la première étape pour retrouver un espace sain.",
    content: `<h2>Qu'est-ce qu'une relation toxique ?</h2>
<p>Une relation — amoureuse, amicale, familiale ou professionnelle — est dite toxique lorsqu'elle génère de manière chronique plus de souffrance que d'épanouissement, et lorsque des schémas comportementaux nuisibles s'y reproduisent malgré les tentatives de changement.</p>
<p>Le terme "toxique" peut s'appliquer à des degrés très divers, depuis les relations simplement épuisantes jusqu'aux situations d'emprise psychologique ou de violence.</p>

<h2>Les signaux d'alerte</h2>
<p>Il n'existe pas de liste exhaustive, mais voici des schémas fréquents à repérer :</p>
<ul>
  <li><strong>Le dénigrement systématique</strong> : critiques récurrentes sur votre apparence, vos capacités, votre valeur</li>
  <li><strong>La manipulation et le mensonge</strong> : notamment le <em>gaslighting</em>, qui consiste à vous faire douter de votre perception de la réalité</li>
  <li><strong>L'isolement</strong> : vous éloigner progressivement de vos proches, de vos amis, de vos activités</li>
  <li><strong>Le contrôle</strong> : vouloir décider à votre place, surveiller vos déplacements, vos contacts, votre argent</li>
  <li><strong>Les cycles explosion/réconciliation</strong> : tension qui monte, scène, réconciliation intense, puis retour à la tension</li>
  <li><strong>La dévalorisation émotionnelle</strong> : "tu es trop sensible", "tu te fais des idées", "tu exagères"</li>
</ul>

<h2>Pourquoi est-il si difficile de partir ?</h2>
<p>Sortir d'une relation toxique est rarement simple, et juger les personnes qui "restent" est contre-productif. Plusieurs mécanismes psychologiques entrent en jeu :</p>
<ul>
  <li><strong>L'attachement traumatique</strong> : les phases de réconciliation créent des liens émotionnels puissants</li>
  <li><strong>La honte et la culpabilité</strong> soigneusement entretenues par l'autre</li>
  <li><strong>La peur</strong> : de la solitude, des représailles, du regard des autres</li>
  <li><strong>La dépendance affective</strong> ou financière instaurée progressivement</li>
  <li><strong>L'espoir que ça va changer</strong>, alimenté par les phases de réconciliation</li>
</ul>

<h2>Les premières étapes pour s'en sortir</h2>
<ul>
  <li><strong>Nommer ce que vous vivez</strong> : mettre des mots dessus est déjà un acte puissant</li>
  <li><strong>Briser l'isolement</strong> : confier à une personne de confiance, reprendre contact avec ses proches</li>
  <li><strong>Consulter un professionnel</strong> : psychologue, médecin, ou association spécialisée</li>
  <li><strong>Ne pas se précipiter</strong> ni prendre de décisions sous l'emprise des émotions — construire un plan</li>
  <li>En cas de violence : <strong>contacter le 3919</strong> (numéro national de référence, gratuit, 24h/24)</li>
</ul>`,
  },
  {
    categoryName: "Relations",
    title: "L'écoute active : une compétence relationnelle qui change tout",
    description:
      "Savoir écouter vraiment — pas seulement attendre son tour de parler — est l'une des compétences relationnelles les plus précieuses. Et comme toute compétence, elle s'apprend et se développe.",
    content: `<h2>Écouter versus entendre</h2>
<p>On entend de façon passive et involontaire. L'écoute, elle, est un acte conscient et actif. L'écoute active, concept développé par le psychologue Carl Rogers, va plus loin encore : elle implique une <strong>présence totale à l'autre</strong>, une attention portée non seulement aux mots, mais aussi aux émotions, aux silences, au langage non verbal.</p>
<p>Paradoxalement, dans la plupart de nos conversations, nous écoutons pour répondre plutôt que pour comprendre. L'écoute active inverse cette priorité.</p>

<h2>Les principes de l'écoute active</h2>
<ul>
  <li><strong>Être pleinement présent</strong> : poser son téléphone, éviter les distractions, regarder vraiment l'autre</li>
  <li><strong>Ne pas interrompre</strong> : laisser l'espace pour que l'autre formule sa pensée, même si elle prend du temps</li>
  <li><strong>Ne pas préparer sa réponse</strong> pendant que l'autre parle — c'est l'une des formes les plus courantes de non-écoute</li>
  <li><strong>La reformulation</strong> : reformuler ce que vous avez compris ("si je comprends bien, tu te sens...") montre que vous avez entendu et permet à l'autre de se sentir compris, ou de préciser sa pensée</li>
  <li><strong>Les questions ouvertes</strong> : "Qu'est-ce qui t'a mené à cette décision ?" plutôt que "Tu as fait ça ?"</li>
  <li><strong>L'acceptation sans jugement</strong> : accueillir ce que l'autre dit sans commenter immédiatement, sans qualifier, sans minimiser</li>
</ul>

<h2>Ce que l'écoute active n'est pas</h2>
<ul>
  <li>Ce n'est pas <strong>donner des conseils non sollicités</strong> : souvent, les gens ont besoin d'être entendus avant d'être guidés</li>
  <li>Ce n'est pas <strong>partager sa propre expérience</strong> pour "faire le lien" : "Ah, moi aussi ça m'est arrivé, et j'ai fait..." détourne l'attention</li>
  <li>Ce n'est pas <strong>minimiser</strong> : "C'est pas si grave", "ça va aller" ferment la conversation</li>
  <li>Ce n'est pas <strong>résoudre le problème</strong> à la place de l'autre</li>
</ul>

<h2>Effets sur la relation</h2>
<p>Se sentir vraiment écouté est une expérience rare et précieuse. Les études sur la relation thérapeutique montrent que <strong>la qualité de l'écoute est l'un des facteurs les plus prédictifs des résultats thérapeutiques</strong> — davantage même que la technique utilisée. Dans les relations ordinaires, développer cette capacité transforme profondément la qualité du lien, la confiance mutuelle et la résolution des conflits.</p>`,
  },
];

export async function createDemoArticles() {
  console.log("⏳ Seeding demo articles (rich HTML content)");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const categoryByName = new Map(categories.map((c) => [c.name, c.id]));

  let createdCount = 0;

  for (const article of DEMO_ARTICLES) {
    const categoryId = categoryByName.get(article.categoryName);
    if (!categoryId) {
      console.warn(`  ⚠️  Catégorie introuvable : ${article.categoryName}`);
      continue;
    }

    const exists = await prisma.article.findFirst({
      where: { title: article.title },
      select: { id: true },
    });

    if (exists) continue;

    await prisma.article.create({
      data: {
        categoryId,
        title: article.title,
        description: article.description,
        content: article.content,
      },
    });

    createdCount++;
  }

  const totalCount = await prisma.article.count();
  console.log(
    `✅ ${createdCount} articles créés, ${totalCount} total`
  );
}
