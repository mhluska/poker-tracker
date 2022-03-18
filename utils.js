"use strict";
exports.__esModule = true;
exports.Utils = void 0;
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
    Utils.localStorageSessionKey = function (sessionId) {
        return "pokerTracker:session:".concat(sessionId);
    };
    return Utils;
}());
exports.Utils = Utils;
