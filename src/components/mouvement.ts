import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// LE VOCABULAIRE DE MOUVEMENT DE L'APP, en un seul endroit.
//
// Deux gestes, et deux seulement. Les écrire ici plutôt que dans chaque
// composant évite qu'un bouton s'enfonce en 90 ms et son voisin en 200, ce qui
// ne se remarque pas en regardant l'un ou l'autre, mais donne à l'ensemble un
// air mal ajusté.
//
// RIEN À FAIRE POUR LE MOUVEMENT RÉDUIT : sans réglage explicite, Reanimated
// interroge le système avant chaque animation et pose la valeur d'arrivée
// d'un coup quand l'appareil demande de réduire les animations. Le fondu des
// onglets, lui, passe par un `entering` que Reanimated n'arbitre pas de la
// même façon, et le coupe donc à la main (voir Bascule.tsx).

// LE RESSORT, pour ce qui CHANGE D'ÉTAT : un choix qui se déplace, une option
// qui grossit parce qu'on vient de la prendre. Amorti haut, raideur moyenne :
// il arrive en un quart de seconde et s'arrête net. Plus lâche, il oscillerait
// sous le doigt, ce qui sur un élément qui dit où l'on est se lit comme une
// hésitation.
export const RESSORT = { damping: 20, stiffness: 200, mass: 0.7 } as const;

// LA RAMPE, pour l'APPUI. Ce n'est pas un ressort : un doigt qui appuie n'a
// pas d'inertie, et une touche qui rebondit au relâchement donne l'impression
// d'avoir raté sa cible. Courte, et la même à l'aller qu'au retour.
export const PRESSION = { duration: 90 } as const;
export const ECHELLE_PRESSEE = 0.93;

// L'enfoncement sous le doigt, et le grossissement facultatif de ce qui est
// choisi. Les deux facteurs se multiplient, si bien qu'appuyer sur l'option
// courante part de son grossissement au lieu de l'annuler.
//
// La valeur d'appui vit dans une `SharedValue` et non dans un état : elle
// change à chaque toucher et ne concerne que le fil de l'interface. Un
// `useState` rendrait tout le composant parent à chaque appui.
export function usePression(echelle: number = ECHELLE_PRESSEE, facteurChoisi: number = 1) {
  const pression = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(facteurChoisi, RESSORT) },
      { scale: withTiming(pression.value, PRESSION) },
    ],
  }));

  return {
    style,
    onPressIn: () => {
      pression.value = echelle;
    },
    onPressOut: () => {
      pression.value = 1;
    },
  };
}

// LA PIÈCE QUI GLISSE SOUS LE CHOIX COURANT.
//
// Un groupe où l'on choisit une option parmi deux ou trois (barre d'onglets,
// longueur de la partie) peut allumer le fond de l'option choisie et éteindre
// les autres. Il dit alors ce qui est choisi, mais pas que les options sont
// côte à côte : rien ne relie l'ancienne à la nouvelle. Une seule pièce qui se
// déplace le montre en un geste.
//
// Elle ne peut pas être placée par le calcul : les options se partagent la
// largeur en `flex`, et cette largeur dépend de l'écran, de la langue et du
// grossissement des libellés. On la MESURE donc au rendu.
//
// ATTENTION AU CADRE DE RÉFÉRENCE : les `x` que renvoie `onLayout` sont
// comptés depuis le cadre du parent, marge intérieure comprise. La rangée
// mesurée et la pièce doivent donc avoir le MÊME parent, et ce parent ne doit
// pas porter de marge intérieure. Quand le rail en a une (un liseré autour des
// options), on met la marge sur le rail et on glisse une rangée nue dedans.
//
// ELLE NE CONVIENT PAS À TOUS LES GROUPES. Si le libellé choisi change de
// couleur pour se lire sur la pièce (du gris au blanc, par exemple), il
// devient illisible pendant le trajet : blanc sur le fond clair du rail, un
// quart de seconde durant. Dans ce cas-là, on garde un fond qui s'allume sur
// place, et l'appui pour tout mouvement.
type Mesure = { x: number; largeur: number };

export function useGlissiere(choisi: string) {
  const [mesures, setMesures] = useState<Record<string, Mesure>>({});

  const mesurer = (cle: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setMesures((precedentes) => {
      const connue = precedentes[cle];
      // Même place qu'avant : on rend l'objet tel quel, sinon chaque passe de
      // mise en page en déclencherait une autre.
      if (connue && connue.x === x && connue.largeur === width) return precedentes;
      return { ...precedentes, [cle]: { x, largeur: width } };
    });
  };

  // Les valeurs partent telles quelles dans le worklet. Une mesure absente
  // (premier rendu, avant la mise en page) laisse la pièce invisible plutôt
  // que posée au hasard à gauche.
  const cible = mesures[choisi];
  const x = cible ? cible.x : 0;
  const largeur = cible ? cible.largeur : 0;
  const presente = cible ? 1 : 0;

  const style = useAnimatedStyle(() => ({
    opacity: withTiming(presente, { duration: 140 }),
    width: withSpring(largeur, RESSORT),
    transform: [{ translateX: withSpring(x, RESSORT) }],
  }));

  return { style, mesurer };
}
