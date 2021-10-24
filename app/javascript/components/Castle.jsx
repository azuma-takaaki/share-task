import React, { useState, useRef, useEffect, Suspense, useContext, useCallback, useMemo }  from 'react';
import { Canvas, useLoader, useFrame, useThree, extend, useTexture } from 'react-three-fiber';
import { Vector3, Vector2, PerspectiveCamera } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from "prop-types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"

import Modal from 'react-modal'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as LikeImage} from '@fortawesome/free-solid-svg-icons'
import { faHeart as UnikeImage } from "@fortawesome/free-regular-svg-icons";
import { faTwitter as TwitterImage } from "@fortawesome/free-brands-svg-icons"


extend({ OrbitControls, EffectComposer, RenderPass, OutlinePass, ShaderPass })


const context = React.createContext()


const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = -100;
      controls.maxDistance = 100;
      controls.maxPolarAngle= Math.PI / 4 * 2;
      controls.minPolarAngle= -Math.PI / 4 * 2;

      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

const model_scale = 0.07
const LoadModel = (modelpath) => {
	const gltf = useLoader(GLTFLoader, modelpath.modelpath)
	return (
		<primitive scale={[model_scale, model_scale, model_scale]}  object={gltf.scene.clone(true)} dispose={null} />
	)
}

const Camera = (props) => {
  const ref = useRef()
  const set = useThree((state) => state.set);
  useEffect(() => void set({ camera: ref.current }), []);
  useFrame(() => {
    ref.current.updateMatrixWorld()
  })
  return <perspectiveCamera ref={ref} {...props} />
}




