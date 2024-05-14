import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';

export default function TitleChangeRequestDetails() {

    const toastTopCenter = useRef(null);
    const navigate = useNavigate();

    const { rollno } = useParams();
    const [ReqData, setReqData] = useState(null);

    useEffect(() => {
        async function fetchthesisData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/supViewPendingTitleDetails/${rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setReqData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchthesisData();
    }, [rollno]);

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    const approveData = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/faculty/supApprovePendingTitleRequests/${rollno}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify()
        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Request Approved and Forwarded to GC") {
                showMessage('success', data.message);
                console.log(data.message);
                setTimeout(() => {
                    navigate('/supViewPendingTitleRequests');
                }, 3000);
            } else {
                showMessage('error', data.message);
                console.log(data.message);
            }
        } else {
            showMessage('error', "System Error. Please try later!");
            console.log("Invalid Input", data);
        }
    }

    const declineData = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:5000/faculty/supRejectPendingTitleRequests/${rollno}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                }
            });

            const data = await res.json();
            console.log("Response data:", data); // Log the response data

            if (res.status === 200) {
                if (data.message === "Request Rejected") {
                    showMessage('success', data.message);
                    console.log(data.message);
                    setTimeout(() => {
                        navigate('/supViewPendingTitleRequests');
                    }, 3000);
                } else {
                    showMessage('info', data.message);
                    console.log(data.message);
                }
            } else {
                showMessage('error', "System Error. Please try later!");
                console.log("Invalid Input");
            }
        } catch (error) {
            showMessage('error', "System Error. Please try later!");
            console.log("System Error. Please try later!", error);
        }
    }

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className='flex flex-1 flex-col justify-center items-center px-6 my-2 lg:px-8'>
                <div className="mt-2 bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                    <div className="px-4 py-5 sm:px-6">
                        <p className="max-w-2xl text-md text-white">
                            Title Change Request Details
                        </p>
                    </div>
                    {ReqData && (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ReqData.currentThesisTitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            New Thesis Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ReqData.newThesisTitle}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll Number
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ReqData.rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ReqData.stdname}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                    )}
                </div>

                {/* Approval/Decline buttons */}
                <div className='mt-4 w-[90%] flex justify-center'>
                    <form className="w-full">

                        {/* Approval/Decline buttons */}
                        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm flex flex-row gap-3">
                            <div className="grid grid-cols-2 w-full">
                                <button className="col-span-1 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    name='approvedata'
                                    onClick={approveData}
                                >
                                    APPROVE
                                </button>
                                <button className="col-span-1 flex-shrink-0 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-md shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    name='declinedata'
                                    onClick={declineData}
                                >
                                    DECLINE
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
