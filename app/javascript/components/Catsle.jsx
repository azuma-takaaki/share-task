import React, { useState, useRef, useEffect, Suspense }  from 'react';
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber';
import { Vector3, PerspectiveCamera } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from "prop-types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 1;
      controls.maxDistance = 30;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

const LoadModel = (modelpath) => {
	const gltf = useLoader(GLTFLoader, modelpath.modelpath)
	return (
		<primitive scale={[0.07, 0.07, 0.07]}  object={gltf.scene.clone(true)} dispose={null} />
	)
}

var UseModel = (position) =>{
	return (
		<mesh  {...position} rotation={[0, -Math.PI / 2, 0]}>
			<Suspense fallback={null}>
					<LoadModel modelpath=" /catsle.glb"/>
			</Suspense>
		</mesh>
	)
}



function Catsle(props){
	const [countRotX,setCountX] = useState(0)
	const [countRotY,setCountY] = useState(0)
	const [countRotZ,setCountZ] = useState(0)
	const [countPosX,setCountPosX] = useState(0)
	const [countPosY,setCountPosY] = useState(0)
	const [countPosZ,setCountPosZ] = useState(0)
  const [rotY, setPosCount] = useState(0)
	const [newCatslePos, setCatslePos] = useState(0)
  const handleClick = () => {
    setPosCount(rotY+1)
  };

	const addCatsle = () => {
		setCountPosX(countPosX+1)
 }

 const destroyCatsle = () => {
	 setCountPosX(countPosX-1)
}

  return (
    <div id={props.tag_id}>
      <h2>{props.castle_name} 城</h2>
  		<Canvas >
				<CameraController />
  			<Camera position={[0, 4, 10]}  rotation={[Math.PI/24*(countRotX-6), Math.PI/24*countRotY, Math.PI/24*countRotZ]}/>
  			<gridHelper args={[100, 100, 0X696969, 0X696969]} position={[0, 0, 0]}/>
  			<pointLight position={[10, -20, 70]} />
				<pointLight position={[0, 100, -150]} />



				{(() => {
						const catsles = [<UseModel position={[0, 0, 0]} />];
						var n = 0
						var l = 0
						for(var i = 0; i < countPosX; i++) {
								catsles.push(<UseModel position={[l*3, 0, -i+l*10]} />)
								if(n===9){
									l++
									n=0
								}else{
									n++
								}

						}
						return(catsles)
				})()}
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
