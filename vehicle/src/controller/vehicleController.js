const vehicleService = require('../service/vehicleService');
const httpCons = require('../constants/statusConstants');
const resInfo = require('../constants/responseInfo');
const logger = require('../loggers/logger');


const handleVehicleRegistration = async(req,res) => {
    try{
      const vehicleData = req.body;
      logger.info(`SERVICE - ${resInfo.SERVICE} : ${req.path}`);
      const received_VInfo = await vehicleService.registerVehicle(vehicleData);
      return res.status(httpCons.VEHICLE_DATA_CREATED).json({"vehicle_info":received_VInfo});

    }
    catch(err){
       return res.status(httpCons.INTERNAL_SERVER_ERROR).json({message: resInfo.VEHICLE_REGESTRATION_FAIL,error:err.message});
    }
}

const handleVehicleInfo = async(req,res) => {
    try{
      const vehicle_id = req.params.vid;
      logger.info(`SERVICE - ${resInfo.SERVICE} : ${req.path}`);
      const vehiclesInfo = await vehicleService.vehicleInfo(vehicle_id);
      if(vehiclesInfo){
        return res.status(httpCons.SUCCESS).json(vehiclesInfo); 
      }
      else{
         return res.status(httpCons.NOT_FOUND).json({message:resInfo.VEHICLE_NOT_FOUND});
      }
    }
    catch(err){
        return res.status(httpCons.INTERNAL_SERVER_ERROR).json({message:resInfo.ERR_VEHICLE_DATA,Errmessage:err.message});
    }
}

const handleVehicleUpdate = async(req,res) => {
    try{
       const v_id = req.params.vehicleId;
       const vehicle_update_data = req.body;
       logger.info(`SERVICE - ${resInfo.SERVICE} : ${req.path}`);
       const updatedVehicle_info = await vehicleService.updateVehicleInfo(v_id,vehicle_update_data);
       if(updatedVehicle_info != null){
          return res.status(httpCons.SUCCESS).json({message:`Vehicle Number ${updatedVehicle_info.regNum} has been updated successfully!`,updatedInfoAt:updatedVehicle_info.updatedAt});
       }
       else{
          return res.status(httpCons.NOT_FOUND).json({message:resInfo.VEHICLE_NOT_FOUND});
       }
    }
    catch(err){
         return res.status(httpCons.INTERNAL_SERVER_ERROR),json({message:resInfo.VEHICLE_REGESTRATION_FAIL,reason:err});
    }
}

const handleVehicleRetirement = async(req,res) => {
    try{
      const vehicle_to_retire = req.params.vehicleVID;
      logger.info(`SERVICE - ${resInfo.SERVICE} : ${req.path}`);
      const retiredVehicle = await vehicleService.retireVehicle(vehicle_to_retire);
      if(retiredVehicle.vehicleVIN){
        return res.status(httpCons.SUCCESS).json({RetireMessage:resInfo.retirementStatus,VehicleIdenficationNumber:retiredVehicle.vehicleVIN,VehicleRegNum:retiredVehicle.registrationNum,retiredOn:retiredVehicle.retiredOn});
      }

    }
    catch(err){
       return res.status(httpCons.INTERNAL_SERVER_ERROR).json({message:resInfo.VEHICLE_RETIRE_FAILED,reason:err});
    }
}


const handleVehicleStatusInfo = async(req,res) => {
  try{
    
    const vehicleUniqueId = req.params._vid;
    logger.info(`SERVICE - ${resInfo.SERVICE} : ${req.path}`);
    const vehicleActivityStatus = await vehicleService.vehicleInfo(vehicleUniqueId);
    if(vehicleActivityStatus){
        logger.info(`SERVICE - ${resInfo.SERVICE} : ${resInfo.VEHICLE_STATUS_LOOKUP}`);
        return res.status(httpCons.SUCCESS).json({vehicleNumber:vehicleActivityStatus.regNum,Status:vehicleActivityStatus.vehicleStatus});
    }
    else{
        return res.status(httpCons.NOT_FOUND).json({message:resInfo.VEHICLE_NOT_FOUND});
    }
  }
  catch(err){
       return res.status(httpCons.INTERNAL_SERVER_ERROR).json({message:resInfo.ERR_VEHICLE_DATA,Errmessage:err.message});
  }
}

const handleAssignUnAssign = async(req,res) => {
  try{
     const vehicle_Id = req.params.vin;
     const driv_Id = req.body.driverId;
     const action = req.body.action
     const assigne_Details = await vehicleService.assignOrUnAssignDriver(vehicle_Id,driv_Id,action);
     return res.status(httpCons.SUCCESS).json({assigne_Details })
   }
  catch(err){
      return res.status(httpCons.INTERNAL_SERVER_ERROR).json({Message:resInfo.VEHICLE_UNASSIGNMENT_ASSIGN_FAIL},err);
  }
}
module.exports = {
    handleVehicleRegistration,
    handleVehicleInfo,
    handleVehicleUpdate,
    handleVehicleRetirement,
    handleVehicleStatusInfo,
    handleAssignUnAssign

}