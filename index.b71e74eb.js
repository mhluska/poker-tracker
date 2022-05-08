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
var _components = require("./components");
var _renderer = require("./lib/renderer");
var _state = require("./state");
var _types = require("./types");
var _services = require("./services");
var _models = require("./models");
var _selectors = require("./selectors");
const SAVE_APP_STATE_INTERVAL_MS = 10000;
const navigateToIntroScreen = ()=>{
    window.history.pushState({}, '', '#');
    _state.state.app.screen = _types.Screen.Intro;
};
const navigateToNewSessionScreen = ()=>{
    window.history.pushState({}, '', '#/sessions/new');
    _state.state.app.screen = _types.Screen.NewSession;
};
const navigateToShowSessionScreen = (session)=>{
    window.history.pushState({}, '', `#/sessions/${session.id}`);
    _state.state.app.currentSessionId = session.id;
    _state.state.app.screen = _types.Screen.ShowSession;
};
const rebuy = ()=>{
    if (!_selectors.appSelectors.currentSession) return;
    _selectors.appSelectors.currentSession.rebuy(parseFloat(_state.state.app.showSessionScreen.rebuyAmount));
    _state.state.app.showSessionScreen.rebuyAmount = '';
};
const createSession = ()=>{
    const session = _models.Session.create(_state.state.app.newSessionScreen.casinoName, parseInt(_state.state.app.newSessionScreen.smallBlind), parseInt(_state.state.app.newSessionScreen.bigBlind), parseInt(_state.state.app.newSessionScreen.maxBuyin));
    session.start();
    navigateToShowSessionScreen(session);
};
const saveToGoogleSheet = async ()=>{
    if (!_selectors.appSelectors.currentSession) return;
    _selectors.appSelectors.currentSession.end(parseFloat(_state.state.app.showSessionScreen.cashoutAmount), _state.state.app.showSessionScreen.notes);
    _state.state.app.showSessionScreen.isSavingSession = true;
    let response;
    try {
        response = await apiService.saveSession(_selectors.appSelectors.currentSession, _state.state.app.cachedAdminPassword ?? _state.state.app.showSessionScreen.adminPassword);
    } finally{
        _state.state.app.showSessionScreen.isSavingSession = false;
    }
    if (response.ok) {
        if (!_state.state.app.cachedAdminPassword) _state.state.app.cachedAdminPassword = _state.state.app.showSessionScreen.adminPassword;
        alert('Success!');
        navigateToIntroScreen();
    } else {
        alert('Something went wrong.');
        // TODO: Use changesets so we don't have to do this.
        _selectors.appSelectors.currentSession.undoEnd();
    }
};
const prefillBlinds = (smallBlind, bigBlind)=>{
    _state.state.app.newSessionScreen.smallBlind = smallBlind;
    _state.state.app.newSessionScreen.bigBlind = bigBlind;
};
const prefillMaxBuyin = (maxBuyin)=>{
    _state.state.app.newSessionScreen.maxBuyin = maxBuyin;
};
const handleClick = (event)=>{
    if (!_utils.objectIsHtmlElement(event.target)) return;
    switch(event.target.id){
        case 'new-session-button':
            navigateToNewSessionScreen();
            return;
        case 'decrement-dealer-tip-button':
            _selectors.appSelectors.currentSession?.updateDealerTip(-1);
            return;
        case 'increment-dealer-tip-button':
            _selectors.appSelectors.currentSession?.updateDealerTip(1);
            return;
        case 'decrement-drink-tip-button':
            _selectors.appSelectors.currentSession?.updateDrinkTip(-1);
            return;
        case 'increment-drink-tip-button':
            _selectors.appSelectors.currentSession?.updateDrinkTip(1);
            return;
        case 'rebuy-max-button':
            _selectors.appSelectors.currentSession?.rebuyMax();
            return;
    }
    if (event.target.classList.contains('prefill-blinds') && event.target.dataset.smallBlind && event.target.dataset.bigBlind) {
        prefillBlinds(event.target.dataset.smallBlind, event.target.dataset.bigBlind);
        prefillMaxBuyin((parseInt(event.target.dataset.bigBlind) * 100).toString());
    }
};
const handleSubmit = (event)=>{
    if (!_utils.objectIsHtmlElement(event.target)) return;
    event.preventDefault();
    switch(event.target.id){
        case 'new-session-form':
            createSession();
            break;
        case 'rebuy-form':
            rebuy();
            break;
        case 'end-session-form':
            saveToGoogleSheet();
            break;
    }
};
const handleInput = (event)=>{
    if (!_utils.objectIsHtmlInputElement(event.target)) return;
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
            case 'admin-password-input':
                return 'showSessionScreen.adminPassword';
        }
    };
    const key = idToStateKey(event.target.id);
    if (!key) return;
    return _utils.objectSet(_state.state.app, key, event.target.value);
};
const apiService = new _services.Api();
const appRoot = document.getElementById('root');
if (appRoot) {
    _state.setupAppState(()=>_renderer.render(_renderer.e(_components.App), appRoot)
    );
    appRoot.addEventListener('click', handleClick);
    appRoot.addEventListener('submit', handleSubmit);
    appRoot.addEventListener('input', handleInput);
}
// HACK: onbeforeunload doesn't seem to work on iOS so we save periodically.
setInterval(_state.saveToLocalStorage, SAVE_APP_STATE_INTERVAL_MS);
document.addEventListener('visibilitychange', _state.saveToLocalStorage);
window.onbeforeunload = _state.saveToLocalStorage;

},{"./utils":"dsXzW","./types":"38MWl","./services":"f5PO7","./models":"i6QPt","./state":"6GBqf","./selectors":"2OUoq","./components":"dHnah","./lib/renderer":"eg3L3"}],"dsXzW":[function(require,module,exports) {
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
parcelHelpers.export(exports, "toISOString", ()=>toISOString
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
const toISOString = (date)=>{
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = (num)=>(num < 10 ? '0' : '') + num
    ;
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + dif + pad(Math.floor(Math.abs(tzo) / 60)) + ':' + pad(Math.abs(tzo) % 60);
};

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

},{}],"38MWl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Environments", ()=>Environments
);
parcelHelpers.export(exports, "Screen", ()=>Screen
);
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"f5PO7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Api", ()=>_api.Api
);
var _api = require("./api");

},{"./api":"8wVyB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8wVyB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Api", ()=>Api
);
var _types = require("../types");
var _constants = require("../constants");
class Api {
    origin() {
        if (_constants.environment === _types.Environments.Development) return 'http://localhost:3000';
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../types":"38MWl","../constants":"45DZp"}],"45DZp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "environment", ()=>environment
);
var _types = require("./types");
const getEnvironment = ()=>{
    if (window.location.hostname === 'localhost') return _types.Environments.Development;
    else return _types.Environments.Production;
};
const environment = getEnvironment();

},{"./types":"38MWl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"i6QPt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Session", ()=>_session.Session
);
var _session = require("./session");

},{"./session":"6Afiv","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6Afiv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Session", ()=>Session
);
var _utils = require("../utils");
var _state = require("../state");
class Session {
    static create(casinoName, smallBlind, bigBlind, maxBuyin) {
        const id = _utils.uuid();
        _state.state.app.sessions[id] = {
            id: _utils.uuid(),
            casinoName,
            smallBlind,
            bigBlind,
            maxBuyin,
            notes: '',
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
        return _state.state.app.sessions[this.id];
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
        this.attributes.startTime = _utils.toISOString(new Date());
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
    end(cashoutAmount, notes) {
        this.attributes.cashoutAmount = cashoutAmount;
        this.attributes.endTime = _utils.toISOString(new Date());
        this.attributes.notes = notes;
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

},{"../utils":"dsXzW","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../state":"6GBqf"}],"6GBqf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "state", ()=>_app.state
);
parcelHelpers.export(exports, "AppState", ()=>_app.AppState
);
parcelHelpers.export(exports, "saveToLocalStorage", ()=>_app.saveToLocalStorage
);
parcelHelpers.export(exports, "setupAppState", ()=>_app.setupAppState
);
var _app = require("./app");

},{"./app":"9NCOh","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9NCOh":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "state", ()=>state
);
parcelHelpers.export(exports, "setupAppState", ()=>setupAppState
);
parcelHelpers.export(exports, "saveToLocalStorage", ()=>saveToLocalStorage
);
var _types = require("../types");
const LOCAL_STORAGE_KEY = 'pokerTracker';
const locationToSessionId = ()=>{
    const sessionPath = window.location.hash.match(/#\/sessions\/(.+)/);
    if (sessionPath) return sessionPath[1];
};
const sessionIdToScreen = (sessionId)=>{
    if (!sessionId) return _types.Screen.Intro;
    if (sessionId === 'new') return _types.Screen.NewSession;
    return _types.Screen.ShowSession;
};
const loadAppState = ()=>{
    const stateItem = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const state1 = stateItem ? JSON.parse(stateItem) : {};
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
            isSavingSession: false
        },
        newSessionScreen: {
            casinoName: '',
            smallBlind: '',
            bigBlind: '',
            maxBuyin: ''
        },
        ...state1
    };
};
const state = {
    app: loadAppState()
};
const setupAppState = (onStateChange)=>{
    state.app = new Proxy(state.app, {
        get (target, key, receiver) {
            if (!Reflect.has(target, key)) return;
            const value = Reflect.get(target, key, receiver);
            if (typeof value === 'object' && value !== null) return new Proxy(value, this);
            else return value;
        },
        set (target, key, value, receiver) {
            const success = Reflect.set(target, key, value, receiver);
            if (success) onStateChange();
            return success;
        }
    });
    onStateChange();
};
const saveToLocalStorage = ()=>{
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        sessions: state.app.sessions,
        // This is not very secure but I'm the only user of this hacky app.
        // Long-term we would want JWT.
        cachedAdminPassword: state.app.cachedAdminPassword
    }));
};

},{"../types":"38MWl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2OUoq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "appSelectors", ()=>_app.selectors
);
var _app = require("./app");

},{"./app":"5T4lc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5T4lc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "selectors", ()=>selectors
);
var _models = require("../models");
var _state = require("../state");
// TODO: Add automatic caching.
class Selectors {
    constructor(appState){
        this.appState = appState;
    }
    get currentSession() {
        if (this.appState.currentSessionId && this._cachedCurrentSessionId !== this.appState.currentSessionId) {
            this._cachedCurrentSessionId = this.appState.currentSessionId;
            this._cachedCurrentSession = new _models.Session(this.appState.currentSessionId);
        }
        return this._cachedCurrentSession;
    }
    // TODO: Get this using a frecency algorithm.
    get mostFrequentCasinoName() {
        if (this._cachedMostFrequentCasinoName) return this._cachedMostFrequentCasinoName;
        const casinoName = Object.values(this.appState.sessions).sort((a, b)=>a.endTime && b.endTime ? Date.parse(b.endTime) - Date.parse(a.endTime) : 1
        )[0]?.casinoName;
        if (casinoName) this._cachedMostFrequentCasinoName = casinoName;
        return casinoName;
    }
}
const selectors = new Selectors(_state.state.app);

},{"../models":"i6QPt","../state":"6GBqf","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dHnah":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "App", ()=>_app.App
);
parcelHelpers.export(exports, "BlindsButton", ()=>_blindsButton.BlindsButton
);
parcelHelpers.export(exports, "IntroScreen", ()=>_introScreen.IntroScreen
);
parcelHelpers.export(exports, "NewSessionScreen", ()=>_newSessionScreen.NewSessionScreen
);
parcelHelpers.export(exports, "NumberInput", ()=>_numberInput.NumberInput
);
parcelHelpers.export(exports, "ShowSessionScreen", ()=>_showSessionScreen.ShowSessionScreen
);
parcelHelpers.export(exports, "TipsSection", ()=>_tipsSection.TipsSection
);
parcelHelpers.export(exports, "SuggestedCasino", ()=>_suggestedCasino.SuggestedCasino
);
parcelHelpers.export(exports, "Timer", ()=>_timer.Timer
);
var _app = require("./App");
var _blindsButton = require("./BlindsButton");
var _introScreen = require("./IntroScreen");
var _newSessionScreen = require("./NewSessionScreen");
var _numberInput = require("./NumberInput");
var _showSessionScreen = require("./ShowSessionScreen");
var _tipsSection = require("./TipsSection");
var _suggestedCasino = require("./SuggestedCasino");
var _timer = require("./Timer");

},{"./BlindsButton":"8hJpf","./IntroScreen":"iudxg","./NewSessionScreen":"iiQGi","./NumberInput":"cCow8","./ShowSessionScreen":"kEhZ6","./TipsSection":"79J6p","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./App":"6aOJQ","./SuggestedCasino":"fQJh5","./Timer":"cVbGh"}],"8hJpf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BlindsButton", ()=>BlindsButton
);
var _renderer = require("../lib/renderer");
const BlindsButton = ({ smallBlind , bigBlind ,  })=>_renderer.e('button', {
        type: 'button',
        className: 'prefill-blinds',
        'data-small-blind': smallBlind,
        'data-big-blind': bigBlind
    }, `${smallBlind}/${bigBlind}`)
