import { App } from './components';
import { render, e } from 'tortie-core';
import { setupAppState } from './state';
import { saveToLocalStorage } from './state';

const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;
const appRoot = document.getElementById('root');

if (appRoot) {
  setupAppState(() => render(e(App), appRoot));
}

// HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
setInterval(saveToLocalStorage, SAVE_APP_STATE_INTERVAL_MS);
document.addEventListener('visibilitychange', saveToLocalStorage);

window.onbeforeunload = saveToLocalStorage;
