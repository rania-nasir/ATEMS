// Requiring CSS and PrimeReact 
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
import Facultylogin from './Components/Login/Facultylogin'
import Studentlogin from './Components/Login/Studentlogin'

// Faculty Folder
import Facultyhome from './Components/Faculty/Facultyhome'

// Student Folder
import Studenthome from './Components/Student/Studenthome'

// GC Folder
import GCDashboard from './Components/GC/GCDashboard';
import AddStudentRecord from './Components/GC/AddStudentRecord'
import AddFacultyRecord from './Components/GC/AddFacultyRecord'
import ViewStudent from './Components/GC/ViewStudent';
import ViewFaculty from './Components/GC/ViewFaculty';
import MakeAnnouncement from './Components/GC/MakeAnnouncement';

// Error Folder
import NotFoundPage from './Components/Error/NotFoundPage'

function App() {
  return (
    <div className="App">
    <NavbarDefault/>
      <Routes>

        {/* Main Page  */}
        <Route path='/' element={<LandingPage />} />


        {/* Login Pages  */}
        <Route path='/who' element={<WhoPage />} />
        <Route path='/facultylogin' element={<Facultylogin />} />
        <Route path='/studentlogin' element={<Studentlogin />} />

        {/* Faculty Pages */}
        <Route path='/facultyhome' element={<Facultyhome />} />

        {/* Student Pages  */}
        <Route path='/studenthome' element={<Studenthome />} />

        {/* GC Pages */}
        <Route path='/GCDashboard' element={<GCDashboard />} />
        <Route path='/addstudentrecord' element={<AddStudentRecord />} />
        <Route path='/addfacultyrecord' element={<AddFacultyRecord />} />
        <Route path='/viewstudent' element={<ViewStudent />} />
        <Route path='/viewfaculty' element={<ViewFaculty />} />
        <Route path='/makeAnnouncement' element={<MakeAnnouncement />} />

        {/* Error Pages */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;