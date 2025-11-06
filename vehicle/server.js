const express = require('express');
const mongoose = require('mongoose');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/v1/vehicle',vehicleRoutes);

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('connected to database-vehicleMicroService ✅');
    app.listen(PORT,() => {
        console.log(`vehicle-MicroService started on the PORT ${PORT} 🚛`);
    })
})