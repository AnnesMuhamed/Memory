import type { BoardSize, Player, ResultsThemeAssets, Theme } from '../types/game';

export const assetBase = import.meta.env.BASE_URL;

export const themePreviewImages: Record<Theme, string> = {
    'code-vibes': `${assetBase}images/cards/code_vibes_theme.svg`,
    gaming: `${assetBase}images/cards/gaming_theme.svg`,
};

export const playerLabels: Record<Player, string> = {
    blue: 'Blue Player',
    orange: 'Orange Player',
};

export const boardLabels: Record<BoardSize, string> = {
    '16': '4×4',
    '24': '4×6',
    '36': '6×6',
};

export const slashDefault = `${assetBase}images/cards/slash.svg`;
export const slashSelected = `${assetBase}images/cards/slash2.svg`;

export const pawnImages: Record<Player, string> = {
    blue: `${assetBase}images/cards/chess_pawn_blue.svg`,
    orange: `${assetBase}images/cards/chess_pawn_orange.svg`,
};

export const playerLabelImages: Record<Player, string> = {
    blue: `${assetBase}images/cards/blue_label.svg`,
    orange: `${assetBase}images/cards/orange_label.svg`,
};

export const exitImages: Record<Theme, { default: string; hover: string }> = {
    'code-vibes': {
        default: `${assetBase}images/cards/turquoise/exitDefault.svg`,
        hover: `${assetBase}images/cards/turquoise/exithover.svg`,
    },
    gaming: {
        default: `${assetBase}images/cards/red/exit_red.svg`,
        hover: `${assetBase}images/cards/red/exit_red_hover.svg`,
    },
};

export const cardBackImages: Record<Theme, string> = {
    'code-vibes': `${assetBase}images/cards/turquoise/card_deck1.svg`,
    gaming: `${assetBase}images/cards/red/card_deck2.svg`,
};

export const boardColumns: Record<BoardSize, number> = {
    '16': 4,
    '24': 6,
    '36': 6,
};

export const gamingRootSymbols = new Set([
    'Property 1=Component 2.svg',
    'Property 1=Default.svg',
]);

export const codeVibesSymbols = [
    'angular',
    'bootstrap',
    'cloudeflareR2',
    'cmd',
    'css',
    'django',
    'firebase',
    'git',
    'github',
    'html',
    'javascript',
    'nodejs',
    'pyton',
    'react',
    'sass',
    'typescript',
    'vscode',
    'vue',
] as const;

export const gamingSymbols = [
    'Property 1=Component 2 (1).svg',
    'Property 1=Component 2 (2).svg',
    'Property 1=Component 2 (3).svg',
    'Property 1=Component 2 (4).svg',
    'Property 1=Component 2 (5).svg',
    'Property 1=Component 2 (6).svg',
    'Property 1=Component 2 (7).svg',
    'Property 1=Component 2 (8).svg',
    'Property 1=Component 2 (9).svg',
    'Property 1=Component 2 (10).svg',
    'Property 1=Component 2 (11).svg',
    'Property 1=Component 2 (12).svg',
    'Property 1=Component 2 (13).svg',
    'Property 1=Component 2 (14).svg',
    'Property 1=Component 2 (15).svg',
    'Property 1=Component 2 (16).svg',
    'Property 1=Component 2.svg',
    'Property 1=Default.svg',
] as const;

export const themeSymbols: Record<Theme, readonly string[]> = {
    'code-vibes': codeVibesSymbols,
    gaming: gamingSymbols,
};

const winnerNames: Record<Player, string> = {
    blue: 'BLUE PLAYER',
    orange: 'ORANGE PLAYER',
};

const gamingWinnerNames: Record<Player, string> = {
    blue: 'Blue Player',
    orange: 'Orange Player',
};

export const resultsThemeAssets: Record<Theme, ResultsThemeAssets> = {
    'code-vibes': {
        confetti: `${assetBase}images/Confetti.svg`,
        winnerPlayerImages: {
            blue: `${assetBase}images/blue_player.svg`,
            orange: `${assetBase}images/orange_player.svg`,
        },
        winnerLabels: winnerNames,
        drawImage: `${assetBase}images/draw_blue.svg`,
        scoreIcons: playerLabelImages,
    },
    gaming: {
        confetti: null,
        winnerPlayerImages: {
            blue: `${assetBase}images/pockal.svg`,
            orange: `${assetBase}images/pockal.svg`,
        },
        winnerLabels: gamingWinnerNames,
        drawImage: `${assetBase}images/draw_red.svg`,
        scoreIcons: pawnImages,
    },
};