;

},{"../lib/renderer":"eg3L3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eg3L3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "render", ()=>_render.render
);
parcelHelpers.export(exports, "createVirtualElement", ()=>_render.createVirtualElement
);
parcelHelpers.export(exports, "e", ()=>_render.e
);
parcelHelpers.export(exports, "useEffect", ()=>_hooks.useEffect
);
parcelHelpers.export(exports, "useState", ()=>_hooks.useState
);
parcelHelpers.export(exports, "FunctionComponent", ()=>_types.FunctionComponent
);
parcelHelpers.export(exports, "FC", ()=>_types.FC
);
var _render = require("./render");
var _hooks = require("./hooks");
var _types = require("./types");

},{"./render":"D5Bps","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./types":"6Zsey","./hooks":"9Cknq"}],"D5Bps":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createVirtualElement", ()=>createVirtualElement
);
parcelHelpers.export(exports, "e", ()=>e
);
parcelHelpers.export(exports, "reconcile", ()=>reconcile
);
parcelHelpers.export(exports, "render", ()=>render
);
var _types = require("./types");
var _utils = require("./utils");
var _hooks = require("./hooks");
let ElementProperties;
(function(ElementProperties1) {
    ElementProperties1["Value"] = 'value';
    ElementProperties1["ClassName"] = 'className';
})(ElementProperties || (ElementProperties = {}));
const ELEMENT_PROPERTIES = new Set(Object.values(ElementProperties));
const EVENT_PROPS = new Map([
    [
        'onInput',
        'input'
    ],
    [
        'onClick',
        'click'
    ], 
]);
const createVirtualStringElement = (value)=>({
        type: 'String',
        value
    })
