import React, { useState, useRef, useEffect, Suspense }  from 'react';
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber';
import { Vector3, PerspectiveCamera } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from "prop-types";

const LoadModel = () => {
	const gltf = useLoader(GLTFLoader, " /catsle.glb")
	return (
		<primitive scale={[0.07, 0.07, 0.035]}  object={gltf.scene} dispose={null} />
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
			<div class="move-camera-buttons">
				<div class="change-rotate">
		  		<button onClick = {() => setCountX(countRotX + 1)}> rot_x: +15° </button>
		  		<button onClick = {() => setCountX(countRotX - 1)}> rot_x: -15° </button>
					<button onClick = {() => setCountY(countRotY + 1)}> rot_y: +15° </button>
		  		<button onClick = {() => setCountY(countRotY - 1)}> rot_y: -15° </button>
					<button onClick = {() => setCountZ(countRotZ + 1)}> rot_y: +15° </button>
		  		<button onClick = {() => setCountZ(countRotZ - 1)}> rot_y: -15° </button>
				</div>
				<div class="change-pos">
		  		<button onClick = {() => setCountPosX(countPosX - 1)}> 左 </button>
					<button onClick = {() => setCountPosX(countPosX + 1)}> 右 </button>
					<button onClick = {() => setCountPosY(countPosY + 1)}> 上</button>
		  		<button onClick = {() => setCountPosY(countPosY - 1)}> 下 </button>
		  		<button onClick = {() => setCountPosZ(countPosZ - 1)}> 前 </button>
					<button onClick = {() => setCountPosZ(countPosZ + 1)}> 後 </button>
				</div>
			</div>
  		<Canvas  >
  			<Camera position={[countPosX, 4+countPosY, 10+countPosZ]}   rotation={[Math.PI/24*(countRotX-3), Math.PI/24*countRotY, Math.PI/24*countRotZ]}/>
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
