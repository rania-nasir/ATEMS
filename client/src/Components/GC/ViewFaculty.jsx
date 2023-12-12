import { useState, useEffect } from 'react';
import Cookie from 'js-cookie'


export default function ViewFaculty() {
    const [FacultyData, setFacultyData] = useState([]);

    useEffect(() => {
        async function fetchFacultyData() {
            try {
                const response = await fetch('http://localhost:5000/gc/viewFaculty', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setFacultyData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchFacultyData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Faculty Record
                </h2>
            </div>
            <div class="mt-6 shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Faculty ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Faculty Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Roles
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {FacultyData?.map(rowData => (
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.facultyid}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.name}
                                </td>
                                <td className="px-6 py-4">
                                    {rowData.email}
                                </td>
                                <td className="px-6 py-4">
                                    {rowData.role && rowData.role.length > 0 ? (
                                        rowData.role.map((role, index) => (
                                            <span key={index} className="mr-2">
                                                {role}
                                            </span>
                                        ))
                                    ) : (
                                        <span>No roles found</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
