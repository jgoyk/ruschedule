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
  const { isAuthenticated, isLoading } = useAuth0();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5001/users")
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
=======
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
    axios.put(`${import.meta.env.VITE_LINK}/users/${currentUser.username}`, updatedUser)
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
      axios.put(`${import.meta.env.VITE_LINK}/users/${currentUser.username}`, updatedUser)
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
        
        const usersResponse = await axios.get(`${import.meta.env.VITE_LINK}/users`);
        setUsers(usersResponse.data.data)
        const coursesResponse = await axios.get(`${import.meta.env.VITE_LINK}/courses`);
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
    axios.get(`${import.meta.env.VITE_LINK}/users/${user.email}`)
      .then((res) => {
        setCurrentUser(res.data[0])
>>>>>>> Stashed changes
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
<<<<<<< Updated upstream
  }, []);
=======
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
    axios.get(`${import.meta.env.VITE_LINK}/majorsminors/${currentUser?.major}`)
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
>>>>>>> Stashed changes
  return (
    <div className="">
      <nav className="bg-red-100 p-4 flex flex-row justify-center">
        <div className="text-center w-full font-semibold text-3xl">
          RU SCHEDULING
        </div>
        <div className="min-w-fit">
          {isLoading ? (<div>Loading</div> ) :
          (!isAuthenticated ? (
            <LoginButton />
          ) : (
            <div className="min-w-fit flex flex-row align-middle min-h-full">
              <div className="p-2 min-w-fit flex flex-row bg-red-300 rounded-full">
                <a href="/profile" className="flex flex-row min-h-full min-w-fit align-middle">
                  <CgProfile className="align-middle min-h-full" />
                  <div className="">Profile</div>
                </a>
              </div>
              <div className="pl-2">
                <LogoutButton />
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            {users?.map((user, index) => (
              <div key={user._id}>{user.username}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
