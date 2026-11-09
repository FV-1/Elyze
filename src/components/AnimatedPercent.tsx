import { useEffect, useRef, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Texte as Text } from './Texte';
import { useReducedMotion } from '../hooks/useReducedMotion';

const DURATION_MS = 900;

// Fait défiler le pourcentage de 0 jusqu'à sa valeur finale, pour donner
// au moment de la révélation du résultat un peu de poids. Respecte le
// réglage "réduire les animations" du système en affichant la valeur finale
// directement.
export function AnimatedPercent({
  value,
  style,
  instant,
  delayMs = 0,
}: {
  value: number;
  style?: StyleProp<TextStyle>;
  // Retard avant le début du défilement. Sert quand le chiffre est encore
  // caché à l'arrivée sur l'écran : derrière le rideau du podium, un décompte
  // lancé tout de suite serait fini avant d'être visible.
  delayMs?: number;
  // Affiche la valeur finale sans défilement — utilisé quand le "moment de
  // révélation" a déjà eu lieu plus tôt dans la session (voir ResultsScreen)
  // et ne doit pas se rejouer à chaque retour sur l'écran.
  instant?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const skip = reducedMotion || instant;
  const [displayed, setDisplayed] = useState(skip ? value : 0);
  const frameRef = useRef<number | null>(null);

  // Sans animation, la valeur finale s'affiche directement : elle n'a pas à
  // passer par l'état, qu'il faudrait alors remettre à jour depuis un effet —
  // un aller-retour de rendu pour un chiffre déjà connu au moment de peindre.
  const affiche = skip ? value : displayed;

  // Un défilement retardé repart de zéro : pendant l'attente, le chiffre
  // précédent ne doit pas rester affiché comme s'il était le nouveau. Remis
  // au rendu, avec le changement de valeur qui le provoque, plutôt que depuis
  // l'effet — qui ne s'exécute qu'après la peinture.
  const [visee, setVisee] = useState(value);
  if (visee !== value) {
    setVisee(value);
    if (delayMs > 0) setDisplayed(0);
  }

  useEffect(() => {
    if (skip) return;

    const tick = (start: number) => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(() => tick(start));
      }
    };

    const lancer = () => {
      const start = Date.now();
      frameRef.current = requestAnimationFrame(() => tick(start));
    };

    let attente: ReturnType<typeof setTimeout> | null = null;
    if (delayMs > 0) {
      attente = setTimeout(lancer, delayMs);
    } else {
      lancer();
    }

    return () => {
      if (attente !== null) clearTimeout(attente);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, skip, delayMs]);

  return <Text style={style}>{affiche}%</Text>;
}
