import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Texte as Text } from '../components/Texte';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { THEMES } from '../data/themes';
import { PROPOSALS } from '../data/proposals';
import { CANDIDATES } from '../data/candidates';
import { candidatesQuota, QUOTA_PAR_CANDIDAT } from '../utils/deck';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';
import { ThemeIcon } from '../components/ThemeIcon';

const COUNT_BY_THEME: Record<string, number> = {};
const CANDIDATES_BY_THEME: Record<string, Set<string>> = {};
for (const p of PROPOSALS) {
  COUNT_BY_THEME[p.themeId] = (COUNT_BY_THEME[p.themeId] ?? 0) + 1;
  (CANDIDATES_BY_THEME[p.themeId] ??= new Set()).add(p.candidateId);
}

// En dessous de ce nombre de propositions, le pourcentage d'un candidat ne
// repose sur presque rien : avec une seule réponse, il ne peut valoir que 0 %
// ou 100 %. On prévient avant de lancer, plutôt que de laisser l'app afficher
// un podium d'apparence définitive.
const MIN_PAR_CANDIDAT = 3;

export function ThemeSelectScreen({
  initialSelection,
  quota = QUOTA_PAR_CANDIDAT,
  onConfirm,
  onBack,
}: {
  initialSelection: string[];
  // Cartes par candidat de la partie choisie sur l'accueil (courte ou
  // longue). Sans lui, l'écran annonçait toujours le paquet long — « Jouer :
  // 165 cartes » pour une partie courte qui en tire 55.
  quota?: number;
  onConfirm: (themeIds: string[]) => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelection));

  const toggle = (themeId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const allSelected = selected.size === THEMES.length;
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(THEMES.map((t) => t.id)));
  };

  // Ce que la sélection contient, et ce que la partie en tirera VRAIMENT.
  //
  // Le bouton doit annoncer le nombre exact de cartes, et les deux modes de
  // composition n'en donnent pas le même (voir utils/deck.ts) : sur tous les
  // thèmes, quinze par candidat présent ; sur une sélection, la totalité des
  // propositions de ces thèmes.
  const tirage = useMemo(() => {
    const pool = PROPOSALS.filter((p) => selected.has(p.themeId));
    const presents = new Set(pool.map((p) => p.candidateId));
    const complet = selected.size === THEMES.length;
    // Le plus petit nombre de mesures parmi les candidats présents : c'est lui
    // qui dit à quel point la comparaison sera inégale.
    const minimum = candidatesQuota(pool, Number.MAX_SAFE_INTEGER);
    return {
      complet,
      presents: presents.size,
      // Candidats qui n'ont aucune mesure dans ces thèmes : ils ne seront pas
      // du tout comparés, ce que rien n'indiquait auparavant.
      absents: CANDIDATES.length - presents.size,
      minimum,
      cartes: complet ? candidatesQuota(pool, quota) * presents.size : pool.length,
    };
  }, [selected, quota]);

  const totalCount = tirage.cartes;

  const thinDeck = useMemo(() => {
    if (selected.size === 0 || tirage.presents === 0) return null;
    if (tirage.minimum >= MIN_PAR_CANDIDAT && tirage.absents === 0) return null;
    return tirage;
  }, [selected, tirage]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Choisis tes thèmes" onBack={onBack} />
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Touche ceux qui t’intéressent : tu auras toutes leurs propositions.
        </Text>
        <Pressable
          onPress={toggleAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        >
          <Text style={styles.toggleAll}>
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Text>
        </Pressable>
      </View>

      {/* Huit thèmes, une seule liste. Il y avait quinze thèmes rangés en
          quatre catégories, chacune avec sa propre case : deux niveaux de
          cases pour un seul choix. Le nombre de cartes n'est plus répété sur
          chaque ligne ; le bouton du bas donne le total, qui est ce qu'on
          veut savoir avant de lancer. */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {THEMES.map((theme) => {
          const isSelected = selected.has(theme.id);
          const count = COUNT_BY_THEME[theme.id] ?? 0;
          return (
            <Pressable
              key={theme.id}
              onPress={() => toggle(theme.id)}
              style={({ pressed }) => [
                styles.row,
                isSelected && styles.rowSelected,
                pressed && styles.rowPressed,
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${theme.label}, ${count} proposition${count > 1 ? 's' : ''}`}
            >
              <ThemeIcon icon={theme.icon} size={22} color={colors.textSecondary} weight="duotone" />
              <Text style={styles.rowLabel} numberOfLines={2}>
                {theme.label}
              </Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={14} color={colors.onAccent} />}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {thinDeck && (
          <View style={styles.warning}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.warningText} />
            <Text style={styles.warningText}>
              {thinDeck.absents > 0 && (
                <>
                  {thinDeck.absents} candidat{thinDeck.absents > 1 ? 's' : ''} n
                  {thinDeck.absents > 1 ? '’ont' : '’a'} aucune proposition sur ces thèmes et ne
                  ser{thinDeck.absents > 1 ? 'ont' : 'a'} pas comparé
                  {thinDeck.absents > 1 ? 's' : ''}.{' '}
                </>
              )}
              {thinDeck.minimum < MIN_PAR_CANDIDAT && (
                <>
                  Le candidat le moins représenté n’a que {thinDeck.minimum} proposition
                  {thinDeck.minimum > 1 ? 's' : ''} sur ces thèmes : son pourcentage ne
                  reposera presque sur rien.{' '}
                </>
              )}
              Le résultat sera très approximatif.
            </Text>
          </View>
        )}
        <Pressable
          onPress={() => onConfirm(Array.from(selected))}
          disabled={selected.size === 0}
          style={({ pressed }) => [
            styles.cta,
            selected.size === 0 && styles.ctaDisabled,
            pressed && selected.size > 0 && styles.ctaPressed,
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled: selected.size === 0 }}
          accessibilityLabel={
            selected.size === 0 ? 'Choisis au moins un thème' : `Jouer, ${totalCount} cartes`
          }
        >
          <Text style={styles.ctaText}>
            {selected.size === 0 ? 'Choisis au moins un thème' : `Jouer : ${totalCount} cartes`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.md,
      gap: spacing.xs,
    },
    subtitle: {
      fontSize: fonts.small,
      color: colors.textSecondary,
      lineHeight: fonts.small * 1.4,
    },
    toggleAll: {
      marginTop: spacing.sm,
      fontSize: fonts.small,
      fontWeight: '700',
      color: colors.accentText,
    },
    list: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      // Assez bas pour que les huit thèmes tiennent sans défiler au-dessus du
      // bouton, sur un écran de téléphone courant.
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    rowPressed: {
      opacity: 0.8,
    },
    rowLabel: {
      flex: 1,
      fontSize: fonts.body + 1,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: 0.1,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: radii.pill,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,
      paddingTop: spacing.sm,
    },
    warning: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      backgroundColor: colors.warningSoft,
      borderRadius: radii.md,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    warningText: {
      flex: 1,
      fontSize: fonts.tiny + 1,
      lineHeight: (fonts.tiny + 1) * 1.4,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    cta: {
      backgroundColor: colors.action,
      borderRadius: radii.md,
      paddingVertical: spacing.md + 2,
      alignItems: 'center',
    },
    ctaDisabled: {
      opacity: 0.4,
    },
    ctaPressed: {
      backgroundColor: colors.actionPressed,
    },
    ctaText: {
      fontSize: fonts.body + 1,
      fontWeight: '700',
      color: colors.onAction,
    },
  });
}
