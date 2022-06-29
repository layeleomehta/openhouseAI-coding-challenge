import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser"; 
import { submitLogRouter } from "./routes/submit-log";
import { retrieveLogsRouter } from "./routes/retrieve-logs";
const PORT = 3000; 

const app = express(); 
app.use(json()); 

app.use(submitLogRouter); 
app.use(retrieveLogsRouter); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`); 
})