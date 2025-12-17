const amqp = require('amqplib');
require('dotenv').config();
const logger = require('../loggers/logger');
const queueInfo = require('../constants/responseInfo');
const vehicleService = require('../service/vehicleService');

const retainTripDetailsToVehicle = async() => {
    let connection,channel;
    try{
       connection = await amqp.connect(process.env.MESSAGE_QUEUE_URL);
       channel = await connection.createChannel();
        logger.info(`SERVICE - ${process.env.TRIP_DATA_QUEUE} : ${queueInfo.QUEUE_CONN_SUCESS}`);
        await channel.assertQueue(process.env.TRIP_DATA_QUEUE,{durable:true});
        channel.prefetch(1);
        channel.consume(process.env.TRIP_DATA_QUEUE,async(data) => {
            if(!data) return null;
            receivedTripInfo = JSON.parse(data.content.toString());
             logger.info(`SERVICE - ${process.env.QUEUE} : ${queueInfo.TRIP_DATA_SYNC}`);
             const updateTripInfo = await vehicleService.updateTravelledDistance(receivedTripInfo.vehicle_id,receivedTripInfo.distance);
             if(updateTripInfo.tripsData){
             logger.info(`SERVICE - ${queueInfo.SERVICE} - ${process.env.TRIP_DATA_QUEUE} : ${queueInfo.TRIP_SYNC_SUCC}`);
             }
             else{
               logger.info(`SERVICE - ${queueInfo.SERVICE} - ${process.env.TRIP_DATA_QUEUE} : ${queueInfo.TRIP_SYNC_FAIL}`); 
             }
              channel.ack(data);
        }, { noAck: false})

    }
      catch (error) {
    const code = error.errors?.[0]?.code || error.code || 'UNKNOWN_ERROR';
    logger.error(`SERVICE -  ${queueInfo.SERVICE} - ${process.env.TRIP_DATA_QUEUE} || ${code}`);
  }
}

module.exports = {retainTripDetailsToVehicle}