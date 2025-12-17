const express = require('express');
const mongoose = require('mongoose');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
require('dotenv').config();
const logger = require('./src/loggers/logger');
const info = require('./src/constants/responseInfo');
const {retainTripDetailsToVehicle} = require('./src/events/subscribeTripDetails');

const app = express();
app.use(express.json());
app.use('/v1/vehicle',vehicleRoutes);

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    logger.info(`${info.SERVICE} connected to database ✅`);
    app.listen(PORT,() => {
        logger.info(`${info.SERVICE} started on the PORT ${PORT} 🚛`);
    })
    retainTripDetailsToVehicle();
})