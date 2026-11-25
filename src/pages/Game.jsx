import '../styles/Game.css'
import Table from '../components/Table'
import Card from '../components/Card'
import Controls from '../components/Controls'
import { socket } from '../socket'
import { useEffect, useState } from 'react'
import Players from '../container/Players'

const PHASE_LABEL = {
  idle: 'Esperando jugadores',
  betting: 'Hagan sus apuestas',
  playing: 'Jugando',
  dealer: 'Juega la casa',
  results: 'Resultados'
}

function Game({ playerProfile }) {
  const [myId, setMyId] = useState(null)
  const [state, setState] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(null)

  useEffect(() => {
    const onState = (newState) => {
      setState(newState)
      setSecondsLeft(newState.timeLeft == null ? null : Math.ceil(newState.timeLeft / 1000))
    }

    socket.on('state', onState)
    socket.emit('newPlayer', playerProfile, (response) => {
      if (!response) return
      setMyId(response.id)
      onState(response.state)
    })

    return () => {
      socket.off('state', onState)
      socket.emit('leave')
    }
  }, [playerProfile])

  // La cuenta regresiva se reinicia con cada estado nuevo del servidor
  useEffect(() => {
    if (secondsLeft == null) return
    const timeout = setTimeout(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(timeout)
  }, [secondsLeft, state])

  if (!state) return <Table />

  const me = state.players.find(p => p.id === myId)

  return (
    <>
      <Table />
      <div id="game">
        <div id="dealer">
          <h3>Casa {state.dealer.total != null && `· ${state.dealer.total}`}</h3>
          <div className="cards">
            {state.dealer.cards.map((card, i) => <Card key={i} card={card} />)}
          </div>
          <h4>{PHASE_LABEL[state.phase]}{state.phase === 'betting' && secondsLeft != null && ` · ${secondsLeft}s`}</h4>
        </div>
        <Players players={state.players} myId={myId} currentId={state.currentId} secondsLeft={secondsLeft} />
        <Controls me={me} phase={state.phase} isTurn={state.currentId === myId} timeLeft={secondsLeft} />
      </div>
    </>
  )
}

export default Game
