import { Pool} from "pg";  

export const test_pool = new Pool({
    host: "localhost", 
    user: "postgres", 
    port: 5432, 
    database: "test_openhouseai"
}); 