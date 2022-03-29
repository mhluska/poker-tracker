// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"8wcER":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "5c1b77e3b71e74eb";
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {};
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                var oldDeps = modules[asset.id][1];
                for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    var id = oldDeps[dep];
                    var parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    var modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        var deps = modules[id1][1];
        var orphans = [];
        for(var dep in deps){
            var parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach(function(id) {
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    var parents = getParents(module.bundle.root, id);
    var accepted = false;
    while(parents.length > 0){
        var v = parents.shift();
        var a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            var p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push.apply(parents, _toConsumableArray(p));
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"h7u1C":[function(require,module,exports) {
var _utils = require("./utils");
const LOCAL_STORAGE_KEY = 'pokerTracker';
const SAVE_APP_STATE_INTERVAL_MS = 10000;
const ELEMENT_NODE_TYPE = 1;
const TEXT_NODE_TYPE = 3;
const ELEMENT_PROPERTIES = new Set([
    'value',
    'className'
]);
let Environments;
(function(Environments1) {
    Environments1["Development"] = 'development';
    Environments1["Production"] = 'production';
})(Environments || (Environments = {}));
let Screen;
(function(Screen1) {
    Screen1["Intro"] = 'intro';
    Screen1["NewSession"] = 'new-session';
    Screen1["ShowSession"] = 'show-session';
})(Screen || (Screen = {}));
class Selectors {
    constructor(appState1){
        this.appState = appState1;
    }
    get currentSession() {
        if (this.appState.currentSessionId && this._cachedCurrentSessionId !== this.appState.currentSessionId) {
            this._cachedCurrentSessionId = this.appState.currentSessionId;
            this._cachedCurrentSession = new Session(this.appState.currentSessionId);
        }
        return this._cachedCurrentSession;
    }
}
class ApiService {
    origin() {
        if (environment === Environments.Development) return 'http://localhost:3000';
        else return 'https://blackjack-trainer-api.herokuapp.com';
    }
    request(path, body, requestOptions) {
        const url = `${this.origin()}/api/v1${path}`;
        return window.fetch(url, {
            method: requestOptions.method,
            headers: {
                ...requestOptions.headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }
    post(path, body, requestOptions) {
        return this.request(path, body, {
            method: 'POST',
            ...requestOptions
        });
    }
    saveSession(session, adminPassword) {
        return this.post('/poker_sessions', {
            data: {
                type: 'poker_session',
                attributes: session.attributes
            }
        }, {
            headers: {
                'Poker-Sessions-Admin-Password': adminPassword
            }
        });
    }
}
class SessionDecorator {
    constructor(session){
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
        if (!this.session.startTime) return '';
        return _utils.formatDuration(Date.now() - this.session.startTime.getTime());
    }
}
class Session {
    static create(casinoName, smallBlind, bigBlind, maxBuyin, maxPlayers) {
        const id = _utils.uuid();
        appState.sessions[id] = {
            id: _utils.uuid(),
            casinoName,
            smallBlind,
            bigBlind,
            maxBuyin,
            maxPlayers,
            cashoutAmount: 0,
            dealerTips: 0,
            drinkTips: 0,
            buyins: []
        };
        return new this(id);
    }
    constructor(id){
        this.id = id;
        if (!this.attributes) throw new Error(`Session ${id} does not exist`);
    }
    get attributes() {
        return appState.sessions[this.id];
    }
    get startTime() {
        return this.attributes.startTime ? new Date(this.attributes.startTime) : null;
    }
    get endTime() {
        return this.attributes.endTime ? new Date(this.attributes.endTime) : null;
    }
    start() {
        if (this.startTime) throw new Error('Session already started');
        if (this.endTime) throw new Error('Session already ended');
        this.attributes.startTime = new Date().toISOString();
        this.attributes.buyins.push({
            amount: this.attributes.maxBuyin,
            time: this.attributes.startTime
        });
    }
    rebuy(amount) {
        this.attributes.buyins.push({
            amount,
            time: new Date().toISOString()
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
        return this.attributes.buyins.reduce((prev, current)=>prev + current.amount
        , 0);
    }
    updateTip(type, change) {
        if (this.attributes[type] + change < 0) return;
        this.attributes[type] += change;
    }
    updateDealerTip(change) {
        this.updateTip('dealerTips', change);
    }
    updateDrinkTip(change) {
        this.updateTip('drinkTips', change);
    }
}
const locationToSessionId = ()=>{
    const sessionPath = window.location.hash.match(/#\/sessions\/(.+)/);
    if (sessionPath) return sessionPath[1];
};
const sessionIdToScreen = (sessionId)=>{
    if (!sessionId) return Screen.Intro;
    if (sessionId === 'new') return Screen.NewSession;
    return Screen.ShowSession;
};
const getEnvironment = ()=>{
    if (window.location.hostname === 'localhost') return Environments.Development;
    else return Environments.Production;
};
const saveAppState = ()=>{
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        sessions: appState.sessions,
        // This is not very secure but I'm the only user of this hacky app.
        // Long-term we would want JWT.
        cachedAdminPassword: appState.cachedAdminPassword
    }));
};
const loadAppState = ()=>{
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
            isSavingSession: false
        },
        newSessionScreen: {
            casinoName: '',
            smallBlind: '',
            bigBlind: '',
            maxBuyin: '',
            maxPlayers: '8'
        },
        ...state
    };
};
// See https://github.com/microsoft/TypeScript/pull/12253#issuecomment-353494273
const keys = Object.keys;
const isNativeElementType = (type)=>!_utils.isCapitalized(type)
;
const createVirtualElement = (type, props = null, ...children)=>({
        type,
        tagName: isNativeElementType(type) ? type : props?.tagName,
        props: props || {},
        children
    })
;
const createDomNode = (virtualNode)=>{
    if (typeof virtualNode === 'string') return document.createTextNode(virtualNode);
    const { tagName , props , children  } = virtualNode;
    const element = document.createElement(tagName);
    if (props) for (const name of keys(props)){
        if (name === 'tagName') continue;
        const value = props[name];
        if (ELEMENT_PROPERTIES.has(name)) // TODO: Figure out why an error related to readonly properties is
        // happening despite using `Writeable`.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element[name] = value;
        else {
            if (typeof value === 'boolean' && value === false) continue;
            element.setAttribute(name, String(value));
        }
    }
    for (const child of children){
        const childDomElement = createDomNode(child);
        if (!childDomElement) continue;
        element.appendChild(childDomElement);
    }
    return element;
};
const e = createVirtualElement;
const NumberInput = ({ id , placeholder , value , min =1 , max  })=>e('NumberInput', {
        tagName: 'input',
        id,
        type: 'number',
        placeholder,
        pattern: '\\d*',
        value,
        min,
        max,
        required: 'required'
    })
;
const BlindsButton = ({ smallBlind , bigBlind  })=>e('BlindsButton', {
        tagName: 'button',
        type: 'button',
        className: 'prefill-blinds',
        'data-small-blind': smallBlind,
        'data-big-blind': bigBlind
    }, `${smallBlind}/${bigBlind}`)
;
const TipsSection = ({ type , value  })=>e('TipsSection', {
        tagName: 'div',
        className: 'section'
    }, e('span', null, `${_utils.capitalize(type)} tips: ${value}`), e('div', null, e('button', {
        className: 'tip-button',
        id: `decrement-${type}-tip-button`
    }, '-'), e('button', {
        className: 'tip-button',
        id: `increment-${type}-tip-button`
    }, '+')))
;
const IntroScreen = ()=>{
    return e('IntroScreen', {
        tagName: 'div',
        id: 'intro-screen',
        className: 'screen'
    }, e('button', {
        id: 'new-session-button'
    }, 'Start Session'));
};
const NewSessionScreen = ()=>{
    return e('NewSessionScreen', {
        tagName: 'div',
        id: 'new-session-screen',
        className: 'screen'
    }, e('form', {
        id: 'new-session-form'
    }, e('div', null, e('label', null, e('span', null, 'Casino Name'), e('input', {
        id: 'casino-name-input',
        type: 'text',
        placeholder: 'Bellagio',
        required: 'required',
        value: appState.newSessionScreen.casinoName
    }))), e('div', null, e('label', null, e('span', null, 'Blinds'), NumberInput({
        id: 'small-blind-input',
        placeholder: '2',
        value: appState.newSessionScreen.smallBlind,
        max: 100
    }), NumberInput({
        id: 'big-blind-input',
        placeholder: '5',
        value: appState.newSessionScreen.bigBlind,
        max: 200
    })), BlindsButton({
        smallBlind: 1,
        bigBlind: 2
    }), BlindsButton({
        smallBlind: 1,
        bigBlind: 3
    }), BlindsButton({
        smallBlind: 2,
        bigBlind: 5
    }), BlindsButton({
        smallBlind: 5,
        bigBlind: 10
    })), e('div', null, e('label', null, e('span', null, 'Max Buyin'), NumberInput({
        id: 'max-buyin-input',
        placeholder: '500',
        value: appState.newSessionScreen.maxBuyin
    }))), e('div', null, e('label', null, e('span', null, 'Max Players'), NumberInput({
        id: 'max-players-input',
        placeholder: '8',
        max: 10,
        value: appState.newSessionScreen.maxPlayers
    }))), e('div', null, e('input', {
        type: 'submit',
        value: 'Start Session'
    }))));
};
const ShowSessionScreen = ()=>{
    if (!selectors.currentSession) return '';
    const session = new SessionDecorator(selectors.currentSession);
    return e('ShowSessionScreen', {
        tagName: 'div',
        id: 'show-session-screen',
        className: 'screen'
    }, e('h1', {
        id: 'session-title'
    }, session.title()), e('div', null, e('span', null, `Profit: $${session.profit()}`)), e('div', null, e('span', null, `Start time: $${session.startTime()}`)), e('div', null, e('span', null, `Time elapsed: ${session.timeElapsed()}`)), e('form', {
        id: 'rebuy-form',
        className: 'section'
    }, NumberInput({
        id: 'rebuy-amount-input',
        placeholder: selectors.currentSession.attributes.maxBuyin.toString(),
        max: selectors.currentSession.attributes.maxBuyin,
        value: appState.showSessionScreen.rebuyAmount
    }), e('input', {
        type: 'submit',
        value: 'Rebuy'
    }), e('input', {
        id: 'rebuy-max-button',
        type: 'button',
        value: 'Max'
    })), TipsSection({
        type: 'dealer',
        value: session.dealerTips()
    }), TipsSection({
        type: 'drink',
        value: session.drinkTips()
    }), e('form', {
        id: 'end-session-form',
        className: 'section'
    }, e('input', {
        className: 'hidden',
        type: 'text',
        autocomplete: 'username'
    }), e('div', null, e('label', null, e('span', null, 'Cashout Amount'), NumberInput({
        min: 0,
        id: 'cashout-amount-input',
        placeholder: (selectors.currentSession.attributes.maxBuyin * 3).toString()
    }))), appState.cachedAdminPassword ? '' : e('div', {
        id: 'admin-password-area'
    }, e('label', null, e('span', null, 'Password')), e('input', {
        id: 'admin-password-input',
        type: 'password',
        autocomplete: 'current-password',
        required: 'required'
    })), e('input', {
        id: 'end-session-submit-button',
        type: 'submit',
        value: 'End Session',
        disabled: appState.showSessionScreen.isSavingSession
    })));
};
const renderScreen = ()=>{
    switch(appState.screen){
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
const reconcileProps = (domNode, prevNode, newNode)=>{
    for (const name of keys(newNode.props)){
        // HACK: With properties, our crappy virtal DOM can get out of sync after
        // user input so we just always write.
        if (ELEMENT_PROPERTIES.has(name) && newNode.props[name] !== undefined) // TODO: Fix type `Element` being too generic here.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        domNode[name] = newNode.props[name];
        else if (newNode.props[name] !== prevNode.props[name]) {
            if (typeof newNode.props[name] === 'boolean') {
                if (newNode.props[name]) domNode.setAttribute(name, name);
                else domNode.removeAttribute(name);
            } else domNode.setAttribute(name, String(newNode.props[name]));
        }
    }
    for (const name1 of keys(prevNode.props))if (newNode.props[name1] === undefined) {
        if (ELEMENT_PROPERTIES.has(name1)) // TODO: Fix type `Element` being too generic here.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        domNode[name1] = '';
        else domNode.removeAttribute(name1);
    }
};
const elementType = (element)=>{
    return typeof element === 'string' ? 'string' : element.type;
};
const reconcile = (domNode, prevNode, newNode, parentElement)=>{
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
        if (typeof newNode === 'string') return;
        reconcileProps(domNode, prevNode, newNode);
        newNode.children.forEach((newNodeChild, index)=>{
            reconcile(Array.from(domNode.childNodes).filter((node)=>node.nodeType === ELEMENT_NODE_TYPE || node.nodeType === TEXT_NODE_TYPE
            )[index], prevNode.children[index], newNodeChild, domNode);
        });
    } else if (newNode) domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
    else if (prevNode) domNode.remove();
};
let prevVirtualNode = e('div');
const render = ()=>{
    if (!appRoot) throw new Error('appRoot is not set');
    if (!appRoot.parentElement) throw new Error('appRoot not attached to DOM');
    const virtualNode = e('div', null, renderScreen());
    reconcile(appRoot, prevVirtualNode, virtualNode, appRoot.parentElement);
    prevVirtualNode = virtualNode;
};
const navigateToIntroScreen = ()=>{
    window.history.pushState({}, '', '#');
    appState.screen = Screen.Intro;
};
const navigateToNewSessionScreen = ()=>{
    window.history.pushState({}, '', '#/sessions/new');
    appState.screen = Screen.NewSession;
};
const navigateToShowSessionScreen = (session)=>{
    window.history.pushState({}, '', `#/sessions/${session.id}`);
    appState.currentSessionId = session.id;
    appState.screen = Screen.ShowSession;
};
const rebuy = ()=>{
    if (!selectors.currentSession) return;
    selectors.currentSession.rebuy(parseFloat(appState.showSessionScreen.rebuyAmount));
    appState.showSessionScreen.rebuyAmount = '';
};
const createSession = ()=>{
    const session = Session.create(appState.newSessionScreen.casinoName, parseInt(appState.newSessionScreen.smallBlind), parseInt(appState.newSessionScreen.bigBlind), parseInt(appState.newSessionScreen.maxBuyin), parseInt(appState.newSessionScreen.maxPlayers));
    session.start();
    navigateToShowSessionScreen(session);
};
const saveToGoogleSheet = async ()=>{
    if (!selectors.currentSession) return;
    selectors.currentSession.end(parseFloat(appState.showSessionScreen.cashoutAmount));
    appState.showSessionScreen.isSavingSession = true;
    render();
    let response;
    try {
        response = await apiService.saveSession(selectors.currentSession, appState.cachedAdminPassword ?? appState.showSessionScreen.adminPassword);
    } finally{
        appState.showSessionScreen.isSavingSession = false;
        render();
    }
    if (response.ok) {
        if (!appState.cachedAdminPassword) appState.cachedAdminPassword = appState.showSessionScreen.adminPassword;
        alert('Success!');
        navigateToIntroScreen();
    } else {
        alert('Something went wrong.');
        // TODO: Use changesets so we don't have to do this.
        selectors.currentSession.undoEnd();
    }
};
const prefillBlinds = (smallBlind, bigBlind)=>{
    appState.newSessionScreen.smallBlind = smallBlind;
    appState.newSessionScreen.bigBlind = bigBlind;
};
const prefillMaxBuyin = (maxBuyin)=>{
    appState.newSessionScreen.maxBuyin = maxBuyin;
};
const handleClick = (event)=>{
    if (!_utils.objectIsHtmlElement(event.target)) return false;
    switch(event.target.id){
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
    if (event.target.classList.contains('prefill-blinds') && event.target.dataset.smallBlind && event.target.dataset.bigBlind) {
        prefillBlinds(event.target.dataset.smallBlind, event.target.dataset.bigBlind);
        prefillMaxBuyin((parseInt(event.target.dataset.bigBlind) * 100).toString());
        return true;
    }
    return false;
};
const handleAppClick = (event)=>{
    if (handleClick(event)) render();
};
const handleSubmit = async (event)=>{
    if (!_utils.objectIsHtmlElement(event.target)) return false;
    event.preventDefault();
    switch(event.target.id){
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
const handleAppSubmit = async (event)=>{
    if (await handleSubmit(event)) render();
};
const handleInput = (event)=>{
    if (!_utils.objectIsHtmlInputElement(event.target)) return false;
    const idToStateKey = (id)=>{
        switch(id){
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
    if (!key) return false;
    return _utils.objectSet(appState, key, event.target.value);
};
const handleAppInput = (event)=>{
    if (handleInput(event)) render();
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

},{"./utils":"dsXzW"}],"dsXzW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "uuid", ()=>uuid
);
parcelHelpers.export(exports, "objectIsHtmlElement", ()=>objectIsHtmlElement
);
parcelHelpers.export(exports, "objectIsHtmlInputElement", ()=>objectIsHtmlInputElement
);
parcelHelpers.export(exports, "formatDuration", ()=>formatDuration
);
parcelHelpers.export(exports, "isPlainObject", ()=>isPlainObject
);
parcelHelpers.export(exports, "objectSet", ()=>objectSet
);
parcelHelpers.export(exports, "capitalize", ()=>capitalize
);
parcelHelpers.export(exports, "isCapitalized", ()=>isCapitalized
);
const uuid = ()=>Date.now().toString(36) + Math.random().toString(36).substring(2)
;
const objectIsHtmlElement = (object)=>!!object.tagName
;
const objectIsHtmlInputElement = (object)=>!!object.type
;
const formatDuration = (ms)=>{
    let seconds = ms / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = Math.round(seconds - hours * 3600 - minutes * 60);
    const hoursFormatted = hours < 10 ? `0${hours}` : hours.toString();
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes.toString();
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds.toString();
    return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
};
const isPlainObject = (object)=>typeof object === 'object' && !Array.isArray(object)
;
const objectSet = (object, key, value)=>{
    if (!key) return;
    const subKeys = key.split('.');
    const lastKey = subKeys.pop();
    if (!lastKey) return;
    for (const key1 of subKeys){
        const next = object[key1];
        if (!isPlainObject(next)) return;
        object = next;
    }
    object[lastKey] = value;
};
const capitalize = (str)=>`${str[0].toUpperCase()}${str.slice(1)}`
;
const isCapitalized = (str)=>str[0].toUpperCase() === str[0]
;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["8wcER","h7u1C"], "h7u1C", "parcelRequirefb1b")

//# sourceMappingURL=index.b71e74eb.js.map
