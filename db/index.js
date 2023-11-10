
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

const db = mongoose.connection

// db.close = async () => {
//   try {
//     await mongoose.disconnect();
//     console.log('Disconnected from the database');
//   } catch (error) {
//     console.error('Disconnection error:', error.message);
//   }
// };


// try {
//   await mongoose.disconnect();
//   console.log('Disconnected from the database');
// } catch (error) {
//   console.error('Disconnection error:', error.message);
// }


module.exports = db
