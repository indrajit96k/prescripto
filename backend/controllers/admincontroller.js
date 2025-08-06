import validator from 'validator';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import doctormodel from '../models/doctormodel.js';
//api for adding doctor
const adddoctor=async(req,res)=>{
    try{
        const {name,email,password,image,speciality,degree,experience,about,available,fees,address,date}=req.body;
        const imagefile=req.file;
        console.log({name,email,password,speciality,degree,experience,about,available,fees,address,date},imagefile);
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
export {adddoctor,loginadmin};