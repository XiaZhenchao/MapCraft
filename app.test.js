const request = require("supertest");
const express = require('express');
// const db = require("./db/index.js");
const AuthController = require('./controllers/auth-controller.js');
const { app, db} = require('./index');

beforeAll(async () => {
    // Increase the timeout for dropping the collection
    jest.setTimeout(10000);
    await db.collection('users').deleteOne({ email: 'test43243123246@gmail.com' });
  });

describe("Test application", () => {
  test('Test Register user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'test41212336',
        lastName: 'test41212336',
        email: 'test43243123246@gmail.com',
        password: 'testtest46',
        passwordVerify: 'testtest46',
        role: 'user'
      });
    expect(res.statusCode).toBe(200);
  });
 
});

describe("Test application", () => {
    // ... Previous test cases for registration and login
  
    let authToken; // Define authToken variable outside the test cases
  
    test('Test Login user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test43243123246@gmail.com',
          password: 'testtest46',
        });
      expect(res.statusCode).toBe(200);
      authToken = res.body.token; // Assign the token to the authToken variable
    });
  
    test('Add new map', async () => {
      if (!authToken) {
        return;
      }
  
      const res = await request(app)
        .post('/auth/map')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          mapName: 'New Map',
        });
  
      expect(res.statusCode).toBe(200);

    });


    test('Delete map', async () => {
        // Ensure that a map ID is available for deletion
        if (!authToken || !mapId) {
          // Handle cases where either authToken or mapId is not available
          return;
        }
    
        const res = await request(app)
          .delete(`/auth/map/${mapId}`) // Replace with the endpoint to delete a map
          .set('Authorization', `Bearer ${authToken}`);
    
        expect(res.statusCode).toBe(200);
        // Add assertions based on your application's response
      });

    test('Publish map', async () => {
        // Ensure that a map ID is available for deletion
        if (!authToken || !mapId) {
          // Handle cases where either authToken or mapId is not available
          return;
        }
    
        const res = await request(app)
          .put(`/auth/map/${mapId}`) // Replace with the endpoint to delete a map
          .set('Authorization', `Bearer ${authToken}`);
    
        expect(res.statusCode).toBe(200);
        // Add assertions based on your application's response
      });

    test('Edit map name', async () => {
        // Ensure that a map ID is available for deletion
        if (!authToken || !mapId) {
          // Handle cases where either authToken or mapId is not available
          return;
        }
    
        const res = await request(app)
          .put(`/auth/map/${mapId}`) // Replace with the endpoint to delete a map
          .set('Authorization', `Bearer ${authToken}`);
    
        expect(res.statusCode).toBe(200);
        // Add assertions based on your application's response
      });
  });
