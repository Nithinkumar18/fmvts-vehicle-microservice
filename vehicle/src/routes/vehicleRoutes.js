const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController');
const {authorizeRole} = require('../middleware/authorizeUserRole');


router.post('/registration',authorizeRole(["admin","fleet_manager"]),vehicleController.handleVehicleRegistration);
router.get('/vhc/:vid',authorizeRole(["admin","fleet_manager"]),vehicleController.handleVehicleInfo);
router.get('/status/:_vid',authorizeRole(["admin","fleet_manager"]),vehicleController.handleVehicleStatusInfo);
router.get('/travelDistance',authorizeRole(["fleet_manager"]),vehicleController.handleVechileMaintenanceCheck)
router.put('/vhc-upd/:vehicleId',authorizeRole(["fleet_manager"]),vehicleController.handleVehicleUpdate);
router.put('/vhc-engage/:vin',authorizeRole(["fleet_manager"]),vehicleController.handleAssignUnAssign);
router.delete('/retire/:vehicleVID',authorizeRole(["fleet_manager"]),vehicleController.handleVehicleRetirement);


module.exports = router;
