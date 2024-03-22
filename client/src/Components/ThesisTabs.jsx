import React, { useState, useContext } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { ActiveTitleContext } from '../context/ActiveTitleContext';
import T1MainSection from './Thesis1/T1MainSection';
import T2MainSection from './Thesis2/T2MainSection';
import { ThesisContext } from '../context/ThesisContext';

export default function ThesisTabs() {
    const [thesisStatus, setThesisStatus] = useState(1); // Default status set to 1
    const { activeTitle } = useContext(ActiveTitleContext);

    const handleTabChange = (e) => {
        setThesisStatus(e.index + 1);
    };

    console.log("Thesis Status: ", thesisStatus);


    if (activeTitle === 'Home' || activeTitle === 'Dashboard') {
        return null; // Don't render anything if activeTitle is Home or Dashboard
    }

    return (
        <ThesisContext.Provider value={{ thesisStatus }}> {/* Provide thesisStatus value */}
            <div className="card mt-1" 
            // style={{ border: "2px solid black" }}
            >
                <TabView activeIndex={thesisStatus - 1} onTabChange={handleTabChange}>
                    <TabPanel header="Thesis I">
                        <T1MainSection />
                    </TabPanel>
                    <TabPanel header="Thesis II">
                        <T2MainSection />
                    </TabPanel>
                </TabView>
            </div>
        </ThesisContext.Provider>
    );
}
