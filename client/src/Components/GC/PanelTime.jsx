import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import Cookie from 'js-cookie';

export default function PanelTime() {
    const [rows, setRows] = useState([{ supervisor: '', thesisTitle: '', timeslot: null }]);
    const [supervisors, setSupervisors] = useState([]);
    const [thesisTitles, setThesisTitles] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [selectedThesisTitle, setSelectedThesisTitle] = useState('');

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
            } catch (error) {
                console.error('Error fetching supervisors:', error);
            }
        }

        fetchSupervisors();
    }, []);

    const fetchThesisTitles = async (supervisorName) => {
        try {
            const response = await fetch(`http://localhost:5000/gc/allThesisofSupervisor/${supervisorName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch thesis titles');
            }
            const data = await response.json();
            setThesisTitles(data);
        } catch (error) {
            console.error('Error fetching thesis titles:', error);
        }
    };

    const addRow = () => {
        setRows([...rows, { supervisor: '', thesisTitle: '', timeslot: null }]);
    };

    const removeRow = (indexToRemove) => {
        setRows(rows.filter((row, index) => index !== indexToRemove));
    };

    const handleSupervisorChange = (selectedSupervisor, index) => {
        const supervisorName = selectedSupervisor.name;
        const updatedRows = [...rows];
        updatedRows[index].supervisor = supervisorName;
        updatedRows[index].thesisTitle = '';
        setRows(updatedRows);
        setSelectedSupervisor(supervisorName);
        fetchThesisTitles(supervisorName);
    };

    const handleThesisTitleChange = (selectedThesisTitle, index) => {
        const thesisTitle = selectedThesisTitle.thesistitle; // Extract the thesis title
        const updatedRows = [...rows];
        updatedRows[index].thesisTitle = thesisTitle;
        setRows(updatedRows);
        setSelectedThesisTitle(thesisTitle); // Update the selected thesis title
    };

    const handleTimeslotChange = (value, index) => {
        const updatedRows = [...rows];
        updatedRows[index].timeslot = value;
        setRows(updatedRows);
    };

    const handleSubmit = async () => {
        console.log('rows : ', rows);
        try {
            const response = await fetch('http://localhost:5000/gc/panelTime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                },
                body: JSON.stringify({ panels: rows }) // Send the panel data to the server
            });
            if (!response.ok) {
                throw new Error('Failed to assign time slots');
            }
            const data = await response.json();
            console.log(data); // Log the response from the server
            // Handle the response as required
        } catch (error) {
            console.error('Error assigning time slots:', error);
            // Handle the error
        }
    };

    return (
        <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-950">
                    Schedule Panel Timelines
                </h2>
            </div>
            <div className="m-6 shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Supervisor
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thesis Title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Timeslot
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Dropdown
                                        placeholder="Select Supervisor"
                                        value={row.supervisor ? (typeof row.supervisor === 'object' ? row.supervisor : supervisors.find(s => s.name === row.supervisor)) : null}
                                        options={supervisors}
                                        optionLabel="name"
                                        onChange={(e) => handleSupervisorChange(e.value, index)}
                                        className="w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Dropdown
                                        placeholder="Select Thesis Title"
                                        value={row.thesisTitle ? (typeof row.thesisTitle === 'object' ? row.thesisTitle : thesisTitles.find(t => t.thesistitle === row.thesisTitle)) : null}
                                        options={thesisTitles}
                                        optionLabel="thesistitle"
                                        onChange={(e) => handleThesisTitleChange(e.value, index)}
                                        className="w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Calendar
                                        placeholder="Select Timeslot"
                                        value={row.timeslot}
                                        onChange={(e) => handleTimeslotChange(e.value, index)}
                                        className="w-full text-gray-900 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        style={{ height: "44px", padding: "4px" }}
                                        showTime
                                        hourFormat="12"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Assign Time Slots
                    </button>
                </div>
            </div>
        </div>
    );
}
