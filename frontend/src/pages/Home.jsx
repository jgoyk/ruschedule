import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";

const Home = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ currentUser, setCurrentUser ] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersResponse = await axios.get("http://localhost:5001/users");
        setUsers(usersResponse.data.data)
        const coursesResponse = await axios.get(`http://localhost:5001/courses`);
        console.log(coursesResponse.data)
        setCourses(coursesResponse.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    if (searchInput.length > 0) {
      const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(filteredCourses);
    } else {
      setSearchResults(courses);
    }
  }, [searchInput, courses]);
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if(!currentUser && isAuthenticated){
    axios.get(`http://localhost:5001/users/${user.email}`)
      .then((res) => {
        setCurrentUser(res.data[0])
      })
      .catch((error) => {
        console.log(error);
        
      });
  }

  return (
    <div className="">
      <nav className="bg-stone-500 p-4 flex flex-row justify-end min-h-full">
        <div className="grow min-h-full flex flex-col my-auto">
          <div className="justify-center text-center w-full font-semibold text-3xl">
            RU SCHEDULING
          </div>
        </div>
        <div className="min-w-fit flex flex-row justify-end">
          {isLoading ? (<div>Loading</div> ) :
          (!isAuthenticated ? (
            <LoginButton />
          ) : (
            <div className="min-w-fit flex flex-row align-middle min-h-full">
              <div className="p-2 min-w-fit flex flex-row bg-stone-600 text-white rounded-full hover:bg-stone-200 hover:text-black border hover:border-black">
                <Link to="/profile" className="flex flex-row min-h-full min-w-fit align-middle hover:">
                  <CgProfile className="align-middle min-h-full h-6 w-6 " />
                  <div className="p-1">Profile</div>
                </Link>
              </div>
              <div className="pl-2">
                <LogoutButton />
              </div>
            </div>
          ))}
        </div>
      </nav>
      <div className="flex flex-row justify-end">
        <div className="grow justify-center">
          {/* {loading ? (
            <Spinner />
          ) : (
            <div>
              <div>
                {users?.map((user, index) => (
                  <div key={user._id}>{user.username}</div>
                ))}
              </div>
              <div>
            </div>
          </div>
          )} */}
          {isAuthenticated && 
            <div>
              <div className="grid grid-cols-4 grid-rows-2 border">
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Freshman Fall</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "1") && (course[1]=== "1"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Freshman Spring</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "2") && (course[1]=== "1"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Sophomore Fall</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "1") && (course[1]=== "2"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Sophomore Spring</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "2") && (course[1]=== "2"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Junior Fall</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "1") && (course[1]=== "3"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Junior Spring</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "2") && (course[1]=== "3"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Senior Fall</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "1") && (course[1]=== "4"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
                <div className="border-2 border-black p-2">
                  <div className="font-semibold text-center">Senior Spring</div>
                  {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== "2") && (course[1]=== "4"))?.map((course, index) => (
                    <div key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
                  ))}
                </div>
              </div>
              <div className='font-semibold text-center'>Other Courses</div>
              {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[1]=== "5"))?.map((course, index) => (
                <div key={index} className="text-center">{course[2]}</div>
              ))}
              </div>
              
            }
        </div>
        <div className="bg-gray-200 min-h-full">
          <div className="flex flex-col min-h-full grow">
            <div className="p-2 font-bold text-xl">Search for Course</div>
            <div>
              <input type="text" placeholder="Search here" onChange={handleChange} value={searchInput} />
            </div>
            <div className="italic">Showing first 20 results</div>
            <table>
              <tr></tr>
            {searchResults?.filter((course, idx) => idx < 20).map((course, index) => (
            <tr key={index}>
              <td>{course.title}</td>
              <td>{course.courseString}</td>
            </tr>
            ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
