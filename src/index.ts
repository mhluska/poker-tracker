(function () {
  const LOCAL_STORAGE_KEY = 'pokerTracker';
  const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;

  enum Environments {
    Development = 'development',
    Production = 'production',
  }

  enum Screens {
    Intro = 'intro',
    NewSession = 'new-session',
    ShowSession = 'show-session',
  }

  type AppState = {
    screen: Screens;
    currentSessionId?: string;
    sessions: { [id: string]: SessionAttributes };
    showSessionScreen: {
      rebuyAmount: string;
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

  type SessionAttributes = {
    id: string;
    startTime?: string;
    endTime?: string;
    casinoName: string;
    smallBlind: number;
    bigBlind: number;
    maxBuyin: number;
    maxPlayers: number;
    cashoutAmount: number;
    drinkTips: number;
    dealerTips: number;
    buyins: { amount: number; time: string }[];
  };

  type Primitive = string | number | boolean | null | undefined;

  type PlainObject = {
    [key: string]: Primitive | PlainObject | PlainObject[];
  };

  // Is there a standard way to get these?
  type HTMLElementProperty = 'innerText';

  // Is there a standard way to get these?
  type HTMLInputElementProperty = HTMLElementProperty | 'value';

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
        this._cachedCurrentSession = new Session(
          this.appState.currentSessionId
        );
      }

      return this._cachedCurrentSession;
    }
  }

  class Utils {
    // See https://stackoverflow.com/a/44078785/659910
    static uuid() {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    static objectIsHtmlElement(object: unknown): object is HTMLElement {
      return !!(object as HTMLElement).tagName;
    }

    static objectIsHtmlInputElement(
      object: unknown
    ): object is HTMLInputElement {
      return !!(object as HTMLInputElement).type;
    }

    static formatDuration(ms: number) {
      let seconds = ms / 1000;

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds - hours * 3600) / 60);

      seconds = Math.round(seconds - hours * 3600 - minutes * 60);

      const hoursFormatted = hours < 10 ? `0${hours}` : hours.toString();
      const minutesFormatted =
        minutes < 10 ? `0${minutes}` : minutes.toString();
      const secondsFormatted =
        seconds < 10 ? `0${seconds}` : seconds.toString();

      return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
    }

    static isPlainObject = (object: unknown): object is PlainObject => {
      return typeof object === 'object' && !Array.isArray(object);
    };

    static objectSet = (object: PlainObject, key: string, value: Primitive) => {
      if (!key) {
        return;
      }

      const subKeys = key.split('.');
      const lastKey = subKeys.pop();

      if (!lastKey) {
        return;
      }

      for (const key of subKeys) {
        const next = object[key];
        if (!Utils.isPlainObject(next)) {
          return;
        }

        object = next;
      }

      object[lastKey] = value;
    };

    static nodeSet = (
      id: string,
      property: HTMLElementProperty,
      value: string
    ) => {
      const node = document.getElementById(id);
      if (!node) {
        return;
      }

      node[property] = value;
    };

    static nodeInputSet = (
      id: string,
      property: HTMLInputElementProperty,
      value: string
    ) => {
      const node = <HTMLInputElement>document.getElementById(id);
      if (!node) {
        return;
      }

      node[property] = value;
    };
  }

  class ApiService {
    origin() {
      if (environment === Environments.Development) {
        return 'http://localhost:3000';
      } else {
        return 'https://blackjack-trainer-api.herokuapp.com';
      }
    }

    request(path: string, body: unknown, requestOptions: RequestInit) {
      const url = `${this.origin()}/api/v1${path}`;

      return window.fetch(url, {
        method: requestOptions.method,
        headers: {
          ...requestOptions.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }

    post(path: string, body: unknown, requestOptions: RequestInit) {
      return this.request(path, body, { method: 'POST', ...requestOptions });
    }

    saveSession(session: Session, adminPassword: string) {
      return this.post(
        '/poker_sessions',
        {
          data: {
            type: 'poker_session',
            attributes: session.attributes,
          },
        },
        {
          headers: {
            'Poker-Sessions-Admin-Password': adminPassword,
          },
        }
      );
    }
  }

  class SessionDecorator {
    session: Session;

    constructor(session: Session) {
      this.session = session;
    }

    drinkTips() {
      return `$${this.session.attributes.drinkTips ?? 0}`;
    }

    dealerTips() {
      return `$${this.session.attributes.dealerTips ?? 0}`;
    }

    blinds() {
      return `${this.session.attributes.smallBlind}/${this.session.attributes.bigBlind}`;
    }

    maxBuyin() {
      return `$${this.session.attributes.maxBuyin} max`;
    }

    title() {
      return [
        this.session.attributes.casinoName,
        this.blinds(),
        this.maxBuyin(),
      ].join(' ');
    }

    startTime() {
      return this.session.startTime?.toLocaleString() ?? '';
    }

    profit() {
      const cashoutAmount = this.session.attributes.cashoutAmount ?? 0;
      return (cashoutAmount - this.session.buyinsTotal()).toString();
    }

    timeElapsed() {
      if (!this.session.startTime) {
        return '';
      }

      return Utils.formatDuration(
        Date.now() - this.session.startTime.getTime()
      );
    }
  }

  class Session {
    id: string;

    static create(
      casinoName: string,
      smallBlind: number,
      bigBlind: number,
      maxBuyin: number,
      maxPlayers: number
    ) {
      const id = Utils.uuid();

      appState.sessions[id] = {
        id: Utils.uuid(),
        casinoName,
        smallBlind,
        bigBlind,
        maxBuyin,
        maxPlayers,
        cashoutAmount: 0,
        dealerTips: 0,
        drinkTips: 0,
        buyins: [],
      };

      return new this(id);
    }

    constructor(id: string) {
      this.id = id;

      if (!this.attributes) {
        throw new Error(`Session ${id} does not exist`);
      }
    }

    get attributes() {
      return appState.sessions[this.id];
    }

    get startTime() {
      return this.attributes.startTime
        ? new Date(this.attributes.startTime)
        : null;
    }

    get endTime() {
      return this.attributes.endTime ? new Date(this.attributes.endTime) : null;
    }

    start() {
      if (this.startTime) {
        throw new Error('Session already started');
      }

      if (this.endTime) {
        throw new Error('Session already ended');
      }

      this.attributes.startTime = new Date().toISOString();
      this.attributes.buyins.push({
        amount: this.attributes.maxBuyin,
        time: this.attributes.startTime,
      });
    }

    rebuy(amount: number) {
      this.attributes.buyins.push({
        amount,
        time: new Date().toISOString(),
      });
    }

    rebuyMax() {
      this.rebuy(this.attributes.maxBuyin);
    }

    end(cashoutAmount: number) {
      this.attributes.cashoutAmount = cashoutAmount;
      this.attributes.endTime = new Date().toISOString();
    }

    undoEnd() {
      this.attributes.cashoutAmount = 0;
      delete this.attributes.endTime;
    }

    buyinsTotal() {
      return this.attributes.buyins.reduce(
        (prev, current) => prev + current.amount,
        0
      );
    }

    updateTip(type: 'dealerTips' | 'drinkTips', change: number) {
      if (this.attributes[type] + change < 0) {
        return;
      }

      this.attributes[type] += change;
    }

    updateDealerTip(change: number) {
      this.updateTip('dealerTips', change);
    }

    updateDrinkTip(change: number) {
      this.updateTip('drinkTips', change);
    }
  }

  const locationToSessionId = () => {
    const sessionPath = window.location.hash.match(/#\/sessions\/(.+)/);

    if (sessionPath) {
      return sessionPath[1];
    }
  };

  const sessionIdToScreen = (sessionId?: string) => {
    if (!sessionId) {
      return Screens.Intro;
    }

    if (sessionId === 'new') {
      return Screens.NewSession;
    }

    return Screens.ShowSession;
  };

  const getEnvironment = () => {
    if (window.location.hostname === 'localhost') {
      return Environments.Development;
    } else {
      return Environments.Production;
    }
  };

  const saveAppState = () => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        sessions: appState.sessions,
        // This is not very secure but I'm the only user of this hacky app.
        // Long-term we would want JWT.
        cachedAdminPassword: appState.cachedAdminPassword,
      })
    );
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
        cashoutAmount: '',
        adminPassword: '',
        isSavingSession: '',
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

  const renderNewSessionScreen = (state: AppState) => {
    Utils.nodeInputSet(
      'casino-name-input',
      'value',
      state.newSessionScreen.casinoName
    );
    Utils.nodeInputSet(
      'small-blind-input',
      'value',
      state.newSessionScreen.smallBlind
    );
    Utils.nodeInputSet(
      'big-blind-input',
      'value',
      state.newSessionScreen.bigBlind
    );
    Utils.nodeInputSet(
      'max-buyin-input',
      'value',
      state.newSessionScreen.maxBuyin
    );
    Utils.nodeInputSet(
      'max-players-input',
      'value',
      state.newSessionScreen.maxPlayers
    );
  };

  const renderShowSessionScreen = (state: AppState) => {
    if (!selectors.currentSession) {
      return;
    }

    const session = new SessionDecorator(selectors.currentSession);

    Utils.nodeInputSet(
      'rebuy-amount-input',
      'value',
      appState.showSessionScreen.rebuyAmount
    );

    (<HTMLInputElement>(
      document.getElementById('rebuy-amount-input')
    )).setAttribute(
      'max',
      selectors.currentSession.attributes.maxBuyin.toString()
    );

    Utils.nodeSet('session-title', 'innerText', session.title());
    Utils.nodeSet('session-profit', 'innerText', session.profit());
    Utils.nodeSet('session-start-time', 'innerText', session.startTime());
    Utils.nodeSet('session-time-elapsed', 'innerText', session.timeElapsed());
    Utils.nodeSet(
      'session-dealer-tips-display',
      'innerText',
      session.dealerTips()
    );
    Utils.nodeSet(
      'session-drink-tips-display',
      'innerText',
      session.drinkTips()
    );

    if (state.showSessionScreen.isSavingSession) {
      document
        .getElementById('end-session-submit-button')
        ?.setAttribute('disabled', 'disabled');
    } else {
      document
        .getElementById('end-session-submit-button')
        ?.removeAttribute('disabled');
    }

    if (state.cachedAdminPassword) {
      document.getElementById('admin-password-area')?.classList.add('hidden');
      document
        .getElementById('admin-password-input')
        ?.removeAttribute('required');
    } else {
      document
        .getElementById('admin-password-area')
        ?.classList.remove('hidden');
      document
        .getElementById('admin-password-input')
        ?.setAttribute('required', 'required');
    }
  };

  const render = (state: AppState) => {
    // Update visible screen.
    document
      .querySelectorAll('.screen')
      .forEach((node) => node.classList.add('hidden'));
    const activeScreenNode = document.getElementById(`${state.screen}-screen`);
    activeScreenNode?.classList.remove('hidden');

    switch (appState.screen) {
      case Screens.NewSession:
        return renderNewSessionScreen(state);
      case Screens.ShowSession:
        return renderShowSessionScreen(state);
    }
  };

  const navigateToIntroScreen = () => {
    window.history.pushState({}, '', '#');
    appState.screen = Screens.Intro;
  };

  const navigateToNewSessionScreen = () => {
    window.history.pushState({}, '', '#/sessions/new');
    appState.screen = Screens.NewSession;
  };

  const navigateToShowSessionScreen = (session: Session) => {
    window.history.pushState({}, '', `#/sessions/${session.id}`);
    appState.currentSessionId = session.id;
    appState.screen = Screens.ShowSession;
  };

  const rebuy = () => {
    if (!selectors.currentSession) {
      return;
    }

    selectors.currentSession.rebuy(
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
    if (!selectors.currentSession) {
      return;
    }

    selectors.currentSession.end(
      parseFloat(appState.showSessionScreen.cashoutAmount)
    );

    appState.showSessionScreen.isSavingSession = true;
    render(appState);

    let response;

    try {
      response = await apiService.saveSession(
        selectors.currentSession,
        appState.cachedAdminPassword ?? appState.showSessionScreen.adminPassword
      );
    } finally {
      appState.showSessionScreen.isSavingSession = false;
      render(appState);
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
      selectors.currentSession.undoEnd();
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
    if (!Utils.objectIsHtmlElement(event.target)) {
      return false;
    }

    switch (event.target.id) {
      case 'new-session-button':
        navigateToNewSessionScreen();
        return true;
      case 'decrement-dealer-tip-button':
        selectors.currentSession?.updateDealerTip(-1);
        return true;
      case 'increment-dealer-tip-button':
        selectors.currentSession?.updateDealerTip(1);
        return true;
      case 'decrement-drink-tip-button':
        selectors.currentSession?.updateDrinkTip(-1);
        return true;
      case 'increment-drink-tip-button':
        selectors.currentSession?.updateDrinkTip(1);
        return true;
      case 'rebuy-max-button':
        selectors.currentSession?.rebuyMax();
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

      prefillMaxBuyin(
        (parseInt(event.target.dataset.bigBlind) * 100).toString()
      );

      return true;
    }

    return false;
  };

  const handleAppClick = (event: Event) => {
    if (handleClick(event)) {
      render(appState);
    }
  };

  const handleSubmit = async (event: Event) => {
    if (!Utils.objectIsHtmlElement(event.target)) {
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
      render(appState);
    }
  };

  const handleInput = (event: Event) => {
    if (!Utils.objectIsHtmlInputElement(event.target)) {
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

    return Utils.objectSet(appState, key, event.target.value);
  };

  const handleAppInput = (event: Event) => {
    if (handleInput(event)) {
      render(appState);
    }
  };

  const environment = getEnvironment();
  const apiService = new ApiService();
  const appState = loadAppState();
  const selectors = new Selectors(appState);

  document.body.addEventListener('click', handleAppClick);
  document.body.addEventListener('submit', handleAppSubmit);
  document.body.addEventListener('input', handleAppInput);

  // HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
  setInterval(saveAppState, SAVE_APP_STATE_INTERVAL_MS);
  document.addEventListener('visibilitychange', saveAppState);

  window.onbeforeunload = saveAppState;

  render(appState);
})();
