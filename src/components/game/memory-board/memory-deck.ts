import type { BoardSize, MemoryCard, Theme } from '../../../types/game';
import { themeSymbols } from '../../../constants/assets';
import { shuffleArray } from '../../../utils/shuffle';
import { getSymbolSrc } from '../code-vibes-theme/code-vibes-theme';

/**
 * Creates a shuffled deck of paired memory cards for the given theme and size.
 *
 * @param theme - The active game theme.
 * @param boardSize - The selected board size (total card count).
 * @returns An array of memory card data with unique IDs.
 */
export function createMemoryDeck(theme: Theme, boardSize: BoardSize): MemoryCard[] {
    const pairCount = Number(boardSize) / 2;
    const symbols = shuffleArray([...themeSymbols[theme]]).slice(0, pairCount);
    const pairs = buildPairs(theme, symbols);
    return shuffleArray(pairs).map((card, index) => ({ ...card, id: index }));
}

/**
 * Builds unshuffled card pairs from the selected symbols.
 *
 * @param theme - The active game theme.
 * @param symbols - The symbol IDs selected for this board.
 * @returns Card data without IDs, two entries per symbol.
 */
function buildPairs(theme: Theme, symbols: string[]): Omit<MemoryCard, 'id'>[] {
    return symbols.flatMap((symbolId) => {
        const symbolSrc = getSymbolSrc(theme, symbolId);
        const pair = { symbolId, symbolSrc, isFlipped: false, isMatched: false };
        return [pair, { ...pair }];
    });
}
