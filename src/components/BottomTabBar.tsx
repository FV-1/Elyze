import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';

// Plafond de grossissement des libellés. Au delà, une barre d'une seule ligne
// ne les tient plus ; l'icône reste lisible et le libellé complet est de toute
// façon annoncé aux lecteurs d'écran.
const MAX_LABEL_SCALE = 1.2;

// Le plancher de réduction automatique. La barre porte cinq éléments, et
// « Propositions » est le libellé long : à cinq slots sur un écran étroit,
// combiné au grossissement système, il dépassait sa colonne. Plutôt que de
// deviner des largeurs de texte, on laisse le libellé se réduire jusqu'à ce
// plancher — il rétrécit un peu au lieu d'être coupé au milieu d'un mot.
const MIN_LABEL_SCALE = 0.8;

export type BottomTabItem<K extends string> = {
  key: K;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Barre de navigation. `tabs` bascule le contenu de l'écran courant ; `extra`
// est une action qui QUITTE l'écran (le choix des thèmes, qui redémarre la
// session).
//
// Cette action n'est pas un onglet et ne doit pas se lire comme tel : un trait
// vertical la sépare du groupe, et un contour la dessine comme un bouton.
//
// ELLE EST CERNÉE, PAS REMPLIE, et c'est tout le sujet. Deux versions s'y sont
// trompées en sens inverse. La première la grisait comme un onglet inactif :
// un réglage qui commande ce qu'on swipe se remarquait alors moins que les
// vues entre lesquelles on bascule. La seconde lui a donné un fond d'accent
// permanent — or un fond plein est, dans cette barre, la marque de ce qui est
// sélectionné : « Thèmes » paraissait donc être l'écran en cours alors qu'on
// était ailleurs, et rien dans la barre ne disait plus où l'on se trouvait.
//
// Un contour ne dit ni l'un ni l'autre. Aucun onglet n'en porte, sélectionné
// ou non : la forme n'entre pas en concurrence avec l'état. Et l'icône garde
// la teinte d'accent, assez pour que l'œil la trouve.
//
// L'état éventuel (« 4 thèmes » plutôt que « Thèmes ») passe par le libellé
// lui-même, à la taille des autres. Il avait d'abord une pastille de 9 px
// piquée sur l'icône : plus petit que le plus petit jeton de police de l'app,
// pour dire un nombre qui tient dans le libellé.
export function BottomTabBar<K extends string>({
  tabs,
  active,
  onChange,
  extra,
}: {
  tabs: BottomTabItem<K>[];
  active: K;
  onChange: (tab: K) => void;
  extra?: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    accessibilityLabel?: string;
  };
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Ionicons name={tab.icon} size={22} color={isActive ? colors.accent : colors.textMuted} />
            <Text
              style={[styles.label, isActive && styles.labelActive]}
              maxFontSizeMultiplier={MAX_LABEL_SCALE}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={MIN_LABEL_SCALE}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}

      {extra && (
        <>
          <View style={styles.divider} />
          <Pressable
            onPress={extra.onPress}
            style={({ pressed }) => [styles.tab, styles.extraTab, pressed && styles.extraPressed]}
            accessibilityRole="button"
            accessibilityLabel={extra.accessibilityLabel ?? extra.label}
          >
            <Ionicons name={extra.icon} size={20} color={colors.accentText} />
            <Text
              style={[styles.label, styles.extraLabel]}
              maxFontSizeMultiplier={MAX_LABEL_SCALE}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={MIN_LABEL_SCALE}
            >
              {extra.label}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingTop: spacing.sm,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      gap: 3,
      paddingBottom: spacing.xs,
    },
    label: {
      fontSize: fonts.tiny - 1,
      fontWeight: '600',
      color: colors.textMuted,
    },
    labelActive: {
      color: colors.accent,
      fontWeight: '700',
    },

    // Le trait qui dit « ce qui suit n'est pas un onglet ».
    divider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
      marginTop: 2,
      marginBottom: spacing.md,
      backgroundColor: colors.border,
    },
    // Contour et non aplat : voir l'explication en tête de fichier. Le trait
    // est celui qui sépare déjà les surfaces de l'app, à un pixel plein plutôt
    // qu'au cheveu — sous 20 px de haut, un cheveu se perd.
    extraTab: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      marginHorizontal: spacing.xs,
      marginBottom: spacing.xs,
      paddingTop: spacing.xs,
      paddingHorizontal: 2,
    },
    extraPressed: {
      opacity: 0.6,
    },
    // Le libellé reste dans le gris des onglets non sélectionnés : l'accent y
    // aurait redit ce que l'aplat disait de travers. C'est le contour, et lui
    // seul, qui distingue l'action des onglets.
    extraLabel: {
      color: colors.textSecondary,
      fontWeight: '700',
    },
  });
}
