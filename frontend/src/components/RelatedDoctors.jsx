import React, { use, useState } from 'react'
import { Appcontext } from '../context/Appcontext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const RelatedDoctors = ({docid,speciality}) => {
    const navigate=useNavigate();
    const {doctors}=useContext(Appcontext);
    const [reldoc,setreldoc]=useState([]);
    useEffect(()=>{
        if(doctors.length>0 && speciality){
            const doctorsdata=doctors.filter((doc)=>doc.speciality === speciality && doc._id !== docid);
            setreldoc(doctorsdata);
        }

    },[doctors,docid,speciality]);
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
        {reldoc.slice(0,5).map((item,index)=>(
          <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
            <img className='bg-blue-50' src={item.image} alt="img" />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedDoctors