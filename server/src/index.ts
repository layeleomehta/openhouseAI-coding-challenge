import express, { Request, Response } from "express";
import { json } from "body-parser"; 
import { pool } from "./database/db";
const PORT = 3000; 

const app = express(); 
app.use(json()); 

app.post("/api/v1/submit-log", async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId; 
        const sessionId = req.body.sessionId; 
        const actions = req.body.actions; 

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
        }

    
        res.json("Hey"); 
        
    } catch (err: any) {
        console.error(err.message); 
    }

}); 

app.get("/api/v1/retrieve-logs", () => {}); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`); 
})