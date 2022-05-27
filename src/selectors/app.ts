import { Session } from '../models';
import { Session as SessionDecorator } from '../decorators';
import { state, AppState } from '../state';

// TODO: Add caching. Could use Proxy with a dependency array.
class Selectors {
  appState: AppState;

  constructor(appState: AppState) {
    this.appState = appState;
  }

  get currentSession() {
    if (
      this.appState.currentSessionId
    ) {
      return new Session(this.appState.currentSessionId);
    }
  }

  get recentSessions() {
    return Object.values(this.appState.sessions)
      .sort((a, b) =>
        a.startTime && b.startTime
          ? Date.parse(b.startTime) - Date.parse(a.startTime)
          : -1
      ).map(attrs => new SessionDecorator(new Session(attrs.id)));
  }

  // TODO: Get this using a frecency algorithm.
  get mostFrequentCasinoName() {
    return this.recentSessions[0]?.session.attributes.casinoName;
  }
}

export const selectors = new Selectors(state.app);
