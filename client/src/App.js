"use client"  // Requiring CSS and PrimeReact 
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";

import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

// Landing Components
import LandingPage from './Components/Landing/LandingPage'

// Side Components
import NavbarDefault from './Components/Navbar/NavbarDefault';
import SidebarDefault from './Components/Sidebar/SidebarDefault';

// Login Components
import LoginPage from './Components/Login/LoginPage';
import GClogin from './Components/Login/GClogin';

import Facultyhome from './Components/Faculty/Facultyhome'
import Studenthome from './Components/Student/Studenthome'
import GCDashboard from './Components/GC/GCDashboard';
import NotFoundPage from './Components/Error/NotFoundPage'
import ThesisTabs from './Components/ThesisTabs';
import CommonSection from './Components/CommonSection';


// --------------
import MakeAnnouncement from './Components/GC/MakeAnnouncement';
import ViewStudent from './Components/GC/ViewStudent';
import ViewFaculty from './Components/GC/ViewFaculty';
import UpdateFaculty from './Components/GC/UpdateFaculty';
import UpdateStudent from './Components/GC/UpdateStudent'

import StudentviewAnnouncement from './Components/Student/StudentviewAnnouncement';
import ViewFeedback from './Components/Student/ViewFeedback';

import FacultyviewAnnouncement from './Components/Faculty/FacultyviewAnnouncement';



// Context Components
import { RoleContext } from './context/RoleContext';
import { ThesisContext } from './context/ThesisContext';
import { ActiveTitleContext } from "./context/ActiveTitleContext";


