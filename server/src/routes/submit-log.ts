import express, { NextFunction, Request, Response } from "express";
import { pool } from "../database/db";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router(); 

router.post("/api/v1/submit-log", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ensure that valid information is provided to the route handler
        if(!req.body.userId || !req.body.sessionId || !req.body.actions || typeof req.body.actions == 'string'){
            return next(new BadRequestError("Please input valid userId, sessionId and actions keys in your request body!")); 
        }

        // obtain relevant information from request body
        const userId = req.body.userId; 
        const sessionId = req.body.sessionId; 
        const actions = req.body.actions; 

        // add each user log to the UserSessionLogs table in database. Append output of each query into 'response' array. 
        let response = []
        for (const action of actions){
            // ensure the action object is formatted with a time and type key
            if(!action["time"] || !action["type"]) {
                return next(new BadRequestError("Please format all action objects with the time and type keys!")); 
            }
            const time = action["time"]; 
            const type = action["type"]; 

            const result = await pool.query(
                "INSERT INTO UserSessionLogs(userId, sessionId, actionTime, actionType, actionObj) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
                [userId, 
                sessionId,
                time, 
                type,
                action]
                ); 
            // pushing result.rows[0] because it will always have 1 element, since we are inserting one action object in the query
            response.push(result.rows[0]); 
        }

        // send back all query outputs via JSON object under 'inserted-to-db' key.  
        res.status(201).json({
            "inserted-to-db": response
        });
        
    } catch (err: any) {
        console.error(err.message); 
        return; 
    }
}); 

export { router as submitLogRouter }; 