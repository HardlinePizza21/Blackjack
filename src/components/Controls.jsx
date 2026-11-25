import { useState } from 'react'
import { socket } from '../socket'

const MIN_BET = 10

export default function Controls({ me, phase, isTurn, timeLeft }) {
    const [amount, setAmount] = useState(50)
    const [error, setError] = useState('')

    if (!me) return null

    function bet() {
        socket.emit('bet', amount, (err) => setError(err ?? ''))
    }

    if (phase === 'betting' && me.status !== 'waiting') {
        return (
            <div className="controls">
                <span>Apuesta ({timeLeft}s) — saldo {me.money}$</span>
                <input
                    type="number"
                    min={MIN_BET}
                    max={me.money}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <button onClick={bet}>{me.status === 'bet' ? `Cambiar apuesta (${me.bet}$)` : 'Apostar'}</button>
                {error && <span className="error">{error}</span>}
            </div>
        )
    }

    if (phase === 'playing' && isTurn) {
        return (
            <div className="controls">
                <span>Tu turno: {timeLeft}s</span>
                <button onClick={() => socket.emit('hit')}>Pedir carta</button>
                <button onClick={() => socket.emit('stand')}>Plantarse</button>
            </div>
        )
    }

    return null
}
