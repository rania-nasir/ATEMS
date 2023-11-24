import './App.css';
import LandingPage from './Components/LandingPage'
import WhoPage from './Components/WhoPage'
import Facultylogin from './Components/Facultylogin'
import Studentlogin from './Components/Studentlogin'
import NotFoundPage from './Components/NotFoundPage'

import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/who' element={<WhoPage />} />
        <Route path='/facultylogin' element={<Facultylogin />} />
        <Route path='/Studentlogin' element={<Studentlogin />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
