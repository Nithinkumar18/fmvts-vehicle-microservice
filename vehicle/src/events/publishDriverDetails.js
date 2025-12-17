const amqp = require('amqplib');
const resInfo = require('../constants/responseInfo');
const logger = require('../loggers/logger');
require('dotenv').config();

const sendDriverDetails = async (userId, vehicleId) => {
  let connection, channel;
  try {
    connection = await amqp.connect(process.env.MESSAGE_QUEUE_URL);
    channel = await connection.createChannel();
    logger.info(`SERVICE - ${process.env.QUEUE} : ${resInfo.QUEUE_CONN_SUCESS}`);
    await channel.assertQueue(process.env.QUEUE, { durable: true });
    const vehicleData = {
      user_id: userId,
      assignedVehicleId: vehicleId
    }
    channel.sendToQueue(process.env.QUEUE, Buffer.from(JSON.stringify(vehicleData)));
    logger.info(`SERVICE - ${resInfo.DRIVER_MSG_QUEUE} : ${resInfo.USER_EVENT}`);
  } catch (err) {
    logger.error(`SERVICE - ${process.env.QUEUE} : ${resInfo.QUEUE_CON_FAIL}`, err);
  }
  finally {

    logger.info(`SERVICE - ${process.env.QUEUE} : ${resInfo.QUEUE_CON_CLOSE}`);
    await channel.close();
    await connection.close();
  }
}

module.exports = {
  sendDriverDetails
}