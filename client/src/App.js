// Requiring CSS and PrimeReact 
"use client"
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

// Requiring React-Router-Dom Configurations
import { Route, Routes } from 'react-router-dom'

// Landing Folder
import LandingPage from './Components/Landing/LandingPage'

// Navbar Folder
import NavbarDefault from './Components/Navbar/NavbarDefault';

// Login Folder
import WhoPage from './Components/Login/WhoPage'
import GClogin from './Components/Login/GClogin';
import Facultylogin from './Components/Login/Facultylogin'
import Studentlogin from './Components/Login/Studentlogin'

// Faculty Folder
import Facultyhome from './Components/Faculty/Facultyhome'
import GetSynopsis from './Components/Faculty/GetSynopsis';
import GetSynopsisDetails from './Components/Faculty/GetSynopsisDetails';

// Student Folder
import Studenthome from './Components/Student/Studenthome'
import SynopsisForm from './Components/Student/SynopsisForm';
import FillSynopsis from './Components/Student/FillSynopsis';

// GC Folder
import GCDashboard from './Components/GC/GCDashboard';
import AddStudentRecord from './Components/GC/AddStudentRecord'
import AddFacultyRecord from './Components/GC/AddFacultyRecord'
import ViewStudent from './Components/GC/ViewStudent';
import ViewFaculty from './Components/GC/ViewFaculty';
import MakeAnnouncement from './Components/GC/MakeAnnouncement';
import GetThesis from './Components/GC/GetThesis';
import GetThesisDetails from './Components/GC/GetThesisDetails';

// Error Folder
import NotFoundPage from './Components/Error/NotFoundPage'
import SidebarDefault from './Components/Sidebar/SidebarDefault';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function App() {
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


  const classesWithoutNavbar = "col-span-5 content-center px-10"
  const classesWithNavbar = "col-span-4 content-center px-5"

  return (
    <>
      <NavbarDefault />
      <div className='grid grid-cols-5'>
        {authToken ? (<div className='col-span-1'>
          <SidebarDefault />
        </div>) : (<></>)}
        <div className={authToken ? classesWithNavbar : classesWithoutNavbar} >

          <Routes>

            {/* Main Page  */}
            {!authToken ? (
              <>
                <Route path='/' element={<LandingPage />} />
                {/* Login Pages  */}

                <Route path='/who' element={<WhoPage />} />
                <Route path='/facultylogin' element={<Facultylogin />} />
                <Route path='/studentlogin' element={<Studentlogin />} />
                <Route path='/gclogin' element={<GClogin />} />

              </>
            ) : (
              // Conditional rendering based on userType
              <>
                {userDetails.userType === 'faculty' && (
                  // Render faculty pages for faculty user
                  <>
                    <Route path='/' element={<Facultyhome />} />
                    <Route path='/supAllRequests' element={<GetSynopsis />} />
                    <Route path='/supReviewRequest/:synopsisid' element={<GetSynopsisDetails />} />

                    {/* ... (other faculty routes) */}
                  </>
                )}
                {userDetails.userType === 'student' && (
                  // Render student pages for student user
                  <>
                    <Route path='/' element={<Studenthome />} />
                    <Route path='/synopsisForm' element={<SynopsisForm />} />
                    <Route path='/fillSynopsis' element={<FillSynopsis />} />
                    {/* ... (other student routes) */}
                  </>
                )}
                {
                  userDetails.userType === 'gc' && (
                    // Render gc pages for gc user
                    <>
                      <Route path='/' element={<GCDashboard />} />
                      <Route path='/addstudentrecord' element={<AddStudentRecord />} />
                      <Route path='/addfacultyrecord' element={<AddFacultyRecord />} />
                      <Route path='/viewstudent' element={<ViewStudent />} />
                      <Route path='/viewfaculty' element={<ViewFaculty />} />
                      <Route path='/makeAnnouncement' element={<MakeAnnouncement />} />
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
      </div >
    </>
  );
}

export default App;