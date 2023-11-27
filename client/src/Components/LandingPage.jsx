
import logo from '../Images/faviconn.png'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/who');
    }

    return (
        <>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />

                <p className='text-3xl font-bold m-6'>Academic Thesis Evaluation and Management System</p>
                <p className='text-lg m-4 pb-2'>
                    The software streamlines thesis processes with an intuitive interface, collaboration tools, automated reminders, and customizable evaluations. It ensures secure document management, compatibility, and scalability while gathering feedback for continuous improvement.
                </p>

                <button type="button" class="m-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={handleGetStarted}>
                    Get Started</button>
            </header>

        </>
    )
}

export default LandingPage;