import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Cookie from 'js-cookie';

export default function T2Evaluations({ setShowDetails }) {
    const [allPendingProposals, setAllPendingProposals] = useState([]);
    const [allPendingMids, setAllPendingMids] = useState([]);
    const [allPendingFinals, setAllPendingFinals] = useState([]);

    // useEffect(() => {
    //     async function fetchAllPendingProposals() {
    //         try {
    //             const response = await fetch('http://localhost:5000/gc/gcViewPendingProposals', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `${Cookie.get('jwtoken')}`
    //                 }
    //             });
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setAllPendingProposals(data.pendingProposals);
    //                 console.log(data.message);
    //                 if (data.message) {
    //                     window.alert(data.message);
    //                 }
    //             } else {
    //                 throw new Error('Failed to fetch data');
    //             }
    //         } catch (error) {
    //             console.error('Failed to retrieve data: ', error);
    //         }
    //     }

    //     fetchAllPendingProposals();
    // }, []);

    // useEffect(() => {
    //     async function fetchAllPendingMids() {
    //         try {
    //             const response = await fetch('http://localhost:5000/gc/gcViewPendingMids', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `${Cookie.get('jwtoken')}`
    //                 }
    //             });
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setAllPendingMids(data.pendingMidReviews);
    //                 console.log(data.message);
    //                 if (data.message) {
    //                     window.alert(data.message);
    //                 }
    //             } else {
    //                 throw new Error('Failed to fetch data');
    //             }
    //         } catch (error) {
    //             console.error('Failed to retrieve data: ', error);
    //         }
    //     }

    //     fetchAllPendingMids();
    // }, []);

    // useEffect(() => {
    //     async function fetchAllPendingFinals() {
    //         try {
    //             const response = await fetch('http://localhost:5000/gc/gcViewPendingFinals', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `${Cookie.get('jwtoken')}`
    //                 }
    //             });
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setAllPendingFinals(data.pendingFinalReviews);
    //                 console.log(data.message);
    //                 if (data.message) {
    //                     window.alert(data.message);
    //                 }
    //             } else {
    //                 throw new Error('Failed to fetch data');
    //             }
    //         } catch (error) {
    //             console.error('Failed to retrieve data: ', error);
    //         }
    //     }

    //     fetchAllPendingFinals();
    // }, []);

    const handleViewDetails = () => {
        // Trigger setShowDetails when "View Details" link is clicked
        setShowDetails(true);
    };

    return (
        <>
            <div className='m-2 p-2 grid grid-cols-1'>
                <div className="mx-4">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Thesis 2 Evaluations
                    </h2>
                </div>
                <div className="m-6 shadow-md sm:rounded-lg col-span-1">
                    <h3 className='text-left text-lg font-semibold tracking-tight text-gray-950'>
                        Defense Proposal Evaluations
                    </h3>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Roll Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Batch
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPendingProposals && allPendingProposals.length > 0 ? (
                                allPendingProposals.map(proposal => (
                                    <tr key={proposal.rollno} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.rollno}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.stdname}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.batch}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <NavLink 
                                            // to={`/viewPendingProposal/${proposal.rollno}`}
                                                // onClick={() => handleViewDetails()} // Call handleViewDetails
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                        No pending proposals found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                <div className="m-6 shadow-md sm:rounded-lg col-span-1">
                    <h3 className='text-left text-lg font-semibold tracking-tight text-gray-950'>
                        Mid Evaluations
                    </h3>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Roll Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPendingMids && allPendingMids.length > 0 ? (
                                allPendingMids.map(proposal => (
                                    <tr key={proposal.rollno} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.rollno}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.stdname}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.thesistitle}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <NavLink 
                                            // to={`/viewPendingMid/${proposal.rollno}`} 
                                            //  onClick={() => handleViewDetails()} // Call handleViewDetails
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                        No pending Mid evaluations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="m-6 shadow-md sm:rounded-lg col-span-1">
                    <h3 className='text-left text-lg font-semibold tracking-tight text-gray-950'>
                        Final Evaluations
                    </h3>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Roll Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPendingFinals && allPendingFinals.length > 0 ? (
                                allPendingFinals.map(proposal => (
                                    <tr key={proposal.rollno} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.rollno}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.stdname}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {proposal.thesistitle}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <NavLink 
                                            // to={`/viewPendingFinal/${proposal.rollno}`} 
                                            //  onClick={() => handleViewDetails()} // Call handleViewDetails
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                        No pending Final evaluations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
