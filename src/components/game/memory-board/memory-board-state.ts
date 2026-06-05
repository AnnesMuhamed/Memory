import type { MemoryCard } from '../../../types/game';

let memoryCards: MemoryCard[] = [];
let flippedCardIds: number[] = [];

/**
 * Blocks card clicks while two cards are flipped and the match result is processed.
 */
let boardIsLocked: boolean = false;

let boardAbortController: AbortController | null = null;

/**
 * Returns the current memory cards on the board.
 *
 * @returns The list of memory card data.
 */
export function getMemoryCards(): MemoryCard[] {
    return memoryCards;
}

/**
 * Stores the memory cards for the active board.
 *
 * @param cards - The card data to store.
 */
export function setMemoryCards(cards: MemoryCard[]): void {
    memoryCards = cards;
}

/**
 * Returns the IDs of cards currently flipped face-up.
 *
 * @returns The flipped card IDs.
 */
export function getFlippedCardIds(): number[] {
    return flippedCardIds;
}

/**
 * Stores the IDs of cards currently flipped face-up.
 *
 * @param ids - The flipped card IDs to store.
 */
export function setFlippedCardIds(ids: number[]): void {
    flippedCardIds = ids;
}

/**
 * Returns whether the board currently blocks card clicks.
 *
 * @returns True when clicks are blocked.
 */
export function getBoardIsLocked(): boolean {
    return boardIsLocked;
}

/**
 * Sets whether the board blocks card clicks.
 *
 * @param locked - True to block clicks, false to allow them.
 */
export function setBoardIsLocked(locked: boolean): void {
    boardIsLocked = locked;
}

/**
 * Returns the abort controller for the board click listener.
 *
 * @returns The active controller, or null if none exists.
 */
export function getBoardAbortController(): AbortController | null {
    return boardAbortController;
}

/**
 * Stores the abort controller for the board click listener.
 *
 * @param controller - The controller to store, or null to clear it.
 */
export function setBoardAbortController(controller: AbortController | null): void {
    boardAbortController = controller;
}

/**
 * Clears all memory board state and aborts active listeners.
 */
export function resetMemoryBoardState(): void {
    boardAbortController?.abort();
    boardAbortController = null;
    memoryCards = [];
    flippedCardIds = [];
    boardIsLocked = false;
}

/**
 * Clears flipped cards and unlocks the board.
 */
export function resetFlippedCards(): void {
    flippedCardIds = [];
    boardIsLocked = false;
}

/**
 * Finds a memory card by its ID.
 *
 * @param cardId - The card ID to look up.
 * @returns The matching card, or undefined if not found.
 */
export function getCardById(cardId: number): MemoryCard | undefined {
    return memoryCards[cardId];
}

/**
 * Returns the button element for a memory card.
 *
 * @param cardId - The card ID to look up.
 * @returns The card button element, or null if not found.
 */
export function getCardButton(cardId: number): HTMLButtonElement | null {
    return document.getElementById(`game-card-${cardId}`) as HTMLButtonElement | null;
}
