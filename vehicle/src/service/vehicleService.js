const vehicle = require('../model/vehicle');
const rsInfo = require('../constants/responseInfo');
const logger = require('../loggers/logger');
const { fetchDriverProfile } = require('../interService/userClient');
const { sendDriverDetails } = require('../events/publishDriverDetails');
let uuidv4;
(async () => {
    const { v4 } = await import('uuid');
    uuidv4 = v4;
})();


const registerVehicle = async (vehicleInfo) => {
    try {
        let VIN = generateVIN();
        const _vehicleDetails = { VIN, ...vehicleInfo };
        const _vehicle = await vehicle.create(_vehicleDetails);
        logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_REGESTRATION_SUCCESS}`);
        logger.info(`Created Vehicle Info ${_vehicle.VIN}: created At: ${_vehicle.createdAt}`);
        return _vehicle;

    }
    catch (err) {
        logger.error(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_REGESTRATION_FAIL}` + "  " + err);
        throw new Error(err);
    }
}


const vehicleInfo = async (vehicleId) => {
    try {
        const vInfo = await vehicle.findOne({ VIN: vehicleId });
        logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.SEARCH_VEHICLE_INFO}`);
        return vInfo;
    }
    catch (err) {
        logger.error(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.SEARCH_VEHICLE_INFO}` + "  " + err);
        throw new Error(err);
    }
}

const updateVehicleInfo = async (v_id, vdata) => {
    try {
        const up_info = await vehicle.findByIdAndUpdate({ '_id': v_id }, { $set: vdata });
        logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_UPDATE_SUCCESS}`);
        logger.info(`Updated Vehicle Info ${up_info.VIN}: updated At: ${up_info.updatedAt}`);
        return up_info;
    }
    catch (err) {
        logger.error(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_UPDATE_SUCCESS}` + "  " + err);
        throw new Error(err);
    }
}


const retireVehicle = async (_id) => {

    try {
        const retired_Vehicle = await vehicle.findByIdAndDelete({ '_id': _id });
        logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_RETIRED}`);
        logger.info(`Updated Vehicle Info ${retired_Vehicle.VIN, retired_Vehicle.regNum}: updated At: ${retired_Vehicle.updatedAt}`);
        return {
            vehicleVIN: retired_Vehicle.VIN,
            registrationNum: retired_Vehicle.regNum,
            retiredOn: retired_Vehicle.updatedAt

        };
    }
    catch (err) {
        logger.error(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_RETIRED}` + "  " + err);
        throw new Error(err);
    }
}

const generateVIN = () => {
    let vehicleIdenficationNumber = uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase();
    return vehicleIdenficationNumber;
}

const assignOrUnAssignDriver = async (vehicleIdNumber, driverId, action) => {
    try {
        if (action == rsInfo.UNASSIGN) {
            const deallocateDriver = await vehicle.findOneAndUpdate({ VIN: vehicleIdNumber }, { $unset: { userId: " " } });
            logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_UNASSIGNMENT_COMPLETED}`);
            await sendDriverDetails(deallocateDriver.userId, driverId);
            return {
                unassignment_success: rsInfo.VEHICLE_UNASSIGNMENT_COMPLETED,
            };
        }
        else {
            const valid_vehicle = await vehicleInfo(vehicleIdNumber);
            if (valid_vehicle) {
                if (valid_vehicle.vehicleStatus == rsInfo.VSTATUS) {
                    const dProfile = await fetchDriverProfile(driverId);
                    if (dProfile.availabilityStatus == rsInfo.DRIVER_STATUS) {
                        const assignDriver = await vehicle.findOneAndUpdate({ VIN: vehicleIdNumber }, { $set: { userId: driverId } }, { new: true });
                        logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.DRIVER_ASSIGNMENT_SUCCESS}`);
                        const { fullName, contactNumber, licenseNumber } = dProfile;
                        const { regNum, VIN } = assignDriver;
                        await sendDriverDetails(assignDriver.userId, assignDriver._id);
                        return {
                            fullName,
                            contactNumber,
                            licenseNumber,
                            regNum,
                            VIN
                        }
                    }
                    else {
                        logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.DRIVER_ASSIGNMENT_FAIL}`)
                        return {
                            assgnmess: rsInfo.DRIVER_ASSIGNMENT_FAIL
                        }
                    }
                }
                else {
                    logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHCILE_STATUS_NOT_ACTIVE}`)
                    return {

                        vehicle_InActive: rsInfo.VEHCILE_STATUS_NOT_ACTIVE
                    }
                }
            }
            else {
                logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_NOT_FOUND}`);
                return null;
            }
        }
    }
    catch (err) {
        logger.error(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_UNASSIGNMENT_ASSIGN_FAIL}` + "  " + err.message);
        throw new Error(err);
    }

}

const updateTravelledDistance = async(vehicleId,distanceTravelled) => {

    try{
       const updatedDistance = await vehicle.findByIdAndUpdate({_id:vehicleId},{$push:{tripsData:distanceTravelled}},{new:true});
       if(updatedDistance.tripsData.includes(distanceTravelled)){
             logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_WITH_TRIP_DATA}`);
             return updatedDistance;
       }
       else{
          logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.VEHICLE_WITH_TRIP_DATA_FAIL}`);
          return null;
       }
    }
    catch(err){
         throw err;
    }

}

const maintenanceCheck = async() => {
    try{
       logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.MAINTENANCE_DATA_CHECK}`); 
       const vehiclesUnderMaintenance =  await vehicle.aggregate([
                                              {
                                                $unwind:"$tripsData"
                                              },
                                              {
                                                $group:{
                                                    _id:"$_id",
                                                    regNum:{$first:"$regNum"},
                                                    distanceTravelled:{$sum:"$tripsData"}
                                                }
                                              },
                                              {
                                                $project:{
                                                    _id:0,
                                                    regNum:1,
                                                    distanceTravelled:1
                                                   }
                                              }
                                            ]);
       logger.info(`SERVICE - ${rsInfo.SERVICE} : ${rsInfo.MAINTENANCE_DATA_CHECK_SUCCESS}`); 
        return vehiclesUnderMaintenance;
    }
    catch(err){
       throw err;
    }
}
module.exports = {
    registerVehicle,
    vehicleInfo,
    updateVehicleInfo,
    retireVehicle,
    assignOrUnAssignDriver,
    updateTravelledDistance,
    maintenanceCheck
}