function Castle(props){
  const [iconImageUrl, setIconImageUrl] = useState("")

  const [castleModels, setCastleModels] = useState(props.castle_models)
  const [castleName, setCastleName] = useState(props.castle_name)
  const [reportList, setReportList] = useState(null)
  const [editReportID, setEditReportID] = useState(0)


  const [isLiked, setIsLiked] = useState(true)
  const [currentReportLikes, setCurrentReportLikes] = useState(-1000)

  const [editModelNumber, setEditModelNumber] = useState(0)
  const [editModelRef, setEditModelRef] = useState([])

  const [selectedCastleToAdd, setSelectedCastleToAdd] = useState("")

  const [modalType, setModalType] = useState("add_report")

	const [countRotX,setCountRotX] = useState(0)
  const [previousCountRotX,setPreviousCountRotX] = useState(0)
	const [countRotY,setCountRotY] = useState(0)
  const [previousCountRotY,setPreviousCountRotY] = useState(0)
	const [countRotZ,setCountRotZ] = useState(0)
  const [previousCountRotZ,setPreviousCountRotZ] = useState(0)
  const [displayGrid, setDisplayGrid] = useState(false)

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
  const [sliderValue, setSliderValue] = useState(10)

  const [errorMessages, setErrorMessages] = useState({arr: []})

  const [progressPercentage, setProgressPercentage] = useState("0")
  const [tweetImage, setTweetImage] = useState(<img/>)
  const [selectTwitterAccount, setSelectTwitterAccount] = useState("")
  const canvasRef = useRef()


  const limit_castle_position = 50
  const limit_castle_angle = 360


  useEffect(() => {
    reloadIconImage()
    setCastleModels(props.castle_models)
    if (props.tag_class=="castle_at_group" && currentReportLikes<0){
      setIsLiked(props.castle["report"]["current_report"]["is_liked"])
      setCurrentReportLikes(props.castle["report"]["current_report"]["all_like_number"])
    }else{
      setReportList(props.castle_reports)
    }

  });

  const reloadIconImage = () => {
    if(props.user_id!=undefined||props.user_id!=null){
      fetch("/icon_image/get_image_url?user_id=" + props.user_id  ,{
        method: 'GET'
      }).then(res => res.json())
        .then(
          (result) => {
              setIconImageUrl(result[0])
          }
        )
    }
  }

  let modal_height = window.innerHeight * 0.9
  let customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      'overflow-y'             : 'scroll',
      'max-height'                : modal_height
   }
  };
  window.addEventListener('resize', () => {
      modal_height = window.innerHeight * 0.9
      customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)',
          'overflow-y'          : 'scroll',
          'max-height'          : modal_height
       }
      };
  });


  const openModal = (type, tweet_report_content, tweet_report_created_at, report_num) =>  {
    if(type == "edit_castle"){
      setModalInput(props.castle_name)
    }else if(type == "tweet"){
      if(props.twitter_accounts[0]!=undefined && props.twitter_accounts != null){
        setSelectTwitterAccount(props.twitter_accounts[0].account_name)
      }
      setModalInput("#今日の積み上げ" + "\r" + tweet_report_created_at + "\r\r" + tweet_report_content + "\r\r " +"#積み上げ城")
      setTweetImage(<img class="tweet-image" src={canvasRef.current.toDataURL()} width="250" height="250"/>)
    }else if(type=="edit-report"){
      setModalInput(reportList[report_num].content)
    }

    setErrorMessages({arr: []})
    setModalType(type)
    setModalIsOpen(true)
  }
  const afterOpenModal = () => {

  }
  const closeModal = () =>  {
    setProgressPercentage("0")
    setModalInput("")
    setModalIsOpen(false)
  }
  const handleChange = (e) => {
    setModalInput(e.target.value)
  }

  const handleChangeTwitterAccount = (e) => {
    setSelectTwitterAccount(e.target.value)
  }

  const handleChangeBySlider = (e, edit_property, edited_by_slider) => {
    setSliderValue(e)
    let new_castle_models = castleModels
    if(edited_by_slider){
      new_castle_models[editModelNumber][edit_property] = e
    }else if (edit_property=="angle_y"){
      if(e.target.value==''){
        new_castle_models[editModelNumber][edit_property] = ''
      }else if(e.target.value > limit_castle_angle){
        new_castle_models[editModelNumber][edit_property] = limit_castle_angle / 180 * Math.PI
      }else if(e.target.value <= 0){
        new_castle_models[editModelNumber][edit_property] = 0
      }else{
        new_castle_models[editModelNumber][edit_property] = e.target.value / 180 * Math.PI
      }
    }else{
      if(e.target.value > limit_castle_position){
        new_castle_models[editModelNumber][edit_property] = limit_castle_position
      }else if(e.target.value <  -limit_castle_position){
        new_castle_models[editModelNumber][edit_property] = -limit_castle_position
      }else{
        new_castle_models[editModelNumber][edit_property] = e.target.value
      }
    }
    setCastleModels(new_castle_models)
  }

  const sleep = (waitSec) => {
      return new Promise(function (resolve) {
          setTimeout(function() { resolve() }, waitSec);
      });
  }

  const postReport = () =>{
    setProgressPercentage("20")
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

    const data = { report: {content: modalInput, user_id: props.current_user_id, castle_id: props.castle_id}}
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
      if(result[0]== "Successful registration of report"){
        sleep(300).then(() =>{
          setProgressPercentage("100")
          sleep(1000).then(()=>{
              props.fetchCastles("user", props.current_user_id, false)
              setProgressPercentage("0")
              setModalInput("")
              setModalIsOpen(false)
          })
        })
      }else if(result[0] == "Reports can only be registered once a day"){
        sleep(300).then(() =>{
          setProgressPercentage("0")
          setErrorMessages({arr: ["積み上げは1日1回のみ登録できます"]})
        })
      }
    })
  }

  const updateReport = (update_report_id) =>{
    setProgressPercentage("20")
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

    const data = { content: modalInput}
    fetch('/reports/' + update_report_id,{
      method: 'PATCH',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      if(result[0]== "Success to update content"){
        sleep(300).then(() =>{
          setProgressPercentage("100")
          sleep(1000).then(()=>{
              props.fetchCastles("user", props.current_user_id, false)
              setProgressPercentage("0")
              setModalInput("")
              setModalIsOpen(false)
          })
        })
      }else if(result[0] == "Failed to update content"){
        sleep(300).then(() =>{
          setProgressPercentage("0")
          setErrorMessages({arr: result[1]})
        })
      }
    })
  }


  const handleClick = () => {
    setPosCount(rotY+1)
  };

  const destroyCastle = () => {
    setProgressPercentage("20")
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

    //let model_name_list = [ "wall_01.glb", "castle.glb"]
    const data = { castle: { user_id: props.current_user_id, group_id: props.group_id }}

    fetch("/castles/" + props.castle["castle_id"],{
      method: 'DELETE',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      sleep(300).then(() =>{
        if(result[0] == "succeeded in destroying a castle and group_user" || result[0] == "succeeded in destroying a castle"){
          setProgressPercentage("100")
          sleep(1000).then(()=>{
            setSelectedCastleToAdd("")
            closeModal()
            props.fetchCastles("user", props.current_user_id, false)
            setProgressPercentage("0")
          })
        }else{
          setProgressPercentage("0")
          alert("城の削除に失敗しました")
          alert(result[1])
        }
      })
    })
  }

  const destroyModel = () => {
    setProgressPercentage("20")
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

    //let model_name_list = [ "wall_01.glb", "castle.glb"]
    fetch("/castle_parts/" + castleModels[editModelNumber]["id"],{
      method: 'DELETE',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      }
    })
    .then(res => res.json())
    .then((result) => {
      sleep(300).then(() =>{
        if(result[0] == "succeeded in destroying a castle_part"){
          setProgressPercentage("100")
          sleep(1000).then(()=>{
            closeModal()
            props.fetchCastles("user", props.current_user_id, false)
            setProgressPercentage("0")
          })
        }else{
          setProgressPercentage("0")
          alert("城の部品の削除に失敗しました")
          alert(result[1])
        }
      })
    })
  }

  const tweet = () => {
    setProgressPercentage("20")
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
    const data = { tweet: {text: modalInput, image: canvasRef.current.toDataURL("image/jpeg", 1), account_name: selectTwitterAccount}}
    fetch("/tweets",{
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      sleep(300).then(() =>{
        if(result[0] == "Successful tweet"){
          setProgressPercentage("100")
          sleep(1000).then(()=>{
            closeModal()
            alert("ツイートしました！")
            setProgressPercentage("0")
          })
        }else{
          setProgressPercentage("0")
          alert("ツイートに失敗しました")
          alert(result[1])
        }
      })
    })
  }

  const showUserPage = (user_id) =>{
     props.fetchCastles("user", user_id, true)
  }

  const addCastle = (new_model_name) =>{
      setProgressPercentage("20")
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

      let model_name_list = [ "castle.glb", "castle.glb"]
      //let model_name_list = [ "wall_01.glb", "castle.glb"]
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
        sleep(300).then(() =>{
          if(result[0] == "Cannot add castle_part without castle_part_point"){
            setProgressPercentage("0")
            setErrorMessages({arr: ["積み上げポイントがたりません"]})
          }else{
            setProgressPercentage("100")
            sleep(1000).then(()=>{
              setSelectedCastleToAdd("")
              props.fetchCastles("user", props.current_user_id, false)
              closeModal()
            })
          }
        })
      })
  }

  const changeCastleName = () => {
    setProgressPercentage("20")
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

    let model_name_list = [ "castle.glb", "castle.glb"]
    //let model_name_list = [ "wall_01.glb", "castle.glb"]
    const data = { castle:{name: modalInput}}

    fetch('/castles/' + props.castle_id,{
      method: 'PATCH',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      sleep(300).then(() =>{
        if(result[0] == "Failed to update the castle"){
          setProgressPercentage("0")
          setErrorMessages({arr: result[1]})
        }else{
          setProgressPercentage("100")
          sleep(1000).then(()=>{
            setCastleName(modalInput)
            props.fetchCastles("user", props.current_user_id, false)
            setProgressPercentage("0")
            closeModal()
          })
        }
      })
    })
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

    let update_castle_parts_list = []
    for(let i=0; i<castleModels.length; i++){
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
      if(result[0] == "Successful update of castle_part"){
        alert("お城の変更を保存しました！")
      }else if(result[0] == "Failed to update castle_part"){
        alert("お城の保存に失敗しました")
      }
    })
  }

  const Outline = ({ children }) => {
    const { gl, scene, camera, size } = useThree()
    const composer = useRef()
    const [hovered, set] = useState([])
    const [editModelRef, setEditModelRef] = useState([])
    const aspect = useMemo(() => new Vector2(size.width, size.height), [size])
    useEffect(() => composer.current.setSize(size.width, size.height), [size])
    useFrame(() => composer.current.render(), 1)
    let outline_model_reference = []
    if(props.tag_class=="castle_at_user_page"&&displayGrid){
      outline_model_reference = editModelRef
    }


    return (
      <context.Provider value={setEditModelRef}>
        {children}
        <effectComposer ref={composer} args={[gl]}>
          <renderPass attachArray="passes" args={[scene, camera]} />
          <outlinePass
            attachArray="passes"
            args={[aspect, scene, camera]}
            selectedObjects={outline_model_reference}
            visibleEdgeColor="red"
            edgeStrength={50}
            edgeThickness={1}
          />
          <shaderPass attachArray="passes" args={[FXAAShader]} uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
        </effectComposer>

      </context.Provider>
    )
  }



  function useClickModel(model_number){
    const ref = useState(useRef())
    let onClick = useCallback(() =>  {setEditModelRef([ref.current])
       setEditModelNumber(model_number)
     }, [])
     if(selectedCastleToAdd!=""){
       onClick = useCallback(() =>  {}, [])
     }
    useEffect(() => {
      if(selectedCastleToAdd!=""){
        setEditModelRef([ref.current])
      }else if(model_number==editModelNumber){
        setEditModelRef([ref.current])
      }
    })
    const setEditModelRef = useContext(context)

    return { ref, onClick }
  }



  let UseModel = (props) =>{
    let {model_number, position, rotation, modelpath, add_outline_event} = props
    if(!(rotation==null)){
      rotation[1] = rotation[1] - Math.PI / 2
    }


    if(modelpath==null){
      modelpath="wall_01.glb"
    }

    let model_mesh;
    if(add_outline_event){
      model_mesh = <mesh {...useClickModel(model_number)} position = {position} rotation={rotation}>
                      <Suspense fallback={null}>
                          <LoadModel modelpath={"/" + modelpath}/>
                      </Suspense>
                    </mesh>
    }else{
      model_mesh = <mesh position = {position} rotation={rotation}>
                      <Suspense fallback={null}>
                          <LoadModel modelpath={"/" + modelpath}/>
                      </Suspense>
                    </mesh>
    }

  	return (
      <Suspense fallback={null}>{model_mesh}</Suspense>
  	)
  }



  let castle = [];
  castle.push(<UseModel model_number={-1} position={[0, -0.01, 0]} rotation={[0, 0, 0]} modelpath={"ground.glb"} add_outline_event={false}/>)
  for(let i=0; i<castleModels.length; i++){
    if(!(castleModels[i]["three_d_model_name"]==null)){
      castle.push(<UseModel model_number={i} position={[castleModels[i]["position_x"], castleModels[i]["position_y"], castleModels[i]["position_z"]]} rotation={[castleModels[i]["angle_x"], castleModels[i]["angle_y"], castleModels[i]["angle_z"]]} modelpath={castleModels[i]["three_d_model_name"]} add_outline_event={true}/>)
    }
  }

  let castle_selected_to_add;
  const ref_castle_selected_to_add = useRef()
  if (selectedCastleToAdd!=""){
    castle_selected_to_add = <UseModel ref={ref_castle_selected_to_add} model_number={castleModels.length} position={[0, 1, 0]} rotation={[0, 0, 0]} modelpath={selectedCastleToAdd["three_d_model_name"]} add_outline_event={true}/>
  }
  let user_infomation_on_castle = <div></div>
  if(props.tag_class=="castle_at_group"){
    user_infomation_on_castle = <div class="name-and-icon-of-user-built-castle-at-group-page">
                                   <img class = "user-icon" src={iconImageUrl} />
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

  const clickLikeButton = (report_id, report_list_index) =>{
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
    const data = { like: {user_id: props.current_user_id, report_id: report_id}}
    let method_type = ''
    let fetch_route = ''
    let new_report_list;
    if (props.tag_class=="castle_at_group"){
      if(isLiked){
        fetch_route = '/likes/' + report_id
        method_type = 'DELETE'
      }else{
        fetch_route = '/likes'
        method_type = 'POST'
      }
      setIsLiked(!isLiked)
    }else{
      if(reportList[report_list_index].is_liked){
        fetch_route = '/likes/' + report_id
        method_type = 'DELETE'
      }else{
        fetch_route = '/likes'
        method_type = 'POST'
      }
      new_report_list = reportList
      new_report_list[report_list_index].is_liked = !props.castle_reports[report_list_index].is_liked
      setReportList(new_report_list)
    }

    fetch(fetch_route,{
      method: method_type,
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
      if(result[0] == "Successful registration of like" || result[0] == "Success to destroy like"){
        if (props.tag_class=="castle_at_group"){
          setCurrentReportLikes(result[1])
        }else{
          props.fetchCastles("user", props.current_user_id, false)
          new_report_list = reportList
          new_report_list[report_list_index].all_like_number = result[1]
          setReportList(new_report_list)
        }

      }else if(result[0] == "Failed to register like" || result[0] == "Failed to destroy like"){

      }else{
        alert("error")
      }
    })
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


  let move_amount_x;
  let move_amount_y;
  if(mouseIsDown){
    move_amount_x = x-click_x
    move_amount_y = y-click_y
  }else{
    move_amount_x = 0
    move_amount_y = 0
  }
  let tabs = <div></div>;
  let edit_castle_button = <div></div>
  let edit_castle_contents = <div></div>
  let castle_part_point = <div></div>
  let open_report_modal_button = <div></div>
  let report_list = <div></div>
  let save_castle_parts_button = <div></div>
  let add_castle_button = <div></div>
  let edit_castle_parts_sliders = <div></div>
  if(props.tag_class=="castle_at_user_page"){
    let new_report_list = []
    if (reportList!=null){
      if(reportList[0].content==null){
        const no_report_explanation = "積み上げがありません。\n今日の積み上げ(学習記録)を登録しましょう！"
        new_report_list.push(<div class="no-report-explanation">{no_report_explanation}</div>)
      }else{
        for(let i=0; i<reportList.length; i++){
          new_report_list.push(<div class="report-wrapper">
                                    <div class="edit-report-button-wrapper">
                                      {props.is_logged_in_user ?
                                        <button class="edit-report-button" onClick={()=>{openModal("edit-report",null,null,i), setEditReportID(reportList[i].id)}}>⋯</button>
                                        :
                                        <button class="edit-report-button" ></button>
                                      }
                                    </div>
                                    <p class = "report-content text-white">
                                      {reportList[i].content}
                                    </p>
                                    <div class="report-infomation-wrapper">
                                      <div class="like-button-and-created-at-wrapper">
                                        <div class="created-at-of-report">{reportList[i].created_at}</div>
                                        {reportList[i].is_liked && <button className="like-button" onClick={()=>{clickLikeButton(reportList[i].id, i)}}>
                                                                                    <FontAwesomeIcon icon={LikeImage} style={{"color": "red"}}/>
                                                                               </button>}
                                        {!reportList[i].is_liked && <button className="like-button" onClick={()=>{clickLikeButton(reportList[i].id, i)}}>
                                                                                    <FontAwesomeIcon icon={UnikeImage} style={{"color": "red"}}/>
                                                                                 </button>}

                                        <div class="all-like-number">{reportList[i].all_like_number}</div>
                                        {props.is_logged_in_user ?
                                          <button className="tweet-button" onClick={()=>openModal("tweet",reportList[i].content, reportList[i].created_at)}><FontAwesomeIcon icon={TwitterImage} style={{"color": "blue"}}/></button>
                                          :
                                          <div></div>
                                        }
                                      </div>
                                    </div>
                              </div>
                              )
        }
      }
    }
    let castle_part_price_list = []
    let temppp = []
    for(let i=0; i<props.castle_part_price_list.length; i++){
      castle_part_price_list.push(<div>
                                    <button class = "castle-price-button p-3  text-white" onClick={() => {setSelectedCastleToAdd(props.castle_part_price_list[i])}}>
                                        {props.castle_part_price_list[i]["displayed_name"]+"  必要ポイント: "+ props.castle_part_price_list[i]["castle_part_point"]}
                                    </button>
                                  </div>)

    }

    const convertFromRadianToDegree = (radian, property) =>{
      if(castleModels[editModelNumber][property] == ''){
        return ''
      }else{
        return Math.floor(castleModels[editModelNumber][property] / Math.PI * 180)
      }
    }


    const changeEditNavTab = (nav_tab_type) => {
      setSelectedCastleToAdd("")
      if(nav_tab_type=="move-model"||nav_tab_type=="add-model"||nav_tab_type=="destroy-model"){
        setDisplayGrid(true)
      }else{
        setDisplayGrid(false)
      }
    }

    if(props.is_logged_in_user){
      edit_castle_button = <button class="btn btn-secondary" id={"edit-"+props.castle.castle_name.replace(/\s+/g,"")} onClick={()=>openModal("edit_castle")}>⋯</button>

      edit_castle_contents= <div class="edit-castle-contents-wrapper">
                              <nav>
                                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a onClick={()=>changeEditNavTab("tumiage")} class="nav-link active" id="nav-tumiage-tab" data-bs-toggle="tab" href={"#nav-tumiage-"+props.castle.castle_name.replace(/\s+/g,"")} role="tab" aria-controls="nav-tumiage" aria-selected="true">積み上げ</a>
                                    <a onClick={()=>changeEditNavTab("add-model")} class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" href={"#nav-add-model-"+props.castle.castle_name.replace(/\s+/g,"")} role="tab" aria-controls="nav-add-model" aria-selected="false">増築</a>
                                    <a onClick={()=>changeEditNavTab("move-model")} class="nav-link " id="nav-home-tab" data-bs-toggle="tab" href={"#nav-move-model-"+props.castle.castle_name.replace(/\s+/g,"")} role="tab" aria-controls="nav-move-model" aria-selected="false">移動</a>
                                    <a onClick={()=>changeEditNavTab("destroy-model")} class="nav-link " id="nav-destroy-tab" data-bs-toggle="tab" href={"#nav-destroy-model-"+props.castle.castle_name.replace(/\s+/g,"")} role="tab" aria-controls="nav-destroy-model" aria-selected="false">削除</a>
                                  </div>
                                </nav>
                                <div class="tab-content" id="nav-tabContent">
                                  <div class="tab-pane fade show active" id={"nav-tumiage-"+props.castle.castle_name.replace(/\s+/g,"")} role="tabpanel" aria-labelledby="nav-home-tab">
                                    <div class="castle-point-wrapper ">積み上げポイント: <span class="castle-point-at-user-page">{props.castle.castle_part_point}</span></div>
                                    <div class="all-reports-wrapper">
                                      {new_report_list}
                                    </div>
                                    <button class="btn btn-primary" onClick = {() => openModal("add_report")}>積み上げを登録する</button>
                                  </div>
                                  <div class="tab-pane fade show add-3d-model" id={"nav-add-model-"+props.castle.castle_name.replace(/\s+/g,"")} role="tabpanel" aria-labelledby="nav-add-model-tab">
                                    <div class="castle-point-wrapper ">積み上げポイント: <span class="castle-point-at-user-page">{props.castle.castle_part_point}</span></div>
                                    <div class="castle-price-button-wrapper">
                                      {castle_part_price_list}
                                    </div>
                                    <p></p>
                                    <button class="btn btn-primary" onClick={()=>openModal("confirmation_to_add_model")}>3Dモデルを追加</button>
                                  </div>
                                  <div class="tab-pane fade show " id={"nav-move-model-"+props.castle.castle_name.replace(/\s+/g,"")} role="tabpanel" aria-labelledby="nav-move-model-tab">
                                    <div class="slider-to-edit-castle">
                                          <div class="display-castle-infomation">
                                              左右:
                                              <input
                                                value={castleModels[editModelNumber]["position_x"]}
                                                onChange={(e)=>{
                                                  handleChangeBySlider(e,"position_x", false);
                                                }}
                                                type="number"
                                                min={-50}
                                                max={50}
                                              />
                                          </div>
                                          <Slider
                                              value={castleModels[editModelNumber]["position_x"]}
                                              min={-50}
                                              max={50}
                                              step={0.01}
                                              onChange={(e)=>{
                                                handleChangeBySlider(e,"position_x" ,true);
                                              }}
                                          />
                                    </div>
                                    <div class="slider-to-edit-castle">
                                          <div class="display-castle-infomation">
                                              前後:
                                              <input
                                                value={castleModels[editModelNumber]["position_z"]}
                                                onChange={(e)=>{
                                                  handleChangeBySlider(e,"position_z", false);
                                                }}
                                                type="number"
                                                min={-50}
                                                max={50}
                                              />
                                          </div>
                                          <Slider
                                              value={castleModels[editModelNumber]["position_z"]}
                                              min={-50}
                                              max={50}
                                              step={0.01}
                                              onChange={(e)=>{
                                                handleChangeBySlider(e,"position_z", true);
                                              }}
                                          />
                                    </div>
                                    <div class="slider-to-edit-castle">
                                          <div class="display-castle-infomation">
                                              高さ:
                                              <input
                                                value={castleModels[editModelNumber]["position_y"]}
                                                onChange={(e)=>{
                                                  handleChangeBySlider(e,"position_y", false);
                                                }}
                                                type="number"
                                                min={-50}
                                                max={50}
                                              />
                                          </div>
                                          <Slider
                                              value={castleModels[editModelNumber]["position_y"]}
                                              min={0}
                                              max={25}
                                              step={0.01}
                                              onChange={(e)=>{
                                                handleChangeBySlider(e,"position_y", true);
                                              }}
                                          />
                                    </div>
                                    <div class="slider-to-edit-castle">
                                          <div class="display-castle-infomation">
                                              角度:
                                              <input
                                                value={convertFromRadianToDegree(castleModels[editModelNumber]["angle_y"],"angle_y")}
                                                onChange={(e)=>{
                                                  handleChangeBySlider(e,"angle_y", false);
                                                }}
                                                type="number"
                                                min={0}
                                                max={360}
                                              />
                                          </div>
                                          <Slider
                                              value={castleModels[editModelNumber]["angle_y"]}
                                              min={0}
                                              max={Math.PI*2}
                                              step={0.01}
                                              onChange={(e)=>{
                                                handleChangeBySlider(e,"angle_y", true);
                                              }}
                                          />
                                    </div>
                                    <button class="btn btn-primary" onClick = {()=> updateCastleParts()}>変更を保存</button>
                                  </div>
                                  <div class="tab-pane fade show " id={"nav-destroy-model-"+props.castle.castle_name.replace(/\s+/g,"")} role="tabpanel" aria-labelledby="nav-destroy-model-tab">
                                    <div class="castle-point-wrapper ">積み上げポイント: <span class="castle-point-at-user-page">{props.castle.castle_part_point}</span></div>
                                    <button class="btn btn-primary" onClick={()=>openModal("confirmation_to_destroy_model")}>選択中の城の部品を削除する</button>
                                  </div>
                                </div>
                            </div>
    }else{
      edit_castle_contents= <div class="edit-castle-contents-wrapper">
                              <nav>
                                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a onClick={()=>changeEditNavTab("tumiage")} class="nav-link active" id="nav-tumiage-tab" data-bs-toggle="tab" href={"#nav-tumiage-"+props.castle.castle_name.replace(/\s+/g,"")} role="tab" aria-controls="nav-tumiage" aria-selected="true">積み上げ</a>
                                  </div>
                                </nav>
                                <div class="tab-content" id="nav-tabContent">
                                  <div class="tab-pane fade show active" id={"nav-tumiage-"+props.castle.castle_name.replace(/\s+/g,"")} role="tabpanel" aria-labelledby="nav-home-tab">
                                    <div class="all-reports-wrapper">
                                      {new_report_list}
                                    </div>
                                  </div>
                                </div>
                            </div>
    }


  }

  let like_button = <div></div>
  if (isLiked){
    like_button = <div>
                       <button onClick={()=>{clickLikeButton(props.castle["report"]["current_report"]["id"])}}>
                          <FontAwesomeIcon icon={LikeImage} style={{"color": "red"}}/>
                       </button>
                   </div>
  }else{
    like_button = <div>
                       <button onClick={()=>{clickLikeButton(props.castle["report"]["current_report"]["id"])}}>
                          <FontAwesomeIcon  icon={UnikeImage} style={{"color": "red"}}/>
                       </button>
                   </div>
  }

  let show_page_argument = props.current_user_id
  let report_infomation = <div></div>
  if(props.tag_class=="castle_at_group"){
    show_page_argument = props.user_id
    if(props.castle["report"]["current_report"]["content"]==null){
      report_infomation = <div class="report-infomation">
                            <div class="current-report-date">最新の積み上げ : --/--/--</div>
                            <div class="current-report-content">まだ積み上げがありません</div>
                            <div class="all-report-number">総積み上げ数 : 0</div>
                          </div>
    }else{
      report_infomation = <div class="report-infomation">
                            <div class="current-report-date">{"最新の積み上げ : " + props.castle["report"]["current_report"]["created_at"]}</div>
                            <div class="current-report-content">
                              {props.castle["report"]["current_report"]["content"]}
                              <div class="like-button-and-likes-number">
                                {like_button}
                                {currentReportLikes}
                              </div>
                            </div>
                            <div class="all-report-number">{"総積み上げ数 : " + props.castle["report"]["all_report_number"]}</div>
                          </div>
    }
  }

  let error_flash_content;
  if(errorMessages.arr.length>0){
    error_flash_content = <div class="alert alert-danger" id="error-flash">
                              {errorMessages.arr.map((error_message) => <li>{error_message}</li>)}
                          </div>
  }

  let modal_content;
  if (modalType=="add_report"){
    modal_content = <div>
                      <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                      {error_flash_content}
                      <div class="close-modal"><button class="close-modal　btn-close btn btn-outline-secondary" onClick={closeModal}>×</button></div>
                      <h2>今日の積み上げ</h2>
                      <textarea  class="form-control" 　value={modalInput} onChange={handleChange} placeholder="今日の積み上げ" cols="30" rows="5"></textarea>
                      <button class="btn btn-primary" onClick={() => postReport()}>登録する</button>
                    </div>
  }else if(modalType=="confirmation_to_add_model"){
    if(selectedCastleToAdd==""){
      modal_content = <div>
                          <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                          {error_flash_content}
                          <h2>追加する建物を選んでください</h2>
                          <div>
                            現在の積み上げポイント: {props.castle.castle_part_point}
                          </div>
                      </div>
    }else if(props.castle.castle_part_point-selectedCastleToAdd["castle_part_point"]>=0){
      modal_content = <div>
                          <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                          {error_flash_content}
                          <h2>{selectedCastleToAdd["displayed_name"]}を追加しますか？</h2>
                          <div>
                            積み上げポイント: {props.castle.castle_part_point} → {props.castle.castle_part_point-selectedCastleToAdd["castle_part_point"]}
                          </div>
                          <button class="btn btn-primary" onClick={()=>addCastle(selectedCastleToAdd["three_d_model_name"])}>城に追加する</button>
                      </div>
    }else{
      modal_content = <div>
                          <h2>積み上げポイントが足りません！</h2>
                          <div>
                            必要な積み上げポイント: {selectedCastleToAdd["castle_part_point"]}
                          </div>
                          <div>
                            現在の積み上げポイント: {props.castle.castle_part_point}
                          </div>
                      </div>
    }
  }else if(modalType=="edit_castle"){
    modal_content = <div>
                        <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                        {error_flash_content}
                        <h2>城を編集</h2>
                        <div>
                          城の名前: <input type="text" class="form-control" value={modalInput}  onChange={handleChange} placeholder="城の名前"/>
                        </div>
                        <button class="btn btn-primary" onClick={()=>{changeCastleName()}}>城の名前を変更</button>
                        <button class="btn btn-danger" onClick={()=>{openModal("delete_castle")}}>城を削除</button>
                    </div>
  }else if(modalType=="delete_castle"){
    modal_content = <div>
                        <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                        {error_flash_content}
                        <h2>本当に城を削除してよろしいですか？</h2>
                        <div>城を削除するとその城の積み上げ, 追加した城の部品など全てのデータが削除されます</div>
                        <div>この操作は取り消すことができませんが, 本当に削除してよろしいですか？</div>
                        <button class="btn btn-danger" onClick={()=>{destroyCastle()}}>城を削除する</button>
                        <button class="btn btn-primary" onClick={()=>{openModal("edit_castle")}}>キャンセル</button>
                    </div>
  }else if(modalType=="confirmation_to_destroy_model"){
    modal_content = <div>
                        <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                        {error_flash_content}
                        <h2>選択中の城の部品を削除しますか？</h2>
                        <div>
                          積み上げポイント: {props.castle.castle_part_point} → {props.castle.castle_part_point+1}
                        </div>
                        <button class="btn btn-primary" onClick={()=>destroyModel(editModelNumber)}>削除する</button>
                    </div>
  }else if(modalType=="tweet"){
    let account_select_pull_down;
    let tweet_image_and_button = <div></div>;
    if(props.twitter_accounts[0]==undefined && props.twitter_accounts != null){
      account_select_pull_down = <div>ツイッターアカウントを追加してください</div>
    }else{
      let account_name_array = [];
      tweet_image_and_button = <div>
                                 <textarea type="text" rows="6" class="form-control" value={modalInput}  onChange={handleChange} placeholder="ツイートの内容"/>
                                 {tweetImage}
                                 <button class="btn btn-primary" onClick={()=>tweet()}>ツイートする</button>
                               </div>
      for(let i=0; i<props.twitter_accounts.length; i++){
        if(i==0){
          account_name_array.push(<option value={props.twitter_accounts[i].account_name} selected>{props.twitter_accounts[i].account_name}</option>)
        }else{
          account_name_array.push(<option value={props.twitter_accounts[i].account_name}>{props.twitter_accounts[i].account_name}</option>)
        }
      }
      account_select_pull_down = <div class="select-twitter-account-wrapper">
                                      <select name="example"
                                              class="form-select"
                                              aria-label="Default select example"
                                              value={selectTwitterAccount}
                                              onChange={handleChangeTwitterAccount}
                                      >
                                          {account_name_array}
                                      </select>
                                  </div>
    }

    modal_content = <div class="tweet-modal">
                        <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                        {error_flash_content}
                        <h2>Twitterに投稿</h2>
                        {account_select_pull_down}
                        <a rel="nofollow" class="btn btn-primary" data-method="post" href="/auth/twitter">アカウントを追加する</a>
                        {tweet_image_and_button}
                    </div>
  }else if(modalType=="edit-report"){
    modal_content = <div class="edit-report-modal">
                        <div class="progress-bar" style={{ width: progressPercentage + "%"}}></div>
                        {error_flash_content}
                        <h2>積み上げを編集</h2>
                        <textarea type="text" rows="7" class="" value={modalInput}  onChange={handleChange} placeholder="積み上げを修正"/>
                        <div></div>
                        <button class="btn btn-primary post-new-report-content-button" onClick={()=>updateReport(editReportID)}>積み上げを変更</button>
                    </div>
  }





  return (
    <div class={props.tag_class}>
      {user_infomation_on_castle}
      <div class="header-and-canvas-wrapper">
        <div class="castle-header-at-goup-page">
          <div class="header-wrapper">
            <div onClick={()=>showUserPage(show_page_argument)}>{props.castle_name} 城  {edit_castle_button}</div>
          </div>
          {report_infomation}
        </div>
        <div class="canvas">
      		<Canvas ref={canvasRef} gl={{ preserveDrawingBuffer: true }}>
            {props.tag_class=="castle_at_user_page" && <CameraController />}
      			<Camera position={[0, 4, 10]}  rotation={[Math.PI/24*-2, Math.PI/24*0, Math.PI/24*0]}/>
            {displayGrid && <gridHelper args={[model_scale * 1000, model_scale * 1000, 0X000000, 0X000000]} position={[0, 0, 0]}/>}
            <pointLight position={[500, 500, 0]} intensity={0.3}/>
    				<pointLight position={[-500, 500, 0]} intensity={0.3}/>
            <pointLight position={[0, 500, 500]} intensity={1}/>
            <pointLight position={[0, 500, -500]} intensity={0.3}/>



            <Outline>
              {castle}
              {castle_selected_to_add}
            </Outline>


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
        {modal_content}
      </Modal>
    </div>
  )
}



export default Castle
