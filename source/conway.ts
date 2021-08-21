import { curry } from './utils';

const sum = (acc: number, val: number): number => acc + val;

export const randomVal = (): number => Math.floor(Math.random() * 2);

export const createGrid = (getVal: () => number) => (cols: number, rows: number): number[] => {
  return Array<number[]>(cols * rows).fill([]).map(getVal);
};

const overflowMapper = (cols: number, rows: number) => ([col, row]: number[]): number[] => [(col + cols) % cols, (row + rows) % rows];

/**
 * Utility function to convert a position [col, row] to a cell index
 */
export const positionMapper = (cols: number) => ([col, row]: number[]): number => {
  return col + (cols * row);
};

/**
 * Utility function to convert an index to a position [col, row]
 */
export const indexMapper = (cols: number) => {
  return (index: number): number[] => {
    return [Math.floor(index / cols), index % cols];
  };
};

const nextCellState = curry((value: number, neighbourSum: number): number => {
  return value === 1
    ? ((neighbourSum < 2 || neighbourSum > 3) ? 0 : 1)
    : (neighbourSum === 3) ? 1 : 0;
});

const generateCellPositions = (cols, rows, indexMap: (index: number) => number[]) => Array<number[]>(cols * rows).fill([]).map((_, i) => indexMap(i));

const createCellNeighbourIndexes = (overflowMap, positionMap, cellPositions: number[][]): number[][] => {
  return cellPositions.map(
    ([col, row]: number []) => {
      return [
        [col - 1, row - 1],
        [col - 1, row],
        [col - 1, row + 1],
        [col, row - 1],
        [col, row + 1],
        [col + 1, row - 1],
        [col + 1, row],
        [col + 1, row + 1],
      ].map(overflowMap).map(positionMap);
    },
  );
};

const cellValue = (cells: number[]) => (index: number): number => cells[index];

export const runGeneration = (cells: number[], cols: number, rows: number): number[] => {
  const cellGetter = cellValue(cells);
  const overflowMap = overflowMapper(cols, rows);
  const positionMap = positionMapper(cols);
  const indexMap = indexMapper(cols);
  const cellPositions = generateCellPositions(cols, rows, indexMap);
  const cellNeighbourMap = createCellNeighbourIndexes(overflowMap, positionMap, cellPositions);
  const neighbourSums = cellNeighbourMap.map((neighbours: number[]) => neighbours.map(cellGetter).reduce(sum));
  const neighbourSumGetter = cellValue(neighbourSums);

  return cells.map((val, index) => nextCellState(val, neighbourSumGetter(index)));
};
