import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log('Connected to mongoDB successfully ${connectinstance.connection.host}');
    }catch(error){
        console.log("Error while connecting to mongoDB", error);
        process.exit(1);
    }
}

export default connectDB;