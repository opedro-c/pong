import { Server } from "socket.io";

const io = new Server(3000, {
    cors: { origin: '*' },
    
})


io.on('connection', (socket) => {
    console.log('id=' + socket.id)
    socket.on('message', (msg) => {
        console.log('message received: ' + msg);
    })
})

