var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    var _this = this;
    var Environments;
    (function (Environments) {
        Environments["Development"] = "development";
        Environments["Production"] = "production";
    })(Environments || (Environments = {}));
    var Screens;
    (function (Screens) {
        Screens["Intro"] = "intro";
        Screens["NewSession"] = "new-session";
        Screens["ShowSession"] = "show-session";
    })(Screens || (Screens = {}));
    ;
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        // See https://stackoverflow.com/a/44078785/659910
        Utils.uuid = function () {
            return Date.now().toString(36) + Math.random().toString(36).substring(2);
        };
        Utils.objectIsHtmlElement = function (object) {
            return !!object.tagName;
        };
        Utils.objectIsHtmlInputElement = function (object) {
            return !!object.type;
        };
        Utils.localStorageSessionKey = function (sessionId) {
            return "pokerTracker:session:".concat(sessionId);
        };
        Utils.timeSince = function (date) {
            var seconds = Math.floor((Date.now() - date.getTime()) / 1000);
            var interval = seconds / 31536000;
            if (interval > 1) {
                return Math.floor(interval) + ' years';
            }
            interval = seconds / 2592000;
            if (interval > 1) {
                return Math.floor(interval) + ' months';
            }
            interval = seconds / 86400;
            if (interval > 1) {
                return Math.floor(interval) + ' days';
            }
            interval = seconds / 3600;
            if (interval > 1) {
                return Math.floor(interval) + ' hours';
            }
            interval = seconds / 60;
            if (interval > 1) {
                return Math.floor(interval) + ' minutes';
            }
            return Math.floor(seconds) + ' seconds';
        };
        return Utils;
    }());
    var ApiService = /** @class */ (function () {
        function ApiService() {
        }
        ApiService.prototype.origin = function () {
            if (environment === Environments.Development) {
                return 'http://localhost:3000';
            }
            else {
                return 'https://blackjack-trainer-api.herokuapp.com';
            }
        };
        ApiService.prototype.request = function (path, body, requestOptions) {
            var url = "".concat(this.origin(), "/api/v1").concat(path);
            return window.fetch(url, {
                method: requestOptions.method,
                headers: __assign(__assign({}, requestOptions.headers), { 'Content-Type': 'application/json' }),
                body: JSON.stringify(body)
            });
        };
        ApiService.prototype.post = function (path, body, requestOptions) {
            return this.request(path, body, __assign({ method: 'POST' }, requestOptions));
        };
        ApiService.prototype.saveSession = function (session, adminPassword) {
            return this.post('/poker_sessions', {
                data: {
                    type: 'poker_session',
                    attributes: session.attributes()
                }
            }, {
                headers: {
                    'Poker-Sessions-Admin-Password': adminPassword
                }
            });
        };
        return ApiService;
    }());
    var SessionDecorator = /** @class */ (function () {
        function SessionDecorator(session) {
            this.session = session;
        }
        SessionDecorator.prototype.drinkTips = function () {
            var _a;
            return "$".concat((_a = this.session.drinkTips) !== null && _a !== void 0 ? _a : 0);
        };
        SessionDecorator.prototype.dealerTips = function () {
            var _a;
            return "$".concat((_a = this.session.dealerTips) !== null && _a !== void 0 ? _a : 0);
        };
        SessionDecorator.prototype.blinds = function () {
            return "".concat(this.session.smallBlind, "/").concat(this.session.bigBlind);
        };
        SessionDecorator.prototype.maxBuyin = function () {
            return "$".concat(this.session.maxBuyin, " max");
        };
        SessionDecorator.prototype.title = function () {
            return [
                this.session.casinoName,
                this.blinds(),
                this.maxBuyin(),
            ].join(' ');
        };
        SessionDecorator.prototype.startTime = function () {
            return this.session.startTime.toLocaleString();
        };
        SessionDecorator.prototype.profit = function () {
            var _a;
            var cashoutAmount = (_a = this.session.cashoutAmount) !== null && _a !== void 0 ? _a : 0;
            return (cashoutAmount - this.session.buyinsTotal()).toString();
        };
        SessionDecorator.prototype.timeElapsed = function () {
            return Utils.timeSince(this.session.startTime);
        };
        return SessionDecorator;
    }());
    var Session = /** @class */ (function () {
        function Session(casinoName, smallBlind, bigBlind, maxBuyin, maxPlayers) {
            this.startTime = null;
            this.endTime = null;
            this.uuid = Utils.uuid();
            this.casinoName = casinoName;
            this.smallBlind = smallBlind;
            this.bigBlind = bigBlind;
            this.maxBuyin = maxBuyin;
            this.maxPlayers = maxPlayers;
            this.dealerTips = 0;
            this.drinkTips = 0;
            this.buyins = [];
        }
        Session.load = function (attributesString) {
            var attributes = JSON.parse(attributesString);
            var session = new this(attributes.casinoName, attributes.smallBlind, attributes.bigBlind, attributes.maxBuyin, attributes.maxPlayers);
            session.uuid = attributes.uuid;
            if (attributes.startTime) {
                session.startTime = new Date(attributes.startTime);
            }
            if (attributes.endTime) {
                session.endTime = new Date(attributes.endTime);
            }
            session.cashoutAmount = attributes.cashoutAmount;
            session.drinkTips = attributes.drinkTips;
            session.dealerTips = attributes.dealerTips;
            session.buyins = attributes.buyins.map(function (buyin) { return ({
                amount: buyin.amount,
                time: new Date(buyin.time)
            }); });
            return session;
        };
        Session.prototype.start = function () {
            if (this.startTime) {
                throw new Error('Session already started');
            }
            if (this.endTime) {
                throw new Error('Session already ended');
            }
            this.startTime = new Date();
            this.buyins.push({ amount: this.maxBuyin, time: this.startTime });
        };
        Session.prototype.rebuy = function (amount) {
            this.buyins.push({ amount: amount, time: new Date() });
        };
        Session.prototype.end = function (cashoutAmount) {
            this.cashoutAmount = cashoutAmount;
            this.endTime = new Date();
        };
        Session.prototype.save = function () {
            window.localStorage.setItem(Utils.localStorageSessionKey(this.uuid), JSON.stringify(this.attributes()));
        };
        Session.prototype.buyinsTotal = function () {
            return this.buyins.reduce(function (prev, current) { return (prev + current.amount); }, 0);
        };
        Session.prototype.attributes = function () {
            var _a, _b;
            return {
                uuid: this.uuid,
                startTime: (_a = this.startTime) === null || _a === void 0 ? void 0 : _a.toISOString(),
                endTime: (_b = this.endTime) === null || _b === void 0 ? void 0 : _b.toISOString(),
                casinoName: this.casinoName,
                smallBlind: this.smallBlind,
                bigBlind: this.bigBlind,
                maxBuyin: this.maxBuyin,
                maxPlayers: this.maxPlayers,
                cashoutAmount: this.cashoutAmount,
                drinkTips: this.drinkTips,
                dealerTips: this.dealerTips,
                buyins: this.buyins.map(function (rebuy) { return ({
                    amount: rebuy.amount,
                    time: rebuy.time.toISOString()
                }); })
            };
        };
        return Session;
    }());
    var locationToSessionId = function () {
        var sessionPath = window.location.hash.match(/#\/sessions\/(.+)/);
        if (sessionPath) {
            return sessionPath[1];
        }
    };
    var sessionIdToScreen = function (sessionId) {
        if (!sessionId) {
            return Screens.Intro;
        }
        if (sessionId === 'new') {
            return Screens.NewSession;
        }
        return Screens.ShowSession;
    };
    var sessionIdToCurrentSession = function (sessionId) {
        if (!sessionId) {
            return null;
        }
        var item = window.localStorage.getItem(Utils.localStorageSessionKey(sessionId));
        if (!item) {
            return null;
        }
        return Session.load(item);
    };
    var getEnvironment = function () {
        if (window.location.hostname === 'localhost') {
            return Environments.Development;
        }
        else {
            return Environments.Production;
        }
    };
    var initAppState = function () {
        var sessionId = locationToSessionId();
        return {
            screen: sessionIdToScreen(sessionId),
            currentSession: sessionIdToCurrentSession(sessionId),
            newSessionMaxPlayers: '8',
            isSavingSession: false
        };
    };
    var renderNewSessionScreen = function (state) {
        // Update new session screen data.
        if (state.newSessionCasinoName) {
            document.getElementById('casino-name-input').value = state.newSessionCasinoName;
        }
        if (state.newSessionSmallBlind) {
            document.getElementById('small-blind-input').value = state.newSessionSmallBlind;
        }
        if (state.newSessionBigBlind) {
            document.getElementById('big-blind-input').value = state.newSessionBigBlind;
        }
        if (state.newSessionMaxBuyin) {
            document.getElementById('max-buyin-input').value = state.newSessionMaxBuyin;
        }
        if (state.newSessionMaxPlayers) {
            document.getElementById('max-players-input').value = state.newSessionMaxPlayers;
        }
    };
    var renderShowSessionScreen = function (state) {
        var session = new SessionDecorator(state.currentSession);
        document.getElementById('rebuy-amount-input').setAttribute('max', state.currentSession.maxBuyin.toString());
        document.getElementById('session-title').innerText = session.title();
        document.getElementById('session-profit').innerText = session.profit();
        document.getElementById('session-start-time').innerText = session.startTime();
        document.getElementById('session-time-elapsed').innerText = session.timeElapsed();
        document.getElementById('session-dealer-tips-display').innerText = session.dealerTips();
        document.getElementById('session-drink-tips-display').innerText = session.drinkTips();
        if (appState.isSavingSession) {
            document.getElementById('end-session-submit-button').setAttribute('disabled', 'disabled');
        }
        else {
            document.getElementById('end-session-submit-button').removeAttribute('disabled');
        }
    };
    var render = function (state) {
        // Update visible screen.
        document.querySelectorAll('.screen').forEach(function (node) { return node.classList.add('hidden'); });
        var activeScreenNode = document.getElementById("".concat(state.screen, "-screen"));
        activeScreenNode.classList.remove('hidden');
        switch (appState.screen) {
            case Screens.NewSession:
                return renderNewSessionScreen(state);
            case Screens.ShowSession:
                return renderShowSessionScreen(state);
        }
    };
    var navigateToIntroScreen = function () {
        window.history.pushState({}, '', '#');
        appState.screen = Screens.Intro;
        render(appState);
    };
    var navigateToNewSessionScreen = function () {
        window.history.pushState({}, '', '#/sessions/new');
        appState.screen = Screens.NewSession;
        render(appState);
    };
    var navigateToShowSessionScreen = function (session) {
        window.history.pushState({}, '', "#/sessions/".concat(session.uuid));
        appState.currentSession = session;
        appState.screen = Screens.ShowSession;
        render(appState);
    };
    var updateDealerTip = function (session, change) {
        if (change === -1 && session.dealerTips === 0) {
            return;
        }
        session.dealerTips += change;
        session.save();
        render(appState);
    };
    var updateDrinkTip = function (session, change) {
        if (change === -1 && session.drinkTips === 0) {
            return;
        }
        session.drinkTips += change;
        session.save();
        render(appState);
    };
    var rebuy = function (session) {
        session.rebuy(parseFloat(appState.currentSessionRebuyAmount));
        render(appState);
    };
    var createSession = function () {
        var session = new Session(appState.newSessionCasinoName, parseInt(appState.newSessionSmallBlind), parseInt(appState.newSessionBigBlind), parseInt(appState.newSessionMaxBuyin), parseInt(appState.newSessionMaxPlayers));
        session.start();
        session.save();
        navigateToShowSessionScreen(session);
    };
    var saveToGoogleSheet = function (session) { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session.end(parseFloat(appState.currentSessionCashoutAmount));
                    session.save();
                    appState.isSavingSession = true;
                    render(appState);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, apiService.saveSession(session, appState.currentSessionAdminPassword)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    appState.isSavingSession = false;
                    render(appState);
                    return [7 /*endfinally*/];
                case 4:
                    if (response.ok) {
                        alert('Success!');
                        navigateToIntroScreen();
                    }
                    else {
                        alert('Something went wrong.');
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var prefillBlinds = function (smallBlind, bigBlind) {
        appState.newSessionSmallBlind = smallBlind;
        appState.newSessionBigBlind = bigBlind;
        render(appState);
    };
    var prefillMaxBuyin = function (maxBuyin) {
        appState.newSessionMaxBuyin = maxBuyin;
        render(appState);
    };
    var handleClick = function (event) {
        if (!Utils.objectIsHtmlElement(event.target)) {
            return;
        }
        switch (event.target.id) {
            case 'new-session-button':
                return navigateToNewSessionScreen();
            case 'decrement-dealer-tip-button':
                return updateDealerTip(appState.currentSession, -1);
            case 'increment-dealer-tip-button':
                return updateDealerTip(appState.currentSession, 1);
            case 'decrement-drink-tip-button':
                return updateDrinkTip(appState.currentSession, -1);
            case 'increment-drink-tip-button':
                return updateDrinkTip(appState.currentSession, 1);
        }
        if (event.target.classList.contains('prefill-blinds')) {
            prefillBlinds(event.target.dataset.smallBlind, event.target.dataset.bigBlind);
            prefillMaxBuyin((parseInt(event.target.dataset.bigBlind) * 100).toString());
            return;
        }
    };
    var handleSubmit = function (event) {
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
    var handleInput = function (event) {
        if (!Utils.objectIsHtmlInputElement(event.target)) {
            return;
        }
        var idToStateKey = {
            'casino-name-input': 'newSessionCasinoName',
            'small-blind-input': 'newSessionSmallBlind',
            'big-blind-input': 'newSessionBigBlind',
            'max-buyin-input': 'newSessionMaxBuyin',
            'max-players-input': 'newSessionMaxPlayers',
            'rebuy-amount-input': 'currentSessionRebuyAmount',
            'cashout-amount-input': 'currentSessionCashoutAmount',
            'admin-password-input': 'currentSessionAdminPassword'
        };
        var appStateKey = idToStateKey[event.target.id];
        if (!appStateKey) {
            return;
        }
        appState[appStateKey] = event.target.value;
    };
    var __prefillNewSessionScreen = function () {
        appState.newSessionCasinoName = 'Bellagio';
        appState.newSessionSmallBlind = '2';
        appState.newSessionBigBlind = '5';
        appState.newSessionMaxBuyin = '500';
        appState.newSessionMaxPlayers = '8';
        render(appState);
    };
    var environment = getEnvironment();
    var apiService = new ApiService();
    var appState = initAppState();
    // @ts-ignore
    window.__prefillNewSessionScreen = __prefillNewSessionScreen;
    document.body.addEventListener('click', handleClick);
    document.body.addEventListener('submit', handleSubmit);
    document.body.addEventListener('input', handleInput);
    render(appState);
})();
