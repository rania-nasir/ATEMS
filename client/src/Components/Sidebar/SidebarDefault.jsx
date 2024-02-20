import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext } from 'react';
import { RoleContext } from '../../context/RoleContext';


const SidebarDefault = () => {
    const { role, setRole } = useContext(RoleContext);

    const userId = Cookies.get('userId');
    const userType = Cookies.get('userType');

    const [facultyData, setfacultyData] = useState([]);

    useEffect(() => {
        async function fetchfacultyData() {
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

        fetchfacultyData();
    }, [userId]);

    // console.log('facultydata - ' + facultyData.name);
    // console.log('facultydata.role - ' + facultyData.role)

    const GCSidebarItems = [
        {
            id: 1,
            title: 'Dashboard',
            path: '/',
            iconsrc: "https://img.icons8.com/external-kmg-design-glyph-kmg-design/32/737373/external-dashboard-user-interface-kmg-design-glyph-kmg-design.png",
        },
        {
            id: 2,
            title: 'Make Announcement',
            path: '/makeAnnouncement',
            iconsrc: "https://img.icons8.com/pastel-glyph/64/737373/commercial--v2.png",
        },
        {
            id: 3,
            title: 'Thesis Records',
            path: '/viewAllThesis',
            iconsrc: "https://img.icons8.com/glyph-neue/64/737373/align-right.png", // empty array for Thesis Requests
        },
        {
            id: 4,
            title: 'Faculty Records',
            path: '/viewfaculty',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/data-provider.png",
        },
        {
            id: 5,
            title: 'Student Records',
            path: '/viewstudent',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/data-provider.png",
        },
        {
            id: 6,
            title: 'Thesis Requests',
            path: '/ReviewRequest',
            iconsrc: "https://img.icons8.com/ios-glyphs/30/737373/ask-question.png", // empty array for Thesis Requests
        }
    ];

    const facultySidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: "https://img.icons8.com/material-rounded/24/737373/home.png",
        },
        {
            id: 2,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/commercial.png",
        },
        {
            id: 3,
            title: 'Supervisor Management',
            path: '/Supervisor',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/invite.png",
        },
        {
            id: 4,
            title: 'Internal Management',
            path: '/Internal',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/giving.png",
        },
        {
            id: 5,
            title: 'MSRC Management',
            path: '/MSRC',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/giving.png",
        },
        {
            id: 6,
            title: 'HOD Management',
            path: '/HOD',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/invite.png",
        },
    ];

    const studentSidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: "https://img.icons8.com/material-rounded/24/737373/home.png",
        },
        {
            id: 2,
            title: 'Synopsis Form',
            path: '/synopsisForm',
            iconsrc: "https://img.icons8.com/material/24/737373/application-form.png",
        },
        {
            id: 3,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/commercial.png",
        },
        {
            id: 4,
            title: 'View Feedback',
            path: '/viewFeedback',
            iconsrc: "https://img.icons8.com/fluency-systems-filled/48/737373/request-feedback.png",
        },
    ];

    const navigate = useNavigate();

    // console.log(`Sidebar : user ID is ` + userId, `user Type is ` + userType)
    useEffect(() => {
        // Use userType to determine which sidebar items to display
        if (userType === "faculty") {
            setMenuItems(facultySidebarItems);
        } else if (userType === "student") {
            setMenuItems(studentSidebarItems);
        } else if (userType === "gc") {
            setMenuItems(GCSidebarItems);
        }
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

    const [activeMenu, setActiveMenu] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    const handleMenuClick = (path, id) => {
        navigate(path);
        setActiveMenu(activeMenu === id ? null : id);
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
            <div className="text-gray-800 px-2 flex flex-col">
                {menuItems.map((menuItem) => {

                    console.log('role = ', role);
                    console.log('role = ', role.includes("Supervisor"));

                    return (
                        <div className="w-full pr-1 border-r border-gray-350" key={menuItem.id}>
                            <NavLink
                                to={menuItem.path}
                                onClick={() => handleMenuClick(menuItem.path, menuItem.id)}
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

export default SidebarDefault;
