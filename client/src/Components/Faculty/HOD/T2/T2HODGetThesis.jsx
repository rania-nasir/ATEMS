import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { NavLink } from 'react-router-dom';

export default function T2HODGetThesis({ setShowDetails }) {
    const [thesisData, setthesisData] = useState({ pendingRequests: [] });

    useEffect(() => {
        async function fetchthesisData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/getHodThesis2Students', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setthesisData(data);
                    console.log('thesis Data -> ', data)
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }
        fetchthesisData();
    }, []);

    const handleViewDetails = () => {
        // Trigger setShowDetails when "View Details" link is clicked
        setShowDetails(true);
    };

    return (
        <>
            <div className='m-2'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="my-2 text-center text-2xl font-bold tracking-tight text-gray-950">
                        MS Thesis/ Project 2 Registration Approval Requests
                    </h2>
                </div>
                <div class="m-6 shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Student Roll No.
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Student Name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Internals
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        {thesisData.pendingRequests.length === 0 ? (
                            <p className="px-6 py-4">No thesis found</p>
                        ) : (
                            <tbody>
                                {thesisData.pendingRequests?.map(rowData => (
                                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.rollno}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.stdname}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.thesistitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            {rowData.internals?.map((internal, index) => (
                                                <div className='my-1' key={index}>{internal}</div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <NavLink to={`/getHodThesis2StudentDetails/${rowData.rollno}`}
                                                onClick={() => handleViewDetails()} // Call handleViewDetails
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </>
    )
}
