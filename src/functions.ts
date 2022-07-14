// polyfill for jsdom on jest's test
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// @ts-ignore next-line
global.TextDecoder = TextDecoder;

import { JSDOM } from 'jsdom';
import postcss from 'postcss';

export const getAllHTMLSelectors = (input: string): string[] => {
  const target = new JSDOM(input);

  const allQuery = Array.from(target.window.document.querySelectorAll('*'));
  const selectors = new Set(
    allQuery.reduce((acc, cur) => {
      return [...acc, ...Array.from(cur.classList)];
    }, [] as string[]),
  );

  const result = [...selectors].sort();
  return result;
};

export const getAllCssSelectors = (css: string): string[] => {
  const ast = postcss.parse(css);
  const selectors: string[] = [];
  ast.walkRules((rule) => {
    selectors.push(rule.selector);
  });

  const result = [...new Set(selectors)].sort();
  return result;
};

export const getAllScssTopSelectors = (scss: string): string[] => {
  const rawSelectors = getAllCssSelectors(scss);
  const selectors = rawSelectors.filter(
    (current) => current.charAt(0) === '.' || current.charAt(0) === '#',
  );
  const result = selectors.map((current) => current.slice(1));

  return result;
};

export const getNotExist = (original: string[], check: string[]) =>
  check.filter((index) => original.indexOf(index) === -1);
