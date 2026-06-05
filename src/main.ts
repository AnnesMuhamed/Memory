import { initStartScreen, showSettingsScreen } from './components/start-screen/start-screen';
import { initSettings, resetSettings, getStartButton } from './components/settings/settings';
import { initGame, startGame, exitGame } from './components/game/game';
import { initExitConfirm } from './components/game/exit-confirm/exit-confirm';
import { initResults, backToStart } from './components/results/results';
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
    const { signal } = abortController;

    initStartScreen(showSettingsScreen, signal);

    initSettings(() => {
        startGame();
    }, signal);

    initGame(signal);

    initExitConfirm(() => {
        const startButton = getStartButton();
        if (startButton) {
            resetSettings(startButton);
        }
        exitGame();
    }, signal);

    initResults(backToStart, signal);

    initCleanup = () => {
        abortController.abort();
    };
}

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        initCleanup?.();
    });
}
