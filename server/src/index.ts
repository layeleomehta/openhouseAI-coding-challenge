import express, { Request, Response } from "express";
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
    }
``
}); 

app.get("/api/v1/:userId/:actionType/:lowerBoundTime/:upperBoundTime/retrieve-logs", async (req: Request, res: Response) => {
    // set req.params variables to wildcard match any string "%" in db column if their value is "any"
    let userId = req.params.userId.toLowerCase()=="any" ? "%" : req.params.userId; 
    let actionType = req.params.actionType.toLowerCase()=="any" ? "%" : req.params.actionType.toUpperCase(); 
    const actionTime = "2018-10-18T21:37:28-06:00"; 

    const result = await pool.query(
        "SELECT actionObj FROM UserSessionLogs WHERE userId LIKE $1 AND actionType LIKE $2 AND actionTime=$3::timestamptz", 
        [userId, 
        actionType, 
        actionTime]
        ); 

    let response = []
    for (const actionObj of result.rows) {
        response.push(actionObj.actionobj); 
    }

    res.json({"logs-from-db": response}); 
}); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`); 
})