import React from 'react';
import {Routes, Route, Link} from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Schedule from "./pages/Schedule.jsx";
import Login from "./pages/Login.jsx";
import './App.css';
import { CgProfile } from 'react-icons/cg';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const App = () => {
  return (
      <div className="w-full h-screen bg-gray-200">
        <nav className="bg-stone-500 p-4 flex flex-row justify-end">
          <div className="grow min-h-full flex flex-col my-auto h-full">
            <Link to="/" className="justify-center text-center w-full font-semibold text-3xl">
              R U SCHEDULING?
            </Link>
          </div>
          <div className="min-w-fit flex flex-row justify-end h-10">
              <div className="min-w-fit flex flex-row align-middle min-h-full">
                <div className="p-2 min-w-fit flex flex-row bg-stone-600 text-white rounded-full hover:bg-stone-200 hover:text-black border-2 shadow-lg border-black/50 hover:border-black">
                  <Link to="/profile" className="flex flex-row min-h-full min-w-fit align-middle items-center">
                    <CgProfile className="min-h-full h-6 w-6 " />
                    <div className="p-1">Profile</div>
                  </Link>
                </div>
                <div className="pl-2">
                  <div className="flex flex-col h-full justify-center items-center ">
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </div>
        </nav>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/schedule' element={<Schedule/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      </div>
  )
}

export default App