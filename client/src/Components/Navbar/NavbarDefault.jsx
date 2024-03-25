import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import atems_logo from '../../Images/atems-logo.png'
import ATEMS from './ATEMS';
import Navlist from './Navlist'
import {
    MobileNav,
    Typography,
    IconButton
} from "@material-tailwind/react";
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';
import { ActiveTitleContext } from "../../context/ActiveTitleContext";

const LogoutButton = ({ onLogout }) => {
    const navigate = useNavigate();

    const [ActiveTitle, setActiveTitle] = useState("");
    console.log("Nav bar .js title = ", ActiveTitle);


    const handleLogout = () => {
        logoutUser();
        onLogout();
    };

    const logoutUser = () => {
        Cookies.remove('jwtoken');
        Cookies.remove('userId');
        Cookies.remove('userType');
        navigate('/');
        window.location.reload(); // Refresh the page
    };
    return (
        <button className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleLogout}>Logout</button>
    );
};

const NavbarDefault = () => {
    const [openNav, setOpenNav] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(!!Cookies.get('jwtoken'));
    const toastTopCenter = useRef(null);

    const [activeTitle, setActiveTitle] = useState("");
    console.log("Nav bar .js title = ", activeTitle);

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const showGetStartedToast = () => {
        toastTopCenter.current.show({ severity: 'info', detail: 'Please log in to get started.', life: 3000 });
    };

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const infoToast = () => {
        toastTopCenter.current.show({ severity: 'info', detail: 'You are on Home Page', life: 3000 });
    };

    const handleLogoClick = () => {
        // setActiveTitle("Home");
        // console.log("Nav : ", activeTitle)
        // window.location.reload();
        infoToast();
    };

    return (
        <>
            <ActiveTitleContext.Provider value={{ activeTitle, setActiveTitle }}>

                <div className="mx-auto py-1 px-4 lg:px-8 lg:py-4 shadow" >
                    <Toast ref={toastTopCenter} position="top-center" />
                    <div className="container mx-auto flex items-center justify-between text-blue-gray-900">

                        <Typography
                            as="a"
                            className="text-2xl font-sans mr-4 cursor-pointer py-0 font-medium"
                            style={{ color: "black" }}
                            onClick={handleLogoClick}
                        >
                            <div className="flex justify-between items-center">
                                <NavLink to='/'>
                                    <img src={atems_logo} className="w-12" alt="logo" />
                                </NavLink>

                                <ATEMS />
                            </div>
                        </Typography>
                        <div className="hidden lg:block">
                            {/* Component here */}
                            <Navlist />
                        </div>

                        {/* Login/Logout button */}
                        <div className="hidden lg:block">
                            {isLoggedIn ? (
                                <LogoutButton onLogout={handleLogout} />
                            ) : (
                                <NavLink className="p-button-info text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    to="/login" label="Info"
                                    onClick={showGetStartedToast}>Get Started</NavLink>
                            )}
                        </div>

                        <IconButton
                            variant="text"
                            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                            ripple={false}
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    stroke="black"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </IconButton>
                    </div>
                    <MobileNav open={openNav}>
                        {/* <div className="">
                    <NavLink
                        to="/who"
                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-md font-medium text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        Sign In
                    </NavLink>
                </div> */}
                        {/* Mobile Nav Login/Logout button */}
                        <div className="container mx-auto">
                            {isLoggedIn ? (
                                <LogoutButton onLogout={handleLogout} />
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                    </MobileNav>
                </div>
            </ActiveTitleContext.Provider>
        </>
    );
}

export default NavbarDefault;