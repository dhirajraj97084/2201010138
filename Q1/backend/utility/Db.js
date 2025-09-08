import mongoose, { connect } from "mongoose";
import 'dotenv/config'


const connectDb=async()=>{
    try {
      await connect(process.env.MONGO_URL);
      console.log("**DATA BASE CONNECTED SUCCESSFULLY**");  
    } catch (error) {
       console.log("database connection failed",error)
    }
}

export default connectDb;