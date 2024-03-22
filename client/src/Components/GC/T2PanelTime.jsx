import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import Cookie from 'js-cookie';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
// import { Popup, DatePicker } from 'react-date-time-picker-popup'
// import 'react-date-time-picker-popup/dist/index.css'

export default function PanelTime() {
    const [visible, setVisible] = useState(false);
    const [day, setDay] = useState(new Date());

    const [rows, setRows] = useState([{ supervisor: '', thesistitle: '', timeslot: new Date() }]);
    const [supervisors, setSupervisors] = useState([]);
    const [selectedThesisTitle, setSelectedThesisTitle] = useState('');
    const [evaluations, setEvaluations] = useState(['Proposal', 'Mid', 'Final']);

    useEffect(() => {
        async function fetchSupervisors() {
            try {
                const response = await fetch('http://localhost:5000/gc/allSupervisors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch supervisors');
                }
                const data = await response.json();
                setSupervisors(data);
                console.log('supervisors: ', data);
            } catch (error) {
                console.error('Error fetching supervisors:', error);
            }
        }

        fetchSupervisors();
    }, []);

    // const fetchThesisTitles = async (supervisorName, rowIndex) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/gc/allThesisofSupervisor/${supervisorName}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${Cookie.get('jwtoken')}`
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch thesis titles');
    //         }
    //         const data = await response.json();
    //         console.log('Thesis titles:', data);
    //         const updatedRows = [...rows];
    //         updatedRows[rowIndex].thesisTitles = data;
    //         setRows(updatedRows);
    //     } catch (error) {
    //         console.error('Error fetching thesis titles:', error);
    //     }
    // };

    // const fetchThesisDetails = async (thesistitle, rowIndex) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/gc/thesisDetails/${thesistitle}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${Cookie.get('jwtoken')}`
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch thesis titles');
    //         }
    //         const data = await response.json();
    //         console.log('Thesis Details:', data);

    //         // Extract rollno and internals from thesisDetails
    //         const { rollno, internals } = data;

    //         // Update the corresponding row in the rows state
    //         setRows(prevRows => {
    //             const updatedRows = [...prevRows];
    //             updatedRows[rowIndex].thesisDetails = data;
    //             updatedRows[rowIndex].rollno = rollno;
    //             updatedRows[rowIndex].internals = internals;
    //             return updatedRows;
    //         });
    //     } catch (error) {
    //         console.error('Error fetching thesis titles:', error);
    //     }
    // };


    const addRow = () => {
        setRows(prevRows => {
            const newRow = { supervisor: '', thesistitle: '', timeslot: new Date(), evaluation: '' };
            const lastTimeslot = prevRows[prevRows.length - 1].timeslot;
            const nextTimeslot = new Date(lastTimeslot.getTime() + 30 * 60000); // Add 30 minutes
            newRow.timeslot = nextTimeslot;
            return [...prevRows, newRow];
        });
    };

    const removeRow = (indexToRemove) => {
        setRows(prevRows => prevRows.filter((row, index) => index !== indexToRemove));
    };

    const handleSupervisorChange = (selectedSupervisor, index) => {
        const supervisorName = selectedSupervisor.name;
        const updatedRows = [...rows];
        updatedRows[index].supervisor = supervisorName;
        updatedRows[index].thesistitle = ''; // Reset thesis title for the specific row
        setRows(updatedRows);
        // fetchThesisTitles(supervisorName, index); // Fetch thesis titles for the selected supervisor
    };

    // const handleThesisTitleChange = (selectedThesisTitle, index) => {
    //     const thesistitle = selectedThesisTitle.thesistitle; // Extract the thesis title
    //     const updatedRows = [...rows];
    //     updatedRows[index].thesistitle = thesistitle;
    //     setRows(updatedRows);
    //     setSelectedThesisTitle(thesistitle); // Update the selected thesis title
    //     checkDuplicateValues(updatedRows); // Call the function to check duplicates even if timeslots are different
    //     fetchThesisDetails(thesistitle, index); // Fetch thesis Details for the selected thesis title
    // };

    // const handleEvaluationChange = (selectedEvaluation, index) => {
    //     const evaluation = selectedEvaluation;
    //     const updatedRows = [...rows];
    //     updatedRows[index].evaluation = evaluation;
    //     setRows(updatedRows);
    // };

    // const checkDuplicateValues = (updatedRows) => {
    //     const uniqueSupervisors = new Set();
    //     const uniqueThesisTitles = new Set();
    //     updatedRows.forEach(row => {
    //         if (uniqueSupervisors.has(row.supervisor) && uniqueThesisTitles.has(row.thesistitle)) {
    //             console.error('Duplicate supervisor and thesis title found, removing row:', row);
    //             row.supervisor = ''; // Empty supervisor field
    //             row.thesistitle = ''; // Empty thesis title field
    //         } else {
    //             uniqueSupervisors.add(row.supervisor);
    //             uniqueThesisTitles.add(row.thesistitle);
    //         }
    //     });
    // };

    const handleTimeslotChange = (value, index) => {
        const updatedRows = [...rows];
        updatedRows[index].timeslot = value;
        setRows(updatedRows);
        validateTimeSlots(); // Validate timeslots after a change
    };

    const validateTimeSlots = () => {
        let conflictDetected = false;
        for (let i = 0; i < rows.length - 1; i++) {
            for (let j = i + 1; j < rows.length; j++) {
                const timeslot1 = new Date(rows[i].timeslot);
                const timeslot2 = new Date(rows[j].timeslot);
                const timeDifference = Math.abs(timeslot1 - timeslot2) / (1000 * 60); // difference in minutes
                if (timeDifference < 30) {
                    console.error('Conflicting timeslots detected.');
                    conflictDetected = true;
                    break; // Conflict found, exit inner loop
                }
            }
            if (conflictDetected) {
                break; // Exit outer loop
            }
        }
        if (conflictDetected) {
            // Allocate timeslots 30 minutes later to the previous timeslot for rows with conflicts
            setRows(prevRows => {
                const updatedRows = [...prevRows];
                for (let i = 1; i < updatedRows.length; i++) {
                    const prevTimeslot = new Date(updatedRows[i - 1].timeslot);
                    const newTimeslot = new Date(prevTimeslot.getTime() + 30 * 60000); // Add 30 minutes
                    updatedRows[i].timeslot = newTimeslot;
                }
                return updatedRows;
            });
            return false; // Conflict detected and resolved
        }
        return true; // No conflict
    };

    // const handleSubmit = async () => {
    //     console.log('rows : ', rows);

    //     // Prepare the data to send
    //     const dataToSend = rows.map(({ thesisDetails, timeslot, thesisTitles, supervisor, ...rest }) => ({
    //         ...rest,
    //         thesisid: thesisDetails.thesisid,
    //         rollno: thesisDetails.rollno,
    //         stdname: thesisDetails.stdname,
    //         supervisorname: thesisDetails.supervisorname,
    //         timeslot: timeslot.toISOString(), // Convert timeslot to ISO string format
    //     }));

    //     const formattedData = { panels: dataToSend };

    //     console.log('Data to send:', formattedData);

    //     try {
    //         const response = await fetch('http://localhost:5000/gc/panelTime', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${Cookie.get('jwtoken')}`
    //             },
    //             body: JSON.stringify(formattedData) // Send the panel data to the server
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to assign time slots');
    //         }
    //         const data = await response.json();
    //         console.log(data, "Time slots assigned successfully"); // Log the response from the server
    //         window.alert(data.message, "Time slots assigned successfully")
    //         // Handle the response as required
    //     } catch (error) {
    //         console.error('Error assigning time slots:', error);
    //         // Handle the error
    //     }
    // };



    return (
        <div className="m-2 p-2 grid grid-cols-1">
            <div className="flex justify-center">
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-950">
                    Schedule Panel Timelines
                </h2>
            </div>
            <div className="flex justify-end px-6">
                <button
                    // onClick={handleSubmit}
                    className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Assign Time Slots
                </button>
            </div>
            <div className="my-6 shadow-md sm:rounded-lg col-span-1">
                <table className="border-collapse w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-3 py-4 w-1/3">
                                Supervisor
                            </th>
                            <th scope="col" className="px-3 py-4 w-1/3">
                                Thesis Title
                            </th>
                            <th scope="col" className="px-3 py-4 w-1/3">
                                Timeslot
                            </th>
                            <th scope="col" className="px-3 py-4 w-1/3">
                                Evaluation
                            </th>
                            <th scope="col" className="px-3 py-4 w-1/3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-1/3 px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4">
                                    <Dropdown
                                        placeholder="Supervisor"
                                        value={row.supervisor ? (typeof row.supervisor === 'object' ? row.supervisor : supervisors.find(s => s.name === row.supervisor)) : null}
                                        options={supervisors}
                                        optionLabel="name"
                                        onChange={(e) => handleSupervisorChange(e.value, index)}
                                        className="max-w-full w-48 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </td>
                                <td className="w-1/3 px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4">
                                    <Dropdown
                                        placeholder="Title"
                                        value={row.thesistitle ? (typeof row.thesistitle === 'object' ? row.thesistitle : { thesistitle: row.thesistitle }) : null}
                                        options={row.thesisTitles || []}
                                        optionLabel="thesistitle"
                                        // onChange={(e) => handleThesisTitleChange(e.value, index)}
                                        className="max-w-full w-48 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </td>
                                <td className="w-1/3 px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4">
                                    <DateTimePicker
                                        onChange={(value) => handleTimeslotChange(value, index)}
                                        value={row.timeslot}
                                        className="max-w-full w-48 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                    {/* <div className='App'>
                                        <button onClick={() => setVisible(true)}>Show Popup</button>
                                        <Popup visible={visible} setVisible={setVisible}>
                                            <DatePicker lang="tr" selectedDay={day} setSelectedDay={setDay} timeSelector={true} />
                                        </Popup>
                                    </div> */}
                                </td>
                                <td className="w-1/3 px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4">
                                    <Dropdown
                                        placeholder="Evaluation"
                                        value={row.evaluation}
                                        options={evaluations}
                                        // onChange={(e) => handleEvaluationChange(e.value, index)}
                                        className="max-w-full w-48 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </td>
                                <td className="w-1/3 px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4">
                                    {rows.length > 1 && (
                                        <button
                                            onClick={() => removeRow(index)}
                                            className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            type="button"
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                            </svg>
                                        </button>

                                    )}
                                    {index === rows.length - 1 && (
                                        <button
                                            onClick={addRow}
                                            className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            type="button"
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}