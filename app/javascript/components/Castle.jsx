import React, { useState, useRef, useEffect, Suspense }  from 'react';
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber';
import { Vector3, PerspectiveCamera } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from "prop-types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Modal from 'react-modal'

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





function Castle(props){

  const [castleModels, setCastleModels] = useState(props.castle_models)
  const [editModelNumber, setEditModelNumber] = useState(0)

  const [selectedCastleToAdd, setSelectedCastleToAdd] = useState("")

  var default_modal_content = <div>
                                <button class="close-modal　btn-close btn btn-outline-secondary" onClick={closeModal}>×</button>
                                <h2>今日の積み上げ</h2>
                                <textarea  value={modalInput} onChange={handleChange} placeholder="今日の積み上げ" cols="30" rows="5"></textarea>
                                <button onClick={postReport}>登録する</button>
                              </div>

  const [modalContent, setModalContent] = useState(default_modal_content)

	const [countRotX,setCountRotX] = useState(0)
  const [previousCountRotX,setPreviousCountRotX] = useState(0)
	const [countRotY,setCountRotY] = useState(0)
  const [previousCountRotY,setPreviousCountRotY] = useState(0)
	const [countRotZ,setCountRotZ] = useState(0)
  const [previousCountRotZ,setPreviousCountRotZ] = useState(0)

	const [countPosX,setCountPosX] = useState(0)
  const [previousCountPosX,setPreviousCountPosX] = useState(0)
	const [countPosY,setCountPosY] = useState(0)
  const [previousCountPosY,setPreviousCountPosY] = useState(0)
  const [countPosZ,setCountPosZ] = useState(0)
  const [previousCountPosZ,setPreviousCountPosZ] = useState(0)
  const [rotY, setPosCount] = useState(0)
	const [newCastlePos, setCastlePos] = useState(0)
  const [clickCoordinateX, setclickCoordinateX] = useState(0)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalInput, setModalInput] = useState("")

  useEffect(() => {
    setCastleModels(props.castle_models)
  });

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
   }
  }

  const openModal = (type) =>  {
    var new_modal_content;
    if(type=="add_report"){
      new_modal_content =<div>

                          </div>

    }else if(type=="confirmation_to_add_model"){
      if(selectedCastleToAdd==""){
        new_modal_content = <div>
                              <h2>追加する建物を選んでください</h2>
                              <div>
                                現在の積み上げポイント: {props.castle.castle_part_point}
                              </div>
                            </div>
      }else if(props.castle.castle_part_point-selectedCastleToAdd["castle_part_point"]>=0){
        new_modal_content = <div>
                              <h2>{selectedCastleToAdd["displayed_name"]}を追加しますか？</h2>
                              <div>
                                積み上げポイント: {props.castle.castle_part_point} → {props.castle.castle_part_point-selectedCastleToAdd["castle_part_point"]}
                              </div>
                              <button onClick={()=>addCastle(selectedCastleToAdd["three_d_model_name"])}>城に追加する</button>
                            </div>
      }else{
        new_modal_content = <div>
                              <h2>積み上げポイントが足りません！</h2>
                              <div>
                                必要な積み上げポイント: {selectedCastleToAdd["castle_part_point"]}
                              </div>
                              <div>
                                現在の積み上げポイント: {props.castle.castle_part_point}
                              </div>
                            </div>
      }
      setModalContent(new_modal_content)
    }

    setModalIsOpen(true)
  }
  const afterOpenModal = () => {

  }
  const closeModal = () =>  {
    setModalInput("")
    setModalIsOpen(false)
  }
  const handleChange = (e) => {
    setModalInput(e.target.value)
  }

  const postReport = () =>{

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

    const data = { report: {content: modalInput, user_id: props.user_id, castle_id: props.castle_id}}

    fetch('/reports',{
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {

      props.fetchCastles("user", props.user_id, false)
    })
    .then(()=>{
      setModalInput("")
      setModalIsOpen(false)
    })
  }


  const handleClick = () => {
    setPosCount(rotY+1)
  };

  const destroyCastle = () => {
	 setCountPosX(countPosX-1)
 }

  const showUserPage = (user_id) =>{
     props.fetchCastles("user", user_id, true)
  }

  const addCastle = (new_model_name) =>{
      setSelectedCastleToAdd("")
      closeModal()
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

      var model_name_list = [ "castle.glb", "castle.glb"]
      //var model_name_list = [ "wall_01.glb", "castle.glb"]
      const data = { castle_part: {
                            castle_id: props.castle_id,
                            three_d_model_name: new_model_name,
                            position_x: 0,
                            position_y: 0,
                            position_z: 0,
                            angle_x: 0,
                            angle_y: 0,
                            angle_z: 0,
                          }};

      fetch('/castle_parts',{
        method: 'POST',
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then((result) => {
        if(result[0] == "Cannot add castle_part without castle_part_point"){
          alert("積み上げポイントが足りません！")
        }
        props.fetchCastles("user", props.user_id, false)
      })
  }


  const cangeEditModel = (model_number) =>{
    setPreviousCountPosX(castleModels[model_number]["position_x"])
    setPreviousCountPosY(castleModels[model_number]["position_y"])
    setPreviousCountPosZ(castleModels[model_number]["position_z"])
    setEditModelNumber(model_number)
  }

  const updateCastleParts = () =>{
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

    var update_castle_parts_list = []
    for(var i=0; i<castleModels.length; i++){
        update_castle_parts_list[i] = {id: castleModels[i].id,
                           castle_id: props.castle_id,
                           three_d_model_name: castleModels[i].three_d_model_name,
                           position_x: castleModels[i].position_x,
                           position_y: castleModels[i].position_y,
                           position_z: castleModels[i].position_z,
                           angle_x: castleModels[i].angle_x,
                           angle_y: castleModels[i].angle_y,
                           angle_z: castleModels[i].angle_z,
                          }
    }


    const data = { castle_parts: update_castle_parts_list};
    fetch( "/castle_parts/update",{
      method: 'PATCH',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      alert(result[0])
    })
  }

  var UseModel = (props) =>{
    var {model_number, position, rotation, modelpath} = props
    if(!(rotation==null)){
      rotation[1] = rotation[1] - Math.PI / 4
    }

    //-Math.PI / 2
    if(modelpath==null){
      modelpath="wall_01.glb"
    }

  	return (
  		<mesh  onClick={()=>{cangeEditModel(model_number)}} position = {position} rotation={rotation}>
  			<Suspense fallback={null}>
  					<LoadModel modelpath={"/" + modelpath}/>
  			</Suspense>
  		</mesh>
  	)
  }



  var castle = [];
  for(var i=0; i<castleModels.length; i++){
    if(!(castleModels[i]["three_d_model_name"]==null)){
      castle.push(<UseModel model_number={i} position={[castleModels[i]["position_x"], castleModels[i]["position_y"], castleModels[i]["position_z"]]} rotation={[castleModels[i]["angle_x"], castleModels[i]["angle_y"], castleModels[i]["angle_z"]]} modelpath={castleModels[i]["three_d_model_name"]} />)
    }
  }

  var castle_selected_to_add;
  if (selectedCastleToAdd!=""){
    castle_selected_to_add = <UseModel model_number={castleModels.length} position={[0, 1, 0]} rotation={[0, 0, 0]} modelpath={selectedCastleToAdd["three_d_model_name"]} />
  }
  var user_infomation_on_castle = <div></div>
  if(props.tag_class=="castle_at_group"){
    user_infomation_on_castle = <div class="name-and-icon-of-user-built-castle-at-group-page">
                                   <img class = "user-icon" src={require("../../assets/images/default/" + props.user_icon)} />
                                   <div class = "user-name" onClick={()=>showUserPage(props.user_id)}>{props.user_name}</div>
                                </div>
  }




  const useMove = () => {
    const [state, setState] = useState({x: 0, y: 0})

    const handleMouseMove = e => {
        e.persist()
        setState({x: e.clientX, y: e.clientY})
      }
      return {
        x: state.x,
        y: state.y,
        handleMouseMove,
      }
  }

  const useClick = () => {
    const [clickCoordinate, setClickCoordinate] = useState({x: 0, y: 0})

    const handleMouseClick = e => {
        e.persist()
        setClickCoordinate({x: e.clientX, y: e.clientY})
      }
      return {
        click_x: clickCoordinate.x,
        click_y: clickCoordinate.y,
        handleMouseClick,
      }
  }

  const {x, y, handleMouseMove} = useMove()
  const {click_x, click_y, handleMouseClick} = useClick()
  const [mouseIsDown, setMouseIsDown] = useState(false)


  var move_amount_x;
  var move_amount_y;
  if(mouseIsDown){
    move_amount_x = x-click_x
    move_amount_y = y-click_y
  }else{
    move_amount_x = 0
    move_amount_y = 0
  }
  var tabs = <div></div>;
  var edit_castle_contents = <div></div>;
  var castle_part_point = <div></div>;
  var open_report_modal_button = <div></div>
  var report_list = <div></div>
  var save_castle_parts_button = <div></div>
  var add_castle_button = <div></div>
  var edit_castle_parts_sliders = <div></div>
  if(props.tag_class=="castle_at_user_page"){
    var new_report_list = []
    if (!(props.castle_reports[0].content == null)){
        for(var i=0; i<props.castle_reports.length; i++){
          new_report_list.push(<p class = "report-content p-3 mb-2 bg-info text-white">今日の積み上げ: {props.castle_reports[i].content}</p>)
        }
    }
    var castle_part_price_list = []
    var temppp = []
    for(var i=0; i<props.castle_part_price_list.length; i++){
      const num = i
      castle_part_price_list.push(<div>
                                    <button class = "p-3 mb-2 bg-info text-white" onClick={() => {setSelectedCastleToAdd(props.castle_part_price_list[num])}}>
                                        {props.castle_part_price_list[i]["displayed_name"]+"  必要ポイント: "+ props.castle_part_price_list[num]["castle_part_point"]}
                                    </button>
                                  </div>)

    }




    edit_castle_contents= <div class="edit-castle-contents-wrapper">
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                  <a onClick={()=>setSelectedCastleToAdd("")} class="nav-link active" id="nav-tumiage-tab" data-bs-toggle="tab" href={"#nav-tumiage-"+props.castle.castle_name} role="tab" aria-controls="nav-tumiage" aria-selected="true">積み上げ</a>
                                  <a onClick={()=>setSelectedCastleToAdd("")} class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" href={"#nav-add-model-"+props.castle.castle_name} role="tab" aria-controls="nav-add-model" aria-selected="false">増築</a>
                                  <a onClick={()=>setSelectedCastleToAdd("")} class="nav-link " id="nav-home-tab" data-bs-toggle="tab" href={"#nav-move-model-"+props.castle.castle_name} role="tab" aria-controls="nav-move-model" aria-selected="false">移動</a>
                                </div>
                              </nav>
                              <div class="tab-content" id="nav-tabContent">
                                <div class="tab-pane fade show active" id={"nav-tumiage-"+props.castle.castle_name} role="tabpanel" aria-labelledby="nav-home-tab">
                                  <div class="bg-warning">積み上げポイント <div class="castle-point-at-user-page">{props.castle.castle_part_point}</div></div>
                                  {new_report_list}
                                  <button onClick = {() => openModal("add_report")}>積み上げを登録する</button>
                                </div>
                                <div class="tab-pane fade show add-3d-model" id={"nav-add-model-"+props.castle.castle_name} role="tabpanel" aria-labelledby="nav-add-model-tab">
                                  <div class="bg-warning">積み上げポイント <div class="castle-point-at-user-page">{props.castle.castle_part_point}</div></div>
                                  {castle_part_price_list}
                                  <p></p>
                                  <button onClick={()=>openModal("confirmation_to_add_model")}>3Dモデルを追加</button>
                                </div>
                                <div class="tab-pane fade show " id={"nav-move-model-"+props.castle.castle_name} role="tabpanel" aria-labelledby="nav-move-model-tab">
                                  <button onClick = {()=> updateCastleParts()}>変更を保存</button>
                                  <div>
                                      <div class = "move-sliders move-x-slider"
                                            onMouseMove={(e)=>{
                                              handleMouseMove(e);
                                              if(mouseIsDown){
                                                var new_castle_models = castleModels
                                                new_castle_models[editModelNumber]["position_x"] = previousCountPosX+(x-click_x)*0.1
                                                setCastleModels(new_castle_models)
                                              }
                                            }}
                                            onMouseDown={(e) => {
                                              handleMouseClick(e);
                                              setMouseIsDown(true);
                                            }}
                                            onMouseUp={()=>{
                                              setMouseIsDown(false);
                                              setPreviousCountPosX(castleModels[editModelNumber]["position_x"])
                                            }}
                                      >
                                          ← X ({Math.floor(castleModels[editModelNumber]["position_x"] * 100)/100}) →
                                      </div>
                                      <div class = "move-sliders move-y-slider"
                                            onMouseMove={(e)=>{
                                              handleMouseMove(e);
                                              if(mouseIsDown){
                                                var new_castle_models = castleModels
                                                new_castle_models[editModelNumber]["position_y"] = previousCountPosY+(x-click_x)*0.1
                                                setCastleModels(new_castle_models)
                                              }
                                            }}
                                            onMouseDown={(e) => {
                                              handleMouseClick(e);
                                              setMouseIsDown(true);
                                            }}
                                            onMouseUp={()=>{
                                              setMouseIsDown(false);
                                              setPreviousCountPosY(castleModels[editModelNumber]["position_y"])
                                            }}
                                      >
                                          ← Y ({Math.floor(castleModels[editModelNumber]["position_y"] * 100)/100}) →
                                      </div>
                                      <div class = "move-sliders move-z-slider"
                                            onMouseMove={(e)=>{
                                              handleMouseMove(e);
                                              if(mouseIsDown){
                                                var new_castle_models = castleModels
                                                new_castle_models[editModelNumber]["position_z"] = previousCountPosZ+(x-click_x)*0.1
                                                setCastleModels(new_castle_models)
                                              }
                                            }}
                                            onMouseDown={(e) => {
                                              handleMouseClick(e);
                                              setMouseIsDown(true);
                                            }}
                                            onMouseUp={()=>{
                                              setMouseIsDown(false);
                                              setPreviousCountPosZ(castleModels[editModelNumber]["position_z"])
                                            }}
                                      >
                                          ← Z ({Math.floor(castleModels[editModelNumber]["position_z"] * 100)/100}) →
                                      </div>

                                      <div class = "move-sliders move-x-slider"
                                            onMouseMove={(e)=>{
                                              handleMouseMove(e);
                                              if(mouseIsDown){
                                                var new_castle_models = castleModels
                                                new_castle_models[editModelNumber]["angle_x"] = previousCountRotX+(x-click_x)*0.01
                                                setCastleModels(new_castle_models)
                                              }
                                            }}
                                            onMouseDown={(e) => {
                                              handleMouseClick(e);
                                              setMouseIsDown(true);
                                            }}
                                            onMouseUp={()=>{
                                              setMouseIsDown(false);
                                              setPreviousCountRotX(castleModels[editModelNumber]["angle_x"])
                                            }}
                                      >
                                          🔄 X ({Math.floor(castleModels[editModelNumber]["angle_x"] / Math.PI * 180 * 100)/100})度 🔄
                                      </div>
                                      <div class = "move-sliders move-y-slider"
                                            onMouseMove={(e)=>{
                                              handleMouseMove(e);
                                              if(mouseIsDown){
                                                var new_castle_models = castleModels
                                                new_castle_models[editModelNumber]["angle_y"] = previousCountRotY+(x-click_x)*0.01
                                                setCastleModels(new_castle_models)
                                              }
                                            }}
                                            onMouseDown={(e) => {
                                              handleMouseClick(e);
                                              setMouseIsDown(true);
                                            }}
                                            onMouseUp={()=>{
                                              setMouseIsDown(false);
                                              setPreviousCountRotY(castleModels[editModelNumber]["angle_y"])
                                            }}
                                      >
                                          🔄 Y ({Math.floor(castleModels[editModelNumber]["angle_y"] / Math.PI * 180 * 100)/100})度 🔄
                                      </div>
                                      <div class = "move-sliders move-z-slider"
                                            onMouseMove={(e)=>{
                                              handleMouseMove(e);
                                              if(mouseIsDown){
                                                var new_castle_models = castleModels
                                                new_castle_models[editModelNumber]["angle_z"] = previousCountRotZ+(x-click_x)*0.01
                                                setCastleModels(new_castle_models)
                                              }
                                            }}
                                            onMouseDown={(e) => {
                                              handleMouseClick(e);
                                              setMouseIsDown(true);
                                            }}
                                            onMouseUp={()=>{
                                              setMouseIsDown(false);
                                              setPreviousCountRotZ(castleModels[editModelNumber]["angle_z"])
                                            }}
                                      >
                                          🔄 Z ({Math.floor(castleModels[editModelNumber]["angle_z"] / Math.PI * 180 * 100)/100})度 🔄
                                      </div>
                                  </div>
                                </div>
                              </div>
                          </div>


  }



  return (
    <div class={props.tag_class}>
      <div class="header-and-canvas-wrapper">
        <div class="castle-header-at-goup-page">
          {user_infomation_on_castle}
          <h2>{props.castle_name} 城</h2>
        </div>
        <div class="canvas">
      		<Canvas >
    				<CameraController />
      			<Camera position={[0, 4, 10]}  rotation={[Math.PI/24*(countRotX-6), Math.PI/24*countRotY, Math.PI/24*countRotZ]}/>
      			<gridHelper args={[100, 100, 0X696969, 0X696969]} position={[0, 0, 0]}/>
      			<pointLight position={[10, -20, 70]} />
    				<pointLight position={[0, 100, -150]} />

            {castle}
            {castle_selected_to_add}



      		</Canvas>
        </div>
      </div>
      {edit_castle_contents}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {modalContent}
      </Modal>
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
