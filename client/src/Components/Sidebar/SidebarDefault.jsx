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
            subItems: [],
        },
        {
            id: 2,
            title: 'Announcement',
            path: '/',
            subItems: [
                { id: 21, title: 'Make Announcement', path: '/makeAnnouncement' },
                { id: 22, title: 'View Announcement', path: '/viewAnnouncemet' },
            ],
        },
        {
            id: 3,
            title: 'Faculty Records',
            path: '/',
            subItems: [
                { id: 31, title: 'Add Faculty', path: '/addfacultyrecord' },
                { id: 32, title: 'View Student', path: '/viewstudent' },
            ],
        },
        {
            id: 4,
            title: 'Student Records',
            path: '/',
            subItems: [
                { id: 41, title: 'Add Student', path: '/addstudentrecord' },
                { id: 42, title: 'View Student', path: '/viewstudent' },
            ],
        }
    ];

    const facultySidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            subItems: [],
        },
        {
            id: 2,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            subItems: [],
        },
        
    ];

    const studentSidebarItems = [
        {
            id: 1,
            title: 'Home',
            path: '/',
            subItems: [],
        },
        {
            id: 2,
            title: 'Synopsis Form',
            path: '/synopsisForm',
            subItems: [],
        },
        {
            id: 3,
            title: 'View Announcement',
            path: '/viewAnnouncement',
            subItems: [],
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

    const renderSubMenuItems = (subItems) => {
        return (
            <ul>
                {subItems.map((subItem) => (
                    <li key={subItem.id}>
                        <NavLink
                            to={subItem.path}
                            onClick={() => handleMenuClick(subItem.path, subItem.id)}
                            className="block py-2 px-8 hover:bg-gray-200"
                        >
                            {subItem.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <div className="flex h-screen">
                <div className="text-gray border-r border-gray-200 w-64 flex flex-col">
                    {menuItems.map((menuItem) => (
                        <div key={menuItem.id}>
                            <NavLink
                                to={menuItem.path}
                                onClick={() => handleMenuClick(menuItem.path, menuItem.id)}
                                className={`flex items-left w-full py-2 px-4 hover:bg-gray-200 ${activeMenu === menuItem.id ? 'bg-gray-200' : ''}`}
                            >
                                {menuItem.title}
                            </NavLink>
                            {activeMenu === menuItem.id && menuItem.subItems.length > 0 && renderSubMenuItems(menuItem.subItems)}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SidebarDefault;
