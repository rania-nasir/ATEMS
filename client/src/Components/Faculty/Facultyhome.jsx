import { useEffect, useState } from "react";
import Cookies from 'js-cookie'

const Facultyhome = () => {

    const userId = Cookies.get('userId');

    const [facultyData, setfacultyData] = useState([]);

    useEffect(() => {
        async function fetchfacultyData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setfacultyData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchfacultyData();
    }, [userId]);

    console.log(facultyData);

    return (
        <>
            <div className='mx-8'>
                <div>
                    <h3 className="text-lg mb-6 leading-6 font-semibold text-grey-800">
                        Faculty Profile
                    </h3>
                </div>
                <div className="mt-2 bg-teal-500 shadow overflow-hidden sm:rounded-lg">

                    <div className="px-4 py-5 sm:px-6">
                        <p className="max-w-2xl text-md text-white">
                            Personal Details and informations.
                        </p>
                    </div>
                    {Object.keys(facultyData).length === 0 ? (
                        <p className="px-6 py-4">No faculty found</p>
                    ) : (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Faculty ID:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {facultyData.facultyid}

                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Name:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {facultyData.name}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Email address
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {facultyData.email}
                                        </dd>
                                    </div>

                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">

                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Mobile
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {facultyData.mobile}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Gender:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {facultyData.gender}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:gap-4 sm:px-6">

                                    <div className="">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roles:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {facultyData.role && facultyData.role.length > 0 ? (

                                                <span className="mr-2">
                                                    {facultyData.role.join(', ')}
                                                </span>

                                            ) : (
                                                <span>No roles found</span>
                                            )}
                                        </dd>
                                    </div>
                                </div>

                            </dl>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Facultyhome;