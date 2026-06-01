import type { BoardSize, MemoryCard, Player, Theme } from '../../types/game';
import {
    boardColumns,
    cardBackImages,
    exitImages,
    pawnImages,
    playerLabelImages,
    themeSymbols,
} from '../../constants/assets';
import { settings } from '../../state/settings';
import { gameState } from '../../state/game-state';
import { shuffleArray } from '../../utils/shuffle';
import { getSymbolSrc, applyCodeVibesGameScreen } from './code-vibes-theme/code-vibes-theme';
import { applyGamingGameScreen } from './gaming-theme/gaming-theme';
import { hideExitConfirm, showExitConfirm } from './exit-confirm/exit-confirm';
import { showResultsScreen } from '../results/results';
import './game.scss';
import './code-vibes-theme/code-vibes-theme.scss';
import './gaming-theme/gaming-theme.scss';

let activeExitTheme: Theme | null = null;
let boardAbortController: AbortController | null = null;
let memoryCards: MemoryCard[] = [];
let flippedCardIds: number[] = [];
let isBoardLocked = false;

/**
 * Initializes game screen event listeners for exit button and page restore.
 *
 * @param onExit - Reserved callback for exit flow (handled via exit confirm module).
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initGame(onExit: () => void, signal: AbortSignal): void {
    const exitButton = document.getElementById('game-exit');

    exitButton?.addEventListener(
        'click',
        () => {
            showExitConfirm();
        },
        { signal },
    );

    exitButton?.addEventListener('mouseenter', showExitHover, { signal });
    exitButton?.addEventListener('mouseleave', showExitDefault, { signal });

    window.addEventListener(
        'pageshow',
        (event) => {
            if (event.persisted) {
                resetExitButton();
            }
        },
        { signal },
    );
}

/**
 * Starts a new game with the current settings and renders the memory board.
 */
