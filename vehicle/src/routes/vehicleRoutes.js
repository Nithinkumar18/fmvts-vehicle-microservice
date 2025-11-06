const express = require('express');
const router = express.Router();
const vehcileController = require('../controller/vehicleController');
const {authorizeRole} = require('../middleware/authorizeUserRole');


router.post('/registration',authorizeRole(["admin","fleet_manager"]),vehcileController.handleVehicleRegistration);
router.get('/vhc/:vid',authorizeRole(["admin","fleet_manager"]),vehcileController.handleVehicleInfo);
router.get('/status/:_vid',authorizeRole(["admin","fleet_manager"]),vehcileController.handleVehicleStatusInfo);
router.put('/vhc-upd/:vehicleId',authorizeRole(["fleet_manager"]),vehcileController.handleVehicleUpdate);
router.put('/vhc-engage/:vin',authorizeRole(["fleet_manager"]),vehcileController.handleAssignUnAssign);
router.delete('/retire/:vehicleVID',authorizeRole(["fleet_manager"]),vehcileController.handleVehicleRetirement);


module.exports = router;
