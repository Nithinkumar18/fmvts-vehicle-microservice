const logger = require('../loggers/logger');
const axios = require('axios');
require('dotenv').config();
const respInfo = require('../constants/responseInfo');


const fetchDriverProfile = async(drvr_id) => {
    try{
       logger.info(`SERVICE - ${respInfo.SERVICE} || ${respInfo.CONN_USER_SERVICE}`);
        const driverProfile = await axios.get(`${process.env.USER_CLIENT}/v1/user/${drvr_id}`);
        logger.http(`SERVICE - ${respInfo.SERVICE} || ${respInfo.CONN_USER_SERVICE_SUCC}`);
        if(driverProfile){
            const _profile = driverProfile.data.userDetails;
            const {fullName,contactNumber,licenseNumber,availabilityStatus} = _profile;
            return {
                fullName,
                contactNumber,
                licenseNumber,
                availabilityStatus
            }
        }
        return null;
    }
    catch(err){
        logger.error(`SERVICE - ${respInfo.SERVICE} : ${respInfo.CONN_USER_SERVICE_FAIL}`+"  "+err)
         throw new Error(respInfo.CONN_USER_SERVICE_FAIL);
    }
}

module.exports = {
    fetchDriverProfile
}