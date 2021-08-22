import { expose } from 'comlink';
import memoizeOne from 'memoize-one';
import { getGenerator } from '@/conway';

const memoizeGetGenerator = memoizeOne(getGenerator);

const run = async (cols: number, rows: number, cells: number[]) => {
  return memoizeGetGenerator(cols, rows)(cells);
};

const workerApi = {
  run,
};

export type WorkerApi = typeof workerApi;

expose(workerApi);
