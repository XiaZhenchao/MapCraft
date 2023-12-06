const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

mongoose
    .connect(process.env.MONGO_URI, { 
      useNewUrlParser: true,
      dbName: 'Test'
    })
    .catch(e => {
        console.error('Connection error', e.message)
    })
// mongoose
//     .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
//     .catch(e => {
//         console.error('Connection error', e.message)
//     })

// const db = mongoose.connection

const db = mongoose.connection





module.exports = db