;
function createVirtualElement(type, props, ...children) {
    return typeof type === 'function' ? {
        type,
        props: props || {},
        result: null
    } : {
        type,
        props: {
            ...props,
            tagName: type || 'div'
        },
        children: children.map((child)=>typeof child === 'string' ? createVirtualStringElement(child) : child
        )
    };
}
const e = createVirtualElement;
const reconcileEventHandlerProps = (domNode, nativeEventName, prevValue, newValue)=>{
    if (prevValue === newValue) return;
    if (prevValue) domNode.removeEventListener(nativeEventName, prevValue);
    if (newValue) domNode.addEventListener(nativeEventName, newValue);
};
const reconcileProps = (domNode, prevNode, newNode)=>{
    if (prevNode?.type === 'String' || newNode?.type === 'String') return;
    const prevPropKeys = prevNode ? _utils.keys(prevNode.props) : [];
    const newPropKeys = newNode ? _utils.keys(newNode.props) : [];
    for (const name of newPropKeys.concat(prevPropKeys)){
        const prevValue = prevNode?.props[name];
        const newValue = newNode?.props[name];
        // HACK: With properties (as opposed to attributes), our crappy virtal DOM
        // can get out of sync after user input so we just always write.
        if (ELEMENT_PROPERTIES.has(name)) {
            // TODO: Fix type `Element` being too generic here.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            domNode[name] = newValue === undefined ? '' : newValue;
            continue;
        }
        if (prevValue === newValue) continue;
        if (name === 'onClick' || name === 'onInput') {
            const nativeEventName = EVENT_PROPS.get(name);
            if (nativeEventName) reconcileEventHandlerProps(domNode, nativeEventName, prevNode?.props[name], newNode?.props[name]);
            continue;
        }
        if (typeof newValue === 'boolean') {
            if (newValue) domNode.setAttribute(name, '');
            else domNode.removeAttribute(name);
        } else if (typeof newValue === 'undefined') domNode.removeAttribute(name);
        else domNode.setAttribute(name, String(newValue));
    }
};
const createDomNode = (virtualElement)=>{
    if (!virtualElement) return null;
    if (virtualElement.type === 'String') return document.createTextNode(virtualElement.value);
    if (_utils.isVirtualFunctionElement(virtualElement)) return createDomNode(_hooks.mountWithHooks(virtualElement, forceRender));
    const { children , type: tagName  } = virtualElement;
    const element = document.createElement(tagName);
    reconcileProps(element, null, virtualElement);
    for (const child of children){
        if (!child) continue;
        const childDomElement = createDomNode(child);
        if (!childDomElement) continue;
        element.appendChild(childDomElement);
    }
    return element;
};
const reconcileStrings = (domNode, prevNode, newNode)=>{
    if (prevNode.value === newNode.value) return;
    if (_utils.isElementNode(domNode)) _utils.replaceNode(domNode, createDomNode(newNode));
    else if (_utils.isTextNode(domNode)) domNode.replaceData(0, domNode.length, newNode.value);
};
const reconcile = (domNode, prevNode, newNode)=>{
    if (!newNode) {
        domNode.remove();
        return;
    }
    if (!prevNode || prevNode.type !== newNode.type) {
        if (prevNode && _utils.isVirtualFunctionElement(prevNode)) // TODO: This should happen recursively for all child nodes being removed.
        _hooks.unmountWithHooks(prevNode);
        _utils.replaceNode(domNode, createDomNode(newNode));
        return;
    }
    // We needlessly have to repeatedly check the type of `prevNode` here even
    // though we ensure that both types are the same above.
    // See https://stackoverflow.com/questions/71397541
    if (prevNode.type === 'String' && newNode.type === 'String') {
        reconcileStrings(domNode, prevNode, newNode);
        return;
    }
    if (_utils.isTextNode(domNode)) {
        _utils.replaceNode(domNode, createDomNode(newNode));
        return;
    }
    if (_utils.isVirtualFunctionElement(prevNode) && _utils.isVirtualFunctionElement(newNode)) {
        reconcile(domNode, prevNode.result, _hooks.mountWithHooks(newNode, forceRender));
        return;
    }
    if (_utils.isVirtualNativeElement(prevNode) && _utils.isVirtualNativeElement(newNode)) {
        reconcileProps(domNode, prevNode, newNode);
        const domNodeChildren = Array.from(domNode.childNodes).filter((node)=>node.nodeType === _types.NodeTypes.Element || node.nodeType === _types.NodeTypes.Text
        );
        newNode.children.forEach((newNodeChild, index)=>{
            const domNodeChild = domNodeChildren[index];
            if (domNodeChild) reconcile(domNodeChild, prevNode.children[index], newNodeChild);
            else if (newNodeChild) {
                const node = createDomNode(newNodeChild);
                if (node) domNode.appendChild(node);
            }
        });
    }
};
let prevVirtualElement = createVirtualElement('div');
let forceRender;
const render = (component, appRoot)=>{
    const virtualElement = createVirtualElement('div', null, component);
    // We cache this for use in `mountWithHooks` (the `useState` hook needs to be
    // able to trigger renders).
    // TODO: Add the ability to do a partial render. We'd need to stop comparing
    // the prev virtual DOM against current and instead just compare the real DOM
    // against the current.
    forceRender = ()=>render(component, appRoot)
    ;
    reconcile(appRoot, prevVirtualElement, virtualElement);
    prevVirtualElement = virtualElement;
};

},{"./utils":"1yEYz","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./types":"6Zsey","./hooks":"9Cknq"}],"1yEYz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "keys", ()=>keys
);
parcelHelpers.export(exports, "isVirtualFunctionElement", ()=>isVirtualFunctionElement
);
parcelHelpers.export(exports, "isVirtualStringElement", ()=>isVirtualStringElement
);
parcelHelpers.export(exports, "isVirtualNativeElement", ()=>isVirtualNativeElement
);
parcelHelpers.export(exports, "isElementNode", ()=>isElementNode
);
parcelHelpers.export(exports, "isTextNode", ()=>isTextNode
);
parcelHelpers.export(exports, "replaceNode", ()=>replaceNode
);
parcelHelpers.export(exports, "arraysEqual", ()=>arraysEqual
);
var _types = require("./types");
const keys = Object.keys;
const isVirtualFunctionElement = (virtualElement)=>typeof virtualElement.type === 'function'
;
const isVirtualStringElement = (virtualElement)=>virtualElement.type === 'String'
;
const isVirtualNativeElement = (virtualElement)=>!isVirtualStringElement(virtualElement) && !isVirtualFunctionElement(virtualElement)
;
const isElementNode = (node)=>node.nodeType === _types.NodeTypes.Element
;
const isTextNode = (node)=>node.nodeType === _types.NodeTypes.Text
;
const replaceNode = (node, newNode)=>{
    if (!newNode) return;
    node.parentElement?.replaceChild(newNode, node);
};
const arraysEqual = (arr1, arr2)=>{
    if (arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i += 1){
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./types":"6Zsey"}],"6Zsey":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "NodeTypes", ()=>NodeTypes
);
let NodeTypes;
(function(NodeTypes1) {
    NodeTypes1[NodeTypes1["Element"] = 1] = "Element";
    NodeTypes1[NodeTypes1["Text"] = 3] = "Text";
})(NodeTypes || (NodeTypes = {}));

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9Cknq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "useEffect", ()=>useEffect
);
parcelHelpers.export(exports, "useState", ()=>useState
);
parcelHelpers.export(exports, "mountWithHooks", ()=>mountWithHooks
);
parcelHelpers.export(exports, "unmountWithHooks", ()=>unmountWithHooks
);
var _utils = require("./utils");
let currentComponent;
let currentForceRender;
// TODO: Since hooks should always fire in the same order, we could just push
// all hook data onto a single array with an index that increments per call.
// That way we don't keep in memory other hooks data when we don't need to.
const hooks = {
    useState: new Map(),
    useEffect: new Map()
};
const useEffect = (callback, dependencies)=>{
    const componentEffects = hooks.useEffect.get(currentComponent) || [];
    componentEffects.push({
        callback,
        dependencies,
        unmountCallback: undefined
    });
    hooks.useEffect.set(currentComponent, componentEffects);
};
const useState = (initialValue)=>{
    let componentHookData = hooks.useState.get(currentComponent);
    if (!componentHookData) {
        componentHookData = [
            {
                value: initialValue
            }
        ];
        hooks.useState.set(currentComponent, componentHookData);
    }
    // TODO: Make this work with multiple useState calls.
    const hook = componentHookData[componentHookData.length - 1];
    const setState = (value)=>{
        if (hook.value !== value) {
            hook.value = value;
            // We could end up here during the current render. That means we'd kick
            // off another render before the DOM has finished updating. So we use
            // `requestIdleCallback` to ensure the next render runs after the current
            // one is complete.
            // TODO: Once fibers are implemented, this can go away.
            window.requestIdleCallback(currentForceRender);
        }
    };
    // TODO: Can we avoid the cast here? Otherwise value would be `unknown`
    // because of the `hooks.useState` definition above.
    return [
        hook.value,
        setState
    ];
};
const mountWithHooks = (virtualElement, forceRender)=>{
    currentComponent = virtualElement.type;
    currentForceRender = forceRender;
    const prevEffects = hooks.useEffect.get(virtualElement.type);
    // Repopulates after calling the function component below.
    hooks.useEffect.delete(virtualElement.type);
    virtualElement.result = virtualElement.type(virtualElement.props);
    const currentUseEffectCalls = hooks.useEffect.get(currentComponent);
    if (!currentUseEffectCalls || currentUseEffectCalls.length === 0) return virtualElement.result;
    currentUseEffectCalls.forEach((nextEffect, index)=>{
        const prevEffect = prevEffects?.[index];
        if (prevEffect && _utils.arraysEqual(prevEffect.dependencies, nextEffect.dependencies)) nextEffect.unmountCallback = prevEffect.unmountCallback;
        else nextEffect.unmountCallback = nextEffect.callback();
    });
    return virtualElement.result;
};
const unmountWithHooks = (virtualElement)=>{
    const componentEffects = hooks.useEffect.get(virtualElement.type);
    if (!componentEffects) return virtualElement.result;
    for (const { unmountCallback  } of componentEffects)if (unmountCallback) unmountCallback();
    hooks.useEffect.delete(virtualElement.type);
    hooks.useState.delete(virtualElement.type);
    return virtualElement.result;
};

},{"./utils":"1yEYz","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iudxg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "IntroScreen", ()=>IntroScreen
);
var _renderer = require("../lib/renderer");
const IntroScreen = ()=>_renderer.e('div', {
        id: 'intro-screen',
        className: 'screen'
    }, _renderer.e('button', {
        id: 'new-session-button'
    }, 'Start Session'))
