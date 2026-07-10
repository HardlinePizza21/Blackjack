import { useState, useRef } from "react"
import { socket } from "../socket"
import FileUploader from "../components/FileUploader"


function Login({ onLog }) {
    const [name, setName] = useState('')
    const [picture, setPicture] = useState(null)
    const [statusMessage, setStatusMessage] = useState();
    const timer = useRef(null)

    function availableName(name) {
        return new Promise((resolve) => {
            socket.emit("availableName", name, (response) => {
                if (response) {
                    setStatusMessage('✅ disponible')
                } else {
                    setStatusMessage('❌ Nombre ocupado')
                }
                resolve(response)
            })
        })
    }

    function handleChange(e) {
        const inputName = e.target.value
        setName(inputName)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            availableName(inputName)
        }, 500)
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
                    {statusMessage && <h6>{statusMessage}</h6>}

                    <FileUploader setPicture={setPicture} />

                    <button
                        onClick={async () => {
                            if (!name) {
                                setStatusMessage('❌ Debes ingresar un nombre')
                                return;
                            }

                            const isAvailable = await availableName(name)
                            if (!isAvailable) {
                                setStatusMessage('❌ El nombre ya no está disponible')
                                return;
                            }

                            onLog(name, picture)
                        }}
                    >Jugar!</button>
                </div>
                <div id="testimonial-card">
                    {name && <h5>{name}</h5>}
                    {picture && (
                        <img src={URL.createObjectURL(picture)} alt="player picture" width={250} />
                    )}
                    {name && <h6>1000$</h6>}
                </div>
            </div>
            <div id="footer">
                HardlinePizza info
            </div>
        </div>
    )
}
export default Login