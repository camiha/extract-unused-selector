"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getNotExist = exports.getAllScssTopSelectors = exports.getAllCssSelectors = exports.getAllHTMLSelectors = void 0;
// polyfill for jsdom on jest's test
var util_1 = require("util");
global.TextEncoder = util_1.TextEncoder;
// @ts-ignore next-line
global.TextDecoder = util_1.TextDecoder;
var jsdom_1 = require("jsdom");
var postcss_1 = require("postcss");
var getAllHTMLSelectors = function (input) {
    var target = new jsdom_1.JSDOM(input);
    var allQuery = Array.from(target.window.document.querySelectorAll('*'));
    var selectors = new Set(allQuery.reduce(function (acc, cur) {
        return __spreadArray(__spreadArray([], __read(acc), false), __read(Array.from(cur.classList)), false);
    }, []));
    var result = __spreadArray([], __read(selectors), false).sort();
    return result;
};
exports.getAllHTMLSelectors = getAllHTMLSelectors;
var getAllCssSelectors = function (css) {
    var ast = postcss_1["default"].parse(css);
    var selectors = [];
    ast.walkRules(function (rule) {
        selectors.push(rule.selector);
    });
    var result = __spreadArray([], __read(new Set(selectors)), false).sort();
    return result;
};
exports.getAllCssSelectors = getAllCssSelectors;
var getAllScssTopSelectors = function (scss) {
    var selectors = (0, exports.getAllCssSelectors)(scss);
    var result = selectors.filter(function (current) { return current.charAt(0) === '.' || current.charAt(0) === '#'; });
    return result;
};
exports.getAllScssTopSelectors = getAllScssTopSelectors;
var getNotExist = function (original, check) {
    return check.filter(function (index) { return original.indexOf(index) === -1; });
};
exports.getNotExist = getNotExist;
