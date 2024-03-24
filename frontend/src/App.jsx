import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Schedule from "./pages/Schedule.jsx";
import Login from "./pages/Login.jsx";
import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/schedule' element={<Schedule/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
  )
}

export default App