export default function Player({name, money, picture, cards }){
    return (
        <div className="playerCard">
            <span>{name}</span>
            <span>{money}$</span>
            {cards && cards.map((card)=>{
                return (<img src={`../assets/cartas${card}`}/>)
            })}
            {picture && <img src={picture} alt="Player picture" />}
        </div>
    )
}