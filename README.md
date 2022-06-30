# OpenHouse AI Backend Exercise
This is a 24 hour take-home exercise done for OpenHouse AI. The idea is to build a RESTful web service which consumes, stores and processes logs from an arbitrary frontend application. The backend application also retrieves the stored logs based on three search criteria: userId, time range and log type. 

## API Documentation
There are two callable endpoints in this application. One of them is to submit a list of user activity logs, and the other is to retrieve a volume of stored logs based on three search criteria: userId, time range and log type. Both endpoints are meant to be called by the frontend application. Detailed description of both endpoints can be found below: 

### _Submitting a log: "/api/v1/submit-log"_
In order to submit a log, the user most send an HTTP 'POST' request to the above endpoint. The body of the request must contain an object which has the following keys: 'userId', 'sessionId' and 'actions'. The userId and sessionId are indicative of the user and session whose activity is being logged. The 'actions' key must map to an array of objects, each of which describe an event from a certain point in time. 

Each object in the array that maps to the 'actions' key must contain the following keys: 'time', 'type' and 'properties'. This represents the time of the event, the type of event and some properties relevant to the event. If any of the keys in the request body are missing, or are formatted improperly, the application will respond with an HTTP status code 400 'Bad Request' error. 

Here is an example of a properly formatted request body: 
```sh
{
  "userId": "ExampleUserID",
  "sessionId": "ExampleSessionID",
  "actions": [
    {
      "time": "2018-10-18T21:37:28-06:00",
      "type": "EXAMPLE_EVENT",
      "properties": {
        "property1": 0,
        "property2": 1
      }
    }
  ]
}
```


If the request body is properly formatted, the application will process and store all of the logs into a persistent data store. It will then return an HTTP 201 'Resource created' status. Along with this status code, it will send back a JSON object with an 'inserted-to-db' key. The key will map to an array consisting of all the data entries it has made to the database. 

### _Retrieving logs: "/api/v1/:userId/:actionType/:lowerBoundTime/:upperBoundTime/retrieve-logs"_
This endpoint is used to retrieve logs that already exist inside a database. The use case for this endpoint is to retrieve large volumes of logs on a weekly basis. To retrieve logs, the user must send an HTTP 'GET' request to the above endpoint. 

The endpoint gives the user the ability to search and retrieve logs based on four URL parameters: 'userId', 'actionType', 'lowerBoundTime' and 'upperBoundTime'. If the user wishes not to specify a parameter, they can simply type 'any' in the URL, and the application will ignore this parameter in its search. 

- if 'userId' is set to 'any', the application will retrieve all users which also satisfy the rest of the criteria. 
- if 'actionType' is set to 'any', the application will retrieve all action types which also satisfy the rest of the criteria. 
- if 'lowerBoundTime' is set to 'any', the application will include the lowest possible time value in its search. 
- if 'upperBoundTime' is set to 'any', the application will include the highest possible time value in its search. 

Here is an example of the formatted URL which only filters logs based on the userId and actionType, ignoring the lowerBoundTime and upperBoundTime: 
```sh
"/api/v1/ExampleUser/ExampleActionType/any/any/retrieve-logs"
```

If lowerBoundTime or upperBoundTime parameters do not contain valid timestamps, the application will throw an HTTP status code 400 'Bad Request' error. However, if all of the parameters are properly specified, the application will search through its database and retrieve all entries which satisfy the search criteria. It will then respond with an HTTP 200 'OK' status, and return a JSON object with a 'logs-from-db' key. This key will map to an array containing all of the retrieved responses. 


### Follow up question: how can this application become cloud scalable?
In a real world production system, this application would have to handle logs streaming from up to 10k users simultaneously and query millions of datapoints to retrieve the log info for batch processing. In order to become cloud scalable, I have a few architectural changes I would make to the app to be able to support event logs from thousands of users simultaneously. 

1) **Set up an streaming event bus to process simultaneous logs.** In order to process thousands of requests simultaneously, I would propose to set up some kind of streaming queue, such that simultaneous event log requests would be sent to this queue and processed in a FIFO manner.

2) **Load balance over multiple instances of the application.** I would containerize this application using Docker, and deploy multiple instances of it in a Kubernetes cluster. Then, I would load balance over those multiple instances using something like Nginx. 

3) **Database sharding.** Even if multiple instances of this containerized application were deployed in a Kubernetes cluster, it would improve performance if they all didn't share a database. Database sharding would allow horizontal partitioning, and therefore result in faster query results from the database. 

## Tools used to build this application
I built this application in the Node.js runtime environment, utilizing Typescript. I used Express.js as a framework for the server, and PostgreSQL as a database to store all of the logs sent from the frontend application. Furthermore, the unit tests for the route handlers were written using Jest and Supertest. 



