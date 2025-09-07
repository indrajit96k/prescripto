import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
const DoctorDashboard = () => {
  const { dtoken, dashdata, setdashdata, dashboarddata,completeappointment,cancelappointment } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotdateformat = (slotdate) => {
    const datearr = slotdate.split("_");
    return datearr[0] + " " + months[Number(datearr[1])] + " " + datearr[2];

  }
  useEffect(() => {
    if (dtoken) {
      dashboarddata();
    }

  }, [dtoken])
  return dashdata && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="docicon" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashdata.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="appicon" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="docicon" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border-gray-900'>
          <img src={assets.list_icon} alt="list" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border-gray-900 border-t-0'>
          {
            dashdata.latestappointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.userdata.image} alt="docimg" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userdata.name}</p>
                  <p className='text-gray-600'>{slotdateformat(item.slotdate)}</p>
                </div>
                {
                  item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.iscompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <div className='flex'>
                    <img onClick={() => cancelappointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="cancel" />
                    <img onClick={() => completeappointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="cancel" />
                  </div>
                }

              </div>

            ))

          }

        </div>
      </div>


    </div>
  )
}

export default DoctorDashboard