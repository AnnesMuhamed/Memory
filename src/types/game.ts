export type Theme = 'code-vibes' | 'gaming';
export type Player = 'blue' | 'orange';
export type BoardSize = '16' | '24' | '36';
export type GameOutcome = 'win' | 'lose' | 'draw';

export interface GameSettings {
    theme: Theme | null;
    player: Player | null;
    boardSize: BoardSize | null;
}

export interface GameState {
    blueScore: number;
    orangeScore: number;
    currentPlayer: Player | null;
}

export interface MemoryCard {
    id: number;
    symbolId: string;
    symbolSrc: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface ResultsThemeAssets {
    confetti: string | null;
    winnerPlayerImages: Record<Player, string>;
    winnerLabels: Record<Player, string>;
    drawImage: string;
    scoreIcons: Record<Player, string>;
}
