import type { GameOutcome, Player, Theme } from '../../types/game';
import { resultsThemeAssets } from '../../constants/assets';
import { settings } from '../../state/settings';
import { gameState } from '../../state/game-state';
import { resetSettings, getSettingsScreen, getStartButton } from '../settings/settings';
import { clearGameBoard, resetExitButton } from '../game/game';
import { hideDrawPanel, showDrawPanel } from './draw/draw';
import { hideFinalScore, showFinalScore } from './final-score/final-score';
import { hideGameOverPanel, showGameOverPanel } from './game-over/game-over';
import { resetWinnerPanel, showWinnerPanel } from './winner/winner';
import './results.scss';
import './gaming-theme/gaming-theme.scss';

/**
 * Registers the back button handler on the results screen.
 *
 * @param onBack - Callback invoked when the player returns to settings.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initResults(onBack: () => void, signal: AbortSignal): void {
    document.getElementById('results-back')?.addEventListener(
        'click',
        () => {
            onBack();
        },
        { signal },
    );
}

/**
 * Determines the game outcome and shows the matching results panel.
 */
export function showResultsScreen(): void {
    const gameScreen = document.getElementById('game-screen');
    const resultsScreen = document.getElementById('results-screen');

    if (!gameScreen || !resultsScreen || !settings.theme) {
        return;
    }

    const themeAssets = resultsThemeAssets[settings.theme];
    const outcome = getGameOutcome();

    applyResultsTheme(resultsScreen, settings.theme);
    hideAllResultPanels();
    showFinalScore(themeAssets);

    if (outcome === 'win') {
        const winner: Player = gameState.blueScore > gameState.orangeScore ? 'blue' : 'orange';
        showWinnerPanel(themeAssets, winner);
    }

    if (outcome === 'draw') {
        showDrawPanel(themeAssets);
    }

    if (outcome === 'lose') {
        showGameOverPanel();
    }

    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

/**
 * Resets game state and navigates from the results screen back to settings.
 */
export function backToStart(): void {
    const settingsScreen = getSettingsScreen();
    const gameScreen = document.getElementById('game-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startButton = getStartButton();

    if (!settingsScreen || !gameScreen || !startButton) {
        return;
    }

    resetSettings(startButton);
    resetExitButton();
    clearGameBoard();
    resetResultsScreen();

    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');
    gameScreen.classList.add('hidden');
    resultsScreen?.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

/**
 * Calculates the game outcome relative to the selected player.
 *
 * @returns `'win'`, `'lose'`, or `'draw'` based on final scores.
 */
function getGameOutcome(): GameOutcome {
    if (gameState.blueScore === gameState.orangeScore) {
        return 'draw';
    }

    const winner: Player = gameState.blueScore > gameState.orangeScore ? 'blue' : 'orange';

    if (settings.player === winner) {
        return 'win';
    }

    return 'lose';
}

/**
 * Applies theme-specific classes and labels to the results screen.
 *
 * @param resultsScreen - The results screen root element.
 * @param theme - The active game theme.
 */
function applyResultsTheme(resultsScreen: HTMLElement, theme: Theme): void {
    resultsScreen.classList.remove('results-screen--code-vibes', 'results-screen--gaming');
    resultsScreen.classList.add(`results-screen--${theme}`);

    const backButton = document.getElementById('results-back');
    const winnerIcon = document.getElementById('results-winner-icon');

    backButton?.classList.remove('results-back--code-vibes', 'results-back--gaming');
    backButton?.classList.add(`results-back--${theme}`);
    winnerIcon?.classList.toggle('results-panel__player-icon--gaming', theme === 'gaming');

    if (backButton) {
        backButton.setAttribute('aria-label', theme === 'gaming' ? 'Home' : 'Back to start');
    }
}

/**
 * Hides all result panels before showing a new outcome.
 */
function hideAllResultPanels(): void {
    resetWinnerPanel();
    hideDrawPanel();
    hideGameOverPanel();
    hideFinalScore();
}

/**
 * Resets the results screen to its default hidden state and styling.
 */
function resetResultsScreen(): void {
    const resultsScreen = document.getElementById('results-screen');
    const backButton = document.getElementById('results-back');

    resultsScreen?.classList.remove('results-screen--code-vibes', 'results-screen--gaming');
    hideAllResultPanels();
    backButton?.classList.remove('results-back--code-vibes', 'results-back--gaming');
    backButton?.classList.add('results-back--code-vibes');
    backButton?.setAttribute('aria-label', 'Back to start');
}
