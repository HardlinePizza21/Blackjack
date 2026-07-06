import { Server } from "socket.io";
import { writeFile } from "fs";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

const names = ["sam"]


io.on("connection", (socket) => {

    console.log(`Se conecto un usuario ${socket.id}`)

    socket.on("upload", (file, callback) => {
        console.log(file); // <Buffer 25 50 44 ...>

        // save the content to the disk, for example
        writeFile("/tmp/upload", file, (err) => {
            callback({ message: err ? "failure" : "success" });
        });
    });

    socket.on('availableName',(name, callback) =>{

        //Retorna verdadero si el nombre esta disponible, y falso si esta ocupado
        callback(names.find(n=>name===n)? false : true)

        console.log(name, names.find(n=>name===n)? false : true)

    })

});

io.listen(4000);