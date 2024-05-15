import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const SelectedFinal2Details = ({ setShowDetails }) => {
    const { rollno } = useParams();
    const userId = Cookie.get('userId');
    const toastTopCenter = useRef(null);

    const [thesisDetails, setThesisDetails] = useState({});

    const [titleAppropriateness, settitleAppropriateness] = useState("");
    const [abstractClarity, setabstractClarity] = useState("");
    const [introductionClarity, setintroductionClarity] = useState("");
    const [literatureReviewClarity, setliteratureReviewClarity] = useState("");
    const [researchContentRigor, setresearchContentRigor] = useState("");
    const [workEvaluation, setworkEvaluation] = useState("");
    const [organizationQuality, setorganizationQuality] = useState("");
    const [languageQuality, setlanguageQuality] = useState("");
    const [titleComments, settitleComments] = useState("");
    const [abstractComments, setabstractComments] = useState("")
    const [introductionComments, setintroductionComments] = useState("")
    const [literatureReviewComments, setliteratureReviewComments] = useState("")
    const [researchContentComments, setresearchContentComments] = useState("")
    const [workEvaluationComments, setworkEvaluationComments] = useState("")
    const [organizationComments, setorganizationComments] = useState("")
    const [languageComments, setlanguageComments] = useState("")
    const [generalComments, setgeneralComments] = useState("")

    const [grade, setgrade] = useState("");

    const [visible, setVisible] = useState(false);

    console.log("The roll no from use params : ", rollno)

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    // Retrieve thesis and student details from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/faculty/final2EvalDetails/${rollno}`, {
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
                setThesisDetails(data[0]);
                console.log("data : ", thesisDetails)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    console.log(thesisDetails)


    const handlegradeChange = (event, setgrade) => {
        // Check if event.target exists and has a value property
        if (event.target && event.target.value) {
            setgrade(event.target.value);
        }
    };

    const handleSubmit = async (event) => {
        // event.preventDefault();

        if (!titleAppropriateness || !abstractClarity || !introductionClarity || !literatureReviewClarity || !researchContentRigor || !workEvaluation || !organizationQuality || !languageQuality || !titleComments || !abstractComments || !introductionComments || !literatureReviewComments || !researchContentComments || !workEvaluationComments || !organizationComments || !languageComments || !generalComments) {
            showMessage('error', 'Please fill all the fields before evaluating');
            setVisible(false);
            return;
        }

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
                const facultyname = facultyData.name; // Extract faculty name from response data
                console.log('facultyData: ', facultyData)

                const response = await fetch('http://localhost:5000/faculty/evaluateFinal2', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    },
                    body: JSON.stringify({
                        rollno: thesisDetails.rollno,
                        stdname: thesisDetails.stdname,
                        thesistitle: thesisDetails.thesistitle,
                        // reportfilename: thesisDetails.thesistwofilename,
                        facultyid: userId,
                        facultyname,
                        titleAppropriateness,
                        titleComments,
                        abstractClarity,
                        abstractComments,
                        introductionClarity,
                        introductionComments,
                        literatureReviewClarity,
                        literatureReviewComments,
                        researchContentRigor,
                        researchContentComments,
                        workEvaluation,
                        workEvaluationComments,
                        organizationQuality,
                        organizationComments,
                        languageQuality,
                        languageComments,
                        generalComments,
                        // grade,
                    })
                });

                const data = await response.json()
                if (data.message === "Final 2 evaluation completed successfully") {
                    showMessage('success', data.message);
                    setVisible(false);
                    setTimeout(() => {
                        setShowDetails(false);
                    }, 3000);
                    console.log('Final 2 evaluation completed successfully');
                }
                else {
                    showMessage('info', data.message);
                    setVisible(false);
                }
            } else {
                throw new Error('Failed to fetch faculty data');
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Confirmation</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
        </div>
    );

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '30rem' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Are you sure you want to evaluate this?
                </p>
            </Dialog>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
                <div className="w-full my-2">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis/ Project 2 Final Evaluation Form
                    </h2>
                </div>
                <div className="mt-6 sm:mx-auto">
                    <form className="sm:mx-auto" enctype="multipart/form-data">
                        <div className='grid grid-cols-6'>
                            <div className='col-span-2 py-1'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        for="grid-first-name">
                                        Roll Number
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="20F-1234"
                                        value={thesisDetails.rollno || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className='col-span-4 py-1'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Student Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad"
                                        value={thesisDetails.stdname || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                            {/* <div className='col-span-2 py-1'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        for="grid-first-name">
                                        Supervisor Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="20F-1234"
                                        value={thesisDetails.supervisorname || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className='col-span-4 py-1'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Internals Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad"
                                        value={thesisDetails.internals ? thesisDetails.internals.join(', ') : ''}
                                        readOnly
                                    />
                                </div>
                            </div> */}

                            <div className='col-span-6 py-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Title of Thesis
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        required
                                        readOnly
                                        value={thesisDetails.thesistitle}
                                        type="synopsistitle"
                                        name="synopsistitle"
                                        placeholder="Thesis Title Here.." />
                                </div>
                            </div>
                            {/*                            
                            <div className='col-span-2 py-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Task Titles
                                    </label>
                                    {thesisDetails.tasktitles && thesisDetails.tasktitles?.map((taskTitle, index) => (
                                        <input key={index} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            readOnly
                                            type="text"
                                            name={`taskTitle${index}`}
                                            value={taskTitle}
                                            placeholder={`Task Title ${index + 1}`} />
                                    ))}
                                </div>
                            </div>
                            <div className='col-span-3 py-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Goals/Objectives
                                    </label>
                                    {thesisDetails.objectives && thesisDetails.objectives?.map((objective, index) => (
                                        <input key={index} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            readOnly
                                            type="text"
                                            name={`objective${index}`}
                                            value={objective}
                                            placeholder={`Goal/Objective ${index + 1}`} />
                                    ))}
                                </div>
                            </div>
                            <div className='col-span-1 py-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Completion Date
                                    </label>
                                    {thesisDetails.completiondates && thesisDetails.completiondates?.map((completionDate, index) => (
                                        <input key={index} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            readOnly
                                            type="text"
                                            name={`completionDate${index}`}
                                            value={completionDate}
                                            placeholder={`Completion Date ${index + 1}`} />
                                    ))}
                                </div>
                            </div> */}
                            {/* <div className='col-span-6 py-1'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                        for="grid-first-name">
                                        View File
                                    </label>
                                    <a href={`http://localhost:5000${thesisDetails.thesistwofilename}`} target="_blank" rel="noopener noreferrer" type='application/pdf'>
                                        View Proposal
                                    </a>
                                </div>
                            </div> */}
                        </div>
                        <div className="my-6 bg-gray-600 shadow overflow-hidden sm:rounded-lg w-full">
                            <div className="px-4 py-5 sm:px-6">
                                <p className="max-w-2xl text-md text-white">
                                    Please encircle the appropriate choice</p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">1. Is the title appropriate for the thesis?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-titleAppropriateness-yes" type="radio" value="yes"
                                                            checked={titleAppropriateness === "yes"}
                                                            onChange={(e) => settitleAppropriateness(e.target.value)}
                                                            name="list-radio-titleAppropriateness"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-titleAppropriateness-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-titleAppropriateness-no" type="radio" value="no"
                                                            checked={titleAppropriateness === "no"}
                                                            onChange={(e) => settitleAppropriateness(e.target.value)}
                                                            name="list-radio-titleAppropriateness"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-titleAppropriateness-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-titleAppropriateness-unsure" type="radio" value="unsure"
                                                            checked={titleAppropriateness === "unsure"}
                                                            onChange={(e) => settitleAppropriateness(e.target.value)}
                                                            name="list-radio-titleAppropriateness"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-titleAppropriateness-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    If not, Please suggest a suitable alternate</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="titleComments"
                                                    name="titleComments"
                                                    type="titleComments"
                                                    placeholder="titleComments here...."
                                                    value={titleComments}
                                                    onChange={(e) => settitleComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">2. Is the abstract clear and concise and highlight the main contributions ?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-abstractClarity-yes" type="radio" value="yes"
                                                            checked={abstractClarity === "yes"}
                                                            onChange={(e) => setabstractClarity(e.target.value)}
                                                            name="list-radio-abstractClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-abstractClarity-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-abstractClarity-no" type="radio" value="no"
                                                            checked={abstractClarity === "no"}
                                                            onChange={(e) => setabstractClarity(e.target.value)}
                                                            name="list-radio-abstractClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-abstractClarity-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-abstractClarity-unsure" type="radio" value="unsure"
                                                            checked={abstractClarity === "unsure"}
                                                            onChange={(e) => setabstractClarity(e.target.value)}
                                                            name="list-radio-abstractClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-abstractClarity-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please provide detailed comments</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="abstractComments"
                                                    name="abstractComments"
                                                    type="abstractComments"
                                                    placeholder="abstractComments here...."
                                                    value={abstractComments}
                                                    onChange={(e) => setabstractComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">3. Does the introduction clearly describe the motivation and research contributions of the study?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-introductionClarity-yes" type="radio" value="yes"
                                                            checked={introductionClarity === "yes"}
                                                            onChange={(e) => setintroductionClarity(e.target.value)}
                                                            name="list-radio-introductionClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-introductionClarity-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-introductionClarity-no" type="radio" value="no"
                                                            checked={introductionClarity === "no"}
                                                            onChange={(e) => setintroductionClarity(e.target.value)}
                                                            name="list-radio-introductionClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-introductionClarity-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-introductionClarity-unsure" type="radio" value="unsure"
                                                            checked={introductionClarity === "unsure"}
                                                            onChange={(e) => setintroductionClarity(e.target.value)}
                                                            name="list-radio-introductionClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-introductionClarity-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please provide detailed comments with specifies such as references the student needs to look up </h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="introductionComments"
                                                    name="introductionComments"
                                                    type="introductionComments"
                                                    placeholder="introductionComments here...."
                                                    value={introductionComments}
                                                    onChange={(e) => setintroductionComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">4. Dose the literature review clearly identifies the reaserch gap and highlights the differnce with the thesis?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-literatureReviewClarity-yes" type="radio" value="yes"
                                                            checked={literatureReviewClarity === "yes"}
                                                            onChange={(e) => setliteratureReviewClarity(e.target.value)}
                                                            name="list-radio-literatureReviewClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-literatureReviewClarity-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-literatureReviewClarity-no" type="radio" value="no"
                                                            checked={literatureReviewClarity === "no"}
                                                            onChange={(e) => setliteratureReviewClarity(e.target.value)}
                                                            name="list-radio-literatureReviewClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-literatureReviewClarity-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-literatureReviewClarity-unsure" type="radio" value="unsure"
                                                            checked={literatureReviewClarity === "unsure"}
                                                            onChange={(e) => setliteratureReviewClarity(e.target.value)}
                                                            name="list-radio-literatureReviewClarity" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-literatureReviewClarity-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please identify any problem areas</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="literatureReviewComments"
                                                    name="literatureReviewComments"
                                                    type="literatureReviewComments"
                                                    placeholder="literatureReviewComments here...."
                                                    value={literatureReviewComments}
                                                    onChange={(e) => setliteratureReviewComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">5. Does the research content contain enough scientific rigor for a graduate level thesis?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-researchContentRigor-yes" type="radio" value="yes"
                                                            checked={researchContentRigor === "yes"}
                                                            onChange={(e) => setresearchContentRigor(e.target.value)}
                                                            name="list-researchContentRigor" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-researchContentRigor-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-researchContentRigor-no" type="radio" value="no"
                                                            checked={researchContentRigor === "no"}
                                                            onChange={(e) => setresearchContentRigor(e.target.value)}
                                                            name="list-researchContentRigor" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-researchContentRigor-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-researchContentRigor-unsure" type="radio" value="unsure"
                                                            checked={researchContentRigor === "unsure"}
                                                            onChange={(e) => setresearchContentRigor(e.target.value)}
                                                            name="list-researchContentRigor" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-researchContentRigor-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please provide the necessary comments</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="researchContentComments"
                                                    name="researchContentComments"
                                                    type="researchContentComments"
                                                    placeholder="researchContentComments here...."
                                                    value={researchContentComments}
                                                    onChange={(e) => setresearchContentComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">6. Dose the evaluation of the work technically sound?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-workEvaluation-yes" type="radio" value="yes"
                                                            checked={workEvaluation === "yes"}
                                                            onChange={(e) => setworkEvaluation(e.target.value)}
                                                            name="list-radio-workEvaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-workEvaluation-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-workEvaluation-no" type="radio" value="no"
                                                            checked={workEvaluation === "no"}
                                                            onChange={(e) => setworkEvaluation(e.target.value)}
                                                            name="list-radio-workEvaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-workEvaluation-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-workEvaluation-unsure" type="radio" value="unsure"
                                                            checked={workEvaluation === "unsure"}
                                                            onChange={(e) => setworkEvaluation(e.target.value)}
                                                            name="list-radio-workEvaluation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-workEvaluation-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please suggest additional references, that you are aware of, to the student</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="workEvaluationComments"
                                                    name="workEvaluationComments"
                                                    type="workEvaluationComments"
                                                    placeholder="workEvaluationComments here...."
                                                    value={workEvaluationComments}
                                                    onChange={(e) => setworkEvaluationComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">7. Is the overall organization of the thesis satisfactory?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-organizationQuality-yes" type="radio" value="yes"
                                                            checked={organizationQuality === "yes"}
                                                            onChange={(e) => setorganizationQuality(e.target.value)}
                                                            name="list-radio-organizationQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-organizationQuality-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-organizationQuality-no" type="radio" value="no"
                                                            checked={organizationQuality === "no"}
                                                            onChange={(e) => setorganizationQuality(e.target.value)}
                                                            name="list-radio-organizationQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-organizationQuality-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-organizationQuality-unsure" type="radio" value="unsure"
                                                            checked={organizationQuality === "unsure"}
                                                            onChange={(e) => setorganizationQuality(e.target.value)}
                                                            name="list-radio-organizationQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-organizationQuality-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please suggest desired changes</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="organizationComments"
                                                    name="organizationComments"
                                                    type="organizationComments"
                                                    placeholder="organizationComments here...."
                                                    value={organizationComments}
                                                    onChange={(e) => setorganizationComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">8. Is the english(spelling, grammer, usage) satisfactory?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-languageQuality-yes" type="radio" value="yes"
                                                            checked={languageQuality === "yes"}
                                                            onChange={(e) => setlanguageQuality(e.target.value)}
                                                            name="list-radio-languageQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-languageQuality-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-languageQuality-no" type="radio" value="no"
                                                            checked={languageQuality === "no"}
                                                            onChange={(e) => setlanguageQuality(e.target.value)}
                                                            name="list-radio-languageQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-languageQuality-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-languageQuality-unsure" type="radio" value="unsure"
                                                            checked={languageQuality === "unsure"}
                                                            onChange={(e) => setlanguageQuality(e.target.value)}
                                                            name="list-radio-languageQuality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-languageQuality-unsure" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsure</label>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='pb-4'>
                                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                    Please give specific recommendations</h3>
                                                <textarea className="appearance-none h-20 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    required
                                                    id="languageComments"
                                                    name="languageComments"
                                                    type="languageComments"
                                                    placeholder="languageComments here...."
                                                    value={languageComments}
                                                    onChange={(e) => setlanguageComments(e.target.value)}
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        {/* Add more fields as needed */}
                                        <div className='my-4'>
                                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                Comments for the student and supervisor</h3>
                                            <textarea className="appearance-none h-36 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                required
                                                id="generalComments"
                                                name="generalComments"
                                                type="generalComments"
                                                placeholder="Comments here...."
                                                value={generalComments}
                                                onChange={(e) => setgeneralComments(e.target.value)}
                                            >
                                            </textarea>
                                        </div>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>

                            {/* <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Please specify one of the following:</h3>
                            <ul class="grid w-full gap-6 md:grid-cols-3">
                                <li>
                                    <input type="radio" id="hosting-Ready" name="hosting" value='Ready' class="hidden peer"
                                        checked={grade === 'Ready'}
                                        onChange={(event) => handlegradeChange(event, setgrade)} // Pass event and setter function
                                        required />
                                    <label for="hosting-Ready" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-teal-500 peer-checked:border-teal-600 peer-checked:text-teal-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-full text-lg font-semibold">Recommended for Thesis Defense</div>
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
                                            <div class="w-full text-lg font-semibold">Needs major revisions before a Thesis Defense</div>
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
                                            <div class="w-full text-lg font-semibold">Not recommended for a Thesis Defense</div>
                                        </div>
                                        <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>
                                    </label>
                                </li>
                            </ul> */}
                            <div className="mt-6">
                                <button className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    onClick={() => setVisible(true)}
                                >
                                    Submit Evaluation
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default SelectedFinal2Details;