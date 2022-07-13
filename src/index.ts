import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as sass from 'sass';
import { JSDOM } from 'jsdom';
import { parse } from 'css-tree';

type ParsedCssAST = {
  type: string;
  prelude: {
    type: string;
    children: [
      {
        type: string;
        children: [
          {
            type: string;
            name: string;
          },
        ];
      },
    ];
  };
};

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

// TODO: SCSS AST を直接解析する処理に変更
export const getAllSelectorFromCSS = (css: string): string[] => {
  const ast = parse(css);

  // 必要な AST データのみに変換
  const parsedAST: ParsedCssAST[] = JSON.parse(
    JSON.stringify(ast, ['children', 'type', 'prelude', 'name']),
  ).children;

  // セレクタを保持した中間データを生成
  // TODO: DFS を用いた実装に変更
  const selectorWrapper = parsedAST
    .map((cur) => {
      return cur.prelude.children[0].children;
    })
    .flat();

  // 重複なしのセレクタ配列を生成
  const selectors = [
    ...new Set(selectorWrapper.map((current) => current.name)),
  ].sort();

  return selectors;
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
