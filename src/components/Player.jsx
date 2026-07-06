export default function Player(name, money, picture){
    return (
        <div className="playerCard">
            <span>{name}</span>
            <span>{money}$</span>
            {/* Implement picture handling <img src={picture} alt="" /> */}
        </div>
    )
}