const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})

const makeTopic = async () => {
    try {
        const admin = kafka.admin()
        await admin.connect()
        await admin.createTopics({
            waitForLeaders: true,
            topics: [
                { topic: 'Response' },
            ],
        })
        await admin.disconnect()
    } catch (error) {
        throw error
    }
}
makeTopic()

