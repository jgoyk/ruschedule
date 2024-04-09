import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HiArrowRight,  HiArrowLeft } from "react-icons/hi";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';
import Layout from '../components/Layout';



const Home = () => {
  const [users, setUsers] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ currentUser, setCurrentUser ] = useState();
  const [courseInList, setCourseInList] = useState();
  const [currentMajor, setCurrentMajor] = useState();
  const [box, setBox] = useState(false);
  const [count, setCount] = useState(1)
  const { user } = useUser();

  const rightHandleClick = () => {
    setCount(currentCount => currentCount + 1); 
  };
  const leftHandleClick = () => {
    setCount(currentCount => currentCount - 1); 
  };

  const onDropCourse = (course, year, term) => {
    console.log(`Dropped course ${course?.courseString} into ${year} year and term ${term}`);
    const courseInList = currentUser?.courses.some(cors => cors[2].courseString === course.courseString);
    if(!courseInList){ 
      const updatedUser = {
        username: currentUser.username,
        major: currentUser.major,
        minor: currentUser.minor,
        courses: [...currentUser.courses,[term, year, course]]
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
        });
    } else{
        const filteredCourses = currentUser.courses.filter(
          cor => cor[2].courseString !== course.courseString
        );
        console.log([...filteredCourses, [term, year, course]])
        const updatedUser = {
          username: currentUser.username,
          major: currentUser.major,
          minor: currentUser.minor,
          courses: [...filteredCourses, [term, year, course]]
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
        });
      }
      
      
  };
  const onRemoveCourse = (course) => {
    const updatedUser = {
      username: currentUser.username,
      major: currentUser.major,
      minor: currentUser.minor,
      courses: currentUser.courses.filter(cor => (cor[2].courseString !== course.id.courseString))
    }
    setCurrentUser(updatedUser)
      axios.put(`${import.meta.env.VITE_LINK}/users/${currentUser.username}`, updatedUser)
      .then((res) => {
        console.log("deleted")
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    if (courseList.length === 0){
    const fetchData = async () => {
      setLoading(true);
      try {
        
        const usersResponse = await axios.get(`${import.meta.env.VITE_LINK}/users`);
        setUsers(usersResponse.data.data)
        const coursesResponse = await axios.get(`${import.meta.env.VITE_LINK}/courses`);
        console.log(coursesResponse.data)
        setCourseList(coursesResponse.data.data);
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
      item: { id: course, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    return (
      <tr ref={drag} className=""style={{ opacity: isDragging ? 0.5 : 1 }}>
        <td className="text-center">{course.title}</td>
        <td className="text-center">{course.courseString}</td>
        <td className="text-center">{course.coreCodes?.toString()}</td>
      </tr>
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
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} key={index} className="text-center">{course[2]?.title}</div>
    );
  };

  
  
  const filteredCourses = useMemo(() => {
    if (searchInput.length > 0) {
      setCount(1)
      return box
        ? courseList.filter(course => 
          course.courseString.includes(searchInput)
        )
        : courseList.filter(course => course.title.toLowerCase().includes(searchInput.toLowerCase()));
    }
    return courseList;
  }, [searchInput, box, courseList]);
  

  const handleChange = useCallback((e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  }, []);

  const handleBoxChange = useCallback((e) => {
    setBox(e.target.checked); 
  })
  
  if(!currentUser && user){
    axios.get(`${import.meta.env.VITE_LINK}/users/${user.primaryEmailAddress.emailAddress}`)
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
      <div ref={drop} className="h-full justify-center" style={{ border: '2px solid black', opacity: isOver ? 0.5 : 1 }}>
        <div className="font-semibold text-center bg-gray-300 py-2 border-b-2 border-black">{yearDict[year]} {termDict[term]}</div>
        <div className="min-h-12">
          {currentUser && currentUser.courses && currentUser.courses.filter(course => (course[0]=== term) && (course[1]=== year))?.map((course, index) => (
            <DraggableCourseInYear key={index} course={course} index={index}/>
          ))}
        </div>
      </div>
    );
  };

  if (!currentMajor){
    axios.get(`${import.meta.env.VITE_LINK}/majorsminors/${currentUser?.major}`)
    .then((res) => {
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
      <div className="min-h-full h-full" ref={drop} style={{ opacity: isOver ? 0.5 : 1 }}>
        <div key={searchInput} className="min-h-full min-h-full w-full justify-center bg-gray-200 rounded-lg p-2">
          <table>
        
            <colgroup>
              <col className="w-1/3" />
              <col className="w-1/3" />
              <col className="w-1/3" />
            </colgroup>
            <tbody>
              <tr className="text-center">
                <th className="">Title</th>
                <th className="">Code</th>
                <th className="">Core Codes</th>
              </tr>
              {filteredCourses?.filter((course, idx) => (idx < 20*count) && (idx >= 20*(count-1))).map((course, index) => (
                <DraggableCourseItem key={index} course={course} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  
  const terms = ['1', '2'];
  const years = ['1', '2', '3', '4']; 
  const cores = [['2', 'CCO', 'CCD'],
                 ['1', 'NS'],
                 ['2', 'AHo', 'AHp', 'AHq', 'AHr'],
                 ['3', 'WC', 'WCr', 'WCd'],
                 ['2', 'HST', 'SCL'],
                 ['2', 'QQ', 'QR']];

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
      <div className="h-screen w-full flex flex-col">
        

     
        <div className="flex flex-row justify-end bg-gray-200 grow">
          <div className="grow justify-center">
            { user && 
              <div>
                <div className="grid grid-cols-4 grid-rows-2 border m-2 h-full">
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
                  <DroppableSemesterBox term="3" year="5" onDropCourse={onDropCourse} />
                </div> 
              </div>
              }
          <div>
            { user ?
            (<div> 
              <div className="pt-5 text-center font-semibold text-xl" >
                Major Requirement Tracker
              </div>
              <div className="text-center">
                Major: {currentMajor?.name}
              </div>
            </div> ) : (<div className="text-center p-2 text-xl font-semibold">Please log in to see your schedule</div>)
            }
            {currentMajor?.requiredCourses.length > 0 && <div> 
            <div className="text-center pt-5 font-semibold text-lg ">
              Required Courses
            </div>
            <div className="flex flex-row justify-center">
              {currentMajor?.requiredCourses[0].map((course, index) =>  (
                <div key={index} className={`p-2  ${currentUser?.courses.some(cors => cors[2].courseString === course) ? "text-green-600" : "text-red-500"}`}>{course}</div>
              ))}
            </div>
            <div className="text-center font-semibold text-lg pb-2">
              {currentMajor?.requiredCourses[1][0]} of the following groups
            </div>
            <div className="text-center">
              <div className="flex flex-row justify-around">   
              {currentMajor?.requiredCourses.map((course, index) =>  index > 1 && 
              <div key={index} className="flex flex-col ">
                <div className="">{course[0]} from this group</div>
                {course.map((cors, idx) => idx > 0 && (
                  
                  <div key={idx} className={`p-2  ${currentUser?.courses.some(corps => corps[2].courseString === cors) ? "text-green-600" : "text-red-500"}`}>{cors}</div>
                ))}
              </div>
              )}
              </div>
            </div>
            </div>
            }
          </div>
          { user && 
          <div>
            <div className="pt-5 text-center font-semibold text-xl" >
              SAS CORE Requirements
            </div>
            <div className="text-center pt-5 pb-2 font-semibold text-lg ">
              Required Tracks
            </div>
            <div className="text-center">
              <div className="grid grid-cols-7">

              {cores.map((track, index) =>  track.map((coreCode, idx) => idx>0 && (
              <div key={idx} className={currentUser?.courses.some(course => course[2]?.coreCodes?.some(code => code === coreCode)) ? "text-green-600" : "text-red-600"}>
                <div>{coreCode}</div> 
                <div className="">{currentUser?.courses.filter(course => course[2]?.coreCodes?.some(code => code === coreCode)).map(course => {return course[2].courseString + ", "}) }</div>
              </div>))
              )}
              </div>
            </div>
          </div>
          }  
          </div>
          
          <div className="w-1/4 min-h-full bg-gray-300 border-x-8 border-gray-300">
            <div className="flex flex-col min-w-full justify-center"> 
              <div className="px-2 pt-2 font-bold text-xl flex flex-row justify-center">Search for Course</div>
              <div className="font-semibold text-md flex flex-row justify-center">Drag Classes into Schedule</div>
              <div className="flex flex-col justify-center">
                <div className="align middle justify-center flex flex-row select-none">Search By Code?
                <input className="ml-2" type="checkbox" id="scales" name="code" onChange={handleBoxChange}/></div>
                <input className="p-1 m-1 border " type="text" placeholder="Search here" onChange={handleChange} value={searchInput} />
              </div>
              <div className="italic flex flex-row justify-center select-none">Showing 20 results</div>
            <div className="justify-center">
              
              <DroppableList onDropCourse={onRemoveCourse}/>
              <div className="flex flex-row justify-center gap-4">{count >1 && <HiArrowLeft className="h-12 w-12 hover:scale-110 hover:text-gray-700" onClick={leftHandleClick}/>}<HiArrowRight className="h-12 w-12 hover:scale-110 hover:text-gray-700" onClick={rightHandleClick}/></div>
              <div className="text-sm text-center select-none">Page {count} of {Math.ceil(filteredCourses.length/20)} </div>
            </div>
          </div>
          </div>
        </div> 
      </div> 
      </Layout>
    </DndProvider>
  );
};

export default Home;
