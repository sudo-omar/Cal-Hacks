// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Change to use Routes
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import ReportAndTalk from "./components/ReportAndTalk";
import Appointment from "./components/appointments";
import Login from "./components/Login"; // Import the Login component
import { useState, useEffect } from 'react';


import { Link } from "react-router-dom";
import FirstAppointment from "./components/FirstAppoitment";
import SignUp from "./components/SignUp";
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
        <Route path="/report-and-talk" element={<ReportAndTalk />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointments/:id" element={<Appointment />} />
        
        <Route path="/appointments" element={<Appointment />} />

        <Route path="/login" element={<Login />} /> {/* Add this line */}
        <Route path="/appointments/1" element={<FirstAppointment />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
