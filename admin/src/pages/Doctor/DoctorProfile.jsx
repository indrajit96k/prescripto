import React, { useState } from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dtoken, getdoctorprofile, doctordata, setdoctordata,backendurl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isedit,setisedit]=useState(false);
  const updateprofile=async ()=>{
    try{
      const updatedata={
        address:doctordata.address,
        fees:doctordata.fees,
        available:doctordata.available

      }
      const {data}=await axios.post(backendurl+"/api/doctor/update-profile",updatedata,{headers:{dtoken}});
      if(data.success){
        toast.success("Profile Updated");
        setisedit(false);
        getdoctorprofile();
      }else{
        toast.error("Cannot Update Profile");
      }

    }catch(error){
      toast.error(error.message);
    }

  }
  useEffect(() => {
    if (dtoken) {
      getdoctorprofile();
    }

  }, [dtoken]);
  return doctordata && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-indigo-500/80 w-full sm:max-w-64 rounded-lg ' src={doctordata.image} alt="" />
        </div>
        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          {/* docinfo name,degree,exp */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{doctordata.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{doctordata.degree} - {doctordata.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{doctordata.experience}</button>
          </div>
          {/* doc about */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{doctordata.about}</p>
          </div>
          <p className='text-gray-600 font-medium mt-4'>Appointment Fees: <span className='text-gray-800'>{currency} { isedit ? <input type='number' onChange={(e)=>setdoctordata(prev=>({...prev,fees:e.target.value}))} value={doctordata.fees}></input> : doctordata.fees}</span></p>
          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>{isedit ? <input type='text' onChange={(e)=>setdoctordata(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={doctordata.address.line1}></input>: doctordata.address.line1} <br /> 
            {isedit ? <input type='text' onChange={(e)=>setdoctordata(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} value={doctordata.address.line2}></input>: doctordata.address.line2}</p>

            
          </div>
          <div className='flex gap-1 pt-2'>
            <input onChange={()=>isedit && setdoctordata(prev=>({...prev,available:!prev.available}))} checked={doctordata.available} type="checkbox" />
            <label htmlFor="">Available</label>
          </div>
          {
            isedit ? <button onClick={updateprofile} className='px-4 py-1 border border-indigo-500 text-sm rounded-full mt-5 hover:bg-indigo-500 hover:text-white transition-all'>Save</button>
            : <button onClick={()=>setisedit(true)} className='px-4 py-1 border border-indigo-500 text-sm rounded-full mt-5 hover:bg-indigo-500 hover:text-white transition-all'>Edit</button>
          }
          
        
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile