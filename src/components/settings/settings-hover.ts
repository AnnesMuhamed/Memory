import type { BoardSize, Player, Theme } from '../../types/game';

let hoveredTheme: Theme | null = null;
let hoveredPlayer: Player | null = null;
let hoveredBoardSize: BoardSize | null = null;

/**
 * Registers hover listeners on all settings options.
 *
 * @param onHoverChange - Callback invoked when hover state changes.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function bindSettingsHover(onHoverChange: () => void, signal: AbortSignal): void {
  document.querySelectorAll<HTMLLabelElement>('.settings-option').forEach((option) => {
    option.addEventListener(
      'mouseenter',
      () => {
        applyOptionHover(option);
        onHoverChange();
      },
      { signal },
    );
    option.addEventListener(
      'mouseleave',
      () => {
        clearOptionHover(option);
        onHoverChange();
      },
      { signal },
    );
  });
}

/**
 * Clears all settings hover preview state.
 */
export function clearSettingsHover(): void {
  hoveredTheme = null;
  hoveredPlayer = null;
  hoveredBoardSize = null;
}

/**
 * Returns the theme currently shown in the footer preview.
 *
 * @param selectedTheme - The persisted theme selection.
 * @returns The hovered theme, or the selected theme if none is hovered.
 */
export function getPreviewTheme(selectedTheme: Theme | null): Theme | null {
  return hoveredTheme ?? selectedTheme;
}

/**
 * Returns the player label currently shown in the footer preview.
 *
 * @param selectedPlayer - The persisted player selection.
 * @returns The hovered player, or the selected player if none is hovered.
 */
export function getPreviewPlayer(selectedPlayer: Player | null): Player | null {
  return hoveredPlayer ?? selectedPlayer;
}

/**
 * Returns the board size currently shown in the footer preview.
 *
 * @param selectedBoardSize - The persisted board size selection.
 * @returns The hovered board size, or the selected size if none is hovered.
 */
export function getPreviewBoardSize(selectedBoardSize: BoardSize | null): BoardSize | null {
  return hoveredBoardSize ?? selectedBoardSize;
}

/**
 * Stores hover preview state from a settings option input.
 *
 * @param option - The hovered settings option label.
 */
function applyOptionHover(option: HTMLLabelElement): void {
  const input = option.querySelector<HTMLInputElement>('.settings-option__input');
  if (!input) {
    return;
  }
  setHoverValue(input.name, input.value);
}

/**
 * Clears hover preview state for a settings option input.
 *
 * @param option - The settings option label that is no longer hovered.
 */
function clearOptionHover(option: HTMLLabelElement): void {
  const input = option.querySelector<HTMLInputElement>('.settings-option__input');
  if (!input) {
    return;
  }
  clearHoverValue(input.name);
}

/**
 * Sets the hover preview value for a settings field.
 *
 * @param name - The settings input name.
 * @param value - The hovered option value.
 */
function setHoverValue(name: string, value: string): void {
  if (name === 'theme') {
    hoveredTheme = value as Theme;
  }
  if (name === 'player') {
    hoveredPlayer = value as Player;
  }
  if (name === 'board-size') {
    hoveredBoardSize = value as BoardSize;
  }
}

/**
 * Clears the hover preview value for a settings field.
 *
 * @param name - The settings input name.
 */
function clearHoverValue(name: string): void {
  if (name === 'theme') {
    hoveredTheme = null;
  }
  if (name === 'player') {
    hoveredPlayer = null;
  }
  if (name === 'board-size') {
    hoveredBoardSize = null;
  }
}
