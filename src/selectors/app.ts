import { Session } from '../models';
import { appState, AppState } from '../state';

class Selectors {
  appState: AppState;
  _cachedCurrentSession?: Session;
  _cachedCurrentSessionId?: string;

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
}

export const selectors = new Selectors(appState);
