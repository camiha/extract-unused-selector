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
exports.compileScss = exports.getNotExist = exports.getAllClassFromCSS = exports.getAllClassFromHTML = void 0;
// polyfill for jsdom on jest's test
var util_1 = require("util");
global.TextEncoder = util_1.TextEncoder;
// @ts-ignore next-line
global.TextDecoder = util_1.TextDecoder;
var sass = require("sass");
var jsdom_1 = require("jsdom");
var string_extract_class_names_1 = require("string-extract-class-names");
var getAllClassFromHTML = function (input) {
    var target = new jsdom_1.JSDOM(input);
    // TODO: 高級な API を用いず、直接 AST を探索する処理に変更
    var allQuery = Array.from(target.window.document.querySelectorAll('*'));
    var allClassList = new Set(allQuery.reduce(function (acc, cur) {
        return __spreadArray(__spreadArray([], __read(acc), false), __read(Array.from(cur.classList)), false);
    }, []));
    var result = __spreadArray([], __read(allClassList), false).sort();
    return result;
};
exports.getAllClassFromHTML = getAllClassFromHTML;
var getAllClassFromCSS = function (css) {
    var extracted = (0, string_extract_class_names_1.extract)(css).res;
    var result = Array.from(new Set(extracted))
        .map(function (current) { return current.split('.')[1]; })
        .sort();
    return result;
};
exports.getAllClassFromCSS = getAllClassFromCSS;
var getNotExist = function (original, check) {
    return check.filter(function (index) { return original.indexOf(index) === -1; });
};
exports.getNotExist = getNotExist;
var compileScss = function (target) {
    return sass.compileString(target).css;
};
exports.compileScss = compileScss;
