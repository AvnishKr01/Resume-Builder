const monngoosre = require("mongoose");
require("dotenv").config();

const URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await monngoosre.connect(URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error in DB connection", error);
        process.exit(1);
    }
}

module.exports = connectDB;