function App() {

  const [showFirstDiv, setShowFirstDiv] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFirstDiv(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);


  const [authToken, setauthToken] = useState(false)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const token = Cookies.get('jwtoken');
    const userId = Cookies.get('userId');
    const userType = Cookies.get('userType');

    if (token) {
      // If token exists in the cookie, set authToken to true
      setauthToken(true);
      setUserDetails({ userId, userType });

    } else {
      // Token doesn't exist in the cookie
      setauthToken(false);
    }
  }, []); // Empty dependency array to run this effect only once on component mount

  const userId = Cookies.get('userId');

  const [facultyData, setfacultyData] = useState([]);

  useEffect(() => {
    async function fetchfacultyData() {
      try {
        const response = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${Cookies.get('jwtoken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setfacultyData(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Failed to retrieve data: ', error);
      }
    }

    fetchfacultyData();
  }, [userId]);

  const [isSupervisor, setIsSupervisor] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const [isMSRC, setIsMSRC] = useState(false);
  const [isHOD, setIsHOD] = useState(false);

  useEffect(() => {
    console.log(facultyData.role)
    // Assuming facultyData is an object and facultyData.role is an array
    if (facultyData && facultyData.role && facultyData.role.includes) {
      if (facultyData.role.includes("Supervisor")) {
        setIsSupervisor(true);
        // console.log("This is a Supervisor.");
      }
      if (facultyData.role.includes("Internal")) {
        setIsInternal(true);
        // console.log("This is an Internal role.");
      }
      if (facultyData.role.includes("MSRC")) {
        setIsMSRC(true);
        // console.log("This is an MSRC role.");
      }
      if (facultyData.role.includes("HOD")) {
        setIsHOD(true);
        // console.log("This is an HOD role.");
      }
    } else {
      // Handle the case when facultyData or facultyData.role is undefined or null
      console.log("Error: Missing data");
    }

  }, [facultyData]);

  const [role, setRole] = useState("");
  const [thesis, setThesis] = useState("");
  const [activeTitle, setActiveTitle] = useState("");
  console.log("App.js title = ", activeTitle);

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTitle) {
      setFirstLoad(false);
    } else {
      setFirstLoad(true);
    }
  }, [activeTitle]);

  // console.log('Active Title in app.js : ', activeTitle);
  const sidebararray = ["Home", "Dashboard", "View Announcement", "View Feedback", "Make Announcement", "Faculty Records", "Student Records"];

  useEffect(() => {
    if (!activeTitle) {
      // If activeTitle is null (page refresh), set it to "Home"
      setActiveTitle("Home");
      // if (userDetails.userType === 'gc') {
      //   setActiveTitle("Dashboard");
      // }
    }
  }, [activeTitle]);


  return (
    <>
      {showFirstDiv ? (
        <header className="App-header">
          <div role="status">

            <div role="status">
              <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-teal-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </header>
      ) : (
        <>

          <div className='mr-2'>

            <RoleContext.Provider value={{ role, setRole }}>
              <ThesisContext.Provider value={{ thesis, setThesis }}>
                <ActiveTitleContext.Provider value={{ activeTitle, setActiveTitle }}>
                  <NavbarDefault />
                  <div style={{ display: "flex" }}>

                    {userDetails.userType && <SidebarDefault />}

                    <div className='w-full'>

                      <div className='w-full'>
                        {/* Conditional rendering based on activeTitle and sidebararray */}
                        {firstLoad ? null : (
                          (!activeTitle || !sidebararray.includes(activeTitle)) ?
                            <ThesisTabs /> : null
                        )}

                        <Routes>

                          {/* Main Page  */}
                          {!authToken ? (
                            <>
                              <Route path='/' element={<LandingPage />} />
                              {/* Login Pages  */}
                              <Route path='/login' element={<LoginPage />} />
                              <Route path='/gclogin' element={<GClogin />} />
                            </>
                          ) : (
                            // Conditional rendering based on userType
                            <>

                              {userDetails.userType === 'faculty' && (
                                // Render faculty pages for faculty user
                                <>
                                  <Route path='/' element={<Facultyhome />} />
                                  <Route path='/viewAnnouncement' element={<FacultyviewAnnouncement />} />
                                  <Route path='/fillSynopsis' element={<ThesisTabs />} />
                                  {/* {activeTitle === 'Home' && (
                                    <Route path='/' element={<Facultyhome />} />
                                  )} */}
                                </>
                              )}
                              {userDetails.userType === 'student' && (
                                // Render student pages for student user
                                <>
                                  <Route path='/' element={<Studenthome />} />
                                  <Route path='/viewAnnouncement' element={<StudentviewAnnouncement />} />
                                  <Route path='/ViewFeedback' element={<ViewFeedback />} />
                                  <Route path='/Supervisor' elememt={<ThesisTabs />} />
                                  <Route path='/Internal' element={<ThesisTabs />} />
                                  <Route path='/MSRC' element={<ThesisTabs />} />
                                  <Route path='/HOD' element={<ThesisTabs />} />
                                  {/* {activeTitle === 'Home' && (
                                    <Route path='/' element={<Studenthome />} />
                                  )} */}
                                </>
                              )}
                              {
                                userDetails.userType === 'gc' && (
                                  // Render gc pages for gc user
                                  <>
                                    <Route path='/' element={<GCDashboard />} />
                                    <Route path='/makeAnnouncement' element={<MakeAnnouncement />} />
                                    <Route path='/viewfaculty' element={<ViewFaculty />} />
                                    <Route path='/viewstudent' element={<ViewStudent />} />
                                    <Route path='/updateFaculty/:facultyid' element={<UpdateFaculty />} />
                                    <Route path='/updateStudent/:rollno' element={<UpdateStudent />} />
                                    {/* {activeTitle === 'Home' && (
                                      <Route path='/' element={<GCDashboard />} />
                                    )} */}
                                  </>
                                )
                              }
                            </>
                          )}

                          {/* Error Pages */}
                          {activeTitle === "Home" && (
                            <Route path='*' element={<NotFoundPage />} />
                          )}
                        </Routes>

                      </div>
                    </div>
                  </div>
                </ActiveTitleContext.Provider>
              </ThesisContext.Provider>
            </RoleContext.Provider>
          </div>
        </>
      )}
    </>
  );
}

export default App;