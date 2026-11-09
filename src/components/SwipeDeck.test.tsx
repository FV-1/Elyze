import { createRef } from 'react';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { SwipeDeck, SwipeDeckHandle } from './SwipeDeck';
import { ThemeProvider } from '../theme/ThemeContext';
import { PROPOSALS } from '../data/proposals';
import { THEMES_BY_ID } from '../data/themes';

// LE BLOCAGE DES BOUTONS. Après une réponse, le paquet garde un instant le
// déclencheur de la carte qui vient de partir, le temps que la suivante se
// déclare carte du dessus. Un appui tombé là relançait cette carte déjà
// validée : `swipeTop` répondait « parti », l'écran éteignait ses boutons en
// attendant une sortie qui ne venait jamais, et la partie restait figée.
describe('SwipeDeck', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('ne relance pas une carte qui a déjà validé sa réponse', () => {
    const ref = createRef<SwipeDeckHandle>();
    const onSwipe = jest.fn();
    let tree: ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <ThemeProvider>
          <SwipeDeck
            ref={ref}
            proposals={PROPOSALS.slice(0, 5)}
            // L'index reste à 0 : c'est exactement l'intervalle en cause, où
            // le parent n'a pas encore rendu la carte suivante.
            currentIndex={0}
            themesById={THEMES_BY_ID}
            onSwipe={onSwipe}
            onOpenDebate={() => {}}
          />
        </ThemeProvider>
      );
    });

    let premier = false;
    renderer.act(() => {
      premier = ref.current!.swipeTop('like');
    });
    renderer.act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(premier).toBe(true);
    expect(onSwipe).toHaveBeenCalledTimes(1);

    let second = true;
    renderer.act(() => {
      second = ref.current!.swipeTop('like');
    });
    renderer.act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(second).toBe(false);
    expect(onSwipe).toHaveBeenCalledTimes(1);

    renderer.act(() => tree!.unmount());
  });
});
