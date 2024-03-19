import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';

const SelectedFinal1Details = () => {
    const thesisId = useParams().thesisId;
    const userId = Cookie.get('userId');


    const [thesisDetails, setThesisDetails] = useState({});
    const [studentDetails, setStudentDetails] = useState({});
    const [comment, setComment] = useState("");
    const [literatureReviewRank, setLiteratureReviewRank] = useState("");
    const [paper1, setPaper1] = useState("");
    const [paper2, setPaper2] = useState("");
    const [comparativeAnalysisThorough, setcomparativeAnalysisThorough] = useState("");
    const [researchGapClearlyIdentified, setresearchGapClearlyIdentified] = useState("");
    const [researchProblemClearlyDefined, setresearchProblemClearlyDefined] = useState("");
    const [problemContextInLiterature, setproblemContextInLiterature] = useState("");
    const [understandingOfSolution, setunderstandingOfSolution] = useState("");
    const [proposedWorkEvaluation, setproposedWorkEvaluation] = useState("")
    const[reportQuality, setreportQuality] = useState("")
    const[reportOrganizationAcceptable, setreportOrganizationAcceptable] = useState("")
    const[communicationSkills, setcommunicationSkills] = useState("")
    const[questionsHandling, setquestionsHandling] = useState("")

    // Handle radio input changes
    const handleRadioChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
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
                        literatureReviewRank,
                        paper1: literatureReviewRank === 'g' ? paper1 : null,
                        paper2: literatureReviewRank === 'g' ? paper2 : null,
                        comparativeAnalysisThorough,
                        researchGapClearlyIdentified,
                        researchProblemClearlyDefined,
                        problemContextInLiterature,
                        understandingOfSolution,
                        proposedWorkEvaluation,
                        reportQuality,
                        reportOrganizationAcceptable,
                        communicationSkills,
                        questionsHandling,
                        comments: comment
                    })
                });

                const data = response.json()
                if (!response.ok) {
                    throw new Error('Failed to submit evaluation');
                }
                // Handle successful submission, e.g., show a success message
                console.log(data);
                window.alert(data)
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
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="w-full my-4">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Thesis 1 Final Evaluation Form
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
                                <div className='col-span-1 p-2'>
                                    <div className='w-full px-3'>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            View Proposal File
                                        </label>
                                        <a href={`http://localhost:5000/${thesisDetails.proposalfilename}`} target="_blank" rel="noopener noreferrer" type='application/pdf'>
                                            View Proposal
                                        </a>

                                    </div>
                                </div>

                            </div>
                            {/* <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Supervisor Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="M. Fayyaz"
                                    />
                                </div>
                            </div> */}
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
                                                            <input checked={literatureReviewRank === "e"}
                                                                onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
                                                                id="list-radio-comprehensive" type="radio" value="e" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-comprehensive" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The Literature review is comprehensive with little or no choice of any significance work missing from the coverage</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={literatureReviewRank === "f"}
                                                                onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
                                                                id="list-radio-Good" type="radio" value="f" name="list-radio-literature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The literature review is Good with all the major works identified. Some works might be missing, but they would probably have no major impact on the identified research gap</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3 grid grid-cols-2">
                                                            <div className='col-span-2'>
                                                                <input checked={literatureReviewRank === "g"}
                                                                    onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
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
                                                            <input checked={literatureReviewRank === "h"}
                                                                onChange={(e) => handleRadioChange(e, setLiteratureReviewRank)}
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
                                                            <input id="horizontal-list-radio-researchGapClearlyIdentified-Good" type="radio" value="Good" checked={researchGapClearlyIdentified === "Good"} onChange={(e) => setresearchGapClearlyIdentified(e.target.value)} name="list-radio-researchGapClearlyIdentified" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchGapClearlyIdentified-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchGapClearlyIdentified-Average" type="radio" value="Average" checked={researchGapClearlyIdentified === "Average"} onChange={(e) => setresearchGapClearlyIdentified(e.target.value)} name="list-radio-researchGapClearlyIdentified" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchGapClearlyIdentified-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-researchGapClearlyIdentified-Bad" type="radio" value="Bad" checked={researchGapClearlyIdentified === "Bad"} onChange={(e) => setresearchGapClearlyIdentified(e.target.value)} name="list-radio-researchGapClearlyIdentified" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-researchGapClearlyIdentified-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                        </div>
                                                    </li>
                                                </ul>

                                                {/* Add more fields as needed */}

                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">3. Is the rearch gap in the field is clearly identified?</h3>
                                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-comparativeAnalysisThorough-Good" type="radio" value="Good" checked={comparativeAnalysisThorough === "Good"} onChange={(e) => setcomparativeAnalysisThorough(e.target.value)} name="list-radio-comparativeAnalysisThorough" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-comparativeAnalysisThorough-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-comparativeAnalysisThorough-Average" type="radio" value="Average" checked={comparativeAnalysisThorough === "Average"} onChange={(e) => setcomparativeAnalysisThorough(e.target.value)} name="list-radio-comparativeAnalysisThorough" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-comparativeAnalysisThorough-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                        </div>
                                                    </li>
                                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input id="horizontal-list-radio-comparativeAnalysisThorough-Bad" type="radio" value="Bad" checked={comparativeAnalysisThorough === "Bad"} onChange={(e) => setcomparativeAnalysisThorough(e.target.value)} name="list-radio-comparativeAnalysisThorough" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="horizontal-list-radio-comparativeAnalysisThorough-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
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
                                                                <input id="horizontal-list-radio-researchProblemClearlyDefined-Good" type="radio" value="Good" checked={researchProblemClearlyDefined === "Good"} onChange={(e) => setresearchProblemClearlyDefined(e.target.value)} name="list-radio-researchProblemClearlyDefined" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-researchProblemClearlyDefined-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-researchProblemClearlyDefined-Average" type="radio" value="Average" checked={researchProblemClearlyDefined === "Average"} onChange={(e) => setresearchProblemClearlyDefined(e.target.value)} name="list-radio-researchProblemClearlyDefined" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-researchProblemClearlyDefined-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-researchProblemClearlyDefined-Bad" type="radio" value="Bad" checked={researchProblemClearlyDefined === "Bad"} onChange={(e) => setresearchProblemClearlyDefined(e.target.value)} name="list-radio-researchProblemClearlyDefined" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-researchProblemClearlyDefined-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <h3 className="m-4 font-semibold text-gray-900 dark:text-white">5. Is the identified rearch problem clearly placed in context with the literature?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-problemContextInLiterature-Good" type="radio" value="Good" checked={problemContextInLiterature === "Good"} onChange={(e) => setproblemContextInLiterature(e.target.value)} name="list-radio-problemContextInLiterature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-problemContextInLiterature-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-problemContextInLiterature-Average" type="radio" value="Average" checked={problemContextInLiterature === "Average"} onChange={(e) => setproblemContextInLiterature(e.target.value)} name="list-radio-problemContextInLiterature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-problemContextInLiterature-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-problemContextInLiterature-Bad" type="radio" value="Bad" checked={problemContextInLiterature === "Bad"} onChange={(e) => setproblemContextInLiterature(e.target.value)} name="list-radio-problemContextInLiterature" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-problemContextInLiterature-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
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
                                                            <input checked={understandingOfSolution === "e"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingOfSolution)}
                                                                id="list-radio-understandingOfSolution-noidea" type="radio" value="e" name="list-radio-understandingOfSolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingOfSolution-noidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">a. The student has no idea about the solution</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={understandingOfSolution === "f"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingOfSolution)}
                                                                id="list-radio-understandingOfSolution-someidea" type="radio" value="f" name="list-radio-understandingOfSolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingOfSolution-someidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">b. The student has some idea about the solution and needs refinement</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                            <input checked={understandingOfSolution === "g"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingOfSolution)}
                                                                id="list-radio-understandingOfSolution-highidea" type="radio" value="g" name="list-radio-understandingOfSolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingOfSolution-highidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">c. The student has a high level idea about the solution</label>
                                                        </div>
                                                    </li>
                                                    <li className="p-2 w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                        <div className="flex items-center ps-3">
                                                            <input checked={understandingOfSolution === "h"}
                                                                onChange={(e) => handleRadioChange(e, setunderstandingOfSolution)}
                                                                id="list-radio-understandingOfSolution-clearidea" type="radio" value="h" name="list-radio-understandingOfSolution" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                            <label htmlFor="list-radio-understandingOfSolution-clearidea" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">d. The student has a clear idea about the solution to start the work</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <h3 className="m-4 font-semibold text-gray-900 dark:text-white">7. Is the student familiar with how to evaluate his proposed work?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-proposedWorkEvaluation-Good" type="radio" value="Good" checked={proposedWorkEvaluation === "Good"} onChange={(e) => setproposedWorkEvaluation(e.target.value)} name="list-radio-proposedWorkEvaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-proposedWorkEvaluation-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-proposedWorkEvaluation-Average" type="radio" value="Average" checked={proposedWorkEvaluation === "Average"} onChange={(e) => setproposedWorkEvaluation(e.target.value)} name="list-radio-proposedWorkEvaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-proposedWorkEvaluation-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-proposedWorkEvaluation-Bad" type="radio" value="Bad" checked={proposedWorkEvaluation === "Bad"} onChange={(e) => setproposedWorkEvaluation(e.target.value)} name="list-radio-proposedWorkEvaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-proposedWorkEvaluation-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
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
                                                                <input id="horizontal-list-radio-reportQuality-Good" type="radio" value="Good" checked={reportQuality === "Good"} onChange={(e) => setreportQuality(e.target.value)} name="list-radio-reportQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-reportQuality-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-reportQuality-Average" type="radio" value="Average" checked={reportQuality === "Average"} onChange={(e) => setreportQuality(e.target.value)} name="list-radio-reportQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-reportQuality-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-reportQuality-Bad" type="radio" value="Bad" checked={reportQuality === "Bad"} onChange={(e) => setreportQuality(e.target.value)} name="list-radio-reportQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-reportQuality-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <h3 className="m-4 font-semibold text-gray-900 dark:text-white">9. Is the organization of the thesis acceptable?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-reportOrganizationAcceptable-Good" type="radio" value="Good" checked={reportOrganizationAcceptable === "Good"} onChange={(e) => setreportOrganizationAcceptable(e.target.value)} name="list-radio-reportOrganizationAcceptable" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-reportOrganizationAcceptable-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-reportOrganizationAcceptable-Average" type="radio" value="Average" checked={reportOrganizationAcceptable === "Average"} onChange={(e) => setreportOrganizationAcceptable(e.target.value)} name="list-radio-reportOrganizationAcceptable" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-reportOrganizationAcceptable-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-reportOrganizationAcceptable-Bad" type="radio" value="Bad" checked={reportOrganizationAcceptable === "Bad"} onChange={(e) => setreportOrganizationAcceptable(e.target.value)} name="list-radio-reportOrganizationAcceptable" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-reportOrganizationAcceptable-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
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
                                                                <input id="horizontal-list-radio-communicationSkills-Good" type="radio" value="Good" checked={communicationSkills === "Good"} onChange={(e) => setcommunicationSkills(e.target.value)} name="list-radio-communicationSkills" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-communicationSkills-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-communicationSkills-Average" type="radio" value="Average" checked={communicationSkills === "Average"} onChange={(e) => setcommunicationSkills(e.target.value)} name="list-radio-communicationSkills" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-communicationSkills-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-communicationSkills-Bad" type="radio" value="Bad" checked={communicationSkills === "Bad"} onChange={(e) => setcommunicationSkills(e.target.value)} name="list-radio-communicationSkills" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-communicationSkills-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <h3 className="m-4 font-semibold text-gray-900 dark:text-white">11. Did the student handled the Question/Answer session well?</h3>
                                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-questionsHandling-Good" type="radio" value="Good" checked={questionsHandling === "Good"} onChange={(e) => setquestionsHandling(e.target.value)} name="list-radio-questionsHandling" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-questionsHandling-Good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-questionsHandling-Average" type="radio" value="Average" checked={questionsHandling === "Average"} onChange={(e) => setquestionsHandling(e.target.value)} name="list-radio-questionsHandling" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-questionsHandling-Average" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Average</label>
                                                            </div>
                                                        </li>
                                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                            <div className="flex items-center ps-3">
                                                                <input id="horizontal-list-radio-questionsHandling-Bad" type="radio" value="Bad" checked={questionsHandling === "Bad"} onChange={(e) => setquestionsHandling(e.target.value)} name="list-radio-questionsHandling" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                                <label htmlFor="horizontal-list-radio-questionsHandling-Bad" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
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