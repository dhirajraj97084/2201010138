import express from "express";
import connectDb from "./utility/Db.js";    
import cors from "cors";
import urlRouter from "./routes/url.routes.js";

connectDb();   

const app = express();
app.use(cors());            
app.use(express.json());    

app.use("/", urlRouter);

app.listen(8000, () => console.log("Server running on port 8000"));
