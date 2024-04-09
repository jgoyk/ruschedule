import React, {useState, useEffect}  from 'react'
import axios from "axios";
import { HiOutlineX } from "react-icons/hi";
import { useUser } from '@clerk/clerk-react';
import { useClerk } from "@clerk/clerk-react";
import Layout from '../components/Layout';

const Profile = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [hasPosted, setHasPosted] = useState(sessionStorage.getItem("hasPosted") === "true");
  const [open, setOpen] = useState(false);
  const [ currentUser, setCurrentUser ] = useState();
  const [ courseList, setCourseList ] = useState();
  const [ majorList, setMajorList ] = useState();
  const [ errors, setErrors] = useState({})
  const [ currentUserMajor, setCurrentUserMajor] = useState()
  const [ formData, setFormData] = useState({
    courseCode: "",
    courseTerm: "",
    courseYear: "",
  });
  const [ formDataMajor, setFormDataMajor] = useState({
    major: "",
  });
  
  const { user } = useUser();
  const clerk = useClerk();

  
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
    console.log(formData)
    setLoading(true)
    const updatedUser = {
      username: currentUser.username,
      major: currentUser.major,
      minor: currentUser.minor,
      courses: [...currentUser.courses,[formData.courseTerm, formData.courseYear, courseList.find(cors => cors.courseString === formData.courseCode)]]
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

  useEffect(()=> {
    setLoading(true);
    axios
    .get(`${import.meta.env.VITE_LINK}/users`)
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
    if (user && !hasPosted && !loading && users) {
      const useremail = user.primaryEmailAddress.emailAddress;
      const emailExists = users.some(user => user.username === useremail);
      
      if (!emailExists) {
        axios.post(`${import.meta.env.VITE_LINK}/users/`, { username: useremail })
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
      }
    }
  }, [ user, hasPosted]);

  if(!currentUser && user){
    axios.get(`${import.meta.env.VITE_LINK}/users/${user.primaryEmailAddress.emailAddress}`)
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
  
  const termDict = {
    "1": "Fall",
    "2": "Spring",
    "3": "Other",
  }
  const yearDict = {
    "1": "Freshman",
    "2": "Sophomore",
    "3": "Junior",
    "4": "Senior",
    "5": "Other",
  }
  
  return (
    <Layout>
      <div className="min-h-full min-w-full bg-gray-200">
        {!user && <div className="text-center p-2 text-xl font-semibold">Please log in or sign up to see your schedule</div>}
        {open && user &&
        <div className="bg-black opacity-1/2">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-lg">
            <div className="flex flex-row min-w-full justify-start align-middle">
              <div className="grow text-white text-center align-middle min-h-full font-semibold text-2xl">
                EDIT PROFILE
              </div>
              <HiOutlineX className="h-8 w-8 cursor-pointer stroke-red-900" onClick={() => setOpen(!open)}/>
            <div/>
            </div>
            <div className="text-white text-center">Add Course by COURSE CODE</div>
            <form onSubmit={handleSubmit}>
              <div className="">
                <select name="courseYear" value={formData.courseYear} className="m-2 p-1" onChange={handleChange} >
                  <option value="" disabled >Select Year</option>
                  <option value="1">Freshman</option>
                  <option value="2">Sophomore</option>
                  <option value="3">Junior</option>
                  <option value="4">Senior</option>
                  <option value="5">Other Course with Credit</option>
                </select>
                <select name="courseTerm" value={formData.courseTerm} className="m-2 p-1" onChange={handleChange} >
                  <option value="" disabled >Select Term</option>
                  <option value="1">Fall</option>
                  <option value="2">Spring</option>
                  <option value="3">Other</option>
                </select>
                  <input className="m-2 p-1" name="courseCode" onChange={handleChange} value={formData.courseCode} type="text" placeholder="01:198:112" />
                  <button className="rounded-md m-2 p-2 bg-gray-300 justify-center hover:scale-110 hover:text-white hover:bg-gray-700" type="submit">Submit</button>
              </div>
            </form>
            <form onSubmit={handleSubmitMajor}>
              <div className="">
                <select name="major" value={formData.major} className="m-2 p-1" onChange={handleChangeMajor} >
                  <option value="" disabled selected="selected">{majorList?.find(major => major.programCode === currentUser.major)?.name}</option>
                  {majorList && majorList.map((major, index) => (
                    <option key={index} value={major.programCode}>{major.name}</option>
                  ))}
                </select>
                <button className="rounded-md m-2 p-2 bg-gray-300 justify-center hover:scale-110 hover:text-white hover:bg-gray-700" type="submit">Submit</button>
              </div>
            </form>
            <div className="pt-3 pl-2 text-white text-left ">Remove Course by COURSE CODE</div>
            <form onSubmit={handleDelete}>
              <div className="flex flex-row min-w-full justify-left">
                <input className="m-2 p-2" name="courseCodeDel" onChange={handleChange} value={formData.courseCodeDel} type="text" placeholder="01:198:112" />
                <button className="rounded-md m-2 p-2 bg-gray-300 justify-center hover:scale-110 hover:text-white hover:bg-gray-700" type="submit">Submit</button>
              </div>
            </form>
          </div>
          </div>
        }
        
        
        <div className="min-h-full min-w-full">
          { currentUser &&
          <div className="h-full min-w-full">
            <div className="bg-slate-300 rounded-md p-5 m-5 w-fit mx-auto">
            <div className="flex flex-row justify-center text-lg font-semibold">
              Your Major 
            </div>
            <div className="flex flex-row justify-center">
              {currentUser.major ? majorList?.find(major => major.programCode === currentUser.major)?.name : 'No major set'}
            </div>
            <div className="flex flex-row justify-center text-lg font-semibold">
              Your Minor 
            </div>
            <div className="flex flex-row justify-center">
              {currentUser.minor ? currentUser.minor : 'No minor set'}
            </div>
            <div className="flex flex-row justify-center text-lg font-semibold">
              Your Courses 
            </div>
            <div className="">
              
                
                { currentUser.courses ? 
                  <table>
                    <colgroup>
                      <col width="20px" />
                      <col width="30px" />
                      <col width="40px" />
                    </colgroup>
                    <tbody>
                    
                    <tr className="text-center">
                      <th className="px-5">Year</th>
                      <th className="px-5">Term</th>
                      <th className="px-5">Course</th>
                    </tr>
                    

                      {currentUser.courses.map((course, index) => (
                      <tr key={index} className="text-center ">
                        
                        <td className="text-center">{yearDict[course[1]]}</td>
                        <td className="text-center">{termDict[course[0]] ? termDict[course[0]] : "Error"}</td>
                        <td className="text-center overflow-hidden">{course[2].title}</td>
                      </tr> ))}
                    </tbody>
                    
                  </table>
                  : (<div>No courses added</div>) 
                  
                }
              
            </div>
              <div className="flex flex-row w-full justify-center">
                <button className="border border-black p-1 m-1 bg-gray-200 rounded-sm hover:bg-gray-300 justify-center " onClick={() => setOpen(!open)}>Edit Profile</button>
              </div>
            </div>
          </div>
            }
        </div>
      </div>
    </Layout>
  )
}

export default Profile