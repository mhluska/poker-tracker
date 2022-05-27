import { App } from './components';
import { render, e } from 'recat-core';
import { setupAppState } from './state';
import { saveToLocalStorage } from './state';

const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;
const ROOT_ID = 'root';
const appRoot = document.getElementById(ROOT_ID);

if (!appRoot) {
  throw new Error(`Missing root element with ID ${ROOT_ID}`);
}

setupAppState(() => render(e(App), appRoot));

// HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
setInterval(saveToLocalStorage, SAVE_APP_STATE_INTERVAL_MS);
document.addEventListener('visibilitychange', saveToLocalStorage);

window.onbeforeunload = saveToLocalStorage;
