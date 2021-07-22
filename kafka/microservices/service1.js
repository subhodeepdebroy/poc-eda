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
                //message = JSON.parse(JSON.stringify(message))
                console.log(message, topic, message.value.toString(), typeof (message))
                //if(message.value.toString()=="run" && topic.toString()=="MS-1"){
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
                //response = response.description
                //let response = { description:"falcon1"}
                console.log(response, typeof (response.data.description),response.data.description)
                await produce.startProducer("Response", response.data.description)
                //}

            },
        })

    } catch (error) {
        throw error
    }
}

//startConsumer()
//module.exports = { startService1 }
// setInterval(() => {
//     startService1()
// }, 10000);
startService1()