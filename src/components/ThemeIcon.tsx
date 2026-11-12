import type { Icon, IconWeight } from 'phosphor-react-native';
import { IconeDeTheme } from '../types';

// UNE ICÔNE PAR CHARGEMENT. Le paquet en compte plus de mille cinq cents,
// et Metro n'écarte pas ce qui n'est pas utilisé : importer depuis sa racine
// embarquerait tout. Chaque icône est donc chargée par son propre fichier,
// et typée par les déclarations publiques du paquet. Un `require` plutôt
// qu'un `import` : TypeScript suivrait l'import jusque dans le code source
// du paquet, et le vérifierait avec nos règles.
/* eslint-disable @typescript-eslint/no-require-imports */
const Bank: Icon = require('phosphor-react-native/src/icons/Bank').Bank;
const Books: Icon = require('phosphor-react-native/src/icons/Books').Books;
const Briefcase: Icon = require('phosphor-react-native/src/icons/Briefcase').Briefcase;
const Calculator: Icon = require('phosphor-react-native/src/icons/Calculator').Calculator;
const Cards: Icon = require('phosphor-react-native/src/icons/Cards').Cards;
const CurrencyEur: Icon = require('phosphor-react-native/src/icons/CurrencyEur').CurrencyEur;
const FirstAidKit: Icon = require('phosphor-react-native/src/icons/FirstAidKit').FirstAidKit;
const GraduationCap: Icon = require('phosphor-react-native/src/icons/GraduationCap').GraduationCap;
const House: Icon = require('phosphor-react-native/src/icons/House').House;
const Leaf: Icon = require('phosphor-react-native/src/icons/Leaf').Leaf;
const Lightbulb: Icon = require('phosphor-react-native/src/icons/Lightbulb').Lightbulb;
const Lock: Icon = require('phosphor-react-native/src/icons/Lock').Lock;
const MagnifyingGlass: Icon = require('phosphor-react-native/src/icons/MagnifyingGlass').MagnifyingGlass;
const Question: Icon = require('phosphor-react-native/src/icons/Question').Question;
const Scales: Icon = require('phosphor-react-native/src/icons/Scales').Scales;
const ShieldCheck: Icon = require('phosphor-react-native/src/icons/ShieldCheck').ShieldCheck;
const Star: Icon = require('phosphor-react-native/src/icons/Star').Star;
const WarningCircle: Icon = require('phosphor-react-native/src/icons/WarningCircle').WarningCircle;
/* eslint-enable @typescript-eslint/no-require-imports */

// LES ICÔNES DES SUJETS ET DES ÉCRANS D'EXPLICATION, TIRÉES DE PHOSPHOR.
//
// Elles étaient des emoji (💶, 🏥, 🎓…), puis des Ionicons, le jeu fourni
// par Expo, trop neutre : on les prenait pour des dessins faits à la main.
// Phosphor est un jeu complet et cohérent, avec une graisse « duotone » qui
// donne du relief aux grandes icônes (les tuiles de la mosaïque) sans
// changer de couleur. Le reste de l'interface garde Ionicons.
//
// La liste est fermée : `IconeDeTheme` (voir types.ts) énumère ces noms, et
// une icône qui manquerait ici ne passerait pas la vérification de types.
const ICONES: Record<IconeDeTheme, Icon> = {
  Bank,
  Books,
  Briefcase,
  Calculator,
  Cards,
  CurrencyEur,
  FirstAidKit,
  GraduationCap,
  House,
  Leaf,
  Lightbulb,
  Lock,
  MagnifyingGlass,
  Question,
  Scales,
  ShieldCheck,
  Star,
  WarningCircle,
};

export function ThemeIcon({
  icon,
  size,
  color,
  weight = 'regular',
  style,
}: {
  icon: IconeDeTheme;
  size: number;
  color: string;
  weight?: IconWeight;
  style?: object;
}) {
  const Icone = ICONES[icon];
  return (
    <Icone
      size={size}
      color={color}
      weight={weight}
      // Décorative, et sans libellé : les lecteurs d'écran passent dessus, le
      // nom du sujet étant toujours écrit à côté.
      style={style}
    />
  );
}
