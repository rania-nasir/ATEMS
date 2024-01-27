import { useState, useEffect } from 'react';
import Cookie from 'js-cookie'
import { NavLink } from 'react-router-dom';
import AddFaculty from './AddFaculty';


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


    const deleteFaculty = async (facultyid) => {
        try {
            const response = await fetch(`http://localhost:5000/gc/deleteFaculty/${facultyid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                }
            })
            if (response.ok) {
                const updatedData = FacultyData.filter(row => row.facultyid !== facultyid);
                setFacultyData(updatedData);
                console.log("Data deleted successfully: ", updatedData);
            } else {
                // Handle errors, show an error message, or log the error
                const errorMessage = await response.text();
                console.error('Error deleting Faculty:', errorMessage);
            }
        }
        catch (error) {
            console.error('Failed to delete data: ', error);
        }
    }

    return (
        <>
            <div className='m-2 p-2'>
                <div className="mx-4 w-full">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Faculty Record
                    </h2>
                </div>
                <AddFaculty/>
                <div class="m-6 shadow-md sm:rounded-lg">
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
                                <th scope="col" class="px-6 py-3">
                                    Update
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        {FacultyData.length === 0 ? (
                            <p className="px-6 py-4">No faculty found</p>
                        ) : (
                            <tbody>
                                {FacultyData?.map(rowData => (
                                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.facultyid}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rowData.name}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rowData.email}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
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
                                        <td className="px-6 py-4">
                                            <NavLink to="/updatefaculty" className="font-semibold leading-6 text-blue-600 hover:text-teal-600 hover:underline">
                                                Edit
                                            </NavLink>
                                        </td>
                                        <td className="px-6 py-4">
                                            <NavLink to="#" onClick={() => deleteFaculty(rowData.facultyid)} className="font-semibold leading-6 text-blue-600 hover:text-teal-600 hover:underline">
                                                Delete
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
