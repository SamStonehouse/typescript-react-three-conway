import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import styles from './app.scss';
import Cell from './cell';

function replaceAt<T>(array: T[], index: number, value: T): T[] {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

const sumAcc = (acc: number, val: number): number => acc + val;

function createGrid(cols: number, rows: number): number[][] {
  return Array<number[]>(cols).fill([]).map(() => Array<number>(rows).fill(0).map(() => Math.floor(Math.random() * 2)));
}

const overflow = (cols: number, rows: number) => ([col, row]: number[]): number[] => [(col + cols) % cols, (row + rows) % rows];

function getNeighbourIndexes(cols: number, rows: number, col: number, row: number): number[][] {
  const gridOverflow = overflow(cols, rows);
  return [
    [col - 1, row - 1],
    [col - 1, row],
    [col - 1, row + 1],
    [col, row - 1],
    [col, row + 1],
    [col + 1, row - 1],
    [col + 1, row],
    [col + 1, row + 1],
  ].map(gridOverflow);
}

const cellGetter = (state: number[][]) => ([col, row]: number[]): number => {
  return state[col][row];
};

const getNeighbours = (stateCellGetter: (cellGetter: number[]) => number, cols: number, rows: number) => (col: number, row: number): number[] => {
  return getNeighbourIndexes(cols, rows, col, row).map(stateCellGetter);
};

const nextCellState = (value: number, neighbourSum: number): number => {
  return value === 1
    ? ((neighbourSum < 2 || neighbourSum > 3) ? 0 : 1)
    : (neighbourSum === 3) ? 1 : 0;
};

function runGeneration(cells: number[][], cols, rows): number[][] {
  const stateCellGetter = cellGetter(cells);
  const neighbourGetter = getNeighbours(stateCellGetter, cols, rows);

  return cells.map((column, colIndex) => {
    return column.map((value, rowIndex) => {
      return nextCellState(value, neighbourGetter(colIndex, rowIndex).reduce(sumAcc));
    });
  });
}

const App = (): React.ReactElement => {
  const [cols, setCols] = useState(10);
  const [rows, setRows] = useState(10);
  const [cells, setCells] = useState<number[][]>([[]]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    setCells(createGrid(cols, rows));
  }, [cols, rows]);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setCells((currState) => runGeneration(currState, cols, rows));
      }, 500);
    }

    return () => {
      clearInterval(interval);
    };
  }, [running]);

  return (
    <div className={styles.app}>
      <div className={styles.controls}>
        <button type='button' onClick={() => { setRunning((isRunning) => !isRunning); }}>{running ? 'Pause' : 'Play'}</button>
      </div>
      <Canvas className={styles.canvas}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {cells.map((columns, ci) => {
          return columns.map((val, ri) => (
            <Cell
              setActive={(active) => { setCells((currCells) => replaceAt(currCells, ci, replaceAt(currCells[ci], ri, active ? 1 : 0))); }}
              row={ri}
              col={ci}
              active={val === 1}
              key={`${ci} ${ri}`}
            />
          ));
        })}
      </Canvas>
    </div>
  );
};

export default App;
