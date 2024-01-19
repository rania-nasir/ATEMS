import React from "react";
// import { NavLink, useLocation } from "react-router-dom";

const Navlist = ({ userType }) => {

    // const location = useLocation();

    // const isLandingPage = location.pathname === '/'

    // const studentLinks = [
    //     { to: "/dashboard", label: "Dashboard" },
    //     { to: "/courses", label: "Courses" },
    //     { to: "/grades", label: "Grades" },
    //     // Add more student-specific links here
    // ];

    // const facultyLinks = [
    //     { to: "/dashboard", label: "Dashboard" },
    //     { to: "/courses", label: "Courses" },
    //     { to: "/manage-courses", label: "Manage Courses" },
    //     // Add more faculty-specific links here
    // ];

    // let links = null;
    // if (userType === "student") {
    //     links = studentLinks
    // }
    // else if (userType === 'faculty') {
    //     links = facultyLinks
    // }
    // else {
    //     return null;
    // }

    return (
        <nav>
            <ul className="flex items-center space-x-4">
                {/* {links.map((link, index) => (
                    <li key={index}>
                        <NavLink
                            to={link.to}
                            activeClassName="font-bold text-blue-500"
                            className="text-gray-600 hover:text-blue-500 transition duration-300"
                        >
                            {link.label}
                            {isLandingPage ? null : <Navlist />}
                        </NavLink>
                    </li>
                ))} */}
            </ul>
        </nav>
    );
};

export default Navlist;
