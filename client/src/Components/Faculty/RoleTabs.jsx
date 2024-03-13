import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useContext } from 'react';
import { RoleContext } from '../../context/RoleContext';
import GetSynopsis from './GetSynopsis';
import MSRCAllThesis from './MSRCAllThesis';
import HODGetThesis from './HOD/GetThesis'
import AllProposalEvaluations from './Supervisor/AllProposalEvaluations';

const RoleTabs = () => {
    const { role } = useContext(RoleContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const tabs = [
        { role: 'Supervisor', panels: ['Thesis Requests', 'Proposal Defense'] },
        { role: 'Internal', panels: ['Evaluation', 'Feedback'] },
        { role: 'MSRC', panels: ['MSRC Requests'] },
        { role: 'HOD', panels: ['Thesis Approval Requests'] },
    ];

    const userTabs = tabs.find((tab) => tab.role === role);
    console.log('usertabs' ,userTabs);

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
                                        <AllProposalEvaluations/>
                                        </>
                                    )}
                                    {panel === "Evaluation" && (
                                        <p>Evaluation</p>
                                    )}
                                    {panel === "Feedback" && (
                                        <p>Feedback</p>
                                    )}
                                    {panel === "MSRC Requests" && (
                                        <MSRCAllThesis/>
                                    )}
                                    {panel === "Thesis Approval Requests" && (
                                        <HODGetThesis/>
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