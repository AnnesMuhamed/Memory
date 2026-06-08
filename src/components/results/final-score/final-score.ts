import type { ResultsThemeAssets } from '../../../types/game';
import { gameState } from '../../../state/game-state';
import './final-score.scss';

/**
 * Shows the final score block with current blue and orange points.
 *
 * @param themeAssets - Asset URLs for the active theme score icons.
 */
export function showFinalScore(themeAssets: ResultsThemeAssets): void {
    applyScoreValues();
    applyScoreIcons(themeAssets);
    document.getElementById('results-final-score')?.classList.remove('hidden');
}

/**
 * Hides the final score block.
 */
export function hideFinalScore(): void {
    document.getElementById('results-final-score')?.classList.add('hidden');
}

/**
 * Writes the current game scores into the score value elements.
 */
function applyScoreValues(): void {
    const blueScore = document.getElementById('results-blue-score');
    const orangeScore = document.getElementById('results-orange-score');

    if (blueScore) {
        blueScore.textContent = String(gameState.blueScore);
    }

    if (orangeScore) {
        orangeScore.textContent = String(gameState.orangeScore);
    }
}

/**
 * Sets the player icon sources for the final score display.
 *
 * @param themeAssets - Asset URLs for the active theme score icons.
 */
function applyScoreIcons(themeAssets: ResultsThemeAssets): void {
    const blueIcon = document.getElementById('results-blue-icon') as HTMLImageElement | null;
    const orangeIcon = document.getElementById('results-orange-icon') as HTMLImageElement | null;

    if (blueIcon) {
        blueIcon.src = themeAssets.scoreIcons.blue;
    }

    if (orangeIcon) {
        orangeIcon.src = themeAssets.scoreIcons.orange;
    }
}
