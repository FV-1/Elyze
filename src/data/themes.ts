// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Source : https://poligraph.fr/elections/presidentielle-2027
// Export du 2026-08-29 · AGPL-3.0 / usage libre avec mention de la source (Poligraph)
// Source : https://2027etmoi.fr (https://github.com/2027etmoi/2027etmoi, commit e497529)
// Données du 2026-10-28 · Licence Ouverte 2.0 (Etalab), mention de la source et de la date de mise à jour
// Régénérer avec : node scripts/generate-data.js
// (les huit sujets affichés, qui regroupent les quinze thèmes des sources)

import { ThemeTag } from '../types';

export const THEMES: ThemeTag[] = [
  { id: 'economie', label: 'Économie & numérique', icon: 'CurrencyEur' },
  { id: 'travail', label: 'Travail & retraites', icon: 'Briefcase' },
  { id: 'sante', label: 'Santé & solidarités', icon: 'FirstAidKit' },
  { id: 'education', label: 'École & culture', icon: 'GraduationCap' },
  { id: 'ecologie', label: 'Écologie & agriculture', icon: 'Leaf' },
  { id: 'logement', label: 'Logement & transports', icon: 'House' },
  { id: 'securite', label: 'Sécurité & immigration', icon: 'ShieldCheck' },
  { id: 'institutions', label: 'Institutions & défense', icon: 'Bank' },
];

export const THEMES_BY_ID: Record<string, ThemeTag> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
);
