import { settings } from '../../../state/settings';
import { isGamingTheme } from '../gaming-theme/gaming-theme';
import './exit-confirm.scss';

/**
 * Registers click handlers for the exit confirmation dialog buttons.
 *
 * @param onExit - Callback invoked when the player confirms leaving the game.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initExitConfirm(onExit: () => void, signal: AbortSignal): void {
    document.getElementById('exit-confirm-back')?.addEventListener(
        'click',
        () => {
            hideExitConfirm();
        },
        { signal },
    );

    document.getElementById('exit-confirm-exit')?.addEventListener(
        'click',
        () => {
            hideExitConfirm();
            onExit();
        },
        { signal },
    );
}

/**
 * Shows the exit confirmation dialog with theme-specific styling and button labels.
 */
export function showExitConfirm(): void {
    const exitConfirm = document.getElementById('exit-confirm');
    if (!exitConfirm) {
        return;
    }

    const theme = isGamingTheme(settings.theme) ? 'gaming' : 'code-vibes';
    exitConfirm.classList.remove('exit-confirm--code-vibes', 'exit-confirm--gaming');
    exitConfirm.classList.add(`exit-confirm--${theme}`);

    const backButton = document.getElementById('exit-confirm-back');
    const exitButton = document.getElementById('exit-confirm-exit');

    if (theme === 'gaming') {
        if (backButton) {
            backButton.textContent = 'No, back to game';
        }
        if (exitButton) {
            exitButton.textContent = 'Yes, quit game';
        }
    } else {
        if (backButton) {
            backButton.textContent = 'Back to game';
        }
        if (exitButton) {
            exitButton.textContent = 'Exit game';
        }
    }

    exitConfirm.classList.remove('hidden');
}

/**
 * Hides the exit confirmation dialog.
 */
export function hideExitConfirm(): void {
    document.getElementById('exit-confirm')?.classList.add('hidden');
}
