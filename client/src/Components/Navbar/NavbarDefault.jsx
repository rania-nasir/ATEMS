import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import atems_logo from '../../Images/faviconn.png'
import ATEMS from './ATEMS';
import Navlist from './Navlist'
import {
    Navbar,
    MobileNav,
    Typography,
    IconButton
} from "@material-tailwind/react";
import Cookies from 'js-cookie';

const LogoutButton = ({ onLogout }) => {
    const navigate = useNavigate();

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
        <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-md font-medium text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleLogout}>Logout</button>
    );
};

const NavbarDefault = () => {
    const [openNav, setOpenNav] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(!!Cookies.get('jwtoken'));

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    return (
        <Navbar className="mx-auto py-2 px-4 lg:px-8 lg:py-4" >
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">

                <Typography
                    as="a"
                    href="#"
                    className="text-2xl font-sans mr-4 cursor-pointer py-1.5 font-medium"
                    style={{ color: "black" }}
                >
                    <div className="flex justify-between items-center">
                        <NavLink to='/'>
                            <img src={atems_logo} className="w-10" alt="logo" />
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
                        <NavLink className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-md font-medium text-sm px-5 py-2.5 text-center me-2 mb-2"
                            to="/who">Login</NavLink>
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
                            to="/who"
                            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-md font-medium text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Sign In
                        </NavLink>
                    )}
                </div>
            </MobileNav>
        </Navbar>
    );
}

export default NavbarDefault;