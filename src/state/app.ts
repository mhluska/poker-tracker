import { Screen } from '../types';

const LOCAL_STORAGE_KEY = 'pokerTracker';

type SessionAttributes = {
  id: string;
  startTime?: string;
  endTime?: string;
  casinoName: string;
  smallBlind: number;
  bigBlind: number;
  maxBuyin: number;
  notes: string;
  cashoutAmount: number;
  drinkTips: number;
  dealerTips: number;
  buyins: { amount: number; time: string }[];
};

export type AppState = {
  screen: Screen;
  currentSessionId?: string;
  sessions: { [id: string]: SessionAttributes };
  showSessionScreen: {
    rebuyAmount: string;
    notes: string;
    cashoutAmount: string;
    adminPassword: string;
    isSavingSession: boolean;
  };
  newSessionScreen: {
    casinoName: string;
    smallBlind: string;
    bigBlind: string;
    maxBuyin: string;
  };
  cachedAdminPassword?: string;
};

const locationToSessionId = () => {
  const sessionPath = window.location.hash.match(/#\/sessions\/(.+)/);

  if (sessionPath) {
    return sessionPath[1];
  }
};

const sessionIdToScreen = (sessionId?: string) => {
  if (!sessionId) {
    return Screen.Intro;
  }

  if (sessionId === 'new') {
    return Screen.NewSession;
  }

  return Screen.ShowSession;
};

const loadAppState = (): AppState => {
  const stateItem = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = stateItem ? JSON.parse(stateItem) : {};
  const sessionId = locationToSessionId();

  return {
    screen: sessionIdToScreen(sessionId),
    sessions: {},
    currentSessionId: sessionId,
    showSessionScreen: {
      rebuyAmount: '',
      notes: '',
      cashoutAmount: '',
      adminPassword: '',
      isSavingSession: false,
    },
    newSessionScreen: {
      casinoName: '',
      smallBlind: '',
      bigBlind: '',
      maxBuyin: '',
    },
    ...state,
  };
};

export const state = {
  app: loadAppState(),
};

export const setupAppState = (onStateChange: () => void) => {
  state.app = new Proxy(state.app, {
    get(target, key, receiver) {
      if (!Reflect.has(target, key)) {
        return;
      }

      const value = Reflect.get(target, key, receiver);

      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, this);
      } else {
        return value;
      }
    },

    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      if (success) {
        onStateChange();
      }
      return success;
    },
  });

  onStateChange();
}

export const saveToLocalStorage = () => {
  window.localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      sessions: state.app.sessions,
      // This is not very secure but I'm the only user of this hacky app.
      // Long-term we would want JWT.
      cachedAdminPassword: state.app.cachedAdminPassword,
    })
  );
};
