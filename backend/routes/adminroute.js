import express from 'express';
import { adddoctor,admindashboard,alldoctors,appointmentCancel,appointmentsadmin,loginadmin } from '../controllers/admincontroller.js';
import upload from '../middlewares/multer.js';
import authadmin from '../middlewares/authadmin.js';
import { changeavailability } from '../controllers/doctorcontroller.js';
const adminrouter = express.Router();
adminrouter.post("/add-doctor",authadmin,upload.single('image'),adddoctor);
adminrouter.post("/login",loginadmin);
adminrouter.post("/all-doctors",authadmin,alldoctors);
adminrouter.post("/change-availability",authadmin,changeavailability);
adminrouter.get("/appointments",authadmin,appointmentsadmin);
adminrouter.post("/cancel-appointment",authadmin,appointmentCancel);
adminrouter.get("/dashboard",authadmin,admindashboard)
export default adminrouter;