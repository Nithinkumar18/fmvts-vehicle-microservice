const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({

    VIN:{
        type: String,
        required:true,
        unique: true
    },

    regNum:{
        type: String,
        required: true,
        unique: true
    },

    make:{
        type: String,
        required: true
    },

    model:{
        type: String,
        required: true
    },

    vehicleType:{
        type: String,
        required: true
    },

    fuelType:{
        type: String,
        required: true
    },

    capacity:{
        type: Number,
        required: true
    },

    yearOfManufacture:{
        type: Number,
        required: true
    },

    vehicleStatus:{
      type: String,
      enum: ["Active","In-Active"],
      default: "In-Active"
    },
    
    tripsData:{
      type: [Number],
      default: [] 
    },

    userId:{
       type: String,
    }
},{timestamps: true});

module.exports = mongoose.model("vehicle",vehicleSchema);

