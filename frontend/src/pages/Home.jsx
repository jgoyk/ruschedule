import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';






const Home = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ currentUser, setCurrentUser ] = useState();
  const [courseInList, setCourseInList] = useState();
  const [currentMajor, setCurrentMajor] = useState();
  const [box, setBox] = useState(false);


  const onDropCourse = (courseId, year, term) => {
    
    console.log(`Dropped course ${courseId} into ${year} year and ${term}`);
    const courseInList = currentUser.courses.some(course => course[2] === courseId);
    if(!courseInList){ const updatedUser = {
      username: currentUser.username,
      major: currentUser.major,
      minor: currentUser.minor,
      courses: [...currentUser.courses,[term, year, courseId]]
    }
    setCurrentUser(updatedUser)
    axios.put(`http://localhost:5001/users/${currentUser.username}`, updatedUser)
      .then((res) => {
        setLoading(false)
        console.log("updated")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });} else{
        alert("Course already in schedule")
      }
  };
  const onRemoveCourse = (course) => {
    const updatedUser = {
      username: currentUser.username,
      major: currentUser.major,
      minor: currentUser.minor,
      courses: currentUser.courses.filter(cor => (cor[2] != course.id))
    }
    setCurrentUser(updatedUser)
      axios.put(`http://localhost:5001/users/${currentUser.username}`, updatedUser)
      .then((res) => {
        setLoading(false)
        console.log("deleted")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  }
  useEffect(() => {
    if (courses.length === 0){
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
  }}, []);

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
  }
  
  const DraggableCourseItem = ({ course, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'course',
      item: { id: course.courseString, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    return (
      <div ref={drag} className="flex flex-row w-full justify-around"style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="text-center">{course.title}</div>
        <div className="text-center">{course.courseString}</div>
      </div>
    );
  };

  const DraggableCourseInYear = ({ course, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'course',
      item: { id: course[2], index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} key={index} className="text-center">{courses?.find(cor => cor.courseString === course[2])?.title}</div>
    );
  };

  
  
  const filteredCourses = useMemo(() => {
    if (searchInput.length > 0) {
      return box
        ? courses.filter(course => course.courseString.includes(searchInput))
        : courses.filter(course => course.title.toLowerCase().includes(searchInput.toLowerCase()));
    }
    return courses;
  }, [searchInput, box, courses]);
  

  const handleChange = useCallback((e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  }, []);

  const handleBoxChange = useCallback((e) => {
    e.preventDefault();
    setBox(e.target.checked); 
  })
  
  if(!currentUser && isAuthenticated){
    axios.get(`http://localhost:5001/users/${user.email}`)
      .then((res) => {
        setCurrentUser(res.data[0])
      })
      .catch((error) => {
        console.log(error);
        
      });
  }
  const DroppableSemesterBox = ({ term, year, onDropCourse }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'course',
      drop: (item, monitor) => onDropCourse(item.id, year, term),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
  
    return (
      <div ref={drop} style={{ border: '2px solid black', opacity: isOver ? 0.5 : 1 }}>
        <div className="font-semibold text-center">{yearDict[year]} {termDict[term]}</div>
        
        {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== term) && (course[1]=== year))?.map((course, index) => (
          <DraggableCourseInYear key={index} course={course} index={index}/>
        ))}
      </div>
    );
  };

  if (!currentMajor){
    axios.get(`http://localhost:5001/majorsminors/${currentUser?.major}`)
    .then((res) => {
      console.log(res.data[0])
      setCurrentMajor(res.data[0])
    })
    .catch((error) => {
      console.log(error);
      
    });
  }

  const DroppableList = ({ onDropCourse  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'course',
      drop: (item, monitor) => onDropCourse(item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
    }),
  }));
    return (
      <div className="bg-gray-200 min-h-[100%] h-full" ref={drop} style={{ opacity: isOver ? 0.5 : 1 }}>
        <div className="flex flex-col min-h-full grow">
          
          <div key={searchInput}>
          {filteredCourses?.filter((course, idx) => idx < 20).map((course, index) => (
            <DraggableCourseItem key={index} course={course} index={index} />
          ))}
          </div>
        </div>
      </div>
    );
  };


  
  const terms = ['1', '2'];
  const years = ['1', '2', '3', '4']; 
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        <nav className="bg-stone-500 p-4 flex flex-row justify-end min-h-full">
          <div className="grow min-h-full flex flex-col my-auto">
            <div className="justify-center text-center w-full font-semibold text-3xl">
              R U SCHEDULING?
            </div>
          </div>
          <div className="min-w-fit flex flex-row justify-end">
            {isLoading ? (<div>Loading</div> ) :
            (!isAuthenticated ? (
              <LoginButton />
            ) : (
              <div className="min-w-fit flex flex-row align-middle min-h-full">
                <div className="p-2 min-w-fit flex flex-row bg-stone-600 text-white rounded-full hover:bg-stone-200 hover:text-black border-2 shadow-lg border-black/50 hover:border-black">
                  <Link to="/profile" className="flex flex-row min-h-full min-w-fit align-middle ">
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
                <div className="grid grid-cols-4 grid-rows-2 border m-2">
                {years.map(year =>
                  terms.map(term => (
                    <DroppableSemesterBox
                      key={`term-${term}-year-${year}-count-${currentUser?.courses.length}`}
                      term={term}
                      year={year}
                      onDropCourse={onDropCourse}
                    />
                  ))
                )}
                </div>
                <div className="m-2">
                  <DroppableSemesterBox term="" year="5" onDropCourse={onDropCourse} />
                </div> 
              </div>
              }
          <div>
            <div className="pt-5 text-center font-semibold text-xl" >
              Major Requirement Tracker
            </div>
            <div className="text-center">
              Major: {currentMajor?.name}
            </div>
            {currentMajor?.requiredCourses.length >0 && <div> 
            <div className="text-center pt-5 font-semibold text-lg ">
              Required Courses
            </div>
            <div className="flex flex-row justify-center">
              {currentMajor?.requiredCourses[0].map((course, index) =>  (
                <div key={index} className={`p-2  ${currentUser?.courses.some(cors => cors[2] === course) ? "text-green-600" : "text-red-500"}`}>{course}</div>
              ))}
            </div>
            <div className="text-center font-semibold text-lg pb-2">
              {currentMajor?.requiredCourses[1][0]} of the following groups
            </div>
            <div className="text-center">
              <div className="flex flex-row justify-around">   
              {currentMajor?.requiredCourses[1].map((course, index) =>  index>0 && 
              <div key={index} className="flex flex-col ">
                <div>{course[0]} from this group</div>
                {course.map((cors, idx) => idx > 0 && (
                  <div key={idx} className={`p-2  ${currentUser?.courses.some(corps => corps[2] === cors) ? "text-green-600" : "text-red-500"}`}>{cors} </div>
                ))}
              </div>
              )}
              </div>
              </div>
            </div>
            }
          </div>

          {/* <div>
            <div className="pt-5 text-center font-semibold text-xl" >
              SAS CORE Requirements
            </div>
            <div className="text-center pt-5 pb-2 font-semibold text-lg ">
              Required Tracks
            </div>
            <div className="text-center">
              <div className="flex flex-row justify-around">   
              {"SAS CORE".requiredTracks.map((track, index) =>  index>0 && 
              <div key={index} className="flex flex-col ">
                <div>{track[0]} from this group</div>
                {track.map((cors, idx) => idx > 0 && (
                  <div key={idx} className={`p-2  ${currentUser?.courses.some(corps => corps[2] === cors) ? "text-green-600" : "text-red-500"}`}>{cors} </div>
                ))}
              </div>
              )}
              </div>
            </div>
          </div> */}
                
          </div>
          
          <div className="w-1/4 h-screen min-h-screen bg-gray-200 p-5">
            <div className="flex flex-col min-w-full justify-center"> 
              <div className="px-2 pt-2 font-bold text-xl flex flex-row justify-center">Search for Course</div>
              <div className="font-semibold text-md flex flex-row justify-center">Drag Classes into Schedule</div>
              <div className="flex flex-col justify-center">
                <div className="align middle justify-center flex flex-row">Search By Code?
                <input className="ml-2" type="checkbox" id="scales" name="code" onChange={handleBoxChange}/></div>
                <input className="p-1 m-1 border " type="text" placeholder="Search here" onChange={handleChange} value={searchInput} />
              </div>
              <div className="italic flex flex-row justify-center">Showing first 20 results</div>
            
            <DroppableList onDropCourse={onRemoveCourse}/>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Home;
