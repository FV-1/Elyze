import { mixHex } from '../utils/color';
import { contrastRatio } from './rainbow';

// Couleur des modules d'un QR code, dérivée d'un accent.
//
// NE SERT PLUS QU'AU MODE ARC-EN-CIEL. Hors de lui, le code est dessiné à
// l'encre de l'app (voir components/QrCode.tsx) : un accent clair assombri
// jusqu'au seuil perd sa teinte et garde sa boue — la pêche donnait un marron,
// le lime un kaki. Dans le mode arc-en-ciel, où tout est repeint au hasard, la
// dérivation reste ce qui garde le code lisible, et c'est tout son objet.
//
// UN QR CODE N'EST PAS UNE IMAGE POUR L'ŒIL, et c'est tout le problème de le
// mettre aux couleurs de l'app. Un décodeur ne voit ni teinte ni saturation :
// il ramène chaque pixel à une luminosité, puis tranche entre sombre et clair.
// Une couleur choisie pour être jolie peut donc tomber du mauvais côté du
// seuil, et le code devient illisible sans que rien ne le montre — il aura
// toujours l'air d'un QR code parfaitement normal.
//
// Deux des quatre accents de l'app sont déjà limites à pleine intensité :
// violet tient 5,6:1 face au blanc, orange 5,2:1. C'est décodable à bout
// portant sur un bon écran, et ça se dégrade vite dès qu'on s'éloigne, qu'on
// tient le téléphone de travers ou que la pièce est sombre. Et le mode
// arc-en-ciel, lui, tire ses teintes au hasard : rien ne garantit quoi que ce
// soit.
//
// On assombrit donc la couleur JUSTE ASSEZ pour franchir un seuil confortable,
// en gardant le plus de teinte possible. Le résultat reste franchement violet,
// bleu, rose ou orange, mais toujours lisible.

// Le fond, toujours très clair et jamais teinté.
//
// Un fond coloré, même pâle, réduit l'écart des deux côtés à la fois : il
// rapproche les modules clairs du seuil en même temps qu'il ne fait rien pour
// les sombres. Le blanc est aussi ce que les décodeurs attendent, et la
// couleur de l'app s'exprime sur le cadre autour et sur les modules.
export const QR_BACKGROUND = '#FFFFFF';

// Seuil retenu.
//
// La norme d'accessibilité se contente de 3:1 pour un élément graphique, et un
// décodeur de laboratoire s'en accommode. Mais ici l'image est photographiée à
// travers un objectif de téléphone, de biais, sous un éclairage quelconque, et
// souvent depuis l'écran d'un autre téléphone dont la luminosité est baissée.
// 7:1 laisse de la marge pour tout cela sans rien coûter de visible : à ce
// niveau, la teinte reste parfaitement identifiable.
export const QR_MIN_CONTRAST = 7;

// Plancher de teinte : en deçà, il ne resterait qu'un noir à peine coloré, et
// l'intention de départ serait perdue. Aucune des couleurs de l'app n'en
// approche, mais une teinte très claire tirée par le mode arc-en-ciel le
// pourrait. Mieux vaut alors un QR presque noir qu'un QR illisible.
const TEINTE_MINIMALE = 0.25;

export function qrModuleColor(accent: string): string {
  // On part de la couleur pleine et on la mélange au noir par paliers, en
  // s'arrêtant au PREMIER qui passe le seuil : c'est celui qui garde le plus
  // de teinte.
  for (let part = 1; part >= TEINTE_MINIMALE; part -= 0.05) {
    const candidate = mixHex(accent, '#000000', part);
    if (contrastRatio(candidate, QR_BACKGROUND) >= QR_MIN_CONTRAST) return candidate;
  }
  return mixHex(accent, '#000000', TEINTE_MINIMALE);
}
