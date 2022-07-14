import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import {
  getAllScssTopSelectors,
  getAllHTMLSelectors,
  getNotExist,
} from './functions';

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
  if (
    secondArg.split('.')[-1] === 'scss' ||
    secondArg.split('.')[-1] === 'css'
  ) {
    console.error('unsupported format.');
    process.exit(1);
  }

  const htmlDir = firstArg;
  const css = fs.readFileSync(secondArg, 'utf-8');

  const htmlFilesPath = glob.sync(path.resolve(htmlDir) + '/**/*.+' + '(html)');
  const htmlFiles = htmlFilesPath.map((path) => fs.readFileSync(path, 'utf-8'));

  const htmlSelectorList = htmlFiles.reduce((acc, cur) => {
    return [...acc, ...getAllHTMLSelectors(cur)];
  }, [] as string[]);

  const cssSelectorList = getAllScssTopSelectors(css);

  // CSS Selector のみに存在するデータの配列を生成
  const result = getNotExist(htmlSelectorList, cssSelectorList);

  console.log(result);
};

main();
