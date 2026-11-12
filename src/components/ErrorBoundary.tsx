import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { Texte as Text } from './Texte';
import { ColorTokens, darkColors, lightColors, radii, spacing, fonts } from '../theme';
import { clearSession } from '../utils/storage';
import { ThemeIcon } from './ThemeIcon';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

// Filet de sécurité : sans ceci, une erreur de rendu imprévue dans n'importe
// quel écran fait planter toute l'application sur un écran blanc, sans
// aucun message pour l'utilisateur.
//
// L'écran de repli n'utilise pas `useColors()` : si la panne vient du système
// de thème lui-même, il doit pouvoir s'afficher quand même. Il lit donc
// directement `useColorScheme()` de React Native — le réglage de l'appareil,
// sans aucun code de l'app entre les deux. On reste indépendant du code
// suspect, sans pour autant envoyer un écran blanc plein format à quelqu'un
// qui utilise l'app en mode sombre.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string | null }) {
    if (__DEV__) {
      console.error('ErrorBoundary a intercepté une erreur :', error, info.componentStack);
    }
  }

  handleReset = () => {
    // Si l'erreur venait d'une session sauvegardée corrompue, la purger
    // évite de retomber immédiatement dans la même erreur au redémarrage.
    clearSession();
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return <ErrorFallback onReset={this.handleReset} />;
  }
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <ThemeIcon icon="WarningCircle" size={48} color={colors.textMuted} weight="duotone" style={styles.emoji} />
      <Text style={styles.title}>Un problème est survenu</Text>
      <Text style={styles.message}>
        L’application a rencontré une erreur inattendue. Tu peux réessayer, si le problème
        persiste, redémarre l’app.
      </Text>
      <Pressable
        onPress={onReset}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Réessayer"
      >
        <Text style={styles.buttonText}>Réessayer</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg,
      paddingHorizontal: spacing.xl,
      gap: spacing.sm,
    },
    emoji: {
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: fonts.title,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    message: {
      fontSize: fonts.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: fonts.body * 1.4,
      marginBottom: spacing.md,
    },
    button: {
      backgroundColor: colors.action,
      borderRadius: radii.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    buttonPressed: {
      backgroundColor: colors.actionPressed,
    },
    buttonText: {
      fontSize: fonts.body,
      fontWeight: '700',
      color: colors.onAction,
    },
  });
}
