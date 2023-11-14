// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path')
var mongoose = require('mongoose');


// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["Access-Control-Allow-Origin:https://mapcraft-55160ee4aae1.herokuapp.com", "Access-Control-Allow-Origin:https://mapcraft-55160ee4aae1.herokuapp.com/auth"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)

//DB configs
//mongoose.connect(process.env.MONGO_URI).catch((err)=> console.log(err))

// INITIALIZE OUR DATABASE OBJECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

if(process.env.NODE_ENV==="production"){
    app.use(express.static("client/build"));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
}

// PUT THE SERVER IN LISTENING MODE
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, db};