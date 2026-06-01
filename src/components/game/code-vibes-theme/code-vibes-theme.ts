import { assetBase, gamingRootSymbols } from '../../../constants/assets';
import type { Theme } from '../../../types/game';

/**
 * Builds the asset URL for a Code Vibes card symbol.
 *
 * @param symbolId - The symbol identifier without file extension.
 * @returns The full URL to the symbol SVG.
 */
export function getCodeVibesSymbolSrc(symbolId: string): string {
    return `${assetBase}images/cards/turquoise/card-symbol/${symbolId}.svg`;
}

/**
 * Builds the asset URL for a Gaming theme card symbol.
 *
 * @param symbolId - The symbol filename including extension.
 * @returns The full URL to the symbol SVG.
 */
export function getGamingSymbolSrc(symbolId: string): string {
    if (gamingRootSymbols.has(symbolId)) {
        return `${assetBase}images/cards/red/${symbolId}`;
    }

    return `${assetBase}images/cards/red/card-symbol/${symbolId}`;
}

/**
 * Resolves the card symbol URL for the active theme.
 *
 * @param theme - The selected game theme.
 * @param symbolId - The symbol identifier for the card.
 * @returns The full URL to the symbol asset.
 */
export function getSymbolSrc(theme: Theme, symbolId: string): string {
    if (theme === 'gaming') {
        return getGamingSymbolSrc(symbolId);
    }

    return getCodeVibesSymbolSrc(symbolId);
}

/**
 * Applies Code Vibes theme classes to the game screen container.
 *
 * @param gameScreen - The game screen root element.
 */
export function applyCodeVibesGameScreen(gameScreen: HTMLElement): void {
    gameScreen.classList.remove('game-screen--gaming');
    gameScreen.classList.add('game-screen--code-vibes');
}
