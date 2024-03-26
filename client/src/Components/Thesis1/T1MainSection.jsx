import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ActiveTitleContext } from '../../context/ActiveTitleContext';

import BackButton from '../BackButton';

// student 
import FillSynopsis from '../Student/FillSynopsis';
import ReportSubmission from '../Student/ReportSubmission'

// GC 
import ThesisRecord from '../GC/ThesisRecord';

import GetThesis from '../GC/GetThesis';
import GetThesisDetails from '../GC/GetThesisDetails';

import Permissions from '../GC/Permissions';

import Evaluations from '../GC/Evaluations';
import EvaluationDetails from '../GC/EvaluationDetails';
import EvaluationMid1Details from '../GC/EvaluationMid1Details';
import EvaluationFinal1Details from '../GC/EvaluationFinal1Details';

// Faculty
import SupervisorComp from '../Faculty/Supervisor/SupervisorComp';
import InternalComp from '../Faculty/Internal/InternalComp';
import MSRCComp from '../Faculty/MSRC/MSRCComp';
import HODComp from '../Faculty/HOD/HODComp';

import Cookies from 'js-cookie';

export default function T1MainSection() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Function to navigate back
    const navigateBack = () => {
        navigate(-1); // Navigate back to the previous URL
    };

    const userType = Cookies.get('userType');

    // Accessing activeTitle from ActiveTitleContext
    const { activeTitle } = useContext(ActiveTitleContext);

    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <div
            // style={{ border: "1px solid red" }}
            >

                {/* Define routes for each user type and active title */}
                {userType === 'student' && (
                    <>
                        <Routes>
                            <Route path="/reportSubmission" element={<ReportSubmission />} />
                            <Route path="/fillSynopsis" element={<FillSynopsis />} />
                        </Routes>
                    </>
                )}
                {userType === 'faculty' && (
                    <>
                        {activeTitle === "Supervisor" && (
                            <SupervisorComp />
                        )}
                        {activeTitle === "Internal Examiner" && (
                            <InternalComp />
                        )}
                        {activeTitle === "MSRC Committee" && (
                            <MSRCComp />
                        )}
                        {activeTitle === "Head of Department" && (
                            <HODComp />
                        )}
                        {/* </Routes> */}
                    </>
                )}
                {userType === 'gc' && (
                    <>
                        {showDetails ? (
                            <div>
                                {activeTitle === "Thesis Requests" && (
                                    <>
                                        <BackButton onClick={() => {
                                            setShowDetails(false); // Set showDetails to false
                                            navigateBack(); // Call the navigateBack function to navigate back
                                        }} />
                                        <Routes>
                                            <Route path="/ReviewRequest/:thesisid" element={<GetThesisDetails setShowDetails={setShowDetails} />} />
                                        </Routes>
                                    </>
                                )}
                                {activeTitle === "Thesis Evaluations" && (
                                    <>
                                        <BackButton onClick={() => {
                                            setShowDetails(false); // Set showDetails to false
                                            navigateBack(); // Call the navigateBack function to navigate back
                                        }} />
                                        <Routes>
                                            <Route path="/viewPendingProposal/:rollno" element={<EvaluationDetails setShowDetails={setShowDetails} />} />
                                        </Routes>
                                        <Routes>
                                            <Route path="/viewPendingMid/:rollno" element={<EvaluationMid1Details setShowDetails={setShowDetails} />} />
                                        </Routes>
                                        <Routes>
                                            <Route path="/viewPendingFinal/:rollno" element={<EvaluationFinal1Details setShowDetails={setShowDetails} />} />
                                        </Routes>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Routes>
                                <Route path="/viewAllThesis" element={<ThesisRecord />} />
                                <Route path="/ReviewRequest" element={<GetThesis setShowDetails={setShowDetails} />} />
                                <Route path="/Permissions" element={<Permissions />} />
                                <Route path="/Evaluations" element={<Evaluations setShowDetails={setShowDetails} />} />
                            </Routes>
                        )}

                    </>
                )}
                {/* Displaying the activeTitle */}
                {/* <p>Active Title: {activeTitle}</p> */}
                {/* <p>Thesis 1 here...</p> */}
            </div>
        </>
    );
}
