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
					<LoadModel modelpath=" /castle.glb"/>
			</Suspense>
		</mesh>
	)
}



function Castle(props){
	const [countRotX,setCountX] = useState(0)
	const [countRotY,setCountY] = useState(0)
	const [countRotZ,setCountZ] = useState(0)
	const [countPosX,setCountPosX] = useState(0)
	const [countPosY,setCountPosY] = useState(0)
	const [countPosZ,setCountPosZ] = useState(0)
  const [rotY, setPosCount] = useState(0)
	const [newCastlePos, setCastlePos] = useState(0)
  const handleClick = () => {
    setPosCount(rotY+1)
  };


 const destroyCastle = () => {
	 setCountPosX(countPosX-1)
 }

 const showUserPage = (user_id) =>{
   props.fetchCastles("user", user_id, true)
 }

 const addCastle = () =>{
    alert("1")
    const getCsrfToken = () => {
      const metas = document.getElementsByTagName('meta');
      for (let meta of metas) {
          if (meta.getAttribute('name') === 'csrf-token') {
              console.log('csrf-token:', meta.getAttribute('content'));
              return meta.getAttribute('content');
           }
       }
      return '';
    }
    alert("2")
    var random_number = Math.floor(Math.random() * 6)
    const data = { castle_part: {
                          castle_id: props.castle_id,
                          three_d_model_name: "castle.glb",
                          position_x: random_number,
                          position_y: 0,
                          position_z: 0,
                          angle_x: 0,
                          angle_y: 0,
                          angle_z: 0,
                        }};

    alert("3")
    fetch('/castle_parts',{
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then((result) => {
      alert("4")
      alert(result[0])
    })
 }

 var user_built_castle = <div></div>
 if(props.tag_class=="castle_at_group"){
   user_built_castle = <div class="name-and-icon-of-user-built-castle-at-group-page">
                          <img class = "user-icon" src={require("../../assets/images/default/" + props.user_icon)} />
                          <div class = "user-name" onClick={()=>showUserPage(props.user_id)}>{props.user_name}</div>
                       </div>

 }

 var add_castle_button = <div></div>
 if(props.tag_class=="castle_at_user_page"){
   add_castle_button = <button onClick={()=>addCastle()}>3Dモデルを追加</button>
 }

  return (
    <div class={props.tag_class}>
      <div class="castle-header-at-goup-page">
        {user_built_castle}
        <h2>{props.castle_name} 城</h2>
      </div>
      <div class="canvas">
    		<Canvas >
  				<CameraController />
    			<Camera position={[0, 4, 10]}  rotation={[Math.PI/24*(countRotX-6), Math.PI/24*countRotY, Math.PI/24*countRotZ]}/>
    			<gridHelper args={[100, 100, 0X696969, 0X696969]} position={[0, 0, 0]}/>
    			<pointLight position={[10, -20, 70]} />
  				<pointLight position={[0, 100, -150]} />



  				{(() => {
  						const castles = [<UseModel position={[0, 0, 0]} />];
  						var n = 0
  						var l = 0
  						for(var i = 0; i < countPosX; i++) {
  								castles.push(<UseModel position={[l*3, 0, -i+l*10]} />)
  								if(n===9){
  									l++
  									n=0
  								}else{
  									n++
  								}

  						}
  						return(castles)
  				})()}
    		</Canvas>
        {add_castle_button}
      </div>
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



export default Castle
