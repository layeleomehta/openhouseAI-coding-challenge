import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser"; 
import { pool } from "./database/db";
const PORT = 3000; 

const app = express(); 
app.use(json()); 

app.post("/api/v1/submit-log", async (req: Request, res: Response) => {
    try {
        // obtain relevant information from request body
        const userId = req.body.userId; 
        const sessionId = req.body.sessionId; 
        const actions = req.body.actions; 

        // add each user log to the UserSessionLogs table in database. Append output of each query into 'response' array. 
        let response = []
        for (const action of actions){
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
        res.json({
            "inserted-to-db": response
        });
        
    } catch (err: any) {
        console.error(err.message); 
        return; 
    }
}); 

app.get("/api/v1/:userId/:actionType/:lowerBoundTime/:upperBoundTime/retrieve-logs", async (req: Request, res: Response, next: NextFunction) => {
    // setting req params to default values if user specifies 'any' in the URL
    const userId = req.params.userId.toLowerCase()=="any" ? "%" : req.params.userId; 
    const actionType = req.params.actionType.toLowerCase()=="any" ? "%" : req.params.actionType.toUpperCase(); 
    const lowerBoundTime = req.params.lowerBoundTime=="any" ? "0001-01-01T00:00:01-06:00" : req.params.lowerBoundTime; 
    const upperBoundTime = req.params.upperBoundTime=="any" ? "9999-12-31T23:59:59-06:00" : req.params.lowerBoundTime; 

    // handle incorrect format for time bounds
    if(lowerBoundTime.length != 25 || upperBoundTime.length != 25) {
        next(new Error("please input a valid time!")); 
        return; 
    }

    try {
        const result = await pool.query(
            "SELECT actionObj FROM UserSessionLogs WHERE userId LIKE $1 AND actionType LIKE $2 AND actionTime>=$3::timestamptz AND actionTime<=$4::timestamptz", 
            [userId, 
            actionType, 
            lowerBoundTime, 
            upperBoundTime]
            ); 
    
        let response = []
        for (const actionObj of result.rows) {
            response.push(actionObj.actionobj); 
        }
    
        res.json({"logs-from-db": response}); 
        
    } catch (err: any) {
        console.error(err.message); 
        return; 
        
    }

}); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`); 
})