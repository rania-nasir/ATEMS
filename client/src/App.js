import './App.css';
import LandingPage from './Components/LandingPage'
import WhoPage from './Components/WhoPage'
import Facultylogin from './Components/Facultylogin'
import Studentlogin from './Components/Studentlogin'
import NotFoundPage from './Components/NotFoundPage'
import Facultyhome from './Components/Facultyhome'
import Studenthome from './Components/Studenthome'
import AddStudentRecord from './Components/AddStudentRecord'
import AddFacultyRecord from './Components/AddFacultyRecord'
import GCDashboard from './Components/GCDashboard';
import ViewStudent from './Components/ViewStudent';
import ViewFaculty from './Components/ViewFaculty';
import MakeAnnouncement from './Components/MakeAnnouncement';

import { Route, Routes } from 'react-router-dom'

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/who' element={<WhoPage />} />
        <Route path='/facultylogin' element={<Facultylogin />} />
        <Route path='/studentlogin' element={<Studentlogin />} />
        <Route path='/facultyhome' element={<Facultyhome />} />
        <Route path='/studenthome' element={<Studenthome />} />
        <Route path='/addstudentrecord' element={<AddStudentRecord />} />
        <Route path='/addfacultyrecord' element={<AddFacultyRecord />} />
        <Route path='/viewstudent' element={<ViewStudent />} />
        <Route path='/viewfaculty' element={<ViewFaculty />} />
        <Route path='/makeAnnouncement' element={<MakeAnnouncement />} />
        <Route path='/GCDashboard' element={<GCDashboard />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
