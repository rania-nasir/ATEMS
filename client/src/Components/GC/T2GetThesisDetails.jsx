import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';

export default function GetThesisDetails({ setShowDetails }) {

    const toastTopCenter = useRef(null);

    const { rollno } = useParams();
    const [ThesisData, setThesisData] = useState({ studentDetails: null });

    console.log('rollno ==== ', rollno);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/gc/thesisTwoRegRequest/${rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisData(data);
                    console.log('Thesis Data Detail ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, [rollno]);

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };


    const approveData = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/gc/approveThesisTwoRegRequest/${rollno}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            }

        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Request approved successfully") {
                showMessage('success', data.message);
                console.log(data.message);
            } else {
                showMessage('info', data.message);
                console.log(data.message);
            }
        } else {
            showMessage('error', "System Error. Please try later!");
            console.log("Invalid Input", data);
        }
    }

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className='flex flex-1 flex-col justify-center items-center px-6 my-2 lg:px-8'>

                {ThesisData.studentDetails && (
                    <>
                        <div className="mt-2 bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                            <div className="px-4 py-5 sm:px-6">
                                <p className="max-w-2xl text-md text-white">
                                    MS Thesis/ project 2 Registration Approval Request Details
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                        <div className="sm:col-span-4">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Thesis Title:
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.thesistitle}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Student Roll No
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.rollno}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Student Name
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.stdname}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Supervisor ID
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.facultyid}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Supervisor Name
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.supervisorname}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Internals ID
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.internalsid.join(', ')}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Internals Name
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.internals.join(', ')}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Task Titles
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.tasktitles?.map((title, index) => (
                                                    <div className='my-2' key={index}>{title}</div>
                                                ))}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Objectives/ Goals
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.objectives?.map((objective, index) => (
                                                    <div className='my-2' key={index}>{objective}</div>
                                                ))}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Completion Dates
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {ThesisData.studentDetails.completiondates?.map((date, index) => (
                                                    <div className='my-2' key={index}>{new Date(date).toLocaleDateString()}</div>
                                                ))}
                                            </dd>
                                        </div>
                                    </div>
                                </dl>
                            </div>

                        </div>
                        {/* Approval/Decline buttons */}
                        <div className="my-4 w-full flex flex-row gap-3">
                            <div className="flex w-full justify-center">
                                <button className="flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-6 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    name='approvedata'
                                    onClick={approveData}
                                >
                                    APPROVE
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>

        </>
    );
}


