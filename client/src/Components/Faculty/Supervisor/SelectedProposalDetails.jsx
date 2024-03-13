import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'; // Import useParams hook
import Cookies from 'js-cookie';

const SelectedProposalDetails = () => {
    const { rollno } = useParams(); // Get rollno from URL params
    const [studentData, setStudentData] = useState(null);

    console.log('rollno = ', rollno)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/selectedProposal/${rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setStudentData(data);
                    alert(data.message)
                    console.log('student data = ', studentData)
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchData();
    }, [rollno]);


    const PostData = async (e) => {
        e.preventDefault();

       
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="w-full my-4">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Proposal Defense Evaluation Form
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
                                        id="grid-first-name" type="text" placeholder="20F-1234" value={rollno.rollno} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Student Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad" value={rollno.name} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Batch
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="3.16" value={rollno.cgpa} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Semester
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="7" value={rollno.cgpa} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Supervisor ID
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="1234" value={rollno.cgpa} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Supervisor Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="M. Fayyaz" value={rollno.cgpa} />
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
                                        // value={user.synopsistitle}
                                        // onChange={handleInputs}
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
                                            <input id="horizontal-list-radio-significance-satisfactory" type="radio" value="" name="significance-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-significance-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-significance-unsatisfactory" type="radio" value="" name="significance-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-significance-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-significance-notApprove" type="radio" value="" name="significance-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                                            <input id="horizontal-list-radio-understanding-satisfactory" type="radio" value="" name="understanding-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-understanding-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-understanding-unsatisfactory" type="radio" value="" name="understanding-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-understanding-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-understanding-notApproved" type="radio" value="" name="understanding-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                                            <input id="horizontal-list-radio-statement-satisfactory" type="radio" value="" name="statement-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-statement-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-statement-unsatisfactory" type="radio" value="" name="statement-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-statement-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-statement-notApprove" type="radio" value="" name="statement-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                                            <input id="horizontal-list-radio-rationale-satisfactory" type="radio" value="" name="rationale-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-rationale-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-rationale-unsatisfactory" type="radio" value="" name="rationale-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-rationale-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-rationale-notApprove" type="radio" value="" name="rationale-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                                            <input id="horizontal-list-radio-timeline-satisfactory" type="radio" value="" name="timeline-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-timeline-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-timeline-unsatisfactory" type="radio" value="" name="timeline-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-timeline-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-timeline-notApprove" type="radio" value="" name="timeline-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                                            <input id="horizontal-list-radio-bibliography-satisfactory" type="radio" value="" name="bibliography-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-bibliography-satisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Satisfactory - None or minor revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-bibliography-unsatisfactory" type="radio" value="" name="bibliography-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-bibliography-unsatisfactory" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unsatisfactory - Major revisions required</label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input id="horizontal-list-radio-bibliography-notApprove" type="radio" value="" name="bibliography-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="horizontal-list-radio-bibliography-notApprove" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Approved</label>
                                        </div>
                                    </li>
                                </ul>

                                <h3
                                className="col-span-2 mb-2 mt-8 font-semibold text-gray-900 dark:text-white">Detailed Comments(mandatory):</h3>

                                    <textarea className="col-span-2 appearance-none h-64 block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        // value={comment}
                                        // onChange={handleInputs}
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
                                onClick={PostData}>
                                Submit Evaluation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default SelectedProposalDetails;


// {
//     "rollno": "20F-0245",
//     "stdname": "Mustajab Ahmad",
//     "batch": 20,
//     "semester": 3,
//     "thesistitle": "ATEMS",
//     "facultyid": 6176,
//     "facname": "Dr. Rabia",
//     "significance": "Satisfactory",
//     "understanding": "Satisfactory",
//     "statement": "Satisfactory",
//     "rationale": "Satisfactory",
//     "timeline": "Satisfactory",
//     "bibliography": "Satisfactory",
//     "comments": "This is a well-written proposal with clear objectives and a detailed timeline."
//   }