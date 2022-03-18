(function() {
  enum Environments {
    Development = 'development',
    Production = 'production',
  }

  enum Screens {
    Intro = 'intro',
    NewSession = 'new-session',
    ShowSession = 'show-session'
  };

  type AppState = {
    screen: Screens,
    currentSession?: Session;
    currentSessionRebuyAmount?: string;
    currentSessionCashoutAmount?: string;
    currentSessionAdminPassword?: string;
    newSessionCasinoName?: string;
    newSessionSmallBlind?: string;
    newSessionBigBlind?: string;
    newSessionMaxBuyin?: string;
    newSessionMaxPlayers?: string;
    isSavingSession: boolean;
  };

  type SessionBuyin = {
    amount: number;
    time: Date;
  };

  type SessionAttributes = {
    uuid: string;
    startTime?: string;
    endTime?: string;
    casinoName: string;
    smallBlind: number;
    bigBlind: number;
    maxBuyin: number;
    maxPlayers: number;
    cashoutAmount: number;
    buyins: { amount: number, time: string }[];
  };

  class Utils {
    // See https://stackoverflow.com/a/44078785/659910
    static uuid() {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    static objectIsHtmlElement(object: unknown): object is HTMLElement {
      return !!(object as HTMLElement).tagName;
    }

    static objectIsHtmlInputElement(object: unknown): object is HTMLInputElement {
      return !!(object as HTMLInputElement).type;
    }

    static localStorageSessionKey(sessionId: string) {
      return `pokerTracker:session:${sessionId}`;
    }
  }

  class ApiService {
    origin() {
      if (environment === Environments.Development) {
        return 'http://localhost:3000';
      } else {
        return 'https://blackjack-trainer-api.herokuapp.com';
      }
    }

    request(path, body, requestOptions) {
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

    post(path, body, requestOptions) {
      return this.request(path, body, { method: 'POST', ...requestOptions });
    }

    saveSession(session: Session, adminPassword: string) {
      return this.post('/poker_sessions', {
        data: {
          type: 'poker_session',
          attributes: session.attributes(),
        },
      }, {
        headers: {
          'Poker-Sessions-Admin-Password': adminPassword
        },
      });
    }
  }

  class SessionDecorator {
    session: Session;

    constructor(session: Session) {
      this.session = session;
    }

    blinds() {
      return `${this.session.smallBlind}/${this.session.bigBlind}`;
    }

    maxBuyin() {
      return `$${this.session.maxBuyin} max`;
    }

    title() {
      return [
        this.session.casinoName,
        this.blinds(),
        this.maxBuyin(),
      ].join(' ');
    }

    // TODO: Format time.
    startTime() {
      return this.session.startTime.toISOString();
    }

    profit() {
      const cashoutAmount = this.session.cashoutAmount ?? 0;
      return (cashoutAmount - this.session.buyinsTotal()).toString();
    }
  }

  class Session {
    startTime: Date | null;
    endTime: Date | null;
    uuid: string;
    casinoName: string;
    smallBlind: number;
    bigBlind: number;
    maxBuyin: number;
    maxPlayers: number;
    cashoutAmount: number;
    buyins: SessionBuyin[];

    static load(attributesString: string) {
      const attributes: SessionAttributes = JSON.parse(attributesString);
      const session = new this(
        attributes.casinoName,
        attributes.smallBlind,
        attributes.bigBlind,
        attributes.maxBuyin,
        attributes.maxPlayers
      );

      session.uuid = attributes.uuid;

      if (attributes.startTime) {
        session.startTime = new Date(attributes.startTime);
      }

      if (attributes.endTime) {
        session.endTime = new Date(attributes.endTime);
      }

      session.cashoutAmount = attributes.cashoutAmount;

      session.buyins = attributes.buyins.map(buyin => ({
        amount: buyin.amount,
        time: new Date(buyin.time)
      }));

      return session;
    }

    constructor(
      casinoName: string,
      smallBlind: number,
      bigBlind: number,
      maxBuyin: number,
      maxPlayers: number
    ) {
      this.startTime = null;
      this.endTime = null;
      this.uuid = Utils.uuid();
      this.casinoName = casinoName;
      this.smallBlind = smallBlind;
      this.bigBlind = bigBlind;
      this.maxBuyin = maxBuyin;
      this.maxPlayers = maxPlayers;
      this.buyins = [];
    }

    start() {
      if (this.startTime) {
        throw new Error('Session already started');
      }

      if (this.endTime) {
        throw new Error('Session already ended');
      }

      this.startTime = new Date();
      this.buyins.push({ amount: this.maxBuyin, time: this.startTime });
    }

    rebuy(amount: number) {
      this.buyins.push({ amount, time: new Date() });
    }

    end(cashoutAmount: number) {
      this.cashoutAmount = cashoutAmount;
      this.endTime = new Date();
    }

    save() {
      window.localStorage.setItem(Utils.localStorageSessionKey(this.uuid), JSON.stringify(this.attributes()));
    }

    buyinsTotal() {
      return this.buyins.reduce((prev, current) => (prev + current.amount), 0);
    }

    attributes(): SessionAttributes {
      return {
        uuid: this.uuid,
        startTime: this.startTime?.toISOString(),
        endTime: this.endTime?.toISOString(),
        casinoName: this.casinoName,
        smallBlind: this.smallBlind,
        bigBlind: this.bigBlind,
        maxBuyin: this.maxBuyin,
        maxPlayers: this.maxPlayers,
        cashoutAmount: this.cashoutAmount,
        buyins: this.buyins.map(rebuy => ({
          amount: rebuy.amount,
          time: rebuy.time.toISOString(),
        })),
      };
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
  }

  const sessionIdToCurrentSession = (sessionId?: string) => {
    if (!sessionId) {
      return null;
    }

    const item = window.localStorage.getItem(Utils.localStorageSessionKey(sessionId));
    if (!item) {
      return null;
    }

    return Session.load(item);
  }

  const getEnvironment = () => {
    if (window.location.hostname === 'localhost') {
      return Environments.Development;
    } else {
      return Environments.Production;
    }
  }

  const initAppState = (): AppState => {
    const sessionId = locationToSessionId();

    return {
      screen: sessionIdToScreen(sessionId),
      currentSession: sessionIdToCurrentSession(sessionId),
      newSessionMaxPlayers: '8',
      isSavingSession: false,
    }
  }

  const renderNewSessionScreen = (state: AppState) => {
    // Update new session screen data.
    if (state.newSessionCasinoName) {
      (<HTMLInputElement>document.getElementById('casino-name-input')).value = state.newSessionCasinoName;
    }

    if (state.newSessionSmallBlind) {
      (<HTMLInputElement>document.getElementById('small-blind-input')).value = state.newSessionSmallBlind;
    }

    if (state.newSessionBigBlind) {
      (<HTMLInputElement>document.getElementById('big-blind-input')).value = state.newSessionBigBlind;
    }

    if (state.newSessionMaxBuyin) {
      (<HTMLInputElement>document.getElementById('max-buyin-input')).value = state.newSessionMaxBuyin;
    }

    if (state.newSessionMaxPlayers) {
      (<HTMLInputElement>document.getElementById('max-players-input')).value = state.newSessionMaxPlayers;
    }
  }

  const renderShowSessionScreen = (state: AppState) => {
    const session = new SessionDecorator(state.currentSession);

    document.getElementById('rebuy-amount-input').setAttribute(
      'max',
      state.currentSession.maxBuyin.toString()
    );

    document.getElementById('session-title').innerText = session.title();
    document.getElementById('session-profit').innerText = session.profit();
    document.getElementById('session-start-time').innerText = session.startTime();

    if (appState.isSavingSession) {
      document.getElementById('end-session-submit-button').setAttribute('disabled', 'disabled');
    } else {
      document.getElementById('end-session-submit-button').removeAttribute('disabled');
    }
  };

  const render = (state: AppState) => {
    // Update visible screen.
    document.querySelectorAll('.screen').forEach(node => node.classList.add('hidden'));
    const activeScreenNode = document.getElementById(`${state.screen}-screen`);
    activeScreenNode.classList.remove('hidden');

    switch (appState.screen) {
      case Screens.NewSession:
        return renderNewSessionScreen(state);
      case Screens.ShowSession:
        return renderShowSessionScreen(state);
    }
  }

  const navigateToIntroScreen = () => {
    window.history.pushState({}, '', '#');
    appState.screen = Screens.Intro;
    render(appState);
  }

  const navigateToNewSessionScreen = () => {
    window.history.pushState({}, '', '#/sessions/new');
    appState.screen = Screens.NewSession;
    render(appState);
  };

  const navigateToShowSessionScreen = (session: Session) => {
    window.history.pushState({}, '', `#/sessions/${session.uuid}`);
    appState.currentSession = session;
    appState.screen = Screens.ShowSession;
    render(appState);
  };

  const rebuy = (session: Session) => {
    session.rebuy(parseFloat(appState.currentSessionRebuyAmount));
    render(appState);
  };

  const createSession = () => {
    const session = new Session(
      appState.newSessionCasinoName,
      parseInt(appState.newSessionSmallBlind),
      parseInt(appState.newSessionBigBlind),
      parseInt(appState.newSessionMaxBuyin),
      parseInt(appState.newSessionMaxPlayers),
    );

    session.start();
    session.save();

    navigateToShowSessionScreen(session);
  };

  const saveToGoogleSheet = async (session: Session) => {
    session.end(parseFloat(appState.currentSessionCashoutAmount));
    session.save();

    appState.isSavingSession = true;
    render(appState);

    let response;

    try {
      response = await apiService.saveSession(session, appState.currentSessionAdminPassword);
    } finally {
      appState.isSavingSession = false;
      render(appState);
    }

    if (response.ok) {
      alert('Success!');
      navigateToIntroScreen();
    } else {
      alert('Something went wrong.');
    }
  }

  const prefillBlinds = (smallBlind: string, bigBlind: string) => {
    appState.newSessionSmallBlind = smallBlind;
    appState.newSessionBigBlind = bigBlind;
    render(appState);
  };

  const handleClick = (event: Event) => {
    if (!Utils.objectIsHtmlElement(event.target)) {
      return;
    }

    switch (event.target.id) {
      case 'new-session-button':
        return navigateToNewSessionScreen();
    }

    if (event.target.classList.contains('prefill-blinds')) {
      return prefillBlinds(
        event.target.dataset.smallBlind,
        event.target.dataset.bigBlind
      );
    }
  };

  const handleSubmit = (event: Event) => {
    if (!Utils.objectIsHtmlElement(event.target)) {
      return;
    }

    event.preventDefault();

    switch (event.target.id) {
      case 'new-session-form':
        return createSession();
      case 'rebuy-form':
        return rebuy(appState.currentSession);
      case 'end-session-form':
        return saveToGoogleSheet(appState.currentSession);
    }
  };

  const handleKeyUp = (event: Event) => {
    if (!Utils.objectIsHtmlInputElement(event.target)) {
      return;
    }

    const idToStateKey = {
      'casino-name-input': 'newSessionCasinoName',
      'small-blind-input': 'newSessionSmallBlind',
      'big-blind-input': 'newSessionBigBlind',
      'max-buyin-input': 'newSessionMaxBuyin',
      'max-players-input': 'newSessionMaxPlayers',
      'rebuy-amount-input': 'currentSessionRebuyAmount',
      'cashout-amount-input': 'currentSessionCashoutAmount',
      'admin-password-input': 'currentSessionAdminPassword'
    };

    const appStateKey = idToStateKey[event.target.id];
    if (!appStateKey) {
      return;
    }

    appState[appStateKey] = event.target.value;
  }

  const __prefillNewSessionScreen = () => {
    appState.newSessionCasinoName = 'Bellagio';
    appState.newSessionSmallBlind = '2';
    appState.newSessionBigBlind = '5';
    appState.newSessionMaxBuyin = '500';
    appState.newSessionMaxPlayers = '8';

    render(appState);
  }

  const environment = getEnvironment();
  const apiService = new ApiService();
  const appState = initAppState();

  // @ts-ignore
  window.__prefillNewSessionScreen = __prefillNewSessionScreen;

  document.body.addEventListener('click', handleClick);
  document.body.addEventListener('submit', handleSubmit);
  document.body.addEventListener('keyup', handleKeyUp);

  render(appState);
})();
