import {useState} from 'react'
import './Game.css'
import Player from './components/Player.jsx'
import { v4 as uuidv4 } from 'uuid';



//TODO: Implement players 
const initialSocketPlayers = [
    {
        name: 'Samuel Madrid',
        money: 1000,
        picture: '/url',
        state: 'deciding'
    },    
    {
        name: 'Pachi',
        money: 1000,
        picture: '/url',
        state: 'deciding'
    },
    {
        name: 'Nashe',
        money: 1000,
        picture: '/url',
        state: 'deciding'
    }
    
]


export default function Players(){

    const [players, setPlayers] = useState(initialSocketPlayers)
    
    return (
        <>
            {players.map((player)=>{
                const uuid = uuidv4();
                return <Player key={uuid} player={player}/>
            })}
        </>


    )






}