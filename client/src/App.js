// Requiring CSS and PrimeReact 
"use client"
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";
import { RoleContext } from './context/RoleContext';
//core css
// import "primeicons/primeicons.css";                                //icons

// Requiring React-Router-Dom Configurations
import { Route, Routes } from 'react-router-dom'

// Landing Folder
import LandingPage from './Components/Landing/LandingPage'

// Other Folders
import NavbarDefault from './Components/Navbar/NavbarDefault';
import SidebarDefault from './Components/Sidebar/SidebarDefault';
// import RoleTabs from './Components/Faculty/RoleTabs';

// Login Folder
import LoginPage from './Components/Login/LoginPage';
import GClogin from './Components/Login/GClogin';

// Faculty Folder
import RoleTabs from './Components/Faculty/RoleTabs'
// import FacultyPage from './Components/Faculty/FacultyPage';
import Facultyhome from './Components/Faculty/Facultyhome'
import UpdateFaculty from './Components/GC/UpdateFaculty';
import UpdateStudent from './Components/GC/UpdateStudent';
import GetSynopsis from './Components/Faculty/GetSynopsis';
import GetSynopsisDetails from './Components/Faculty/GetSynopsisDetails';
import FacultyviewAnnouncement from './Components/Faculty/FacultyviewAnnouncement'
import MSRCAllThesis from './Components/Faculty/MSRCAllThesis';
import MSRCThesisDetails from './Components/Faculty/MSRCThesisDetails';

// Student Folder
import Studenthome from './Components/Student/Studenthome'
import SynopsisForm from './Components/Student/SynopsisForm';
import FillSynopsis from './Components/Student/FillSynopsis';
import StudentviewAnnouncement from './Components/Student/StudentviewAnnouncement'
import ViewFeedback from './Components/Student/ViewFeedback';

// GC Folder
import GCDashboard from './Components/GC/GCDashboard';
import AddStudent from './Components/GC/AddStudent'
import AddFaculty from './Components/GC/AddFaculty'
import ViewStudent from './Components/GC/ViewStudent';
import ViewFaculty from './Components/GC/ViewFaculty';
import MakeAnnouncement from './Components/GC/MakeAnnouncement';
import GetThesis from './Components/GC/GetThesis';
import GetThesisDetails from './Components/GC/GetThesisDetails';
import ThesisRecord from './Components/GC/ThesisRecord';

// Error Folder
import NotFoundPage from './Components/Error/NotFoundPage'

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import SupervisorComp from './Components/Faculty/Supervisor/SupervisorComp';
import MSRCComp from './Components/Faculty/MSRC/MSRCComp';
import InternalComp from './Components/Faculty/Internal/InternalComp';


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
    } else {
      // Handle the case when facultyData or facultyData.role is undefined or null
      console.log("Error: Missing data");
    }

  }, [facultyData]);

  const [role, setRole] = useState("");

  return (


    <>
      <NavbarDefault />
      <div className='mr-2'>

        <RoleContext.Provider value={{ role, setRole }}>
          <div style={{ display: "flex" }}>

            <SidebarDefault />

            <div className='w-full'>
              <div className='w-full'>
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
                          <Route path='viewAnnouncement' element={<FacultyviewAnnouncement />} />
                          <Route path='/Supervisor' element={<SupervisorComp />} />
                          <Route path='/MSRC' element={<MSRCComp />} />
                          <Route path='/Internal' element={<InternalComp />} />

                          {isSupervisor && (
                            <>
                              <Route path='/supAllRequests' element={<GetSynopsis />} />
                              <Route path='/supReviewRequest/:synopsisid' element={<GetSynopsisDetails />} />
                            </>
                          )}
                          {isMSRC && (
                            <>
                              <Route path='/MSRCAllThesis' element={<MSRCAllThesis />} />
                              <Route path='/MSRCThesisDetails/:thesisid' element={<MSRCThesisDetails />} />
                            </>
                          )}
                          {isInternal && (
                            <>
                            </>
                          )}
                          <Route path='/RoleTabs' element={<RoleTabs />} />
                        </>
                      )}
                      {userDetails.userType === 'student' && (
                        // Render student pages for student user
                        <>
                          <Route path='/' element={<Studenthome />} />
                          <Route path='/synopsisForm' element={<SynopsisForm />} />
                          <Route path='/fillSynopsis' element={<FillSynopsis />} />
                          <Route path='/viewAnnouncement' element={<StudentviewAnnouncement />} />
                          <Route path='/viewFeedback' element={<ViewFeedback />} />
                          {/* ... (other student routes) */}
                        </>
                      )}
                      {
                        userDetails.userType === 'gc' && (
                          // Render gc pages for gc user
                          <>
                            <Route path='/' element={<GCDashboard />} />
                            <Route path='/addstudent' element={<AddStudent />} />
                            <Route path='/addfaculty' element={<AddFaculty />} />
                            <Route path='/viewstudent' element={<ViewStudent />} />
                            <Route path='/viewfaculty' element={<ViewFaculty />} />
                            <Route path='/updatefaculty' element={<UpdateFaculty />} />
                            <Route path='/updatestudent' element={<UpdateStudent />} />
                            <Route path='/makeAnnouncement' element={<MakeAnnouncement />} />
                            <Route path='/viewAllThesis' element={<ThesisRecord />} />
                            <Route path='/ReviewRequest' element={<GetThesis />} />
                            <Route path='/ReviewRequest/:thesisid' element={<GetThesisDetails />} />
                            {/* ... (other gc routes) */}
                          </>
                        )
                      }
                    </>
                  )}


                  {/* Error Pages */}
                  <Route path='*' element={<NotFoundPage />} />
                </Routes>

              </div>
            </div>
          </div>
        </RoleContext.Provider>
      </div>
    </>
  );
}

export default App;