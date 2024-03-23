import React, {useState, useEffect}  from 'react'
import axios from "axios";
import Spinner from "../components/Spinner"
import LoginButton from '../components/LoginButton'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from '../components/LogoutButton';
import { Link } from "react-router-dom"
import { HiOutlineX } from "react-icons/hi";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [hasPosted, setHasPosted] = useState(sessionStorage.getItem("hasPosted") === "true");
  const [open, setOpen] = useState(false);

  const popUp =
  
  useEffect(()=> {
    setLoading(true);
    axios
    .get('http://localhost:5001/users')
    .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
    })
    .catch((error)=>{
        console.log(error);
        setLoading(false);
    })
  }, [])

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPosted && !loading) {
      const useremail = user.email;
      const emailExists = users.some(user => user.username === useremail);
      
      if (!emailExists) {
        axios.post('http://localhost:5001/users/', { username: useremail })
          .then((res) => {
            setUsers(currentUsers => [...currentUsers, res.data]);
            setHasPosted(true); 
            console.log(res.data)
            sessionStorage.setItem("hasPosted", "true");
          })
          .catch((error) => {
            console.log(error);
            
          });
      } else {
        setHasPosted(true); 
        sessionStorage.setItem("hasPosted", "true");
    }}
  }, [isLoading, isAuthenticated, user, hasPosted]);
  

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  
  return (
    <div className="bg-blue">
      {open && isAuthenticated &&
      <div className="absolute min-w-[50%] min-h-[50%] bg-gray-500 p-3 m-5 ">
        <div className="flex flex-row min-w-full justify-start align-middle">
          <div className="grow text-center align-middle min-h-full font-semibold text-2xl">
            EDIT PROFILE
          </div>
          <HiOutlineX className="h-8 w-8 cursor-pointer stroke-red-900" onClick={() => setOpen(!open)}/>
        <div/>
        </div>
        <div>Set Major To: </div>
      </div>
      }
      <nav className="bg-stone-500 p-4 flex flex-row justify-center "> 
        <Link className="m-auto" to="/">
          <div className="text-center w-full font-semibold text-3xl">RU SCHEDULING</div>
        </Link>
          <div className="min-w-fit">
          {isLoading && <div>Loading</div>}
          {(!isLoading && !isAuthenticated) ? <LoginButton/> : 
              <div className="min-w-fit flex flex-row align-middle min-h-full">
                  <div className="pl-2"> <LogoutButton/> </div>
                  
              </div>
          }
          

          </div>
          
      </nav>
      
      
      <div>
        {isAuthenticated && 
        <div className="h-full min-w-full">
          <div className="bg-slate-200 rounded-md p-5 m-5 w-fit mx-auto">
          <div className="flex flex-row justify-center text-lg font-semibold">
            Your Major 
          </div>
          <div className="flex flex-row justify-center">
            {user.major ? user.major : 'No major set'}
          </div>
          <div className="flex flex-row justify-center text-lg font-semibold">
            Your Minor 
          </div>
          <div className="flex flex-row justify-center">
            {user.minor ? user.minor : 'No minor set'}
          </div>
          <button className="border border-black p-1 m-1 bg-gray-200 rounded-sm hover:bg-gray-300" onClick={() => setOpen(!open)}>Edit Profile</button>
          </div>
        </div>
          }
      </div>
    </div>
  )
}

export default Profile