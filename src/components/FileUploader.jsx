import '../styles/Login.css'
import { useRef, useState } from "react"

//TODO: Thumbnails of user selected images 

//https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop

export default function FileUploader({setPicture}){

    const [file, setFile] = useState(null)
    //idle, success, uploading, error
    const inputRef = useRef(null)

    function handleFileChange(e){
        if(e.target.files){
            setPicture(e.target.files[0]);
            setFile(e.target.files[0]);
            console.log('Archivo cargado', e.target.files[0].name)
        }
    }

    function handleDrop(e){
        console.log(e.dataTransfer.files)
    }


    return (
        <div>
            <button onClick={()=>{inputRef.current.click()}} onDrop={handleDrop} id='dragZone'>Select or drag a picture 🖼️</button>
            <input type="file" onChange={handleFileChange} accept="image/*" id='fileElem' ref={inputRef} />
            
            {file && (
             <div>
                 <p>File name: {file.name}</p>
                 <p>File name: {(file.size / 1024).toFixed(2)} KB</p>
                 <p>File type: {file.type}</p>
             </div>
            )}

        </div>
    )
}