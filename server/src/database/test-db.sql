-- create database for testing
CREATE DATABASE test_openhouseai; 

-- create user session logs table in the test database
CREATE TABLE UserSessionLogs (
    logId BIGSERIAL NOT NULL PRIMARY KEY, 
    userId VARCHAR(255) NOT NULL, 
    sessionId VARCHAR(255) NOT NULL, 
    actionTime timestamptz NOT NULL, 
    actionType VARCHAR(255) NOT NULL,
    actionObj jsonb NOT NULL
); 