import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const EvaluationDetails = () => {
    const [selectedProposal, setSelectedProposal] = useState(null);
    const userId = useParams();

    useEffect(() => {
        const fetchSelectedProposal = async () => {
            try {
                const response = await fetch(`http://localhost:5000/gc/viewPendingProposal/${userId.rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSelectedProposal(data.selectedProposal);
                } else {
                    throw new Error('Failed to fetch selected proposal');
                }
            } catch (error) {
                console.error('Error fetching selected proposal:', error);
            }
        };

        fetchSelectedProposal();
    }, [userId]);

    const handleApprove = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gc/approveProposalComments/${userId.rollno}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookies.get('jwtoken')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Proposal approved successfully, update UI or show a success message
                console.log('Proposal approved successfully');
                window.alert(data.message)
            } else {
                // Handle error
                console.error('Failed to approve proposal');
            }
        } catch (error) {
            console.error('Error approving proposal:', error);
        }
    };

    const handleReject = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gc/rejectProposalComments/${userId.rollno}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookies.get('jwtoken')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Proposal rejected successfully, update UI or show a success message
                console.log('Proposal rejected successfully');
                window.alert(data.message)
            } else {
                // Handle error
                console.error('Failed to reject proposal');
            }
        } catch (error) {
            console.error('Error rejecting proposal:', error);
        }
    };

    return (
        <>
            {selectedProposal ? (
                <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
                    <div className="mt-2 bg-teal-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                        <div className="px-4 py-5 sm:px-6">
                            <p className="max-w-2xl text-md text-white">
                                Mid Evaluation Details
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {/* Render selectedProposal details here */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedProposal[0].thesistitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll No
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedProposal[0].rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedProposal[0].stdname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Batch
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedProposal[0].batch}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Semester
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedProposal[0].semester}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            GC Comment Review
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedProposal[0].gcProposalCommentsReview}
                                        </dd>
                                    </div>
                                    {/* Add more fields as needed */}
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading Proposal Evaluation...</div>
            )}

            {/* Examiner Evaluation Section */}
            {selectedProposal ? (
                <div className='flex flex-1 flex-col justify-center items-center px-6 lg:px-8'>
                    <div className="bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                        <div className="px-4 py-5 sm:px-6">
                            <p className="max-w-2xl text-md text-white">
                                Examiners Evaluation
                            </p>
                        </div>
                        <div className="border-t border-gray-200">

                            <dl>
                                {/* Render selectedProposal details here */}
                                {selectedProposal?.map((proposal, index) => (
                                    <>

                                        <div key={index} className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Examiner {index + 1}
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].facultyid}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Examiner Name
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].facname}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Significance
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].significance}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Understanding
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].understanding}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Statement
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].statement}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Rationale
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].rationale}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Timeline
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].timeline}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Bibliography
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].bibliography}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Examiner Comments
                                               </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                    {selectedProposal[index].comments}
                                                </dd>
                                            </div>
                                            {/* Add more fields as needed */}
                                            <hr class="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />

                                        </div>
                                    </>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading Examiner Evaluation...</div>
            )}

            <div className='flex justify-center align-center mx-12'>
                <div className='p-2 w-full'>
                    <div className='w-full px-3'>
                        <button onClick={handleApprove} className="m-4 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            type="button"
                        >
                            Approve
                        </button>
                        <button onClick={handleReject} className="m-4 flex-shrink-0 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-md shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            type="button"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EvaluationDetails;
