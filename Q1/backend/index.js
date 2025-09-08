import express from "express";
import connectDb from "./utility/Db.js";
import cors from "cors";
import urlRouter from "./routes/url.routes.js";

connectDb();
const port = 8000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/", urlRouter);

app.listen(port, () => console.log("Server running on port 8000"));
