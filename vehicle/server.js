const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('connected to database-vehicleMicroService ✅');
    app.listen(PORT,() => {
        console.log(`vehicle-MicroService started on the PORT ${PORT} 🚛`);
    })
})