import { app } from "../app";

beforeAll(async () => {
    console.log("before any test has started"); 
}); 

beforeEach(async () => {
    console.log("before each test"); 
})

afterAll(async () => {
    console.log("After all tests are done")
})