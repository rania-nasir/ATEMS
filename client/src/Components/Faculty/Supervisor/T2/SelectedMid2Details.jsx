import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const SelectedMid2Details = ({ setShowDetails }) => {
    const { rollno } = useParams();
    const userId = Cookie.get('userId');
    const toastTopCenter = useRef(null);

    const [thesisDetails, setThesisDetails] = useState({});

    const [englishlevel, setenglishlevel] = useState("");
    const [abstract, setabstract] = useState("");
    const [introduction, setintroduction] = useState("");
    const [research, setresearch] = useState("");
    const [literaturereview, setliteraturereview] = useState("");
    const [researchgap, setresearchgap] = useState("");
    const [researchproblem, setresearchproblem] = useState("");
    const [summary, setsummary] = useState("");
    const [researchcontribution, setresearchcontribution] = useState("");
    const [worktechniality, setworktechniality] = useState("");
    const [completeevaluation, setcompleteevaluation] = useState("");
    const [relevantrefs, setrelevantrefs] = useState("");
    const [format, setformat] = useState("");
    const [visuals, setvisuals] = useState("");
    const [comments, setcomments] = useState("");
    const [externaldefense, setexternaldefense] = useState("");
    const [suggestions, setsuggestions] = useState("");
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
                const response = await fetch(`http://localhost:5000/faculty/mid2EvalDetails/${rollno}`, {
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

        if (!englishlevel || !abstract || !introduction || !research || !literaturereview || !researchgap || !researchproblem || !summary || !researchcontribution || !worktechniality || !completeevaluation || !relevantrefs || !format || !visuals || !comments || !externaldefense || !suggestions | !grade) {
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

                const response = await fetch('http://localhost:5000/faculty/evaluateMid2', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    },
                    body: JSON.stringify({
                        rollno: thesisDetails.rollno,
                        stdname: thesisDetails.stdname,
                        thesistitle: thesisDetails.thesistitle,
                        reportfilename: thesisDetails.thesistwofilename,
                        facultyid: userId,
                        facultyname,
                        englishlevel,
                        abstract,
                        introduction,
                        research,
                        literaturereview,
                        researchgap,
                        researchproblem,
                        summary,
                        researchcontribution,
                        worktechniality,
                        completeevaluation,
                        relevantrefs,
                        format,
                        visuals,
                        comments,
                        externaldefense,
                        suggestions,
                        grade,
                    })
                });

                const data = await response.json()
                if (data.message === "Mid 2 evaluation completed successfully") {
                    showMessage('success', data.message);
                    setVisible(false);
                    setTimeout(() => {
                        setShowDetails(false);
                    }, 3000);
                    console.log('Mid 2 evaluation completed successfully');
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
            <Button label="Grade" icon="pi pi-check" onClick={handleSubmit} />
        </div>
    );

    return (
        <>
         <Toast ref={toastTopCenter} position="top-center" />
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '30rem' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Are you sure you want to grade this?
                </p>
            </Dialog>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
                <div className="w-full my-2">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis/ Project 2 Mid Evaluation Form
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
                            <div className='col-span-2 py-1'>
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
                            </div>

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
                            {/* // Inside the component */}
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
                            </div>
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
                                    Please fill in the form after thorough reading of the thesis document</p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">1. Is the English of the document correct and according to acceptable international standards for a graduate thesis?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-englishlevel-yes" type="radio" value="yes"
                                                            checked={englishlevel === "yes"}
                                                            onChange={(e) => setenglishlevel(e.target.value)}
                                                            name="list-radio-englishlevel"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-englishlevel-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-englishlevel-no" type="radio" value="no"
                                                            checked={englishlevel === "no"}
                                                            onChange={(e) => setenglishlevel(e.target.value)}
                                                            name="list-radio-englishlevel"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-englishlevel-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">2. Does the abstract clearly highlight the main contributions of the work?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-abstract-yes" type="radio" value="yes"
                                                            checked={abstract === "yes"}
                                                            onChange={(e) => setabstract(e.target.value)}
                                                            name="list-radio-abstract" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-abstract-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-abstract-no" type="radio" value="no"
                                                            checked={abstract === "no"}
                                                            onChange={(e) => setabstract(e.target.value)}
                                                            name="list-radio-abstract" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-abstract-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">3. Does the introduction clearly describe the motivation of the study?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-introduction-yes" type="radio" value="yes"
                                                            checked={introduction === "yes"}
                                                            onChange={(e) => setintroduction(e.target.value)}
                                                            name="list-radio-introduction" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-introduction-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-introduction-no" type="radio" value="no"
                                                            checked={introduction === "no"}
                                                            onChange={(e) => setintroduction(e.target.value)}
                                                            name="list-radio-introduction" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-introduction-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">4. Are the research contributions clearly highlighted in the introduction?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-research-yes" type="radio" value="yes"
                                                            checked={research === "yes"}
                                                            onChange={(e) => setresearch(e.target.value)}
                                                            name="list-radio-research" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-research-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-research-no" type="radio" value="no"
                                                            checked={research === "no"}
                                                            onChange={(e) => setresearch(e.target.value)}
                                                            name="list-radio-research" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-research-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">5. Is the literature review completewith possible comparisions?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-literaturereview-yes" type="radio" value="yes"
                                                            checked={literaturereview === "yes"}
                                                            onChange={(e) => setliteraturereview(e.target.value)}
                                                            name="list-literaturereview" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-literaturereview-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-literaturereview-no" type="radio" value="no"
                                                            checked={literaturereview === "no"}
                                                            onChange={(e) => setliteraturereview(e.target.value)}
                                                            name="list-literaturereview" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-literaturereview-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">6. Is the researchgap (major) clearly identified?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-researchgap-yes" type="radio" value="yes"
                                                            checked={researchgap === "yes"}
                                                            onChange={(e) => setresearchgap(e.target.value)}
                                                            name="list-radio-researchgap" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-researchgap-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-researchgap-no" type="radio" value="no"
                                                            checked={researchgap === "no"}
                                                            onChange={(e) => setresearchgap(e.target.value)}
                                                            name="list-radio-researchgap" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-researchgap-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">7. Is the research problem clearly identified?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-researchproblem-yes" type="radio" value="yes"
                                                            checked={researchproblem === "yes"}
                                                            onChange={(e) => setresearchproblem(e.target.value)}
                                                            name="list-radio-researchproblem" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-researchproblem-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-researchproblem-no" type="radio" value="no"
                                                            checked={researchproblem === "no"}
                                                            onChange={(e) => setresearchproblem(e.target.value)}
                                                            name="list-radio-researchproblem" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-researchproblem-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Add more fields as needed */}
                                        <div>
                                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                                8. Please provide a summary of the research contribution of the work:</h3>
                                            <textarea className="appearance-none h-36 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                required
                                                id="summary"
                                                name="summary"
                                                type="summary"
                                                placeholder="summary here...."
                                                value={summary}
                                                onChange={(e) => setsummary(e.target.value)}
                                            >
                                            </textarea>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">9. Is the research contribution clearly described?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-researchcontribution-yes" type="radio" value="yes"
                                                            checked={researchcontribution === "yes"}
                                                            onChange={(e) => setresearchcontribution(e.target.value)}
                                                            name="list-radio-researchcontribution"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-researchcontribution-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-researchcontribution-no" type="radio" value="no"
                                                            checked={researchcontribution === "no"}
                                                            onChange={(e) => setresearchcontribution(e.target.value)}
                                                            name="list-radio-researchcontribution"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-researchcontribution-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">10. Is the evaluation of the work technically sound and according to the acceptable international standards of this area?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-worktechnicality-yes" type="radio" value="yes"
                                                            checked={worktechniality === "yes"}
                                                            onChange={(e) => setworktechniality(e.target.value)}
                                                            name="list-radio-worktechnicality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-worktechnicality-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-worktechnicality-no" type="radio" value="no"
                                                            checked={worktechniality === "no"}
                                                            onChange={(e) => setworktechniality(e.target.value)}
                                                            name="list-radio-worktechnicality" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-worktechnicality-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">11. Is the evaluation of the work complete?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-4-yes" type="radio" value="yes"
                                                            checked={completeevaluation === "yes"}
                                                            onChange={(e) => setcompleteevaluation(e.target.value)}
                                                            name="list-radio-4" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-4-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-4-no" type="radio" value="no"
                                                            checked={completeevaluation === "no"}
                                                            onChange={(e) => setcompleteevaluation(e.target.value)}
                                                            name="list-radio-4" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-4-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">12. The references are relevant, up to date and the bibliography is complete?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-relevantrefs-yes" type="radio" value="yes"
                                                            checked={relevantrefs === "yes"}
                                                            onChange={(e) => setrelevantrefs(e.target.value)}
                                                            name="list-radio-relevantrefs" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-relevantrefs-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-relevantrefs-no" type="radio" value="no"
                                                            checked={relevantrefs === "no"}
                                                            onChange={(e) => setrelevantrefs(e.target.value)}
                                                            name="list-radio-relevantrefs" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-relevantrefs-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">13. Is the thesis written as per prescribed format. The thesis chapters, titles and sequences should be organized logically and there should be no ambiguity in understanding the overall flow?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-format-yes" type="radio" value="yes"
                                                            checked={format === "yes"}
                                                            onChange={(e) => setformat(e.target.value)}
                                                            name="list-radio-format" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-format-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-format-no" type="radio" value="no"
                                                            checked={format === "no"}
                                                            onChange={(e) => setformat(e.target.value)}
                                                            name="list-radio-format" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-format-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">14. Are the images, tables, and listings clearly visible?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-visuals-yes" type="radio" value="yes"
                                                            checked={visuals === "yes"}
                                                            onChange={(e) => setvisuals(e.target.value)}
                                                            name="list-radio-visuals" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-visuals-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-visuals-no" type="radio" value="no"
                                                            checked={visuals === "no"}
                                                            onChange={(e) => setvisuals(e.target.value)}
                                                            name="list-radio-visuals" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-visuals-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">15. Please provide your detailed comments.</h3>
                                            <textarea className="appearance-none h-64 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                required
                                                id="comments"
                                                name="comments"
                                                type="comments"
                                                placeholder="detailed comments here...."
                                                value={comments}
                                                onChange={(e) => setcomments(e.target.value)}
                                            >
                                            </textarea>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">16. Do you think that the thesis is ready for an external defense in its current form?</h3>
                                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-externaldefense-yes" type="radio" value="yes"
                                                            checked={externaldefense === "yes"}
                                                            onChange={(e) => setexternaldefense(e.target.value)}
                                                            name="list-radio-externaldefense" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-externaldefense-yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                                    </div>
                                                </li>
                                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                                    <div className="flex items-center ps-3">
                                                        <input id="horizontal-list-radio-externaldefense-no" type="radio" value="no"
                                                            checked={externaldefense === "no"}
                                                            onChange={(e) => setexternaldefense(e.target.value)}
                                                            name="list-radio-externaldefense" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                        <label htmlFor="horizontal-list-radio-externaldefense-no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">17. If No, please provide the mandatory steps required before an external defense can be recommended. Do you consider these suggestions as minor modifications:</h3>
                                            <textarea className="appearance-none h-32 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                required
                                                id="suggestions"
                                                name="suggestions"
                                                type="suggestions"
                                                placeholder="If No, please provide the suggestions here...."
                                                value={suggestions}
                                                onChange={(e) => setsuggestions(e.target.value)}
                                            >
                                            </textarea>
                                        </div>
                                    </div>
                                </dl>
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

export default SelectedMid2Details;