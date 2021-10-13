import React, { useState, useRef, useEffect}  from 'react';
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Slider from 'rc-slider';


function UploadImageCanvas(props){
  const canvasRef = useRef()
  const [imageFile, setImageFile] = useState("")
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [uploadImageCanvasContext,setUploadImageCanvasContext] = useState(null)
  const [upLoadImage, setUpLoadImage] = useState(new Image())
  const [clickedPosX,setClickedPosX] = useState(0)
  const [clickedPosY,setClickedPosY] = useState(0)
  const [objX,setObjX] = useState(0)
  const [objY,setObjY] = useState(0)
  const [objWidth,setObjWidth] = useState(50)
  const [objHeight,setObjHeight] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [imagePosX, setImagePosX] = useState(0)
  const [imageScale, setImageScale] = useState(300)
  const [canvasScale, setCanvasScale] = useState(300)



   const onMove = (e) => {
        const canvas = document.getElementById("upload-image-canvas")
        var offsetX = canvas.getBoundingClientRect().left;
        var offsetY = canvas.getBoundingClientRect().top;
        let x = e.clientX - offsetX - imageScale/2;
        let y = e.clientY - offsetY - imageScale/2;
        if (dragging) {
          setObjX( x );
          setObjY( y );
        }
    }


  useEffect(()=>{
    const canvas_ref = document.getElementById("upload-image-canvas")
    const canvasContext = canvas_ref.getContext("2d")
    setUploadImageCanvasContext(canvasContext)
  },[])


  const handleFileChange = (e) => {
    e.preventDefault()
    uploadImageCanvasContext.clearRect(0, 0, canvasScale, canvasScale);
    let reader = new FileReader()
    let file = e.target.files[0]
    reader.onloadend = () => {
      setImageFile(file)
      setImagePreviewUrl(reader.result)
      const new_image = upLoadImage
      new_image.src = reader.result
      new_image.onload = () => {
        uploadImageCanvasContext.drawImage(new_image, objX, objY, imageScale, imageScale*new_image.height/new_image.width);
      }
      setUpLoadImage(new_image)
    }
    reader.readAsDataURL(file)
  }

  const rerenderCanvasImage = () =>{
    uploadImageCanvasContext.clearRect(0, 0, canvasScale, canvasScale);
    uploadImageCanvasContext.drawImage(upLoadImage, objX, objY, imageScale, imageScale*upLoadImage.height/upLoadImage.width);
  }

  const handleChangeBySlider = (e) => {
    setImageScale(e)
    rerenderCanvasImage()
    }


  const uploadIconImage = () => {
    props.setProgressPercentage("20")
    let base64 = canvasRef.current.toDataURL("image/jpeg", 1)
    let file_name = "test_icon_image"
    // base64のデコード
    let bin = atob(base64.replace(/^.*,/, ''));
    // バイナリデータ化
    let buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // ファイルオブジェクト生成(この例ではjpegファイル)
    const up_file = new File([buffer.buffer], file_name, {type: "image/jpeg"});
    const url= '/icon_image/get_post_fields?filename=' + up_file.name + "&filetype=" + up_file.type;
    // Rails に GET
    //alert("GET 開始");
    fetch(
      url,
      {method: 'GET'}
    ).then(response => {
          if(response.ok){
            //alert("GET 成功");
            props.setProgressPercentage("40")
            return response.json();
          }
    }).then((data)=>{
          let formdata = new FormData()
          for (let key in data.fields) {
            formdata.append(key,data.fields[key]);
          }
          formdata.append("file",up_file);
          const headers = {
            "accept": "multipart/form-data"
          }

          // S3 に POST
          //alert("POST 開始");
          props.setProgressPercentage("40")
          fetch(
            data.url,
            {
              method: 'POST',
              headers,
              body: formdata
            }
          ).then((response) => {
            if(response.ok){
              //alert("POST 成功");
              props.setProgressPercentage("100")
              props.reloadIconImage()
              return response.text();
            }
          }).then(()=>{
            props.closeModal()
            props.setProgressPercentage("0")
          })
        });
  }


  return (
    <div>
      <canvas ref={canvasRef} id="upload-image-canvas" width={canvasScale} height={canvasScale} onMouseDown={()=>{setDragging(true)}} onMouseMove={(e)=>{onMove(e), rerenderCanvasImage()}} onMouseOut={()=>setDragging(false)} onMouseUp={()=>setDragging(false)}></canvas>
      <Slider
          value={imageScale}
          min={0}
          max={2000}
          step={0.01}
          onChange={(e)=>{
            handleChangeBySlider(e);
          }}
      />
      <div>
        <input type="file" accept='image/*' onChange={handleFileChange}/>
      </div>
      <button class="btn btn-primary" onClick={()=>props.updateData("update_image", canvasRef.current.toDataURL("image/jpeg", 1))}>アイコンを更新</button>
      <button class="btn btn-primary" onClick={()=>uploadIconImage()}>確認</button>
      <p></p>
    </div>
  )
}


export default UploadImageCanvas
