import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';

export default function ThesisRecord() {
    const [thesisData, setThesisData] = useState([]);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch('http://localhost:5000/gc/viewAllThesis', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data && data.viewallThesis) {
                        setThesisData(data.viewallThesis);
                    } else {
                        throw new Error('Data structure error');
                    }
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, []);

    return (
        <>
            <div className='m-2'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-950">
                        Thesis Record
                    </h2>
                </div>
                <div className="m-6 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Thesis ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Thesis Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        {thesisData.length === 0 ? (
                            <p className="px-6 py-4">No thesis found</p>
                        ) : (
                            <tbody>
                                {thesisData.map(rowData => (
                                    <tr
                                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        key={rowData.thesisid}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.thesisid}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.thesistitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            {rowData.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            {rowData.thesisstatus}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </>
    );
}
