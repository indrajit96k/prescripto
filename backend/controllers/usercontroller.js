import validator from 'validator';
import bcyrpt from 'bcrypt';
import usermodel from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctormodel from '../models/doctormodel.js';
import razorpay from "razorpay";
import appointmentmodel from '../models/appointmentmodel.js';
//api to register a new user
const registeruser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter strong password" });

        }
        const salt = await bcyrpt.genSalt(10);
        const hashedPassword = await bcyrpt.hash(password, salt);
        const userdata = {
            name,
            email,
            password: hashedPassword

        }
        const newuser = new usermodel(userdata);
        await newuser.save();
        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET);
        res.json({ success: true, token })

    } catch (error) {
        console.error("Error in registeruser:", error);
        res.json({ success: false, message: error.message });//sending error message
    }


}
//user login api
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const ismatch = await bcyrpt.compare(password, user.password);
        if (ismatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });

        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }



    } catch (error) {
        console.error("Error in login:", error);
        res.json({ success: false, message: error.message });//sending error message

    }
}
//api to get user details
const getprofile = async (req, res) => {
    try {
        const { userId } = req;
        const userdata = await usermodel.findById(userId).select("-password");
        res.json({ success: true, userdata });

    } catch (error) {
        res.json({ success: false, message: error.message });//sending error message

    }
}
//api to update user profile
const updateprofile = async (req, res) => {
    try {
        const { userId } = req;
        const { name, phone, address, dob, gender } = req.body;
        const imagefile = req.file;
        if (!name || !phone || !gender || !dob) {
            return res.json({ success: false, message: "Missing Details" });

        }
        await usermodel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imagefile) {
            //upload image to cloudinary
            const imageupload = await cloudinary.uploader.upload(imagefile.path, { resource_type: "image" });
            const imageurl = imageupload.secure_url;
            await usermodel.findByIdAndUpdate(userId, { image: imageurl });
        }
        res.json({ success: true, message: "Profile Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });//sending error message

    }

}
//api to book appointment
const bookappointment = async (req, res) => {
    try {
        const { userId } = req;
        const { docid, slotdate, slottime } = req.body;
        const docdata = await doctormodel.findById(docid).select("-password");
        if (!docdata.available) {
            return res.json({ success: false, message: "Doctor Not Available" });


        }
        let slotsbooked = docdata.slots_booked;
        //check for slots availabilty
        if (slotsbooked[slotdate]) {
            if (slotsbooked[slotdate].includes(slottime)) {
                return res.json({ success: false, message: "Doctor Not Available" });


            } else {
                //free slot
                slotsbooked[slotdate].push(slottime);
            }

        } else {
            slotsbooked[slotdate] = [];
            slotsbooked[slotdate].push(slottime);
        }
        const userdata = await usermodel.findById(userId).select("-password");
        delete docdata.slots_booked;
        const appointmentdata = {
            userid: userId,
            doctorid: docid,
            userdata,
            docdata,
            amount: docdata.fees,
            slottime,
            slotdate,
            date: Date.now()
        }
        const newappointment = new appointmentmodel(appointmentdata);
        await newappointment.save();
        //save new slots data in docdata
        await doctormodel.findByIdAndUpdate(docid, { slots_booked: slotsbooked });
        res.json({ success: true, message: "Appointment Booked" });



    } catch (error) {
        res.json({ success: false, message: error.message });//sending error message

    }
}
//api to get list of all appointments booked
const listappointments = async (req, res) => {
    try {
        const { userId } = req;
        const allappointments = await appointmentmodel.find({ userid: userId });
        res.json({ success: true, allappointments });


    } catch (error) {
        res.json({ success: false, message: error.message });//sending error message

    }

}
//api to cancel appointment
const cancelappointment = async (req, res) => {
    try {
        const { userId } = req;
        const { appointmentId } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentId);
        //verify appointment user
        if (userId !== appointmentdata.userid) {
            return res.json({ success: false, message: "Unauthorised action" })


        }
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
const razorpayinstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
//api to make online payment for user
const paymentrazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentdata = await appointmentmodel.findById(appointmentId);
        if (!appointmentdata || appointmentdata.cancelled) {
            return res.json({ success: false, message: "Appointment cancelled or not Found" });
        }

        //creating options for razorpay payment
        const options = {
            amount: appointmentdata.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,

        }
        //creation of an order
        const order = await razorpayinstance.orders.create(options);
        res.json({ success: true, order })


    } catch (error) {
        res.json({ success: false, message: error.message });
    }



}
//api to verify payment of razorpay
const verifyrazorpay=async (req,res)=>{
    try{
        const {razorpay_order_id}=req.body;
        const orderinfo=await razorpayinstance.orders.fetch(razorpay_order_id);
        if(orderinfo.status==="paid"){
            await appointmentmodel.findByIdAndUpdate(orderinfo.receipt,{payment:true});
            res.json({success:true,message:"Payment Successful"});


        }else{
            res.json({success:false,message:"Payment Failed"});
        }

    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export { registeruser, loginuser, getprofile, updateprofile, bookappointment, listappointments, cancelappointment,paymentrazorpay,verifyrazorpay};