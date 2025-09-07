import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets';
import { useContext } from 'react';
import { Appcontext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const {userdata, setuserdata,token,backendurl,loaduserprofile} = useContext(Appcontext);

  const [isedit, setisedit] = useState(false);
  const [image,setimage]=useState(false);
  const updateuserprofiledata=async()=>{
    //api call to update user profile
    try{
      const formdata=new FormData();
      formdata.append("name",userdata.name);
      formdata.append("phone",userdata.phone);
      formdata.append("address",JSON.stringify(userdata.address));
      formdata.append("gender",userdata.gender);
      formdata.append("dob",userdata.dob);
      if(image){
        formdata.append("image",image);
      }
      const {data}=await axios.post(backendurl+"/api/user/update-profile",formdata,{headers:{token}});
      if(data.success){
        toast.success(data.message);  
        await loaduserprofile();
        setisedit(false);
        setimage(false);
      }else{
        toast.error(data.message);
      }


    }catch(error){
      console.log(error);
      toast.error(error.message);

    }

  }

  return userdata && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isedit ? <label htmlFor='image'>
          <div className='inline-block cursor-pointer relative'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userdata.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? "" : assets.upload_icon} alt="" />
          </div>
          <input onChange={(e)=>setimage(e.target.files[0])} type="file" id='image' hidden />
        </label> : <img className='w-36 rounded' src={userdata.image} alt="user_pic" />
      }
      
      {
        isedit ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' value={userdata.name} onChange={(e) => setuserdata(prev => ({ ...prev, name: e.target.value }))} type='text' /> : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userdata.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-500'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userdata.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isedit ? <input className='bg-gray-100 max-w-52' value={userdata.phone} onChange={(e) => setuserdata(prev => ({ ...prev, phone: e.target.value }))} type='text' /> : <p className='text-blue-500'>{userdata.phone}</p>
          }

          <p className='font-medium'>
            Address:

          </p>
          {
            isedit ? <p>
              <input className='bg-gray-50' onChange={(e) => setuserdata(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userdata.address.line1} type="text" />
              <br />
              <input className='bg-gray-50' onChange={(e) => setuserdata(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userdata.address.line2} type="text" />
            </p> : <p className='text-gray-500'>
              {userdata.address.line1} <br />
              {userdata.address.line2}

            </p>
          }

        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>
            Gender:
          </p>
          {
            isedit ? <select value={userdata.gender} className='max-w-20 bg-gray-100' onChange={(e)=>setuserdata(prev=>({...prev,gender:e.target.value}))} >
              <option value="Male">Male</option>
              <option  value="Female">Female</option>
            </select> : <p className='text-gray-400'>{userdata.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {
            isedit ? <input className='max-w-28 bg-gray-100' onChange={(e)=>setuserdata(prev=>({...prev,dob:e.target.value}))} type='date' value={userdata.dob}/> : <p className='text-gray-400'>{userdata.dob}</p>
          }
        </div>

      </div>
      <div className='mt-10'>
        {isedit ? <button className='border border-indigo-500 px-8 py-2 rounded-full  hover:bg-indigo-500 hover:text-white transition-all' onClick={updateuserprofiledata}>Save Information</button> : <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={() => setisedit(true)}>Edit</button>}

      </div>


    </div>
  )
}

export default MyProfile