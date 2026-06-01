import './start-screen.scss';

/**
 * Sets up the start screen play button and navigates to settings on click.
 *
 * @param onPlay - Callback invoked after the home screen is hidden.
 * @param signal - AbortSignal used to remove listeners on cleanup.
 */
export function initStartScreen(onPlay: () => void, signal: AbortSignal): void {
    const playButton = document.getElementById('play-button');
    const homeScreen = document.getElementById('home-screen');

    if (!playButton || !homeScreen) {
        return;
    }

    playButton.addEventListener(
        'click',
        () => {
            homeScreen.classList.add('hidden');
            onPlay();
        },
        { signal },
    );
}

/**
 * Reveals the settings screen.
 */
export function showSettingsScreen(): void {
    document.getElementById('settings-screen')?.classList.remove('hidden');
}
