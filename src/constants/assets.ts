import type { BoardSize, Player, ResultsThemeAssets, Theme } from '../types/game';

export const ASSET_BASE = import.meta.env.BASE_URL;

export const THEME_PREVIEW_IMAGES: Record<Theme, string> = {
  'code-vibes': `${ASSET_BASE}images/cards/code_vibes_theme.svg`,
  gaming: `${ASSET_BASE}images/cards/gaming_theme.svg`,
};

export const PLAYER_LABELS: Record<Player, string> = {
  blue: 'Blue Player',
  orange: 'Orange Player',
};

export const BOARD_LABELS: Record<BoardSize, string> = {
  '16': '4×4',
  '24': '4×6',
  '36': '6×6',
};

export const SLASH_DEFAULT = `${ASSET_BASE}images/cards/slash.svg`;
export const SLASH_SELECTED = `${ASSET_BASE}images/cards/slash2.svg`;

export const PAWN_IMAGES: Record<Player, string> = {
  blue: `${ASSET_BASE}images/cards/chess_pawn_blue.svg`,
  orange: `${ASSET_BASE}images/cards/chess_pawn_orange.svg`,
};

export const PLAYER_LABEL_IMAGES: Record<Player, string> = {
  blue: `${ASSET_BASE}images/cards/blue_label.svg`,
  orange: `${ASSET_BASE}images/cards/orange_label.svg`,
};

export const EXIT_IMAGES: Record<Theme, { default: string; hover: string }> = {
  'code-vibes': {
    default: `${ASSET_BASE}images/cards/turquoise/exitDefault.svg`,
    hover: `${ASSET_BASE}images/cards/turquoise/exithover.svg`,
  },
  gaming: {
    default: `${ASSET_BASE}images/cards/red/exit_red.svg`,
    hover: `${ASSET_BASE}images/cards/red/exit_red_hover.svg`,
  },
};

export const CARD_BACK_IMAGES: Record<Theme, string> = {
  'code-vibes': `${ASSET_BASE}images/cards/turquoise/card_deck1.svg`,
  gaming: `${ASSET_BASE}images/cards/red/card_deck2.svg`,
};

export const BOARD_COLUMNS: Record<BoardSize, number> = {
  '16': 4,
  '24': 6,
  '36': 6,
};

export const GAMING_ROOT_SYMBOLS = new Set([
  'Property 1=Component 2.svg',
  'Property 1=Default.svg',
]);

export const CODE_VIBES_SYMBOLS = [
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

export const GAMING_SYMBOLS = [
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

export const THEME_SYMBOLS: Record<Theme, readonly string[]> = {
  'code-vibes': CODE_VIBES_SYMBOLS,
  gaming: GAMING_SYMBOLS,
};

const WINNER_NAMES: Record<Player, string> = {
  blue: 'BLUE PLAYER',
  orange: 'ORANGE PLAYER',
};

const GAMING_WINNER_NAMES: Record<Player, string> = {
  blue: 'Blue Player',
  orange: 'Orange Player',
};

export const RESULTS_THEME_ASSETS: Record<Theme, ResultsThemeAssets> = {
  'code-vibes': {
    confetti: `${ASSET_BASE}images/Confetti.svg`,
    winnerPlayerImages: {
      blue: `${ASSET_BASE}images/blue_player.svg`,
      orange: `${ASSET_BASE}images/orange_player.svg`,
    },
    winnerLabels: WINNER_NAMES,
    drawImage: `${ASSET_BASE}images/draw_blue.svg`,
    scoreIcons: PLAYER_LABEL_IMAGES,
  },
  gaming: {
    confetti: null,
    winnerPlayerImages: {
      blue: `${ASSET_BASE}images/pockal.svg`,
      orange: `${ASSET_BASE}images/pockal.svg`,
    },
    winnerLabels: GAMING_WINNER_NAMES,
    drawImage: `${ASSET_BASE}images/draw_red.svg`,
    scoreIcons: PAWN_IMAGES,
  },
};
