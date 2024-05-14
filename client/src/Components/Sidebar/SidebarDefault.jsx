import React, { useState, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

import Cookies from "js-cookie";
import { RoleContext } from '../../context/RoleContext';
import { ActiveTitleContext } from "../../context/ActiveTitleContext";

import dashbboardicon from '../../Icons/dashboard.png';
import recordsicon from '../../Icons/records.png';
import requestsicon from '../../Icons/requests.png';
import announcementicon from '../../Icons/announcement.png';
import timelineicon from '../../Icons/timeline.png';
import thesisrecordsicon from '../../Icons/thesis-records.png'
import evaluationsicon from '../../Icons/evaluations.png'
import homeicon from '../../Icons/home.png';
import Managementicon from '../../Icons/Managment.png'
import Managmentsicon from '../../Icons/Managments.png';
import Managingsicon from '../../Icons/Managings.png';
import formicon from '../../Icons/form.png';
import feedbackicon from '../../Icons/feedback.png'
import Permissionicon from '../../Icons/permissions.png';
import ReportIcon from '../../Icons/report.png';


const SidebarDefault = () => {
    const { activeTitle, setActiveTitle } = useContext(ActiveTitleContext);
    const { role, setRole } = useContext(RoleContext);

    const userId = Cookies.get('userId');
    const userType = Cookies.get('userType');

    const [facultyData, setfacultyData] = useState([]);

    useEffect(() => {
        async function fetchfacultyData() {
            if (userType === 'faculty') {
                try {
                    const response = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${Cookies.get('jwtoken')}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setfacultyData(data);
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                } catch (error) {
                    console.error('Failed to retrieve data: ', error);
                }
            }
        }

        fetchfacultyData();
    }, [userId]);

    const GCSidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: dashbboardicon,
        },
        {
            id: 2,
            title: 'Make Announcement',
            path: '/makeAnnouncement',
            iconsrc: announcementicon,
        },
        {
            id: 3,
            title: 'Thesis Records',
            path: '/viewAllThesis',
            iconsrc: thesisrecordsicon,
        },
        {
            id: 4,
            title: 'Faculty Records',
            path: '/viewfaculty',
            iconsrc: recordsicon,
        },
        {
            id: 5,
            title: 'Student Records',
            path: '/viewstudent',
            iconsrc: recordsicon,
        },
        {
            id: 6,
            title: 'Thesis Requests',
            path: '/ReviewRequest',
            iconsrc: requestsicon,
        },
        {
            id: 7,
            title: 'Panel Timelines',
            path: '/PanelTimelines',
            iconsrc: timelineicon,
        },
        {
            id: 8,
            title: 'Evaluation Permissions',
            path: '/Permissions',
            iconsrc: Permissionicon,
        },
        {
            id: 9,
            title: 'Thesis Evaluations',
            path: '/Evaluations',
            iconsrc: evaluationsicon,
        },
        {
            id: 10,
            title: 'Title Change Requests',
            path: '/gcViewPendingTitleRequests',
            iconsrc: evaluationsicon,
        },
    ];

    const facultySidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: homeicon,
        },
        {
            id: 2,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            iconsrc: announcementicon,
        },
        {
            id: 3,
            title: 'Supervisor',
            path: '/Supervisor',
            iconsrc: Managementicon,
        },
        {
            id: 4,
            title: 'Internal Examiner',
            path: '/Internal',
            iconsrc: Managmentsicon,
        },
        {
            id: 5,
            title: 'MSRC Committee',
            path: '/MSRC',
            iconsrc: Managmentsicon,
        },
        {
            id: 6,
            title: 'Head of Department',
            path: '/HOD',
            iconsrc: Managingsicon,
        },
        {
            id: 7,
            title: 'Title Change Requests',
            path: '/supViewPendingTitleRequests',
            iconsrc: Managmentsicon,
        },
    ];

    const studentSidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: homeicon,
        },
        {
            id: 2,
            title: 'Synopsis Form',
            path: '/fillSynopsis',
            iconsrc: formicon,
        },
        {
            id: 3,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            iconsrc: announcementicon,
        },
        {
            id: 4,
            title: 'Report Submission',
            path: '/reportSubmission',
            iconsrc: ReportIcon,
        },
        {
            id: 5,
            title: 'View Feedback',
            path: '/viewFeedback',
            iconsrc: feedbackicon,
        },
        {
            id: 6,
            title: 'Thesis Title Change Request',
            path: '/viewTitleChangeForm',
            iconsrc: ReportIcon,
        },
        {
            id: 7,
            title: 'Supervisor Change Request',
            path: '/viewSupervisorChangeForm',
            iconsrc: feedbackicon,
        },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        let defaultMenuItems;
        // Use userType to determine which sidebar items to display
        if (userType === "faculty") {
            defaultMenuItems = facultySidebarItems;
        } else if (userType === "student") {
            defaultMenuItems = studentSidebarItems;
        } else if (userType === "gc") {
            defaultMenuItems = GCSidebarItems;
        }

        setMenuItems(defaultMenuItems);
    }, [userType]);

    const [isSupervisor, setIsSupervisor] = useState(false);
    const [isInternal, setIsInternal] = useState(false);
    const [isMSRC, setIsMSRC] = useState(false);
    const [isHOD, setIsHOD] = useState(false);

    useEffect(() => {
        console.log(facultyData.role)
        // Assuming facultyData is an object and facultyData.role is an array
        if (facultyData && facultyData.role && facultyData.role.includes) {
            if (facultyData.role.includes("Supervisor")) {
                setIsSupervisor(true);
                console.log("This is a Supervisor.");
            }
            if (facultyData.role.includes("Internal")) {
                setIsInternal(true);
                console.log("This is an Internal role.");
            }
            if (facultyData.role.includes("MSRC")) {
                setIsMSRC(true);
                console.log("This is an MSRC role.");
            }
            if (facultyData.role.includes("HOD")) {
                setIsHOD(true);
                console.log("This is an HOD role.");
            }
        } else {
            // Handle the case when facultyData or facultyData.role is undefined or null
            console.log("Error: Missing data");
        }

    }, [facultyData]);

    const [activeMenu, setActiveMenu] = useState(""); // Initialize activeMenu with id 1
    const [menuItems, setMenuItems] = useState([]);

    const handleMenuClick = (path, id, title) => { // Include title in handleMenuClick function

        setActiveMenu(id); // Update activeMenu on menu click
        setActiveTitle(title);
        navigate(path);
        console.log("sidebar title = ", activeTitle);
        if (userType === 'faculty') {
            // Check conditions for rendering based on role
            if ((id === 3 && isSupervisor)) {
                setRole("Supervisor");
            } else if ((id === 4 && isInternal)) {
                setRole("Internal");
            } else if ((id === 5 && isMSRC)) {
                setRole("MSRC");
            } else if ((id === 6 && isHOD)) {
                setRole("HOD");
            }
        }
    };

    return (
        <>
            <div className="flex min-w-max">
                <div className="text-gray-900 px-2 pt-4 flex flex-col border-r border-gray-350">
                    {menuItems?.map((menuItem) => {

                        return (
                            <div className="w-full" key={menuItem.id}>
                                <NavLink
                                    to={menuItem.path}
                                    onClick={() => handleMenuClick(menuItem.path, menuItem.id, menuItem.title)}
                                    className={`flex items-left w-full my-1 p-2 py-3 px-5 hover:bg-gray-200 ${activeMenu === menuItem.id ? 'bg-gray-200' : ''}`}
                                    style={{ borderRadius: "14px" }}
                                >
                                    <img className="mr-4" width="28" height="28" src={menuItem.iconsrc} alt="icon" />
                                    {menuItem.title}
                                </NavLink>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

// Export SidebarDefault component
export default SidebarDefault;
