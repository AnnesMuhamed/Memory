import { prepareSettingsScreen } from '../settings/settings';

import './start-screen.scss';

/**
 * Sets up the start screen play button and navigates to settings on click.
 *
 * @param onPlay - Callback invoked after the home screen is hidden.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initStartScreen(onPlay: () => void, signal: AbortSignal): void {
  const playButton = document.getElementById('play-button');
  const homeScreen = document.getElementById('home-screen');
  if (!playButton || !homeScreen) {
    return;
  }
  playButton.addEventListener(
    'click',
    () => handlePlayClick(homeScreen, onPlay),
    { signal },
  );
}

/**
 * Reveals the settings screen.
 */
export function showSettingsScreen(): void {
  prepareSettingsScreen();
  document.getElementById('settings-screen')?.classList.remove('hidden');
}

/**
 * Hides the home screen and opens settings.
 *
 * @param homeScreen - The home screen root element.
 * @param onPlay - Callback invoked after the home screen is hidden.
 */
function handlePlayClick(homeScreen: HTMLElement, onPlay: () => void): void {
  homeScreen.classList.add('hidden');
  onPlay();
}
