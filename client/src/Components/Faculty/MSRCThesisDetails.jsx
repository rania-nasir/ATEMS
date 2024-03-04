// MSRCThesisDetails.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Card } from 'primereact/card';

export default function MSRCThesisDetails() {

    const navigate = useNavigate();

    const { thesisid } = useParams();
    const [ThesisData, setThesisData] = useState({ selectedThesis: null });
    const [comment, setcomment] = useState('');


    console.log('thesisid ==== ', thesisid);

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/msrcThesisDetails/${thesisid}`, {
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
    }, [thesisid]);

    const handleInputs = (e) => {
        setcomment(e.target.value);
    };

    const PostFeedbackData = async (e) => {
        e.preventDefault();

        console.log('Feedback: ', comment);

        const res = await fetch(`http://localhost:5000/faculty/msrcSubmitFeedback/${thesisid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify({ comment })

        });

        const data = await res.json();
        console.log("Response data:- ", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Feedback Submitted Successfully");
                console.log("Feedback Submitted Successfully");
                navigate('/');
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
                            Thesis Registration Synopsis Request Details
                        </p>
                    </div>
                    {ThesisData.selectedThesis && (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis ID:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.thesisid}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.thesistitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll Number
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {ThesisData.selectedThesis.rollno}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Supervisor ID:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.facultyid}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Internal 1:
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {/* {ThesisData.selectedThesis.thesistitle} */}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Internal 2:
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {/* {ThesisData.selectedThesis.rollno} */}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Status
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.gcapproval}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Potential Areas
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {ThesisData.selectedThesis.potentialareas}
                                        </dd>
                                    </div>
                                    {/* Display file URL */}
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Proposal File
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            <a href={`http://localhost:5000${ThesisData.selectedThesis.fileURL}`} target="_blank" rel="noopener noreferrer" type='application/pdf'>
                                                View Proposal
                                            </a>
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                    )}
                </div>
            </div>

            <hr class="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            <div className='flex justify-center align-center mx-12'>
                <div className='p-2 w-full'>
                    <div className='w-full px-3'>
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Feedback
                        </label>
                        <textarea class="appearance-none h-64 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            value={comment}
                            onChange={handleInputs}
                            required
                            id="comment"
                            name="comment"
                            type="comment"
                            placeholder="Feedback Content here..."
                        >
                        </textarea>
                        <button className="my-4 block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        type="button"
                        onClick={PostFeedbackData}>
                        Submit Feedback
                    </button>
                    </div>
                    
                </div>
            </div>

        </>
    );
}


