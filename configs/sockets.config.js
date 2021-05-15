const socketio = require('socket.io')

module.exports = server => {
    const io = socketio(server, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"],
          credentials:true
        }
    })
      
    // --------- IO CONFIG --------- //
    io.on("connection", socket=>{
      console.log('New socket connection')

      socket.on('disconnect', ()=>{
          console.log("User left")
      })
    })
      

}