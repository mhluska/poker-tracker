import {
  uuid,
  objectIsHtmlElement,
  objectIsHtmlInputElement,
  formatDuration,
  objectSet,
  capitalize,
  isCapitalized,
} from './utils';
import { ElementProperties } from './types';

const LOCAL_STORAGE_KEY = 'pokerTracker';
const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;
const ELEMENT_NODE_TYPE = 1;
const TEXT_NODE_TYPE = 3;
const ELEMENT_PROPERTIES = new Set(['value', 'className']);

enum Environments {
  Development = 'development',
  Production = 'production',
}

enum Screen {
  Intro = 'intro',
  NewSession = 'new-session',
  ShowSession = 'show-session',
}

type AppState = {
  screen: Screen;
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

    return formatDuration(Date.now() - this.session.startTime.getTime());
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
    const id = uuid();

    appState.sessions[id] = {
      id: uuid(),
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
    return Screen.Intro;
  }

  if (sessionId === 'new') {
    return Screen.NewSession;
  }

  return Screen.ShowSession;
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

// See https://github.com/microsoft/TypeScript/pull/12253#issuecomment-353494273
const keys = Object.keys as <T>(o: T) => (keyof T)[];

type VirtualElement = {
  type: string;
  tagName: keyof HTMLElementTagNameMap;
  props: Partial<ElementProperties>;
  children: VirtualNode[];
};

type VirtualNode = string | VirtualElement;

const isNativeElementType = (
  type: string
): type is keyof HTMLElementTagNameMap => !isCapitalized(type);

const createVirtualElement = (
  type: string,
  props: VirtualElement['props'] | null = null,
  ...children: VirtualElement['children']
): VirtualElement => ({
  type,
  tagName: isNativeElementType(type)
    ? type
    : (props?.tagName as keyof HTMLElementTagNameMap),
  props: props || {},
  children,
});

const createDomNode = (virtualNode: VirtualNode) => {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode);
  }

  const { tagName, props, children } = virtualNode;
  const element = document.createElement(tagName);

  if (props) {
    for (const name of keys(props)) {
      if (name === 'tagName') {
        continue;
      }

      const value = props[name];

      if (ELEMENT_PROPERTIES.has(name)) {
        // TODO: Figure out why an error related to readonly properties is
        // happening despite using `Writeable`.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element[name] = value;
      } else {
        if (typeof value === 'boolean' && value === false) {
          continue;
        }

        element.setAttribute(name, String(value));
      }
    }
  }

  for (const child of children) {
    const childDomElement = createDomNode(child);

    if (!childDomElement) {
      continue;
    }

    element.appendChild(childDomElement);
  }

  return element;
};

const e = createVirtualElement;

const NumberInput = ({
  id,
  placeholder,
  value,
  min = 1,
  max,
}: {
  id: string;
  placeholder: string;
  value?: string;
  min?: number;
  max?: number;
}) =>
  e('NumberInput', {
    tagName: 'input',
    id,
    type: 'number',
    placeholder,
    pattern: '\\d*',
    value,
    min,
    max,
    required: 'required',
  });

const BlindsButton = ({
  smallBlind,
  bigBlind,
}: {
  smallBlind: number;
  bigBlind: number;
}) =>
  e(
    'BlindsButton',
    {
      tagName: 'button',
      type: 'button',
      className: 'prefill-blinds',
      'data-small-blind': smallBlind,
      'data-big-blind': bigBlind,
    },
    `${smallBlind}/${bigBlind}`
  );

const TipsSection = ({
  type,
  value,
}: {
  type: 'dealer' | 'drink';
  value: string;
}) =>
  e(
    'TipsSection',
    { tagName: 'div', className: 'section' },
    e('span', null, `${capitalize(type)} tips: ${value}`),
    e(
      'div',
      null,
      e(
        'button',
        { className: 'tip-button', id: `decrement-${type}-tip-button` },
        '-'
      ),
      e(
        'button',
        { className: 'tip-button', id: `increment-${type}-tip-button` },
        '+'
      )
    )
  );

