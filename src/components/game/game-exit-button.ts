import type { Theme } from '../../types/game';
import { exitImages } from '../../constants/assets';
import { settings } from '../../state/settings';

let activeExitTheme: Theme | null = null;

/**
 * Resets the exit button to its default hidden and unstyled state.
 */
export function resetExitButton(): void {
    activeExitTheme = null;
    const exitButton = document.getElementById('game-exit');
    exitButton?.classList.remove('game-exit--code-vibes', 'game-exit--gaming', 'game-exit--hover');
    hideExitImage();
    hideGamingDefaultLabel();
}

/**
 * Configures the exit button appearance for the active theme.
 */
export function applyExitButton(): void {
    const exitButton = document.getElementById('game-exit');
    if (!exitButton || !settings.theme) {
        return;
    }
    activeExitTheme = settings.theme;
    exitButton.classList.remove('game-exit--code-vibes', 'game-exit--gaming');
    exitButton.classList.add(`game-exit--${settings.theme}`);
    showExitDefault();
}

/**
 * Shows the default exit button image for the active theme.
 */
export function showExitDefault(): void {
    setExitImage(activeExitTheme, 'default', false);
}

/**
 * Shows the hover exit button image for the active theme.
 */
export function showExitHover(): void {
    setExitImage(activeExitTheme, 'hover', true);
}

/**
 * Updates the exit button image and hover state.
 *
 * @param theme - The active exit button theme.
 * @param variant - Whether to show the default or hover image.
 * @param isHover - Whether the hover class should be applied.
 */
function setExitImage(theme: Theme | null, variant: 'default' | 'hover', isHover: boolean): void {
    const exitButton = document.getElementById('game-exit');
    const exitImage = document.getElementById('game-exit-img') as HTMLImageElement | null;
    if (!theme || !exitImage) {
        return;
    }
    exitButton?.classList.toggle('game-exit--hover', isHover);
    document.getElementById('game-exit-gaming-default')?.setAttribute('hidden', '');
    exitImage.hidden = false;
    exitImage.src = exitImages[theme][variant];
}

/**
 * Hides the exit button image element.
 */
function hideExitImage(): void {
    const exitImage = document.getElementById('game-exit-img') as HTMLImageElement | null;
    if (!exitImage) {
        return;
    }
    exitImage.hidden = true;
    exitImage.removeAttribute('src');
}

/**
 * Hides the default Gaming theme exit label element.
 */
function hideGamingDefaultLabel(): void {
    const gamingDefault = document.getElementById('game-exit-gaming-default');
    if (gamingDefault) {
        gamingDefault.hidden = true;
    }
}
