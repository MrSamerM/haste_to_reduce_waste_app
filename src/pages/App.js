// import ImageClassifier from "./ImageClassifier";
import Home from "./Home";
import FoodLabels from "./FoodLabels";
import E_Commerce from "./E_Commerce";
import Donate from "./Donate";
import UpdateDonation from "./UpdateDonation";
import ReserveDonation from "./ReserveDonation";
import UpdateReservedDonation from "./UpdateReservedDonation";
import Signup from "./SignUp";
import Login from "./Login";
import Navbar from "./Navbar";
import '../styling/App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import axios from "axios";




function App() {

  const [sessionAvailability, setSessionAvailability] = useState(false);
  axios.defaults.withCredentials = true;

  useEffect(() => {

    const check = (async () => {

      try {
        const res = await axios.get('http://localhost:8000/session_check');

        if (res.data.available === false) {
          setSessionAvailability(false);
        }
        else {
          setSessionAvailability(true);
        }
      }
      catch (e) {
        console.log("Error when getting request", e)
      }
    })

    check();

  }, [sessionAvailability])

  return (
    <div>
      <Navbar sessionAvailability={sessionAvailability} setSessionAvailability={setSessionAvailability} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food_labels" element={<FoodLabels />} />
        <Route path="/signup" element={sessionAvailability === false ? <Signup setSessionAvailability={setSessionAvailability} /> : <Navigate to={'/'} />} />
        <Route path="/login" element={sessionAvailability === false ? <Login setSessionAvailability={setSessionAvailability} /> : <Navigate to={'/'} />} />
        <Route path="/e_commerce" element={sessionAvailability === true ? <E_Commerce /> : <Navigate to={'/'} />} />
        <Route path="/donate" element={sessionAvailability === true ? <Donate /> : <Navigate to={'/'} />} />
        <Route path="/update_donation" element={sessionAvailability === true ? <UpdateDonation /> : <Navigate to={'/'} />} />
        <Route path="/reserve_donation" element={sessionAvailability === true ? <ReserveDonation /> : <Navigate to={'/'} />} />
        <Route path="/update_reserved_donation" element={sessionAvailability === true ? <UpdateReservedDonation /> : <Navigate to={'/'} />} />
      </Routes>

    </div>
  );
}

export default App;
