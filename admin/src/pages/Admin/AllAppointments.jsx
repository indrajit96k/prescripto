import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const { atoken, appointments, getallappointments,cancelappointment } = useContext(AdminContext);
  const { calculateage,currency } = useContext(AppContext);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  useEffect(() => {
    if (atoken) {
      getallappointments();
    }

  }, [atoken]);
  const slotdateformat = (slotdate) => {
    const datearr = slotdate.split("_");
    return datearr[0] + " " + months[Number(datearr[1])] + " " + datearr[2];

  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userdata.image} alt="userpic" />
              <p>{item.userdata.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateage(item.userdata.dob)}</p>
            <p>{slotdateformat(item.slotdate)} , {item.slottime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docdata.image} alt="docpic" />
              <p>{item.docdata.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> 
            :item.iscompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> :<img onClick={()=>cancelappointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="cancel" />}
            

          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments