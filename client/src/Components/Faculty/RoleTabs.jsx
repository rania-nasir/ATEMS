import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useContext } from 'react';
import { RoleContext } from '../../context/RoleContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThesisContext } from '../../context/ThesisContext';

import BackButton from '../BackButton';

// Synopsis Requests
import GetSynopsis from './GetSynopsis';
import GetSynopsisDetails from './GetSynopsisDetails';

// Proposal Defense
import AllProposalEvaluations from './Supervisor/AllProposalEvaluations';
import SelectedProposalDetails from './Supervisor/SelectedProposalDetails';

// Mid 1 Evaluation
import AllMid1Evaluations from './Supervisor/AllMid1Evaluations';
import SelectedMid1Details from './Supervisor/SelectedMid1Details';

// Final 1 Evaluation
import AllFinal1Evaluations from './Supervisor/AllFinal1Evaluations';
import SelectedFinal1Details from './Supervisor/SelectedFinal1Details';

// MSRC Requests
import MSRCAllThesis from './MSRCAllThesis';
import MSRCThesisDetails from './MSRCThesisDetails';

// HOD THesis Approval Requests
import HODGetThesis from './HOD/HODGetThesis'
import HODGetThesisDetails from './HOD/HODGetThesisDetails'

// Internal
import AllInternalPropEvaluations from './Internal/AllInternalPropEvaluations';
import AllMid1InternalEvaluations from './Internal/AllMid1InternalEvaluations';
import AllFinal1InternalEvaluations from './Internal/AllFinal1InternalEvaluations';

// Thesis 2
import T2GetRegistration from './Supervisor/T2/T2GetRegistration';
import T2GetRegistrationDetails from './Supervisor/T2/T2GetRegistrationDetails';
import T2HODGetThesis from './HOD/T2/T2HODGetThesis';
import T2HODGetThesisDetails from './HOD/T2/T2HODGetThesisDetails';
import AllMid2Evaluations from './Supervisor/T2/AllMid2Evaluations';
import AllMid2InternalEvaluations from './Supervisor/T2/AllMid2InternalEvaluations'
import SelectedMid2Details from './Supervisor/T2/SelectedMid2Details';


const RoleTabs = () => {
    const { thesisStatus } = useContext(ThesisContext); // Access thesisStatus from ThesisContext

    const navigate = useNavigate(); // Initialize useNavigate hook

    // Function to navigate back
    const navigateBack = () => {
        navigate(-1); // Navigate back to the previous URL
    };

    const { role } = useContext(RoleContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const [showDetails, setShowDetails] = useState(false);

    const tabs = [
        { role: 'Supervisor', panels: ['Thesis Requests', 'Proposal Defense', 'Mid Evaluation', 'Final Evaluation'] },
        { role: 'Internal', panels: ['Proposal Defense Evaluations', 'Mid Evaluations', 'Final Evaluations'] },
        { role: 'MSRC', panels: ['MSRC Thesis Requests'] },
        { role: 'HOD', panels: ['Thesis Approval Requests'] },
    ];

    const userTabs = tabs.find((tab) => tab.role === role);
    console.log('usertabs', userTabs);
    console.log("Thesis Status is role tabs : ", thesisStatus);
    return (
        <>
            <div className="card mt-1">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    {userTabs &&
                        userTabs.panels.map((panel, index) => (
                            (thesisStatus !== 2 || (thesisStatus === 2 && panel !== 'Proposal Defense' && panel !== 'Proposal Defense Evaluations')) && (
                                <TabPanel key={index} header={panel}>
                                    {thesisStatus === 1 ? (
                                        showDetails ? (
                                            <div className="m-0">
                                                {/* Your content for thesis status 1 when showDetails is true */}
                                                <div className="m-0">

                                                    {/* Render Details component when showDetails is true */}
                                                    {/* SUPERVISORS */}
                                                    {panel === "Thesis Requests" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='supReviewRequest/:synopsisId' element={<GetSynopsisDetails setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {panel === "Proposal Defense" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/selectedProposal/:rollno' element={<SelectedProposalDetails setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {panel === "Mid Evaluation" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/viewSelectedExaminableThesis/:thesisId' element={<SelectedMid1Details setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {panel === "Final Evaluation" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/viewSelectedFinalExaminableThesis/:thesisId' element={<SelectedFinal1Details setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {/* INTERNALS  */}
                                                    {panel === "Proposal Defense Evaluations" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/selectedProposal/:rollno' element={<SelectedProposalDetails setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {panel === "Mid Evaluations" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />                                                <Routes>
                                                                <Route path='/viewSelectedExaminableThesis/:thesisId' element={<SelectedMid1Details setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {panel === "Final Evaluations" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/viewSelectedFinalExaminableThesis/:thesisId' element={<SelectedFinal1Details setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {/* MSRCS  */}
                                                    {panel === "MSRC Thesis Requests" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/msrcThesisDetails/:thesisid' element={<MSRCThesisDetails setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                    {/* HOD  */}
                                                    {panel === "Thesis Approval Requests" && (
                                                        <>
                                                            <BackButton onClick={() => {
                                                                setShowDetails(false); // Set showDetails to false
                                                                navigateBack(); // Call the navigateBack function to navigate back
                                                            }} />
                                                            <Routes>
                                                                <Route path='/reviewThesis/:thesisid' element={<HODGetThesisDetails setShowDetails={setShowDetails} />} />
                                                            </Routes>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="m-0">
                                                {/* Your content for thesis status 1 when showDetails is false */}
                                                <div className="m-0">
                                                    {/* <Routes> */}
                                                    {/* Render All evaluations component when showDetails is false */}
                                                    {/* SUPERVISORS */}
                                                    {panel === "Thesis Requests" &&
                                                        <GetSynopsis setShowDetails={setShowDetails} />}
                                                    {panel === "Proposal Defense" && <AllProposalEvaluations setShowDetails={setShowDetails} />}
                                                    {panel === "Mid Evaluation" && <AllMid1Evaluations setShowDetails={setShowDetails} />}
                                                    {panel === "Final Evaluation" && <AllFinal1Evaluations setShowDetails={setShowDetails} />}
                                                    {/* INTERNALS  */}
                                                    {panel === "Proposal Defense Evaluations" && <AllInternalPropEvaluations setShowDetails={setShowDetails} />}
                                                    {panel === "Mid Evaluations" && <AllMid1InternalEvaluations setShowDetails={setShowDetails} />}
                                                    {panel === "Final Evaluations" && <AllFinal1InternalEvaluations setShowDetails={setShowDetails} />}
                                                    {/* MSRC */}
                                                    {panel === "MSRC Thesis Requests" && <MSRCAllThesis setShowDetails={setShowDetails} />}
                                                    {/* HOD  */}
                                                    {panel === "Thesis Approval Requests" && <HODGetThesis setShowDetails={setShowDetails} />}
                                                    {/* </Routes> */}
                                                </div>
                                            </div>
                                        )
                                    ) : (showDetails ? (    // for thesis status 2
                                        <div className="m-0">
                                            {/* Your content for thesis status 1 when showDetails is true */}
                                            <div className="m-0">

                                                {/* Render Details component when showDetails is true */}
                                                {/* SUPERVISORS */}
                                                {panel === "Thesis Requests" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />
                                                        <Routes>
                                                            <Route path='/getThesis2StudentDetails/:rollno' element={<T2GetRegistrationDetails setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                                {panel === "Mid Evaluation" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />
                                                        <Routes>
                                                            <Route path='mid2EvalDetails/:rollno' element={<SelectedMid2Details setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                                {panel === "Final Evaluation" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />
                                                        <Routes>
                                                            <Route path='/viewSelectedFinalExaminableThesis/:thesisId' element={<SelectedFinal1Details setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                                {/* INTERNALS  */}
                                                {panel === "Mid Evaluations" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />                                                
                                                        <Routes>
                                                            <Route path='mid2EvalDetails/:rollno' element={<SelectedMid2Details setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                                {panel === "Final Evaluations" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />
                                                        <Routes>
                                                            <Route path='/viewSelectedFinalExaminableThesis/:thesisId' element={<SelectedFinal1Details setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                                {/* MSRCS  */}
                                                {panel === "MSRC Thesis Requests" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />
                                                        <Routes>
                                                            <Route path='/msrcThesisDetails/:thesisid' element={<MSRCThesisDetails setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                                {/* HOD  */}
                                                {panel === "Thesis Approval Requests" && (
                                                    <>
                                                        <BackButton onClick={() => {
                                                            setShowDetails(false); // Set showDetails to false
                                                            navigateBack(); // Call the navigateBack function to navigate back
                                                        }} />
                                                        <Routes>
                                                            <Route path='getHodThesis2StudentDetails/:rollno' element={<T2HODGetThesisDetails setShowDetails={setShowDetails} />} />
                                                        </Routes>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="m-0">
                                            <div>thesis 2 </div>

                                            {/* Your content for thesis status 1 when showDetails is false */}
                                            <div className="m-0">
                                                {/* <Routes> */}
                                                {/* Render All evaluations component when showDetails is false */}
                                                {/* SUPERVISORS */}
                                                {panel === "Thesis Requests" &&
                                                    <T2GetRegistration setShowDetails={setShowDetails} />}
                                                {panel === "Mid Evaluation" && <AllMid2Evaluations setShowDetails={setShowDetails} />}
                                                {panel === "Final Evaluation" && <AllFinal1Evaluations setShowDetails={setShowDetails} />}
                                                {/* INTERNALS  */}
                                                {panel === "Mid Evaluations" && <AllMid2InternalEvaluations setShowDetails={setShowDetails} />}
                                                {panel === "Final Evaluations" && <AllFinal1InternalEvaluations setShowDetails={setShowDetails} />}
                                                {/* MSRC */}
                                                {panel === "MSRC Thesis Requests" && <MSRCAllThesis setShowDetails={setShowDetails} />}
                                                {/* HOD  */}
                                                {panel === "Thesis Approval Requests" && <T2HODGetThesis setShowDetails={setShowDetails} />}
                                                {/* </Routes> */}
                                            </div>
                                        </div>
                                    )
                                    )}


                                </TabPanel>
                            )
                        ))}
                </TabView>
            </div>
        </>
    );
};

export default RoleTabs;
