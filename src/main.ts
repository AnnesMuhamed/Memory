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
    const startButton = document.getElementById('settings-start');

    if (!playButton || !homeScreen || !settingsScreen || !startButton) {
        return;
    }

    playButton.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
    });

    document.querySelectorAll<HTMLInputElement>('.settings-option__input').forEach((input) => {
        input.addEventListener('change', () => {
            updateSettings(input);
            updateStartButton(startButton);
            updatePreview();
        });
    });

    startButton.addEventListener('click', () => {
        if (startButton.classList.contains('settings-start--disabled')) {
            return;
        }

        // Game screen will be implemented next.
    });
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