;

},{"../lib/renderer":"eg3L3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iiQGi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "NewSessionScreen", ()=>NewSessionScreen
);
var _renderer = require("../lib/renderer");
var _components = require("../components");
var _state = require("../state");
var _selectors = require("../selectors");
const NewSessionScreen = ()=>{
    const handleSelectSuggestedCasino = (casinoName)=>{
        _state.state.app.newSessionScreen.casinoName = casinoName;
    };
    return _renderer.e('div', {
        id: 'new-session-screen',
        className: 'screen'
    }, _renderer.e(_components.SuggestedCasino, {
        onSelect: handleSelectSuggestedCasino
    }), _renderer.e('form', {
        id: 'new-session-form'
    }, _renderer.e('div', null, _renderer.e('label', null, _renderer.e('span', null, 'Casino Name'), _renderer.e('input', {
        id: 'casino-name-input',
        type: 'text',
        placeholder: _selectors.appSelectors.mostFrequentCasinoName ?? 'Bellagio',
        required: true,
        value: _state.state.app.newSessionScreen.casinoName
    }))), _renderer.e('div', null, _renderer.e('label', null, _renderer.e('span', null, 'Blinds'), _renderer.e(_components.NumberInput, {
        id: 'small-blind-input',
        placeholder: '2',
        value: _state.state.app.newSessionScreen.smallBlind,
        max: 100
    }), _renderer.e(_components.NumberInput, {
        id: 'big-blind-input',
        placeholder: '5',
        value: _state.state.app.newSessionScreen.bigBlind,
        max: 200
    })), _renderer.e(_components.BlindsButton, {
        smallBlind: 1,
        bigBlind: 2
    }), _renderer.e(_components.BlindsButton, {
        smallBlind: 1,
        bigBlind: 3
    }), _renderer.e(_components.BlindsButton, {
        smallBlind: 2,
        bigBlind: 5
    }), _renderer.e(_components.BlindsButton, {
        smallBlind: 5,
        bigBlind: 10
    })), _renderer.e('div', null, _renderer.e('label', null, _renderer.e('span', null, 'Max Buyin'), _renderer.e(_components.NumberInput, {
        id: 'max-buyin-input',
        placeholder: '500',
        value: _state.state.app.newSessionScreen.maxBuyin
    }))), _renderer.e('div', null, _renderer.e('input', {
        type: 'submit',
        value: 'Start Session'
    }))));
};

},{"../lib/renderer":"eg3L3","../components":"dHnah","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../state":"6GBqf","../selectors":"2OUoq"}],"cCow8":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "NumberInput", ()=>NumberInput
);
var _renderer = require("../lib/renderer");
const NumberInput = ({ id , placeholder , value , min =1 , max , onInput ,  })=>_renderer.e('input', {
        id,
        type: 'number',
        placeholder,
        pattern: '\\d*',
        value,
        min,
        max,
        required: true,
        onInput
    })
