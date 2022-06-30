import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser"; 
import { submitLogRouter } from "./routes/submit-log";
import { retrieveLogsRouter } from "./routes/retrieve-logs";
import { errorHandler } from "./middlewares/error-handler";

const app = express(); 
app.use(json()); 

app.use(submitLogRouter); 
app.use(retrieveLogsRouter); 

app.use(errorHandler); 

export { app }; 