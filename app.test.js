const request = require("supertest");
const express = require('express');
// const app = express();
const db = require("./db/index.js");
const AuthController = require('./controllers/auth-controller.js');
const { app} = require('./index');
// app.post('/login', AuthController.loginUser);

beforeAll((done) => {
    done(); 
  });
describe("Test application", () => {


    test('Test Register user', async () => {
        const res = await request(app)
            .post('/auth/register') 
            .send({
                firstName: 'test4121233',
                lastName: 'test4121233',
                email: 'test4324312324@gmail.com',
                password: 'testtest4',
                passwordVerify:'testtest4'
            });
        expect(res.statusCode).toBe(200);
    });

    test('Test Login user', async () => {
        const res = await request(app)
            .post('/auth/login') 
            .send({
                email: 'test4@gmail.com',
                password: 'testtest4',
            });
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await db.close();
      });

});