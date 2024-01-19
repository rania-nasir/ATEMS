import { useState, useEffect } from 'react';
import Cookie from 'js-cookie'


export default function ViewFeedback() {
    const [FeedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        async function fetchFeedbackData() {
            try {
                const response = await fetch('http://localhost:5000/std/viewFeedback', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setFeedbackData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchFeedbackData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="m-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Feedback
                </h2>
            </div>
            <div class="m-6 shadow-md sm:rounded-lg">

                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Feedback ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Feedback Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                                MSRC Member
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Roll Number
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Feedback Content
                            </th>
                        </tr>
                    </thead>
                    {FeedbackData.length === 0 ? (
                        <p className="px-6 py-4">No feedback found</p>
                    ) : (
                        <tbody>
                            {FeedbackData.map(rowData => (
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.thesisid}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.feedbackID}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.feedbackType}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.facultyname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {rowData.rollno}
                                    </td>
                                    <td className="px-6 py-4">
                                        {rowData.feedbackContent}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>

            </div>
        </>
    )
}
