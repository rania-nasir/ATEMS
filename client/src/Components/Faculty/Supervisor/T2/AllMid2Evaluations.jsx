import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { NavLink } from 'react-router-dom';

export default function AllMid2Evaluations({ setShowDetails }) {
    const [thesisData, setThesisData] = useState([]);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/supthesis2AllMidEvals', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisData(data);
                    console.log('the data = ', data)
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, []);


    const handleViewDetails = () => {
        // Trigger setShowDetails when "View Details" link is clicked
        setShowDetails(true);
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
                <div className="w-full my-2">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis/ Project 2 Mid Evaluations
                    </h2>
                </div>
                <div className="m-6 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">
                                    Roll Number
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Student Name
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Supervisor Name
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Internals
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {thesisData?.map((student) => (
                                <tr
                                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    key={student?.rollno}
                                >
                                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {student?.rollno}
                                    </td>
                                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                        {student?.stdname}
                                    </td>
                                    <td className="px-4 py-4">{student?.thesistitle}</td>
                                    <td className="px-4 py-4">{student?.supervisorname}</td>
                                    <td className="px-4 py-4">{student?.internals.join(', ')}</td>
                                    <td className="px-6 py-4">
                                    {student?.rollno && ( // Add conditional check
                                            <NavLink
                                                to={`/mid2EvalDetails/${student.rollno}`}
                                                onClick={() => handleViewDetails()}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                View Details
                                            </NavLink>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {thesisData.length === 0 && (
                                <tr>
                                    <td
                                        className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                                        colSpan="6"
                                    >
                                        No Mid Evaluations Found
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
