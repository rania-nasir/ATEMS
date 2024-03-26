import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';

const SelectedMid1Details = ({ setShowDetails }) => {
    const thesisId = useParams().thesisId;
    const userId = Cookie.get('userId');

    const toastTopCenter = useRef(null);

    const [thesisDetails, setThesisDetails] = useState({});
    const [studentDetails, setStudentDetails] = useState({});
    const [comment, setComment] = useState("");
    const [literatureReviewRank, setLiteratureReviewRank] = useState("");
    const [paper1, setPaper1] = useState("");
    const [paper2, setPaper2] = useState("");
    const [problemGapIdentified, setProblemGapIdentified] = useState("");
    const [problemClearlyDefined, setProblemClearlyDefined] = useState("");
    const [problemPlacement, setProblemPlacement] = useState("");
    const [solutionUnderstanding, setSolutionUnderstanding] = useState("");

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
                const response = await fetch(`http://localhost:5000/faculty/viewSelectedExaminableThesis/${thesisId}`, {
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
                console.log("data : ", data)
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

            // Check if any required field is empty
            if (!literatureReviewRank || !problemGapIdentified || !problemClearlyDefined || !problemPlacement || !solutionUnderstanding || !comment) {
                showMessage('error', 'Please fill in all the fields before submitting.');
                return; // Exit the function if any field is empty
            }

            if (literatureReviewRank === 'c' && !paper1 && !paper2) {
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

                const response = await fetch('http://localhost:5000/faculty/evaluateSelectedThesisMid', {
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
                        literatureReviewRank,
                        paper1: literatureReviewRank === 'c' ? paper1 : null,
                        paper2: literatureReviewRank === 'c' ? paper2 : null,
                        problemGapIdentified,
                        problemClearlyDefined,
                        problemPlacement,
                        solutionUnderstanding,
                        comments: comment
                    })
                });

                // Await the response.json() call
                const data = await response.json(); // Add 'await' here

                if (!response.ok) {
                    throw new Error('Failed to submit evaluation');
                }
                // Handle successful submission, e.g., show a success message
                console.log(data);
                if (data.message === "Mid evaluation and feedback stored successfully") {
                    showMessage('success', data.message);
                    setTimeout(() => {
                        setShowDetails(false);
                    }, 3000);
                    console.log('Evaluation submitted successfully');
                }
                else {
                    showMessage('info', data.message);
                }

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
                        MS Thesis 1 Mid Evaluation Form
                    </h2>
                </div>
                <div className="my-4 sm:mx-auto">
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
                                        Supervisor Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="M. Fayyaz"
                                        value={thesisDetails.supervisorname}
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
                                                            <input checked={literatureReviewRank === "a"}
                                                                onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
                                                                id="list-radio-comprehensive" type="radio" value="a" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-comprehensive" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The Literature review is comprehensive with little or no choice of any significance work missing from the coverage</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={literatureReviewRank === "b"}
                                                                onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
                                                                id="list-radio-good" type="radio" value="b" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The literature review is good with all the major works identified. Some works might be missing, but they would probably have no major impact on the identified research gap</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3 grid grid-cols-2">
                                                            <div className='col-span-2'>
                                                                <input checked={literatureReviewRank === "c"}
                                                                    onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
                                                                    id="list-radio-missing" type="radio" value="c" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                                                            <input checked={literatureReviewRank === "d"}
                                                                onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
                                                                id="list-radio-poor" type="radio" value="d" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-poor" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The literature review is poor with a majority of litteratue not covered</label>
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
                                            Student's undertanding of the problem</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                                <div>
                                                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">2. Is the research gap in the field clearly identified?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-2-yes" type="radio" value="yes" checked={problemGapIdentified === "yes"} onChange={(e) => setProblemGapIdentified(e.target.value)} name="list-radio-2" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-2-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-2-no" type="radio" value="no" checked={problemGapIdentified === "no"} onChange={(e) => setProblemGapIdentified(e.target.value)} name="list-radio-2" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-2-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">3. Is the research problem clearly defined?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-3-yes" type="radio" value="yes" checked={problemClearlyDefined === "yes"} onChange={(e) => setProblemClearlyDefined(e.target.value)} name="list-radio-3" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-3-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-3-no" type="radio" value="no" checked={problemClearlyDefined === "no"} onChange={(e) => setProblemClearlyDefined(e.target.value)} name="list-radio-3" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-3-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">4. Is the identified research problem clearly placed in context with the literature?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-4-yes" type="radio" value="yes" checked={problemPlacement === "yes"} onChange={(e) => setProblemPlacement(e.target.value)} name="list-radio-4" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-4-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-4-no" type="radio" value="no" checked={problemPlacement === "no"} onChange={(e) => setProblemPlacement(e.target.value)} name="list-radio-4" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-4-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {/* Add more fields as needed */}
                                            </div>

                                        </dl>
                                    </div>
                                </div>
                                <div className="my-2 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                                    <div className="px-4 py-5 sm:px-6">
                                        <p className="max-w-2xl text-md text-white">
                                            Student's understanding of the solution</p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:px-6">

                                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">5. How would you rate the student's understanding of the solution?</h3>
                                                <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="list-radio-noidea" type="radio" value="a"  // 'a' corresponds to the first option
                                                                onChange={(e) => setSolutionUnderstanding(e.target.value)} name="list-radio-solution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-noidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The student has no idea about the solution</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="list-radio-someidea" type="radio" value="b"
                                                                onChange={(e) => setSolutionUnderstanding(e.target.value)} name="list-radio-solution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-someidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The student has some idea about the solution and needs refinement</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="list-radio-highidea" type="radio" value="c"
                                                                onChange={(e) => setSolutionUnderstanding(e.target.value)} name="list-radio-solution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-highidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">c. The student has a high level idea about the solution</label>

                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="list-radio-clearidea" type="radio" value="d"
                                                                onChange={(e) => setSolutionUnderstanding(e.target.value)} name="list-radio-solution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-clearidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The student has clear idea about the solution to start the work</label>
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

export default SelectedMid1Details;




















// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import Cookie from 'js-cookie';

// const SelectedMid1Details = () => {
//     const thesisId = useParams().thesisId;

//     const [literatureReviewRank, setLiteratureReviewRank] = useState("");
//     const [paper1, setPaper1] = useState("");
//     const [paper2, setPaper2] = useState("");
//     const [problemGapIdentified, setProblemGapIdentified] = useState("");
//     const [problemClearlyDefined, setProblemClearlyDefined] = useState("");
//     const [problemPlacement, setProblemPlacement] = useState("");
//     const [solutionUnderstanding, setSolutionUnderstanding] = useState("");

//     // Handle radio input changes
//     const handleRadioChange = (event, setStateFunction) => {
//         setStateFunction(event.target.value);
//     };


//     // Handle form submission
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await fetch('/submitEvaluation', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${Cookies.get('token')}`
//                 },
//                 body: JSON.stringify({
//                     literatureReviewRank,
//                     paper1,
//                     paper2,
//                     problemGapIdentified,
//                     problemClearlyDefined,
//                     problemPlacement,
//                     solutionUnderstanding,
//                 })
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to submit evaluation');
//             }
//             // Handle successful submission, e.g., show a success message
//             console.log('Evaluation submitted successfully');
//         } catch (error) {
//             console.error('Error submitting evaluation:', error);
//         }
//     };


//     return (
//         <>
//             <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//                 <div className="mt-6 sm:mx-auto">
//                     <form className="sm:mx-auto" enctype="multipart/form-data">
//                         <div className='grid grid-cols-2'>
//                             <div className='m-6 col-span-2'>
//                                 <div className="my-2 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
//                                     <div className="px-4 py-5 sm:px-6">
//                                         <p className="max-w-2xl text-md text-white">
//                                             Quality of Literature Review</p>
//                                     </div>
//                                     <div className="border-t border-gray-200">
//                                         <dl>
//                                             <div className="bg-gray-50 px-4 py-5 sm:px-6">
//                                                 <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">1. How would you rank the quality of literature review conducted by the student?</h3>
//                                                 <ul class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input checked={literatureReviewRank === "a"}
//                                                                 onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
//                                                                 id="list-radio-comprehensive" type="radio" value="" name="list-radio-literature" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-comprehensive" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The Literature review is comprehensive with little or no choice of any significance work missing from the coverage</label>
//                                                         </div>
//                                                     </li>
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input checked={literatureReviewRank === "b"}
//                                                                 onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
//                                                                 id="list-radio-good" type="radio" value="" name="list-radio-literature" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-good" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The literature review is good with all the major works identified. Some works might be missing, but they would probably have no major impact on the identified research gap</label>
//                                                         </div>
//                                                     </li>
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3 grid grid-cols-2">
//                                                             <div className='col-span-2'>
//                                                                 <input checked={literatureReviewRank === "c"}
//                                                                     onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
//                                                                     id="list-radio-missing" type="radio" value="" name="list-radio-literature" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label for="list-radio-missing" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">c. The literature review is missing a number of significant papers</label>

//                                                             </div>
//                                                             <div className='px-8 py-4 col-span-2 w-[80%] grid grid-cols-1 gap-2'>
//                                                                 <input type='text' placeholder='Paper 1'
//                                                                     className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
//                                                                 <input type='text' placeholder='Paper 2'
//                                                                     className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
//                                                             </div>
//                                                         </div>
//                                                     </li>
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input checked={literatureReviewRank === "d"}
//                                                                 onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
//                                                                 id="list-radio-poor" type="radio" value="" name="list-radio-literature" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-poor" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The literature review is poor with a majority of litteratue not covered</label>
//                                                         </div>
//                                                     </li>
//                                                 </ul>

//                                                 {/* Add more fields as needed */}
//                                             </div>
//                                         </dl>
//                                     </div>
//                                 </div>
//                                 <div className="my-6 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
//                                     <div className="px-4 py-5 sm:px-6">
//                                         <p className="max-w-2xl text-md text-white">
//                                             Student's undertanding of the problem</p>
//                                     </div>
//                                     <div className="border-t border-gray-200">
//                                         <dl>
//                                             <div className="bg-gray-50 px-4 py-5 sm:px-6">
//                                                 <div>
//                                                     <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">2. Is the research gap in the field clearly identified?</h3>
//                                                     <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                                                         <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
//                                                             <div className="flex items-center ps-3">
//                                                                 <input id="horizontal-list-radio-2-yes" type="radio" value="yes" name="list-radio-2" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label htmlFor="horizontal-list-radio-2-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
//                                                             </div>
//                                                         </li>
//                                                         <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
//                                                             <div className="flex items-center ps-3">
//                                                                 <input id="horizontal-list-radio-2-no" type="radio" value="no" name="list-radio-2" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label htmlFor="horizontal-list-radio-2-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
//                                                             </div>
//                                                         </li>
//                                                     </ul>
//                                                 </div>

//                                                 <div>
//                                                     <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">3. Is the research problem clearly defined?</h3>
//                                                     <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                                                         <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
//                                                             <div className="flex items-center ps-3">
//                                                                 <input id="horizontal-list-radio-3-yes" type="radio" value="yes" name="list-radio-3" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label htmlFor="horizontal-list-radio-3-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
//                                                             </div>
//                                                         </li>
//                                                         <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
//                                                             <div className="flex items-center ps-3">
//                                                                 <input id="horizontal-list-radio-3-no" type="radio" value="no" name="list-radio-3" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label htmlFor="horizontal-list-radio-3-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
//                                                             </div>
//                                                         </li>
//                                                     </ul>
//                                                 </div>

//                                                 <div>
//                                                     <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">4. Is the identified research problem clearly placed in context with the literature?</h3>
//                                                     <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                                                         <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
//                                                             <div className="flex items-center ps-3">
//                                                                 <input id="horizontal-list-radio-4-yes" type="radio" value="yes" name="list-radio-4" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label htmlFor="horizontal-list-radio-4-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
//                                                             </div>
//                                                         </li>
//                                                         <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
//                                                             <div className="flex items-center ps-3">
//                                                                 <input id="horizontal-list-radio-4-no" type="radio" value="no" name="list-radio-4" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                                 <label htmlFor="horizontal-list-radio-4-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
//                                                             </div>
//                                                         </li>
//                                                     </ul>
//                                                 </div>
//                                                 {/* Add more fields as needed */}
//                                             </div>

//                                         </dl>
//                                     </div>
//                                 </div>
//                                 <div className="my-2 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
//                                     <div className="px-4 py-5 sm:px-6">
//                                         <p className="max-w-2xl text-md text-white">
//                                             Student's understanding of the solution</p>
//                                     </div>
//                                     <div className="border-t border-gray-200">
//                                         <dl>
//                                             <div className="bg-gray-50 px-4 py-5 sm:px-6">

//                                                 <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">5. How would you rate the student's understanding of the solution?</h3>
//                                                 <ul class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input id="list-radio-noidea" type="radio" value="" name="list-radio-solution" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-noidea" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The student has no idea about the solution</label>
//                                                         </div>
//                                                     </li>
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input id="list-radio-someidea" type="radio" value="" name="list-radio-solution" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-someidea" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The student has some idea about the solution and needs refinement</label>
//                                                         </div>
//                                                     </li>
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input id="list-radio-highidea" type="radio" value="" name="list-radio-solution" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-highidea" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">c. The student has a high level idea about the solution</label>

//                                                         </div>
//                                                     </li>
//                                                     <li class="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                                         <div class="flex items-center ps-3">
//                                                             <input id="list-radio-clearidea" type="radio" value="" name="list-radio-solution" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
//                                                             <label for="list-radio-clearidea" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The student has clear idea about the solution to start the work</label>
//                                                         </div>
//                                                     </li>
//                                                 </ul>

//                                                 {/* Add more fields as needed */}
//                                             </div>
//                                         </dl>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="m-2 px-4">
//                             <button className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//                                 type="button"
//                                 onClick={() => handleSubmit()}>
//                                 Submit Evaluation
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default SelectedMid1Details;