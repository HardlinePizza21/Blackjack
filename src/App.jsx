import './styles/App.css'
import Game from './pages/Game'
import Login from './pages/Login'
import {useState} from 'react'

// Se reduce la imagen para enviarla por el socket como data URL
async function toAvatar(file, size = 96) {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const scale = Math.max(size / bitmap.width, size / bitmap.height)
  const w = bitmap.width * scale
  const h = bitmap.height * scale
  canvas.getContext('2d').drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h)
  return canvas.toDataURL('image/jpeg', 0.8)
}

function App() {

  const [logged, setLogged] = useState(false)
  const [player, setPlayer] = useState({})

  async function handleLog(name, picture) {
    setPlayer({name, picture: picture ? await toAvatar(picture) : null})
    setLogged(true);
  }

  if(logged){
    return <Game playerProfile={player}/>
  }else {
    return <Login onLog={handleLog}/>
  }


}

export default App
