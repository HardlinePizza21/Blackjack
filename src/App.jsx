import './App.css'
import Game from './Game'
import Login from './Login'
import {useState} from 'react'

function App() {

  const [logged, setLogged] = useState(false)
  const [player, setPlayer] = useState({})

  function handleLog({name, picture}) {
    setPlayer({name, picture})
    setLogged(true);
  }

  if(logged){
    return <Game player={player}/>
  }else {
    return <Login onLog={handleLog}/>
  }


}

export default App
