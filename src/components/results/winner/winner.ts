import type { Player, ResultsThemeAssets } from '../../../types/game';
import './winner.scss';

/**
 * Displays the winner results panel with theme-specific content and confetti.
 *
 * @param themeAssets - Asset URLs and labels for the active theme.
 * @param winner - The player who won the game.
 */
export function showWinnerPanel(themeAssets: ResultsThemeAssets, winner: Player): void {
    const winnerName = document.getElementById('results-winner-name');
    const winnerIcon = document.getElementById('results-winner-icon') as HTMLImageElement | null;
    const confetti = document.getElementById('results-confetti') as HTMLImageElement | null;

    if (winnerName) {
        winnerName.textContent = themeAssets.winnerLabels[winner];
        winnerName.classList.remove('results-panel__title--blue', 'results-panel__title--orange');
        winnerName.classList.add(`results-panel__title--${winner}`);
    }

    if (winnerIcon) {
        winnerIcon.src = themeAssets.winnerPlayerImages[winner];
    }

    if (themeAssets.confetti && confetti) {
        confetti.src = themeAssets.confetti;
        confetti.classList.remove('hidden');
    }

    document.getElementById('results-winner')?.classList.remove('hidden');
}

/**
 * Hides the winner results panel and confetti overlay.
 */
export function hideWinnerPanel(): void {
    document.getElementById('results-winner')?.classList.add('hidden');
    document.getElementById('results-confetti')?.classList.add('hidden');
}

/**
 * Resets the winner panel to its default hidden state and removes theme classes.
 */
export function resetWinnerPanel(): void {
    hideWinnerPanel();
    document.getElementById('results-winner-icon')?.classList.remove('results-panel__player-icon--gaming');
}
