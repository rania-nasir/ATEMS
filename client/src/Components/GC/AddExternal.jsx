import React, { useEffect, useState, useRef } from 'react';
import Cookie from 'js-cookie';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

function AddExternal() {
    const toastTopCenter = useRef(null);

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };

    const [thesisTitles, setThesisTitles] = useState([]);
    const [selectedThesisTitle, setSelectedThesisTitle] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        mobile: ''
    });
    const [selectedGender, setSelectedGender] = useState('');

    useEffect(() => {
        async function fetchThesisTitles() {
            try {
                const response = await fetch('http://localhost:5000/gc/getAllReadyThesis', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setThesisTitles(data.map(thesis => ({ label: thesis.thesistitle, value: thesis.thesistitle })));
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchThesisTitles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGenderChange = (e) => {
        setSelectedGender(e.value);
        setFormData({ ...formData, gender: e.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any required field is empty
        if ( !formData.gender ) {
            showMessage('error', 'Please fill in all the required fields');
            // You can also set an error state to display a message to the user
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/gc/addExternal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`
                },
                body: JSON.stringify({ ...formData, thesistitle: selectedThesisTitle })
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                if (data.message === "External has been added successfully") {
                    showMessage('success', data.message);
                }
                else {
                    showMessage('info', data.message);
                }
                // Handle success message or redirect to another page
            } else {
                showMessage('error', data.message);
                throw new Error('Failed to assign external to thesis');
            }
        } catch (error) {
            showMessage('success', "System Error! Please try later.");
            console.error('Error assigning external to thesis:', error);
        }
    };

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />
            <div className='flex flex-col justify-center px-10 my-10 items-center'>
                <div className="w-full my-8">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Add External for the Final Evaluation
                    </h2>
                </div>
                <div className="flex justify-center items-center w-[70%]">
                    <form className="w-full" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className='grid grid-cols-2 gap-0'>
                            <div className='w-full px-3 py-2'>
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Enter External Name
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="External Name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='w-full px-3 py-2'>
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Enter External Email
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    required
                                    type="text"
                                    name="email"
                                    placeholder="external@gmail.com"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='w-full px-3 py-2'>
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Enter Mobile Number
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    required
                                    type="text"
                                    name="mobile"
                                    placeholder="00000000000"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='w-full px-3 py-2'>
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Enter External Gender
                                </label>
                                <Dropdown
                                    placeholder="Select gender"
                                    options={genderOptions}
                                    value={selectedGender}
                                    className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={handleGenderChange}
                                />
                            </div>
                        </div>
                        <div className="mb-6 px-4 py-2 col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thesisTitle">
                                Select Thesis Title
                            </label>
                            <div className="relative">
                                <Dropdown
                                    value={selectedThesisTitle}
                                    options={thesisTitles}
                                    onChange={(e) => setSelectedThesisTitle(e.value)}
                                    placeholder="Select Thesis Title"
                                    className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            </div>
                        </div>
                        <button
                            className="block mx-4 my-8 w-[25%] h-12 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                            type="submit"
                        >
                            Add External
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddExternal;
