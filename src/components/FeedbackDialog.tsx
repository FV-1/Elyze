import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Texte as Text } from './Texte';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { openUrl } from '../data/source';
import {
  buildFeedbackMailto,
  FEEDBACK_KINDS,
  FEEDBACK_KINDS_BY_ID,
  FEEDBACK_MAX,
  FeedbackKind,
} from '../data/feedback';
import { ColorTokens, fonts, radii, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';

// Signaler un bug, proposer une idée, donner un avis.
//
// TROIS ÉLÉMENTS, DANS L'ORDRE OÙ ON LES UTILISE : de quoi il s'agit, ce
// qu'on a à dire, et le bouton qui part. Rien d'autre à l'écran.
//
// LA BOÎTE VIENT DU BAS ET Y RESTE. Une fenêtre centrée se fait recouvrir par
// le clavier dès qu'on touche la case ; posée contre le bord inférieur, elle
// monte avec lui et le texte reste visible pendant qu'on l'écrit. C'est aussi
// là que le pouce arrive.
//
// CE QUI A ÉTÉ RETIRÉ. Un bouton « i » dépliait une explication sur l'absence
// de serveur : une information de confiance qui mérite d'être lue, pas un
// interrupteur à actionner. Elle tient maintenant en une ligne sous le bouton,
// là où l'on se demande ce qu'il va faire. L'intitulé au-dessus de la case
// répétait le filigrane qui est dans la case. Le compteur de caractères
// surveillait une borne (1200) qu'un retour ordinaire ne rencontre jamais.
//
// Voir data/feedback.ts pour le raisonnement complet sur le courriel.
export function FeedbackDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [kind, setKind] = useState<FeedbackKind>('bug');
  const [message, setMessage] = useState('');

  // Une boîte rouverte repart à vide. Retrouver le brouillon de la fois
  // précédente, déjà envoyé, inviterait à l'envoyer deux fois.
  const [ouvertAvant, setOuvertAvant] = useState(visible);
  if (ouvertAvant !== visible) {
    setOuvertAvant(visible);
    if (visible) {
      setKind('bug');
      setMessage('');
    }
  }

  const info = FEEDBACK_KINDS_BY_ID[kind];
  const pret = message.trim().length > 0;

  const envoyer = () => {
    if (!pret) return;
    openUrl(buildFeedbackMailto(kind, message));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay} accessibilityViewIsModal>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Fermer" />
        {/* LA FEUILLE EST BORNÉE PAR L'ÉCRAN, et cela tient à ce `flex: 1`.
            Sans lui, la vue qui esquive le clavier mesure exactement sa
            feuille plus la hauteur du clavier : bord inférieur collé en bas
            d'un écran court, le surplus sort par le HAUT, et c'est l'entête —
            titre et croix de fermeture — qui passe hors champ dès qu'on touche
            la case. Avec `flex: 1`, elle occupe l'écran entier et son
            rembourrage pousse la feuille vers le haut au lieu de l'allonger. */}
        <KeyboardAvoidingView
          style={styles.esquive}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.sheet, { paddingBottom: spacing.lg + insets.bottom }]}>
            <View style={styles.entete}>
              <Text style={styles.title}>Un retour ?</Text>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={({ pressed }) => [styles.fermer, pressed && styles.presse]}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Un sélecteur segmenté : trois natures, celle qui est retenue
                posée en clair sur le rail. C'est la forme que le système
                emploie pour un choix unique — on la reconnaît sans l'apprendre. */}
            <View style={styles.rail} accessibilityRole="radiogroup">
              {FEEDBACK_KINDS.map((nature) => {
                const actif = kind === nature.kind;
                return (
                  <Pressable
                    key={nature.kind}
                    onPress={() => setKind(nature.kind)}
                    style={[styles.segment, actif && styles.segmentActif]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: actif }}
                    accessibilityLabel={nature.label}
                  >
                    <Text
                      style={[styles.segmentTexte, actif && styles.segmentTexteActif]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.85}
                    >
                      {nature.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Le filigrane appelle le détail utile à CETTE nature de retour ;
                il change avec elle et tient lieu d'intitulé. */}
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={info.placeholder}
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              maxLength={FEEDBACK_MAX}
              accessibilityLabel={info.champ}
            />

            {/* UNE SEULE ACTION. Éteinte tant que rien n'est écrit : ouvrir une
                application de messagerie sur un brouillon vide n'aide personne. */}
            <Pressable
              onPress={envoyer}
              disabled={!pret}
              style={({ pressed }) => [
                styles.action,
                !pret && styles.actionEteinte,
                pressed && pret && styles.presse,
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: !pret }}
              accessibilityLabel="Ouvrir le brouillon dans mon application de messagerie"
            >
              <Text style={styles.actionTexte}>Ouvrir mon mail</Text>
            </Pressable>

            {/* La promesse, écrite là où elle sert : juste sous le bouton, au
                moment où l'on se demande ce qu'il va faire. */}
            <Text style={styles.note}>
              L’app n’envoie rien elle-même : elle prépare un brouillon, tu le relis et tu
              l’envoies.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    scrim: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(10,9,14,0.55)',
    },
    // Posée contre le bord inférieur : seuls les coins hauts sont arrondis,
    // le bas file sous l'écran plutôt que de flotter.
    esquive: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      // Deuxième garde-fou, pour le grossissement système du texte : la
      // feuille ne dépasse pas la place qui lui reste une fois le clavier posé.
      maxHeight: '100%',
      backgroundColor: colors.surface,
      borderTopLeftRadius: radii.lg,
      borderTopRightRadius: radii.lg,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.md,
    },

    entete: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: fonts.body + 3,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    fermer: {
      width: 32,
      height: 32,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
    },
    presse: {
      opacity: 0.7,
    },

    rail: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.pill,
      padding: 3,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm + 1,
      borderRadius: radii.pill,
    },
    segmentActif: {
      backgroundColor: colors.surface,
    },
    segmentTexte: {
      fontSize: fonts.small + 1,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    // `accentText` est le jeton prévu pour de l'accent en texte sur un fond
    // neutre : il tient le contraste là où `accent` ne le tiendrait pas.
    segmentTexteActif: {
      color: colors.accentText,
      fontWeight: '800',
    },

    input: {
      // Se rétracte quand la place manque (petit écran, clavier ouvert, texte
      // agrandi) : c'est le seul bloc de la feuille dont la hauteur soit un
      // confort et non une nécessité.
      flexShrink: 1,
      minHeight: 110,
      maxHeight: 200,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.md,
      // Un trait qui dit où l'on écrit. Sans lui, seul le fond distinguait le
      // champ de la feuille qui le porte, à 1.32:1, sous les 3:1 qu'un élément
      // non textuel doit tenir pour être identifiable.
      borderWidth: 1,
      borderColor: colors.borderStrong,
      padding: spacing.md,
      fontSize: fonts.small + 2,
      lineHeight: (fonts.small + 2) * 1.45,
      color: colors.textPrimary,
    },

    action: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.action,
      borderRadius: radii.md,
      paddingVertical: spacing.md,
    },
    actionEteinte: {
      opacity: 0.4,
    },
    actionTexte: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.onAction,
    },
    note: {
      textAlign: 'center',
      fontSize: fonts.tiny,
      lineHeight: fonts.tiny * 1.5,
      color: colors.textMuted,
      marginTop: -spacing.xs,
    },
  });
}
