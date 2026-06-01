import './styles/style.scss';

type Theme = 'code-vibes' | 'gaming';
type Player = 'blue' | 'orange';
type BoardSize = '16' | '24' | '36';

interface GameSettings {
    theme: Theme | null;
    player: Player | null;
    boardSize: BoardSize | null;
}

interface GameState {
    blueScore: number;
    orangeScore: number;
    currentPlayer: Player | null;
}

const assetBase = import.meta.env.BASE_URL;

const themePreviewImages: Record<Theme, string> = {
    'code-vibes': `${assetBase}images/cards/code_vibes_theme.svg`,
    gaming: `${assetBase}images/cards/gaming_theme.svg`,
};

const playerLabels: Record<Player, string> = {
    blue: 'Blue Player',
    orange: 'Orange Player',
};

const boardLabels: Record<BoardSize, string> = {
    '16': 'Board-16 Cards',
    '24': 'Board-24 Cards',
    '36': 'Board-36 Cards',
};

const slashDefault = `${assetBase}images/cards/slash.svg`;
const slashSelected = `${assetBase}images/cards/slash2.svg`;
const settingsStorageKey = 'memory-game-settings';

const pawnImages: Record<Player, string> = {
    blue: `${assetBase}images/cards/chess_pawn_blue.svg`,
    orange: `${assetBase}images/cards/chess_pawn_orange.svg`,
};

const playerLabelImages: Record<Player, string> = {
    blue: `${assetBase}images/cards/blue_label.svg`,
    orange: `${assetBase}images/cards/orange_label.svg`,
};

const exitImages: Record<Theme, { default: string; hover: string }> = {
    'code-vibes': {
        default: `${assetBase}images/cards/turquoise/exitDefault.svg`,
        hover: `${assetBase}images/cards/turquoise/exithover.svg`,
    },
    gaming: {
        default: `${assetBase}images/cards/red/exit_red.svg`,
        hover: `${assetBase}images/cards/red/exit_red_hover.svg`,
    },
};

const cardBackImages: Record<Theme, string> = {
    'code-vibes': `${assetBase}images/cards/turquoise/card_deck1.svg`,
    gaming: `${assetBase}images/cards/red/card_deck2.svg`,
};

const boardColumns: Record<BoardSize, number> = {
    '16': 4,
    '24': 6,
    '36': 6,
};

const settings: GameSettings = {
    theme: null,
    player: null,
    boardSize: null,
};

const gameState: GameState = {
    blueScore: 0,
    orangeScore: 0,
    currentPlayer: null,
};

let activeExitTheme: Theme | null = null;
let initCleanup: (() => void) | undefined;

init();

