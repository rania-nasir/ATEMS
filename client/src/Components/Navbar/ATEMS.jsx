import React from 'react';
import { useLocation } from 'react-router-dom';

const ATEMS = () => {
    const location = useLocation();

    const isLandingPage = location.pathname === '/';
    const isWhoPage = location.pathname === '/who';

    return (
        <span className='text-xl font-medium ml-2 mr-2'>{isLandingPage || isWhoPage ? 'Academic Thesis Evaluation And Management System' : 'ATEMS'}</span>
    );
}

export default ATEMS;
