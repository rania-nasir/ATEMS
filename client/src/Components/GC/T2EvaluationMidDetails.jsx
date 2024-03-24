import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Cookies from 'js-cookie';

const T2MidEvaluationDetails = ({ setShowDetails }) => {
    const [selectedMid, setSelectedMid] = useState(null);
    const userId = useParams();

    const [grade, setgrade] = useState("");
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSelectedMid = async () => {
            try {
                const response = await fetch(`http://localhost:5000/gc/viewMid2Evaluation/${userId.rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSelectedMid(data.selectedMidEvaluation);
                } else {
                    throw new Error('Failed to fetch selected Mid1');
                }
            } catch (error) {
                console.error('Error fetching selected Mid1:', error);
            }
        };

        fetchSelectedMid();
    }, [userId]);


    const handlegradeChange = (event, setgrade) => {
        // Check if event.target exists and has a value property
        if (event.target && event.target.value) {
            setgrade(event.target.value);
        }
    };

    const handleApprove = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gc/approveMid2Comments/${userId.rollno}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookies.get('jwtoken')}`
                },
                body: JSON.stringify({ gcapproval: grade })
            });

            const data = await response.json();
            if (response.ok) {
                // Proposal approved successfully, update UI or show a success message
                console.log('Mid Evaluation approved successfully');
                window.alert(data.message)
                setShowDetails(false);
                navigate('/Evaluations')
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
            {selectedMid ? (
                <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
                    <div className="mt-2 bg-teal-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                        <div className="px-4 py-5 sm:px-6">
                            <p className="max-w-2xl text-md text-white">
                                Thesis 2 Mid Evaluation Details
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {/* Render selectedMid details here */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-6">

                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll No
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].stdname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].thesistitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            GC Approval
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].gcapproval}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            View File Report
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].reportfilename}
                                        </dd>
                                    </div>
                                    {/* Add more fields as needed */}
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading Thesis 1 Mid Evaluation...</div>
            )}

            {/* Examiner Evaluation Section */}
            {selectedMid ? (
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
                                    {/* Render selectedMid details here */}
                                    {selectedMid.map((proposal, index) => (
                                        <>

                                            <div key={index} className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner {index + 1}
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].facultyid}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner Name
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].facultyname}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        English Level
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].englishlevel) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Abstract
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].abstract) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Introduction
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].introduction) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Research
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].research) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Literature Review
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].literaturereview) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Research Gap
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].researchgap) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Research Problem
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].researchproblem) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Research Contribution
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].researchcontribution) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Summary
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].summary}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Work Technicality
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].worktechnicality) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Complete Evaluation
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].completeevaluation) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Relevant References
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].relevantrefs) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Format
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].format) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Visuals
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].visuals) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        External Defense
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].externaldefense) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner Comments
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].comments}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Grade
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].grade}
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
                        <ul class="grid w-full gap-6 md:grid-cols-3">
                            <li>
                                <input type="radio" id="hosting-Ready" name="hosting" value='Ready' class="hidden peer"
                                    checked={grade === 'Ready'}
                                    onChange={(event) => handlegradeChange(event, setgrade)} // Pass event and setter function
                                    required />
                                <label for="hosting-Ready" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-teal-500 peer-checked:border-teal-600 peer-checked:text-teal-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">Ready For Defense</div>
                                        <div class="w-full">Student is <p className='font-bold'>ready for defense</p> if he completes the minor changes mentioned</div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                            <li>
                                <input type="radio" id="hosting-CN" name="hosting" value='CN' class="hidden peer"
                                    checked={grade === 'CN'}
                                    onChange={(event) => handlegradeChange(event, setgrade)} // Pass event and setter function
                                    required />
                                <label for="hosting-CN" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-orange-500 peer-checked:border-orange-600 peer-checked:text-orange-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">CN Grade</div>
                                        <div class="w-full">Student is <p className='font-bold'>not ready for defense,</p> however the work is satisfactory and should be given another semester to complete it</div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                            <li>
                                <input type="radio" id="hosting-F" name="hosting" value='F' class="hidden peer"
                                    checked={grade === 'F'}
                                    onChange={(event) => handlegradeChange(event, setgrade)} // Pass event and setter function
                                />
                                <label for="hosting-F" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-500 peer-checked:border-red-600 peer-checked:text-red-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">Grade F</div>
                                        <div class="w-full">Student is to get an <p className='font-bold'>F grade</p></div>
                                    </div>
                                    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </label>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <button className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                                onClick={() => setVisible(true)}
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </>

            ) : (
                <div>Loading Thesis 2 Examiner Evaluation...</div>
            )}


        </>
    );
};

export default T2MidEvaluationDetails;
