import express from "express";
import dotenv from "dotenv";
import dbConnect from "../config/database connection.js";
import router from "../routes/feedback.js";
const app=express();
const PORT =5000

 app.use(express.json());
dotenv.config();

dbConnect();
//mounting api routes
app.use("/api/v1",router)





app.listen(PORT,()=>{
    console.log(`server is runing on ${PORT}`);
})