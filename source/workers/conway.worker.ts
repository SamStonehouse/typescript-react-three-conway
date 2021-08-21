import { expose } from 'comlink';
import memoizeOne from 'memoize-one';
import { getGenerator } from '@/conway';

const memoizeGetGenerator = memoizeOne(getGenerator);

const run = async (cols: number, rows: number, cells: number[]) => {
  const runGeneration = memoizeGetGenerator(cols, rows);
  console.time('Conway');
  const newGeneration = runGeneration(cells);
  console.timeEnd('Conway');
  return newGeneration;
};

const workerApi = {
  run,
};

export type WorkerApi = typeof workerApi;

expose(workerApi);
