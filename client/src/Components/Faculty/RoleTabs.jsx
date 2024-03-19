import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useContext } from 'react';
import { RoleContext } from '../../context/RoleContext';
import GetSynopsis from './GetSynopsis';
import MSRCAllThesis from './MSRCAllThesis';
import HODGetThesis from './HOD/GetThesis'
import AllProposalEvaluations from './Supervisor/AllProposalEvaluations';
import AllInternalPropEvaluations from './Internal/AllInternalPropEvaluations';
import AllMid1Evaluations from './Supervisor/AllMid1Evaluations';
import AllMid1InternalEvaluations from './Internal/AllMid1InternalEvaluations';
import AllFinal1Evaluations from './Supervisor/AllFinal1Evaluations';
import AllFinal1InternalEvaluations from './Internal/AllFinal1InternalEvaluations';


const RoleTabs = () => {
    const { role } = useContext(RoleContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const tabs = [
        { role: 'Supervisor', panels: ['Thesis Requests', 'Proposal Defense', 'Thesis 1 Mid Evaluation', 'Thesis 1 Final Evaluation'] },
        { role: 'Internal', panels: ['Proposal Defense Internal Evaluations', 'Thesis 1 Mid Internal Evaluation', 'Thesis 1 Final Internal Evaluation', 'Feedback'] },
        { role: 'MSRC', panels: ['MSRC Requests'] },
        { role: 'HOD', panels: ['Thesis Approval Requests'] },
    ];

    const userTabs = tabs.find((tab) => tab.role === role);
    console.log('usertabs', userTabs);

    return (
        <>
            <div className="card mt-1">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    {userTabs &&
                        userTabs.panels.map((panel, index) => (
                            <TabPanel key={index} header={panel}>
                                {/* Content for each tab panel */}
                                <div className="m-0">
                                    {panel === "Thesis Requests" && (
                                        <GetSynopsis />
                                    )}
                                    {panel === "Proposal Defense" && (
                                        <>
                                            <AllProposalEvaluations />
                                        </>
                                    )}
                                    {panel === "Proposal Defense Internal Evaluations" && (
                                        <>
                                            <AllInternalPropEvaluations />
                                        </>
                                    )}
                                    {panel === "Thesis 1 Mid Evaluation" && (
                                        <>
                                            <AllMid1Evaluations/>
                                        </>
                                    )}
                                    {panel === "Thesis 1 Final Evaluation" && (
                                        <>
                                            <AllFinal1Evaluations/>
                                        </>
                                    )}
                                    {panel === "Thesis 1 Mid Internal Evaluation" && (
                                        <>
                                            <AllMid1InternalEvaluations/>
                                        </>
                                    )}
                                    {panel === "Thesis 1 Final Internal Evaluation" && (
                                        <>
                                            <AllFinal1InternalEvaluations/>
                                        </>
                                    )}
                                    {panel === "Feedback" && (
                                        <p>Feedback</p>
                                    )}
                                    {panel === "MSRC Requests" && (
                                        <MSRCAllThesis />
                                    )}
                                    {panel === "Thesis Approval Requests" && (
                                        <HODGetThesis />
                                    )}
                                </div>
                            </TabPanel>
                        ))}
                </TabView>
            </div>
        </>
    );
};

export default RoleTabs;