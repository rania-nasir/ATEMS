import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';

export default function T2HODGetThesisDetails({ setShowDetails }) {

    const { rollno } = useParams();

    const [ThesisData, setThesisData] = useState({ studentDetails: null });

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/getHodThesis2StudentDetails/${rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisData(data);
                    console.log('Thesis Data Detail --> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, [rollno]);

    const approveData = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/faculty/approveHodThesis2Request/${rollno}`, {
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
                window.alert(data.message);
                console.log(data.message);
            } else {
                window.alert(data.message);
                console.log("Accepted Thesis Successfully");
                // navigate('/ReviewRequest')
                setShowDetails(false);
            }
        } else {
            window.alert(data.message);
            console.log(data.message);
        }
    }

    return (
        <>
            <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
                <div className="mt-2 bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                    <div className="px-4 py-5 sm:px-6">
                        <p className="max-w-2xl text-md text-white">
                            Thesis 2 Registration Request Details
                        </p>
                    </div>
                    {ThesisData.studentDetails && (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Roll No:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.studentDetails.rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.studentDetails.stdname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor ID
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.studentDetails.facultyid}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor Name
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.studentDetails.supervisorname}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">

                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Internals ID
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.studentDetails.internalsid.map((internal, index) => (
                                                <div className='my-1' key={index}>{internal}</div>
                                            ))}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            InternalS Name:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.studentDetails.internals.map((internal, index) => (
                                                <div className='my-1' key={index}>{internal}</div>
                                            ))}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.studentDetails.thesistitle}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">

                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Task Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.studentDetails.tasktitles.map((task, index) => (
                                                <div className='my-1' key={index}>{task}</div>
                                            ))}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Goal/ Objectives:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.studentDetails.objectives.map((obj, index) => (
                                                <div className='my-1' key={index}>{obj}</div>
                                            ))}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Completion Date:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.studentDetails.completiondates.map((date, index) => (
                                                <div className='my-1' key={index}>{date}</div>
                                            ))}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                    )}
                </div>

                {/* Approval buttons */}
                <div className='mt-4 flex justify-start'>
                    <button className="flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-4 py-2.5 text-center me-2 mb-2"
                        type="button"
                        name='approvedata'
                        onClick={approveData}
                    >
                        APPROVE
                    </button>
                </div>
            </div>

        </>
    );
}


