import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { NavLink } from 'react-router-dom';

export default function GCTitleChangeRequests() {
    const [reqData, setReqData] = useState([]);

    useEffect(() => {
        async function fetchReqData() {
            try {
                const response = await fetch('http://localhost:5000/gc/gcViewPendingTitleRequests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setReqData(data); // Update state with thesisData array
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchReqData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
            <div className="sm:mx-auto w-full mt-12">
                <h2 className="pb-2 text-center text-2xl tracking-tight text-gray-900 font-semibold">
                    MS Thesis Title Change Requests
                </h2>
            </div>
            <div className="m-6 shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Student Roll No.
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
                        {reqData.length > 0 ? (
                            reqData.map(rowData => (
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.rollno}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.stdname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {rowData.currentThesisTitle}
                                    </td>
                                    <td className="px-6 py-4">
                                        <NavLink
                                            to={`/gcViewPendingTitleDetails/${rowData.rollno}`}
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            View Details
                                        </NavLink>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center">No requests available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
