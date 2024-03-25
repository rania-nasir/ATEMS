import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'; // Import useParams hook
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';

const SelectedProposalDetails = ({ setShowDetails }) => {
    const userId = Cookies.get('userId');

    const toastTopCenter = useRef(null);

    const { rollno } = useParams(); // Get rollno from URL params
    const [thesisData, setThesisData] = useState(null);

    // Define state variables for radio button values and textarea value
    const [significance, setSignificance] = useState('');
    const [understanding, setUnderstanding] = useState('');
    const [statement, setStatement] = useState('');
    const [rationale, setRationale] = useState('');
    const [timeline, setTimeline] = useState('');
    const [bibliography, setBibliography] = useState('');
    const [comments, setComments] = useState('');

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    useEffect(() => {
        // Check if rollno is defined before fetching data
        if (rollno) {
            async function fetchData() {
                try {
                    const response = await fetch(`http://localhost:5000/faculty/selectedProposal/${rollno}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${Cookies.get('jwtoken')}`
                        }
                    });
                    const data = await response.json();

                    if (data.message === "Proposal Evaluations are not open yet") {
                        showMessage('info', data.message);
                        console.log(data.message);
                    }
                    if (response.ok) {
                        console.log(data);
                        setThesisData(data);
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                } catch (error) {
                    console.error('Failed to retrieve data: ', error);
                }
            }

            fetchData();
        }
    }, [rollno]);


    // Function to handle radio button change
    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'significance-radio':
                setSignificance(value);
                console.log('significance: ', significance);
                break;
            case 'understanding-radio':
                setUnderstanding(value);
                console.log('understanding: ', understanding);
                break;
            case 'statement-radio':
                setStatement(value);
                console.log('statement: ', statement);
                break;
            case 'rationale-radio':
                setRationale(value);
                console.log('rationale: ', rationale);
                break;
            case 'timeline-radio':
                setTimeline(value);
                console.log('timeline: ', timeline);
                break;
            case 'bibliography-radio':
                setBibliography(value);
                console.log('bibliography: ', bibliography);
                break;
            default:
                break;
        }
        console.log(rationale);
    };

    // Function to handle textarea change
    const handleTextareaChange = (e) => {
        setComments(e.target.value);
    };

    const submitEvaluation = async (e) => {
        e.preventDefault();

        // Check if any required field is empty
        if (!significance || !understanding || !statement || !rationale || !timeline || !bibliography || !comments) {
            showMessage('error', 'Please fill in thesis all required fields');
            return;
        }


        try {
            // Check if thesisData is not null before accessing its properties
            if (thesisData && thesisData.student) {
                // Fetch faculty data based on userId
                const facultyResponse = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (facultyResponse.ok) {
                    const facultyData = await facultyResponse.json();
                    const facultyName = facultyData.name; // Extract faculty name from response data
                    console.log('facultyData: ', facultyData)

                    const response = await fetch(`http://localhost:5000/faculty/evaluateProposal/${rollno}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${Cookies.get('jwtoken')}`
                        },
                        body: JSON.stringify({
                            rollno,
                            stdname: thesisData.student.name,
                            batch: thesisData.student.batch,
                            semester: thesisData.student.semester,
                            thesistitle: thesisData.thesis.thesistitle,
                            facultyid: userId,
                            facname: facultyName, // Assign faculty name to facname
                            significance,
                            understanding,
                            statement,
                            rationale,
                            timeline,
                            bibliography,
                            comments
                        })
                    });

                    const data = await response.json();

                    if (response.status === 200) {
                        if (data.message === "Proposal evaluation and feedback updated successfully" || data.message === "Proposal evaluation and feedback stored successfully") {
                            showMessage('success', data.message);
                            console.log(data.message);
                        } else {
                            showMessage('error', data.message);
                            console.log(data.message);
                        }
                    } else {
                        showMessage('info', data.message);
                        console.log("info", data);
                    }
                } else {
                    throw new Error('Failed to fetch faculty data');
                }
            } else {
                console.error('thesisData or thesisData.student is null or undefined');
            }
        } catch (error) {
            console.error('System Error! Please try later', error);
        }
    };


    // Check if thesisData is null before rendering
    if (!thesisData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
                <div className="w-full my-2">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Proposal Defense Evaluation Form
                    </h2>
                </div>
                {thesisData && (
                    <div className="mt-6 sm:mx-auto">
                        <form className="sm:mx-auto" enctype="multipart/form-data">
                            <div className='grid grid-cols-3'>
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                            for="grid-first-name">
                                            Roll Number
                                        </label>
                                        <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-first-name" type="text" placeholder="20F-1234" value={thesisData.student?.rollno} />
                                    </div>
                                </div>
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            Student Name
                                        </label>
                                        <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-first-name" type="text" placeholder="Muhammad Ahmad" value={thesisData.student?.name} />
                                    </div>
                                </div>
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            Batch
                                        </label>
                                        <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-first-name" type="text" placeholder="3.16" value={thesisData.student?.batch} />
                                    </div>
                                </div>
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            Semester
                                        </label>
                                        <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-first-name" type="text" placeholder="7" value={thesisData.student?.semester} />
                                    </div>
                                </div>
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            Supervisor ID
                                        </label>
                                        <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-first-name" type="text" placeholder="1234" value={thesisData.thesis?.facultyid} />
                                    </div>
                                </div>
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            Supervisor Name
                                        </label>
                                        <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-first-name" type="text" placeholder="M. Fayyaz" value={thesisData.thesis?.supervisorname} />
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2'>
                                <div className='p-2 col-span-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                            Title of Thesis
                                        </label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            value={thesisData.thesis?.thesistitle}
                                            required
                                            type="synopsistitle"
                                            name="synopsistitle"
                                            placeholder="Thesis Title Here.." />
                                    </div>
                                </div>

                                <h3
                                    className="col-span-1 mx-4 mt-6 font-semibold text-gray-900 dark:text-white">Please choose one applicable criteria from the option:</h3>

                                <div className='col-span-2 grid grid-cols-2 m-4'
                                >
                                    <h3
                                        className="col-span-1 p-4 font-medium text-gray-900 dark:text-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">1. Significance and importance of research problem</h3>

                                    <ul
                                        className="col-span-1 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input
                                                    id="horizontal-list-radio-significance-satisfactory"
                                                    type="radio"
                                                    value="Satisfactory"
                                                    name="significance-radio"
                                                    onChange={handleRadioChange}
                                                    checked={significance === 'Satisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-significance-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input
                                                    id="horizontal-list-radio-significance-unsatisfactory"
                                                    type="radio"
                                                    name="significance-radio"
                                                    value="Unsatisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={significance === 'Unsatisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-significance-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input
                                                    id="horizontal-list-radio-significance-notApprove"
                                                    type="radio"
                                                    name="significance-radio"
                                                    value="Not Approved"
                                                    onChange={handleRadioChange}
                                                    checked={significance === 'Not Approved'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-significance-notApprove" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                            </div>
                                        </li>
                                    </ul>
                                    {/* --------------------- */}
                                    <h3
                                        className="col-span-1 p-4 font-medium text-gray-900 dark:text-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">2. Understanding of research domain and background</h3>

                                    <ul
                                        className="col-span-1 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input
                                                    id="horizontal-list-radio-understanding-satisfactory"
                                                    type="radio"
                                                    name="understanding-radio"
                                                    value="Satisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={understanding === 'Satisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-understanding-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-understanding-unsatisfactory"
                                                    type="radio"
                                                    name="understanding-radio"
                                                    value="Unsatisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={understanding === 'Unsatisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-understanding-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-understanding-notApproved"
                                                    type="radio"
                                                    name="understanding-radio"
                                                    value="Not Approved"
                                                    onChange={handleRadioChange}
                                                    checked={understanding === 'Not Approved'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-understanding-notApproved" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                            </div>
                                        </li>
                                    </ul>
                                    {/* -------------------------- */}
                                    <h3
                                        className="col-span-1 p-4 font-medium text-gray-900 dark:text-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">3. Statement of research problem</h3>

                                    <ul
                                        className="col-span-1 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-statement-satisfactory"
                                                    type="radio"
                                                    name="statement-radio"
                                                    value="Satisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={statement === 'Satisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-statement-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-statement-unsatisfactory"
                                                    type="radio"
                                                    name="statement-radio"
                                                    value="Unsatisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={statement === 'Unsatisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-statement-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-statement-notApprove"
                                                    type="radio"
                                                    name="statement-radio"
                                                    value="Not Approved"
                                                    onChange={handleRadioChange}
                                                    checked={statement === 'Not Approved'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-statement-notApprove" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                            </div>
                                        </li>
                                    </ul>
                                    {/* ------------------------------ */}
                                    <h3
                                        className="col-span-1 p-4 font-medium text-gray-900 dark:text-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">4. Rationale for selection of research topic</h3>

                                    <ul
                                        className="col-span-1 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-rationale-satisfactory"
                                                    type="radio" name="rationale-radio"
                                                    value="Satisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={rationale === 'Satisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-rationale-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-rationale-unsatisfactory"
                                                    type="radio"
                                                    name="rationale-radio"
                                                    value="Unsatisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={rationale === 'Unsatisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-rationale-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-rationale-notApprove"
                                                    type="radio"
                                                    name="rationale-radio"
                                                    value="Not Approved"
                                                    onChange={handleRadioChange}
                                                    checked={rationale === 'Not Approved'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-rationale-notApprove" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                            </div>
                                        </li>
                                    </ul>
                                    {/* -------------- */}
                                    <h3
                                        className="col-span-1 p-4 font-medium text-gray-900 dark:text-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">5. Timeline and research plan</h3>

                                    <ul
                                        className="col-span-1 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-timeline-satisfactory"
                                                    type="radio"
                                                    name="timeline-radio"
                                                    value="Satisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={timeline === 'Satisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-timeline-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-timeline-unsatisfactory"
                                                    type="radio"
                                                    name="timeline-radio"
                                                    value="Unsatisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={timeline === 'Unsatisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-timeline-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-timeline-notApprove"
                                                    type="radio"
                                                    name="timeline-radio"
                                                    value="Not Approved"
                                                    onChange={handleRadioChange}
                                                    checked={timeline === 'Not Approved'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-timeline-notApprove" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                            </div>
                                        </li>
                                    </ul>
                                    {/* --------------------------- */}
                                    <h3
                                        className="col-span-1 p-4 font-medium text-gray-900 dark:text-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">6. Bibliography is appropriate</h3>

                                    <ul
                                        className="col-span-1 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-bibliography-satisfactory"
                                                    type="radio"
                                                    name="bibliography-radio"
                                                    value="Satisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={bibliography === 'Satisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-bibliography-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-bibliography-unsatisfactory"
                                                    type="radio"
                                                    name="bibliography-radio"
                                                    value="Unsatisfactory"
                                                    onChange={handleRadioChange}
                                                    checked={bibliography === 'Unsatisfactory'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-bibliography-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input id="horizontal-list-radio-bibliography-notApprove"
                                                    type="radio"
                                                    name="bibliography-radio"
                                                    value="Not Approved"
                                                    onChange={handleRadioChange}
                                                    checked={bibliography === 'Not Approved'}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                <label for="horizontal-list-radio-bibliography-notApprove" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                            </div>
                                        </li>
                                    </ul>

                                    <h3
                                        className="col-span-2 mb-2 mt-8 font-semibold text-gray-900 dark:text-white">Detailed Comments(mandatory):</h3>

                                    <textarea className="col-span-2 appearance-none h-64 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        value={comments}
                                        onChange={handleTextareaChange}
                                        required
                                        id="comment"
                                        name="comment"
                                        type="comment"
                                        placeholder="Detailed comments here...."
                                    >
                                    </textarea>
                                </div>

                            </div>
                            <div className="m-2 px-3">
                                <button className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    onClick={submitEvaluation}>
                                    Submit Evaluation
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
export default SelectedProposalDetails;