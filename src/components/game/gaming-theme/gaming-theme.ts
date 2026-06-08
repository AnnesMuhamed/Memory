import type { Theme } from '../../../types/game';

/**
 * Applies Gaming theme classes to the game screen container.
 *
 * @param gameScreen - The game screen root element.
 */
export function applyGamingGameScreen(gameScreen: HTMLElement): void {
  gameScreen.classList.remove('game-screen--code-vibes');
  gameScreen.classList.add('game-screen--gaming');
}

/**
 * Type guard that checks whether the given theme is the Gaming theme.
 *
 * @param theme - The theme value to check, or null if unset.
 * @returns True when the theme is `'gaming'`.
 */
export function isGamingTheme(theme: Theme | null): theme is 'gaming' {
  return theme === 'gaming';
}