function init(): void {
    initCleanup?.();

    const abortController = new AbortController();
    const { signal } = abortController;

    const playButton = document.getElementById('play-button');
    const homeScreen = document.getElementById('home-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('settings-start');
    const exitButton = document.getElementById('game-exit');

    if (!playButton || !homeScreen || !settingsScreen || !gameScreen || !startButton) {
        return;
    }

    playButton.addEventListener(
        'click',
        () => {
            homeScreen.classList.add('hidden');
            settingsScreen.classList.remove('hidden');
        },
        { signal },
    );

    document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
        input.addEventListener(
            'change',
            () => {
                updateSettings(input);
                updateFooter();
                updateStartButton(startButton);
                updatePreview();
            },
            { signal },
        );
    });

    startButton.addEventListener(
        'click',
        () => {
            if (startButton.classList.contains('settings-start--disabled') || !isSettingsComplete()) {
                return;
            }

            startGame(settingsScreen, gameScreen);
        },
        { signal },
    );

    exitButton?.addEventListener(
        'click',
        () => {
            exitGame(settingsScreen, gameScreen, startButton);
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

    initCleanup = () => {
        abortController.abort();
    };
}

function startGame(settingsScreen: HTMLElement, gameScreen: HTMLElement): void {
    if (!settings.theme || !settings.player || !settings.boardSize) {
        return;
    }

    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');

    if (settings.theme === 'code-vibes') {
        gameScreen.classList.add('game-screen--code-vibes');
    }

    if (settings.theme === 'gaming') {
        gameScreen.classList.add('game-screen--gaming');
    }

    gameState.blueScore = 0;
    gameState.orangeScore = 0;
    gameState.currentPlayer = settings.player;

    applyGameHeader();
    renderGameBoard();

    settingsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

function exitGame(settingsScreen: HTMLElement, gameScreen: HTMLElement, startButton: HTMLElement): void {
    resetSettings(startButton);
    resetExitButton();
    clearGameBoard();

    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');
    gameScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

function resetSettings(startButton: HTMLElement): void {
    settings.theme = null;
    settings.player = null;
    settings.boardSize = null;

    gameState.blueScore = 0;
    gameState.orangeScore = 0;
    gameState.currentPlayer = null;

    document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
        input.checked = false;
    });

    clearGameStorage();
    updateFooter();
    updateStartButton(startButton);
    updatePreview();
}

function clearGameStorage(): void {
    localStorage.removeItem(settingsStorageKey);
    sessionStorage.removeItem(settingsStorageKey);
}

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

function renderGameBoard(): void {
    const board = document.getElementById('game-board');

    if (!board || !settings.boardSize || !settings.theme) {
        return;
    }

    clearGameBoard();

    const cardCount = Number(settings.boardSize);
    const columns = boardColumns[settings.boardSize];
    const cardBack = cardBackImages[settings.theme];

    board.classList.add(`game-board--${settings.theme}`);
    board.style.setProperty('--board-columns', String(columns));

    for (let index = 0; index < cardCount; index += 1) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `game-card game-card--${settings.theme}`;
        card.setAttribute('aria-label', `Card ${index + 1}`);

        const image = document.createElement('img');
        image.className = 'game-card__image';
        image.src = cardBack;
        image.alt = '';
        image.setAttribute('aria-hidden', 'true');

        card.appendChild(image);
        board.appendChild(card);
    }
}

function clearGameBoard(): void {
    const board = document.getElementById('game-board');

    if (!board) {
        return;
    }

    board.innerHTML = '';
    board.className = 'game-board';
    board.style.removeProperty('--board-columns');
}

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

function resetExitButton(): void {
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

function updateSettings(input: HTMLInputElement): void {
    const { name, value } = input;

    if (name === 'theme') {
        settings.theme = value as Theme;
    }

    if (name === 'player') {
        settings.player = value as Player;
    }

    if (name === 'board-size') {
        settings.boardSize = value as BoardSize;
    }
}

function isSettingsComplete(): boolean {
    return settings.theme !== null && settings.player !== null && settings.boardSize !== null;
}

function updateStartButton(startButton: HTMLElement): void {
    const complete = isSettingsComplete();

    startButton.classList.toggle('settings-start--disabled', !complete);
    startButton.classList.toggle('settings-start--active', complete);

    if (startButton instanceof HTMLButtonElement) {
        startButton.disabled = !complete;
    }
}

function updateFooter(): void {
    const themeLabel = document.getElementById('footer-theme-label');
    const playerLabel = document.getElementById('footer-player-label');
    const boardLabel = document.getElementById('footer-board-label');

    if (!themeLabel || !playerLabel || !boardLabel) {
        return;
    }

    themeLabel.textContent = settings.theme ? 'Game theme' : 'Theme';
    playerLabel.textContent = settings.player ? playerLabels[settings.player] : 'Player';
    boardLabel.textContent = settings.boardSize ? boardLabels[settings.boardSize] : 'Board size';

    document.querySelectorAll<HTMLImageElement>('.settings-footer__slash').forEach((slash) => {
        const field = slash.dataset.after;
        const isSelected =
            (field === 'theme' && settings.theme !== null) ||
            (field === 'player' && settings.player !== null);

        slash.src = isSelected ? slashSelected : slashDefault;
        slash.classList.toggle('settings-footer__slash--selected', isSelected);
    });
}

function updatePreview(): void {
    const previewImage = document.getElementById('settings-preview-image') as HTMLImageElement | null;

    if (!previewImage) {
        return;
    }

    if (settings.theme) {
        previewImage.src = themePreviewImages[settings.theme];
        previewImage.hidden = false;
        return;
    }

    previewImage.hidden = true;
    previewImage.removeAttribute('src');
}

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        initCleanup?.();
    });
}
