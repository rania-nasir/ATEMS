import React, { useContext } from 'react';
import { ActiveTitleContext } from '../context/ActiveTitleContext';
import Cookies from 'js-cookie';

// student
import StudentviewAnnouncement from './Student/StudentviewAnnouncement';

// Faculty
import FacultyviewAnnouncement from './Faculty/FacultyviewAnnouncement';

// Graduate Coordinator
import MakeAnnouncement from './GC/MakeAnnouncement';
import ViewFaculty from './GC/ViewFaculty';
import ViewStudent from './GC/ViewStudent';

export default function CommonSection() {
    const userType = Cookies.get('userType');

    // Accessing activeTitle from ActiveTitleContext
    const { activeTitle } = useContext(ActiveTitleContext);

    // Conditionally render components based on userType and activeTitle
    let renderedComponent;

    if (activeTitle === 'Home' || activeTitle === 'Dashboard') { }
    else {
        if (userType === 'student') {
            if (activeTitle === 'View Announcement') {
                // renderedComponent = <StudentviewAnnouncement />;
            }
        } else if (userType === 'faculty') {
            if (activeTitle === 'View Announcement') {
                // renderedComponent = <FacultyviewAnnouncement />;
            }
        } else if (userType === 'gc') {
            // if (activeTitle === 'Make Announcement') {
            //     renderedComponent = <MakeAnnouncement />;
            // } else if (activeTitle === 'Student Records') {
            //     renderedComponent = <ViewStudent />
            // } else if (activeTitle === 'Faculty Records') {
            //     renderedComponent = <ViewFaculty />
            // }
        }
    }
    return (
        <>
            <div
            // style={{ border: "1px solid yellow" }}
            >
                {/* Displaying the activeTitle */}
                {/* <p>Active Title: {activeTitle}</p> */}
                {/* Conditionally rendered component */}
                {renderedComponent}
                {/* <p>Common Content here...</p> */}
            </div>
        </>
    );
}
