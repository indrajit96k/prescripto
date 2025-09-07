import React, { useEffect, useState, createContext } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';

export const Appcontext = createContext();

const AppContextProvider = (props) => {
  const currencysymbol = "$";
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setdoctors] = useState([]);
  const [token, settoken] = useState(localStorage.getItem("token") || false);

  // ✅ Initialize userdata as an object instead of false
  const [userdata, setuserdata] = useState({
    name: "",
    email: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
    image: ""
  });

  const loaduserprofile = async () => {
    try {
      const { data } = await axios.get(
        backendurl + "/api/user/get-profile",
        { headers: { token } }
      );

      if (data.success) {
        setuserdata(data.userdata); // ✅ replace with backend data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getdoctorsdata = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/list");
      if (data.success) {
        setdoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getdoctorsdata();
  }, []);

  useEffect(() => {
    if (token) {
      loaduserprofile();
    } else {
      // reset userdata when logged out
      setuserdata({
        name: "",
        email: "",
        phone: "",
        address: { line1: "", line2: "" },
        gender: "",
        dob: "",
        image: ""
      });
    }
  }, [token]); // ✅ added dependency so it runs only when token changes

  const value = {
    doctors,
    currencysymbol,
    token,
    settoken,
    backendurl,
    userdata,
    setuserdata,
    loaduserprofile,
    getdoctorsdata
  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};

export default AppContextProvider;
