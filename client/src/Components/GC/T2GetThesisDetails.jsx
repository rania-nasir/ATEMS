import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Dropdown } from 'primereact/dropdown';
import viewfile from '../../Icons/openfile.png';
import { Toast } from 'primereact/toast';

export default function GetThesisDetails({ setShowDetails }) {

    const toastTopCenter = useRef(null);

    const { thesisid } = useParams();
    const [ThesisData, setThesisData] = useState({ selectedThesis: null, facultyList: [] });

    const [researchArea1, setResearchArea1] = useState('');
    const [researchArea2, setResearchArea2] = useState('');

    console.log('thesisid ==== ', thesisid);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/gc/ReviewRequest/${thesisid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisData(data);
                    console.log('Thesis Data Detail + Faculty List --> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, [thesisid]);

    const [selectedInternal1, setselectedInternal1] = useState(null);
    const [selectedInternal2, setselectedInternal2] = useState(null);

    const selectedValue = ThesisData.facultyList ? ThesisData.facultyList.map(item => ({ label: item.name, value: item.name })) : [];

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };


    const approveData = async (e) => {
        e.preventDefault();

        // Check if any required field is empty
        if (!selectedInternal1 || !selectedInternal2) {
            showMessage('error', 'Please Select the Internals before approving.');
            return; // Exit the function if any field is empty
        }

        if (selectedInternal1 === selectedInternal2) {
            showMessage('error', 'Internals must be different for a thesis.');
            return; // Exit the function if any field is empty
        }

        if (!researchArea1 || !researchArea2) {
            showMessage('error', 'Please mention the Research Area before approving.');
            return; // Exit the function if any field is empty
        }

        const final_internal1 = selectedInternal1;
        const final_internal2 = selectedInternal2;

        const InternalData = {
            final_internal1,
            final_internal2,
            internal1researcharea: researchArea1, // Correct the key names here
            internal2researcharea: researchArea2
        }

        console.log("Internal Data =", InternalData);


        const res = await fetch(`http://localhost:5000/gc/ApproveRequest/${thesisid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify(InternalData)

        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Thesis approved successfully. Email has been send to all respective members") {
                showMessage('success', data.message);
                console.log(data.message);
            } else {
                showMessage('error', data.message);
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
                <div className="mt-2 bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                    <div className="px-4 py-5 sm:px-6">
                        <p className="max-w-2xl text-md text-white">
                            MS Thesis/ project 1 Synopsis Approval Request Details
                        </p>
                    </div>
                    {ThesisData.selectedThesis && (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.thesistitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Potential Areas
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.selectedThesis.potentialareas}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Roll No
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.stdname}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor ID
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.facultyid}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.supervisorname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Internals Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.internals.join(', ')}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Research Areas
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.researcharea.join(', ')}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Proposal File
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 w-[10%]">
                                            <a href={`http://localhost:5000${ThesisData.selectedThesis.fileURL}`} target="_blank" rel="noopener noreferrer" type='application/pdf'>
                                                {/* View Proposal */}
                                                <img width={28} src={viewfile} alt="icon" />
                                            </a>
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
                        {/* Internal 1 dropdown */}
                        <div className="grid grid-cols-2 flex flex-wrap -mx-3">
                            <div className="col-span-1 w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="internal1">
                                    Select Internal 1
                                </label>
                                <Dropdown
                                    value={selectedInternal1}
                                    options={selectedValue}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={(e) => { setselectedInternal1(e.value) }}
                                />
                            </div>
                            {/* Research Area 1 input */}
                            <div className="col-span-1 w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="researcharea1">
                                    Research Area for Internal 1
                                </label>
                                <input
                                    type="text"
                                    id="researcharea1"
                                    name="researcharea1"
                                    value={researchArea1} // Assuming researchArea1 is a state variable
                                    onChange={(e) => setResearchArea1(e.target.value)}
                                    className="mb-6 w-full h-11 bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            </div>
                        </div>
                        {/* Internal 2 dropdown */}
                        <div className="grid grid-cols-2 flex flex-wrap -mx-3">
                            <div className="col-span-1 w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="internal2">
                                    Select Internal 2
                                </label>
                                <Dropdown
                                    value={selectedInternal2}
                                    options={selectedValue}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={(e) => { setselectedInternal2(e.value) }}
                                />
                            </div>
                            {/* Research Area 2 input */}
                            <div className="col-span-1 w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="researcharea2">
                                    Research Area for Internal 2
                                </label>
                                <input
                                    type="text"
                                    id="researcharea2"
                                    name="researcharea2"
                                    value={researchArea2} // Assuming researchArea2 is a state variable
                                    onChange={(e) => setResearchArea2(e.target.value)}
                                    className="mb-6 w-full h-12 bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            </div>
                        </div>
                        {/* Approval/Decline buttons */}
                        <div className="mt-2 w-full flex flex-row gap-3">
                            <div className="flex w-full justify-start">
                                <button className="w-[20%] flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    name='approvedata'
                                    onClick={approveData}
                                >
                                    APPROVE
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
}


