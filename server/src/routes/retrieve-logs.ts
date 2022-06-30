import express, { NextFunction, Request, Response } from "express";
import { pool } from "../database/db";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router(); 

router.get("/api/v1/:userId/:actionType/:lowerBoundTime/:upperBoundTime/retrieve-logs", async (req: Request, res: Response, next: NextFunction) => {
    // setting req params to default values if user specifies 'any' in the URL
    const userId = req.params.userId.toLowerCase()=="any" ? "%" : req.params.userId; 
    const actionType = req.params.actionType.toLowerCase()=="any" ? "%" : req.params.actionType.toUpperCase(); 
    const lowerBoundTime = req.params.lowerBoundTime=="any" ? "0001-01-01T00:00:01-06:00" : req.params.lowerBoundTime; 
    const upperBoundTime = req.params.upperBoundTime=="any" ? "9999-12-31T23:59:59-06:00" : req.params.lowerBoundTime; 

    // handle incorrect format for time bounds
    if(lowerBoundTime.length != 25 || upperBoundTime.length != 25) {
        return next(new BadRequestError("Please enter a valid timestamp in your request!")); 
    }

    try {
        // query the db based on search params
        const result = await pool.query(
            "SELECT userId, sessionId, actionObj FROM UserSessionLogs WHERE userId LIKE $1 AND actionType LIKE $2 AND actionTime>=$3::timestamptz AND actionTime<=$4::timestamptz", 
            [userId, 
            actionType, 
            lowerBoundTime, 
            upperBoundTime]
            ); 
    
        // append all resulting logs to the response array
        let response = []
        for (const resultObj of result.rows) {
            response.push({
                "userId": resultObj.userid, 
                "sessionId": resultObj.sessionid,
                "action": resultObj.actionobj 
            }); 
        }

        // respond with the response array: contains all relevant logs based on search params
        res.status(200).json({"logs-from-db": response}); 
        
    } catch (err: any) {
        console.error(err.message); 
        return; 
        
    }

}); 


export { router as retrieveLogsRouter }; 