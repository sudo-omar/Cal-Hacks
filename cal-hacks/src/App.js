// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Change to use Routes
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
<<<<<<< HEAD
=======
import LogOfCases from "./components/LogOfCases";
>>>>>>> 9d71a6a9e06b9deceb008665f1c2ec13e96974f5
import ReportAndTalk from "./components/ReportAndTalk";
import Appointment from "./components/appointments";
import Login from "./components/Login"; // Import the Login component


<<<<<<< HEAD

=======
import { Link } from "react-router-dom";
import FirstAppointment from "./components/FirstAppoitment";
import SecondAppointment from "./components/SecondAppoitment";
import ThirdAppointment from "./components/ThirdAppoitment";
import SignUp from "./components/SignUp";
>>>>>>> 9d71a6a9e06b9deceb008665f1c2ec13e96974f5
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar always displayed */}
      <Routes>
        {" "}
        {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} />{" "}
        {/* Use element prop instead of component */}
<<<<<<< HEAD
=======
        <Route path="/log-of-cases" element={<LogOfCases />} />
>>>>>>> 9d71a6a9e06b9deceb008665f1c2ec13e96974f5
        <Route path="/report-and-talk" element={<ReportAndTalk />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointments/:id" element={<Appointment />} />
        
        <Route path="/appointments" element={<Appointment />} />
<<<<<<< HEAD

        <Route path="/login" element={<Login />} /> {/* Add this line */}
=======
        <Route path="/appointments/1" element={<FirstAppointment />} />
        <Route path="/appointments/2" element={<SecondAppointment />} />
        <Route path="/appointments/3" element={<ThirdAppointment />} />
        <Route path="/signup" element={<SignUp />} />
>>>>>>> 9d71a6a9e06b9deceb008665f1c2ec13e96974f5
      </Routes>
    </Router>
  );
};

export default App;
