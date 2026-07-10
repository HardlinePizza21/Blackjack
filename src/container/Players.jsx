import { useEffect, useState } from 'react'
import Player from '../components/Player.jsx'
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../socket.js';


//TODO: implement newPLayer and leave 


export default function Players({initialPlayers}) {

    const [players, setPlayers] = useState(initialPlayers);

    console.log(initialPlayers)

    useEffect(() => {

        socket.on('player has joined', (newPlayers) => {
            console.log("nuevo jugador se ha unido", newPlayers)
            setPlayers(newPlayers)
        })

        socket.on('player has left', (newPlayers) => {
            setPlayers(newPlayers)
        })

        return () => {
            socket.off('player has joined')
            socket.off('player has left')
        }

    }, [players])

    return (
        <>
            {players && players.map((player) => {
                const uuid = uuidv4();
                return <Player key={uuid} {...player} />
            })}
        </>


    )






}