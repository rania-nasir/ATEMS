import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';

export default function StudentviewAnnouncement() {
    const [announcementData, setAnnouncementData] = useState([]);

    useEffect(() => {
        async function fetchAnnouncementData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/viewAnnouncement', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncementData(data.allAnnouncements);

                    console.log('announcement Data -> ', announcementData);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchAnnouncementData();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
            <div className='mx-6'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Announcements
                    </h2>
                </div>
                <div className="my-8 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Announcement Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Announcement Content
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {announcementData.length > 0 ? (
                                announcementData.map(rowData => (
                                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        key={rowData.announcementTitle}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {rowData.announcementTitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            {rowData.announcementContent}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>No announcements found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}