import type { BoardSize, Player, Theme } from '../../types/game';
import {
    boardLabels,
    playerLabels,
    slashDefault,
    slashSelected,
    themePreviewImages,
} from '../../constants/assets';
import { settings, settingsStorageKey } from '../../state/settings';
import { gameState } from '../../state/game-state';
import './settings.scss';

/**
 * Initializes settings form listeners and the start button.
 *
 * @param onStart - Callback invoked when the player starts the game with valid settings.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initSettings(onStart: () => void, signal: AbortSignal): void {
    const startButton = document.getElementById('settings-start');

    if (!startButton) {
        return;
    }

    document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
        input.addEventListener(
            'change',
            () => {
                updateSettings(input);
                updateFooter();
                updateStartButton(startButton);
                updatePreview();
            },
            { signal },
        );
    });

    startButton.addEventListener(
        'click',
        () => {
            if (startButton.classList.contains('settings-start--disabled') || !isSettingsComplete()) {
                return;
            }

            onStart();
        },
        { signal },
    );
}

/**
 * Resets all settings, game state, and UI to their initial values.
 *
 * @param startButton - The settings start button element to update.
 */
export function resetSettings(startButton: HTMLElement): void {
    settings.theme = null;
    settings.player = null;
    settings.boardSize = null;

    gameState.blueScore = 0;
    gameState.orangeScore = 0;
    gameState.currentPlayer = null;

    document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
        input.checked = false;
    });

    clearGameStorage();
    updateFooter();
    updateStartButton(startButton);
    updatePreview();
}

/**
 * Checks whether all required settings have been selected.
 *
 * @returns True when theme, player, and board size are all set.
 */
export function isSettingsComplete(): boolean {
    return settings.theme !== null && settings.player !== null && settings.boardSize !== null;
}

/**
 * Updates the shared settings state from a changed radio input.
 *
 * @param input - The settings radio input that changed.
 */
function updateSettings(input: HTMLInputElement): void {
    const { name, value } = input;

    if (name === 'theme') {
        settings.theme = value as Theme;
    }

    if (name === 'player') {
        settings.player = value as Player;
    }

    if (name === 'board-size') {
        settings.boardSize = value as BoardSize;
    }
}

/**
 * Enables or disables the start button based on settings completeness.
 *
 * @param startButton - The settings start button element to update.
 */
function updateStartButton(startButton: HTMLElement): void {
    const complete = isSettingsComplete();

    startButton.classList.toggle('settings-start--disabled', !complete);
    startButton.classList.toggle('settings-start--active', complete);

    if (startButton instanceof HTMLButtonElement) {
        startButton.disabled = !complete;
    }
}

/**
 * Updates the settings footer labels and slash icons to reflect current selections.
 */
function updateFooter(): void {
    const themeLabel = document.getElementById('footer-theme-label');
    const playerLabel = document.getElementById('footer-player-label');
    const boardLabel = document.getElementById('footer-board-label');

    if (!themeLabel || !playerLabel || !boardLabel) {
        return;
    }

    themeLabel.textContent = settings.theme ? 'Game theme' : 'Theme';
    playerLabel.textContent = settings.player ? playerLabels[settings.player] : 'Player';
    boardLabel.textContent = settings.boardSize ? boardLabels[settings.boardSize] : 'Board size';

    document.querySelectorAll<HTMLImageElement>('.settings-footer__slash').forEach((slash) => {
        const field = slash.dataset.after;
        const isSelected =
            (field === 'theme' && settings.theme !== null) ||
            (field === 'player' && settings.player !== null);

        slash.src = isSelected ? slashSelected : slashDefault;
        slash.classList.toggle('settings-footer__slash--selected', isSelected);
    });
}

/**
 * Shows or hides the theme preview image based on the selected theme.
 */
function updatePreview(): void {
    const previewImage = document.getElementById('settings-preview-image') as HTMLImageElement | null;

    if (!previewImage) {
        return;
    }

    if (settings.theme) {
        previewImage.src = themePreviewImages[settings.theme];
        previewImage.hidden = false;
        return;
    }

    previewImage.hidden = true;
    previewImage.removeAttribute('src');
}

/**
 * Removes persisted settings from browser storage.
 */
function clearGameStorage(): void {
    localStorage.removeItem(settingsStorageKey);
    sessionStorage.removeItem(settingsStorageKey);
}

/**
 * Returns the settings start button element.
 *
 * @returns The start button element, or null if not found.
 */
export function getStartButton(): HTMLElement | null {
    return document.getElementById('settings-start');
}

/**
 * Returns the settings screen container element.
 *
 * @returns The settings screen element, or null if not found.
 */
export function getSettingsScreen(): HTMLElement | null {
    return document.getElementById('settings-screen');
}
