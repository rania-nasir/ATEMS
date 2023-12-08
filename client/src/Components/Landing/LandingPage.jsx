
// Requiring Images/Logos
import logo from '../../Images/faviconn.png'

// Requeiring React-Router-DOM Configurations
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/who');
    }

    return (
        <>
            <header className="App-header">
                <div className="grid grid-cols-3 gap-0">
                    <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <p className="text-3xl font-bold mt-10 p-2" style={{ color: "black", opacity: "0.9" }}>
                            Thesis Evaluation and Management: Secure Collaboration, Continuous Enhancement
                            </p>
                        <p className="text-lg m-4 p-4 pt-2 pb-2">
                            The software streamlines thesis processes with an intuitive interface, collaboration tools, automated reminders, and customizable evaluations. It ensures secure document management, compatibility, and scalability while gathering feedback for continuous improvement.
                        </p>
                        <button
                            type="button"
                            className="flex items-center mt-6 text-white rounded-md bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-400 dark:focus:ring-green-900 font-medium text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={handleGetStarted}
                        >
                            GET STARTED
                            <svg className="w-6 h-4 text-gray-800 dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex justify-center items-center">
                        <img src={logo} className="App-logo" alt="logo" />
                    </div>
                </div>

            </header>
        </>
    )
}

export default LandingPage;