const mongoose = require('mongoose')

// database connection

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connected")
    } catch (err) {
        console.error(err.message)
    }
}

module.exports = connectDB;
