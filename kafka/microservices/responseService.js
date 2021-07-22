const { Kafka } = require('kafkajs')
const produce = require('../producer')


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})
const consumer = kafka.consumer({ groupId: 'test-group' })

const startServiceResponse = async () => {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: 'MS-2', fromBeginning: false })

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if(topic.toString()=="Response"){
                    console.log({
                        value: message.value.toString(),
                        topic: topic.toString(),
                        partition: partition.toString()
                    })
                    let obj = JSON.parse(message.value)
                    await produce("Response",obj.data.description,obj.id)  
                }
                
            },
        })

    } catch (error) {
        throw error
    }
}

//startConsumer()
module.exports = { startServiceResponse }