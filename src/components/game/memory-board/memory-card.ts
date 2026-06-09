import type { MemoryCard, Theme } from '../../../types/game';

import { CARD_BACK_IMAGES } from '../../../constants/assets';

import { getCardButton } from './memory-board-state';

/**
 * Builds a memory card button element for the board.
 *
 * @param cardData - The card data to render.
 * @param theme - The active game theme.
 * @returns The card button element.
 */
export function createCardElement(cardData: MemoryCard, theme: Theme): HTMLButtonElement {
  const card = document.createElement('button');
  card.type = 'button';
  card.id = `game-card-${cardData.id}`;
  card.className = `game-card game-card--${theme}`;
  card.setAttribute('aria-label', 'Hidden card');
  card.appendChild(buildCardInner(cardData, theme));
  return card;
}

/**
 * Builds the inner flip container for a memory card.
 *
 * @param cardData - The card data to render.
 * @param theme - The active game theme.
 * @returns The inner card container element.
 */
function buildCardInner(cardData: MemoryCard, theme: Theme): HTMLDivElement {
  const perspective = document.createElement('div');
  perspective.className = 'game-card__perspective';
  const inner = document.createElement('div');
  inner.className = 'game-card__inner';
  inner.appendChild(buildCardFace('front', cardData.symbolSrc));
  inner.appendChild(buildCardFace('back', CARD_BACK_IMAGES[theme]));
  perspective.appendChild(inner);
  return perspective;
}

/**
 * Builds one face of a memory card.
 *
 * @param side - Whether this is the front or back face.
 * @param imageSrc - The image URL for the face.
 * @returns The card face element.
 */
function buildCardFace(side: 'front' | 'back', imageSrc: string): HTMLDivElement {
  const face = document.createElement('div');
  face.className = `game-card__face game-card__face--${side}`;
  const image = document.createElement('img');
  image.src = imageSrc;
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  image.draggable = false;
  face.appendChild(image);
  return face;
}

/**
 * Updates the flip state and DOM classes for a single card.
 *
 * @param cardId - The ID of the card to flip.
 * @param flipped - Whether the card should be shown face-up.
 * @param symbolId - The symbol ID used for the aria label.
 */
export function updateCardFlipState(cardId: number, flipped: boolean, symbolId: string): void {
  const cardButton = getCardButton(cardId);
  if (!cardButton) {
    return;
  }
  cardButton.classList.toggle('game-card--flipped', flipped);
  const label = flipped ? `Revealed ${symbolId} card` : 'Hidden card';
  cardButton.setAttribute('aria-label', label);
}

/**
 * Marks a matched card as disabled while keeping it face-up on the board.
 *
 * @param cardId - The ID of the matched card.
 * @param symbolId - The symbol ID used for the aria label.
 */
export function markCardAsMatchedSlot(cardId: number, symbolId: string): void {
  const cardButton = getCardButton(cardId);
  if (!cardButton) {
    return;
  }
  cardButton.classList.add('game-card--flipped', 'game-card--matched');
  cardButton.disabled = true;
  cardButton.setAttribute('aria-label', `Matched ${symbolId} card`);
}
