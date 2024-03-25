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
            <div className="sm:mx-auto w-full mt-12">
                    <h2 className="pb-2 text-center text-2xl tracking-tight text-gray-900 font-semibold">
                        MS Thesis/ Project 1 Feedbacks
                    </h2>
                </div>
            <div class="m-6 shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr><th scope="col" class="px-6 py-3">
                            Feedback Type
                        </th>
                            <th scope="col" class="px-6 py-3">
                                MSRC Member
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Feedback Content
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {FeedbackData.length === 0 ? (
                            <tr>
                                <td colspan="5" className="px-6 py-4">No feedback available</td>
                            </tr>
                        ) : (
                            FeedbackData?.map(rowData => (
                                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.feedbackID}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.feedbackType}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {rowData.facultyname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {rowData.feedbackContent}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}
