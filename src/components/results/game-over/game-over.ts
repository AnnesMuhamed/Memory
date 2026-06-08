import './game-over.scss';

/**
 * Displays the game over panel title for a losing outcome.
 */
export function showGameOverPanel(): void {
    document.getElementById('results-game-over')?.classList.remove('hidden');
}

/**
 * Hides the game over results panel.
 */
export function hideGameOverPanel(): void {
    document.getElementById('results-game-over')?.classList.add('hidden');
}
