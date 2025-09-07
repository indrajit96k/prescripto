import validator from 'validator';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import doctormodel from '../models/doctormodel.js';
import appointmentmodel from '../models/appointmentmodel.js';
import usermodel from '../models/usermodel.js';
//api for adding doctor
const adddoctor=async(req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
        const imagefile=req.file;
        // console.log(req.file);
        
        console.log({name,email,password,speciality,degree,experience,about,fees,address},imagefile);
        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){

            return res.json({success:false,message:"Missing Details"});
        }
        //validating email
        if(validator.isEmail(email)==false){
            return res.json({success:false,message:"Please Enter valid email"});

        }
        //strong password validation
        if(password.length<8){
            return res.json({success:false,message:"Please Enter strong password"});

        }
        //hashing password
        const salt=await bycrypt.genSalt(10);
        const hashedpassword=await bycrypt.hash(password,salt);
        //upload image to cloudinary
        const imageupload=await cloudinary.uploader.upload(imagefile.path,{resource_type:"image"});
        const imageurl=imageupload.secure_url;
        const doctordata={
            name,
            email,
            image:imageurl,
            password:hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),
        }
        
        const newdoctor=new doctormodel(doctordata);
        await newdoctor.save();
        res.json({success:true,message:"Doctor Added Successfully"});

    


        

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message

    }
}
//api for admin login
const loginadmin=async(req,res)=>{
    try{
        let {email,password}=req.body;
        //checking for email and password
        if(!email || !password){
            return res.json({success:false,message:"Please Enter Email and Password"});
        }
        if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
            // return res.json({success:true,message:"Login Successful"});
            const token=jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});
        }
        else{
            return res.json({success:false,message:"Invalid Credentials"});
        }

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message
    }
}
//api to get all doctors list for admin panel
const alldoctors=async (req,res)=>{
    try{
        const doctors=await doctormodel.find({}).select("-password");
        res.json({success:true,doctors});//sending doctors data to frontend admin panel 

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message

    }
}
//api to fetch all the appointment list
const appointmentsadmin=async (req,res)=>{
    try{
        const appointments=await appointmentmodel.find({});
        res.json({success:true,appointments});

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message

    }
}
//api for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentId);
        await appointmentmodel.findByIdAndUpdate(appointmentId, { cancelled: true })
        //releasing doctor slot
        const { doctorid, slotdate, slottime } = appointmentdata;
        const doctordata = await doctormodel.findById(doctorid);
        let slots_booked = doctordata.slots_booked;
        slots_booked[slotdate] = slots_booked[slotdate].filter(e => e !== slottime);
        await doctormodel.findByIdAndUpdate(doctorid, { slots_booked });
        res.json({ success: true, message: "Appointment Cancelled" });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
//api to get dashboard data for admin panel
const admindashboard=async (req,res)=>{
    try{
        const doctors=await doctormodel.find({});
        const users=await usermodel.find({});
        const appointments=await appointmentmodel.find({});
        const dashdata={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestappointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashdata});

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export {adddoctor,loginadmin,alldoctors,appointmentsadmin,appointmentCancel,admindashboard};