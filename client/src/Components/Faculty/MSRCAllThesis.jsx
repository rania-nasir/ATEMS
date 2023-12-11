import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { NavLink } from 'react-router-dom';

export default function MSRCAllThesis() {
    const [thesisData, setthesisData] = useState([]);

    useEffect(() => {
        async function fetchthesisData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/msrcAllThesis', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setthesisData(data.acceptedThesis);

                    // const rowData = data.map(item => item.thesisid);

                    console.log('thesis Data -> ', thesisData)

                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchthesisData();
    }, []);

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    MSRC Thesis Review Requests
                </h2>
            </div>
            <div class="mt-6 shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Thesis ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Thesis Title
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    {thesisData ? (
                        <tbody>
                            {thesisData?.map(rowData => (
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
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
                                        <NavLink to={`/msrcThesisDetails/${rowData.thesisid}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            View Details
                                        </NavLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <p className='px-6 py-4'>No Thesis Available</p>)}
                </table>
            </div>
        </>
    )
}
