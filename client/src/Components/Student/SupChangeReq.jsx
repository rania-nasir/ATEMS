import { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

export default function SupChangeReq() {
    const toastTopCenter = useRef(null);

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    const [supData, setSupData] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [ideaProposalBy, setIdeaProposalBy] = useState('Student');
    const [allowSameTopic, setAllowSameTopic] = useState(false);
    const [comments, setComments] = useState('');

    useEffect(() => {
        async function fetchSupData() {
            try {
                const response = await fetch('http://localhost:5000/std/viewSupervisorChangeForm', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setSupData(data.SupervisorList);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchSupData();
    }, []); // Empty dependency array to execute only once on component mount

    const handleChange = (e) => {
        setSelectedSupervisor(e.value);
    };

    const handleSubmit = async () => {
        // Check if any required field is empty
        if (!selectedSupervisor || !ideaProposalBy || !comments || !allowSameTopic) {
            showMessage('error', 'Please fill in all the required fields');
            // You can also set an error state to display a message to the user
            return;
        }
        setIdeaProposalBy('Student');

        try {
            const response = await fetch('http://localhost:5000/std/requestSupervisorChange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                },
                body: JSON.stringify({
                    ideaProposalBy,
                    allowSameTopic: "Allowed",
                    newSupervisorName: selectedSupervisor,
                    comments
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.message === "Request for Supervisor change successfully submitted") {
                    showMessage('success', data.message);
                }
                else if (data.message === "Your request has been sent already.") {
                    showMessage('info', data.message);
                }
                else {
                    showMessage('error', data.message);
                }
                // Handle success response
            } else {
                showMessage('error', "System Error! Please try later.");
                throw new Error('Failed to submit supervisor change request');
            }
        } catch (error) {
            showMessage('success', "System Error! Please try later.");
            console.error('Error submitting supervisor change request:', error);
            // Handle error
        }
    };

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className="sm:mx-auto w-full mt-12">
                <h2 className="pb-2 text-center text-2xl tracking-tight text-gray-900 font-semibold">
                    MS Thesis Supervisor Change Request
                </h2>
            </div>
            <div className="flex justify-center items-center mt-8">
                <form className="mx-6 px-8 w-full grid grid-cols-2">
                    <div className="mb-6 px-4 col-span-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supervisor">
                            Select Supervisor
                        </label>
                        <div className="relative">
                            <Dropdown
                                value={selectedSupervisor}
                                options={supData.map(supervisor => ({ label: supervisor.name, value: supervisor.name }))}
                                onChange={handleChange}
                                placeholder="Select Supervisor"
                                className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                        </div>
                    </div>
                    <div className="mb-6 px-4 col-span-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ideaProposalBy">
                            Idea Proposed By
                        </label>
                        <input
                            id="ideaproposedby"
                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            value={ideaProposalBy}
                        />
                    </div>

                    <div className="mb-6 col-span-2 px-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comments">
                            Comments
                        </label>
                        <textarea
                            id="comments"
                            className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </div>
                    <div className="mb-6 px-4 col-span-2">
                        <div class="flex items-center">
                            <input id="link-checkbox" type="checkbox" value=""
                                checked={allowSameTopic}
                                onChange={(e) => setAllowSameTopic(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="link-checkbox"
                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Allow Same Topic</label>
                        </div>
                    </div>
                    <div className="col-span-2 mx-4">
                        <button
                            className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Change Supervisor
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
