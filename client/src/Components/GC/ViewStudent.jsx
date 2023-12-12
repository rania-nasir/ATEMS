import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookie from 'js-cookie';

export default function ViewStudent() {
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        async function fetchStudentData() {
            try {
                const response = await fetch('http://localhost:5000/gc/viewStudents', {headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                }}); 
                if (response.ok) {
                    const data = await response.json();
                    setStudentData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchStudentData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Student Record
                </h2>
            </div>
            <div class="mt-6 shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Roll Number
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Student Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Batch
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Semester
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Program
                            </th>
                            <th scope="col" class="px-6 py-3">
                                CGPA
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData?.map(rowData => (
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.rollno}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.name}
                                </td>
                                <td className="px-6 py-4">
                                    {rowData.email}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.batch}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.semester}
                                </td>
                                <td className="px-6 py-4">
                                    {rowData.program}
                                </td>
                                <td className="px-6 py-4">
                                    {rowData.cgpa}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
