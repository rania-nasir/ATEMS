
// Requiring Images/Logos
import logo from '../../Images/faviconn.png'
import React, { useState, useEffect } from 'react';

// Requeiring React-Router-DOM Configurations
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const [showFirstDiv, setShowFirstDiv] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowFirstDiv(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const handleGetStarted = () => {
        navigate('/who');
    }

    return (
        <>

            {showFirstDiv ? (
                <header className="App-header">
                    <div role="status">

                        <div role="status">
                            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </header>
            ) : (
                <header className="App-header">
                    <div className="grid grid-cols-3 gap-0 m-2">
                        {/* <div className="grid grid-cols-3 gap-0 m-2" style={{border: '1px solid orange', borderRadius: '10px'}}> */}
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
                        {/* </div> */}
                    </div>
                </header>
            )}

        </>
    )
}

export default LandingPage;