import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Connect to MongoDB

const dbConnection = async() =>{
    try {
        const mongoConnection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`MongoDB connected sucessfully \nDB Host: ${mongoConnection.connection.host}`);
    } catch (error) {
        console.error(`Error in DB connection: ${error}`);
        process.exit(1)
    }
}


export default dbConnection;