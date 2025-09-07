import doctormodel from "../models/doctormodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentmodel from "../models/appointmentmodel.js";
const changeavailability = async (req,res)=>{
    try{
        const {docid}=req.body;
        const docdata=await doctormodel.findById(docid);
        await doctormodel.findByIdAndUpdate(docid,{available:!docdata.available});
        res.json({success:true,message:"Availability Changed"});


    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message

    }

}
const doctorlist=async (req,res)=>{
    try{
        const doctors=await doctormodel.find({}).select(["-password","-email"]);
        res.json({success:true,doctors});

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api for doctor login
const logindoctor=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const doctor=await doctormodel.findOne({email});
        if(!doctor){
            return res.json({success:false,message:"Doctor Not Found!!!"});

        }
        
        const ismatch =await bcrypt.compare(password,doctor.password);
        if(ismatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET);
            res.json({success:true,token}); 
        }else{
            res.json({success:false,message:"invalid password"});


        }


    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api to get all the appointments of the doctor
const appointmentsdoctor=async (req,res)=>{
    try{
        const {docId}=req;
        const appointments=await appointmentmodel.find({doctorid:docId});
        res.json({success:true,appointments});


    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api to mark appointment completed for doc panel
const appointmentcomplete=async (req,res)=>{
    try{
        const {docId}=req;
        const {appointmentId}=req.body;
        const appointmentdata=await appointmentmodel.findById(appointmentId);
        if(appointmentdata && appointmentdata.doctorid===docId){
            await appointmentmodel.findByIdAndUpdate(appointmentId,{iscompleted:true});
            return res.json({success:true,message:"Appointment Completed"});
        }else{
            return res.json({success:false,message:"Mark Failed"});
            
        }


        
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api to mark appointment cancel for doc panel
const appointmentcancel=async (req,res)=>{
    try{
        const {docId}=req;
        const {appointmentId}=req.body;
        const appointmentdata=await appointmentmodel.findById(appointmentId);
        if(appointmentdata && appointmentdata.doctorid===docId){
            await appointmentmodel.findByIdAndUpdate(appointmentId,{cancelled:true});
            return res.json({success:true,message:"Appointment Cancelled"});
        }else{
            return res.json({success:false,message:"Cancellation Failed"});
            
        }


        
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api to get dashboard data for doctor panel
const doctordashboard=async (req,res)=>{
    try{
        const {docId}=req;
        const appointments=await appointmentmodel.find({doctorid:docId});
        let earnings=0;
        appointments.map((item)=>{
            if(item.iscompleted || item.payment){
                earnings+=item.amount;

            }

        });
        let patients=[];
        appointments.map((item)=>{
            if(!patients.includes(item.userid)){
                patients.push(item.userid);
            }
        })
        const dashdata={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestappointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashdata});

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api to get doctor profile for doctor panel
const doctorprofile=async (req,res)=>{
    try{
        const {docId}=req;
        const profiledata=await doctormodel.findById(docId).select("-password");
        res.json({success:true,profiledata});

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}
//api to update doctor profile data from doctor panle
const updatedoctorprofile=async (req,res)=>{
    try{
        const {docId}=req;
        const {fees,address,available}=req.body;
        await doctormodel.findByIdAndUpdate(docId,{fees,address,available});
        res.json({success:true,message:"Profile Updated"});


    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});//sending error message


    }
}

export {changeavailability,doctorlist,logindoctor,appointmentsdoctor,appointmentcancel,appointmentcomplete,doctordashboard,updatedoctorprofile,doctorprofile};