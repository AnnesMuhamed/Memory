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
  });

  document.querySelectorAll<HTMLElement>('.settings-group__options').forEach((group) => {
    group.addEventListener(
      'mouseleave',
      () => {
        clearGroupHover(group);
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
  document.querySelectorAll<HTMLElement>('.settings-group__options').forEach((group) => {
    clearGroupHover(group);
  });
}

/**
 * Clears hover preview styling for the group that contains an input.
 *
 * @param input - The settings radio input that was selected.
 */
export function clearGroupHoverForInput(input: HTMLInputElement): void {
  const group = input.closest('.settings-group__options');
  if (group instanceof HTMLElement) {
    clearGroupHover(group);
  }
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
  const group = option.closest('.settings-group__options');
  if (!input || !group) {
    return;
  }
  setHoverValue(input.name, input.value);
  group.classList.add('settings-group__options--is-hovering');
  group.querySelectorAll<HTMLElement>('.settings-option').forEach((item) => {
    item.classList.toggle('settings-option--preview', item === option);
  });
}

/**
 * Clears hover preview styling for a settings option group.
 *
 * @param group - The settings option group container.
 */
function clearGroupHover(group: HTMLElement): void {
  const fieldInput = group.querySelector<HTMLInputElement>('.settings-option__input');
  if (fieldInput) {
    clearHoverValue(fieldInput.name);
  }
  group.classList.remove('settings-group__options--is-hovering');
  group.querySelectorAll('.settings-option--preview').forEach((item) => {
    item.classList.remove('settings-option--preview');
  });
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
