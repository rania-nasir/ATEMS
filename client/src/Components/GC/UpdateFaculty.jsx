import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "primereact/checkbox";
import Cookie from 'js-cookie';

// ... (your import statements)

function UpdateFaculty() {
    const { facultyid } = useParams();
    const navigate = useNavigate();

    const [FacultyData, setFacultyData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        role: [],
    });

    const categories = [
        { name: 'HOD', key: 'HOD' },
        { name: 'Supervisor', key: 'Supervisor' },
        { name: 'MSRC', key: 'MSRC' },
        { name: 'Internal', key: 'Internal' },
        // { name: 'External', key: 'External' },
    ];

    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        async function fetchFacultyData() {
            try {
                const response = await fetch(`http://localhost:5000/gc/viewFaculty/${facultyid}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFacultyData(data);
                    setFormData({
                        name: data.name,
                        email: data.email,
                        mobile: data.mobile,
                        role: data.role || [],
                    });
                    // Pre-fill the selected roles
                    setSelectedCategories(data.role || []);
                } else {
                    throw new Error('Failed to fetch Faculty data');
                }
            } catch (error) {
                console.error('Failed to retrieve Faculty data: ', error);
            }
        }

        fetchFacultyData();
    }, [facultyid]);

    console.log('Selected Categories: ', selectedCategories);

    const onCategoryChange = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setSelectedCategories([...selectedCategories, value]);
        } else {
            setSelectedCategories(selectedCategories.filter(category => category !== value));
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        // setFormData({ ...formData, role: selectedCategories });
        const updatedFormData = { ...formData, role: selectedCategories };


        try {
            const response = await fetch(`http://localhost:5000/gc/updateFaculty/${facultyid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log('Faculty data updated successfully: ', updatedData);
                window.alert('Faculty data updated successfully');
                navigate('/viewFaculty');
            } else {
                const errorMessage = await response.text();
                console.error('Error updating Faculty data:', errorMessage);
                window.alert('Error updating faculty data: ' + errorMessage);
            }
        } catch (error) {
            console.error('Failed to update Faculty data: ', error);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
            >
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl tracking-tight text-gray-950 font-bold">
                        Update Faculty
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto">

                    <form class="sm:mx-auto">
                        <div className='w-64 mx-4'>
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                for="grid-first-name">
                                Faculty ID
                            </label>
                            <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-first-name" type="text" placeholder="20F-1234"
                                value={facultyid}
                                readOnly
                            />

                        </div>
                        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <div className='grid grid-cols-3'>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Name
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="Muhammad Ahmad"
                                        name='name'
                                        value={formData.name}
                                        onChange={(e) => handleInputChange(e)} />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Email
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="abc@gmail.com"
                                        name='email'
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(e)} />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Mobile
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="12345678901"
                                        name='mobile'
                                        value={formData.mobile}
                                        onChange={(e) => handleInputChange(e)} />

                                </div>
                            </div>
                            <div className='col-span-3 p-2'>
                                <div className='px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Role
                                    </label>
                                    <div
                                        className="card flex justify-content-center bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 items-center">
                                        <div className="flex flex-column gap-3">
                                            {categories.map((category) => {
                                                return (
                                                    <div key={category.key} className="flex align-items-center mr-4">
                                                        <Checkbox
                                                            inputId={category.key}
                                                            name="category"
                                                            value={category.key}
                                                            onChange={onCategoryChange}
                                                            checked={selectedCategories.includes(category.key)}
                                                        />
                                                        <label htmlFor={category.key} className="ml-2">
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="my-4 px-4">
                            <button class="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                                onClick={handleUpdate}
                            >
                                Update Faculty
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default UpdateFaculty;