import express from 'express';
import { adddoctor,loginadmin } from '../controllers/admincontroller.js';
import upload from '../middlewares/multer.js';
import authadmin from '../middlewares/authadmin.js';
const adminrouter = express.Router();
adminrouter.post("/add-doctor",authadmin,upload.single("image"),adddoctor);
adminrouter.post("/login",loginadmin);
export default adminrouter;