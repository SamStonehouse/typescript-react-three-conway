import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { wrap, Remote } from 'comlink';

import styles from './app.scss';
import Cell from './cell';
import { createGrid, randomVal, indexMapper } from './conway';
import type { WorkerApi } from './workers/conway.worker';


const createConwayService = (): Remote<WorkerApi> => {
  const worker = new Worker(new URL('./workers/conway.worker.ts', import.meta.url));
  return wrap<WorkerApi>(worker);
};

const useConwayWorker = () => {
  const service = useRef<Remote<WorkerApi> | null>(null);

  function getService() {
    if (service.current === null) {
      service.current = createConwayService();
    }
    return service.current;
  }

  return async (cols: number, rows: number, cells: number[]) => {
    return getService().run(cols, rows, cells);
  };
};

const App = (): React.ReactElement => {
  const [cols] = useState(10);
  const [rows] = useState(10);
  const [intervalTime] = useState(500);
  const [cells, setCells] = useState<number[]>([]);
  const [running, setRunning] = useState(true);
  const conwayWorker = useConwayWorker();

  const indexMap = useMemo(() => { return indexMapper(cols); }, [cols]);

  useEffect(() => {
    setCells(createGrid(randomVal)(cols, rows));
  }, [cols, rows]);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setTimeout(() => {
        if (cells.length > 0) {
          conwayWorker(cols, rows, cells).then((newCells: number[]) => {
            setCells(newCells);
          });
        }
      }, intervalTime);
    }

    return () => {
      clearTimeout(interval);
    };
  }, [running, cells]);

  return (
    <div className={styles.app}>
      <div className={styles.controls}>
        <button type='button' onClick={() => { setRunning((isRunning) => !isRunning); }}>{running ? 'Pause' : 'Play'}</button>
      </div>
      <Canvas className={styles.canvas}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {cells.map((val, index) => {
          const [ci, ri] = indexMap(index);
          return (
            <Cell
              setActive={() => { /* empty */ }}
              row={ri}
              col={ci}
              active={val === 1}
              key={`${ci} ${ri}`}
              xOffset={-cols / 4}
              yOffset={-rows / 4}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default App;
