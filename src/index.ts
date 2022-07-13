import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as sass from 'sass';
import { JSDOM } from 'jsdom';
import { extract } from 'string-extract-class-names';

export const getAllClassNameFromHTML = (input: string): string[] => {
  const target = new JSDOM(input);

  // TODO: 高級な API を用いず、直接 AST を探索する処理に変更
  const allQuery = Array.from(target.window.document.querySelectorAll('*'));
  const allClassList = new Set(
    allQuery.reduce((acc, cur) => {
      return [...acc, ...Array.from(cur.classList)];
    }, [] as string[]),
  );

  const result = [...allClassList];
  return result;
};

export const compileScss = (target: string): string =>
  sass.compileString(target).css;

export const getAllSelectorFromCSS = (css: string): string[] => {
  const selectors = extract(css).res;
  const result = Array.from(new Set(selectors))
    .map((current) => current.split('.')[1])
    .sort();

  return result;
};

const main = () => {
  const [, , firstArg, secondArg] = process.argv;

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

  const htmlDir = firstArg;
  const scss = fs.readFileSync(secondArg, 'utf-8');
  const css = compileScss(scss);

  const htmlFilesPath = glob.sync(path.resolve(htmlDir) + '/**/*.+' + '(html)');
  const htmlFiles = htmlFilesPath.map((path) => fs.readFileSync(path, 'utf-8'));

  const htmlSelectorList = htmlFiles.reduce((acc, cur) => {
    return [...acc, ...getAllClassNameFromHTML(cur)];
  }, [] as string[]);

  const cssSelectorList = getAllSelectorFromCSS(css);

  // CSS Selector のみに存在するデータの配列を生成
  const result = cssSelectorList.filter(
    (index) => htmlSelectorList.indexOf(index) === -1,
  );

  console.log(result);
};

main();
