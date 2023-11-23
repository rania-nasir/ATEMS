import './App.css';
// import logo from "./Images/faviconn.png"
import LandingPage from './Components/LandingPage'
import WhoPage from './Components/WhoPage'
import SignInPage from './Components/SignInPage'

function App() {
  return (
    <div className="App">
      <LandingPage/>
      <WhoPage/>
      <SignInPage/>
    </div>
  );
}

export default App;