const IntroScreen = () => {
  return e(
    'IntroScreen',
    { tagName: 'div', id: 'intro-screen', className: 'screen' },
    e('button', { id: 'new-session-button' }, 'Start Session')
  );
};

const NewSessionScreen = () => {
  return e(
    'NewSessionScreen',
    { tagName: 'div', id: 'new-session-screen', className: 'screen' },
    e(
      'form',
      { id: 'new-session-form' },
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Casino Name'),
          e('input', {
            id: 'casino-name-input',
            type: 'text',
            placeholder: 'Bellagio',
            required: 'required',
            value: appState.newSessionScreen.casinoName,
          })
        )
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Blinds'),
          NumberInput({
            id: 'small-blind-input',
            placeholder: '2',
            value: appState.newSessionScreen.smallBlind,
            max: 100,
          }),
          NumberInput({
            id: 'big-blind-input',
            placeholder: '5',
            value: appState.newSessionScreen.bigBlind,
            max: 200,
          })
        ),
        BlindsButton({ smallBlind: 1, bigBlind: 2 }),
        BlindsButton({ smallBlind: 1, bigBlind: 3 }),
        BlindsButton({ smallBlind: 2, bigBlind: 5 }),
        BlindsButton({ smallBlind: 5, bigBlind: 10 })
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Max Buyin'),
          NumberInput({
            id: 'max-buyin-input',
            placeholder: '500',
            value: appState.newSessionScreen.maxBuyin,
          })
        )
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Max Players'),
          NumberInput({
            id: 'max-players-input',
            placeholder: '8',
            max: 10,
            value: appState.newSessionScreen.maxPlayers,
          })
        )
      ),
      e('div', null, e('input', { type: 'submit', value: 'Start Session' }))
    )
  );
};

const ShowSessionScreen = () => {
  if (!selectors.currentSession) {
    return '';
  }

  const session = new SessionDecorator(selectors.currentSession);

  return e(
    'ShowSessionScreen',
    { tagName: 'div', id: 'show-session-screen', className: 'screen' },
    e('h1', { id: 'session-title' }, session.title()),
    e('div', null, e('span', null, `Profit: $${session.profit()}`)),
    e('div', null, e('span', null, `Start time: $${session.startTime()}`)),
    e('div', null, e('span', null, `Time elapsed: ${session.timeElapsed()}`)),

    e(
      'form',
      { id: 'rebuy-form', className: 'section' },
      NumberInput({
        id: 'rebuy-amount-input',
        placeholder: selectors.currentSession.attributes.maxBuyin.toString(),
        max: selectors.currentSession.attributes.maxBuyin,
        value: appState.showSessionScreen.rebuyAmount,
      }),
      e('input', { type: 'submit', value: 'Rebuy' }),
      e('input', { id: 'rebuy-max-button', type: 'button', value: 'Max' })
    ),

    TipsSection({ type: 'dealer', value: session.dealerTips() }),
    TipsSection({ type: 'drink', value: session.drinkTips() }),

    e(
      'form',
      { id: 'end-session-form', className: 'section' },
      e('input', {
        className: 'hidden',
        type: 'text',
        autocomplete: 'username',
      }),

      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Cashout Amount'),
          NumberInput({
            min: 0,
            id: 'cashout-amount-input',
            placeholder: (
              selectors.currentSession.attributes.maxBuyin * 3
            ).toString(),
          })
        )
      ),

      appState.cachedAdminPassword
        ? ''
        : e(
            'div',
            { id: 'admin-password-area' },
            e('label', null, e('span', null, 'Password')),
            e('input', {
              id: 'admin-password-input',
              type: 'password',
              autocomplete: 'current-password',
              required: 'required',
            })
          ),

      e('input', {
        id: 'end-session-submit-button',
        type: 'submit',
        value: 'End Session',
        disabled: appState.showSessionScreen.isSavingSession,
      })
    )
  );
};

const renderScreen = () => {
  switch (appState.screen) {
    case Screen.Intro:
      return IntroScreen();
    case Screen.NewSession:
      return NewSessionScreen();
    case Screen.ShowSession:
      return ShowSessionScreen();
    default:
      throw new Error(`Unexpected screen ${screen}`);
  }
};

