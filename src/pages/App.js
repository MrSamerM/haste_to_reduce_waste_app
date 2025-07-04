import Home from "./Home";
import FoodLabels from "./FoodLabels";
import E_Commerce from "./E_Commerce";
import Donate from "./Donate";
import UpdateDonation from "./UpdateDonation";
import ReserveDonation from "./ReserveDonation";
import UpdateReservedDonation from "./UpdateReservedDonation";
import UpdateDonationDetails from "./UpdateDonationDetails";
import Signup from "./SignUp";
import Login from "./Login";
import Navbar from "./Navbar";
import Receipt from "./Receipt";
import '../styling/App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import axios from "axios";

// assistance throughout the web application backend, and frontend. This course regularly updates
// Steele, C. (2025) The Web Developer Bootcamp 2025. Available at:
// https://www.udemy.com/course/the-web-developer-bootcamp (Accessed: 20 December 2024)

function App() {

  const [sessionAvailability, setSessionAvailability] = useState(null);
  const [userPoints, setUserPoints] = useState(null);

  axios.defaults.withCredentials = true;

  useEffect(() => {

    const check = (async () => {

      try {
        const res = await axios.get('http://localhost:8000/session_check');
        const resSecond = await axios.get('http://localhost:8000/userPoints');
        setSessionAvailability(res.data.available);
        setUserPoints(resSecond.data.result.points);
      }
      catch (e) {
        console.log("Error when getting request", e)
        setSessionAvailability(false);
      }
    })
    check();

  }, [userPoints, sessionAvailability])

  // OpenAI. (2025). ChatGPT (20 January Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 20 January 2025).
  // Prompt: when I am in a page that requires a express session, I reload, and it returns me to the homepage. 
  // Is it because I have to make sure that there is a express session in all pages?   
  // example what should I add to this page to make it so I refresh on the same page
  // (sent code of app js and ReserveDonation)

  if (sessionAvailability === null) {
    return <div id="loading"></div>;
  }

  return (
    <div>
      <Navbar sessionAvailability={sessionAvailability} setSessionAvailability={setSessionAvailability} userPoints={userPoints} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food_labels" element={<FoodLabels />} />
        <Route path="/signup" element={sessionAvailability === false ? <Signup setSessionAvailability={setSessionAvailability} /> : <Navigate to={'/'} />} />
        <Route path="/login" element={sessionAvailability === false ? <Login setSessionAvailability={setSessionAvailability} /> : <Navigate to={'/'} />} />
        <Route path="/e_commerce" element={sessionAvailability === true ? <E_Commerce /> : <Navigate to={'/'} />} />
        <Route path="/receipt" element={sessionAvailability === true ? <Receipt /> : <Navigate to={'/'} />} />
        <Route path="/donate" element={sessionAvailability === true ? <Donate /> : <Navigate to={'/'} />} />
        <Route path="/update_donation" element={sessionAvailability === true ? <UpdateDonation /> : <Navigate to={'/'} />} />
        <Route path="/reserve_donation" element={sessionAvailability === true ? <ReserveDonation /> : <Navigate to={'/'} />} />
        <Route path="/update_reserved_donation" element={sessionAvailability === true ? <UpdateReservedDonation /> : <Navigate to={'/'} />} />
        <Route path="/update_reserved_donation/update_donation_details/:id" element={sessionAvailability === true ? <UpdateDonationDetails /> : <Navigate to={'/'} />} />

      </Routes>

    </div>
  );
}

export default App;
