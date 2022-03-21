"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    const LOCAL_STORAGE_KEY = 'pokerTracker';
    const SAVE_APP_STATE_INTERVAL_MS = 10 * 1000;
    let Environments;
    (function (Environments) {
        Environments["Development"] = "development";
        Environments["Production"] = "production";
    })(Environments || (Environments = {}));
    let Screens;
    (function (Screens) {
        Screens["Intro"] = "intro";
        Screens["NewSession"] = "new-session";
        Screens["ShowSession"] = "show-session";
    })(Screens || (Screens = {}));
    class Selectors {
        constructor(appState) {
            this.appState = appState;
        }
        get currentSession() {
            if (this.appState.currentSessionId &&
                this._cachedCurrentSessionId !== this.appState.currentSessionId) {
                this._cachedCurrentSessionId = this.appState.currentSessionId;
                this._cachedCurrentSession = new Session(this.appState.currentSessionId);
            }
            return this._cachedCurrentSession;
        }
    }
    class Utils {
        // See https://stackoverflow.com/a/44078785/659910
        static uuid() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2);
        }
        static objectIsHtmlElement(object) {
            return !!object.tagName;
        }
        static objectIsHtmlInputElement(object) {
            return !!object.type;
        }
        static formatDuration(ms) {
            let seconds = ms / 1000;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds - hours * 3600) / 60);
            seconds = Math.round(seconds - hours * 3600 - minutes * 60);
            const hoursFormatted = hours < 10 ? `0${hours}` : hours.toString();
            const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes.toString();
            const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds.toString();
            return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
        }
    }
    Utils.isPlainObject = (object) => {
        return typeof object === 'object' && !Array.isArray(object);
    };
    Utils.objectSet = (object, key, value) => {
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
    Utils.nodeSet = (id, property, value) => {
        const node = document.getElementById(id);
        if (!node) {
            return;
        }
        node[property] = value;
    };
    Utils.nodeInputSet = (id, property, value) => {
        const node = document.getElementById(id);
        if (!node) {
            return;
        }
        node[property] = value;
    };
    class ApiService {
        origin() {
            if (environment === Environments.Development) {
                return 'http://localhost:3000';
            }
            else {
                return 'https://blackjack-trainer-api.herokuapp.com';
            }
        }
        request(path, body, requestOptions) {
            const url = `${this.origin()}/api/v1${path}`;
            return window.fetch(url, {
                method: requestOptions.method,
                headers: Object.assign(Object.assign({}, requestOptions.headers), { 'Content-Type': 'application/json' }),
                body: JSON.stringify(body),
            });
        }
        post(path, body, requestOptions) {
            return this.request(path, body, Object.assign({ method: 'POST' }, requestOptions));
        }
        saveSession(session, adminPassword) {
            return this.post('/poker_sessions', {
                data: {
                    type: 'poker_session',
                    attributes: session.attributes,
                },
            }, {
                headers: {
                    'Poker-Sessions-Admin-Password': adminPassword,
                },
            });
        }
    }
    class SessionDecorator {
        constructor(session) {
            this.session = session;
        }
        drinkTips() {
            var _a;
            return `$${(_a = this.session.attributes.drinkTips) !== null && _a !== void 0 ? _a : 0}`;
        }
        dealerTips() {
            var _a;
            return `$${(_a = this.session.attributes.dealerTips) !== null && _a !== void 0 ? _a : 0}`;
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
            var _a, _b;
            return (_b = (_a = this.session.startTime) === null || _a === void 0 ? void 0 : _a.toLocaleString()) !== null && _b !== void 0 ? _b : '';
        }
        profit() {
            var _a;
            const cashoutAmount = (_a = this.session.attributes.cashoutAmount) !== null && _a !== void 0 ? _a : 0;
            return (cashoutAmount - this.session.buyinsTotal()).toString();
        }
        timeElapsed() {
            if (!this.session.startTime) {
                return '';
            }
            return Utils.formatDuration(Date.now() - this.session.startTime.getTime());
        }
    }
    class Session {
        constructor(id) {
            this.id = id;
            if (!this.attributes) {
                throw new Error(`Session ${id} does not exist`);
            }
        }
        static create(casinoName, smallBlind, bigBlind, maxBuyin, maxPlayers) {
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
        rebuy(amount) {
            this.attributes.buyins.push({
                amount,
                time: new Date().toISOString(),
            });
        }
        rebuyMax() {
            this.rebuy(this.attributes.maxBuyin);
        }
        end(cashoutAmount) {
            this.attributes.cashoutAmount = cashoutAmount;
            this.attributes.endTime = new Date().toISOString();
        }
        undoEnd() {
            this.attributes.cashoutAmount = 0;
            delete this.attributes.endTime;
        }
        buyinsTotal() {
            return this.attributes.buyins.reduce((prev, current) => prev + current.amount, 0);
        }
        updateTip(type, change) {
            if (this.attributes[type] + change < 0) {
                return;
            }
            this.attributes[type] += change;
        }
        updateDealerTip(change) {
            this.updateTip('dealerTips', change);
        }
        updateDrinkTip(change) {
            this.updateTip('drinkTips', change);
        }
    }
    const locationToSessionId = () => {
        const sessionPath = window.location.hash.match(/#\/sessions\/(.+)/);
        if (sessionPath) {
            return sessionPath[1];
        }
    };
    const sessionIdToScreen = (sessionId) => {
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
        }
        else {
            return Environments.Production;
        }
    };
    const saveAppState = () => {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            sessions: appState.sessions,
            // This is not very secure but I'm the only user of this hacky app.
            // Long-term we would want JWT.
            cachedAdminPassword: appState.cachedAdminPassword,
        }));
    };
    const loadAppState = () => {
        const stateItem = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        const state = stateItem ? JSON.parse(stateItem) : {};
        const sessionId = locationToSessionId();
        return Object.assign({ screen: sessionIdToScreen(sessionId), sessions: {}, currentSessionId: sessionId, showSessionScreen: {
                rebuyAmount: '',
                cashoutAmount: '',
                adminPassword: '',
                isSavingSession: '',
            }, newSessionScreen: {
                casinoName: '',
                smallBlind: '',
                bigBlind: '',
                maxBuyin: '',
                maxPlayers: '8',
            } }, state);
    };
    const renderNewSessionScreen = (state) => {
        Utils.nodeInputSet('casino-name-input', 'value', state.newSessionScreen.casinoName);
        Utils.nodeInputSet('small-blind-input', 'value', state.newSessionScreen.smallBlind);
        Utils.nodeInputSet('big-blind-input', 'value', state.newSessionScreen.bigBlind);
        Utils.nodeInputSet('max-buyin-input', 'value', state.newSessionScreen.maxBuyin);
        Utils.nodeInputSet('max-players-input', 'value', state.newSessionScreen.maxPlayers);
    };
    const renderShowSessionScreen = (state) => {
        var _a, _b, _c, _d, _e, _f;
        if (!selectors.currentSession) {
            return;
        }
        const session = new SessionDecorator(selectors.currentSession);
        Utils.nodeInputSet('rebuy-amount-input', 'value', appState.showSessionScreen.rebuyAmount);
        (document.getElementById('rebuy-amount-input')).setAttribute('max', selectors.currentSession.attributes.maxBuyin.toString());
        Utils.nodeSet('session-title', 'innerText', session.title());
        Utils.nodeSet('session-profit', 'innerText', session.profit());
        Utils.nodeSet('session-start-time', 'innerText', session.startTime());
        Utils.nodeSet('session-time-elapsed', 'innerText', session.timeElapsed());
        Utils.nodeSet('session-dealer-tips-display', 'innerText', session.dealerTips());
        Utils.nodeSet('session-drink-tips-display', 'innerText', session.drinkTips());
        if (state.showSessionScreen.isSavingSession) {
            (_a = document
                .getElementById('end-session-submit-button')) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'disabled');
        }
        else {
            (_b = document
                .getElementById('end-session-submit-button')) === null || _b === void 0 ? void 0 : _b.removeAttribute('disabled');
        }
        if (state.cachedAdminPassword) {
            (_c = document.getElementById('admin-password-area')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
            (_d = document
                .getElementById('admin-password-input')) === null || _d === void 0 ? void 0 : _d.removeAttribute('required');
        }
        else {
            (_e = document
                .getElementById('admin-password-area')) === null || _e === void 0 ? void 0 : _e.classList.remove('hidden');
            (_f = document
                .getElementById('admin-password-input')) === null || _f === void 0 ? void 0 : _f.setAttribute('required', 'required');
        }
    };
    const render = (state) => {
        // Update visible screen.
        document
            .querySelectorAll('.screen')
            .forEach((node) => node.classList.add('hidden'));
        const activeScreenNode = document.getElementById(`${state.screen}-screen`);
        activeScreenNode === null || activeScreenNode === void 0 ? void 0 : activeScreenNode.classList.remove('hidden');
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
    const navigateToShowSessionScreen = (session) => {
        window.history.pushState({}, '', `#/sessions/${session.id}`);
        appState.currentSessionId = session.id;
        appState.screen = Screens.ShowSession;
    };
    const rebuy = () => {
        if (!selectors.currentSession) {
            return;
        }
        selectors.currentSession.rebuy(parseFloat(appState.showSessionScreen.rebuyAmount));
        appState.showSessionScreen.rebuyAmount = '';
    };
    const createSession = () => {
        const session = Session.create(appState.newSessionScreen.casinoName, parseInt(appState.newSessionScreen.smallBlind), parseInt(appState.newSessionScreen.bigBlind), parseInt(appState.newSessionScreen.maxBuyin), parseInt(appState.newSessionScreen.maxPlayers));
        session.start();
        navigateToShowSessionScreen(session);
    };
    const saveToGoogleSheet = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!selectors.currentSession) {
            return;
        }
        selectors.currentSession.end(parseFloat(appState.showSessionScreen.cashoutAmount));
        appState.showSessionScreen.isSavingSession = true;
        render(appState);
        let response;
        try {
            response = yield apiService.saveSession(selectors.currentSession, (_a = appState.cachedAdminPassword) !== null && _a !== void 0 ? _a : appState.showSessionScreen.adminPassword);
        }
        finally {
            appState.showSessionScreen.isSavingSession = false;
            render(appState);
        }
        if (response.ok) {
            if (!appState.cachedAdminPassword) {
                appState.cachedAdminPassword = appState.showSessionScreen.adminPassword;
            }
            alert('Success!');
            navigateToIntroScreen();
        }
        else {
            alert('Something went wrong.');
            // TODO: Use changesets so we don't have to do this.
            selectors.currentSession.undoEnd();
        }
    });
    const prefillBlinds = (smallBlind, bigBlind) => {
        appState.newSessionScreen.smallBlind = smallBlind;
        appState.newSessionScreen.bigBlind = bigBlind;
    };
    const prefillMaxBuyin = (maxBuyin) => {
        appState.newSessionScreen.maxBuyin = maxBuyin;
    };
    const handleClick = (event) => {
        var _a, _b, _c, _d, _e;
        if (!Utils.objectIsHtmlElement(event.target)) {
            return false;
        }
        switch (event.target.id) {
            case 'new-session-button':
                navigateToNewSessionScreen();
                return true;
            case 'decrement-dealer-tip-button':
                (_a = selectors.currentSession) === null || _a === void 0 ? void 0 : _a.updateDealerTip(-1);
                return true;
            case 'increment-dealer-tip-button':
                (_b = selectors.currentSession) === null || _b === void 0 ? void 0 : _b.updateDealerTip(1);
                return true;
            case 'decrement-drink-tip-button':
                (_c = selectors.currentSession) === null || _c === void 0 ? void 0 : _c.updateDrinkTip(-1);
                return true;
            case 'increment-drink-tip-button':
                (_d = selectors.currentSession) === null || _d === void 0 ? void 0 : _d.updateDrinkTip(1);
                return true;
            case 'rebuy-max-button':
                (_e = selectors.currentSession) === null || _e === void 0 ? void 0 : _e.rebuyMax();
                return true;
        }
        if (event.target.classList.contains('prefill-blinds') &&
            event.target.dataset.smallBlind &&
            event.target.dataset.bigBlind) {
            prefillBlinds(event.target.dataset.smallBlind, event.target.dataset.bigBlind);
            prefillMaxBuyin((parseInt(event.target.dataset.bigBlind) * 100).toString());
            return true;
        }
        return false;
    };
    const handleAppClick = (event) => {
        if (handleClick(event)) {
            render(appState);
        }
    };
    const handleSubmit = (event) => __awaiter(this, void 0, void 0, function* () {
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
                yield saveToGoogleSheet();
                return true;
        }
        return false;
    });
    const handleAppSubmit = (event) => __awaiter(this, void 0, void 0, function* () {
        if (yield handleSubmit(event)) {
            render(appState);
        }
    });
    const handleInput = (event) => {
        if (!Utils.objectIsHtmlInputElement(event.target)) {
            return false;
        }
        const idToStateKey = (id) => {
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
    const handleAppInput = (event) => {
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