;

},{"../lib/renderer":"eg3L3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kEhZ6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ShowSessionScreen", ()=>ShowSessionScreen
);
var _renderer = require("../lib/renderer");
var _components = require("../components");
var _decorators = require("../decorators");
var _selectors = require("../selectors");
var _state = require("../state");
const ShowSessionScreen = ()=>{
    if (!_selectors.appSelectors.currentSession) return null;
    const session = new _decorators.Session(_selectors.appSelectors.currentSession);
    const handleNotesInput = (event)=>{
        if (event.target) _state.state.app.showSessionScreen.notes = event.target.value;
    };
    const handleCashoutAmountInput = (event)=>{
        if (event.target) _state.state.app.showSessionScreen.cashoutAmount = event.target.value;
    };
    return _renderer.e('div', {
        id: 'show-session-screen',
        className: 'screen'
    }, _renderer.e('h1', {
        id: 'session-title'
    }, session.title()), _renderer.e('div', null, _renderer.e('span', null, `Profit: $${session.profit()}`)), _renderer.e('div', null, _renderer.e('span', null, `Start time: ${session.startTime()}`)), _selectors.appSelectors.currentSession.startTime && _renderer.e('div', null, _renderer.e('span', null, 'Time elapsed: ', _renderer.e(_components.Timer, {
        startTime: _selectors.appSelectors.currentSession.startTime
    }))), _renderer.e('form', {
        id: 'rebuy-form',
        className: 'section'
    }, _renderer.e(_components.NumberInput, {
        id: 'rebuy-amount-input',
        placeholder: _selectors.appSelectors.currentSession.attributes.maxBuyin.toString(),
        value: _state.state.app.showSessionScreen.rebuyAmount
    }), _renderer.e('input', {
        type: 'submit',
        value: 'Rebuy'
    }), _renderer.e('input', {
        id: 'rebuy-max-button',
        type: 'button',
        value: 'Max'
    })), _renderer.e(_components.TipsSection, {
        type: 'dealer',
        value: session.dealerTips()
    }), _renderer.e(_components.TipsSection, {
        type: 'drink',
        value: session.drinkTips()
    }), _renderer.e('form', {
        id: 'end-session-form',
        className: 'section'
    }, _renderer.e('input', {
        className: 'hidden',
        type: 'text',
        autocomplete: 'username'
    }), _renderer.e('label', {
        className: 'section'
    }, _renderer.e('div', null, 'Notes'), _renderer.e('textarea', {
        onInput: handleNotesInput
    })), _renderer.e('label', {
        className: 'section'
    }, _renderer.e('div', null, 'Cashout Amount'), _renderer.e(_components.NumberInput, {
        min: 0,
        value: _state.state.app.showSessionScreen.cashoutAmount,
        placeholder: (_selectors.appSelectors.currentSession.attributes.maxBuyin * 3).toString(),
        onInput: handleCashoutAmountInput
    })), _state.state.app.cachedAdminPassword ? '' : _renderer.e('div', {
        id: 'admin-password-area'
    }, _renderer.e('label', null, _renderer.e('span', null, 'Password')), _renderer.e('input', {
        id: 'admin-password-input',
        type: 'password',
        autocomplete: 'current-password',
        required: true
    })), _renderer.e('input', {
        id: 'end-session-submit-button',
        type: 'submit',
        value: 'End Session',
        disabled: _state.state.app.showSessionScreen.isSavingSession
    })));
};

},{"../lib/renderer":"eg3L3","../components":"dHnah","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../decorators":"7km9a","../selectors":"2OUoq","../state":"6GBqf"}],"7km9a":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Session", ()=>_session.Session
);
var _session = require("./session");

},{"./session":"01jmO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"01jmO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Session", ()=>Session
);
class Session {
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
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"79J6p":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TipsSection", ()=>TipsSection
);
var _renderer = require("../lib/renderer");
var _utils = require("../utils");
const TipsSection = ({ type , value  })=>_renderer.e('div', {
        className: 'section'
    }, _renderer.e('span', null, `${_utils.capitalize(type)} tips: ${value}`), _renderer.e('div', null, _renderer.e('button', {
        className: 'tip-button',
        id: `decrement-${type}-tip-button`
    }, '-'), _renderer.e('button', {
        className: 'tip-button',
        id: `increment-${type}-tip-button`
    }, '+')))
