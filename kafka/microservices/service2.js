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
                console.time("service2")
                console.log(typeof (message))
                console.log({
                    value: message.value.toString('utf8'),
                    topic: topic.toString(),
                    partition: partition.toString()
                })
                console.log(JSON.stringify(message),"string")
                let response = message.value.toString() //String
                console.log("\x1b[33m%s\x1b[0m",response)
                let responseObj = JSON.parse(response)  //Object
                console.log(typeof(response),responseObj,typeof(responseObj))
                console.log(responseObj.description)
                await produce.startProducer("Response", responseObj.description )
                console.timeEnd("service2")

            },
        })

    } catch (error) {
        throw error
    }
}

startService2()