const reconcileProps = (
  domNode: Element,
  prevNode: VirtualElement,
  newNode: VirtualElement
) => {
  for (const name of keys(newNode.props)) {
    // HACK: With properties, our crappy virtal DOM can get out of sync after
    // user input so we just always write.
    if (ELEMENT_PROPERTIES.has(name) && newNode.props[name] !== undefined) {
      // TODO: Fix type `Element` being too generic here.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      domNode[name] = newNode.props[name];
    } else if (newNode.props[name] !== prevNode.props[name]) {
      if (typeof newNode.props[name] === 'boolean') {
        if (newNode.props[name]) {
          domNode.setAttribute(name, name);
        } else {
          domNode.removeAttribute(name);
        }
      } else {
        domNode.setAttribute(name, String(newNode.props[name]));
      }
    }
  }

  for (const name of keys(prevNode.props)) {
    if (newNode.props[name] === undefined) {
      if (ELEMENT_PROPERTIES.has(name)) {
        // TODO: Fix type `Element` being too generic here.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        domNode[name] = '';
      } else {
        domNode.removeAttribute(name);
      }
    }
  }
};

const elementType = (element: NonNullable<VirtualNode>) => {
  return typeof element === 'string' ? 'string' : element.type;
};

const reconcile = (
  domNode: Element | null,
  prevNode: VirtualNode,
  newNode: VirtualNode,
  parentElement: Element
) => {
  if (!domNode) {
    parentElement.appendChild(createDomNode(newNode));
    return;
  }

  if (prevNode && newNode) {
    if (elementType(prevNode) !== elementType(newNode)) {
      domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
      return;
    }

    if (typeof prevNode === 'string') {
      domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
      return;
    }

    // This is certain because we check that both types are the same above but
    // TypeScript is not smart enough to know that.
    if (typeof newNode === 'string') {
      return;
    }

    reconcileProps(domNode, prevNode, newNode);

    newNode.children.forEach((newNodeChild, index) => {
      reconcile(
        Array.from(domNode.childNodes).filter(
          (node) =>
            node.nodeType === ELEMENT_NODE_TYPE ||
            node.nodeType === TEXT_NODE_TYPE
        )[index] as Element,
        prevNode.children[index],
        newNodeChild,
        domNode
      );
    });
  } else if (newNode) {
    domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
  } else if (prevNode) {
    domNode.remove();
  }
};

let prevVirtualNode = e('div');

const render = () => {
  if (!appRoot) {
    throw new Error('appRoot is not set');
  }

  if (!appRoot.parentElement) {
    throw new Error('appRoot not attached to DOM');
  }

  const virtualNode = e('div', null, renderScreen());
  reconcile(appRoot, prevVirtualNode, virtualNode, appRoot.parentElement);

  prevVirtualNode = virtualNode;
};

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
  render();

  let response;

  try {
    response = await apiService.saveSession(
      selectors.currentSession,
      appState.cachedAdminPassword ?? appState.showSessionScreen.adminPassword
    );
  } finally {
    appState.showSessionScreen.isSavingSession = false;
    render();
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
  if (!objectIsHtmlElement(event.target)) {
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

    prefillMaxBuyin((parseInt(event.target.dataset.bigBlind) * 100).toString());

    return true;
  }

  return false;
};

const handleAppClick = (event: Event) => {
  if (handleClick(event)) {
    render();
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
    render();
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
    render();
  }
};

const environment = getEnvironment();
const apiService = new ApiService();
const appState = loadAppState();
const selectors = new Selectors(appState);
const appRoot = document.getElementById('root');

if (appRoot) {
  appRoot.addEventListener('click', handleAppClick);
  appRoot.addEventListener('submit', handleAppSubmit);
  appRoot.addEventListener('input', handleAppInput);
}

// HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
setInterval(saveAppState, SAVE_APP_STATE_INTERVAL_MS);
document.addEventListener('visibilitychange', saveAppState);

window.onbeforeunload = saveAppState;

render();
