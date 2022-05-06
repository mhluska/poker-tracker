import {
  objectIsHtmlElement,
  objectIsHtmlInputElement,
  objectSet,
} from './utils';
import { App } from './components';
import { render, e } from './lib/renderer';
import { setupAppState } from './state';
import { Screen } from './types';
import { Api } from './services';
import { Session } from './models';
import { state, saveToLocalStorage } from './state';
import { appSelectors } from './selectors';

const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;

const navigateToIntroScreen = () => {
  window.history.pushState({}, '', '#');
  state.app.screen = Screen.Intro;
};

const navigateToNewSessionScreen = () => {
  window.history.pushState({}, '', '#/sessions/new');
  state.app.screen = Screen.NewSession;
};

const navigateToShowSessionScreen = (session: Session) => {
  window.history.pushState({}, '', `#/sessions/${session.id}`);
  state.app.currentSessionId = session.id;
  state.app.screen = Screen.ShowSession;
};

const rebuy = () => {
  if (!appSelectors.currentSession) {
    return;
  }

  appSelectors.currentSession.rebuy(
    parseFloat(state.app.showSessionScreen.rebuyAmount)
  );
  state.app.showSessionScreen.rebuyAmount = '';
};

const createSession = () => {
  const session = Session.create(
    state.app.newSessionScreen.casinoName,
    parseInt(state.app.newSessionScreen.smallBlind),
    parseInt(state.app.newSessionScreen.bigBlind),
    parseInt(state.app.newSessionScreen.maxBuyin),
  );

  session.start();

  navigateToShowSessionScreen(session);
};

const saveToGoogleSheet = async () => {
  if (!appSelectors.currentSession) {
    return;
  }

  appSelectors.currentSession.end(
    parseFloat(state.app.showSessionScreen.cashoutAmount),
    state.app.showSessionScreen.notes
  );

  state.app.showSessionScreen.isSavingSession = true;

  let response;

  try {
    response = await apiService.saveSession(
      appSelectors.currentSession,
      state.app.cachedAdminPassword ?? state.app.showSessionScreen.adminPassword
    );
  } finally {
    state.app.showSessionScreen.isSavingSession = false;
  }

  if (response.ok) {
    if (!state.app.cachedAdminPassword) {
      state.app.cachedAdminPassword = state.app.showSessionScreen.adminPassword;
    }

    alert('Success!');
    navigateToIntroScreen();
  } else {
    alert('Something went wrong.');

    // TODO: Use changesets so we don't have to do this.
    appSelectors.currentSession.undoEnd();
  }
};

const prefillBlinds = (smallBlind: string, bigBlind: string) => {
  state.app.newSessionScreen.smallBlind = smallBlind;
  state.app.newSessionScreen.bigBlind = bigBlind;
};

const prefillMaxBuyin = (maxBuyin: string) => {
  state.app.newSessionScreen.maxBuyin = maxBuyin;
};

const handleClick = (event: Event) => {
  if (!objectIsHtmlElement(event.target)) {
    return;
  }

  switch (event.target.id) {
    case 'new-session-button':
      navigateToNewSessionScreen();
      return;
    case 'decrement-dealer-tip-button':
      appSelectors.currentSession?.updateDealerTip(-1);
      return;
    case 'increment-dealer-tip-button':
      appSelectors.currentSession?.updateDealerTip(1);
      return;
    case 'decrement-drink-tip-button':
      appSelectors.currentSession?.updateDrinkTip(-1);
      return;
    case 'increment-drink-tip-button':
      appSelectors.currentSession?.updateDrinkTip(1);
      return;
    case 'rebuy-max-button':
      appSelectors.currentSession?.rebuyMax();
      return;
  }

  if (
    event.target.classList.contains('prefill-blinds') &&
    event.target.dataset.smallBlind &&
    event.target.dataset.bigBlind
  ) {
    prefillBlinds(
      event.target.dataset.smallBlind,
      event.target.dataset.bigBlind
    );

    prefillMaxBuyin((parseInt(event.target.dataset.bigBlind) * 100).toString());
  }
};

const handleSubmit = (event: Event) => {
  if (!objectIsHtmlElement(event.target)) {
    return;
  }

  event.preventDefault();

  switch (event.target.id) {
    case 'new-session-form':
      createSession();
      break;
    case 'rebuy-form':
      rebuy();
      break;
    case 'end-session-form':
      saveToGoogleSheet();
      break;
  }
};

const handleInput = (event: Event) => {
  if (!objectIsHtmlInputElement(event.target)) {
    return;
  }

  const idToStateKey = (id: string) => {
    switch (id) {
      case 'casino-name-input':
        return 'newSessionScreen.casinoName';
      case 'small-blind-input':
        return 'newSessionScreen.smallBlind';
      case 'big-blind-input':
        return 'newSessionScreen.bigBlind';
      case 'max-buyin-input':
        return 'newSessionScreen.maxBuyin';
      case 'max-players-input':
        return 'newSessionScreen.maxPlayers';
      case 'rebuy-amount-input':
        return 'showSessionScreen.rebuyAmount';
      case 'admin-password-input':
        return 'showSessionScreen.adminPassword';
    }
  };

  const key = idToStateKey(event.target.id);
  if (!key) {
    return;
  }

  return objectSet(state.app, key, event.target.value);
};

const apiService = new Api();
const appRoot = document.getElementById('root');

if (appRoot) {
  setupAppState(() => render(e(App), appRoot));

  appRoot.addEventListener('click', handleClick);
  appRoot.addEventListener('submit', handleSubmit);
  appRoot.addEventListener('input', handleInput);
}

// HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
setInterval(saveToLocalStorage, SAVE_APP_STATE_INTERVAL_MS);
document.addEventListener('visibilitychange', saveToLocalStorage);

window.onbeforeunload = saveToLocalStorage;
