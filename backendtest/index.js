import { Server } from "socket.io";
import { writeFile } from "fs";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

const players = []

io.on("connection", (socket) => {

    console.log(`Se conecto un usuario ${socket.id}`)

    socket.on("upload", (file, callback) => {
        // save the content to the disk, for example
        writeFile("/tmp/upload", file, (err) => {
            callback({ message: err ? "failure" : "success" });
        });
    });

    socket.on('availableName', (name, callback) => {

        //Retorna verdadero si el nombre esta disponible, y falso si esta ocupado
        callback(players.find(p => name === p.name) ? false : true)


    })

    socket.on('newPlayer', (player, callback) => {

        players.push(player)

        callback(players)
        io.emit('player has joined', players)
        
        console.log(players)
        
    })
    
    socket.on('leave', (player) => {
        players.splice(players.indexOf(player),1)

        io.emit('player has left', players)

        console.log(players)
    })

});

io.listen(4000);