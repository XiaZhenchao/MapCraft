const request = require("supertest");
const express = require('express');
// const db = require("./db/index.js");
const AuthController = require('./controllers/auth-controller.js');
const { app, db} = require('./index');

// beforeAll(async () => {
//   // Increase the timeout for dropping the collection
//   jest.setTimeout(10000);
//   await db.collection('users').drop();
// });

// describe("Test application", () => {
//   test('Test Register user', async () => {
//     const res = await request(app)
//       .post('/auth/register')
//       .send({
//         firstName: 'test41212336',
//         lastName: 'test41212336',
//         email: 'test43243123246@gmail.com',
//         password: 'testtest46',
//         passwordVerify: 'testtest46'
//       });
//     expect(res.statusCode).toBe(200);
//   });
 
// });

// describe("Test application", () => {
//     test('Test Login user', async () => {
//         const res = await request(app)
//           .post('/auth/login')
//           .send({
//             email: 'test43243123246@gmail.com',
//             password: 'testtest46',
//           });
//         expect(res.statusCode).toBe(200);
//       });
    
//     });
