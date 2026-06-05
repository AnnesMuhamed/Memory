import { gameState } from '../../state/game-state';
import { settings } from '../../state/settings';
import { pawnImages, playerLabelImages } from '../../constants/assets';
import type { Player } from '../../types/game';
import { applyExitButton } from './game-exit-button';

/**
 * Updates score display, player icon, and exit button in the game header.
 */
export function applyGameHeader(): void {
    updateScoreTexts();
    applyScoreIcons();
    applyCurrentPlayerIcon();
    applyExitButton();
}

/**
 * Writes the current scores into the header text elements.
 */
function updateScoreTexts(): void {
    const blueScore = document.getElementById('blue-score');
    const orangeScore = document.getElementById('orange-score');
    if (blueScore) {
        blueScore.textContent = String(gameState.blueScore);
    }
    if (orangeScore) {
        orangeScore.textContent = String(gameState.orangeScore);
    }
}

/**
 * Updates the current player icon in the game header.
 */
function applyCurrentPlayerIcon(): void {
    const playerIcon = document.getElementById('current-player-icon');
    const playerIconImage = document.getElementById('current-player-icon-image') as HTMLImageElement | null;
    const player = gameState.currentPlayer;
    if (!playerIcon || !playerIconImage || !player) {
        return;
    }
    playerIcon.classList.remove('game-header__player-icon--blue', 'game-header__player-icon--orange');
    playerIcon.classList.add(`game-header__player-icon--${player}`);
    playerIconImage.src = getPlayerIconSrc(player);
}

/**
 * Returns the player icon image URL for the active theme.
 *
 * @param player - The player whose icon is needed.
 * @returns The icon image URL.
 */
function getPlayerIconSrc(player: Player): string {
    if (settings.theme === 'code-vibes') {
        return playerLabelImages[player];
    }
    return pawnImages[player];
}

/**
 * Sets the score icon images in the header based on the active theme.
 */
function applyScoreIcons(): void {
    const blueIcon = document.getElementById('blue-score-icon') as HTMLImageElement | null;
    const orangeIcon = document.getElementById('orange-score-icon') as HTMLImageElement | null;
    if (!blueIcon || !orangeIcon || !settings.theme) {
        return;
    }
    if (settings.theme === 'code-vibes') {
        blueIcon.src = playerLabelImages.blue;
        orangeIcon.src = playerLabelImages.orange;
        return;
    }
    blueIcon.src = pawnImages.blue;
    orangeIcon.src = pawnImages.orange;
}

/**
 * Increments the score of the current player and refreshes the header.
 */
export function incrementCurrentPlayerScore(): void {
    if (gameState.currentPlayer === 'blue') {
        gameState.blueScore += 1;
    }
    if (gameState.currentPlayer === 'orange') {
        gameState.orangeScore += 1;
    }
    applyGameHeader();
}

/**
 * Switches the active player after a failed match attempt.
 */
export function switchCurrentPlayer(): void {
    if (!gameState.currentPlayer) {
        return;
    }
    const nextPlayer = gameState.currentPlayer === 'blue' ? 'orange' : 'blue';
    gameState.currentPlayer = nextPlayer;
    applyGameHeader();
}
