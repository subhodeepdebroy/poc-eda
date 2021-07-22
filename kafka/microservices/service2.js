const { Kafka } = require('kafkajs')
const produce = require('../producer')


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})
const consumer = kafka.consumer({ groupId: 'test-group-MS2' })

const startService2 = async () => {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: 'MS-2', fromBeginning: false })
        console.log("This is MS-2")
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                //message = JSON.parse(JSON.stringify(message))
                console.log(typeof (message))
                //if(topic.toString()=="MS-2"){
                console.log({
                    value: message.value.toString('utf8'),
                    topic: topic.toString(),
                    partition: partition.toString()
                })
                console.log(JSON.stringify(message),"string")
                //console.log(JSON.parse(message),"parse")
                //let data = message.value.data.toString()
                // let buffer = Buffer.from(message.value.data)
                // let stingJson = buffer.toString('utf8') 
                // let data = JSON.parse(stingJson)
                // let des = data.description
                // console.log(des,data)
                //let des = message.value.description
                let response = message.value.toString()
                let obj = JSON.parse(response)
                console.log(response, obj.data.description)
                await produce.startProducer("Response", obj.data.description )
                //}

            },
        })

    } catch (error) {
        throw error
    }
}

//startConsumer()
//module.exports = { startService2 }
// setInterval(() => {
//     startService2()
// }, 10000);
startService2()