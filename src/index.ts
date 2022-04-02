import {
  objectIsHtmlElement,
  objectIsHtmlInputElement,
  objectSet,
} from './utils';
import { App } from './components';
import { render } from './lib/renderer';
import { Screen } from './types';
import { Api } from './services';
import { Session } from './models';
import { appState, saveToLocalStorage } from './state';
import { appSelectors } from './selectors';

const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;

const navigateToIntroScreen = () => {
  window.history.pushState({}, '', '#');
  appState.screen = Screen.Intro;
};

const navigateToNewSessionScreen = () => {
  window.history.pushState({}, '', '#/sessions/new');
  appState.screen = Screen.NewSession;
};

const navigateToShowSessionScreen = (session: Session) => {
  window.history.pushState({}, '', `#/sessions/${session.id}`);
  appState.currentSessionId = session.id;
  appState.screen = Screen.ShowSession;
};

const rebuy = () => {
  if (!appSelectors.currentSession) {
    return;
  }

  appSelectors.currentSession.rebuy(
    parseFloat(appState.showSessionScreen.rebuyAmount)
  );
  appState.showSessionScreen.rebuyAmount = '';
};

const createSession = () => {
  const session = Session.create(
    appState.newSessionScreen.casinoName,
    parseInt(appState.newSessionScreen.smallBlind),
    parseInt(appState.newSessionScreen.bigBlind),
    parseInt(appState.newSessionScreen.maxBuyin),
    parseInt(appState.newSessionScreen.maxPlayers)
  );

  session.start();

  navigateToShowSessionScreen(session);
};

const saveToGoogleSheet = async () => {
  if (!appSelectors.currentSession) {
    return;
  }

  appSelectors.currentSession.end(
    parseFloat(appState.showSessionScreen.cashoutAmount),
    appState.showSessionScreen.notes
  );

  appState.showSessionScreen.isSavingSession = true;

  // TODO: Make this happen automatically on appState change.
  render(App(), appRoot);

  let response;

  try {
    response = await apiService.saveSession(
      appSelectors.currentSession,
      appState.cachedAdminPassword ?? appState.showSessionScreen.adminPassword
    );
  } finally {
    appState.showSessionScreen.isSavingSession = false;

    // TODO: Make this happen automatically on appState change.
    render(App(), appRoot);
  }

  if (response.ok) {
    if (!appState.cachedAdminPassword) {
      appState.cachedAdminPassword = appState.showSessionScreen.adminPassword;
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
  appState.newSessionScreen.smallBlind = smallBlind;
  appState.newSessionScreen.bigBlind = bigBlind;
};

const prefillMaxBuyin = (maxBuyin: string) => {
  appState.newSessionScreen.maxBuyin = maxBuyin;
};

const handleClick = (event: Event) => {
  if (!objectIsHtmlElement(event.target)) {
    return false;
  }

  switch (event.target.id) {
    case 'new-session-button':
      navigateToNewSessionScreen();
      return true;
    case 'decrement-dealer-tip-button':
      appSelectors.currentSession?.updateDealerTip(-1);
      return true;
    case 'increment-dealer-tip-button':
      appSelectors.currentSession?.updateDealerTip(1);
      return true;
    case 'decrement-drink-tip-button':
      appSelectors.currentSession?.updateDrinkTip(-1);
      return true;
    case 'increment-drink-tip-button':
      appSelectors.currentSession?.updateDrinkTip(1);
      return true;
    case 'rebuy-max-button':
      appSelectors.currentSession?.rebuyMax();
      return true;
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

    return true;
  }

  return false;
};

const handleAppClick = (event: Event) => {
  if (handleClick(event)) {
    // TODO: Make this happen automatically on appState change.
    render(App(), appRoot);
  }
};

const handleSubmit = async (event: Event) => {
  if (!objectIsHtmlElement(event.target)) {
    return false;
  }

  event.preventDefault();

  switch (event.target.id) {
    case 'new-session-form':
      createSession();
      return true;
    case 'rebuy-form':
      rebuy();
      return true;
    case 'end-session-form':
      await saveToGoogleSheet();
      return true;
  }

  return false;
};

const handleAppSubmit = async (event: Event) => {
  if (await handleSubmit(event)) {
    // TODO: Make this happen automatically on appState change.
    render(App(), appRoot);
  }
};

const handleInput = (event: Event) => {
  if (!objectIsHtmlInputElement(event.target)) {
    return false;
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
      case 'notes-input':
        return 'showSessionScreen.notes';
      case 'cashout-amount-input':
        return 'showSessionScreen.cashoutAmount';
      case 'admin-password-input':
        return 'showSessionScreen.adminPassword';
    }
  };

  const key = idToStateKey(event.target.id);
  if (!key) {
    return false;
  }

  return objectSet(appState, key, event.target.value);
};

const handleAppInput = (event: Event) => {
  if (handleInput(event)) {
    // TODO: Make this happen automatically on appState change.
    render(App(), appRoot);
  }
};

const apiService = new Api();
const appRoot = document.getElementById('root');

if (appRoot) {
  appRoot.addEventListener('click', handleAppClick);
  appRoot.addEventListener('submit', handleAppSubmit);
  appRoot.addEventListener('input', handleAppInput);
}

// HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
setInterval(saveToLocalStorage, SAVE_APP_STATE_INTERVAL_MS);
document.addEventListener('visibilitychange', saveToLocalStorage);

window.onbeforeunload = saveToLocalStorage;

render(App(), appRoot);
