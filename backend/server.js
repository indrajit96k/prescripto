import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectdb from './config/mongodb.js';
import connectcloudinary from './config/cloudinary.js';
import adminrouter from './routes/adminroute.js';
import doctorrouter from './routes/doctorroute.js';
import userrouter from './routes/userroutes.js';
// app config
const app = express();
const port=process.env.PORT || 4000;
connectdb();
connectcloudinary();
//middlewares
app.use(cors());
app.use(express.json());
//api endpoints
app.use("/api/admin",adminrouter);
app.use("/api/doctor",doctorrouter);
app.use("/api/user",userrouter);
//localhost:4000/api/adminj
app.get("/",(req,res)=>{
    res.send("Hello api working");
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});