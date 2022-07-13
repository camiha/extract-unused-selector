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
var path = require("path");
var fs = require("fs");
var glob = require("glob");
var functions_1 = require("./functions");
var main = function () {
    var _a = __read(process.argv, 4), firstArg = _a[2], secondArg = _a[3];
    if (!firstArg) {
        console.error('unknown input.');
        process.exit(1);
    }
    if (!secondArg) {
        console.error('unknown input.');
        process.exit(1);
    }
    if (secondArg.split('.')[-1] === 'scss') {
        console.error('unsupported format.');
        process.exit(1);
    }
    var htmlDir = firstArg;
    var scss = fs.readFileSync(secondArg, 'utf-8');
    var css = (0, functions_1.compileScss)(scss);
    var htmlFilesPath = glob.sync(path.resolve(htmlDir) + '/**/*.+' + '(html)');
    var htmlFiles = htmlFilesPath.map(function (path) { return fs.readFileSync(path, 'utf-8'); });
    var htmlSelectorList = htmlFiles.reduce(function (acc, cur) {
        return __spreadArray(__spreadArray([], __read(acc), false), __read((0, functions_1.getAllClassFromHTML)(cur)), false);
    }, []);
    var cssSelectorList = (0, functions_1.getAllClassFromCSS)(css);
    // CSS Selector のみに存在するデータの配列を生成
    var result = (0, functions_1.getNotExist)(htmlSelectorList, cssSelectorList);
    console.log(result);
};
main();