export function startGame(): void {
    const settingsScreen = document.getElementById('settings-screen');
    const gameScreen = document.getElementById('game-screen');

    if (!settingsScreen || !gameScreen || !settings.theme || !settings.player || !settings.boardSize) {
        return;
    }

    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');

    if (settings.theme === 'code-vibes') {
        applyCodeVibesGameScreen(gameScreen);
    }

    if (settings.theme === 'gaming') {
        applyGamingGameScreen(gameScreen);
    }

    gameState.blueScore = 0;
    gameState.orangeScore = 0;
    gameState.currentPlayer = settings.player;

    applyGameHeader();
    renderGameBoard();
    hideExitConfirm();

    settingsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

/**
 * Leaves the game screen and returns to settings without resetting selections.
 */
export function exitGame(): void {
    const settingsScreen = document.getElementById('settings-screen');
    const gameScreen = document.getElementById('game-screen');

    if (!settingsScreen || !gameScreen) {
        return;
    }

    hideExitConfirm();
    resetExitButton();
    clearGameBoard();

    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');
    gameScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

/**
 * Removes all cards from the board and resets in-memory game state.
 */
export function clearGameBoard(): void {
    boardAbortController?.abort();
    boardAbortController = null;
    memoryCards = [];
    flippedCardIds = [];
    isBoardLocked = false;

    const board = document.getElementById('game-board');

    if (!board) {
        return;
    }

    board.innerHTML = '';
    board.className = 'game-board';
    board.style.removeProperty('--board-columns');
}

/**
 * Resets the exit button to its default hidden and unstyled state.
 */
export function resetExitButton(): void {
    const exitButton = document.getElementById('game-exit');
    const exitImage = document.getElementById('game-exit-img') as HTMLImageElement | null;
    const gamingDefault = document.getElementById('game-exit-gaming-default');

    activeExitTheme = null;

    exitButton?.classList.remove('game-exit--code-vibes', 'game-exit--gaming', 'game-exit--hover');

    if (exitImage) {
        exitImage.hidden = true;
        exitImage.removeAttribute('src');
    }

    if (gamingDefault) {
        gamingDefault.hidden = true;
    }
}

/**
 * Updates score display, player icon, and exit button in the game header.
 */
function applyGameHeader(): void {
    const blueScore = document.getElementById('blue-score');
    const orangeScore = document.getElementById('orange-score');
    const playerIcon = document.getElementById('current-player-icon');
    const playerIconImage = document.getElementById('current-player-icon-image') as HTMLImageElement | null;

    if (blueScore) {
        blueScore.textContent = String(gameState.blueScore);
    }

    if (orangeScore) {
        orangeScore.textContent = String(gameState.orangeScore);
    }

    applyScoreIcons();

    if (playerIcon && playerIconImage && gameState.currentPlayer) {
        playerIcon.classList.remove('game-header__player-icon--blue', 'game-header__player-icon--orange');
        playerIcon.classList.add(`game-header__player-icon--${gameState.currentPlayer}`);

        if (settings.theme === 'code-vibes') {
            playerIconImage.src = playerLabelImages[gameState.currentPlayer];
        } else {
            playerIconImage.src = pawnImages[gameState.currentPlayer];
        }
    }

    applyExitButton();
}

/**
 * Builds and renders the memory card grid based on current settings.
 */
function renderGameBoard(): void {
    const board = document.getElementById('game-board');

    if (!board || !settings.boardSize || !settings.theme) {
        return;
    }

    clearGameBoard();

    const columns = boardColumns[settings.boardSize];

    board.classList.add(`game-board--${settings.theme}`);
    board.style.setProperty('--board-columns', String(columns));

    renderMemoryBoard(board, settings.theme, settings.boardSize);
}

/**
 * Creates card elements and attaches click handling to the board.
 *
 * @param board - The game board container element.
 * @param theme - The active game theme.
 * @param boardSize - The selected board size (total card count).
 */
function renderMemoryBoard(board: HTMLElement, theme: Theme, boardSize: BoardSize): void {
    memoryCards = createMemoryDeck(theme, boardSize);
    flippedCardIds = [];
    isBoardLocked = false;

    memoryCards.forEach((cardData) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `game-card game-card--${theme}`;
        card.dataset.cardId = String(cardData.id);
        card.setAttribute('aria-label', 'Hidden card');

        const inner = document.createElement('div');
        inner.className = 'game-card__inner';

        const front = document.createElement('div');
        front.className = 'game-card__face game-card__face--front';

        const frontImage = document.createElement('img');
        frontImage.src = cardData.symbolSrc;
        frontImage.alt = '';
        frontImage.setAttribute('aria-hidden', 'true');
        front.appendChild(frontImage);

        const back = document.createElement('div');
        back.className = 'game-card__face game-card__face--back';

        const backImage = document.createElement('img');
        backImage.src = cardBackImages[theme];
        backImage.alt = '';
        backImage.setAttribute('aria-hidden', 'true');
        back.appendChild(backImage);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
        board.appendChild(card);
    });

    boardAbortController = new AbortController();
    board.addEventListener('click', handleMemoryCardClick, { signal: boardAbortController.signal });
}

/**
 * Creates a shuffled deck of paired memory cards for the given theme and size.
 *
 * @param theme - The active game theme.
 * @param boardSize - The selected board size (total card count).
 * @returns An array of memory card data with unique IDs.
 */
function createMemoryDeck(theme: Theme, boardSize: BoardSize): MemoryCard[] {
    const totalCards = Number(boardSize);
    const pairCount = totalCards / 2;
    const selectedSymbols = shuffleArray([...themeSymbols[theme]]).slice(0, pairCount);

    const deck = selectedSymbols.flatMap((symbolId) => {
        const symbolSrc = getSymbolSrc(theme, symbolId);

        return [
            { symbolId, symbolSrc, isFlipped: false, isMatched: false },
            { symbolId, symbolSrc, isFlipped: false, isMatched: false },
        ];
    });

    return shuffleArray(deck).map((card, index) => ({
        ...card,
        id: index,
    }));
}

/**
 * Handles a click on a memory card and processes flip, match, or mismatch logic.
 *
 * @param event - The click event from the game board.
 */
function handleMemoryCardClick(event: Event): void {
    if (isBoardLocked) {
        return;
    }

    const cardButton = (event.target as HTMLElement).closest('.game-card') as HTMLButtonElement | null;

    if (!cardButton || cardButton.disabled) {
        return;
    }

    const cardId = Number(cardButton.dataset.cardId);
    const card = memoryCards[cardId];

    if (!card || card.isMatched || card.isFlipped) {
        return;
    }

    flipMemoryCard(cardId, true);
    flippedCardIds.push(cardId);

    if (flippedCardIds.length < 2) {
        return;
    }

    isBoardLocked = true;

    const [firstId, secondId] = flippedCardIds;
    const firstCard = memoryCards[firstId];
    const secondCard = memoryCards[secondId];

    if (firstCard.symbolId === secondCard.symbolId) {
        window.setTimeout(() => {
            resolveMatchedPair(firstId, secondId);
            flippedCardIds = [];
            isBoardLocked = false;
        }, 400);

        return;
    }

    window.setTimeout(() => {
        flipMemoryCard(firstId, false);
        flipMemoryCard(secondId, false);
        switchCurrentPlayer();
        flippedCardIds = [];
        isBoardLocked = false;
    }, 800);
}

/**
 * Updates the flip state and DOM classes for a single card.
 *
 * @param cardId - The ID of the card to flip.
 * @param flipped - Whether the card should be shown face-up.
 */
function flipMemoryCard(cardId: number, flipped: boolean): void {
    const card = memoryCards[cardId];

    if (!card) {
        return;
    }

    card.isFlipped = flipped;

    const cardButton = document.querySelector<HTMLButtonElement>(`[data-card-id="${cardId}"]`);

    if (!cardButton) {
        return;
    }

    cardButton.classList.toggle('game-card--flipped', flipped);
    cardButton.setAttribute('aria-label', flipped ? `Revealed ${card.symbolId} card` : 'Hidden card');
}

/**
 * Marks a matched pair as resolved, awards a point, and checks for game completion.
 *
 * @param firstId - The ID of the first matched card.
 * @param secondId - The ID of the second matched card.
 */
function resolveMatchedPair(firstId: number, secondId: number): void {
    [firstId, secondId].forEach((cardId) => {
        const card = memoryCards[cardId];

        if (!card) {
            return;
        }

        card.isMatched = true;
        card.isFlipped = true;

        const cardButton = document.querySelector<HTMLButtonElement>(`[data-card-id="${cardId}"]`);

        if (!cardButton) {
            return;
        }

        cardButton.classList.add('game-card--flipped', 'game-card--matched');
        cardButton.disabled = true;
        cardButton.setAttribute('aria-label', 'Empty slot');
        cardButton.setAttribute('aria-hidden', 'true');
    });

    incrementCurrentPlayerScore();

    if (isGameComplete()) {
        window.setTimeout(() => {
            showResultsScreen();
        }, 500);
    }
}

/**
 * Increments the score of the current player and refreshes the header.
 */
function incrementCurrentPlayerScore(): void {
    if (gameState.currentPlayer === 'blue') {
        gameState.blueScore += 1;
    }

    if (gameState.currentPlayer === 'orange') {
        gameState.orangeScore += 1;
    }

    applyGameHeader();
}

/**
 * Switches the active player after a failed match attempt.
 */
function switchCurrentPlayer(): void {
    if (!gameState.currentPlayer) {
        return;
    }

    gameState.currentPlayer = gameState.currentPlayer === 'blue' ? 'orange' : 'blue';
    applyGameHeader();
}

/**
 * Checks whether every card on the board has been matched.
 *
 * @returns True when all cards are matched.
 */
function isGameComplete(): boolean {
    return memoryCards.length > 0 && memoryCards.every((card) => card.isMatched);
}

/**
 * Sets the score icon images in the header based on the active theme.
 */
function applyScoreIcons(): void {
    const blueIcon = document.getElementById('blue-score-icon') as HTMLImageElement | null;
    const orangeIcon = document.getElementById('orange-score-icon') as HTMLImageElement | null;

    if (!blueIcon || !orangeIcon || !settings.theme) {
        return;
    }

    if (settings.theme === 'code-vibes') {
        blueIcon.src = playerLabelImages.blue;
        orangeIcon.src = playerLabelImages.orange;
        return;
    }

    blueIcon.src = pawnImages.blue;
    orangeIcon.src = pawnImages.orange;
}

/**
 * Configures the exit button appearance for the active theme.
 */
function applyExitButton(): void {
    const exitButton = document.getElementById('game-exit');

    if (!exitButton || !settings.theme) {
        return;
    }

    activeExitTheme = settings.theme;

    exitButton.classList.remove('game-exit--code-vibes', 'game-exit--gaming');
    exitButton.classList.add(`game-exit--${settings.theme}`);

    showExitDefault();
}

/**
 * Shows the default exit button image for the active theme.
 */
function showExitDefault(): void {
    const exitButton = document.getElementById('game-exit');
    const exitImage = document.getElementById('game-exit-img') as HTMLImageElement | null;
    const gamingDefault = document.getElementById('game-exit-gaming-default');

    if (!activeExitTheme || !exitImage) {
        return;
    }

    exitButton?.classList.remove('game-exit--hover');
    gamingDefault?.setAttribute('hidden', '');

    const images = exitImages[activeExitTheme];
    exitImage.hidden = false;
    exitImage.src = images.default;
}

/**
 * Shows the hover exit button image for the active theme.
 */
function showExitHover(): void {
    const exitButton = document.getElementById('game-exit');
    const exitImage = document.getElementById('game-exit-img') as HTMLImageElement | null;
    const gamingDefault = document.getElementById('game-exit-gaming-default');

    if (!activeExitTheme || !exitImage) {
        return;
    }

    exitButton?.classList.add('game-exit--hover');
    gamingDefault?.setAttribute('hidden', '');

    const images = exitImages[activeExitTheme];
    exitImage.hidden = false;
    exitImage.src = images.hover;
}
