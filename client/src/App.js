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

import { Route, Routes } from 'react-router-dom'

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
        <Route path='/GCDashboard' element={<GCDashboard />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
