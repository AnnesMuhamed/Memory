import type { BoardSize, Theme } from '../../../types/game';

import { BOARD_COLUMNS } from '../../../constants/assets';
import { settings } from '../../../state/settings';

import { handleMemoryCardClick } from './memory-board-click';
import { createCardElement } from './memory-card';
import {
  getBoardAbortController,
  resetMemoryBoardState,
  setBoardAbortController,
  setMemoryCards,
  resetFlippedCards,
} from './memory-board-state';
import { createMemoryDeck } from './memory-deck';

/**
 * Builds and renders the memory card grid based on current settings.
 */
export function renderGameBoard(): void {
  const board = document.getElementById('game-board');
  if (!board || !settings.boardSize || !settings.theme) {
    return;
  }
  clearBoardElement(board);
  applyBoardLayout(board, settings.theme, settings.boardSize);
  fillBoardWithCards(board, settings.theme, settings.boardSize);
  attachBoardClickListener(board);
}

/**
 * Removes all cards from the board and resets in-memory game state.
 */
export function clearGameBoard(): void {
  resetMemoryBoardState();
  const board = document.getElementById('game-board');
  if (!board) {
    return;
  }
  clearBoardElement(board);
}

/**
 * Removes all card elements and layout classes from the board.
 *
 * @param board - The game board container element.
 */
function clearBoardElement(board: HTMLElement): void {
  board.innerHTML = '';
  board.className = 'game-board';
  board.style.removeProperty('--board-columns');
}

/**
 * Applies theme and column layout to the board element.
 *
 * @param board - The game board container element.
 * @param theme - The active game theme.
 * @param boardSize - The selected board size.
 */
function applyBoardLayout(board: HTMLElement, theme: Theme, boardSize: BoardSize): void {
  board.classList.add(`game-board--${theme}`);
  board.style.setProperty('--board-columns', String(BOARD_COLUMNS[boardSize]));
}

/**
 * Creates and appends all memory cards to the board.
 *
 * @param board - The game board container element.
 * @param theme - The active game theme.
 * @param boardSize - The selected board size.
 */
function fillBoardWithCards(board: HTMLElement, theme: Theme, boardSize: BoardSize): void {
  const cards = createMemoryDeck(theme, boardSize);
  setMemoryCards(cards);
  resetFlippedCards();
  cards.forEach((cardData) => {
    board.appendChild(createCardElement(cardData, theme));
  });
}

/**
 * Attaches the memory card click listener to the board.
 *
 * @param board - The game board container element.
 */
function attachBoardClickListener(board: HTMLElement): void {
  getBoardAbortController()?.abort();
  const controller = new AbortController();
  setBoardAbortController(controller);
  board.addEventListener('click', handleMemoryCardClick, { signal: controller.signal });
}
