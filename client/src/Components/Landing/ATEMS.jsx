import React from 'react';
import { useLocation } from 'react-router-dom';

const ATEMS = () => {
    const location = useLocation();

    const isLandingPage = location.pathname === '/';
    const isWhoPage = location.pathname === '/who';

    return (
        <span className='text-xl font-medium m-6'>{isLandingPage || isWhoPage ? 'Academic Thesis Evaluation And Monitoring System' : 'ATEMS'}</span>
    );
}

export default ATEMS;
