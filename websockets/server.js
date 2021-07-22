const httpServer = require("http").createServer()
const io = require("socket.io")(httpServer);
const { Kafka } = require('kafkajs')
const produce = require("../kafka/producer.js")

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})

const consumer = kafka.consumer({ groupId: 'test-group-response' })

httpServer.listen(4000, () => {
    console.log(`listening to port 4000`)
});

io.on("connection", async (socket) => {
    console.log(`A user has connected with ID = ${socket.id}`)

    socket.on("getData", async () => {

        await poll(socket)
        await produce.startProducer('MS-1', 'run')
        // setInterval(async () => {
        //     await produce.startProducer('MS-1', 'run')
        // }, 10000);
    })


})

const poll = async (socket) => {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: 'Response', fromBeginning: true })

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(message)
                //if (topic.toString() == "Response") {
                console.log({
                    value: message.value.toString(),
                    topic: topic.toString(),
                    partition: partition.toString()
                })
                //let obj = JSON.parse(message.value)
                console.log(message.value.toString())
                //await produce("Response",obj.data.description,obj.id) 
                io.to(socket.id).emit("Response", message.value.toString())
                //}

            },
        })
    } catch (e) {
        throw e
    }
}

io.engine.on("connection_error", (err) => {
    console.log(err.req);	     // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});
