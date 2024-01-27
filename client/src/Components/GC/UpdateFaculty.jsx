import React, { useState, useEffect } from 'react'
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import Cookies from 'js-cookie';

function UpdateFaculty() {


    const userId = Cookies.get('userId');
    console.log('userID = ', userId);

    const [facultyData, setfacultyData] = useState([]);

    useEffect(() => {
        async function fetchfacultyData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setfacultyData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchfacultyData();
    }, [userId]);

    console.log('facultyData = ', facultyData);

    // const [selectedgender, setSelectedgender] = useState(null);

    // const [selectedrole, setSelectedrole] = useState(null);
    // const role = ['Supervisor', 'MSRC', 'Internal'];

    // const [user, setuser] = useState({
    //     facultyid: facultyData.facultyid,
    //     name: facultyData.name,
    //     email: facultyData.email,
    //     gender: facultyData.gender,
    //     mobile: facultyData.mobile,
    //     role: selectedrole
    // })

    // console.log('user = ', user);

    // const handleInputs = (e) => {
    //     const { name, value } = e.target
    //     setuser({ ...user, [name]: value })
    // }

    // const PostData = async (e) => {
    //     e.preventDefault();

    //     const { facultyid, name, email, mobile, password } = user;

    //     const facultyData = {
    //         facultyid, name, email, gender: selectedgender, mobile, role: selectedrole, password
    //     }

    //     try {
    //         const response = await fetch(`http://localhost:5000/updateFaculty/${userId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${Cookies.get('jwtoken')}`
    //             },
    //             body: JSON.stringify(facultyData),
    //         });

    //         if (response.ok) {
    //             const result = await response.json();
    //             console.log('Update successful:', result);
    //         } else {
    //             const errorMessage = await response.text();
    //             console.error('Update failed:', errorMessage);
    //         }
    //     } catch (error) {
    //         console.error('Error updating faculty:', error);
    //     }
    // };

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
                                id="grid-first-name" type="text" placeholder="1234"
                                // onChange={handleInputs}
                                value={facultyData.facultyid}
                            // value={user.facultyid}
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
                                        // onChange={handleInputs}
                                        // value={user.name} 
                                        value={facultyData.name}
                                    />

                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Email
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="abc@gmail.com"
                                        // onChange={handleInputs}
                                        // value={user.email} 
                                        value={facultyData.email}
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Mobile
                                    </label>
                                    <input class="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-first-name" type="text" placeholder="12345678901"
                                        // onChange={handleInputs}
                                        // value={user.mobile}
                                        value={facultyData.mobile}
                                    />
                                </div>
                            </div>
                            <div className='col-span-1 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Select Gender
                                    </label>
                                    <Dropdown
                                        // options={[
                                        //     { label: 'Male', value: 'M' },
                                        //     { label: 'Female', value: 'F' }
                                        // ]}
                                        value={facultyData.gender}
                                        // value={selectedgender}
                                        // onChange={(e) => setSelectedgender(e.value)}
                                        className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                                </div>
                            </div>
                            <div className='col-span-2 p-2'>
                                <div className='w-full px-3'>
                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                        Select Role
                                    </label>
                                    <MultiSelect
                                        value={facultyData.role}
                                        // value={selectedrole}
                                        // onChange={(e) => setSelectedrole(e.value)}
                                        // options={role}
                                        className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                                </div>
                            </div>
                        </div>
                        <div class="my-4 px-4">
                            <button class="block flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                type="button"
                            // onClick={PostData}
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

export default UpdateFaculty