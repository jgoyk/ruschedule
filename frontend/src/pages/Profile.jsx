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
  
<<<<<<< Updated upstream
=======
  
  const validateData = () => {
    let errors = {};
    const courseExists = courseList.some(course => course.courseString === formData.courseCode);
    const courseInList = currentUser.courses.some(course => course[2] === formData.courseCode);
    if (!courseExists) {
      errors.exists = "Course is not in our database";
      alert("Course is invalid")
    }
    if (courseInList) {
      errors.inList = "Course already in your courses";
      alert("Course is already in account")
    }
    
    const validYear = formData.courseYear !== ""
    const validTerm = formData.courseTerm !== ""
    if (!validYear) {
      errors.year = "Select a valid year"
      alert("Please select a year")
    }
    if (!validTerm) {
      errors.term = "Select a valid term"
      alert("Please select a term")
    }

    setFormData((prevState) => ({ ...prevState, errors }));
    return Object.keys(errors).length === 0;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeMajor = (event) => {
    const { name, value } = event.target;
    setFormDataMajor((prevState) => ({ ...prevState, [name]: value }));
  };
  

  
  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    if (!validateData()) {
      console.log("error")
      console.log(errors)
      setErrors({});
      formData.courseCode = ""
      return; 
    }
  
    setErrors({});
    const useremail1 = user.email;
    console.log(formData)
    setLoading(true)
    const updatedUser = {
      username: currentUser.username,
      major: currentUser.major,
      minor: currentUser.minor,
      courses: [...currentUser.courses,[formData.courseTerm, formData.courseYear, formData.courseCode]]
    }
    formData.courseCode = ""
    setCurrentUser(updatedUser)
    setOpen(!open)
    axios.put(`${import.meta.env.VITE_LINK}/users/${currentUser.username}`, updatedUser)
      .then((res) => {
        setLoading(false)
        console.log("updated")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

  const handleSubmitMajor = (event) => {
    event.preventDefault(); 
    const updatedUser = {
      username: currentUser.username,
      major: formDataMajor.major,
      minor: currentUser.minor,
      courses: currentUser.courses
    }
    setCurrentUser(updatedUser)
    setOpen(!open)
    axios.put(`${import.meta.env.VITE_LINK}/users/${currentUser.username}`, updatedUser)
      .then((res) => {
        setLoading(false)
        console.log("updated")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

  const handleDelete = (event) => {
    event.preventDefault(); 
    
    const useremail1 = user.email;
    console.log(formData)
    setLoading(true)
    const updatedUser = {
      username: currentUser.username,
      major: currentUser.major,
      minor: currentUser.minor,
      courses: currentUser.courses.filter((courseInList) => (
        courseInList[2] !== formData.courseCodeDel
      ))
    }
    formData.courseCodeDel = ""
    setCurrentUser(updatedUser)
    setOpen(!open)
    axios.put(`${import.meta.env.VITE_LINK}/users/${currentUser.username}`, updatedUser)
      .then((res) => {
        setLoading(false)
        console.log("updated")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

>>>>>>> Stashed changes
  useEffect(()=> {
    setLoading(true);
    axios
    .get('${import.meta.env.VITE_LINK}/users')
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
        axios.post('${import.meta.env.VITE_LINK}/users/', { username: useremail })
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
  

<<<<<<< Updated upstream
  if (isLoading) {
    return <div>Loading ...</div>;
=======
  if(!currentUser && isAuthenticated){
    axios.get(`${import.meta.env.VITE_LINK}/users/${user.email}`)
      .then((res) => {
        setCurrentUser(res.data[0])
      })
      .catch((error) => {
        console.log(error);
        
      });
  }
  if(!courseList){
    axios.get(`${import.meta.env.VITE_LINK}/courses`)
      .then((res) => {
        setCourseList(res.data.data)
      })
      .catch((error) => {
        console.log(error);
        
      });
  }
  if(!majorList){
    axios.get(`${import.meta.env.VITE_LINK}/majorsminors`)
      .then((res) => {
        setMajorList(res.data.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  if (isLoading){
    return (<div>Loading ...</div>);
  }
  
  const termDict = {
    "1": "Fall",
    "2": "Spring",
  }
  const yearDict = {
    "1": "Freshman",
    "2": "Sophomore",
    "3": "Junior",
    "4": "Senior",
    "5": "Other",
>>>>>>> Stashed changes
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