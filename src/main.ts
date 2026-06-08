import { initExitConfirm } from './components/game/exit-confirm/exit-confirm';
import { initGame, startGame, exitGame } from './components/game/game';
import { initResults, backToStart } from './components/results/results';
import { initSettings, resetSettings, getStartButton } from './components/settings/settings';
import { initStartScreen, showSettingsScreen } from './components/start-screen/start-screen';

import './styles/style.scss';

let initCleanup: (() => void) | undefined;

init();

/**
 * Initializes the application by wiring up all screen components and event listeners.
 * Cleans up any previous initialization before registering new handlers.
 */
function init(): void {
  initCleanup?.();
  const abortController = new AbortController();
  registerAppHandlers(abortController.signal);
  initCleanup = () => {
    abortController.abort();
  };
}

/**
 * Registers event handlers for all application screens.
 *
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
function registerAppHandlers(signal: AbortSignal): void {
  initStartScreen(showSettingsScreen, signal);
  initSettings(startGame, signal);
  initGame(signal);
  initExitConfirm(handleConfirmedExit, signal);
  initResults(backToStart, signal);
}

/**
 * Resets settings and leaves the game after exit confirmation.
 */
function handleConfirmedExit(): void {
  const startButton = getStartButton();
  if (startButton) {
    resetSettings(startButton);
  }
  exitGame();
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    initCleanup?.();
  });
}
