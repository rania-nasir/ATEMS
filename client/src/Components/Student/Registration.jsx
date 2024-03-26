import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';

const Registration = () => {
    const userId = Cookies.get('userId');
    const toastTopCenter = useRef(null);

    const [thesisData, setThesisData] = useState(null);
    const [taskTitles, setTaskTitles] = useState(['', '', '']);
    const [objectives, setObjectives] = useState(['', '', '']);
    const [completionDates, setCompletionDates] = useState(['', '', '']);

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    useEffect(() => {
        async function fetchThesisData() {
            try {
                const response = await fetch(`http://localhost:5000/std/thesisData/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setThesisData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisData();
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!taskTitles.every(taskTitle => taskTitle.trim())) {
            showMessage('error', 'Please fill in all task titles');
            return;
        }
        if (!objectives.every(objective => objective.trim())) {
            showMessage('error', 'Please fill in all objectives/ goals');
            return;
        }
        if (!completionDates.every(completionDates => completionDates.trim())) {
            showMessage('error', 'Please set the completion dates');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/std/thesisTwoRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookies.get('jwtoken')}`
                },
                body: JSON.stringify({
                    stdname: thesisData.stdname,
                    rollno: thesisData.rollno,
                    thesistitle: thesisData.thesistitle,
                    facultyid: thesisData.facultyid,
                    supervisorname: thesisData.supervisorname,
                    internals: thesisData.internals,
                    internalsid: thesisData.internalsid,
                    tasktitles: taskTitles,
                    objectives: objectives,
                    completiondates: completionDates
                })
            });

            const data = await response.json();
            if (data.message === "Registration created successfully") {
                showMessage('success', data.message);
            }
            else {
                showMessage('info', data.message);
            }
        } catch (error) {
            window.alert('Failed to register for thesis two');
            console.error('Error registering for thesis two:', error);
            // Handle error, e.g., show an error message
        }
    };

    const handleTaskTitleChange = (index, value) => {
        const updatedTaskTitles = [...taskTitles];
        updatedTaskTitles[index] = value;
        setTaskTitles(updatedTaskTitles);
    };

    const handleObjectiveChange = (index, value) => {
        const updatedObjectives = [...objectives];
        updatedObjectives[index] = value;
        setObjectives(updatedObjectives);
    };

    const handleCompletionDateChange = (index, value) => {
        const updatedCompletionDates = [...completionDates];
        updatedCompletionDates[index] = value;
        setCompletionDates(updatedCompletionDates);
    };


    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
                <div className="w-full my-2">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        MS Thesis/ Project 2 Supervisor Consent Form
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto">
                    <form className="sm:mx-auto" encType="multipart/form-data">
                        {thesisData && (
                            <>
                                <div className="grid grid-cols-4">
                                    <div className="col-span-1 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="rollno">
                                                Roll Number
                                            </label>
                                            <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="rollno" type="text" value={thesisData.rollno} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-span-1 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="stdname">
                                                Student Name
                                            </label>
                                            <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="stdname" type="text" value={thesisData.stdname} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-span-1 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="facultyid">
                                                Faculty ID
                                            </label>
                                            <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="facultyid" type="text" value={thesisData.facultyid} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-span-1 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="supervisorname">
                                                Supervisor Name
                                            </label>
                                            <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="supervisorname" type="text" value={thesisData.supervisorname} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-span-4 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="thesistitle">
                                                Thesis Title
                                            </label>
                                            <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="thesistitle" type="text" value={thesisData.thesistitle} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-span-2 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="internals">
                                                Internal ID
                                            </label>
                                            <ul className='w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                                                {thesisData.internalsid?.map((internal, index) => (
                                                    <li key={index}>{internal}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-span-2 p-2">
                                        <div className="w-full px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="internals">
                                                Internals Name
                                            </label>
                                            <ul className='w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                                                {thesisData.internals?.map((internal, index) => (
                                                    <li key={index}>{internal}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                                <div className="relative shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Task Title
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Goal/ Objective
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Tentative Completion Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taskTitles?.map((_, index) => (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <input
                                                            type="text"
                                                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                            value={taskTitles[index] || ''}
                                                            placeholder='Task 1'
                                                            onChange={(e) => handleTaskTitleChange(index, e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                            value={objectives[index] || ''}
                                                            placeholder='Objective 1'
                                                            onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type='date'
                                                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                            value={completionDates[index] || ''}
                                                            placeholder='26/03/2024'
                                                            onChange={(e) => handleCompletionDateChange(index, e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                                <div className='mt-8 px-2'>
                                    <button type="submit"
                                        onClick={handleSubmit}
                                        className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                        Register
                                    </button>
                                </div>
                            </>
                        )}
                        {!thesisData && <div>Thesis request is still in process....</div>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Registration;
