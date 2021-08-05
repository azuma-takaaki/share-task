import React, { useState, useRef, useEffect, Suspense }  from 'react';
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber';
import { Vector3, PerspectiveCamera } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from "prop-types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const LoadModel = () => {
	const gltf = useLoader(GLTFLoader, " /catsle.glb")
	return (
		<primitive scale={[0.07, 0.07, 0.07]}  object={gltf.scene} dispose={null} />
	)
}

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 3;
      controls.maxDistance = 20;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

const UseModel = () => {
	return (
		<Suspense fallback={null}>
				<LoadModel />
		</Suspense>
	)
}


function Catsle(){
	const [countRotX,setCountX] = useState(0)
	const [countRotY,setCountY] = useState(0)
	const [countRotZ,setCountZ] = useState(0)
	const [countPosX,setCountPosX] = useState(0)
	const [countPosY,setCountPosY] = useState(0)
	const [countPosZ,setCountPosZ] = useState(0)
  const [rotY, setPosCount] = useState(0)
  const handleClick = () => {
    setPosCount(rotY+1)
  };

  return (
    <div id="target">

  		<Canvas  >
			<CameraController />
  			<Camera position={[countPosX, 4+countPosY, 10+countPosZ]}   rotation={[Math.PI/24*(countRotX-3), Math.PI/24*countRotY, Math.PI/24*countRotZ]}/>
  			<gridHelper args={[100, 100, 0X696969, 0X696969]} position={[0, 0, 0]}/>
  			<pointLight position={[10, -20, 70]} />
				<pointLight position={[0, 100, -150]} />
  			<mesh
  				visible userData={{ hello: 'world' }} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}
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