;

},{"../lib/renderer":"eg3L3","../utils":"dsXzW","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6aOJQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "App", ()=>App
);
var _renderer = require("../lib/renderer");
var _ = require(".");
var _types = require("../types");
var _state = require("../state");
const App = ()=>{
    switch(_state.state.app.screen){
        case _types.Screen.Intro:
            return _renderer.e(_.IntroScreen);
        case _types.Screen.NewSession:
            return _renderer.e(_.NewSessionScreen);
        case _types.Screen.ShowSession:
            return _renderer.e(_.ShowSessionScreen);
        default:
            throw new Error(`Unknown screen ${_state.state.app.screen}`);
    }
};

},{".":"dHnah","../types":"38MWl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../state":"6GBqf","../lib/renderer":"eg3L3"}],"fQJh5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SuggestedCasino", ()=>SuggestedCasino
);
var _renderer = require("../lib/renderer");
var _selectors = require("../selectors");
const SuggestedCasino = ({ onSelect  })=>{
    const casinoName = _selectors.appSelectors.mostFrequentCasinoName;
    if (!casinoName) return null;
    return _renderer.e('div', null, `Play at ${casinoName} again?`, _renderer.e('button', {
        onClick: ()=>onSelect(casinoName)
    }, 'OK'));
};

},{"../lib/renderer":"eg3L3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../selectors":"2OUoq"}],"cVbGh":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Timer", ()=>Timer
);
var _renderer = require("../lib/renderer");
var _utils = require("../utils");
const MILLISECONDS_IN_ONE_SECOND = 1000;
const Timer = ({ startTime  })=>{
    const [timeElaped, setTimeElapsed] = _renderer.useState('');
    _renderer.useEffect(()=>{
        const updateTimeElapsed = ()=>{
            setTimeElapsed(_utils.formatDuration(Date.now() - startTime.getTime()));
        };
        setInterval(updateTimeElapsed, MILLISECONDS_IN_ONE_SECOND);
        updateTimeElapsed();
    }, []);
    return _renderer.e('span', null, timeElaped.toString());
};

},{"../lib/renderer":"eg3L3","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../utils":"dsXzW"}]},["8wcER","h7u1C"], "h7u1C", "parcelRequirefb1b")

//# sourceMappingURL=index.b71e74eb.js.map
