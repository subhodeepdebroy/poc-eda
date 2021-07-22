const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})
const consumer = kafka.consumer({ groupId: 'test-group' })

const startConsumer = async () => {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: 'test-topic', fromBeginning: false })

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value.toString(),
                    topic: topic.toString(),
                    partition: partition.toString()
                })
            },
        })

    } catch (error) {
        throw error
    }
}

//startConsumer()