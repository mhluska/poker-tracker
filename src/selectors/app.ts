import { Session } from '../models';
import { state, AppState } from '../state';

// TODO: Add automatic caching.
class Selectors {
  appState: AppState;
  _cachedCurrentSession?: Session;
  _cachedCurrentSessionId?: string;
  _cachedMostFrequentCasinoName?: string;

  constructor(appState: AppState) {
    this.appState = appState;
  }

  get currentSession() {
    if (
      this.appState.currentSessionId &&
      this._cachedCurrentSessionId !== this.appState.currentSessionId
    ) {
      this._cachedCurrentSessionId = this.appState.currentSessionId;
      this._cachedCurrentSession = new Session(this.appState.currentSessionId);
    }

    return this._cachedCurrentSession;
  }

  // TODO: Get this using a frecency algorithm.
  get mostFrequentCasinoName() {
    if (this._cachedMostFrequentCasinoName) {
      return this._cachedMostFrequentCasinoName;
    }

    const casinoName = Object.values(this.appState.sessions)
      .sort((a, b) =>
        a.endTime && b.endTime
          ? Date.parse(b.endTime) - Date.parse(a.endTime)
          : 1
      )[0]?.casinoName;

    if (casinoName) {
      this._cachedMostFrequentCasinoName = casinoName;
    }

    return casinoName;
  }
}

export const selectors = new Selectors(state.app);
