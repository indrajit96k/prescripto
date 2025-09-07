import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
  const [state, setstate] = useState("Admin");
  const { setatoken, backendurl } = useContext(AdminContext);
  const { setdtoken } = useContext(DoctorContext);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const onsubmithandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendurl + '/api/admin/login', { email, password });
        if (data.success) {
          // console.log(data.token);
          localStorage.setItem("atoken", data.token);
          setatoken(data.token);

        } else {
          toast.error(data.message);
        }


      } else {
        //doctor login
        const { data } = await axios.post(backendurl + "/api/doctor/login", { email, password });
        if (data.success) {
          // console.log(data.token);
          localStorage.setItem("dtoken", data.token);
          setdtoken(data.token);
          console.log(data.token);

        } else {
          toast.error(data.message);
        }

      }

    } catch (error) {

    }


  }
  return (
    <form onSubmit={onsubmithandler} className='min-h-[80vh] flex items-center' action="">
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-[#5f6FFF]'>{state}</span> Login
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setemail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setpassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-indigo-500 text-white w-full py-2 rounded-md text-base'>Login</button>
        {
          state === "Admin" ? <p className='m-auto font-semibold'>Doctor Login ? <span className='text-indigo-500 cursor-pointer' onClick={() => setstate("Doctor")}>Click here</span></p> : <p className='m-auto font-semibold'>Admin Login ? <span className='text-indigo-500 cursor-pointer' onClick={() => setstate("Admin")}>Click here</span></p>

        }

      </div>
    </form>

  )
}

export default Login