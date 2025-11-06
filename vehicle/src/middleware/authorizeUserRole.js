const httpStatusCons = require('../constants/statusConstants');
const respInfo = require('../constants/responseInfo');
const logger = require('../loggers/logger');


const authorizeRole = (elgibleRoles) => {

    return (req,res,next) => {
         try{
        const received_URole = req.headers['x-user-role'];
        const elgibleUser = elgibleRoles.includes(received_URole);
        if(elgibleUser){
            logger.info(`SERVICE: ${respInfo.SERVICE} || MESSAGE: ${respInfo.ROLE_VALIDATION}`);
            next();
        }
        else{
            logger.info(`SERVICE: ${respInfo.SERVICE} || MESSAGE: ${respInfo.ACCESS_DENIED} `);
            return res.status(httpStatusCons.UNAUTHORIZED).json({message:respInfo.ACCESS_DENIED});
        }
    }
    catch(err){
           console.log(err);
           return res.status(httpStatusCons.INTERNAL_SERVER_ERROR).json({message:respInfo.ERROR_VALIDATING_ROLE,Error:err.message});
    }
    }

}

module.exports = {
    authorizeRole
}