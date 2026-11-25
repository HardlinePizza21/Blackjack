import { Server } from "socket.io";
import { Game } from "./game.js";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    },
    maxHttpBufferSize: 2e6
});

const game = new Game((state) => io.emit('state', state))

io.on("connection", (socket) => {

    console.log(`Se conecto un usuario ${socket.id}`)

    socket.on('availableName', (name, callback) => {
        //Retorna verdadero si el nombre esta disponible, y falso si esta ocupado
        callback(!game.isNameTaken(name))
    })

    socket.on('newPlayer', (player, callback) => {
        if (!game.findPlayer(socket.id)) {
            if (!player?.name || game.isNameTaken(player.name)) return callback?.(null)
            game.addPlayer(socket.id, player)
        }
        callback?.({ id: socket.id, state: game.snapshot() })
    })

    socket.on('bet', (amount, callback) => callback?.(game.placeBet(socket.id, amount)))
    socket.on('hit', () => game.hit(socket.id))
    socket.on('stand', () => game.stand(socket.id))

    socket.on('leave', () => game.removePlayer(socket.id))
    socket.on('disconnect', () => game.removePlayer(socket.id))
});

io.listen(4000);
