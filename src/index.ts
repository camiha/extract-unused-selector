import { PurgeCSS } from 'purgecss';
import * as util from 'util';

const main = async () => {
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

  const purgeCSSResult = await new PurgeCSS().purge({
    content: [firstArg],
    css: [secondArg],
    rejected: true,
  });

  purgeCSSResult.forEach((current) => {
    console.log(util.inspect(current.rejected, { maxArrayLength: null }));
  });
};

main();
