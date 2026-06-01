import type { ResultsThemeAssets } from '../../../types/game';
import { gameState } from '../../../state/game-state';
import './game-over.scss';

/**
 * Displays the game over panel with final scores and player icons.
 *
 * @param themeAssets - Asset URLs for the active theme score icons.
 */
export function showGameOverPanel(themeAssets: ResultsThemeAssets): void {
    const blueScore = document.getElementById('results-blue-score');
    const orangeScore = document.getElementById('results-orange-score');
    const blueIcon = document.getElementById('results-blue-icon') as HTMLImageElement | null;
    const orangeIcon = document.getElementById('results-orange-icon') as HTMLImageElement | null;

    if (blueScore) {
        blueScore.textContent = String(gameState.blueScore);
    }

    if (orangeScore) {
        orangeScore.textContent = String(gameState.orangeScore);
    }

    if (blueIcon) {
        blueIcon.src = themeAssets.scoreIcons.blue;
    }

    if (orangeIcon) {
        orangeIcon.src = themeAssets.scoreIcons.orange;
    }

    document.getElementById('results-game-over')?.classList.remove('hidden');
}

/**
 * Hides the game over results panel.
 */
export function hideGameOverPanel(): void {
    document.getElementById('results-game-over')?.classList.add('hidden');
}
