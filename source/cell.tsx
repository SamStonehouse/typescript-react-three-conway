import React, { useRef, useState } from 'react';
import THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ICellProps {
  xOffset: number,
  yOffset: number,
  col: number,
  row: number,
  active: boolean,
  setActive(active: boolean): void,
}

const Cell = ({ xOffset, yOffset, col, row, active, setActive }: ICellProps): React.ReactElement => {
  const ref = useRef<THREE.Mesh>();
  const [hovered, setHover] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame(() => {
    ref.current.rotation.x += 0.002;
  });

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      position={[xOffset + (col * 0.5), yOffset + (row * 0.5), 0]}
      ref={ref}
      scale={active ? 0.5 : 0.2}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

export default Cell;
