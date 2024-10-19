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

import { Link } from "react-router-dom";
import FirstAppointment from "./components/FirstAppoitment";
import SecondAppointment from "./components/SecondAppoitment";
import ThirdAppointment from "./components/ThirdAppoitment";

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
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/appointments/1" element={<FirstAppointment />} />
        <Route path="/appointments/2" element={<SecondAppointment />} />
        <Route path="/appointments/3" element={<ThirdAppointment />} />
        <Route path="/login" element={<Login />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;
