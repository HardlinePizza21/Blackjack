export default function Player(player){
    
    const {name, picture, money, state} = player

    return ( 
        <div className="playerCard">

            <span>{name}</span>
            {/* Implementar el manejo de imagenes despues <img src={picture}/> */}
            <span>{money}</span>
            
        </div>
    )
}