import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';

const SelectedFinal1Details = ({ setShowDetails }) => {
    const thesisId = useParams().thesisId;
    const userId = Cookie.get('userId');

    const toastTopCenter = useRef(null);

    const [thesisDetails, setThesisDetails] = useState({});
    const [studentDetails, setStudentDetails] = useState({});
    const [comment, setComment] = useState("");
    const [literaturereviewrank, setliteraturereviewrank] = useState("");
    const [paper1, setPaper1] = useState("");
    const [paper2, setPaper2] = useState("");
    const [comparativeanalysisthorough, setcomparativeAnalysisThorough] = useState("");
    const [researchgapclearlyidentified, setresearchgapclearlyidentified] = useState("");
    const [researchproblemclearlydefined, setresearchproblemclearlydefined] = useState("");
    const [problemcontextinliterature, setproblemcontextinliterature] = useState("");
    const [understandingofsolution, setunderstandingofsolution] = useState("");
    const [proposedworkevaluation, setproposedworkevaluation] = useState("")
    const [reportquality, setreportquality] = useState("")
    const [reportorganizationacceptable, setreportorganizationacceptable] = useState("")
    const [communicationskills, setcommunicationskills] = useState("")
    const [questionshandling, setquestionshandling] = useState("")

    // Handle radio input changes
    const handleRadioChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    };

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    // Retrieve thesis and student details from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/faculty/viewSelectedFinalExaminableThesis/${thesisId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setThesisDetails(data.thesisDetails);
                setStudentDetails(data.studentDetails);
                console.log("data : ", data.message)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
        // event.preventDefault();
        try {

            if (!literaturereviewrank || !comparativeanalysisthorough || !researchgapclearlyidentified || !researchproblemclearlydefined || !problemcontextinliterature || !understandingofsolution || !proposedworkevaluation || !reportquality || !reportorganizationacceptable || !communicationskills || !questionshandling || !comment) {
                showMessage('error', 'Please fill in all the fields before submitting.');
                return;
            }

            if (literaturereviewrank === 'g' && !paper1 && !paper2) {
                showMessage('error', 'Please fill in the paper before submitting.');
                return; // Exit the function if any field is empty
            }

            const facultyResponse = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                }
            });

            if (facultyResponse.ok) {
                const facultyData = await facultyResponse.json();
                const facultyName = facultyData.name; // Extract faculty name from response data
                console.log('facultyData: ', facultyData)

                const response = await fetch('http://localhost:5000/faculty/evaluateSelectedThesisFinal', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    },
                    body: JSON.stringify({
                        rollno: studentDetails.rollno,
                        stdname: studentDetails.name,
                        batch: studentDetails.batch,
                        semester: studentDetails.semester,
                        thesistitle: thesisDetails.thesistitle,
                        facultyid: userId,
                        facname: facultyName,
                        literaturereviewrank,
                        paper1: literaturereviewrank === 'g' ? paper1 : null,
                        paper2: literaturereviewrank === 'g' ? paper2 : null,
                        comparativeanalysisthorough,
                        researchgapclearlyidentified,
                        researchproblemclearlydefined,
                        problemcontextinliterature,
                        understandingofsolution,
                        proposedworkevaluation,
                        reportquality,
                        reportorganizationacceptable,
                        communicationskills,
                        questionshandling,
                        comments: comment
                    })
                });

                const data = await response.json()
                if (!response.ok) {
                    throw new Error('Failed to submit evaluation');
                }
                // Handle successful submission, e.g., show a success message
                console.log(data);
                if (data.message === "Final evaluation and feedback stored successfully") {
                    showMessage('success', data.message);
                    setTimeout(function () {
                        setShowDetails(false);
                    }, 3000);
                }
                else {
                    showMessage('info', data.message);
                }
                console.log('Evaluation submitted successfully');
            } else {
                throw new Error('Failed to fetch faculty data');
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };


    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
                <div className="w-full my-2">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis 1 Final Evaluation Form
                    </h2>
                </div>
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
                                        id="grid-first-name" type="text" placeholder="20F-1234"
                                        value={thesisDetails.rollno}
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Student Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad"
                                        value={studentDetails.name}
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Batch
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="3.16"
                                        value={studentDetails.batch}
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Semester
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="7"
                                        value={studentDetails.semester}
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Credit Hours
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="M. Fayyaz"
                                        value={studentDetails.credithours}
                                    />
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
                                        required
                                        value={thesisDetails.thesistitle}
                                        type="synopsistitle"
                                        name="synopsistitle"
                                        placeholder="Thesis Title Here.." />
                                </div>
                            </div>
                            <div className='m-6 col-span-2'>
                                <div className="my-2 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                                    <div className="px-4 py-5 sm:px-6">
                                        <p className="max-w-2xl text-md text-white">
                                            Quality of Literature Review</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">1. How would you rank the quality of literature review conducted by the student?</h3>
                                                <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={literaturereviewrank === "e"}
                                                                onChange={(e) => handleRadioChange(e, setliteraturereviewrank)}
                                                                id="list-radio-comprehensive" type="radio" value="e" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-comprehensive" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The Literature review is comprehensive with little or no choice of any significance work missing from the coverage</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={literaturereviewrank === "f"}
                                                                onChange={(e) => handleRadioChange(e, setliteraturereviewrank)}
                                                                id="list-radio-Good" type="radio" value="f" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The literature review is Good with all the major works identified. Some works might be missing, but they would probably have no major impact on the identified research gap</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3 grid grid-cols-2">
                                                            <div className='col-span-2'>
                                                                <input checked={literaturereviewrank === "g"}
                                                                    onChange={(e) => handleRadioChange(e, setliteraturereviewrank)}
                                                                    id="list-radio-missing" type="radio" value="g" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="list-radio-missing" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">c. The literature review is missing a number of significant papers</label>

                                                            </div>
                                                            <div className='px-8 py-4 col-span-2 w-[80%] grid grid-cols-1 gap-2'>
                                                                <input type='text' placeholder='Paper 1' value={paper1}
                                                                    onChange={(e) => setPaper1(e.target.value)}
                                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                                                <input type='text' placeholder='Paper 2' value={paper2}
                                                                    onChange={(e) => setPaper2(e.target.value)}
                                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={literaturereviewrank === "h"}
                                                                onChange={(e) => handleRadioChange(e, setliteraturereviewrank)}
                                                                id="list-radio-poor" type="radio" value="h" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-poor" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The literature review is poor with a majority of litteratue not covered</label>
                                                        </div>
                                                    </li>
                                                </ul>

                                                {/* Add more fields as needed */}

                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">2. Is the comparative analysis of the literature work thorough?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchgapclearlyidentified-Good" type="radio" value="Good" checked={researchgapclearlyidentified === "Good"} onChange={(e) => setresearchgapclearlyidentified(e.target.value)} name="list-radio-researchgapclearlyidentified" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchgapclearlyidentified-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchgapclearlyidentified-Average" type="radio" value="Average" checked={researchgapclearlyidentified === "Average"} onChange={(e) => setresearchgapclearlyidentified(e.target.value)} name="list-radio-researchgapclearlyidentified" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchgapclearlyidentified-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchgapclearlyidentified-Bad" type="radio" value="Bad" checked={researchgapclearlyidentified === "Bad"} onChange={(e) => setresearchgapclearlyidentified(e.target.value)} name="list-radio-researchgapclearlyidentified" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchgapclearlyidentified-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>

                                                {/* Add more fields as needed */}

                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">3. Is the rearch gap in the field is clearly identified?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-comparativeanalysisthorough-Good" type="radio" value="Good" checked={comparativeanalysisthorough === "Good"} onChange={(e) => setcomparativeAnalysisThorough(e.target.value)} name="list-radio-comparativeanalysisthorough" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-comparativeanalysisthorough-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-comparativeanalysisthorough-Average" type="radio" value="Average" checked={comparativeanalysisthorough === "Average"} onChange={(e) => setcomparativeAnalysisThorough(e.target.value)} name="list-radio-comparativeanalysisthorough" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-comparativeanalysisthorough-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-comparativeanalysisthorough-Bad" type="radio" value="Bad" checked={comparativeanalysisthorough === "Bad"} onChange={(e) => setcomparativeAnalysisThorough(e.target.value)} name="list-radio-comparativeanalysisthorough" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-comparativeanalysisthorough-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                                <div className="my-6 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                                    <div className="px-4 py-5 sm:px-6">
                                        <p className="max-w-2xl text-md text-white">
                                            Student's undertanding of the problem</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">4. Is the rearch problem is clearly defined?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchproblemclearlydefined-Good" type="radio" value="Good" checked={researchproblemclearlydefined === "Good"} onChange={(e) => setresearchproblemclearlydefined(e.target.value)} name="list-radio-researchproblemclearlydefined" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchproblemclearlydefined-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchproblemclearlydefined-Average" type="radio" value="Average" checked={researchproblemclearlydefined === "Average"} onChange={(e) => setresearchproblemclearlydefined(e.target.value)} name="list-radio-researchproblemclearlydefined" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchproblemclearlydefined-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchproblemclearlydefined-Bad" type="radio" value="Bad" checked={researchproblemclearlydefined === "Bad"} onChange={(e) => setresearchproblemclearlydefined(e.target.value)} name="list-radio-researchproblemclearlydefined" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchproblemclearlydefined-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>

                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">5. Is the identified rearch problem clearly placed in context with the literature?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-problemcontextinliterature-Good" type="radio" value="Good" checked={problemcontextinliterature === "Good"} onChange={(e) => setproblemcontextinliterature(e.target.value)} name="list-radio-problemcontextinliterature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-problemcontextinliterature-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-problemcontextinliterature-Average" type="radio" value="Average" checked={problemcontextinliterature === "Average"} onChange={(e) => setproblemcontextinliterature(e.target.value)} name="list-radio-problemcontextinliterature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-problemcontextinliterature-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-problemcontextinliterature-Bad" type="radio" value="Bad" checked={problemcontextinliterature === "Bad"} onChange={(e) => setproblemcontextinliterature(e.target.value)} name="list-radio-problemcontextinliterature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-problemcontextinliterature-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                {/* Add more fields as needed */}
                                            </div>

                                        </dl>
                                    </div>
                                </div>
                                <div className="my-2 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                                    <div className="px-4 py-5 sm:px-6">
                                        <p className="max-w-2xl text-md text-white">
                                            Student's understanding of the solution to the identified problem</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">

                                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">6. How would you rate student's understanding of the solution?</h3>
                                                <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={understandingofsolution === "e"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingofsolution)}
                                                                id="list-radio-understandingofsolution-noidea" type="radio" value="e" name="list-radio-understandingofsolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingofsolution-noidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The student has no idea about the solution</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={understandingofsolution === "f"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingofsolution)}
                                                                id="list-radio-understandingofsolution-someidea" type="radio" value="f" name="list-radio-understandingofsolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingofsolution-someidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The student has some idea about the solution and needs refinement</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={understandingofsolution === "g"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingofsolution)}
                                                                id="list-radio-understandingofsolution-highidea" type="radio" value="g" name="list-radio-understandingofsolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingofsolution-highidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">c. The student has a high level idea about the solution</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={understandingofsolution === "h"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingofsolution)}
                                                                id="list-radio-understandingofsolution-clearidea" type="radio" value="h" name="list-radio-understandingofsolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingofsolution-clearidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The student has a clear idea about the solution to start the work</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">7. Is the student familiar with how to evaluate his proposed work?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-proposedworkevaluation-Good" type="radio" value="Good" checked={proposedworkevaluation === "Good"} onChange={(e) => setproposedworkevaluation(e.target.value)} name="list-radio-proposedworkevaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-proposedworkevaluation-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-proposedworkevaluation-Average" type="radio" value="Average" checked={proposedworkevaluation === "Average"} onChange={(e) => setproposedworkevaluation(e.target.value)} name="list-radio-proposedworkevaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-proposedworkevaluation-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-proposedworkevaluation-Bad" type="radio" value="Bad" checked={proposedworkevaluation === "Bad"} onChange={(e) => setproposedworkevaluation(e.target.value)} name="list-radio-proposedworkevaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-proposedworkevaluation-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                {/* Add more fields as needed */}
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div className="my-6 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                                    <div className="px-4 py-5 sm:px-6">
                                        <p className="max-w-2xl text-md text-white">
                                            Quality of report</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">8. Is the English of sufficient quality for an MS Thesis?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-reportquality-Good" type="radio" value="Good" checked={reportquality === "Good"} onChange={(e) => setreportquality(e.target.value)} name="list-radio-reportquality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-reportquality-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-reportquality-Average" type="radio" value="Average" checked={reportquality === "Average"} onChange={(e) => setreportquality(e.target.value)} name="list-radio-reportquality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-reportquality-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-reportquality-Bad" type="radio" value="Bad" checked={reportquality === "Bad"} onChange={(e) => setreportquality(e.target.value)} name="list-radio-reportquality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-reportquality-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>

                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">9. Is the organization of the thesis acceptable?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-reportorganizationacceptable-Good" type="radio" value="Good" checked={reportorganizationacceptable === "Good"} onChange={(e) => setreportorganizationacceptable(e.target.value)} name="list-radio-reportorganizationacceptable" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-reportorganizationacceptable-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-reportorganizationacceptable-Average" type="radio" value="Average" checked={reportorganizationacceptable === "Average"} onChange={(e) => setreportorganizationacceptable(e.target.value)} name="list-radio-reportorganizationacceptable" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-reportorganizationacceptable-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-reportorganizationacceptable-Bad" type="radio" value="Bad" checked={reportorganizationacceptable === "Bad"} onChange={(e) => setreportorganizationacceptable(e.target.value)} name="list-radio-reportorganizationacceptable" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-reportorganizationacceptable-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                {/* Add more fields as needed */}
                                            </div>

                                        </dl>
                                    </div>
                                </div>


                                <div className="my-6 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                                    <div className="px-4 py-5 sm:px-6">
                                        <p className="max-w-2xl text-md text-white">
                                            Presentation</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">10. Is the student able to communication his work well?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-communicationskills-Good" type="radio" value="Good" checked={communicationskills === "Good"} onChange={(e) => setcommunicationskills(e.target.value)} name="list-radio-communicationskills" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-communicationskills-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-communicationskills-Average" type="radio" value="Average" checked={communicationskills === "Average"} onChange={(e) => setcommunicationskills(e.target.value)} name="list-radio-communicationskills" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-communicationskills-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-communicationskills-Bad" type="radio" value="Bad" checked={communicationskills === "Bad"} onChange={(e) => setcommunicationskills(e.target.value)} name="list-radio-communicationskills" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-communicationskills-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>

                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">11. Did the student handled the Question/Answer session well?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-questionshandling-Good" type="radio" value="Good" checked={questionshandling === "Good"} onChange={(e) => setquestionshandling(e.target.value)} name="list-radio-questionshandling" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-questionshandling-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-questionshandling-Average" type="radio" value="Average" checked={questionshandling === "Average"} onChange={(e) => setquestionshandling(e.target.value)} name="list-radio-questionshandling" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-questionshandling-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-questionshandling-Bad" type="radio" value="Bad" checked={questionshandling === "Bad"} onChange={(e) => setquestionshandling(e.target.value)} name="list-radio-questionshandling" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-questionshandling-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                {/* Add more fields as needed */}
                                            </div>

                                        </dl>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='m-6'>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Comments and Suggestions:</h3>

                            <textarea className="appearance-none h-64 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"

                                required
                                id="comment"
                                name="comment"
                                type="comment"
                                placeholder="Comments and suggestions here...."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            >
                            </textarea>
                        </div>
                        <div className="m-2 px-4">
                            <button className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                                onClick={() => handleSubmit()}>
                                Submit Evaluation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SelectedFinal1Details;