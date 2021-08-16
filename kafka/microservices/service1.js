const { Kafka } = require('kafkajs')
const axios = require('axios');
const FormData = require('form-data');
const produce = require('../producer')
let data = new FormData();

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
})
const consumer = kafka.consumer({ groupId: 'test-group-MS1' })

const startService1 = async () => {
    try {
        
        await consumer.connect()
        await consumer.subscribe({ topic: 'MS-1', fromBeginning: false })

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.time("service1")
                console.log(message, topic, message.value.toString(), typeof (message))
                console.table({
                    value: JSON.stringify(message.value),
                    topic: topic.toString(),
                    partition: partition.toString()
                })
                let config = {
                    method: 'get',
                    url: 'https://api.spacexdata.com/v3/rockets/falcon9',
                    headers: {
                        ...data.getHeaders()
                    },
                    data: data
                }
                let response = await axios(config)
                console.log(response, typeof (response.data.description),response.data.description)// Response is circular obj which cant be shared
                await produce.startProducer("MS-2", Buffer.from(JSON.stringify(response.data)))
                console.timeEnd("service1")

            },
        })

    } catch (error) {
        throw error
    }
}

startService1()
