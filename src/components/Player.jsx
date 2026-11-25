import Card from './Card'

const RESULT_LABEL = {
    blackjack: 'Blackjack!',
    win: 'Gana',
    push: 'Empate',
    lose: 'Pierde'
}

const STATUS_LABEL = {
    waiting: 'Espectador',
    betting: 'Apostando...',
    bust: 'Se pasó',
    stand: 'Plantado',
    blackjack: 'Blackjack'
}

export default function Player({ name, money, picture, cards, total, bet, status, result, delta, isTurn, isMe, timeLeft }) {
    const label = result ? RESULT_LABEL[result] : isTurn ? `Turno · ${timeLeft}s` : STATUS_LABEL[status]

    return (
        <div className={`playerCard ${isTurn ? 'turn' : ''} ${isMe ? 'me' : ''} ${result ?? ''}`}>
            <div className="cards">
                {cards?.map((card, i) => <Card key={i} card={card} />)}
            </div>
            {total != null && <span className="total">{total}</span>}
            {picture && <img className="avatar" src={picture} alt="Player picture" />}
            <span className="name">{name}{isMe && ' (tú)'}</span>
            <span>{money}$</span>
            {bet > 0 && <span>Apuesta: {bet}$</span>}
            {label && <span className="label">{label}{result && delta !== 0 && ` (${delta > 0 ? '+' : ''}${delta}$)`}</span>}
        </div>
    )
}
