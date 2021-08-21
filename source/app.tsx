import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import styles from './app.scss';
import Cell from './cell';
import { createGrid, randomVal, indexMapper } from './conway';

// eslint-disable-next-line import/extensions
// import ConwayWorker from './conway.worker.ts';

const App = (): React.ReactElement => {
  const [cols] = useState(20);
  const [rows] = useState(20);
  const [cells, setCells] = useState<number[]>([]);
  const [running, setRunning] = useState(true);

  const indexMap = useMemo(() => { return indexMapper(cols); }, [cols]);

  useEffect(() => {
    setCells(createGrid(randomVal)(cols, rows));
  }, [cols, rows]);

  useEffect(() => {
    console.log(import.meta.url);
    const worker = new Worker(new URL('./workers/conway.worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent<any>) => {
      // eslint-disable-next-line no-console
      console.log(e);
    };

    worker.postMessage({
      type: 'test',
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.controls}>
        <button type='button' onClick={() => { setRunning((isRunning) => !isRunning); }}>{running ? 'Pause' : 'Play'}</button>
        {/* <button type='button' onClick={() => { console.log(runGeneration(cells, cols, rows)); }}>Next</button> */}
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


const test = async () => {
  console.log(import.meta.url);
  const worker = new Worker(new URL('./workers/conway.worker.ts', import.meta.url));
  console.log(worker);
};

test();
