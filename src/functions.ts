// polyfill for jsdom on jest's test
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// @ts-ignore next-line
global.TextDecoder = TextDecoder;

import * as sass from 'sass';
import { JSDOM } from 'jsdom';
import { extract } from 'string-extract-class-names';

export const getAllClassFromHTML = (input: string): string[] => {
  const target = new JSDOM(input);

  // TODO: 高級な API を用いず、直接 AST を探索する処理に変更
  const allQuery = Array.from(target.window.document.querySelectorAll('*'));
  const allClassList = new Set(
    allQuery.reduce((acc, cur) => {
      return [...acc, ...Array.from(cur.classList)];
    }, [] as string[]),
  );

  const result = [...allClassList].sort();
  return result;
};

export const getAllClassFromCSS = (css: string): string[] => {
  const extracted = extract(css).res;
  const result = Array.from(new Set(extracted))
    .map((current) => current.split('.')[1])
    .sort();

  return result;
};

export const getNotExist = (original: string[], check: string[]) =>
  check.filter((index) => original.indexOf(index) === -1);

export const compileScss = (target: string): string =>
  sass.compileString(target).css;
