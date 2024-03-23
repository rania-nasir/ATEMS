import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';

export default function T2GetRegistrationDetails({ setShowDetails }) {

    const { rollno } = useParams();
    const [registrationData, setregistrationData] = useState({ studentDetails: null });

    useEffect(() => {
        async function fetchregistrationData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/getThesis2StudentDetails/${rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setregistrationData(data);
                    console.log('registration Data Detail -> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchregistrationData();
    }, [rollno]);

    const approveData = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/faculty/approveThesis2Request/${rollno}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            }
        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
                setShowDetails(false);
            } else {
                window.alert("Accepted registration Successfully");
                console.log("Accepted registration Successfully");
                setShowDetails(false);
            }
        } else {
            window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    }

    return (
        <>
            <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
                <div className="mt-2 bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                    <div className="px-4 py-5 sm:px-6">
                        <p className="max-w-2xl text-md text-white">
                            Thesis Registration registration Request Details
                        </p>
                    </div>
                    {registrationData.studentDetails && (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll Number:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {registrationData.studentDetails.rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {registrationData.studentDetails.stdname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor ID:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {registrationData.studentDetails.facultyid}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor Name:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {registrationData.studentDetails.supervisorname}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Internals ID:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {registrationData.studentDetails.internalsid.map((internalid, index) => (
                                                <div className='my-1' key={index}>{internalid}</div>
                                            ))}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Internals Name:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {registrationData.studentDetails.internals.map((name, index) => (
                                                <div className='my-1' key={index}>{name}</div>
                                            ))}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-5">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {registrationData.studentDetails.thesistitle}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Task Titles:
                                        </dt>
                                        <dd className="my-1 text-sm text-gray-900 sm:mt-0">
                                            {registrationData.studentDetails.tasktitles.map((title, index) => (
                                                <div className='my-1' key={index}>{title}</div>
                                            ))}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Objectives:
                                        </dt>
                                        <dd className="my-1 text-sm text-gray-900 sm:mt-0">
                                            {registrationData.studentDetails.objectives.map((objective, index) => (
                                                <div className='my-1' key={index}>{objective}</div>
                                            ))}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Completion Dates:
                                        </dt>
                                        <dd className="my-1 text-sm text-gray-900 sm:mt-0">
                                            {registrationData.studentDetails.completiondates.map((date, index) => (
                                                <div className='my-1' key={index}>{new Date(date).toLocaleDateString()}</div>
                                            ))}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                    )}
                </div>

                {/* Approval buttons */}
                <div className='my-6 w-[90%] flex justify-start'>
                    <button className="flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2"
                        type="button"
                        name='approvedata'
                        onClick={approveData}>
                        APPROVE
                    </button>
                </div>
            </div>
        </>
    );
}
