import { settings } from '../../state/settings';
import { gameState } from '../../state/game-state';
import { applyCodeVibesGameScreen } from './code-vibes-theme/code-vibes-theme';
import { applyGamingGameScreen } from './gaming-theme/gaming-theme';
import { hideExitConfirm, showExitConfirm } from './exit-confirm/exit-confirm';
import { applyGameHeader } from './game-header';
import { resetExitButton, showExitDefault, showExitHover } from './game-exit-button';
import { clearGameBoard, renderGameBoard } from './memory-board/memory-board-render';
import './game.scss';
import './code-vibes-theme/code-vibes-theme.scss';
import './gaming-theme/gaming-theme.scss';

/**
 * Initializes game screen event listeners for exit button and page restore.
 *
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initGame(signal: AbortSignal): void {
    const exitButton = document.getElementById('game-exit');
    exitButton?.addEventListener('click', showExitConfirm, { signal });
    exitButton?.addEventListener('mouseenter', showExitHover, { signal });
    exitButton?.addEventListener('mouseleave', showExitDefault, { signal });
    window.addEventListener('pageshow', handlePageShow, { signal });
}

/**
 * Resets the exit button after the page is restored from the browser cache.
 *
 * @param event - The page show event from the browser.
 */
function handlePageShow(event: PageTransitionEvent): void {
    if (event.persisted) {
        resetExitButton();
    }
}

/**
 * Starts a new game with the current settings and renders the memory board.
 */
export function startGame(): void {
    const settingsScreen = document.getElementById('settings-screen');
    const gameScreen = document.getElementById('game-screen');
    if (!canStartGame(settingsScreen, gameScreen)) {
        return;
    }
    applyThemeToScreen(gameScreen as HTMLElement);
    resetScores();
    applyGameHeader();
    renderGameBoard();
    hideExitConfirm();
    showGameScreen(settingsScreen as HTMLElement, gameScreen as HTMLElement);
}

/**
 * Checks whether all data needed to start a game is available.
 *
 * @param settingsScreen - The settings screen element.
 * @param gameScreen - The game screen element.
 * @returns True when the game can start.
 */
function canStartGame(settingsScreen: HTMLElement | null, gameScreen: HTMLElement | null): boolean {
    return Boolean(settingsScreen && gameScreen && settings.theme && settings.player && settings.boardSize);
}

/**
 * Applies the selected theme class to the game screen.
 *
 * @param gameScreen - The game screen root element.
 */
function applyThemeToScreen(gameScreen: HTMLElement): void {
    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');
    if (settings.theme === 'code-vibes') {
        applyCodeVibesGameScreen(gameScreen);
    }
    if (settings.theme === 'gaming') {
        applyGamingGameScreen(gameScreen);
    }
}

/**
 * Resets player scores and the current player for a new game.
 */
function resetScores(): void {
    gameState.blueScore = 0;
    gameState.orangeScore = 0;
    gameState.currentPlayer = settings.player;
}

/**
 * Hides the settings screen and shows the game screen.
 *
 * @param settingsScreen - The settings screen element.
 * @param gameScreen - The game screen element.
 */
function showGameScreen(settingsScreen: HTMLElement, gameScreen: HTMLElement): void {
    settingsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

/**
 * Leaves the game screen and returns to settings without resetting selections.
 */
export function exitGame(): void {
    const settingsScreen = document.getElementById('settings-screen');
    const gameScreen = document.getElementById('game-screen');
    if (!settingsScreen || !gameScreen) {
        return;
    }
    hideExitConfirm();
    resetExitButton();
    clearGameBoard();
    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');
    gameScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

export { clearGameBoard, resetExitButton };
