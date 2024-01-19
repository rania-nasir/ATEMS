import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "js-cookie";


const SidebarDefault = () => {

    const userId = Cookies.get('userId');
    const userType = Cookies.get('userType');

    const GCSidebarItems = [
        {
            id: 1,
            title: 'Dashboard',
            path: '/',
            iconsrc: "https://img.icons8.com/external-kmg-design-glyph-kmg-design/32/737373/external-dashboard-user-interface-kmg-design-glyph-kmg-design.png",
            // subItems: [],
        },
        {
            id: 2,
            title: 'Make Announcement',
            path: '/makeAnnouncement',
            iconsrc: "https://img.icons8.com/pastel-glyph/64/737373/commercial--v2.png",
            // subItems: [],
        },
        {
            id: 3,
            title: 'Thesis Records',
            path: '/viewAllThesis',
            iconsrc: "https://img.icons8.com/glyph-neue/64/737373/align-right.png",
            // subItems: [], // empty array for Thesis Requests
        },
        {
            id: 4,
            title: 'Faculty Records',
            path: '/viewfaculty',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/data-provider.png",
            // subItems: [
            //     {
            //         id: 41, title: 'Add Faculty',
            //         path: '/addfacultyrecord',
            //         subiconsrc: "https://img.icons8.com/ios-filled/50/737373/add-administrator.png",
            //     },
            //     {
            //         id: 42, title: 'View Faculty', path: '/viewfaculty',
            //         subiconsrc: "https://img.icons8.com/ios-filled/50/737373/view-file.png",
            //     },
            // ],
        },
        {
            id: 5,
            title: 'Student Records',
            path: '/viewstudent',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/data-provider.png",
            // subItems: [
            //     {
            //         id: 51, title: 'Add Student',
            //         path: '/addstudentrecord',
            //         subiconsrc: "https://img.icons8.com/glyph-neue/64/737373/add-user-male.png",
            //     },
            //     {
            //         id: 52, title: 'View Student', path: '/viewstudent',
            //         subiconsrc: "https://img.icons8.com/ios-filled/50/737373/view-file.png",
            //     },
            // ],
        },
        {
            id: 6,
            title: 'Thesis Requests',
            path: '/ReviewRequest',
            iconsrc: "https://img.icons8.com/ios-glyphs/30/737373/ask-question.png",
            // subItems: [], // empty array for Thesis Requests
        }
    ];

    const facultySidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: "https://img.icons8.com/material-rounded/24/737373/home.png",
            // subItems: [],
        },
        {
            id: 2,
            title: 'Supervision Request',
            path: '/supAllRequests',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/invite.png",
            // subItems: [],
        },
        {
            id: 3,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/commercial.png",
            // subItems: [],
        },
        {
            id: 4,
            title: 'MSRC',
            path: '/MSRCAllThesis',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/giving.png",
            // subItems: [],
        },

    ];

    const studentSidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            iconsrc: "https://img.icons8.com/material-rounded/24/737373/home.png",
            // subItems: [],
        },
        {
            id: 2,
            title: 'Synopsis Form',
            path: '/synopsisForm',
            iconsrc: "https://img.icons8.com/material/24/737373/application-form.png",
            // subItems: [],
        },
        {
            id: 3,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            iconsrc: "https://img.icons8.com/ios-filled/50/737373/commercial.png",
            // subItems: [],
        },
        {
            id: 4,
            title: 'View Feedback',
            path: '/viewFeedback',
            iconsrc: "https://img.icons8.com/fluency-systems-filled/48/737373/request-feedback.png",
            // subItems: [],
        },
    ];

    const navigate = useNavigate();

    console.log(`Sidebar : user ID is ` + userId, `user Type is ` + userType)
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

    const [activeMenu, setActiveMenu] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    const handleMenuClick = (path, id) => {
        navigate(path);
        setActiveMenu(activeMenu === id ? null : id);
    };

    // const renderSubMenuItems = (subItems) => {
    //     return (
    //         <ul>
    //             {subItems && subItems.map((subItem) => (
    //                 <li className="pt-2" key={subItem.id}>
    //                     <NavLink
    //                         to={subItem.path}
    //                         onClick={() => handleMenuClick(subItem.path, subItem.id)}
    //                         className="flex items-left w-full p-2 py-4 px-4 hover:bg-gray-200"
    //                     >
    //                         <img className="mr-6 ml-2" width="22" height="22" src={subItem.subiconsrc} alt="icon" />
    //                         {subItem.title}
    //                     </NavLink>
    //                 </li>
    //             ))}
    //         </ul>
    //     );
    // };

    return (
        <>
            <div className="flex h-screen">
                <div className="text-gray-800 border-r border-gray-350 w-full pt-2 p-2 flex flex-col">
                    {menuItems.map((menuItem) => (
                        <div className="w-full pr-1" key={menuItem.id}
                            >
                            <NavLink 
                                to={menuItem.path}
                                onClick={() => handleMenuClick(menuItem.path, menuItem.id)}
                                className={`flex items-left w-full my-1 p-2 py-3 px-5 hover:bg-gray-200 ${activeMenu === menuItem.id ? 'bg-gray-200' : ''}`}
                                style={{ borderRadius: "14px" }}                >
                                <img className="mr-4"
                                    width="28" height="28" src={menuItem.iconsrc} alt="icon" />
                                {menuItem.title}
                            </NavLink>
                            {/* {activeMenu === menuItem.id && menuItem.subItems.length > 0 && renderSubMenuItems(menuItem.subItems)} */}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SidebarDefault;
