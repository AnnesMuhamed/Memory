import type { GameOutcome, Player, ResultsThemeAssets, Theme } from '../../types/game';

import { RESULTS_THEME_ASSETS } from '../../constants/assets';
import { GAME_OVER_TO_WINNER_DELAY_MS } from '../../constants/timing';
import { gameState } from '../../state/game-state';
import { settings } from '../../state/settings';
import { clearGameBoard, resetExitButton } from '../game/game';
import { resetSettings, getSettingsScreen, getStartButton } from '../settings/settings';

import { hideDrawPanel, showDrawPanel } from './draw/draw';
import { hideFinalScore, showFinalScore } from './final-score/final-score';
import { hideGameOverPanel, showGameOverPanel } from './game-over/game-over';
import { resetWinnerPanel, showWinnerPanel } from './winner/winner';

import './results.scss';
import './gaming-theme/gaming-theme.scss';

let winnerRevealTimeoutId: number | null = null;

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
  const themeAssets = RESULTS_THEME_ASSETS[settings.theme];
  const outcome = getGameOutcome();
  applyResultsTheme(resultsScreen, settings.theme);
  hideAllResultPanels();
  showFinalScore(themeAssets);
  showOutcomePanel(outcome, themeAssets);
  revealResultsScreen(gameScreen, resultsScreen);
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
  hideScreensForSettings(settingsScreen, gameScreen, resultsScreen);
}

/**
 * Calculates the game outcome relative to the selected player.
 *
 * @returns `'win'`, `'lose'`, or `'draw'` based on final scores.
 */
function getWinner(): Player {
  return gameState.blueScore > gameState.orangeScore ? 'blue' : 'orange';
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
  if (settings.player === getWinner()) {
    return 'win';
  }
  return 'lose';
}

/**
 * Shows the result panel that matches the game outcome.
 *
 * @param outcome - The calculated game outcome.
 * @param themeAssets - Asset URLs for the active theme.
 */
function showOutcomePanel(outcome: GameOutcome, themeAssets: ResultsThemeAssets): void {
  if (outcome === 'win') {
    showWinnerPanel(themeAssets, getWinner());
    return;
  }
  if (outcome === 'draw') {
    showDrawPanel(themeAssets);
    return;
  }
  showGameOverPanel();
  scheduleWinnerRevealAfterGameOver(themeAssets);
}

/**
 * Reveals the winner panel after the game over screen has been shown.
 *
 * @param themeAssets - Asset URLs for the active theme.
 */
function scheduleWinnerRevealAfterGameOver(themeAssets: ResultsThemeAssets): void {
  clearWinnerRevealTimeout();
  winnerRevealTimeoutId = window.setTimeout(() => {
    hideGameOverPanel();
    showWinnerPanel(themeAssets, getWinner());
    winnerRevealTimeoutId = null;
  }, GAME_OVER_TO_WINNER_DELAY_MS);
}

/**
 * Cancels a pending winner reveal after game over.
 */
function clearWinnerRevealTimeout(): void {
  if (winnerRevealTimeoutId === null) {
    return;
  }
  window.clearTimeout(winnerRevealTimeoutId);
  winnerRevealTimeoutId = null;
}

/**
 * Switches from the game screen to the results screen.
 *
 * @param gameScreen - The game screen element.
 * @param resultsScreen - The results screen element.
 */
function revealResultsScreen(gameScreen: HTMLElement, resultsScreen: HTMLElement): void {
  gameScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');
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
  applyResultsBackButton(theme);
  document
    .getElementById('results-winner-icon')
    ?.classList.toggle('results-panel__player-icon--gaming', theme === 'gaming');
}

/**
 * Applies theme-specific styling to the results back button.
 *
 * @param theme - The active game theme.
 */
function applyResultsBackButton(theme: Theme): void {
  const backButton = document.getElementById('results-back');
  if (!backButton) {
    return;
  }
  backButton.classList.remove('results-back--code-vibes', 'results-back--gaming');
  backButton.classList.add(`results-back--${theme}`);
  backButton.setAttribute('aria-label', theme === 'gaming' ? 'Home' : 'Back to start');
}

/**
 * Hides all result panels before showing a new outcome.
 */
function hideAllResultPanels(): void {
  clearWinnerRevealTimeout();
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

/**
 * Hides game and results screens and returns to settings.
 *
 * @param settingsScreen - The settings screen element.
 * @param gameScreen - The game screen element.
 * @param resultsScreen - The results screen element, if present.
 */
function hideScreensForSettings(
  settingsScreen: HTMLElement,
  gameScreen: HTMLElement,
  resultsScreen: HTMLElement | null,
): void {
  gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');
  gameScreen.classList.add('hidden');
  resultsScreen?.classList.add('hidden');
  settingsScreen.classList.remove('hidden');
}
