import React, { useState, useRef, useEffect, Suspense }  from 'react';
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber';
import { Vector3, PerspectiveCamera } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from "prop-types";

const LoadModel = () => {
	const gltf = useLoader(GLTFLoader, " /catsle.glb")
	return (
		<primitive scale={[0.07, 0.07, 0.07]}  object={gltf.scene} dispose={null} />
	)
}


const UseModel = () => {
	return (
		<Suspense fallback={null}>
				<LoadModel />
		</Suspense>
	)
}


function Catsle(){
	const [count, setCount] = useState(0)
  const [rotY, setPosCount] = useState(0)
  const handleClick = () => {
    setPosCount(rotY+1)
  };

  return (
    <div id="target">
      <button onMouseDown = {handleClick}> rotY: {rotY} </button>
  		<button onClick = {() => setCount(count + 1)}> camera_rotation: +15° </button>
  		<button onClick = {() => setCount(count - 1)}> camera_rotation: -15° </button>
  		<Canvas  >
  			<Camera position={[0, 4, 10]}   rotation={[Math.PI/24*(count-3), Math.PI/24*rotY, 0]}/>
  			<gridHelper args={[300, 100, 0x888888, 0x888888]} position={[0, -0.65, 0]}/>
  			<pointLight position={[10, -20, 20]} />
  			<mesh
  				visible userData={{ hello: 'world' }} position={[0, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]}
  			>
  				<UseModel />
  			</mesh>


  		</Canvas>
    </div>
  )
}




function Camera(props) {
  const ref = useRef()
  const set = useThree((state) => state.set);
  useEffect(() => void set({ camera: ref.current }), []);
  useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera ref={ref} {...props} />
}



export default Catsle
