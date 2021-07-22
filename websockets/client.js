const io = require("socket.io-client");
const socket = io("http://localhost:4000")
setTimeout(()=>{
    socket.emit("getData");
},5000)

socket.on("Response",(arg)=>{
    console.log(arg)
})

