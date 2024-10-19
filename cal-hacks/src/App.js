// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change to use Routes
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import LogOfCases from './components/LogOfCases';
import ReportAndTalk from './components/ReportAndTalk';
import { Link } from 'react-router-dom';
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar always displayed */}
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} /> {/* Use element prop instead of component */}
        <Route path="/log-of-cases" element={<LogOfCases />} />
        <Route path="/report-and-talk" element={<ReportAndTalk />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </Router>

  );
};

export default App;
