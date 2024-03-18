import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useContext } from 'react';
import { thesisContext } from '../../context/ThesisContext';

const ThesisTabs = () => {
    const { thesis } = useContext(thesisContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const tabs = [
        { thesis: 'Thesis 1', panels: ['Thesis Requests', 'Proposal Defense'] },
        { thesis: 'Thesis 2', panels: ['Evaluation', 'Feedback'] }
    ];

    const thesisTabs = tabs.find((tab) => tab.thesis === thesis);
    console.log('thesistabs' ,thesisTabs);

    return (
        <>
            <div className="card mt-1">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    {thesisTabs &&
                        thesisTabs.panels.map((panel, index) => (
                            <TabPanel key={index} header={panel}>
                                {/* Content for each tab panel */}
                                <div className="m-0">
                                    {panel === "Thesis Requests" && (
                                        {/* <GetSynopsis /> */}
                                    )}
                                    {panel === "Proposal Defense" && (
                                        <>
                                        {/* <AllProposalEvaluations/> */}
                                        </>
                                    )}
                                    {panel === "Evaluation" && (
                                        {/* <p>Evaluation</p> */}
                                    )}
                                    {panel === "Feedback" && (
                                        {/* <p>Feedback</p> */}
                                    )}
                                    {panel === "MSRC Requests" && (
                                        {/* <MSRCAllThesis/> */}
                                    )}
                                    {panel === "Thesis Approval Requests" && (
                                        {/* <HODGetThesis/> */}
                                    )}
                                </div>
                            </TabPanel>
                        ))}
                </TabView>
            </div>
        </>
    );
};

export default ThesisTabs;