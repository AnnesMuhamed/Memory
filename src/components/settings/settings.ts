import type { BoardSize, Player, Theme } from '../../types/game';

import {
  BOARD_LABELS,
  PLAYER_LABELS,
  SLASH_DEFAULT,
  SLASH_SELECTED,
  THEME_PREVIEW_IMAGES,
} from '../../constants/assets';
import { gameState } from '../../state/game-state';
import { settings, SETTINGS_STORAGE_KEY } from '../../state/settings';

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
  bindSettingsInputs(startButton, signal);
  bindSettingsStart(onStart, startButton, signal);
}

/**
 * Resets all settings, game state, and UI to their initial values.
 *
 * @param startButton - The settings start button element to update.
 */
export function resetSettings(startButton: HTMLElement): void {
  resetSettingsState();
  resetSettingsInputs();
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

/**
 * Registers change listeners on all settings radio inputs.
 *
 * @param startButton - The settings start button element to update.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
function bindSettingsInputs(startButton: HTMLElement, signal: AbortSignal): void {
  document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
    input.addEventListener('change', () => handleSettingsChange(startButton, input), { signal });
  });
}

/**
 * Registers the settings start button click handler.
 *
 * @param onStart - Callback invoked when the player starts the game.
 * @param startButton - The settings start button element.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
function bindSettingsStart(onStart: () => void, startButton: HTMLElement, signal: AbortSignal): void {
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
 * Applies a settings change and refreshes dependent UI.
 *
 * @param startButton - The settings start button element to update.
 * @param input - The settings radio input that changed.
 */
function handleSettingsChange(startButton: HTMLElement, input: HTMLInputElement): void {
  updateSettings(input);
  updateFooter();
  updateStartButton(startButton);
  updatePreview();
}

/**
 * Clears settings and game state values.
 */
function resetSettingsState(): void {
  settings.theme = null;
  settings.player = null;
  settings.boardSize = null;
  gameState.blueScore = 0;
  gameState.orangeScore = 0;
  gameState.currentPlayer = null;
}

/**
 * Unchecks all settings radio inputs.
 */
function resetSettingsInputs(): void {
  document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
    input.checked = false;
  });
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
  updateFooterLabels();
  updateFooterSlashes();
}

/**
 * Updates the footer text labels for theme, player, and board size.
 */
function updateFooterLabels(): void {
  const themeLabel = document.getElementById('footer-theme-label');
  const playerLabel = document.getElementById('footer-player-label');
  const boardLabel = document.getElementById('footer-board-label');
  if (!themeLabel || !playerLabel || !boardLabel) {
    return;
  }
  themeLabel.textContent = settings.theme ? 'Game theme' : 'Theme';
  playerLabel.textContent = settings.player ? PLAYER_LABELS[settings.player] : 'Player';
  boardLabel.textContent = settings.boardSize ? BOARD_LABELS[settings.boardSize] : 'Board size';
}

/**
 * Updates slash icons in the settings footer based on current selections.
 */
function updateFooterSlashes(): void {
  document.querySelectorAll<HTMLImageElement>('.settings-footer__slash').forEach((slash) => {
    const field = slash.dataset.after;
    const isSelected = isFooterFieldSelected(field);
    slash.src = isSelected ? SLASH_SELECTED : SLASH_DEFAULT;
    slash.classList.toggle('settings-footer__slash--selected', isSelected);
  });
}

/**
 * Checks whether a footer slash should appear selected.
 *
 * @param field - The footer field name from the slash data attribute.
 * @returns True when the related setting has been selected.
 */
function isFooterFieldSelected(field: string | undefined): boolean {
  if (field === 'theme') {
    return settings.theme !== null;
  }
  if (field === 'player') {
    return settings.player !== null;
  }
  return false;
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
    previewImage.src = THEME_PREVIEW_IMAGES[settings.theme];
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
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  sessionStorage.removeItem(SETTINGS_STORAGE_KEY);
}
