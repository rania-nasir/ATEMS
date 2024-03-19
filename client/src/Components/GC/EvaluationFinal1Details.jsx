import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


const EvaluationFinal1Details = () => {
    const [visible, setVisible] = useState(false);
    const [thesisonegrade, setthesisonegrade] = useState(null)

    const [selectedFinal, setSelectedFinal] = useState(null);
    const userId = useParams();

    useEffect(() => {
        const fetchSelectedFinal = async () => {
            try {
                const response = await fetch(`http://localhost:5000/gc/viewPendingFinal/${userId.rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSelectedFinal(data.selectedFinalEvaluation);
                } else {
                    throw new Error('Failed to fetch selected Final1');
                }
            } catch (error) {
                console.error('Error fetching selected Final1:', error);
            }
        };

        fetchSelectedFinal();
    }, [userId]);

    const handlethesisonegradeChange = (event, setthesisonegrade) => {
        // Check if event.target exists and has a value property
        if (event.target && event.target.value) {
            setthesisonegrade(event.target.value);
        }
    };

    const handleApprove = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gc/approveFinalComments/${userId.rollno}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookies.get('jwtoken')}`
                },
                body: JSON.stringify({
                    thesisonegrade
                })
            });

            const data = await response.json();
            if (response.ok) {
                // Proposal approved successfully, update UI or show a success message
                console.log('Final Evaluation approved successfully');
                window.alert(data.message)
                setVisible(false)
            } else {
                // Handle error
                console.error('Failed to approve proposal');
            }
        } catch (error) {
            console.error('Error approving proposal:', error);
        }
    };


    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Confirmation</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Grade" icon="pi pi-check" onClick={handleApprove} />
        </div>
    );

    return (
        <>
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '30rem' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Are you sure you want to grade this?
                </p>
            </Dialog>
            {selectedFinal ? (
                <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
                    <div className="mt-2 bg-teal-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                        <div className="px-4 py-5 sm:px-6">
                            <p className="max-w-2xl text-md text-white">
                                Thesis 1 Final Evaluation Details
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {/* Render selectedFinal details here */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedFinal[0].thesistitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll No
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedFinal[0].rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedFinal[0].stdname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            GC Comment Review
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedFinal[0].gcFinalCommentsReview}
                                        </dd>
                                    </div>
                                    {/* Add more fields as needed */}
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading Thesis 1 Final Evaluation...</div>
            )}

            {/* Examiner Evaluation Section */}
            {selectedFinal ? (
                <>
                    <div className='flex flex-1 flex-col justify-center items-center px-6 lg:px-8'>
                        <div className="bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                            <div className="px-4 py-5 sm:px-6">
                                <p className="max-w-2xl text-md text-white">
                                    Examiners Evaluation
                                </p>
                            </div>
                            <div className="border-t border-gray-200">

                                <dl>
                                    {/* Render selectedFinal details here */}
                                    {selectedFinal.map((proposal, index) => (
                                        <>

                                            <div key={index} className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner {index + 1}
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].facultyid}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner Name
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].facname}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Literature Review Rank
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].literatureReviewRank}
                                                    </dd>
                                                </div>
                                                {selectedFinal[index].literatureReviewRank === "g" && (  // Check if paper1 exists
                                                    <>
                                                        <div className="sm:col-span-3">
                                                            <dt className="text-sm font-medium text-gray-500">
                                                                Paper 1
                                                            </dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                                {selectedFinal[index].paper1}
                                                            </dd>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <dt className="text-sm font-medium text-gray-500">
                                                                Paper 2
                                                            </dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                                {selectedFinal[index].paper2}
                                                            </dd>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Thorough Comparative Analysis
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].comparativeAnalysisThorough}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Research Gap Clearly Identified
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].researchGapClearlyIdentified}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Research Problem Clearly Defined
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].researchProblemClearlyDefined}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Problem Context In Literature
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].problemContextInLiterature}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Proposed Work Evaluation
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].proposedWorkEvaluation}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Understanding Of Solution
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].understandingOfSolution}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Report Quality
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].reportQuality}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Report Organization Acceptable
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].reportOrganizationAcceptable}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Communication Skills
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].communicationSkills}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Questions Handling
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].questionsHandling}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner Comments
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedFinal[index].comments}
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

                    <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>

                        <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">What do you think this evaluation should be graded?</h3>
                        <ul class="grid w-full gap-6 md:grid-cols-2">
                            <li>
                                <input type="radio" id="hosting-A" name="hosting" value='A' class="hidden peer"
                                    checked={thesisonegrade === 'A'}
                                    onChange={(event) => handlethesisonegradeChange(event, setthesisonegrade)} // Pass event and setter function
                                    required />
                                <label for="hosting-A" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-teal-500 peer-checked:border-teal-600 peer-checked:text-teal-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">A</div>
                                        <div class="w-full">Grade A - Excellent</div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                            <li>
                                <input type="radio" id="hosting-F" name="hosting" value='F' class="hidden peer"
                                    checked={thesisonegrade === 'F'}
                                    onChange={(event) => handlethesisonegradeChange(event, setthesisonegrade)} // Pass event and setter function
                                />
                                <label for="hosting-F" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-500 peer-checked:border-red-600 peer-checked:text-red-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">F</div>
                                        <div class="w-full">Grade F - Needs Improvement</div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                        </ul>
                        <div className='my-6'>
                            <button
                                onClick={() => setVisible(true)}
                                className="m-4 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                            >
                                Approve and Assign Grade
                            </button>
                        </div>
                    </div>
                </>

            ) : (
                <div>Loading Thesis 1 Examiner Evaluation...</div>
            )}


        </>
    );
};

export default EvaluationFinal1Details;
