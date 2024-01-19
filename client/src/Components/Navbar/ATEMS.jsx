import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const ATEMS = () => {
    const location = useLocation();

    const isLandingPage = location.pathname === '/';
    const isWhoPage = location.pathname === '/who';

    return (
        <NavLink to='/'>
            <span className='text-xl font-bold ml-2 mr-2 '>
                {isLandingPage || isWhoPage ? 'Academic Thesis Evaluation And Management System' : 'ATEMS'}
            </span>
        </NavLink>
    );
}

export default ATEMS;
