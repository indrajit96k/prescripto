import { useState } from "react";
import { createContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
export const AdminContext=createContext();
const AdminContextProvider=(props)=>{
    const [atoken,setatoken]=useState(localStorage.getItem("atoken") ? localStorage.getItem("atoken") : "" );
    const backendurl=import.meta.env.VITE_BACKEND_URL;
    //state to store all doctors
    const [doctors,setdoctors]=useState([]);
    const [appointments,setappointments]=useState([]);
    const [dashdata,setdashdata]=useState(false);
    const getalldoctors=async ()=>{
        try{
            const {data}= await axios.post(backendurl+"/api/admin/all-doctors",{},{headers:{atoken}});
            if(data.success){
                setdoctors(data.doctors);
                console.log(data.doctors);
                // console.log(doctors);
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }
    const changeavailability=async (docid)=>{
        try{
            const {data}=await axios.post(backendurl+"/api/admin/change-availability",{docid},{headers:{atoken}});
            if(data.success){
                toast.success(data.message);
                //after updating the avail now render all doctors again
                getalldoctors();

            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }
    const getallappointments=async ()=>{
        try{
            const {data}=await axios.get(backendurl+"/api/admin/appointments",{headers:{atoken}});
            if(data.success){
                setappointments(data.appointments);
                console.log(data.appointments);
            }else{
                toast.error("Cannot Fetch Appointments");
            }


        }catch(error){
            toast.error(error.message);
        }
    }
    const cancelappointment=async (appointmentId)=>{
        try{
            const {data}=await axios.post(backendurl+"/api/admin/cancel-appointment",{appointmentId},{headers:{atoken}});
            if(data.success){
                toast.success(data.message);
                getallappointments();
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }
    const getdashdata=async ()=>{
        try{
            const {data}=await axios.get(backendurl+"/api/admin/dashboard",{headers:{atoken}});
            if(data.success){
                setdashdata(data.dashdata);
                console.log(data.dashdata);
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(error.message);
        }
    }

    const value={
        atoken,setatoken,
        backendurl,
        doctors,getalldoctors,
        changeavailability,
        appointments,setappointments,
        getallappointments,
        cancelappointment,
        dashdata,getdashdata
    }
    return (
        <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>
    )

}
export default AdminContextProvider;