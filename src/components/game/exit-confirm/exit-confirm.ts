import { settings } from '../../../state/settings';

import { isGamingTheme } from '../gaming-theme/gaming-theme';

import './exit-confirm.scss';

type ExitConfirmTheme = 'gaming' | 'code-vibes';

/**
 * Registers click handlers for the exit confirmation dialog buttons.
 *
 * @param onExit - Callback invoked when the player confirms leaving the game.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initExitConfirm(onExit: () => void, signal: AbortSignal): void {
  document.getElementById('exit-confirm-back')?.addEventListener(
    'click',
    () => {
      hideExitConfirm();
    },
    { signal },
  );
  document.getElementById('exit-confirm-exit')?.addEventListener(
    'click',
    () => {
      hideExitConfirm();
      onExit();
    },
    { signal },
  );
}

/**
 * Shows the exit confirmation dialog with theme-specific styling and button labels.
 */
export function showExitConfirm(): void {
  const exitConfirm = document.getElementById('exit-confirm');
  if (!exitConfirm) {
    return;
  }
  const theme = getExitConfirmTheme();
  applyExitConfirmTheme(exitConfirm, theme);
  applyExitConfirmLabels(theme);
  exitConfirm.classList.remove('hidden');
}

/**
 * Hides the exit confirmation dialog.
 */
export function hideExitConfirm(): void {
  document.getElementById('exit-confirm')?.classList.add('hidden');
}

/**
 * Resolves the active theme for the exit confirmation dialog.
 *
 * @returns The theme class name for the exit confirmation dialog.
 */
function getExitConfirmTheme(): ExitConfirmTheme {
  return isGamingTheme(settings.theme) ? 'gaming' : 'code-vibes';
}

/**
 * Applies theme-specific classes to the exit confirmation dialog.
 *
 * @param exitConfirm - The exit confirmation dialog root element.
 * @param theme - The active theme for the dialog.
 */
function applyExitConfirmTheme(exitConfirm: HTMLElement, theme: ExitConfirmTheme): void {
  exitConfirm.classList.remove('exit-confirm--code-vibes', 'exit-confirm--gaming');
  exitConfirm.classList.add(`exit-confirm--${theme}`);
}

/**
 * Sets theme-specific button labels on the exit confirmation dialog.
 *
 * @param theme - The active theme for the dialog.
 */
function applyExitConfirmLabels(theme: ExitConfirmTheme): void {
  const backButton = document.getElementById('exit-confirm-back');
  const exitButton = document.getElementById('exit-confirm-exit');
  if (!backButton || !exitButton) {
    return;
  }
  if (theme === 'gaming') {
    backButton.textContent = 'No, back to game';
    exitButton.textContent = 'Yes, quit game';
    return;
  }
  backButton.textContent = 'Back to game';
  exitButton.textContent = 'Exit game';
}
