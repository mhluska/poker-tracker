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
  maxPlayers: number;
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
    maxPlayers: string;
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
      maxPlayers: '8',
    },
    ...state,
  };
};

export const app = loadAppState();

export const saveToLocalStorage = () => {
  window.localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      sessions: app.sessions,
      // This is not very secure but I'm the only user of this hacky app.
      // Long-term we would want JWT.
      cachedAdminPassword: app.cachedAdminPassword,
    })
  );
};
