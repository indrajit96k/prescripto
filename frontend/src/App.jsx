import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Login from './pages/Login' 
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/ReactToastify.css"
const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/doctors' element={<Doctors></Doctors>}></Route>
        <Route path='/doctors/:speciality' element={<Doctors></Doctors>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/about' element={<About></About>}></Route>
        <Route path='/contact' element={<Contact></Contact>}></Route>
        <Route path='/my-profile' element={<MyProfile></MyProfile>}></Route>
        <Route path='/my-appointments' element={<MyAppointments></MyAppointments>}></Route>
        <Route path='/appointment/:docid' element={<Appointment></Appointment>}></Route>

      </Routes>
      <Footer></Footer>
    </div>
  )
}

export default App