import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { NavLink } from 'react-router-dom';

export default function T2GetRegistration({ setShowDetails }) {
    const [RegistrationData, setRegistrationData] = useState({ allStudents: [] });

    useEffect(() => {
        async function fetchRegistrationData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/getThesis2Students', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRegistrationData(data);

                    // const rowData = data?.map(item => item.Studentsid);
                    console.log('Students Data -> ', data)

                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchRegistrationData();
    }, []);

    const handleViewDetails = () => {
        // Trigger setShowDetails when "View Details" link is clicked
        setShowDetails(true);
    };

    return (
        <>
            <div className='m-2 p-2 grid grid-cols-1'>

                <div className="sm:mx-auto w-full">
                    <h2 className="m-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        MS Thesis/ Project 2 Registration Students Requests
                    </h2>
                </div>
                <div className="overflow-x-auto m-6 shadow-md sm:rounded-lg col-span-1">
                    <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Student Roll Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Internals
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {RegistrationData && RegistrationData.allStudents.length > 0 ? (

                                RegistrationData.allStudents?.map(rowData => (
                                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.Studentsid}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rowData.rollno}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rowData.stdname}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rowData.thesistitle}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rowData.internals[0]}, {rowData.internals[1]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <NavLink
                                                to={`/getThesis2StudentDetails/${rowData.rollno}`}
                                                onClick={() => handleViewDetails()} // Call handleViewDetails
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='px-6 py-4 font-medium text-gray-900 dark:text-white' colSpan="6">No Students found</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}
