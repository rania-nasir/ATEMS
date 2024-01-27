import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useContext } from 'react';
import { RoleContext } from '../../context/RoleContext';
import GetSynopsis from './GetSynopsis';
import MSRCAllThesis from './MSRCAllThesis';

const RoleTabs = () => {
    const { role } = useContext(RoleContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const tabs = [
        { role: 'Supervisor', panels: ['Registration', 'Thesis Requests'] },
        { role: 'Internal', panels: ['Evaluation', 'Feedback'] },
        { role: 'MSRC', panels: ['MSRC Requests'] },
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
                                    {panel === "Registration" && (
                                        <GetSynopsis />
                                    )}
                                    {panel === "Thesis Requests" && (
                                        <p>Thesis Requests</p>
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
                                </div>
                            </TabPanel>
                        ))}
                </TabView>
            </div>
        </>
    );
};

export default RoleTabs;