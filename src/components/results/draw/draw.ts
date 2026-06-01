import type { ResultsThemeAssets } from '../../../types/game';
import './draw.scss';

/**
 * Displays the draw results panel with the theme-specific draw illustration.
 *
 * @param themeAssets - Asset URLs for the active theme.
 */
export function showDrawPanel(themeAssets: ResultsThemeAssets): void {
    const drawIcon = document.getElementById('results-draw-icon') as HTMLImageElement | null;

    if (drawIcon) {
        drawIcon.src = themeAssets.drawImage;
    }

    document.getElementById('results-draw')?.classList.remove('hidden');
}

/**
 * Hides the draw results panel.
 */
export function hideDrawPanel(): void {
    document.getElementById('results-draw')?.classList.add('hidden');
}
