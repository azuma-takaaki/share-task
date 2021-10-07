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
      <p></p>
    </div>
  )
}


export default UploadImageCanvas
