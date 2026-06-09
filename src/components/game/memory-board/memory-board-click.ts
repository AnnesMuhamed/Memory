import { MATCH_DELAY_MS, MISMATCH_DELAY_MS, RESULTS_DELAY_MS } from '../../../constants/timing';

import { incrementCurrentPlayerScore, switchCurrentPlayer } from '../game-header';
import { showResultsScreen } from '../../results/results';

import {
  getBoardIsLocked,
  getCardById,
  getFlippedCardIds,
  getMemoryCards,
  setBoardIsLocked,
  setFlippedCardIds,
} from './memory-board-state';
import { markCardAsMatchedSlot, updateCardFlipState } from './memory-card';

/**
 * Handles a click on a memory card and processes flip, match, or mismatch logic.
 *
 * @param event - The click event from the game board.
 */
export function handleMemoryCardClick(event: Event): void {
  if (getBoardIsLocked()) {
    return;
  }
  const cardId = getClickedCardId(event);
  if (cardId === null || !canFlipCard(cardId)) {
    return;
  }
  flipCard(cardId);
  if (getFlippedCardIds().length < 2) {
    return;
  }
  processFlippedPair();
}

/**
 * Flips a card when Enter or Space is pressed on a focused card button.
 *
 * @param event - The keyboard event from the game board.
 */
export function handleMemoryCardKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }
  const target = event.target;
  if (!(target instanceof Element) || !target.classList.contains('game-card')) {
    return;
  }
  event.preventDefault();
  handleMemoryCardClick(event);
}

/**
 * Reads the card ID from a click event target.
 *
 * @param event - The click event from the game board.
 * @returns The card ID, or null when no valid card was clicked.
 */
function getClickedCardId(event: Event): number | null {
  const target = event.target;
  if (!(target instanceof Element)) {
    return null;
  }
  const cardButton = target.closest('.game-card') as HTMLButtonElement | null;
  if (!cardButton || cardButton.disabled) {
    return null;
  }
  const cardId = Number(cardButton.id.replace('game-card-', ''));
  if (Number.isNaN(cardId)) {
    return null;
  }
  return cardId;
}

/**
 * Checks whether a card can be flipped.
 *
 * @param cardId - The card ID to check.
 * @returns True when the card exists and is not matched or already flipped.
 */
function canFlipCard(cardId: number): boolean {
  const card = getCardById(cardId);
  return Boolean(card && !card.isMatched && !card.isFlipped);
}

/**
 * Flips a card face-up and stores its ID.
 *
 * @param cardId - The card ID to flip.
 */
function flipCard(cardId: number): void {
  const card = getCardById(cardId);
  if (!card) {
    return;
  }
  card.isFlipped = true;
  updateCardFlipState(cardId, true, card.symbolId);
  setFlippedCardIds([...getFlippedCardIds(), cardId]);
}

/**
 * Compares two flipped cards and schedules the match result.
 */
function processFlippedPair(): void {
  setBoardIsLocked(true);
  const [firstId, secondId] = getFlippedCardIds();
  const firstCard = getCardById(firstId);
  const secondCard = getCardById(secondId);
  if (!firstCard || !secondCard) {
    return;
  }
  if (firstCard.symbolId === secondCard.symbolId) {
    scheduleMatch(firstId, secondId);
    return;
  }
  scheduleMismatch(firstId, secondId);
}

/**
 * Schedules resolution for a matching pair.
 *
 * @param firstId - The ID of the first matched card.
 * @param secondId - The ID of the second matched card.
 */
function scheduleMatch(firstId: number, secondId: number): void {
  window.setTimeout(() => {
    resolveMatchedPair(firstId, secondId);
    setFlippedCardIds([]);
    setBoardIsLocked(false);
  }, MATCH_DELAY_MS);
}

/**
 * Schedules resolution for a non-matching pair.
 *
 * @param firstId - The ID of the first flipped card.
 * @param secondId - The ID of the second flipped card.
 */
function scheduleMismatch(firstId: number, secondId: number): void {
  window.setTimeout(() => {
    unflipCard(firstId);
    unflipCard(secondId);
    switchCurrentPlayer();
    setFlippedCardIds([]);
    setBoardIsLocked(false);
  }, MISMATCH_DELAY_MS);
}

/**
 * Flips a card face-down again.
 *
 * @param cardId - The card ID to unflip.
 */
function unflipCard(cardId: number): void {
  const card = getCardById(cardId);
  if (!card) {
    return;
  }
  card.isFlipped = false;
  updateCardFlipState(cardId, false, card.symbolId);
}

/**
 * Resolves a matching pair and awards a point.
 *
 * @param firstId - The ID of the first matched card.
 * @param secondId - The ID of the second matched card.
 */
function resolveMatchedPair(firstId: number, secondId: number): void {
  markPairAsMatched(firstId);
  markPairAsMatched(secondId);
  incrementCurrentPlayerScore();
  if (isGameComplete()) {
    window.setTimeout(showResultsScreen, RESULTS_DELAY_MS);
  }
}

/**
 * Marks one card in a matched pair as resolved.
 *
 * @param cardId - The card ID to mark as matched.
 */
function markPairAsMatched(cardId: number): void {
  const card = getCardById(cardId);
  if (!card) {
    return;
  }
  card.isMatched = true;
  card.isFlipped = true;
  markCardAsMatchedSlot(cardId);
}

/**
 * Checks whether every card on the board has been matched.
 *
 * @returns True when all cards are matched.
 */
function isGameComplete(): boolean {
  const cards = getMemoryCards();
  return cards.length > 0 && cards.every((card) => card.isMatched);
}
