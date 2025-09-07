import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();
const DoctorContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [dtoken, setdtoken] = useState(localStorage.getItem("dtoken") ? localStorage.getItem("dtoken") : "");
    const [appointments, setappointments] = useState([]);
    const [dashdata, setdashdata] = useState(false);
    const [doctordata,setdoctordata]=useState(false);
    const getappointments = async () => {
        try {
            const { data } = await axios.get(backendurl + "/api/doctor/appointments", { headers: { dtoken } });
            if (data.success) {
                setappointments(data.appointments.reverse());
                console.log(data.appointments.reverse());


            } else {
                toast.error("Cannot Find Appointments");
            }

        } catch (error) {
            toast.error(error.message);
        }
    }
    const completeappointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendurl + "/api/doctor/complete-appointment", { appointmentId }, { headers: { dtoken } });
            if (data.success) {
                toast.success(data.message);
                getappointments();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }
    const cancelappointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendurl + "/api/doctor/cancel-appointment", { appointmentId }, { headers: { dtoken } });
            if (data.success) {
                toast.success(data.message);
                getappointments();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }
    const dashboarddata = async () => {
        try {
            const { data } = await axios.get(backendurl + "/api/doctor/dashboard",{headers:{dtoken}});
            if (data.success) {
                setdashdata(data.dashdata);
                console.log(dashdata);
            }else{
                toast.error("Cannot load dashboard Data");
            }

        } catch (error) {
            toast.error(error.message);
        }

    }
    const getdoctorprofile=async ()=>{
        try{
            const {data}=await axios.get(backendurl+"/api/doctor/profile",{headers:{dtoken}});
            if(data.success){
                console.log(data.profiledata);
                setdoctordata(data.profiledata);
                

            }else{
                toast.error("Cannot Load profile");
            }

        } catch (error) {
            toast.error(error.message);
        }
    }
    const value = {
        dtoken, setdtoken,
        backendurl,
        getappointments,
        appointments, setappointments,
        completeappointment, cancelappointment,
        dashdata,setdashdata,dashboarddata,getdoctorprofile,doctordata,setdoctordata

    }
    return (
        <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>
    )

}
export default DoctorContextProvider;