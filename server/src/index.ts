import express, { Request, Response } from "express";
import { json } from "body-parser"; 
const PORT = 3000; 

const app = express(); 
app.use(json()); 

app.post("/api/v1/submit-log", (req: Request, res: Response) => {
    const userId = req.body.userId; 
    const sessionId = req.body.sessionId; 
    const actions = req.body.actions; 

    console.log(actions); 
    res.json("Hey"); 

}); 

app.get("/api/v1/retrieve-logs", () => {}); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`); 
})