import React, { useRef, useState } from 'react';
import THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

import styles from './app.scss';

interface IBoxProps {
  position: number[],
}

function Box({ position }: IBoxProps): React.ReactElement {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame(() => {
    ref.current.rotation.x += 0.01;
  });

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      position={position}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const App = (): React.ReactElement => (
  <Canvas className={styles.canvas}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </Canvas>
);

export default App;
