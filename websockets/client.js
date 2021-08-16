const io = require("socket.io-client");
console.time("ws")
const socket = io("http://localhost:4000", {
    transports: ["websocket", "polling"] // use WebSocket first, if available
})

socket.on("connect", () => {
    console.timeEnd("ws")
    console.log(socket.id);
});

socket.on("connect_error", () => {
    // revert to classic upgrade
    socket.io.opts.transports = ["polling", "websocket"];
})

// setTimeout(() => {
console.time("clientRTT")
socket.emit("getData");
console.timeEnd("clientRTT")
// }, 5000)

socket.on("Response", (arg) => {
    
    console.log(arg)
})

