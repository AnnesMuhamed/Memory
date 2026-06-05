import {
    getBoardIsLocked,
    getCardById,
    getFlippedCardIds,
    getMemoryCards,
    setBoardIsLocked,
    setFlippedCardIds,
} from './memory-board-state';
import { markCardAsMatchedSlot, updateCardFlipState } from './memory-card';
import { incrementCurrentPlayerScore, switchCurrentPlayer } from '../game-header';
import { showResultsScreen } from '../../results/results';

const matchDelayMs = 400;
const mismatchDelayMs = 800;
const resultsDelayMs = 500;

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
 * Reads the card ID from a click event target.
 *
 * @param event - The click event from the game board.
 * @returns The card ID, or null when no valid card was clicked.
 */
function getClickedCardId(event: Event): number | null {
    const target = event.target as HTMLElement;
    const cardButton = target.closest('.game-card') as HTMLButtonElement | null;
    if (!cardButton || cardButton.disabled) {
        return null;
    }
    return Number(cardButton.id.replace('game-card-', ''));
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
    }, matchDelayMs);
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
    }, mismatchDelayMs);
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
        window.setTimeout(showResultsScreen, resultsDelayMs);
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
