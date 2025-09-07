import React, { useContext } from 'react'
import { Appcontext } from '../context/AppContext.jsx';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
const MyAppointments = () => {
  const {backendurl,token,getdoctorsdata}=useContext(Appcontext);
  const [appointments,setappointments]=useState([]);
  const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const navigate=useNavigate();
  const slotdateformat=(slotdate)=>{
    const datearr=slotdate.split("_");
    return datearr[0]+" "+months[Number(datearr[1])] + " "+datearr[2];

  }
  const getuserappointments=async ()=>{
    try{
      const {data}=await axios.get(backendurl+"/api/user/appointments",{headers:{token}});
      if(data.success){
        setappointments(data.allappointments.reverse());//reverse is to display reccent appointment on the top
        console.log(data.allappointments);



      }else{
        toast.error(data.message);

      }

    }catch(error){
      console.log(error.message);
      toast.error(error.message);

    }
  }
  const cancelappointment=async(appointmentId)=>{
    try{
      const {data}=await axios.post(backendurl+"/api/user/cancel-appointment",{appointmentId},{headers:{token}});
      if(data.success){
        toast.success(data.message);
        getuserappointments();
        getdoctorsdata();
      }else{
        toast.error(data.message);
      }
      // console.log(appointmentId);

    }catch(error){
      console.log(error.message);
      toast.error(error.message);

    }


  }
  const initpay=(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:"Appointment Payment",
      description:"Appointment Payment",
      order_id:order.id,
      receipt:order.receipt,
      handler:async (response)=>{
        console.log(response);
        try{
          const {data}=await axios.post(backendurl+"/api/user/verifyRazorpay",response,{headers:{token}});
          if(data.success){
            getuserappointments();
            navigate("/my-appointments");

          }

        }catch(error){
          console.log(error);
          toast.error(error.message);
        }

      }

    }
    const rzp=new window.Razorpay(options);
    rzp.open();


  }
  const appointmentrazorpay=async (appointmentId)=>{
    try{
      const {data}=await axios.post(backendurl+"/api/user/payment-razorpay",{appointmentId},{headers:{token}});
      if(data.success){
        // console.log(data.order);
        initpay(data.order);
        
      }

    }catch(error){
      console.log(error.message);
      toast.error(error.message);

    }
    
  }
  useEffect(()=>{
    if(token){
      getuserappointments();
    }

  },[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200 '>My Appointments</p>
      <div>
        {
          appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-200' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docdata.image} alt="img" />

              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docdata.name}</p>
                <p>{item.docdata.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docdata.address.line1}</p>
                <p className='text-xs'>{item.docdata.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotdateformat(item.slotdate)} | {item.slottime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.iscompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && !item.iscompleted && <button onClick={()=>appointmentrazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-indigo-500 hover:text-white transition-all duration-300'>Pay Online</button>}
                {!item.cancelled && !item.iscompleted && <button onClick={()=>cancelappointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button> }
                {item.cancelled && !item.iscompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                {item.iscompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
              </div>

            </div>
          ))

        }

      </div>
    </div>
  )
}

export default MyAppointments