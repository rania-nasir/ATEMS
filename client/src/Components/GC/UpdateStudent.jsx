import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

function UpdateStudent() {
    const toastTopCenter = useRef(null);
    const { rollno } = useParams();

    const navigate = useNavigate();

    const [studentData, setStudentData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        batch: '',
        semester: '',
        program: '',
        cgpa: '',
        mobile: '',
        credithours: '',
    });

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, life: 3000 });
    };


    useEffect(() => {
        async function fetchStudentData() {
            try {
                const response = await fetch(`http://localhost:5000/gc/viewStudent/${rollno}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudentData(data);
                    // console.log(data);
                    // Pre-fill form data
                    setFormData({
                        name: data.name,
                        email: data.email,
                        batch: data.batch,
                        semester: data.semester,
                        program: data.program,
                        cgpa: data.cgpa,
                        mobile: data.mobile,
                        credithours: data.credithours
                    });
                    console.log(formData);
                } else {
                    throw new Error('Failed to fetch student data');
                }
            } catch (error) {
                console.error('Failed to retrieve student data: ', error);
            }
        }

        fetchStudentData();
    }, [rollno]); // Update the dependency to 'rollno' directly

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gc/updateStudent/${rollno}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Student data updated successfully: ', data.message);
                showMessage('success', data.message);
                setTimeout(() => {
                   navigate('/viewStudent'); // Navigate to '/viewStudent' after 3 seconds
                }, 3000); // Delay for 3 seconds (3000 milliseconds)
                // Handle success, e.g., show a success message, redirect, etc.
            } else {
                console.error('Error updating student data:', data);
                // Handle error, e.g., show an error message to the user
                showMessage('error', data.message);
            }
        } catch (error) {
            console.error('Failed to update student data: ', error);
        }
    };


    return (
        <>
        <Toast ref={toastTopCenter} position="top-center" />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
            >
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Update Student
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto">

                    <form className="sm:mx-auto">
                        <div className='w-64 mx-4'>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                for="grid-first-name">
                                Roll Number
                            </label>
                            <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-first-name" type="text" placeholder="20F-1234"
                                value={rollno}
                                readOnly
                            />

                        </div>
                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <div className='grid grid-cols-3'>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad"
                                        name='name'
                                        value={formData.name}
                                        onChange={(e) => handleInputChange(e, 'name')} />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Email
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="abc@gmail.com"
                                        name='email'
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(e)} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Mobile
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="12345678901"
                                        name='mobile'
                                        value={formData.mobile}
                                        onChange={(e) => handleInputChange(e)} />

                                </div>
                            </div>

                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        CGPA
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="3.16"
                                        name='cgpa'
                                        value={formData.cgpa}
                                        onChange={(e) => handleInputChange(e)}
                                    />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Credit Hours
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="100"
                                        name='credithours'
                                        value={formData.credithours}
                                        onChange={(e) => handleInputChange(e)}
                                    />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Program Name
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="CS"
                                        name='program'
                                        value={formData.program}
                                        onChange={(e) => handleInputChange(e)}
                                    />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Batch
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="20"
                                        name='batch'
                                        value={formData.batch}
                                        onChange={(e) => handleInputChange(e)}
                                    />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Semester
                                    </label>
                                    <input className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="8"
                                        name='semester'
                                        value={formData.semester}
                                        onChange={(e) => handleInputChange(e)}
                                    />

                                </div>
                            </div>

                        </div>

                        <div className="my-4 px-4">
                            <button className="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                                onClick={handleUpdate}
                            >
                                Update Student
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default UpdateStudent