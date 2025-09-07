import React, { useContext } from 'react'
import Login from './pages/Login'
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/ReactToastify.css"
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import {Route, Routes} from "react-router-dom"
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import Doctorslist from './pages/Admin/Doctorslist';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
const App = () => {
  const {atoken}=useContext(AdminContext);
  const {dtoken}=useContext(DoctorContext);
  return atoken || dtoken ?(
    <div className='bg-[#F8F9FD]'>
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <div className='flex items-start'>
        <Sidebar></Sidebar>
        <Routes>
          {/* admin routes */}
          <Route path='/' element={<></>}></Route>
          <Route path='/admin-dashboard' element={<Dashboard></Dashboard>}></Route>
          <Route path='/all-appointments' element={<AllAppointments></AllAppointments>}></Route>
          <Route path='/add-doctor' element={<AddDoctor></AddDoctor>}></Route>
          <Route path='/doctor-list' element={<Doctorslist></Doctorslist>}></Route>
          {/* doctor routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard></DoctorDashboard>}></Route>
          <Route path='/doctor-appointments' element={<DoctorAppointment></DoctorAppointment>}></Route>
          <Route path='/doctor-profile' element={<DoctorProfile></DoctorProfile>}></Route>

        </Routes>
      </div>

    </div>
    
  ) : (
    <>
      <Login></Login>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App