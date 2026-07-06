import { useState, useRef } from "react"
import { socket } from "../socket"
import FileUploader from "../components/FileUploader"


function Login({onLog}) {
    const [name, setName] = useState('')
    const [picture, setPicture] = useState(null)

    const [statusMessage, setStatusMessage] = useState();

    const timer = useRef(null)




    function availableName(name) {
        socket.emit("availableName", name, (response) => {
            console.log(name, response)
            if (response) {
                setStatusMessage('✅ disponible')
            } else {
                setStatusMessage('❌ Nombre ocupado')
            }

        })

    }

    function handleChange(e) {
        const inputName = e.target.value
        setName(inputName)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            availableName(inputName)
        }, 1300)
    }

    return (
        <div id="content">
            <div id="login-card">
                <div id="header">
                    <h2></h2>
                    <h4></h4>
                </div>
                <div id="form">
                    <h4>Nickname</h4>
                    <input
                        onChange={handleChange}
                        value={name}
                        type="text"
                    />
                    {statusMessage && name !== '' && <h6>{statusMessage}</h6>}

                    <FileUploader setPicture={setPicture} />

                    <button 
                        onClick={() => {
                            // onLog(name, picture)
                            console.log(picture)
                        }} 
                    >Jugar!</button>
                </div>
                <div id="testimonial-card">
                    <h5>User name</h5>
                    {/* <img src="" alt=""/> */}
                    {picture && (
                        <img src={picture} alt="player picture" width={250}/>
                    )}
                    <img src={URL.createObjectURL(picture)} alt="player picture" width={250}/>
                    <h6>1000$</h6>
                </div>
            </div>
            <div id="footer">
                HardlinePizza info
            </div>
        </div>
    )
}
export default Login