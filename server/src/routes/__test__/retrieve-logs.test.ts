import request from "supertest"; 
import { app } from "../../app"; 

it("returns a Bad Request Error if time value is less than 25 chars long", async () => {
    await request(app)
        .get("/api/v1/testUser/click/206:00/2018-10-18T21:37:28-06:00/retrieve-logs")
        .expect(400); 
}); 

it("returns a Bad Request Error if time value is greater than 25 chars long", async () => {
    await request(app)
        .get("/api/v1/testUser/click/200000018-10-18T21:37:28-06:00/2018-10-18T21:37:28-06:00/retrieve-logs")
        .expect(400); 
}); 

it("returns a 200 status after successfully searching database and returning all relevant entries", async () => {
    await request(app)
        .get("/api/v1/any/any/any/any/retrieve-logs")
        .expect(200); 
}); 