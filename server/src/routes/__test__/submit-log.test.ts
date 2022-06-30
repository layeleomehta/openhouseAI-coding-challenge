import request from "supertest"; 
import { app } from "../../app"; 


it("returns Bad Request Error when userId key not provided", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
                "sessionId": "XYZ456ABC",
                "actions": [
                  {
                    "time": "2018-10-18T21:37:28-06:00",
                    "type": "CLICK",
                    "properties": {
                      "locationX": 52,
                      "locationY": 11
                    }
                  },
                  {
                    "time": "2018-10-18T21:37:30-06:00",
                    "type": "VIEW",
                    "properties": {
                      "viewedId": "FDJKLHSLD"
                    }
                  },
                  {
                    "time": "2018-10-18T21:37:30-06:00",
                    "type": "NAVIGATE",
                    "properties": {
                      "pageFrom": "communities",
                      "pageTo": "inventory"
                    }
                  }
                ]
              })
        .expect(400); 

})

it("returns Bad Request Error when sessionId key not provided", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
                "userId": "ABC123XYZ",
                "actions": [
                  {
                    "time": "2018-10-18T21:37:28-06:00",
                    "type": "CLICK",
                    "properties": {
                      "locationX": 52,
                      "locationY": 11
                    }
                  },
                  {
                    "time": "2018-10-18T21:37:30-06:00",
                    "type": "VIEW",
                    "properties": {
                      "viewedId": "FDJKLHSLD"
                    }
                  },
                  {
                    "time": "2018-10-18T21:37:30-06:00",
                    "type": "NAVIGATE",
                    "properties": {
                      "pageFrom": "communities",
                      "pageTo": "inventory"
                    }
                  }
                ]
              })
        .expect(400); 
})

it("returns Bad Request Error when actions key not provided", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
                "userId": "ABC123XYZ",
                "sessionId": "XYZ456ABC",
              })
        .expect(400); 
})

it("returns Bad Request Error when actions key is a string", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
                "userId": "ABC123XYZ",
                "sessionId": "XYZ456ABC",
                "actions": "failedtest"
              })
        .expect(400); 
    
})

it("returns Bad Request Error when an action object doesn't have a time key", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
                "sessionId": "XYZ456ABC",
                "actions": [
                  {
                    "type": "CLICK",
                    "properties": {
                      "locationX": 52,
                      "locationY": 11
                    }
                  },
                ]
              })
        .expect(400); 
})

it("returns Bad Request Error when an action object doesn't have a type key", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
                "sessionId": "XYZ456ABC",
                "actions": [
                  {
                    "time": "2018-10-18T21:37:28-06:00",
                    "properties": {
                      "locationX": 52,
                      "locationY": 11
                    }
                  },
                ]
              })
        .expect(400); 
})

it("returns a 201 status after successfully inserting into db when provided valid data", async () => {
    await request(app)
        .post('/api/v1/submit-log')
        .send({
            "userId": "ABC123XYZ",
            "sessionId": "XYZ456ABC",
            "actions": [
              {
                "time": "2018-10-18T21:37:28-06:00",
                "type": "CLICK",
                "properties": {
                  "locationX": 52,
                  "locationY": 11
                }
              },
              {
                "time": "2018-10-18T21:37:30-06:00",
                "type": "VIEW",
                "properties": {
                  "viewedId": "FDJKLHSLD"
                }
              },
              {
                "time": "2018-10-18T21:37:30-06:00",
                "type": "NAVIGATE",
                "properties": {
                  "pageFrom": "communities",
                  "pageTo": "inventory"
                }
              }
            ]
              })
        .expect(201); 
})