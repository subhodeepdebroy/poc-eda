const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})

const producer = kafka.producer()

const startProducer = async (topic,data) => {
    try {
        await producer.connect()
        await producer.send({
            topic: topic,
            messages: [
                {   key: null,
                    value: data
                }
            ],
        })
        console.log(`Published on ${topic} with data ${data}`)
        await producer.disconnect()
    } catch (error) {
        throw error
    }
}
//startProducer()
module.exports = {startProducer}
