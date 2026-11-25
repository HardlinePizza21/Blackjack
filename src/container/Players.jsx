import Player from '../components/Player.jsx'

export default function Players({ players, myId, currentId, secondsLeft }) {
    return (
        <div id="players">
            {players.map((player) => (
                <Player
                    key={player.id}
                    {...player}
                    isMe={player.id === myId}
                    isTurn={player.id === currentId}
                    timeLeft={secondsLeft}
                />
            ))}
        </div>
    )
}
