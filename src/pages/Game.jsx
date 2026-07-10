import '../styles/Game.css'
import Table from '../components/Table'
import {socket} from '../socket'
import { useEffect, useState } from 'react'
import Players from '../container/Players'

function Game({playerProfile}) {
  const [player, setPlayer] = useState(playerProfile)  
  const [initialPlayers, setInitialPlayers] = useState([]) 


  useEffect(()=>{
    socket.emit('newPlayer', player, (players)=>{
      setInitialPlayers(players)
    })

    return () => {
      socket.emit('leave', player)
    }

  },[player])


  return (
    <>
      <Table />
      <Players initialPlayers={initialPlayers} />
      
    </>
  )
}

export default Game
