import React, { use } from 'react'
import {assets} from "../assets/assets_frontend/assets"
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const Navbar = () => {
    const navigate=useNavigate();
    const [showmenu,setshowmenu]=useState(false);
    const [token,settoken]=useState(true);
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate("/")} className='w-44 cursor-pointer' src={assets.logo} alt="prescripto-logo"/>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to={'/'}>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-amber-950 color w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to={'/doctors'}>
                <li className='py-1'>ALL DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-amber-950 w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to={"/about"}>
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5  bg-amber-950 w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to={"/contact"}>
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5  bg-amber-950 w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token ?
                <div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className="w-8 rounded-full"src={assets.profile_pic} alt="profile_picture" />
                    <img src={assets.dropdown_icon} className='w-2.5' alt="dropdown" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate("/my-profile")} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate("/my-appointments")} className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={()=>settoken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :
                <button onClick={()=>navigate("/login")} className="bg-indigo-500 text-white px-8 py-3 rounded-full font-medium hidden md:block">Create account</button>
                
            }
            <img onClick={()=>setshowmenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="menu" />
            {/* mobile menu */}
            <div className={`${showmenu ? 'fixed w-full' :'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={()=>setshowmenu(false)} src={assets.cross_icon} alt="" />

                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink  onClick={()=>setshowmenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                    <NavLink  onClick={()=>setshowmenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                    <NavLink  onClick={()=>setshowmenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                    <NavLink  onClick={()=>setshowmenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>

                </ul>
            </div>
            
        </div>
    </div>
  )
}

export default Navbar