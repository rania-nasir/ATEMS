import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ActiveTitleContext } from '../../context/ActiveTitleContext';

import BackButton from '../BackButton';

// student 
import Registration from '../Student/Registration';
import T2ViewFeedback from '../Student/T2ViewFeedback';

// GC 
import T2ThesisRecord from '../GC/T2ThesisRecord';

import T2GetThesis from '../GC/T2GetThesis';
import T2GetThesisDetails from '../GC/T2GetThesisDetails';

import T2PanelTime from '../GC/T2PanelTime';
import T2Permissions from '../GC/T2Permissions';

import T2Evaluations from '../GC/T2Evaluations';
// import EvaluationDetails from '../GC/EvaluationDetails';
// import EvaluationMid1Details from '../GC/EvaluationMid1Details';
// import EvaluationFinal1Details from '../GC/EvaluationFinal1Details';

// Faculty
import SupervisorComp from '../Faculty/Supervisor/SupervisorComp';
import InternalComp from '../Faculty/Internal/InternalComp';
import MSRCComp from '../Faculty/MSRC/MSRCComp';
import HODComp from '../Faculty/HOD/HODComp';

import Cookies from 'js-cookie';

export default function T2MainSection() {
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
            style={{ border: "1px solid purple" }}
            >

                {/* Define routes for each user type and active title */}
                {userType === 'student' && (
                    <>
                        <Routes>
                            <Route path="/fillSynopsis" element={<Registration />} />
                            <Route path="/viewFeedback" element={<T2ViewFeedback />} />
                        </Routes>
                    </>
                )}
                {userType === 'faculty' && (
                    <>
                        {activeTitle === "Supervisor Management" && (
                            <SupervisorComp />
                        )}
                        {activeTitle === "Internal Management" && (
                            <InternalComp />
                        )}
                        {activeTitle === "MSRC Management" && (
                            <MSRCComp />
                        )}
                        {activeTitle === "HOD Management" && (
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
                                            <Route path="/thesisTwoRegRequest/:rollno" element={<T2GetThesisDetails setShowDetails={setShowDetails} />} />
                                        </Routes>
                                    </>
                                )}
                                {activeTitle === "Thesis Evaluations" && (
                                    <>
                                        <BackButton onClick={() => {
                                            setShowDetails(false); // Set showDetails to false
                                            navigateBack(); // Call the navigateBack function to navigate back
                                        }} />
                                        {/* <Routes>
                                            <Route path="/viewPendingProposal/:rollno" element={<EvaluationDetails setShowDetails={setShowDetails} />} />
                                        </Routes>
                                        <Routes>
                                            <Route path="/viewPendingMid/:rollno" element={<EvaluationMid1Details setShowDetails={setShowDetails} />} />
                                        </Routes>
                                        <Routes>
                                            <Route path="/viewPendingFinal/:rollno" element={<EvaluationFinal1Details setShowDetails={setShowDetails} />} />
                                        </Routes> */}
                                    </>
                                )}
                            </div>
                        ) : (
                            <Routes>
                                <Route path="/viewAllThesis" element={<T2ThesisRecord />} />
                                <Route path="/ReviewRequest" element={<T2GetThesis setShowDetails={setShowDetails} />} />
                                <Route path="/PanelTimelines" element={<T2PanelTime />} />
                                <Route path="/Permissions" element={<T2Permissions />} />
                                <Route path="/Evaluations" element={<T2Evaluations setShowDetails={setShowDetails} />} />
                            </Routes>
                        )}

                    </>
                )}
                {/* Displaying the activeTitle */}
                {/* <p>Active Title: {activeTitle}</p> */}
                {/* <p>Thesis 2 here...</p> */}
            </div>
        </>
    );
}