import React, {useState, useEffect}  from 'react'
import axios from "axios";
import Spinner from "../components/Spinner"
import LoginButton from '../components/LoginButton'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from '../components/LogoutButton';
import { Link } from "react-router-dom"


const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [editBox, setEditBox] = useState(false);
  
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
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setHasPosted(true); 
    }}
  }, [isLoading, isAuthenticated, user, hasPosted]);
  

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  
  return (
    <div className="">
            <nav className="bg-red-100 p-4 flex flex-row justify-center"> 
              <Link className="text-center w-full font-semibold text-3xl" to="/">
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
                    <div>
                      <div className="flex flex-row">
                        Your Major: {user.major ? user.major : 'No major set'}
                        <button className="m-1 p-1 bg-gray-100 b-1 rounded-md" onClick={null}>Edit Major</button>
                      </div>
                      <div className="flex flex-col">
                        Your Minor: {user.minor ? user.minor : 'No minor set'}
                      </div>
                    </div>
                      }
                </div>
        </div>
  )
}

export default Profile