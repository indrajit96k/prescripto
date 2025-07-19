import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Appcontext } from '../context/Appcontext';
import { assets } from '../assets/assets_frontend/assets';

const Appointment = () => {
  const { docid } = useParams();
  const { doctors, currencysymbol } = useContext(Appcontext);
  const daysofweek=["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docinfo, setdocinfo] = useState(null);
  const [docslot, setdocslot] = useState([]);
  const [slotindex, setslotindex] = useState(0);
  const [slottime, setslottime] = useState("");

  const fetchdocinfo = async () => {
    const docinfo = doctors.find(doc => doc.id === docid);
    setdocinfo(docinfo);
    console.log(docinfo);
  };

  const getavailableSlots = async () => {
    setdocslot([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currdate = new Date(today);
      currdate.setDate(today.getDate() + i);

      let endtime = new Date(today);
      endtime.setDate(today.getDate() + i);
      endtime.setHours(21, 0, 0, 0);

      if (today.toDateString() === currdate.toDateString()) {
        currdate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10);
        const currentMinutes = currdate.getMinutes();
        currdate.setMinutes(currentMinutes > 30 ? 30 : 0);
      } else {
        currdate.setHours(10);
        currdate.setMinutes(0);
      }

      let timeslots = [];
      while (currdate < endtime) {
        let formateddate = currdate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        timeslots.push({
          datetime: new Date(currdate),
          time: formateddate,
        });

        currdate.setMinutes(currdate.getMinutes() + 30);
      }

      setdocslot(prev => [...prev, timeslots]);
    }
  };

  useEffect(() => {
    fetchdocinfo();
  }, [doctors, docid]);

  useEffect(() => {
    if (docinfo) getavailableSlots();
  }, [docinfo]);

  useEffect(() => {
    console.log(docslot);
  }, [docslot]);

  return docinfo && (
    <div>
      {/* doctor details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-indigo-500 w-full sm:max-w-72 rounded-lg' src={docinfo.image} alt="img" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* doctors info name, degree, etc */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docinfo.name}
            <img className='w-5' src={assets.verified_icon} />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docinfo.degree} - {docinfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docinfo.experience}</button>
          </div>
          {/* doctor about */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="info-icon" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docinfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencysymbol}{docinfo.fees}</span>
          </p>
        </div>
      </div>
      {/* booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docslot.length && docslot.map((item,index)=>(
              <div onClick={()=>setslotindex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotindex===index ? "bg-indigo-500 text-white" :"border border-gray-200"}`} key={index}>
                <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>

            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docslot.length && docslot[slotindex].map((item,index)=>(
            <p onClick={()=>setslottime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slottime ? "bg-indigo-500 text-white" : "text-gray-400 border border-gray-300"}`} key={index}>{item.time.toLowerCase()}</p>

          ))}
        </div>

      </div>
    </div>
  );
};

export default Appointment;
