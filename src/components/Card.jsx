const RED = ['♥', '♦']

export default function Card({ card }) {
    if (!card) return <div className="card card-back" />
    return (
        <div className={`card ${RED.includes(card.suit) ? 'red' : ''}`}>
            <span>{card.rank}</span>
            <span>{card.suit}</span>
        </div>
    )
}
