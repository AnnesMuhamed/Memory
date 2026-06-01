import './styles/style.scss';

type Theme = 'code-vibes' | 'gaming';
type Player = 'blue' | 'orange';
type BoardSize = '16' | '24' | '36';

interface GameSettings {
    theme: Theme | null;
    player: Player | null;
    boardSize: BoardSize | null;
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

const settings: GameSettings = {
    theme: null,
    player: null,
    boardSize: null,
};

init();

function init(): void {
    const playButton = document.getElementById('play-button');
    const homeScreen = document.getElementById('home-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('settings-start');

    if (!playButton || !homeScreen || !settingsScreen || !gameScreen || !startButton) {
        return;
    }

    playButton.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
    });

    document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
        input.addEventListener('change', () => {
            updateSettings(input);
            updateFooter();
            updateStartButton(startButton);
            updatePreview();
        });
    });

    startButton.addEventListener('click', () => {
        if (startButton.classList.contains('settings-start--disabled') || !isSettingsComplete()) {
            return;
        }

        startGame(settingsScreen, gameScreen);
    });
}

function startGame(settingsScreen: HTMLElement, gameScreen: HTMLElement): void {
    if (!settings.theme) {
        return;
    }

    gameScreen.classList.remove('game-screen--code-vibes', 'game-screen--gaming');

    if (settings.theme === 'code-vibes') {
        gameScreen.classList.add('game-screen--code-vibes');
    }

    if (settings.theme === 'gaming') {
        gameScreen.classList.add('game-screen--gaming');
    }

    settingsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
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
