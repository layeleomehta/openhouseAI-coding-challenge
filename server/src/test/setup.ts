import { app } from "../app";
import { test_pool } from "../database/test-db";

beforeAll(async () => {
    // delete all values from table while still retaining table structure
    await test_pool.query("TRUNCATE TABLE UserSessionLogs"); 
}); 
