import { useMemo } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useGlissiere, usePression } from './mouvement';
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

// L'enfoncement sous le doigt et la pastille qui glisse sont partagés avec le
// reste de l'app (voir mouvement.ts) ; seul ce grossissement, qui dit l'onglet
// courant, appartient à cette barre.
const ECHELLE_ACTIVE = 1.06;

export type BottomTabItem<K extends string> = {
  key: K;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Extra = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel?: string;
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
//
// UNE SEULE PASTILLE, QUI SE DÉPLACE. Le fond de l'onglet choisi n'appartient
// pas à l'onglet : c'est une pièce unique, posée derrière la rangée, qui
// glisse d'une colonne à l'autre. Trois fonds qui s'allument et s'éteignent
// diraient la même chose, mais sans montrer le trajet — or c'est le trajet qui
// fait comprendre que ces trois vues sont côte à côte, et non empilées.
export function BottomTabBar<K extends string>({
  tabs,
  active,
  onChange,
  extra,
}: {
  tabs: BottomTabItem<K>[];
  active: K;
  onChange: (tab: K) => void;
  extra?: Extra;
}) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const glissiere = useGlissiere(active);

  return (
    <View style={styles.bar}>
      {/* LA RANGÉE NE PORTE AUCUNE MARGE INTÉRIEURE, et c'est ce qui rend la
          pastille juste : les `x` que renvoie `onLayout` sont comptés depuis
          ce cadre, et la pastille se place dans le même. Remettre une marge
          ici décalerait l'un sans l'autre. Les marges sont sur la barre. */}
      <View style={styles.rangee}>
        <Animated.View style={[styles.pastille, glissiere.style]} pointerEvents="none" />

        {tabs.map((tab) => (
          <Onglet
            key={tab.key}
            tab={tab}
            actif={active === tab.key}
            colors={colors}
            styles={styles}
            onPress={() => onChange(tab.key)}
            onMesure={glissiere.mesurer(tab.key)}
          />
        ))}

        {extra && (
          <>
            <View style={styles.divider} />
            <BoutonExtra extra={extra} colors={colors} styles={styles} />
          </>
        )}
      </View>
    </View>
  );
}

function Onglet<K extends string>({
  tab,
  actif,
  colors,
  styles,
  onPress,
  onMesure,
}: {
  tab: BottomTabItem<K>;
  actif: boolean;
  colors: ColorTokens;
  styles: ReturnType<typeof makeStyles>;
  onPress: () => void;
  onMesure: (e: LayoutChangeEvent) => void;
}) {
  const pression = usePression(undefined, actif ? ECHELLE_ACTIVE : 1);

  return (
    <Pressable
      onPress={onPress}
      onLayout={onMesure}
      onPressIn={pression.onPressIn}
      onPressOut={pression.onPressOut}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: actif }}
      accessibilityLabel={tab.label}
    >
      <Animated.View style={[styles.contenu, pression.style]}>
        <Ionicons name={tab.icon} size={22} color={actif ? colors.accentText : colors.textMuted} />
        <Text
          style={[styles.label, actif && styles.labelActive]}
          maxFontSizeMultiplier={MAX_LABEL_SCALE}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={MIN_LABEL_SCALE}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function BoutonExtra({
  extra,
  colors,
  styles,
}: {
  extra: Extra;
  colors: ColorTokens;
  styles: ReturnType<typeof makeStyles>;
}) {
  const pression = usePression();

  return (
    <Pressable
      onPress={extra.onPress}
      onPressIn={pression.onPressIn}
      onPressOut={pression.onPressOut}
      style={[styles.tab, styles.extraTab]}
      accessibilityRole="button"
      accessibilityLabel={extra.accessibilityLabel ?? extra.label}
    >
      <Animated.View style={[styles.contenu, pression.style]}>
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
      </Animated.View>
    </Pressable>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    // UNE BARRE POSÉE SUR L'ÉCRAN, PAS SOUDÉE À SON BORD.
    //
    // Elle flotte : des marges la détachent des trois côtés, et le contenu de
    // l'écran passe DERRIÈRE elle (voir SwipeScreen, qui la sort du flux et
    // dégage la hauteur qu'il faut au bas de chaque vue). Le trait du haut
    // disparaît avec le collage — il séparait deux surfaces jointives, et un
    // contour complet le remplace maintenant que la barre est un objet fermé.
    //
    // L'ombre est celle des autres surfaces posées de l'app (même teinte,
    // #1A1730), un cran plus portante : la barre est ce qui reste au-dessus
    // quand tout le reste défile.
    bar: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      shadowColor: '#1A1730',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 6,
    },
    rangee: {
      flexDirection: 'row',
    },
    // La pièce qui glisse. Elle est SOUS les onglets dans l'ordre de rendu :
    // son fond passe derrière l'icône et le libellé, jamais devant.
    pastille: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      borderRadius: radii.md,
      backgroundColor: colors.accentSoft,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xs + 2,
    },
    // Ce qui grossit et se comprime est le CONTENU, pas la zone tactile : la
    // cible du doigt garde sa taille quoi qu'il arrive.
    contenu: {
      alignItems: 'center',
      gap: 3,
    },
    label: {
      fontSize: fonts.tiny - 1,
      fontWeight: '600',
      color: colors.textMuted,
    },
    // `accentText` et non `accent` : c'est la teinte d'accent calibrée pour
    // être LUE sur une surface claire ou sombre (voir theme/index.ts). Sur le
    // fond de la pastille, en mode sombre, `accent` tombait sous 4.5:1.
    labelActive: {
      color: colors.accentText,
      fontWeight: '700',
    },

    // Le trait qui dit « ce qui suit n'est pas un onglet ».
    divider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
      marginVertical: spacing.xs,
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
      paddingHorizontal: 2,
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
